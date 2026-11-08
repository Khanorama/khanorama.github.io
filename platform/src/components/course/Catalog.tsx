"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { lessonCompletion, useProgress } from "@/lib/progress/useProgress";
import { isEnrolled } from "@/lib/progress/localProgress";
import { courseUrl, lessonUrl } from "@/content/registry";
import { UPCOMING } from "@/content/site";
import type { LessonKind } from "@/content/types";

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
  art?: string;
  lessons: CatalogLesson[];
}

function Arrow({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4">
      <path
        d={dir === "left" ? "M12.5 4.5L7 10l5.5 5.5" : "M7.5 4.5L13 10l-5.5 5.5"}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * The course shelf.
 *
 * A horizontal row of tall cards rather than a stacked list, because a
 * catalog that will hold several courses reads better as something you move
 * along than as a column that keeps growing. It is a real scroll container,
 * so a trackpad, a touch screen and the arrow buttons all do the same
 * thing, and keyboard focus still walks the cards in order.
 */
export function Catalog({ courses }: { courses: CatalogCourse[] }) {
  const progress = useProgress();
  const shelf = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = shelf.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    sync();
    const el = shelf.current;
    if (!el) return;
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    return () => observer.disconnect();
  }, [sync]);

  function nudge(direction: 1 | -1) {
    const el = shelf.current;
    if (!el) return;
    // One card plus its gap, so a press always lands on a card edge.
    const card = el.querySelector("[data-card]") as HTMLElement | null;
    const step = card ? card.offsetWidth + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  const withProgress = courses.map((course) => {
    const states = course.lessons.map((lesson) =>
      lessonCompletion(lesson, progress),
    );
    const done = states.filter((c) => c.status === "complete").length;
    const next = course.lessons.find(
      (lesson, i) => states[i].status !== "complete",
    );
    const started = states.some((c) => c.status !== "notStarted");
    return {
      course,
      done,
      next,
      started,
      total: course.lessons.length,
      enrolled: isEnrolled(progress, course.id),
    };
  });

  const resume = withProgress.find((c) => c.enrolled && c.started && c.next);
  const canScroll = !atStart || !atEnd;

  return (
    <>
      {resume && resume.next && (
        <section className="rounded-card border border-accent-line bg-accent-soft px-5 py-5 shadow-card">
          <p className="font-sans text-xs font-semibold tracking-wide uppercase text-accent">
            Pick up where you left off
          </p>
          <Link
            href={lessonUrl(
              resume.course.slug,
              resume.next.unitSlug,
              resume.next.slug,
            )}
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

      <section className={resume ? "mt-12" : ""}>
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-sans text-sm font-semibold tracking-wide uppercase text-ink-faint">
            Courses
          </h2>
          {canScroll && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => nudge(-1)}
                disabled={atStart}
                aria-label="Scroll courses left"
                className="grid h-8 w-8 place-items-center rounded-full border border-line bg-paper text-ink-muted transition-colors hover:border-accent-line hover:text-accent disabled:opacity-35 disabled:hover:border-line disabled:hover:text-ink-muted"
              >
                <Arrow dir="left" />
              </button>
              <button
                type="button"
                onClick={() => nudge(1)}
                disabled={atEnd}
                aria-label="Scroll courses right"
                className="grid h-8 w-8 place-items-center rounded-full border border-line bg-paper text-ink-muted transition-colors hover:border-accent-line hover:text-accent disabled:opacity-35 disabled:hover:border-line disabled:hover:text-ink-muted"
              >
                <Arrow dir="right" />
              </button>
            </div>
          )}
        </div>

        {/*
          The vertical padding is doing real work, not spacing.

          A box with overflow-x: auto cannot keep overflow-y visible; the
          other axis computes to auto, so this scroller clips top and bottom
          as well as the sides. The cards lift on hover and grow a larger
          shadow, and both were being sliced off against the top edge.

          Room for them has to come from padding INSIDE the scroller rather
          than margin outside it, which is why the gap below the heading is
          split: mt-1 plus pt-4 is the same 20px the old mt-5 gave.
        */}
        <div
          ref={shelf}
          onScroll={sync}
          className="mt-1 flex snap-x snap-mandatory gap-4 overflow-x-auto pt-4 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {withProgress.map(({ course, done, total, started, enrolled }) => {
            const fraction = total === 0 ? 0 : done / total;
            return (
              <Link
                key={course.id}
                data-card
                href={courseUrl(course.slug)}
                className="group flex w-[17rem] shrink-0 snap-start flex-col rounded-card border border-line bg-paper p-6 shadow-card transition-all hover:-translate-y-1 hover:border-accent-line hover:shadow-card-hover"
              >
                {course.art && (
                  <img
                    src={course.art}
                    alt=""
                    width={88}
                    height={88}
                    className="h-22 w-22 self-start"
                    style={{ height: "5.5rem", width: "5.5rem" }}
                  />
                )}

                <span className="mt-5 inline-flex w-fit rounded-full border border-line bg-surface px-2 py-0.5 font-sans text-[10px] font-semibold tracking-[0.08em] uppercase text-ink-faint">
                  {course.level}
                </span>

                <h3 className="mt-3 font-sans text-xl font-semibold text-ink group-hover:text-accent">
                  {course.title}
                </h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-ink-muted">
                  {course.subtitle}
                </p>

                <div className="mt-auto pt-6">
                  {enrolled ? (
                    <>
                      <div className="h-1 overflow-hidden rounded-full bg-surface-raised">
                        <div
                          className="h-full rounded-full bg-success transition-[width] duration-500"
                          style={{ width: `${Math.round(fraction * 100)}%` }}
                        />
                      </div>
                      <p className="mt-2 font-sans text-xs text-ink-faint tabular-nums">
                        {started ? `${done} of ${total} lessons` : "Enrolled"}
                      </p>
                    </>
                  ) : (
                    <p className="font-sans text-xs text-ink-faint">
                      {course.unitCount} units, {total} lessons
                    </p>
                  )}
                </div>
              </Link>
            );
          })}

          {UPCOMING.map((course) => (
            <div
              key={course.title}
              data-card
              className="flex w-[17rem] shrink-0 snap-start flex-col rounded-card border border-dashed border-line bg-surface/50 p-6"
            >
              <img
                src={course.art}
                alt=""
                width={88}
                height={88}
                loading="lazy"
                className="self-start opacity-55"
                style={{ height: "5.5rem", width: "5.5rem" }}
              />
              <span className="mt-5 inline-flex w-fit rounded-full border border-line bg-surface-raised px-2 py-0.5 font-sans text-[10px] font-semibold tracking-[0.08em] uppercase text-ink-faint">
                Coming soon
              </span>
              <h3 className="mt-3 font-sans text-xl font-semibold text-ink-muted">
                {course.title}
              </h3>
              <p className="mt-2 font-sans text-sm leading-relaxed text-ink-faint">
                {course.blurb}
              </p>
              <p className="mt-auto pt-6 font-sans text-xs text-ink-faint">
                {course.level}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
