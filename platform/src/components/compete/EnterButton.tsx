"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";
import type { Competition } from "@/content/compete";

const BASE =
  "press inline-flex items-center justify-center rounded-control px-5 py-2.5 font-sans text-sm font-semibold";
const PRIMARY = `${BASE} bg-accent text-ink-inverse shadow-card hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-card-hover`;
const QUIET = `${BASE} border border-line-strong bg-paper text-ink`;

/**
 * The one action on a competition card.
 *
 * Entering needs an account, so this says so rather than letting someone
 * fill in a registration form and discover it afterwards. Same rule as
 * enrolling in a course, and the same honest limit: this is a product
 * gate, not a security boundary. The registration link is in the page
 * source either way.
 *
 * The disabled states are plain text rather than a grayed-out button. A
 * button you cannot press is a small lie about what is available, and
 * "Registration opens nearer the date" tells a student more than a dead
 * control does.
 */
export function EnterButton({ competition }: { competition: Competition }) {
  const { status } = useAuth();

  if (competition.status === "finished") {
    return (
      <p className="font-sans text-sm text-ink-faint">
        This one has finished.
      </p>
    );
  }

  // Dated but not yet taking entries. Nothing to click, and saying when
  // beats a button that does nothing.
  if (!competition.registerUrl) {
    return (
      <p className="font-sans text-sm text-ink-muted">
        {competition.status === "announced"
          ? "Registration opens nearer the date."
          : "Entries are closed."}
      </p>
    );
  }

  // No accounts configured at all. Rather than block everyone out of a
  // competition over a missing key, hand them the link.
  if (status === "unavailable") {
    return (
      <a
        href={competition.registerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={PRIMARY}
      >
        Enter
      </a>
    );
  }

  if (status === "loading") {
    return (
      <span className={`${QUIET} cursor-default opacity-60`} aria-hidden="true">
        Enter
      </span>
    );
  }

  if (status === "signedOut") {
    return (
      <Link href="/account" className={QUIET}>
        Sign in to enter
      </Link>
    );
  }

  return (
    <a
      href={competition.registerUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={PRIMARY}
    >
      Enter
    </a>
  );
}
