"use client";

import Link from "next/link";
import { CompletionRing } from "@/components/ui/CompletionRing";
import { TypeTag } from "@/components/ui/TypeTag";
import { lessonCompletion, useProgress } from "@/lib/progress/useProgress";
import type { LessonKind } from "@/content/types";
import { lessonUrl } from "@/content/registry";

export interface OutlineLesson {
  id: string;
  slug: string;
  title: string;
  kind: LessonKind;
  gradedBlockIds: string[];
  written: boolean;
}

export interface OutlineUnit {
  id: string;
  slug: string;
  title: string;
  summary: string;
  lessons: OutlineLesson[];
}

/**
 * The course outline.
 *
 * Rings are connected by a hairline so a unit reads as one path rather than
 * four unrelated rows, which is what makes "where am I up to" answerable at a
 * glance. Progress is read on the client because it lives per browser until
 * accounts exist.
 */
export function CourseOutline({
  courseSlug,
  units,
}: {
  courseSlug: string;
  units: OutlineUnit[];
}) {
  const progress = useProgress();

  return (
    <ol className="mt-8 space-y-9">
      {units.map((unit, unitIndex) => {
        const completions = unit.lessons.map((lesson) =>
          lessonCompletion(lesson, progress),
        );
        const done = completions.filter((c) => c.status === "complete").length;

        return (
          <li key={unit.id}>
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-xs text-ink-faint">
                {String(unitIndex + 1).padStart(2, "0")}
              </span>
              <h2 className="font-sans text-base font-semibold text-ink">
                {unit.title}
              </h2>
              <span
                className={[
                  "ml-auto font-sans text-xs tabular-nums",
                  done === unit.lessons.length
                    ? "text-success"
                    : "text-ink-faint",
                ].join(" ")}
              >
                {done} of {unit.lessons.length}
              </span>
            </div>

            <p className="mt-1 pl-8 font-sans text-sm text-ink-muted">
              {unit.summary}
            </p>

            <ul className="mt-3 pl-8">
              {unit.lessons.map((lesson, index) => {
                const completion = completions[index];
                const isLast = index === unit.lessons.length - 1;

                return (
                  <li key={lesson.id} className="flex items-stretch gap-3">
                    {/* Ring column. The hairline below joins it to the next. */}
                    <div className="flex w-[22px] shrink-0 flex-col items-center">
                      <div className="py-2.5">
                        <CompletionRing
                          status={completion.status}
                          fraction={completion.fraction}
                        />
                      </div>
                      {!isLast && <span className="w-px flex-1 bg-line" />}
                    </div>

                    <Link
                      href={lessonUrl(courseSlug, unit.slug, lesson.slug)}
                      className="group flex min-w-0 flex-1 items-center gap-2.5 rounded-control py-2.5 pr-3 pl-2 transition-colors hover:bg-accent-soft"
                    >
                      <span
                        className={[
                          "truncate font-sans text-sm transition-colors",
                          completion.status === "complete"
                            ? "text-ink-muted"
                            : "text-ink",
                          "group-hover:text-accent",
                        ].join(" ")}
                      >
                        {lesson.title}
                      </span>

                      <TypeTag kind={lesson.kind} />

                      <span className="ml-auto shrink-0 font-sans text-xs text-ink-faint tabular-nums">
                        {!lesson.written
                          ? "not written yet"
                          : completion.status === "inProgress" &&
                              completion.total > 0
                            ? `${completion.passed}/${completion.total}`
                            : ""}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        );
      })}
    </ol>
  );
}
