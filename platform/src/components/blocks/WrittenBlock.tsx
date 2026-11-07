"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { recordBlockResult } from "@/lib/progress/localProgress";

interface WrittenBlockProps {
  prompt: ReactNode;
  modelAnswer: ReactNode;
  lessonId: string;
  blockId: string;
}

/**
 * A written answer, self-assessed.
 *
 * Explaining a concept in your own words is a real check of understanding and
 * the curriculum asks for it, but no auto-grader here can judge prose
 * honestly. Rather than fake a score, the student writes first, compares
 * against a model answer, and marks themselves.
 *
 * The answer stays locked until they have written something. Reading the model
 * answer before attempting one is the single way to get nothing out of this.
 */
export function WrittenBlock({
  prompt,
  modelAnswer,
  lessonId,
  blockId,
}: WrittenBlockProps) {
  const [text, setText] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [marked, setMarked] = useState<null | boolean>(null);

  const enoughWritten = text.trim().split(/\s+/).filter(Boolean).length >= 10;

  function mark(gotIt: boolean) {
    setMarked(gotIt);
    recordBlockResult(lessonId, blockId, true, text);
  }

  return (
    <section
      className={[
        "my-8 overflow-hidden rounded-card border bg-paper",
        marked !== null ? "border-success-line" : "border-line",
      ].join(" ")}
    >
      <header
        className={[
          "border-b px-4 py-2.5",
          marked !== null
            ? "border-success-line bg-success-soft"
            : "border-line bg-surface-raised",
        ].join(" ")}
      >
        <span
          className={[
            "font-sans text-xs font-semibold tracking-wide uppercase",
            marked !== null ? "text-success" : "text-ink-muted",
          ].join(" ")}
        >
          Write your answer
        </span>
      </header>

      <div className="px-4 pt-4">{prompt}</div>

      <div className="px-4 py-3">
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={4}
          placeholder="Answer in your own words, two or three sentences."
          className="w-full resize-y rounded-control border border-line bg-paper px-3 py-2 font-reading text-reading text-ink placeholder:font-sans placeholder:text-sm placeholder:text-ink-faint"
        />

        {!revealed && (
          <div className="mt-2 flex items-center gap-3">
            <Button
              variant="primary"
              onClick={() => setRevealed(true)}
              disabled={!enoughWritten}
            >
              Compare with a model answer
            </Button>
            {!enoughWritten && (
              <span className="font-sans text-xs text-ink-faint">
                Write a couple of sentences first.
              </span>
            )}
          </div>
        )}
      </div>

      {revealed && (
        <div className="border-t border-line bg-surface px-4 py-3">
          <p className="font-sans text-xs font-semibold tracking-wide uppercase text-ink-faint">
            A model answer
          </p>
          <div className="mt-1.5">{modelAnswer}</div>

          {marked === null ? (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="font-sans text-sm text-ink-muted">
                Did yours cover the same ground?
              </span>
              <Button variant="secondary" onClick={() => mark(true)}>
                Yes, mine covered it
              </Button>
              <Button variant="quiet" onClick={() => mark(false)}>
                Not quite
              </Button>
            </div>
          ) : (
            <p className="mt-4 font-sans text-sm text-ink-muted">
              {marked
                ? "Marked as understood."
                : "Marked for another look. Worth returning to before the unit check."}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
