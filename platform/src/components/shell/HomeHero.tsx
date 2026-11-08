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
 * Signed out it is a welcome: the wordmark at full size and the tagline,
 * the way the original site opened, saying what LeapCode is rather than
 * naming a language. Signed in that is wasted space, so it becomes a
 * greeting and gets out of the way of the work.
 *
 * The signed-out version is what the static HTML contains, since that is
 * right for a first visit and for anything crawling the page. A returning
 * student would otherwise watch it swap once Firebase resolves, so a cached
 * name lets the greeting render immediately and be corrected if wrong.
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
  // Trust the hint only until real auth state arrives.
  const greeting =
    status === "signedIn" || (mounted && status === "loading" && hintedName);

  if (greeting) {
    return (
      <section className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-5xl flex-wrap items-end justify-between gap-4 px-6 py-10">
          <div>
            <p className="font-sans text-xs font-semibold tracking-[0.12em] uppercase text-accent">
              Welcome back
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">
              {name ? `Good to see you, ${name}.` : "Good to see you."}
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
    <section className="border-b border-line bg-surface">
      <div className="mx-auto max-w-5xl px-6 py-20 text-center md:py-24">
        <p className="font-brand text-6xl font-black tracking-tight whitespace-nowrap sm:text-7xl md:text-8xl">
          <span className="text-brand-blue">LEAP</span>
          <span className="text-brand-green">CODE</span>
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
