import { SiteHeader } from "@/components/shell/SiteHeader";
import { Catalog, type CatalogCourse } from "@/components/course/Catalog";
import { courses } from "@/content/registry";
import { gradedBlocks } from "@/content/types";

/**
 * The home page.
 *
 * Deliberately not a course page. The catalog is the entry point, so adding a
 * second course changes nothing structurally, and a returning student lands
 * on what they were doing rather than on an outline they have to re-read.
 *
 * Courses are flattened to ids here, on the server, so the browser receives
 * what it needs to compute progress and nothing more.
 */
function buildCatalog(): CatalogCourse[] {
  return courses.map((course) => ({
    id: course.id,
    slug: course.slug,
    title: course.title,
    subtitle: course.subtitle,
    level: course.level,
    unitCount: course.units.length,
    lessons: course.units.flatMap((unit) =>
      unit.lessons.map((lesson) => ({
        id: lesson.id,
        slug: lesson.slug,
        unitSlug: unit.slug,
        title: lesson.title,
        kind: lesson.kind,
        gradedBlockIds: gradedBlocks(lesson).map((block) => block.id),
        written: lesson.blocks.length > 0,
      })),
    ),
  }));
}

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main className="mx-auto max-w-2xl px-6 pt-14 pb-16">
        <h1 className="text-4xl font-semibold tracking-tight text-ink">
          Learn Python by writing it.
        </h1>
        <p className="font-reading text-reading mt-4 text-ink">
          Every lesson runs real Python in your browser. Nothing to install, no
          setup, and the exercises check your work as you go, so you find out
          whether you have understood something while you are still looking at
          it.
        </p>

        <Catalog courses={buildCatalog()} />
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-3 px-6 py-6">
          <span className="font-brand text-sm font-bold tracking-wide text-ink-faint">
            Code. Compete. Connect.
          </span>
          <a
            href="mailto:support@leapcode.org"
            className="font-sans text-sm text-accent hover:text-accent-hover"
          >
            support@leapcode.org
          </a>
        </div>
      </footer>
    </>
  );
}
