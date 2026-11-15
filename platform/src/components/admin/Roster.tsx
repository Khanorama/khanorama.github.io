"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { courses } from "@/content/registry";
import { courseLessons, isLessonComplete } from "@/content/types";
import { firestoreModule, loadFirestore } from "@/lib/firebase/client";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useIsOrganizer } from "@/lib/auth/useIsOrganizer";
import { badgeDate, earnedBadges } from "@/lib/progress/badges";
import { coerceProgress, type ProgressState } from "@/lib/progress/localProgress";

/**
 * The roster: every student, what they have finished, what they have earned.
 *
 * A convenience view, and worth being honest about its limits, because the
 * limits are structural rather than things left undone.
 *
 * The name is whatever the student last saved. It comes from their own
 * document, which only they can write, so it labels a row rather than
 * proving an identity, and a student can change it. Email addresses are not
 * here at all: they live in Firebase Authentication, which the client SDK
 * cannot read for another account. When the question is "who exactly is
 * this", the answer is tools/roster, which reads Authentication through a
 * service account and can join the two properly.
 *
 * Submitted code is deliberately absent. Everything here is a count, which
 * is what "how is the course going" needs. Reading what a particular student
 * wrote is a different act with a different weight, and it should take a
 * deliberate step rather than being on screen by default.
 */

interface Row {
  uid: string;
  name: string | null;
  savedAt: string | null;
  lessonsComplete: number;
  lessonsStarted: number;
  exercisesPassed: number;
  badges: { title: string; on: string | null }[];
  perCourse: { title: string; complete: number; total: number }[];
}

type Load =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "ready"; rows: Row[] }
  | { state: "error"; message: string };

function describe(uid: string, data: Record<string, unknown>): Row {
  // Rebuilt rather than trusted, exactly as the sync path does it. Every
  // document here was written by somebody else's browser.
  const progress: ProgressState = coerceProgress(data.progress);

  const perCourse = courses
    .map((course) => {
      const lessons = courseLessons(course);
      return {
        title: course.title,
        total: lessons.length,
        complete: lessons.filter((lesson) =>
          isLessonComplete(lesson, progress.lessons[lesson.id]),
        ).length,
      };
    })
    .filter((line) => line.total > 0 && line.complete > 0);

  let exercisesPassed = 0;
  for (const lesson of Object.values(progress.lessons)) {
    for (const block of Object.values(lesson.blocks)) {
      if (block.status === "passed") exercisesPassed += 1;
    }
  }

  return {
    uid,
    name: typeof data.name === "string" && data.name.trim() ? data.name.trim() : null,
    savedAt: typeof data.updatedAt === "string" ? data.updatedAt : null,
    lessonsComplete: perCourse.reduce((sum, line) => sum + line.complete, 0),
    lessonsStarted: Object.keys(progress.lessons).length,
    exercisesPassed,
    badges: earnedBadges(courses, progress).map((badge) => ({
      title: badge.title,
      on: badgeDate(badge),
    })),
    perCourse,
  };
}

function when(value: string | null): string {
  if (!value) return "never";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "unreadable";
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function Roster() {
  const { status } = useAuth();
  const organizer = useIsOrganizer();
  const [load, setLoad] = useState<Load>({ state: "idle" });

  const fetchRows = useCallback(async () => {
    setLoad({ state: "loading" });
    try {
      const [{ collection, getDocs }, db] = await Promise.all([
        firestoreModule(),
        loadFirestore(),
      ]);
      const snapshot = await getDocs(collection(db, "users"));
      const rows = snapshot.docs
        .map((document) => describe(document.id, document.data()))
        .sort((a, b) => (b.savedAt ?? "").localeCompare(a.savedAt ?? ""));
      setLoad({ state: "ready", rows });
    } catch (error) {
      setLoad({
        state: "error",
        message:
          error instanceof Error ? error.message : "The roster could not be read.",
      });
    }
  }, []);

  useEffect(() => {
    if (organizer === "yes") void fetchRows();
  }, [organizer, fetchRows]);

  if (status === "loading" || organizer === "checking") {
    return <p className="font-sans text-sm text-ink-muted">Checking.</p>;
  }

  /*
   * One message for "not an organizer" and for "not signed in" alike.
   *
   * Saying "you are not an organizer" to a signed-in student confirms that a
   * roster exists and that some accounts can reach it, which is a small
   * invitation to go looking. There is nothing to find, since the rules
   * refuse the read whatever the page renders, but there is no reason to
   * advertise it either.
   */
  if (organizer !== "yes") {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-ink">Nothing here</h1>
        <p className="mt-2 font-sans text-sm text-ink-muted">
          This page is not part of the course.{" "}
          <Link href="/" className="text-accent hover:text-accent-hover">
            Back to the courses
          </Link>
          .
        </p>
      </div>
    );
  }

  const totals =
    load.state === "ready"
      ? {
          students: load.rows.length,
          active: load.rows.filter((row) => row.lessonsStarted > 0).length,
          badges: load.rows.reduce((sum, row) => sum + row.badges.length, 0),
        }
      : null;

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="text-2xl font-semibold text-ink">Roster</h1>
        <button
          type="button"
          onClick={() => void fetchRows()}
          disabled={load.state === "loading"}
          className="press rounded-control border border-line-strong bg-paper px-3 py-1.5 font-sans text-sm font-medium text-ink hover:border-accent-line hover:bg-surface-raised disabled:opacity-60"
        >
          {load.state === "loading" ? "Reading" : "Refresh"}
        </button>
      </div>

      <p className="mt-1.5 font-sans text-sm text-ink-muted">
        Everyone who has saved progress to an account. Badges are worked out
        from that progress against the courses as they stand today, the same
        way each student&rsquo;s own account page works them out.
      </p>

      {load.state === "error" && (
        <p
          role="alert"
          className="mt-6 rounded-control border border-danger-line bg-danger-soft px-3 py-2 font-sans text-sm text-ink"
        >
          {load.message}
        </p>
      )}

      {load.state === "loading" && (
        <p className="mt-6 font-sans text-sm text-ink-muted">Reading accounts.</p>
      )}

      {load.state === "ready" && totals && (
        <>
          <dl className="mt-6 flex flex-wrap gap-8 border-y border-line-strong py-4">
            <div>
              <dt className="font-sans text-xs font-semibold tracking-wide uppercase text-ink-faint">
                Accounts
              </dt>
              <dd className="mt-1 font-sans text-2xl tabular-nums text-ink">
                {totals.students}
              </dd>
            </div>
            <div>
              <dt className="font-sans text-xs font-semibold tracking-wide uppercase text-ink-faint">
                Started something
              </dt>
              <dd className="mt-1 font-sans text-2xl tabular-nums text-ink">
                {totals.active}
              </dd>
            </div>
            <div>
              <dt className="font-sans text-xs font-semibold tracking-wide uppercase text-ink-faint">
                Badges earned
              </dt>
              <dd className="mt-1 font-sans text-2xl tabular-nums text-ink">
                {totals.badges}
              </dd>
            </div>
          </dl>

          {load.rows.length === 0 ? (
            <p className="mt-6 font-sans text-sm text-ink-muted">
              No accounts have saved progress yet.
            </p>
          ) : (
            <ul className="mt-2">
              {load.rows.map((row) => (
                <li key={row.uid} className="border-b border-line py-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-sans text-sm font-semibold text-ink">
                      {row.name ?? "No name saved"}
                    </p>
                    <p className="font-mono text-xs text-ink-faint">{row.uid}</p>
                  </div>

                  <p className="mt-1 font-sans text-xs text-ink-muted">
                    {row.lessonsComplete} lesson
                    {row.lessonsComplete === 1 ? "" : "s"} complete ·{" "}
                    {row.exercisesPassed} exercise
                    {row.exercisesPassed === 1 ? "" : "s"} passed · saved{" "}
                    {when(row.savedAt)}
                  </p>

                  {row.perCourse.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {row.perCourse.map((line) => (
                        <li
                          key={line.title}
                          className="flex items-center gap-3 font-sans text-xs text-ink-muted"
                        >
                          <span className="min-w-[10rem]">{line.title}</span>
                          <span className="tabular-nums">
                            {line.complete} of {line.total}
                          </span>
                          <span className="h-1 max-w-[12rem] flex-1 rounded-full bg-surface-raised">
                            <span
                              className="block h-1 rounded-full bg-accent"
                              style={{
                                width: `${Math.round((line.complete / line.total) * 100)}%`,
                              }}
                            />
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {row.badges.length > 0 && (
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {row.badges.map((badge) => (
                        <li
                          key={badge.title}
                          className="rounded-control border border-success-line bg-success-soft px-2 py-1 font-sans text-xs text-ink"
                        >
                          {badge.title}
                          {badge.on ? (
                            <span className="text-ink-muted"> · {badge.on}</span>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}

          <p className="mt-8 border-t border-line pt-4 font-sans text-xs text-ink-faint">
            Names here are self-reported and email addresses are not available
            to this page. For the authoritative record, including who an
            account actually belongs to, run tools/roster against the project.
          </p>
        </>
      )}
    </div>
  );
}
