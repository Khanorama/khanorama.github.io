"use client";

import Link from "next/link";
import { lessonCompletion, useProgress } from "@/lib/progress/useProgress";
import type { LessonKind } from "@/content/types";
import { UPCOMING } from "@/content/site";

export interface CatalogLesson {
  id: string;
  slug: string;
  unitSlug: string;
  title: string;
  kind: LessonKind;
  gradedBlockIds: string[];
  written: boolean;
}

export interface CatalogCourse {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  level: string;
  unitCount: number;
  /** Course artwork, if the course has one. Decorative, so alt is empty. */
  art?: string;
  lessons: CatalogLesson[];
}

/**
 * The catalog, and the "pick up where you left off" card above it.
 *
 * Both need progress, so both live on the client. The next lesson is simply
 * the first incomplete one in teaching order, which is what a student means
 * by "where I was", and it avoids storing a cursor that could drift out of
 * step with the content.
 */
export function Catalog({ courses }: { courses: CatalogCourse[] }) {
  const progress = useProgress();

  const withProgress = courses.map((course) => {
    const states = course.lessons.map((lesson) => ({
      lesson,
      completion: lessonCompletion(lesson, progress),
    }));
    const done = states.filter((s) => s.completion.status === "complete").length;
    const next = states.find((s) => s.completion.status !== "complete")?.lesson;
    const started = states.some((s) => s.completion.status !== "notStarted");
    return { course, done, next, started, total: course.lessons.length };
  });

  const resume = withProgress.find((c) => c.started && c.next);

  return (
    <>
      {resume && resume.next && (
        <section className="rounded-card border border-accent-line bg-accent-soft px-5 py-5 shadow-card">
          <p className="font-sans text-xs font-semibold tracking-wide uppercase text-accent">
            Pick up where you left off
          </p>
          <Link
            href={`/courses/${resume.course.slug}/${resume.next.unitSlug}/${resume.next.slug}/`}
            className="group mt-2 flex items-baseline justify-between gap-4"
          >
            <span className="font-sans text-base font-semibold text-ink group-hover:text-accent">
              {resume.next.title}
            </span>
            <span className="shrink-0 font-sans text-xs text-ink-muted tabular-nums">
              {resume.done} of {resume.total} done
            </span>
          </Link>
          <p className="mt-0.5 font-sans text-sm text-ink-muted">
            {resume.course.title}
          </p>
        </section>
      )}

      <section className="mt-12">
        <h2 className="font-sans text-sm font-semibold tracking-wide uppercase text-ink-faint">
          Courses
        </h2>

        <ul className="mt-4 space-y-4">
          {withProgress.map(({ course, done, total, started }) => {
            const fraction = total === 0 ? 0 : done / total;
            return (
              <li key={course.id}>
                <Link
                  href={`/courses/${course.slug}/`}
                  className="group flex gap-5 rounded-card border border-line bg-paper p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-accent-line hover:shadow-card-hover"
                >
                  {course.art && (
                    <img
                      src={course.art}
                      alt=""
                      width={64}
                      height={64}
                      className="hidden h-16 w-16 shrink-0 sm:block"
                    />
                  )}

                  <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-sans text-lg font-semibold text-ink group-hover:text-accent">
                      {course.title}
                    </h3>
                    <span className="shrink-0 rounded-full border border-line bg-surface px-2 py-0.5 font-sans text-[10px] font-semibold tracking-[0.08em] uppercase text-ink-faint">
                      {course.level}
                    </span>
                  </div>

                  <p className="mt-1 font-sans text-sm text-ink-muted">
                    {course.subtitle}
                  </p>

                  <div className="mt-3 flex items-center gap-3">
                    <div
                      className="h-1 flex-1 overflow-hidden rounded-full bg-surface-raised"
                      role="progressbar"
                      aria-valuenow={done}
                      aria-valuemin={0}
                      aria-valuemax={total}
                      aria-label={`${course.title} progress`}
                    >
                      <div
                        className="h-full rounded-full bg-success transition-[width] duration-500"
                        style={{ width: `${Math.round(fraction * 100)}%` }}
                      />
                    </div>
                    <span className="shrink-0 font-sans text-xs text-ink-faint tabular-nums">
                      {started ? `${done} of ${total}` : `${course.unitCount} units, ${total} lessons`}
                    </span>
                  </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        {/*
          Shown as plainly unavailable rather than left out. The platform is
          one course today and several later; a catalog that hides that reads
          as a single-course site, and one that links to empty pages is worse.
        */}
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {UPCOMING.map((course) => (
            <li
              key={course.title}
              className="flex gap-4 rounded-card border border-dashed border-line bg-surface/60 p-5"
            >
              <img
                src={course.art}
                alt=""
                width={48}
                height={48}
                loading="lazy"
                className="hidden h-12 w-12 shrink-0 opacity-60 sm:block"
              />
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <h3 className="font-sans text-base font-semibold text-ink-muted">
                    {course.title}
                  </h3>
                  <span className="rounded-full border border-line bg-surface-raised px-2 py-0.5 font-sans text-[10px] font-semibold tracking-[0.08em] uppercase text-ink-faint">
                    Coming soon
                  </span>
                </div>
                <p className="mt-1 font-sans text-sm text-ink-faint">
                  {course.blurb}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
