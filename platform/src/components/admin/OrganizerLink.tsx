"use client";

import Link from "next/link";
import { useIsOrganizer } from "@/lib/auth/useIsOrganizer";

/**
 * The way in to the roster, on your own account page.
 *
 * Renders nothing for everybody else, which is the whole reason it is a
 * separate component: the account page is a server-rendered shell and this
 * is the only part of it that depends on an extra Firestore read.
 *
 * It is not a permission check. Hiding a link protects nothing, and the
 * roster page is in the static export whether this renders or not. What
 * keeps student work private is the security rule that refuses the read.
 */
export function OrganizerLink() {
  const organizer = useIsOrganizer();
  if (organizer !== "yes") return null;

  return (
    <section className="mt-6">
      <h2 className="font-sans text-xs font-semibold tracking-wide uppercase text-ink-faint">
        Organizers
      </h2>
      <Link
        href="/admin/"
        className="press mt-2 inline-flex items-center rounded-control border border-line-strong bg-paper px-4 py-2 font-sans text-sm font-medium text-ink hover:-translate-y-0.5 hover:border-accent-line hover:bg-surface-raised"
      >
        Open the roster
      </Link>
    </section>
  );
}
