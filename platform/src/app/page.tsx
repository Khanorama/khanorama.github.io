import Link from "next/link";
import { SiteHeader } from "@/components/shell/SiteHeader";
import { pythonI } from "@/content/courses/python-i";
import { courseLessons } from "@/content/types";

/**
 * Interim course outline. Replaced by the real catalog and dashboard once
 * accounts exist; for now it is the way into the lessons.
 */
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

        <ol className="mt-8 space-y-8">
          {pythonI.units.map((unit, unitIndex) => (
            <li key={unit.id}>
              <div className="flex items-baseline gap-2.5">
                <span className="font-mono text-xs text-ink-faint">
                  {String(unitIndex + 1).padStart(2, "0")}
                </span>
                <h2 className="font-sans text-base font-semibold text-ink">
                  {unit.title}
                </h2>
              </div>
              <p className="mt-1 pl-8 font-sans text-sm text-ink-muted">
                {unit.summary}
              </p>

              <ul className="mt-3 space-y-px pl-8">
                {unit.lessons.map((lesson) => {
                  const ready = lesson.blocks.length > 0;
                  return (
                    <li key={lesson.id}>
                      <Link
                        href={`/courses/${pythonI.slug}/${unit.slug}/${lesson.slug}/`}
                        className="group flex items-center gap-3 rounded-control border border-transparent px-3 py-2 transition-colors hover:border-accent-line hover:bg-accent-soft"
                      >
                        <span
                          className={[
                            "h-1.5 w-1.5 shrink-0 rounded-full",
                            ready ? "bg-success" : "bg-line-strong",
                          ].join(" ")}
                        />
                        <span className="font-sans text-sm text-ink group-hover:text-accent">
                          {lesson.title}
                        </span>
                        {lesson.kind === "progressCheck" && (
                          <span className="rounded-control bg-surface-raised px-2 py-0.5 font-sans text-xs text-ink-faint">
                            check
                          </span>
                        )}
                        {!ready && (
                          <span className="ml-auto font-sans text-xs text-ink-faint">
                            not written yet
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ol>
      </main>
    </>
  );
}
