import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonBody } from "@/components/content/LessonBody";
import { SiteHeader } from "@/components/shell/SiteHeader";
import { getCourse, getLessonLocation, allLessonParams } from "@/content/registry";

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
  const isCheck = lesson.kind === "progressCheck";

  return (
    <>
      <SiteHeader courseTitle={course.title} courseHref="/" />

      <div className="mx-auto max-w-2xl px-6 pt-8 pb-16">
        <header className="border-b border-line pb-7">
          <p className="font-sans text-xs font-semibold tracking-wide uppercase text-accent">
            {unit.title}
            {isCheck && (
              <span className="ml-2 rounded-control bg-accent-soft px-2 py-0.5 text-accent">
                Progress check
              </span>
            )}
          </p>

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
          <LessonBody blocks={lesson.blocks} />
          {lesson.blocks.length === 0 && (
            <p className="mt-6 rounded-card border border-line border-dashed bg-surface px-5 py-4 font-sans text-sm text-ink-faint">
              This lesson has not been written yet.
            </p>
          )}
        </article>

        <nav className="mt-12 flex items-stretch justify-between gap-3 border-t border-line pt-6">
          {previous ? (
            <Link
              href={`/courses/${course.slug}/${previous.unitSlug}/${previous.lesson.slug}/`}
              className="group flex-1 rounded-card border border-line px-4 py-3 transition-colors hover:border-accent-line hover:bg-accent-soft"
            >
              <span className="block font-sans text-xs text-ink-faint">
                Previous
              </span>
              <span className="mt-0.5 block font-sans text-sm font-medium text-ink group-hover:text-accent">
                {previous.lesson.title}
              </span>
            </Link>
          ) : (
            <span className="flex-1" />
          )}

          {next ? (
            <Link
              href={`/courses/${course.slug}/${next.unitSlug}/${next.lesson.slug}/`}
              className="group flex-1 rounded-card border border-line px-4 py-3 text-right transition-colors hover:border-accent-line hover:bg-accent-soft"
            >
              <span className="block font-sans text-xs text-ink-faint">Next</span>
              <span className="mt-0.5 block font-sans text-sm font-medium text-ink group-hover:text-accent">
                {next.lesson.title}
              </span>
            </Link>
          ) : (
            <span className="flex-1" />
          )}
        </nav>
      </div>
    </>
  );
}
