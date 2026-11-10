import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/shell/SiteHeader";
import { CourseGate } from "@/components/course/CourseGate";
import {
  CourseOutline,
  type OutlineUnit,
} from "@/components/course/CourseOutline";
import { courses, getCourse, courseUrl } from "@/content/registry";
import { gradedBlocks } from "@/content/types";

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
  return { title: course ? `${course.title} lessons` : "Course" };
}

/**
 * The working view of a course: every lesson, with progress.
 *
 * Behind enrollment. The overview at /courses/<slug>/ is the page that
 * explains the course; this one assumes you have already decided and want
 * to get on with it.
 */
export default async function CourseLearnPage({
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

  return (
    <>
      <SiteHeader courseTitle={course.title} courseHref={courseUrl(course.slug)} />

      <CourseGate
        courseId={course.id}
        courseSlug={course.slug}
        courseTitle={course.title}
      >
        <main className="mx-auto max-w-2xl px-6 pt-10 pb-16">
          <div className="flex items-baseline justify-between gap-4">
            <h1 className="text-2xl font-semibold text-ink">{course.title}</h1>
            <Link
              href={courseUrl(course.slug)}
              className="shrink-0 font-sans text-sm text-accent hover:text-accent-hover"
            >
              Course overview
            </Link>
          </div>

          <CourseOutline courseSlug={course.slug} units={outline} />
        </main>
      </CourseGate>
    </>
  );
}
