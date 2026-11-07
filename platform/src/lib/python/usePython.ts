"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getRunner,
  type Analysis,
  type RunResult,
  type RunnerStatus,
} from "@/lib/python/runner";

/**
 * React access to the shared Python interpreter.
 *
 * The interpreter is shared across the whole tab, so the multi-second first
 * load is paid once per visit rather than once per lesson block.
 */
export function usePython() {
  const runner = useMemo(() => getRunner(), []);
  const [status, setStatus] = useState<RunnerStatus>(() => runner.getStatus());

  useEffect(() => {
    const unsubscribe = runner.onStatusChange(setStatus);
    return () => {
      unsubscribe();
    };
  }, [runner]);

  const warmUp = useCallback(() => {
    runner.warmUp();
  }, [runner]);

  const run = useCallback(
    (code: string, options?: { stdin?: string[]; timeoutMs?: number }): Promise<RunResult> =>
      runner.run(code, options),
    [runner],
  );

  const analyze = useCallback(
    (code: string): Promise<Analysis> => runner.analyze(code),
    [runner],
  );

  return {
    status,
    /** True before the interpreter has finished downloading. */
    isLoading: status === "loading",
    isRunning: status === "running",
    warmUp,
    run,
    analyze,
  };
}
