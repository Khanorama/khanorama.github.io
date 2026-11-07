import { SiteHeader } from "@/components/shell/SiteHeader";
import {
  CourseOutline,
  type OutlineUnit,
} from "@/components/course/CourseOutline";
import { pythonI } from "@/content/courses/python-i";
import { courseLessons, gradedBlocks } from "@/content/types";

/**
 * Interim course outline. Replaced by the real catalog and dashboard once
 * accounts exist; for now it is the way into the lessons.
 *
 * The outline is reduced to ids here, on the server, so the client receives
 * what it needs to draw progress and nothing else. Lesson prose, solutions
 * and expected answers stay out of this payload.
 */
function buildOutline(): OutlineUnit[] {
  return pythonI.units.map((unit) => ({
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
}

export default function Home() {
  const lessons = courseLessons(pythonI);
  const written = lessons.filter((lesson) => lesson.blocks.length > 0).length;

  return (
    <>
      <SiteHeader />

      <main className="mx-auto max-w-2xl px-6 pt-10 pb-16">
        <p className="font-sans text-xs font-semibold tracking-wide uppercase text-accent">
          {pythonI.level}
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-ink">{pythonI.title}</h1>
        <p className="mt-1.5 font-sans text-sm text-ink-muted">
          {pythonI.subtitle}
        </p>

        <p className="font-reading text-reading mt-5 text-ink">
          {pythonI.description}
        </p>

        <div className="mt-6 flex items-center gap-4 border-y border-line py-3 font-sans text-sm text-ink-muted">
          <span>
            <span className="font-semibold text-ink">{pythonI.units.length}</span>{" "}
            units
          </span>
          <span className="text-line-strong">/</span>
          <span>
            <span className="font-semibold text-ink">{lessons.length}</span> lessons
          </span>
          <span className="text-line-strong">/</span>
          <span>
            <span className="font-semibold text-success">{written}</span> written
          </span>
        </div>

        <CourseOutline courseSlug={pythonI.slug} units={buildOutline()} />
      </main>
    </>
  );
}
