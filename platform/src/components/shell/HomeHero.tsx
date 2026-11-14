"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readUserHint, useAuth } from "@/lib/auth/AuthProvider";

function firstName(name: string | null | undefined): string | null {
  const trimmed = name?.trim();
  if (!trimmed) return null;
  return trimmed.split(/\s+/)[0];
}

/**
 * The top of the home page, which is two different things.
 *
 * The split is on whether this person has been here before, not on whether
 * they are signed in. Progress is kept per browser without an account, so a
 * signed-out visitor can genuinely have work in progress, and showing them
 * the newcomer pitch above a "pick up where you left off" card said two
 * contradictory things at once.
 *
 *   never been here   full welcome: the wordmark, the tagline, what this is
 *   been here before  a short greeting that gets out of the way
 *
 * The welcome is what the static HTML holds, since that is right for a first
 * visit and for anything crawling the page. A returning student would
 * otherwise watch it swap once Firebase resolves, so a cached name lets the
 * greeting render immediately; it is a hint for choosing what to draw and
 * real auth state corrects it.
 */
export function HomeHero() {
  const { status, user } = useAuth();
  const [hintedName, setHintedName] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setHintedName(firstName(readUserHint()?.name));
    setMounted(true);
  }, []);

  const name = firstName(user?.displayName) ?? hintedName;
  // Courses need an account now, so having been here means having one.
  // Leftover local progress from before that rule is not a signal.
  const returning = status === "signedIn" || (mounted && Boolean(hintedName));

  if (returning) {
    return (
      <section className="brand-glow border-b border-line bg-surface">
        <div className="mx-auto flex max-w-5xl flex-wrap items-end justify-between gap-4 px-6 py-10">
          <div className="animate-settle">
            <p className="font-sans text-xs font-semibold tracking-[0.12em] uppercase text-accent">
              Welcome back
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">
              {name ? `Good to see you, ${name}.` : "Good to see you again."}
            </h1>
          </div>
          <Link
            href="/about/"
            className="animate-settle font-sans text-sm text-accent transition-colors duration-[var(--dur-base)] ease-soft hover:text-accent-hover"
            style={{ animationDelay: "90ms" }}
          >
            About LeapCode
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="brand-glow border-b border-line bg-surface">
      <div className="mx-auto max-w-5xl px-6 py-20 text-center md:py-24">
        {/*
          The wordmark glows in dark mode, as it did on the original site:
          blue behind LEAP, green behind CODE. The tokens resolve to none in
          light, where a halo on dark text over pale paper reads as a fault.
        */}
        {/*
          The four blocks arrive in reading order, 90ms apart. The interval
          is doing the work: much shorter and they land as one block, much
          longer and the reader is waiting on the page instead of reading
          it. Delays are inline because the reduced-motion rule zeroes
          animation-delay with !important, which an inline style must not
          be able to beat.
        */}
        {/*
          An h1 rather than a p. It is the page's heading in every sense
          except the markup, and a home page with no h1 at all leaves a
          screen reader user with nothing to orient on. The styling is
          unchanged; only the element is different.
        */}
        <h1
          className="font-brand animate-rise text-6xl font-black tracking-tight whitespace-nowrap sm:text-7xl md:text-8xl"
          style={{ animationDelay: "60ms" }}
        >
          <span
            className="text-brand-blue"
            style={{ textShadow: "var(--glow-text-blue)" }}
          >
            LEAP
          </span>
          <span
            className="text-brand-green"
            style={{ textShadow: "var(--glow-text-green)" }}
          >
            CODE
          </span>
        </h1>

        <p
          className="font-brand animate-rise mt-5 text-sm font-bold tracking-[0.18em] uppercase text-ink-muted sm:text-base"
          style={{ animationDelay: "150ms" }}
        >
          Code. Compete. Connect.
        </p>

        <p
          className="font-reading animate-rise mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-muted"
          style={{ animationDelay: "240ms" }}
        >
          Courses, competitions and resources for anyone learning to code, from
          a first line to a foundation worth building on. Free, and taught by
          people who remember being beginners.
        </p>

        <div
          className="animate-rise mt-8 flex flex-wrap items-center justify-center gap-3"
          style={{ animationDelay: "330ms" }}
        >
          <Link
            href="#courses"
            className="press inline-flex items-center rounded-control bg-accent px-6 py-3 font-sans text-sm font-semibold text-ink-inverse shadow-card hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-card-hover"
          >
            Explore courses
          </Link>
          <Link
            href="/about/"
            className="press inline-flex items-center rounded-control border border-line-strong bg-paper px-6 py-3 font-sans text-sm font-semibold text-ink hover:-translate-y-0.5 hover:border-accent-line hover:bg-surface-raised"
          >
            About LeapCode
          </Link>
        </div>
      </div>
    </section>
  );
}
