"use client";

import { useId, useState } from "react";
import { TypeTag } from "@/components/ui/TypeTag";
import type { LessonKind } from "@/content/types";

export interface RoadmapLesson {
  id: string;
  title: string;
  kind: LessonKind;
  summary: string;
  estimatedMinutes: number;
}

export interface RoadmapUnitData {
  id: string;
  title: string;
  summary: string;
  lessons: RoadmapLesson[];
}

/**
 * One unit on the course overview, openable to show what is actually taught.
 *
 * Collapsed by default. Four units opened at once is a wall of text at exactly
 * the moment someone is deciding whether to start, so the card answers "what
 * is this unit" first and only expands when a specific unit is worth reading.
 *
 * The open/close animation uses a 0fr -> 1fr grid row rather than a max-height
 * guess. Height therefore resolves to the content's real height, so a short
 * unit does not open to the same box as a long one and nothing snaps at the
 * end of the transition. Honoured for reduced motion, where it cuts straight
 * to the open state.
 */
export function RoadmapUnit({
  index,
  unit,
}: {
  index: number;
  unit: RoadmapUnitData;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <li className="rounded-card border border-line bg-paper shadow-card transition-shadow hover:shadow-card-hover">
      <h3>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex w-full cursor-pointer items-start gap-3 rounded-card p-5 text-left"
        >
          <span className="mt-1 font-mono text-xs text-ink-faint">
            {String(index + 1).padStart(2, "0")}
          </span>

          <span className="min-w-0 flex-1">
            <span className="block font-sans text-base font-semibold text-ink">
              {unit.title}
            </span>
            <span className="mt-1 block font-sans text-sm text-ink-muted">
              {unit.summary}
            </span>
          </span>

          <span className="mt-0.5 flex shrink-0 items-center gap-2.5">
            <span className="font-sans text-xs text-ink-faint">
              {unit.lessons.length} parts
            </span>
            <Chevron open={open} />
          </span>
        </button>
      </h3>

      <div
        id={panelId}
        aria-hidden={!open}
        className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <ol className="mx-5 mb-5 space-y-3 border-t border-line pt-4 pl-8">
            {unit.lessons.map((lesson) => (
              <li key={lesson.id}>
                <div className="flex items-center gap-2.5">
                  <span className="font-sans text-sm font-medium text-ink">
                    {lesson.title}
                  </span>
                  <TypeTag kind={lesson.kind} />
                  <span className="ml-auto shrink-0 font-sans text-xs text-ink-faint tabular-nums">
                    {lesson.estimatedMinutes} min
                  </span>
                </div>
                <p className="mt-0.5 font-sans text-sm leading-relaxed text-ink-muted">
                  {lesson.summary}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </li>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={[
        "text-ink-faint transition-transform duration-300 ease-out motion-reduce:transition-none",
        open ? "rotate-180" : "rotate-0",
      ].join(" ")}
    >
      <path d="M3.5 6 8 10.5 12.5 6" />
    </svg>
  );
}
