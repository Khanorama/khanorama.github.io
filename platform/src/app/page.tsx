import Link from "next/link";
import { SiteHeader } from "@/components/shell/SiteHeader";
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
    unitCount: course.units.length,
    art: course.slug === "python-i" ? "/art/python.webp" : undefined,
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
        <section className="border-b border-line bg-surface">
          <div className="mx-auto grid max-w-5xl items-center gap-10 px-6 py-16 md:grid-cols-[1.15fr_0.85fr] md:py-20">
            <div>
              <p className="font-brand text-sm font-bold tracking-[0.12em] uppercase text-accent">
                Code. Compete. Connect.
              </p>
              <h1 className="mt-3 text-4xl leading-[1.08] font-semibold tracking-tight text-ink md:text-5xl">
                Learn to code by
                <br className="hidden sm:block" /> writing it.
              </h1>
              <p className="font-reading mt-5 max-w-lg text-lg leading-relaxed text-ink-muted">
                Our courses run real code in your browser. Nothing to install,
                no setup, and the exercises check your work as you go, so you
                find out whether you have understood something while you are
                still looking at it.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href="/courses/python-i/"
                  className="inline-flex items-center rounded-control bg-accent px-5 py-3 font-sans text-sm font-semibold text-ink-inverse shadow-card transition-all hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-card-hover"
                >
                  Start Python I
                </Link>
                <Link
                  href="/about/"
                  className="inline-flex items-center rounded-control border border-line-strong bg-paper px-5 py-3 font-sans text-sm font-semibold text-ink transition-colors hover:bg-surface-raised"
                >
                  About LeapCode
                </Link>
              </div>
            </div>

            {/*
              The course marks, scaled by what actually exists. Python is the
              course you can take today, so it leads; Java and machine
              learning sit behind it at half the size. The hierarchy is the
              honest message, and it saves the hero from claiming a catalogue
              that is not built yet.
            */}
            <div className="hidden flex-col items-center gap-5 justify-self-center md:flex">
              <img
                src="/art/python.webp"
                alt=""
                width={176}
                height={176}
                className="h-44 w-44 drop-shadow-[0_12px_24px_rgba(20,32,47,0.14)]"
              />
              <div className="flex items-center gap-6 opacity-70">
                <img src="/art/java.webp" alt="" width={64} height={64} className="h-16 w-16" />
                <img src="/art/ai.webp" alt="" width={64} height={64} className="h-16 w-16" />
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-5xl px-6 py-14">
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
            />
            <div>
              <h2 className="font-sans text-sm font-semibold tracking-wide uppercase text-accent">
                Our mission
              </h2>
              <p className="font-reading text-reading mt-3 text-ink">
                {MISSION[0]}
              </p>
              <Link
                href="/about/"
                className="mt-4 inline-block font-sans text-sm font-semibold text-accent hover:text-accent-hover"
              >
                More about LeapCode
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-14">
          <h2 className="font-sans text-sm font-semibold tracking-wide uppercase text-ink-faint">
            More from LeapCode
          </h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-3">
            {[
              {
                href: "/about/",
                title: "About",
                blurb: "Our mission, the team, and the community.",
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
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group block h-full rounded-card border border-line bg-paper px-5 py-4 shadow-card transition-all hover:-translate-y-0.5 hover:border-accent-line hover:shadow-card-hover"
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
