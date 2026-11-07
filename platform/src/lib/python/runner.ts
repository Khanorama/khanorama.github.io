/**
 * Main-thread driver for the Python worker.
 *
 * Owns worker lifecycle, serialises requests, and enforces the execution
 * timeout. Because Python in the worker cannot be interrupted once it is
 * spinning (see the note in pyodide-worker.js), a timeout is handled by
 * destroying the worker outright and starting a clean one.
 */

export interface RunResult {
  ok: boolean;
  stdout: string;
  stderr: string;
  error: string | null;
  errorType: string | null;
  /** True when the run was killed for exceeding the time limit. */
  timedOut: boolean;
  /** True when output hit the capture ceiling and was cut short. */
  truncated?: boolean;
}

export interface Analysis {
  syntaxError: string | null;
  /** Call counts by function name, including method names. */
  callCounts: Record<string, number>;
  assignedNames: string[];
  /** Count of distinct names assigned. */
  assignCount: number;
  /** AST operator class names, e.g. "Add", "Lt", "Eq". */
  operators: string[];
  imports: string[];
}

export type RunnerStatus = "idle" | "loading" | "ready" | "running";

const WORKER_URL = "/pyodide-worker.js";
const DEFAULT_TIMEOUT_MS = 10_000;

interface Pending {
  resolve: (value: never) => void;
  reject: (reason: Error) => void;
  timer: ReturnType<typeof setTimeout>;
}

export class PythonRunner {
  private worker: Worker | null = null;
  private pending = new Map<number, Pending>();
  private nextId = 1;
  private status: RunnerStatus = "idle";
  private listeners = new Set<(status: RunnerStatus) => void>();
  /** Serialises work; Pyodide holds one interpreter, so runs cannot overlap. */
  private queue: Promise<unknown> = Promise.resolve();

  onStatusChange(listener: (status: RunnerStatus) => void): () => void {
    this.listeners.add(listener);
    listener(this.status);
    return () => this.listeners.delete(listener);
  }

  getStatus(): RunnerStatus {
    return this.status;
  }

  private setStatus(status: RunnerStatus) {
    if (this.status === status) return;
    this.status = status;
    for (const listener of this.listeners) listener(status);
  }

  private ensureWorker(): Worker {
    if (this.worker) return this.worker;

    // Module worker: Pyodide is loaded with a static import of the
    // self-hosted pyodide.mjs rather than importScripts from a CDN.
    const worker = new Worker(WORKER_URL, { type: "module" });
    worker.onmessage = (event: MessageEvent) => {
      const data = event.data || {};
      if (data.type === "ready") {
        this.setStatus("ready");
        return;
      }
      const entry = this.pending.get(data.id);
      if (!entry) return;
      clearTimeout(entry.timer);
      this.pending.delete(data.id);
      (entry.resolve as (v: unknown) => void)(data);
    };
    worker.onerror = (event) => {
      this.failAll(new Error(event.message || "Python worker crashed"));
    };

    this.worker = worker;
    return worker;
  }

  /** Destroys the worker and fails anything in flight. */
  private teardown(reason: Error) {
    this.worker?.terminate();
    this.worker = null;
    this.failAll(reason);
    this.setStatus("idle");
  }

  private failAll(reason: Error) {
    for (const [, entry] of this.pending) {
      clearTimeout(entry.timer);
      entry.reject(reason);
    }
    this.pending.clear();
  }

  /**
   * Starts downloading and initialising Python ahead of first use. Worth
   * calling as soon as a lesson with code opens, since the first load is
   * several seconds and would otherwise land on the first Run click.
   */
  warmUp(): void {
    if (this.worker) return;
    this.setStatus("loading");
    this.ensureWorker().postMessage({ type: "init" });
  }

  private request<T>(
    message: Record<string, unknown>,
    timeoutMs: number,
    onTimeout: () => T,
  ): Promise<T> {
    const run = async (): Promise<T> => {
      const worker = this.ensureWorker();
      if (this.status === "idle") this.setStatus("loading");
      const id = this.nextId++;

      return new Promise<T>((resolve, reject) => {
        const timer = setTimeout(() => {
          // Claim this request before tearing down. teardown() rejects
          // everything still pending, which would otherwise reject the very
          // promise we are about to resolve with the timeout result, leaving
          // the caller with an unhandled rejection and no result.
          this.pending.delete(id);
          // Cannot interrupt a spinning interpreter; replace it instead.
          this.teardown(new Error("Python was restarted after a timeout."));
          resolve(onTimeout());
        }, timeoutMs);

        this.pending.set(id, {
          resolve: resolve as (value: never) => void,
          reject,
          timer,
        });
        worker.postMessage({ ...message, id });
      });
    };

    // Chain onto the queue so two runs never share one interpreter.
    const result = this.queue.then(run, run);
    this.queue = result.catch(() => undefined);
    return result as Promise<T>;
  }

  async run(
    code: string,
    options: { stdin?: string[]; timeoutMs?: number } = {},
  ): Promise<RunResult> {
    const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.setStatus("running");
    try {
      const result = await this.request<RunResult>(
        { type: "run", code, stdin: options.stdin ?? [] },
        timeoutMs,
        () => ({
          ok: false,
          stdout: "",
          stderr: "",
          error:
            `Your program ran for more than ${Math.round(timeoutMs / 1000)} ` +
            `seconds and was stopped. This usually means a loop never reaches ` +
            `its stopping condition.`,
          errorType: "Timeout",
          timedOut: true,
        }),
      );
      return { ...result, timedOut: result.timedOut ?? false };
    } finally {
      if (this.status === "running") {
        this.setStatus(this.worker ? "ready" : "idle");
      }
    }
  }

  async analyze(code: string): Promise<Analysis> {
    return this.request<Analysis>({ type: "analyze", code }, DEFAULT_TIMEOUT_MS, () => ({
      syntaxError: "Analysis timed out.",
      callCounts: {},
      assignedNames: [],
      assignCount: 0,
      operators: [],
      imports: [],
    }));
  }

  dispose() {
    this.teardown(new Error("Runner disposed"));
    this.listeners.clear();
  }
}

let shared: PythonRunner | null = null;

/** One interpreter per tab, shared across lessons so it loads only once. */
export function getRunner(): PythonRunner {
  if (!shared) shared = new PythonRunner();
  return shared;
}
