"use client";

import { useEffect, useState } from "react";
import { CodeEditor } from "@/components/code/CodeEditor";
import { OutputPanel } from "@/components/code/OutputPanel";
import { Button } from "@/components/ui/Button";
import { usePython } from "@/lib/python/usePython";
import type { RunResult } from "@/lib/python/runner";

interface RunnableExampleProps {
  code: string;
  caption?: string;
  /** Worked examples are editable by default; pin the canonical form with false. */
  editable?: boolean;
}

/**
 * A worked example the student can run, and usually change.
 *
 * Letting them edit matters: the fastest way to understand what a line does is
 * to break it deliberately and see what happens.
 */
export function RunnableExample({
  code,
  caption,
  editable = true,
}: RunnableExampleProps) {
  const { run, warmUp, isLoading, isRunning } = usePython();
  const [source, setSource] = useState(code);
  const [result, setResult] = useState<RunResult | null>(null);

  // Start fetching Python as soon as runnable code is on screen, so the first
  // Run click does not sit waiting on a multi-second download.
  useEffect(() => {
    warmUp();
  }, [warmUp]);

  const dirty = source !== code;

  async function handleRun() {
    setResult(await run(source));
  }

  return (
    <figure className="my-6">
      {caption && (
        <figcaption className="mb-2 font-sans text-xs font-medium tracking-wide text-ink-faint uppercase">
          {caption}
        </figcaption>
      )}

      <div className="overflow-hidden rounded-card border border-line">
        <CodeEditor
          value={source}
          onChange={editable ? setSource : undefined}
          readOnly={!editable}
          ariaLabel={caption ? `Example: ${caption}` : "Example code"}
        />
        <div className="flex items-center gap-2 border-t border-line bg-surface px-3 py-2">
          <Button
            variant="primary"
            onClick={handleRun}
            disabled={isRunning || isLoading}
          >
            {isRunning ? "Running" : "Run"}
          </Button>
          {dirty && (
            <Button
              variant="quiet"
              onClick={() => {
                setSource(code);
                setResult(null);
              }}
            >
              Reset
            </Button>
          )}
          {editable && !dirty && (
            <span className="font-sans text-xs text-ink-faint">
              You can edit this and run it again.
            </span>
          )}
        </div>
      </div>

      <div className="mt-2">
        <OutputPanel
          result={result}
          isLoading={isLoading}
          isRunning={isRunning}
        />
      </div>
    </figure>
  );
}
