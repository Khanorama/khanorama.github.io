"use client";

import { useEffect, useState, type ReactNode } from "react";
import { CodeEditor } from "@/components/code/CodeEditor";
import { OutputPanel } from "@/components/code/OutputPanel";
import { Button } from "@/components/ui/Button";
import { usePython } from "@/lib/python/usePython";
import type { RunResult } from "@/lib/python/runner";
import { grade, type GradeResult } from "@/lib/grading";
import type { Check } from "@/content/types";

function TickIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5 shrink-0">
      <path
        d="M3.5 8.5l3 3 6-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DotIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5 shrink-0">
      <circle cx="8" cy="8" r="3.25" fill="currentColor" />
    </svg>
  );
}

interface ExerciseBlockProps {
  /** Markdown rendered upstream in a server component. */
  prompt: ReactNode;
  starter: string;
  checks: Check[];
  hints?: string[];
  solution?: string;
  /** Reported so the lesson can record progress. */
  onResult?: (passed: boolean, code: string) => void;
}

/**
 * An auto-graded exercise.
 *
 * Run and Check are separate on purpose. Running is exploration and costs
 * nothing; checking is a claim that you are done. Collapsing them into one
 * button turns every experiment into a judgement, which makes students
 * reluctant to experiment.
 *
 * Hints reveal one at a time, and the solution stays shut until the student
 * either passes or asks for it twice.
 */
export function ExerciseBlock({
  prompt,
  starter,
  checks,
  hints = [],
  solution,
  onResult,
}: ExerciseBlockProps) {
  const { run, analyze, warmUp, isLoading, isRunning } = usePython();
  const [source, setSource] = useState(starter);
  const [result, setResult] = useState<RunResult | null>(null);
  const [report, setReport] = useState<GradeResult | null>(null);
  const [hintsShown, setHintsShown] = useState(0);
  const [solutionRequested, setSolutionRequested] = useState(0);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    warmUp();
  }, [warmUp]);

  const passed = report?.passed ?? false;
  const solutionVisible = solution !== undefined && (passed || solutionRequested >= 2);

  async function handleRun() {
    setReport(null);
    setResult(await run(source));
  }

  async function handleCheck() {
    setChecking(true);
    try {
      const [runResult, analysis] = await Promise.all([run(source), analyze(source)]);
      setResult(runResult);
      const graded = grade(checks, source, runResult, analysis);
      setReport(graded);
      onResult?.(graded.passed, source);
    } finally {
      setChecking(false);
    }
  }

  const busy = isRunning || isLoading || checking;

  return (
    <section
      className={[
        "my-8 overflow-hidden rounded-card border bg-paper",
        passed ? "border-success-line" : "border-accent-line",
      ].join(" ")}
    >
      <header
        className={[
          "flex items-center justify-between gap-3 border-b px-4 py-2.5",
          passed
            ? "border-success-line bg-success-soft"
            : "border-accent-line bg-accent-soft",
        ].join(" ")}
      >
        <span
          className={[
            "font-sans text-xs font-semibold tracking-wide uppercase",
            passed ? "text-success" : "text-accent",
          ].join(" ")}
        >
          Exercise
        </span>
        {passed && (
          <span className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-success">
            <TickIcon />
            Passed
          </span>
        )}
      </header>

      <div className="px-4 pt-4">{prompt}</div>

      <div className="px-4 pt-4">
        <div className="overflow-hidden rounded-control border border-line">
          <CodeEditor
            value={source}
            onChange={setSource}
            ariaLabel="Your solution"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 px-4 py-3">
        <Button variant="secondary" onClick={handleRun} disabled={busy}>
          Run
        </Button>
        <Button variant="primary" onClick={handleCheck} disabled={busy}>
          {checking ? "Checking" : "Check answer"}
        </Button>

        <div className="ml-auto flex items-center gap-1">
          {hints.length > 0 && hintsShown < hints.length && (
            <Button variant="quiet" onClick={() => setHintsShown((n) => n + 1)}>
              {hintsShown === 0 ? "Show a hint" : "Another hint"}
            </Button>
          )}
          {source !== starter && (
            <Button
              variant="quiet"
              onClick={() => {
                setSource(starter);
                setResult(null);
                setReport(null);
              }}
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {hintsShown > 0 && (
        <div className="mx-4 mb-3 rounded-control border border-line bg-surface px-3.5 py-3">
          <ul className="space-y-2">
            {hints.slice(0, hintsShown).map((hint, index) => (
              <li
                key={index}
                className="flex gap-2.5 font-sans text-sm text-ink-muted"
              >
                <span className="pt-1 text-ink-faint">
                  <DotIcon />
                </span>
                <span>{hint}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="px-4 pb-4">
        <OutputPanel
          result={result}
          isLoading={isLoading}
          isRunning={isRunning}
          idleHint="Run your code to see what it prints, then check your answer."
        />
      </div>

      {report && (
        <div className="border-t border-line px-4 py-3">
          <ul className="space-y-2">
            {report.checks.map((check, index) => (
              <li key={index} className="flex gap-2.5 font-sans text-sm">
                <span
                  className={[
                    "pt-0.5",
                    check.passed ? "text-success" : "text-danger",
                  ].join(" ")}
                >
                  {check.passed ? <TickIcon /> : <DotIcon />}
                </span>
                <span>
                  <span className={check.passed ? "text-ink-muted" : "text-ink"}>
                    {check.label}
                  </span>
                  {check.detail && (
                    <span className="mt-0.5 block text-ink-muted">
                      {check.detail}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>

          {!passed && solution !== undefined && (
            <div className="mt-3">
              <Button
                variant="quiet"
                onClick={() => setSolutionRequested((n) => n + 1)}
              >
                {solutionRequested === 0
                  ? "I am stuck"
                  : solutionRequested === 1
                    ? "Show me the solution"
                    : "Solution shown below"}
              </Button>
              {solutionRequested === 1 && (
                <p className="mt-1.5 font-sans text-xs text-ink-faint">
                  Try one more edit first. Press again to reveal it.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {solutionVisible && (
        <div className="border-t border-line bg-surface px-4 py-3">
          <p className="mb-2 font-sans text-xs font-semibold tracking-wide uppercase text-ink-faint">
            One way to write it
          </p>
          <pre className="overflow-x-auto rounded-control border border-line bg-paper px-3 py-2.5 font-mono text-[13px] leading-relaxed text-ink">
            {solution}
          </pre>
        </div>
      )}
    </section>
  );
}
