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
        <div>
          {eyebrow && (
            <p className="font-sans text-xs font-semibold tracking-[0.12em] uppercase text-accent">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            {title}
          </h1>
          {lede && (
            <p className="font-reading mt-3 max-w-xl text-lg leading-relaxed text-ink-muted">
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
            className="hidden justify-self-end md:block"
          />
        )}
      </div>
    </section>
  );
}
