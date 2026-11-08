import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonBody } from "@/components/content/LessonBody";
import { SiteHeader } from "@/components/shell/SiteHeader";
import { TypeTag } from "@/components/ui/TypeTag";
import {
  getCourse,
  getLessonLocation,
  allLessonParams,
  courseLearnUrl,
  lessonUrl,
} from "@/content/registry";
import { CourseGate } from "@/components/course/CourseGate";

/**
 * Static params are generated for every lesson in every course, because the
 * export has no server to resolve routes at request time.
 */
export function generateStaticParams() {
  return allLessonParams();
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseSlug: string; unitSlug: string; lessonSlug: string }>;
}) {
  const { courseSlug, unitSlug, lessonSlug } = await params;
  const course = getCourse(courseSlug);
  if (!course) notFound();

  const location = getLessonLocation(course, unitSlug, lessonSlug);
  if (!location) notFound();

  const { unit, lesson, previous, next } = location;

  return (
    <>
      <SiteHeader courseTitle={course.title} courseHref={courseLearnUrl(course.slug)} />

      <CourseGate
        courseId={course.id}
        courseSlug={course.slug}
        courseTitle={course.title}
      >
      <div className="mx-auto max-w-2xl px-6 pt-8 pb-16">
        <header className="border-b border-line pb-7">
          <div className="flex items-center gap-2.5">
            <p className="font-sans text-xs font-semibold tracking-wide uppercase text-accent">
              {unit.title}
            </p>
            <TypeTag kind={lesson.kind} />
          </div>

          <h1 className="mt-2.5 text-3xl font-semibold text-ink">
            {lesson.title}
          </h1>
          <p className="mt-2 font-sans text-sm text-ink-muted">
            {lesson.summary}
          </p>

          {lesson.objectives.length > 0 && (
            <div className="mt-6 rounded-card border border-accent-line bg-accent-soft px-5 py-4">
              <p className="font-sans text-xs font-semibold tracking-wide uppercase text-accent">
                By the end of this lesson
              </p>
              <ul className="mt-2.5 list-disc space-y-1.5 pl-5 marker:text-accent">
                {lesson.objectives.map((objective) => (
                  <li key={objective} className="font-sans text-sm text-ink-muted">
                    {objective}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </header>

        <article className="pt-2">
          <LessonBody blocks={lesson.blocks} lessonId={lesson.id} />
          {lesson.blocks.length === 0 && (
            <p className="mt-6 rounded-card border border-line border-dashed bg-surface px-5 py-4 font-sans text-sm text-ink-faint">
              This lesson has not been written yet.
            </p>
          )}
        </article>

        {/*
          Three ways out, in the order a student thinks about them: back,
          up, forward. The middle one matters because the sequence is long
          and the header's course link is a long way up the page by the time
          anyone finishes a lesson.
        */}
        <nav className="mt-12 flex items-stretch justify-between gap-3 border-t border-line pt-6">
          {previous ? (
            <Link
              href={lessonUrl(course.slug, previous.unitSlug, previous.lesson.slug)}
              className="press group min-w-0 flex-1 rounded-card border border-line px-4 py-3 hover:-translate-y-0.5 hover:border-accent-line hover:bg-accent-soft"
            >
              <span className="block font-sans text-xs text-ink-faint">
                Previous
              </span>
              <span className="mt-0.5 block truncate font-sans text-sm font-medium text-ink group-hover:text-accent">
                {previous.lesson.title}
              </span>
            </Link>
          ) : (
            <span className="min-w-0 flex-1" />
          )}

          <Link
            href={courseLearnUrl(course.slug)}
            className="press group flex shrink-0 flex-col items-center justify-center rounded-card border border-line px-4 py-3 hover:-translate-y-0.5 hover:border-accent-line hover:bg-accent-soft"
            title={`All lessons in ${course.title}`}
          >
            <svg
              viewBox="0 0 16 16"
              width="15"
              height="15"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              aria-hidden="true"
              className="text-ink-faint group-hover:text-accent"
            >
              <path d="M2.5 4h11M2.5 8h11M2.5 12h7" />
            </svg>
            <span className="mt-1 font-sans text-xs font-medium text-ink group-hover:text-accent">
              All lessons
            </span>
          </Link>

          {next ? (
            <Link
              href={lessonUrl(course.slug, next.unitSlug, next.lesson.slug)}
              className="press group min-w-0 flex-1 rounded-card border border-line px-4 py-3 text-right hover:-translate-y-0.5 hover:border-accent-line hover:bg-accent-soft"
            >
              <span className="block font-sans text-xs text-ink-faint">Next</span>
              <span className="mt-0.5 block truncate font-sans text-sm font-medium text-ink group-hover:text-accent">
                {next.lesson.title}
              </span>
            </Link>
          ) : (
            <span className="min-w-0 flex-1" />
          )}
        </nav>
      </div>
      </CourseGate>
    </>
  );
}
