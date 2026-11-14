import type { Course } from "@/content/types";
import { courseLessons, isLessonComplete } from "@/content/types";
import type { ProgressState } from "@/lib/progress/localProgress";

/**
 * Badges for finishing a course.
 *
 * DERIVED, NEVER STORED, and that is a deliberate choice rather than a
 * shortcut. It follows the rule already written into useProgress.ts: a
 * stored "complete" flag goes stale the moment the curriculum changes,
 * leaving a student holding a badge for a course that has since grown two
 * units. Recomputing against the course as it stands today means the
 * badge always means what it says.
 *
 * It also means no new data is collected. Nothing is written to the
 * account that was not already there, and the security rules on the
 * progress document, which allow only `progress` and `updatedAt`, did not
 * have to change. A badge is a reading of existing progress, not a new
 * record about a student.
 *
 * A course with unwritten lessons can never award one, which is correct:
 * you have not finished a course that is not finished.
 */
export interface CourseBadge {
  courseId: string;
  slug: string;
  title: string;
  level: string;
  art?: string;
  /**
   * When the last piece of the course was finished, recovered from the
   * progress itself. Null if the work predates timestamps being recorded,
   * in which case the badge is shown without a date rather than with a
   * made-up one.
   */
  earnedAt: string | null;
  lessons: number;
}

/** The most recent moment any part of this lesson was finished. */
function lastTouched(
  lessonId: string,
  state: ProgressState,
): string | undefined {
  const progress = state.lessons[lessonId];
  if (!progress) return undefined;

  const stamps = [
    progress.completedAt,
    ...Object.values(progress.blocks).map((block) => block.passedAt),
  ].filter((value): value is string => Boolean(value));

  // ISO 8601 sorts correctly as text, so no date parsing is needed.
  return stamps.length > 0 ? stamps.sort()[stamps.length - 1] : undefined;
}

/** The badge for this course, or null if it has not been finished. */
export function badgeFor(
  course: Course,
  state: ProgressState,
): CourseBadge | null {
  const lessons = courseLessons(course);
  if (lessons.length === 0) return null;

  const finished = lessons.every((lesson) =>
    isLessonComplete(lesson, state.lessons[lesson.id]),
  );
  if (!finished) return null;

  const stamps = lessons
    .map((lesson) => lastTouched(lesson.id, state))
    .filter((value): value is string => Boolean(value))
    .sort();

  return {
    courseId: course.id,
    slug: course.slug,
    title: course.title,
    level: course.level,
    art: course.art,
    earnedAt: stamps.length > 0 ? stamps[stamps.length - 1] : null,
    lessons: lessons.length,
  };
}

/** Every badge this student has, most recently earned first. */
export function earnedBadges(
  courses: Course[],
  state: ProgressState,
): CourseBadge[] {
  return courses
    .map((course) => badgeFor(course, state))
    .filter((badge): badge is CourseBadge => badge !== null)
    .sort((a, b) => (b.earnedAt ?? "").localeCompare(a.earnedAt ?? ""));
}

/** "14 November 2026", or null when there is no date to show. */
export function badgeDate(badge: CourseBadge): string | null {
  if (!badge.earnedAt) return null;
  const date = new Date(badge.earnedAt);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
