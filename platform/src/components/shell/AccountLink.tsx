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
 */
export function AccountLink() {
  const { status, user } = useAuth();

  if (status === "unavailable" || status === "loading") {
    return <span className="h-8 w-px" aria-hidden="true" />;
  }

  if (status === "signedOut" || !user) {
    return (
      <Link
        href="/account"
        className="rounded-control px-2.5 py-1.5 font-sans text-sm text-on-navy-muted transition-colors hover:bg-navy-raised hover:text-on-navy"
      >
        Sign in
      </Link>
    );
  }

  const label = user.displayName?.trim() || user.email || "Account";

  return (
    <Link
      href="/account"
      className="flex max-w-[11rem] items-center gap-2 rounded-control px-2 py-1.5 transition-colors hover:bg-navy-raised"
      title={label}
    >
      <span
        aria-hidden="true"
        className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-navy-line font-sans text-xs font-semibold text-on-navy"
      >
        {label.charAt(0).toUpperCase()}
      </span>
      <span className="truncate font-sans text-sm text-on-navy-muted">
        {label}
      </span>
    </Link>
  );
}
