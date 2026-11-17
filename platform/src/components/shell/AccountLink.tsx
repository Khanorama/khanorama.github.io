"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";

/**
 * Account state in the header.
 *
 * Shows nothing at all when accounts are not configured, rather than a
 * sign-in link that leads to a dead end. Shows nothing while the auth state
 * is still resolving either, because flashing "Sign in" at someone who is
 * already signed in reads as being logged out.
 *
 * Signed out, this is drawn as a control rather than a fifth word in the
 * navigation. It used to share the nav's type and color exactly, so the
 * one thing on the bar that performs an action looked like one more place
 * to go. The outline borrows the blue from the wordmark instead of
 * introducing a color, which keeps it attached to the brand and still
 * lets the green current-page marker read as something else entirely.
 *
 * Signed in, the same outline holds the avatar and name, so the account
 * stays one recognizable object on the bar whichever state it is in.
 */
export function AccountLink() {
  const { status, user } = useAuth();

  if (status === "unavailable" || status === "loading") {
    return <span className="h-8 w-px" aria-hidden="true" />;
  }

  if (status === "signedOut" || !user) {
    return (
      <Link
        href="/account/"
        className="press rounded-control border border-brand-blue-bright/65 bg-brand-blue-bright/10 px-3 py-1.5 font-sans text-sm font-semibold whitespace-nowrap text-on-navy transition-colors duration-[var(--dur-base)] ease-soft hover:border-brand-blue-bright/90 hover:bg-brand-blue-bright/20"
      >
        Sign in
      </Link>
    );
  }

  const label = user.displayName?.trim() || user.email || "Account";

  return (
    <Link
      href="/account/"
      className="press flex max-w-[11rem] items-center gap-2 rounded-control border border-navy-line px-2 py-1 transition-colors duration-[var(--dur-base)] ease-soft hover:border-brand-blue-bright/65 hover:bg-navy-raised"
      title={label}
    >
      <span
        aria-hidden="true"
        className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-navy-line font-sans text-xs font-semibold text-on-navy"
      >
        {label.charAt(0).toUpperCase()}
      </span>
      <span className="truncate font-sans text-sm font-medium text-on-navy">
        {label}
      </span>
    </Link>
  );
}
