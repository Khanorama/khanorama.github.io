"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { reveal } from "@/lib/motion/reveal";
import { recordBlockResult } from "@/lib/progress/localProgress";

interface QuizBlockProps {
  prompt: ReactNode;
  choices: string[];
  answer: number;
  explanation: ReactNode;
  lessonId: string;
  blockId: string;
}

/**
 * One multiple-choice question.
 *
 * This is what makes a conceptual lesson's progress mean something. Without
 * it the only gradeable block in a course with no code is a written answer
 * the student marks themselves, so a unit could be "complete" without a
 * single thing having been checked.
 *
 * A WRONG ANSWER IS NOT A DEAD END. The explanation is shown either way and
 * another attempt is allowed, which is the same bargain an exercise already
 * offers: you may retry until it passes. That does mean a determined student
 * can read the explanation and then pick the right option, and it is worth
 * being plain about why that is acceptable. This is a static site. Every
 * correct answer is already in the page source, so a quiz here can never be
 * a secure assessment and pretending otherwise would only punish the honest.
 * What it is instead is a prompt to commit to an answer before being told,
 * which is where the learning actually happens, and `attempts` records how
 * many goes it took.
 *
 * Choices are radio inputs rather than buttons. A radio group is one tab stop
 * with arrow keys between the options, which is both the correct semantics
 * for "pick exactly one" and far less work to operate from a keyboard than
 * four separate buttons.
 */
export function QuizBlock({
  prompt,
  choices,
  answer,
  explanation,
  lessonId,
  blockId,
}: QuizBlockProps) {
  const [picked, setPicked] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  const correct = picked === answer;
  const name = `${lessonId}-${blockId}`;

  function check() {
    if (picked === null) return;
    setChecked(true);
    recordBlockResult(lessonId, blockId, picked === answer, choices[picked]);
  }

  function again() {
    setChecked(false);
    setPicked(null);
  }

  const state = !checked ? "open" : correct ? "right" : "wrong";

  return (
    <section
      className={[
        "my-8 overflow-hidden rounded-card border bg-paper",
        state === "right"
          ? "border-success-line"
          : state === "wrong"
            ? "border-warning-line"
            : "border-line",
      ].join(" ")}
      {...reveal()}
    >
      <header
        className={[
          "border-b px-4 py-2.5",
          state === "right"
            ? "border-success-line bg-success-soft"
            : state === "wrong"
              ? "border-warning-line bg-warning-soft"
              : "border-line bg-surface-raised",
        ].join(" ")}
      >
        <span
          className={[
            "font-sans text-xs font-semibold tracking-wide uppercase",
            state === "right"
              ? "text-success"
              : state === "wrong"
                ? "text-warning"
                : "text-ink-muted",
          ].join(" ")}
        >
          {state === "right"
            ? "Correct"
            : state === "wrong"
              ? "Not quite"
              : "Check yourself"}
        </span>
      </header>

      <div className="px-4 pt-4">{prompt}</div>

      <fieldset className="px-4 py-3" disabled={checked}>
        <legend className="sr-only">Choose one answer</legend>

        <div className="space-y-1.5">
          {choices.map((choice, index) => {
            const isAnswer = index === answer;
            const isPicked = index === picked;

            // After checking, the right answer is always marked, and a wrong
            // pick is marked too so the student can see both at once rather
            // than having to remember what they chose.
            const marking = !checked
              ? isPicked
                ? "border-accent-line bg-accent-soft"
                : "border-line bg-paper hover:border-line-strong hover:bg-surface"
              : isAnswer
                ? "border-success-line bg-success-soft"
                : isPicked
                  ? "border-warning-line bg-warning-soft"
                  : "border-line bg-paper opacity-70";

            return (
              <label
                key={choice}
                className={[
                  "press flex cursor-pointer items-start gap-3 rounded-control border px-3 py-2.5",
                  checked && "cursor-default",
                  marking,
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <input
                  type="radio"
                  name={name}
                  value={index}
                  checked={isPicked}
                  onChange={() => setPicked(index)}
                  className="mt-0.5 shrink-0 accent-[var(--color-accent)]"
                />
                <span className="font-sans text-sm leading-relaxed text-ink">
                  {choice}
                </span>
                {checked && isAnswer && (
                  <span className="ml-auto shrink-0 font-sans text-xs font-semibold tracking-wide uppercase text-success">
                    Answer
                  </span>
                )}
              </label>
            );
          })}
        </div>

        {!checked && (
          <div className="mt-3 flex items-center gap-3">
            <Button
              variant="primary"
              onClick={check}
              disabled={picked === null}
            >
              Check answer
            </Button>
            {picked === null && (
              <span className="font-sans text-xs text-ink-faint">
                Pick one first.
              </span>
            )}
          </div>
        )}
      </fieldset>

      {checked && (
        <div className="border-t border-line bg-surface px-4 py-3">
          <p className="font-sans text-xs font-semibold tracking-wide uppercase text-ink-faint">
            Why
          </p>
          <div className="mt-1.5">{explanation}</div>

          {!correct && (
            <div className="mt-4">
              <Button variant="secondary" onClick={again}>
                Try again
              </Button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
