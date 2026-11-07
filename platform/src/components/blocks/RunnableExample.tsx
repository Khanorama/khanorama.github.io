"use client";

import { useEffect, useState } from "react";
import { CodeEditor } from "@/components/code/CodeEditor";
import { OutputPanel } from "@/components/code/OutputPanel";
import { Button } from "@/components/ui/Button";
import { usePython } from "@/lib/python/usePython";
import type { RunResult } from "@/lib/python/runner";

type Tone = "default" | "warning";

interface RunnableExampleProps {
  code: string;
  caption?: string;
  /** Worked examples are editable by default; pin the canonical form with false. */
  editable?: boolean;
  /** "warning" marks code that is supposed to fail. */
  tone?: Tone;
  /** Lines fed to input(), for lessons that read from the user. */
  stdin?: string[];
}

const TONES: Record<Tone, { frame: string; caption: string; bar: string }> = {
  default: {
    frame: "border-line",
    caption: "text-accent",
    bar: "border-line bg-surface",
  },
  warning: {
    frame: "border-warning-line",
    caption: "text-warning",
    bar: "border-warning-line bg-warning-soft",
  },
};

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
  tone = "default",
  stdin,
}: RunnableExampleProps) {
  const { run, warmUp, isLoading, isRunning } = usePython();
  const [source, setSource] = useState(code);
  const [result, setResult] = useState<RunResult | null>(null);

  // Start fetching Python as soon as runnable code is on screen, so the first
  // Run click does not sit waiting on a multi-second download.
  useEffect(() => {
    warmUp();
  }, [warmUp]);

  const styles = TONES[tone];
  const dirty = source !== code;

  async function handleRun() {
    setResult(await run(source, { stdin }));
  }

  return (
    <figure className="my-7">
      {caption && (
        <figcaption
          className={`mb-2 font-sans text-xs font-semibold tracking-wide uppercase ${styles.caption}`}
        >
          {caption}
        </figcaption>
      )}

      <div
        className={`overflow-hidden rounded-card border bg-paper ${styles.frame}`}
      >
        <CodeEditor
          value={source}
          onChange={editable ? setSource : undefined}
          readOnly={!editable}
          ariaLabel={caption ? `Example: ${caption}` : "Example code"}
        />
        <div
          className={`flex items-center gap-2 border-t px-3 py-2 ${styles.bar}`}
        >
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
