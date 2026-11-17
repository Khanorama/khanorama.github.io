import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/shell/SiteHeader";
import { PageHero } from "@/components/shell/PageHero";
import { courses, courseUrl } from "@/content/registry";
import { courseLessons } from "@/content/types";
import { UPCOMING } from "@/content/site";
import { reveal } from "@/lib/motion/reveal";

export const metadata: Metadata = {
  title: "Courses",
  description:
    "Every LeapCode course: Python, AI, and what is coming next. Free, taught in the browser, with your progress saved as you go.",
};

/**
 * The course catalog as a page of its own.
 *
 * The original site had one at courses.html and the nav had a Courses tab
 * pointing at it. The rebuild dropped both, which left the catalog
 * reachable only by scrolling the home page or by knowing a URL: fine for
 * someone already enrolled, bad for the visitor who arrives on the About
 * page and wants to see what is actually taught here.
 *
 * Deliberately a different shape from the shelf on the home page. That one
 * is a row of cards competing with four other sections for attention, so it
 * says as little as a card can. This page has nothing else to do, so each
 * course gets its full description and the numbers behind it, laid out in
 * alternating rows the way the original did.
 *
 * Static on purpose. Progress and enrollment belong on the course page,
 * which already shows both, and duplicating that state here would mean a
 * second client component reading the same record to render a worse
 * version of it.
 */
export default function CoursesPage() {
  return (
    <>
      <SiteHeader />

      <PageHero
        eyebrow="Learn. Code. Debug. Repeat."
        title="Our Courses"
        lede="Taught courses you work through in the browser. Every one is free, and your progress is saved as you go."
      />

      <main id="main" tabIndex={-1}>
        {courses.map((course, index) => {
          const lessons = courseLessons(course);
          const ready = lessons.filter((lesson) => lesson.blocks.length > 0);
          // The art is small (320px at most), so it is shown at a size it
          // can actually fill rather than blown up into a hero image.
          //
          // Alternating rows have to swap the TRACKS, not just the order of
          // the two children. Reordering alone leaves the narrow 9rem track
          // first, so the text lands in it and wraps two words to a line
          // while the picture stretches across the rest of the row.
          const reversed = index % 2 === 1;
          const columns = reversed
            ? "sm:grid-cols-[1fr_9rem]"
            : "sm:grid-cols-[9rem_1fr]";

          return (
            <section
              key={course.id}
              className={
                reversed ? "border-y border-line bg-surface" : undefined
              }
            >
              <div className="mx-auto max-w-4xl px-6 py-12">
                <div className={`grid items-start gap-8 ${columns}`}>
                  {course.art && (
                    <img
                      src={course.art}
                      alt=""
                      width={144}
                      height={144}
                      loading={index === 0 ? undefined : "lazy"}
                      className={[
                        "h-36 w-36 justify-self-center sm:justify-self-start",
                        reversed ? "sm:order-2" : "",
                      ].join(" ")}
                      {...reveal()}
                    />
                  )}

                  <div {...reveal(90)}>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="inline-flex rounded-full border border-line bg-surface-raised px-2 py-0.5 font-sans text-[10px] font-semibold tracking-[0.08em] uppercase text-ink-faint">
                        {course.level}
                      </span>
                      {course.status === "inDevelopment" && (
                        <span className="inline-flex rounded-full border border-warning-line bg-warning-soft px-2 py-0.5 font-sans text-[10px] font-semibold tracking-[0.08em] uppercase text-warning">
                          In development
                        </span>
                      )}
                    </div>

                    <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">
                      {course.title}
                    </h2>
                    <p className="font-reading text-reading mt-3 text-ink">
                      {course.description}
                    </p>

                    <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-1 font-sans text-sm">
                      <div>
                        <dt className="inline text-ink-muted">Units </dt>
                        <dd className="inline font-semibold text-ink tabular-nums">
                          {course.units.length}
                        </dd>
                      </div>
                      <div>
                        <dt className="inline text-ink-muted">Lessons </dt>
                        <dd className="inline font-semibold text-ink tabular-nums">
                          {course.status === "inDevelopment"
                            ? `${ready.length} of ${lessons.length} ready`
                            : lessons.length}
                        </dd>
                      </div>
                      <div>
                        <dt className="inline text-ink-muted">About </dt>
                        <dd className="inline font-semibold text-ink">
                          {course.estimatedHours} hours
                        </dd>
                      </div>
                    </dl>

                    <Link
                      href={courseUrl(course.slug)}
                      className="mt-5 inline-block font-sans text-sm font-semibold text-accent transition-colors duration-[var(--dur-base)] ease-soft hover:text-accent-hover"
                    >
                      Explore {course.title}
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          );
        })}

        <section
          className={
            courses.length % 2 === 1
              ? "border-y border-line bg-surface"
              : undefined
          }
        >
          <div className="mx-auto max-w-4xl px-6 py-12">
            <h2
              className="font-sans text-sm font-semibold tracking-wide uppercase text-ink-faint"
              {...reveal()}
            >
              Coming next
            </h2>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2">
              {UPCOMING.map((course, index) => (
                <li
                  key={course.title}
                  className="flex gap-4 rounded-card border border-dashed border-line bg-paper/60 px-5 py-4"
                  {...reveal(index * 80)}
                >
                  <img
                    src={course.art}
                    alt=""
                    width={56}
                    height={56}
                    loading="lazy"
                    className="h-14 w-14 shrink-0 opacity-55"
                  />
                  <div>
                    <p className="font-sans text-base font-semibold text-ink-muted">
                      {course.title}
                    </p>
                    <p className="mt-1 font-sans text-sm text-ink-faint">
                      {course.blurb}
                    </p>
                    <p className="mt-2 font-sans text-xs text-ink-faint">
                      {course.level}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </>
  );
}
