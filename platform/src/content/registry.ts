import { pythonI } from "@/content/courses/python-i";
import { aiFundamentals } from "@/content/courses/ai-fundamentals";
import type { Course, Lesson, Unit } from "@/content/types";

/** Every course the platform knows about. */
export const courses: Course[] = [pythonI, aiFundamentals];

export function getCourse(slug: string): Course | undefined {
  return courses.find((course) => course.slug === slug);
}

interface SequenceEntry {
  unit: Unit;
  unitSlug: string;
  lesson: Lesson;
}

/**
 * Lessons flattened across units, in teaching order. Previous and next have to
 * cross unit boundaries, otherwise a student hits a dead end at the last
 * lesson of each unit.
 */
function sequence(course: Course): SequenceEntry[] {
  return course.units.flatMap((unit) =>
    unit.lessons.map((lesson) => ({ unit, unitSlug: unit.slug, lesson })),
  );
}

export interface LessonLocation {
  unit: Unit;
  lesson: Lesson;
  previous?: SequenceEntry;
  next?: SequenceEntry;
}

export function getLessonLocation(
  course: Course,
  unitSlug: string,
  lessonSlug: string,
): LessonLocation | null {
  const entries = sequence(course);
  const index = entries.findIndex(
    (entry) => entry.unitSlug === unitSlug && entry.lesson.slug === lessonSlug,
  );
  if (index === -1) return null;

  return {
    unit: entries[index].unit,
    lesson: entries[index].lesson,
    previous: entries[index - 1],
    next: entries[index + 1],
  };
}

/** Route params for every lesson, used to prerender the static export. */
export function allLessonParams(): Array<{
  courseSlug: string;
  unitSlug: string;
  lessonSlug: string;
}> {
  return courses.flatMap((course) =>
    sequence(course).map((entry) => ({
      courseSlug: course.slug,
      unitSlug: entry.unitSlug,
      lessonSlug: entry.lesson.slug,
    })),
  );
}

/**
 * URL builders.
 *
 * Lessons live under /learn/ so the taught material shares one namespace
 * with the outline, and so no unit slug can ever collide with a route
 * segment. Centralised because these paths are built in five places and
 * drifting apart would produce links that quietly 404 in a static export.
 */
export function courseUrl(courseSlug: string): string {
  return `/courses/${courseSlug}/`;
}

export function courseLearnUrl(courseSlug: string): string {
  return `/courses/${courseSlug}/learn/`;
}

export function lessonUrl(
  courseSlug: string,
  unitSlug: string,
  lessonSlug: string,
): string {
  return `/courses/${courseSlug}/learn/${unitSlug}/${lessonSlug}/`;
}
