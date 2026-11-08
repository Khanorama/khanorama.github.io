import type { ReactNode } from "react";

interface PageHeroProps {
  /** Small coloured line above the title. Usually a category or tagline. */
  eyebrow?: string;
  title: string;
  lede?: string;
  /** Decorative illustration, shown only where there is room for it. */
  art?: { src: string; width: number; height: number };
  children?: ReactNode;
}

/**
 * The banded header every page opens with.
 *
 * One shared treatment is the point. Each page having its own idea of what a
 * title looks like is what makes a site read as a pile of separate pages
 * rather than one place, and the warm band gives the eye somewhere to land
 * before the content starts.
 */
export function PageHero({ eyebrow, title, lede, art, children }: PageHeroProps) {
  return (
    <section className="brand-glow border-b border-line bg-surface">
      <div
        className={[
          "mx-auto max-w-4xl items-center gap-8 px-6 py-12",
          art ? "grid md:grid-cols-[1fr_auto]" : "",
        ].join(" ")}
      >
        {/*
          The band animates on load rather than on scroll, since it is above
          the fold on every page and a scroll reveal would never fire. Same
          90ms interval as the home hero, so arriving at any page feels like
          arriving at the same site.
        */}
        <div>
          {eyebrow && (
            <p className="animate-settle font-sans text-xs font-semibold tracking-[0.12em] uppercase text-accent">
              {eyebrow}
            </p>
          )}
          <h1
            className="animate-settle mt-2 text-3xl font-semibold tracking-tight text-ink md:text-4xl"
            style={{ animationDelay: "90ms" }}
          >
            {title}
          </h1>
          {lede && (
            <p
              className="font-reading animate-settle mt-3 max-w-xl text-lg leading-relaxed text-ink-muted"
              style={{ animationDelay: "180ms" }}
            >
              {lede}
            </p>
          )}
          {children}
        </div>

        {art && (
          <img
            src={art.src}
            alt=""
            width={art.width}
            height={art.height}
            className="animate-rise hidden justify-self-end md:block"
            style={{ animationDelay: "160ms" }}
          />
        )}
      </div>
    </section>
  );
}
