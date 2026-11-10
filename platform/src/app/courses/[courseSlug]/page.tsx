import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/shell/SiteHeader";
import { EnrollButton } from "@/components/course/EnrollButton";
import { RoadmapUnit } from "@/components/course/RoadmapUnit";
import { courses, getCourse } from "@/content/registry";
import { reveal } from "@/lib/motion/reveal";
import { courseLessons } from "@/content/types";

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
  return {
    title: course?.title ?? "Course",
    description: course?.description,
  };
}

/**
 * The course overview: what this is, what you get, and how it is built.
 *
 * Separate from the outline on purpose. This page has to answer "should I
 * do this" for someone who has never seen the course, which is a different
 * job from "where was I", and mixing the two made the outline carry a sales
 * pitch that returning students had to scroll past every time.
 *
 * The roadmap here is deliberately not clickable. It shows the shape of the
 * course before you commit; the working version lives behind enrolment.
 */
export default async function CourseOverviewPage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;
  const course = getCourse(courseSlug);
  if (!course) notFound();

  const lessons = courseLessons(course);

  /*
    Taught lessons are counted apart from the things that close a unit,
    because a reader deciding whether to start wants to know how much
    material there is, not how many entries the outline has.

    Which kinds close a unit differs by course. Python I uses progress
    checks; the conceptual courses use a real-world connection and a quiz.
    Counting them together under one honest label beats either hard-coding
    one course's vocabulary or printing a zero for the other.
  */
  const closers = lessons.filter(
    (l) =>
      l.kind === "progressCheck" ||
      l.kind === "connection" ||
      l.kind === "unitQuiz",
  ).length;
  const closerLabel = course.units[0]?.lessons.some(
    (l) => l.kind === "progressCheck",
  )
    ? "Progress checks"
    : "Activities and quizzes";
  const ready = lessons.filter((l) => l.blocks.length > 0).length;

  return (
    <>
      <SiteHeader />

      <section className="brand-glow border-b border-line bg-surface">
        <div className="mx-auto grid max-w-4xl items-center gap-8 px-6 py-14 md:grid-cols-[1fr_auto]">
          <div>
            <p className="font-sans text-xs font-semibold tracking-[0.12em] uppercase text-accent">
              {course.level} course
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink">
              {course.title}
            </h1>
            <p className="font-reading mt-3 max-w-xl text-lg leading-relaxed text-ink-muted">
              {course.subtitle}
            </p>

            <dl className="mt-6 flex flex-wrap gap-x-7 gap-y-2 font-sans text-sm">
              <div>
                <dt className="inline text-ink-muted">Units </dt>
                <dd className="inline font-semibold text-ink">
                  {course.units.length}
                </dd>
              </div>
              <div>
                <dt className="inline text-ink-muted">Lessons </dt>
                <dd className="inline font-semibold text-ink">
                  {lessons.length - closers}
                </dd>
              </div>
              <div>
                <dt className="inline text-ink-muted">{closerLabel} </dt>
                <dd className="inline font-semibold text-ink">{closers}</dd>
              </div>
              <div>
                <dt className="inline text-ink-muted">About </dt>
                <dd className="inline font-semibold text-ink">
                  {course.estimatedHours} hours
                </dd>
              </div>
            </dl>

            {course.status === "inDevelopment" && (
              <p className="mt-6 flex flex-wrap items-center gap-2 font-sans text-sm text-ink-muted">
                <span className="inline-flex shrink-0 items-center rounded-full border border-warning-line bg-warning-soft px-2 py-0.5 font-sans text-[10px] font-semibold tracking-[0.08em] uppercase text-warning">
                  In development
                </span>
                {ready} of {lessons.length} lessons are written. The rest are
                planned and listed below, and your progress is kept as they
                arrive.
              </p>
            )}

            <div className="mt-7">
              <EnrollButton courseId={course.id} courseSlug={course.slug} />
            </div>
          </div>

          {course.art && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={course.art}
              alt=""
              width={150}
              height={150}
              className="hidden justify-self-end md:block"
            />
          )}
        </div>
      </section>

      <main className="mx-auto max-w-4xl px-6 py-14">
        <p
          className="font-reading text-reading mx-auto max-w-2xl text-ink"
          {...reveal()}
        >
          {course.description}
        </p>

        <section className="mt-12">
          <h2
            className="font-sans text-sm font-semibold tracking-wide uppercase text-ink-faint"
            {...reveal()}
          >
            What this course gives you
          </h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {course.highlights.map((highlight, index) => (
              <li
                key={highlight.title}
                className="press rounded-card border border-line bg-paper p-5 shadow-card hover:-translate-y-0.5 hover:shadow-card-hover"
                {...reveal(index * 70)}
              >
                <h3 className="font-sans text-base font-semibold text-ink">
                  {highlight.title}
                </h3>
                <p className="mt-1.5 font-sans text-sm leading-relaxed text-ink-muted">
                  {highlight.body}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14">
          <h2
            className="font-sans text-sm font-semibold tracking-wide uppercase text-ink-faint"
            {...reveal()}
          >
            The roadmap
          </h2>
          <p className="mt-1.5 font-sans text-sm text-ink-muted">
            Open a unit to see what it covers.
          </p>
          <ol className="mt-5 space-y-4">
            {course.units.map((unit, index) => (
              <RoadmapUnit
                key={unit.id}
                index={index}
                revealDelay={index * 70}
                unit={{
                  id: unit.id,
                  title: unit.title,
                  summary: unit.summary,
                  lessons: unit.lessons.map((lesson) => ({
                    id: lesson.id,
                    title: lesson.title,
                    kind: lesson.kind,
                    summary: lesson.summary,
                    estimatedMinutes: lesson.estimatedMinutes,
                  })),
                }}
              />
            ))}
          </ol>
        </section>

        <div
          className="mt-12 rounded-card border border-accent-line bg-accent-soft px-6 py-6 text-center"
          {...reveal()}
        >
          <p className="font-sans text-base font-semibold text-ink">
            Ready to start?
          </p>
          <p className="mt-1 font-sans text-sm text-ink-muted">
            Free, self-paced, and your progress is saved as you go.
          </p>
          <div className="mt-5 flex justify-center">
            <EnrollButton courseId={course.id} courseSlug={course.slug} />
          </div>
        </div>
      </main>
    </>
  );
}
