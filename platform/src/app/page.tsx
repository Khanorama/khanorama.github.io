import Link from "next/link";
import { SiteHeader } from "@/components/shell/SiteHeader";
import { reveal } from "@/lib/motion/reveal";
import { HomeHero } from "@/components/shell/HomeHero";
import { Catalog, type CatalogCourse } from "@/components/course/Catalog";
import { courses } from "@/content/registry";
import { gradedBlocks } from "@/content/types";
import { MISSION, SUPPORT_EMAIL } from "@/content/site";

/**
 * The home page.
 *
 * Structured as alternating bands rather than one long column, which is what
 * the original site did and what stops a page reading like a document. Every
 * other section sits on the warm surface tone, so the eye has something to
 * step down.
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
    status: course.status,
    unitCount: course.units.length,
    art: course.art,
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

      <main>
        <HomeHero />

        <div id="courses" className="mx-auto max-w-5xl px-6 py-14 scroll-mt-20">
          <Catalog courses={buildCatalog()} />
        </div>

        <section className="border-y border-line bg-surface">
          <div className="mx-auto grid max-w-5xl items-center gap-10 px-6 py-14 md:grid-cols-[0.9fr_1.1fr]">
            <img
              src="/art/mission.webp"
              alt=""
              width={420}
              height={236}
              loading="lazy"
              className="w-full max-w-sm justify-self-center"
              {...reveal()}
            />
            <div {...reveal(110)}>
              <h2 className="font-sans text-sm font-semibold tracking-wide uppercase text-accent">
                Our mission
              </h2>
              <p className="font-reading text-reading mt-3 text-ink">
                {MISSION[0]}
              </p>
              <Link
                href="/about/"
                className="mt-4 inline-block font-sans text-sm font-semibold text-accent transition-colors duration-[var(--dur-base)] ease-soft hover:text-accent-hover"
              >
                More about LeapCode
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-14">
          <h2
            className="font-sans text-sm font-semibold tracking-wide uppercase text-ink-faint"
            {...reveal()}
          >
            More from LeapCode
          </h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                href: "/about/",
                title: "About",
                blurb: "Our mission, the team, and the community.",
              },
              {
                href: "/compete/",
                title: "Compete",
                blurb: "Hackathons, contests and challenges.",
              },
              {
                href: "/library/",
                title: "Library",
                blurb: "Free CS resources. In development.",
              },
              {
                href: "/support/",
                title: "Support",
                blurb: "Volunteer and help more students learn.",
              },
            ].map((item, index) => (
              <li key={item.href} {...reveal(index * 80)}>
                <Link
                  href={item.href}
                  className="press group block h-full rounded-card border border-line bg-paper px-5 py-4 shadow-card hover:-translate-y-0.5 hover:border-accent-line hover:shadow-card-hover"
                >
                  <span className="block font-sans text-base font-semibold text-ink group-hover:text-accent">
                    {item.title}
                  </span>
                  <span className="mt-1 block font-sans text-sm text-ink-muted">
                    {item.blurb}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="border-t border-line bg-surface">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-8">
          <span className="font-brand text-sm font-bold tracking-[0.1em] text-ink-faint uppercase">
            Code. Compete. Connect.
          </span>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="font-sans text-sm text-accent hover:text-accent-hover"
          >
            {SUPPORT_EMAIL}
          </a>
        </div>
      </footer>
    </>
  );
}
