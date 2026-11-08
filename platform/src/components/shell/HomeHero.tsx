"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readUserHint, useAuth } from "@/lib/auth/AuthProvider";
import { useProgress } from "@/lib/progress/useProgress";

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
  const progress = useProgress();
  const [hintedName, setHintedName] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setHintedName(firstName(readUserHint()?.name));
    setMounted(true);
  }, []);

  const hasProgress = Object.keys(progress.lessons).length > 0;
  const name = firstName(user?.displayName) ?? hintedName;
  const returning =
    status === "signedIn" || (mounted && (Boolean(hintedName) || hasProgress));

  if (returning) {
    return (
      <section className="brand-glow border-b border-line bg-surface">
        <div className="mx-auto flex max-w-5xl flex-wrap items-end justify-between gap-4 px-6 py-10">
          <div>
            <p className="font-sans text-xs font-semibold tracking-[0.12em] uppercase text-accent">
              Welcome back
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">
              {name ? `Good to see you, ${name}.` : "Good to see you again."}
            </h1>
          </div>
          <Link
            href="/about/"
            className="font-sans text-sm text-accent hover:text-accent-hover"
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
        <p className="font-brand text-6xl font-black tracking-tight whitespace-nowrap sm:text-7xl md:text-8xl">
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
        </p>

        <p className="font-brand mt-5 text-sm font-bold tracking-[0.18em] uppercase text-ink-muted sm:text-base">
          Code. Compete. Connect.
        </p>

        <p className="font-reading mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
          Courses, competitions and resources for anyone learning to code,
          from a first line to a foundation worth building on. Free, and
          taught by people who remember being beginners.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="#courses"
            className="inline-flex items-center rounded-control bg-accent px-6 py-3 font-sans text-sm font-semibold text-ink-inverse shadow-card transition-all hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-card-hover"
          >
            Explore courses
          </Link>
          <Link
            href="/about/"
            className="inline-flex items-center rounded-control border border-line-strong bg-paper px-6 py-3 font-sans text-sm font-semibold text-ink transition-colors hover:bg-surface-raised"
          >
            About LeapCode
          </Link>
        </div>
      </div>
    </section>
  );
}
