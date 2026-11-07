"use client";

import { useEffect, useState, type ReactNode } from "react";
import { CodeEditor } from "@/components/code/CodeEditor";
import { OutputPanel } from "@/components/code/OutputPanel";
import { Button } from "@/components/ui/Button";
import { usePython } from "@/lib/python/usePython";
import { recordBlockResult } from "@/lib/progress/localProgress";
import { normalizeOutput } from "@/lib/grading";
import type { RunResult } from "@/lib/python/runner";

interface PredictBlockProps {
  prompt: ReactNode;
  code: string;
  choices?: string[];
  answer: string;
  explanation: ReactNode;
  lessonId: string;
  blockId: string;
}

/**
 * "What do you think this will output?"
 *
 * The student must commit to an answer before the code will run. That
 * commitment is the whole value: predicting and being wrong is what exposes a
 * wrong mental model, whereas running first and reading the output teaches
 * almost nothing.
 *
 * Being wrong still counts as done. The block records completion either way,
 * because penalising an honest guess would just train students to peek.
 */
export function PredictBlock({
  prompt,
  code,
  choices,
  answer,
  explanation,
  lessonId,
  blockId,
}: PredictBlockProps) {
  const { run, warmUp, isLoading, isRunning } = usePython();
  const [guess, setGuess] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);

  useEffect(() => {
    warmUp();
  }, [warmUp]);

  const correct =
    revealed && normalizeOutput(guess).trim() === normalizeOutput(answer).trim();

  async function reveal() {
    setRevealed(true);
    setResult(await run(code));
    recordBlockResult(lessonId, blockId, true, guess);
  }

  return (
    <section className="my-8 overflow-hidden rounded-card border border-line bg-paper">
      <header className="border-b border-line bg-surface-raised px-4 py-2.5">
        <span className="font-sans text-xs font-semibold tracking-wide uppercase text-ink-muted">
          Predict the output
        </span>
      </header>

      <div className="px-4 pt-4">{prompt}</div>

      <div className="px-4 pt-3">
        <div className="overflow-hidden rounded-control border border-line">
          <CodeEditor value={code} readOnly ariaLabel="Code to predict" />
        </div>
      </div>

      <div className="px-4 py-3">
        {choices ? (
          <div className="flex flex-wrap gap-2">
            {choices.map((choice) => (
              <button
                key={choice}
                type="button"
                disabled={revealed}
                onClick={() => setGuess(choice)}
                className={[
                  "rounded-control border px-3 py-1.5 font-mono text-sm transition-colors",
                  guess === choice
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-line text-ink hover:bg-surface",
                  revealed && "cursor-not-allowed",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {choice}
              </button>
            ))}
          </div>
        ) : (
          <label className="block">
            <span className="sr-only">Your prediction</span>
            <input
              value={guess}
              onChange={(event) => setGuess(event.target.value)}
              disabled={revealed}
              placeholder="Type what you think it prints"
              className="w-full rounded-control border border-line bg-paper px-3 py-2 font-mono text-sm text-ink placeholder:text-ink-faint disabled:text-ink-muted"
            />
          </label>
        )}

        {!revealed && (
          <Button
            variant="primary"
            className="mt-3"
            onClick={reveal}
            disabled={guess.trim() === "" || isRunning || isLoading}
          >
            Lock in and run
          </Button>
        )}
      </div>

      {revealed && (
        <>
          <div className="px-4 pb-3">
            <OutputPanel
              result={result}
              isLoading={isLoading}
              isRunning={isRunning}
            />
          </div>
          <div
            className={[
              "border-t px-4 py-3",
              correct
                ? "border-success-line bg-success-soft"
                : "border-warning-line bg-warning-soft",
            ].join(" ")}
          >
            <p
              className={[
                "font-sans text-xs font-semibold tracking-wide uppercase",
                correct ? "text-success" : "text-warning",
              ].join(" ")}
            >
              {correct ? "You called it" : `You said ${guess.trim()}`}
            </p>
            <div className="mt-1">{explanation}</div>
          </div>
        </>
      )}
    </section>
  );
}
