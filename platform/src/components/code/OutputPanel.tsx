import type { RunResult } from "@/lib/python/runner";

interface OutputPanelProps {
  result: RunResult | null;
  isLoading: boolean;
  isRunning: boolean;
  /** Shown before the first run so the panel is never an unexplained void. */
  idleHint?: string;
}

/**
 * Program output.
 *
 * Distinguishes four states a beginner genuinely confuses: Python still
 * loading, program running, program finished with no output, and program
 * stopped with an error. "Nothing happened" is the most common and most
 * demoralising, so it gets an explicit message rather than a blank box.
 */
export function OutputPanel({
  result,
  isLoading,
  isRunning,
  idleHint = "Run the code to see its output.",
}: OutputPanelProps) {
  const base =
    "rounded-control border px-3 py-2.5 font-mono text-[13px] leading-relaxed whitespace-pre-wrap break-words";

  if (isLoading) {
    return (
      <div className={`${base} border-line bg-surface text-ink-muted`}>
        Starting Python. The first run downloads it, which takes a few seconds.
      </div>
    );
  }

  if (isRunning) {
    return (
      <div className={`${base} border-line bg-surface text-ink-muted`}>
        Running
      </div>
    );
  }

  if (!result) {
    return (
      <div className={`${base} border-line border-dashed bg-surface text-ink-faint`}>
        {idleHint}
      </div>
    );
  }

  if (result.timedOut) {
    return (
      <div className={`${base} border-danger/30 bg-danger-soft text-ink`}>
        <span className="font-sans font-medium text-danger">Stopped</span>
        {"\n"}
        {result.error}
      </div>
    );
  }

  if (!result.ok) {
    return (
      <div className={`${base} border-danger/30 bg-danger-soft text-ink`}>
        {result.stdout && (
          <>
            {result.stdout.replace(/\n$/, "")}
            {"\n"}
          </>
        )}
        <span className="text-danger">{result.error}</span>
      </div>
    );
  }

  const output = result.stdout.replace(/\n$/, "");

  if (output === "") {
    return (
      <div className={`${base} border-line bg-surface text-ink-faint`}>
        Finished without printing anything. Use{" "}
        <span className="text-ink-muted">print()</span> to display a value.
      </div>
    );
  }

  return (
    <div className={`${base} border-line bg-surface text-ink`}>
      {output}
      {result.truncated && (
        <span className="mt-2 block font-sans text-xs text-warning">
          Output was cut off here. The program printed more than this panel
          will hold, which usually means a loop is running far more times than
          intended.
        </span>
      )}
    </div>
  );
}
