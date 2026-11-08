import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/shell/SiteHeader";
import {
  CourseOutline,
  type OutlineUnit,
} from "@/components/course/CourseOutline";
import { courses, getCourse } from "@/content/registry";
import { courseLessons, gradedBlocks } from "@/content/types";

export function generateStaticParams() {
  return courses.map((course) => ({ courseSlug: course.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}): Promise<Metadata> {
  const { courseSlug } = await params;
  const course = getCourse(courseSlug);
  return { title: course?.title ?? "Course" };
}

/**
 * A single course: what it covers, and every lesson in order.
 *
 * The outline is reduced to ids before it reaches the client, so the browser
 * gets what it needs to draw progress and nothing else. Lesson prose,
 * solutions and expected answers stay out of this payload.
 */
export default async function CoursePage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;
  const course = getCourse(courseSlug);
  if (!course) notFound();

  const outline: OutlineUnit[] = course.units.map((unit) => ({
    id: unit.id,
    slug: unit.slug,
    title: unit.title,
    summary: unit.summary,
    lessons: unit.lessons.map((lesson) => ({
      id: lesson.id,
      slug: lesson.slug,
      title: lesson.title,
      kind: lesson.kind,
      gradedBlockIds: gradedBlocks(lesson).map((block) => block.id),
      written: lesson.blocks.length > 0,
    })),
  }));

  const lessons = courseLessons(course);

  return (
    <>
      <SiteHeader />

      <main className="mx-auto max-w-2xl px-6 pt-10 pb-16">
        <p className="font-sans text-xs font-semibold tracking-wide uppercase text-accent">
          {course.level}
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-ink">{course.title}</h1>
        <p className="mt-1.5 font-sans text-sm text-ink-muted">
          {course.subtitle}
        </p>

        <p className="font-reading text-reading mt-5 text-ink">
          {course.description}
        </p>

        <div className="mt-6 flex items-center gap-4 border-y border-line py-3 font-sans text-sm text-ink-muted">
          <span>
            <span className="font-semibold text-ink">{course.units.length}</span>{" "}
            units
          </span>
          <span className="text-line-strong">/</span>
          <span>
            <span className="font-semibold text-ink">{lessons.length}</span> lessons
          </span>
        </div>

        <CourseOutline courseSlug={course.slug} units={outline} />
      </main>
    </>
  );
}
