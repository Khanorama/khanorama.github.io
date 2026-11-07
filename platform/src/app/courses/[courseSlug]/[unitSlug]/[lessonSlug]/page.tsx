import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonBody } from "@/components/content/LessonBody";
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

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <nav className="font-sans text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink-muted">
          {course.title}
        </Link>
        <span className="mx-1.5">/</span>
        <span>{unit.title}</span>
      </nav>

      <header className="mt-5 border-b border-line pb-6">
        <h1 className="text-3xl font-semibold text-ink">{lesson.title}</h1>
        <p className="mt-2 font-sans text-sm text-ink-muted">
          {lesson.summary}
        </p>
        {lesson.objectives.length > 0 && (
          <div className="mt-5 rounded-card border border-line bg-surface px-4 py-3.5">
            <p className="font-sans text-xs font-semibold tracking-wide uppercase text-ink-faint">
              By the end of this lesson
            </p>
            <ul className="mt-2 space-y-1">
              {lesson.objectives.map((objective) => (
                <li
                  key={objective}
                  className="font-sans text-sm text-ink-muted before:mr-2 before:text-ink-faint before:content-['—']"
                >
                  {objective}
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      <article className="pt-6">
        <LessonBody blocks={lesson.blocks} />
        {lesson.blocks.length === 0 && (
          <p className="font-sans text-sm text-ink-faint">
            This lesson has not been written yet.
          </p>
        )}
      </article>

      <nav className="mt-12 flex items-center justify-between gap-4 border-t border-line pt-5">
        {previous ? (
          <Link
            href={`/courses/${course.slug}/${previous.unitSlug}/${previous.lesson.slug}/`}
            className="font-sans text-sm text-accent hover:text-accent-hover"
          >
            Previous: {previous.lesson.title}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            href={`/courses/${course.slug}/${next.unitSlug}/${next.lesson.slug}/`}
            className="text-right font-sans text-sm text-accent hover:text-accent-hover"
          >
            Next: {next.lesson.title}
          </Link>
        )}
      </nav>
    </div>
  );
}
