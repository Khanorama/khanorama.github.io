"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";

/**
 * The second action on the empty competition page, for people who do not
 * have an account yet.
 *
 * The page around it is a server component, so this invitation rendered
 * for everyone, which meant a signed-in student was asked to create the
 * account they were already reading the page with.
 *
 * Nothing renders in the other three states. Someone signed in has no use
 * for it, and where Firebase is not configured there are no accounts to
 * create, so the invitation would lead to a form that cannot submit.
 *
 * It stays absent while the status is still loading, so it appears a
 * moment after the page rather than being there and then vanishing. A
 * control that disappears once someone has started reaching for it is the
 * worse of the two, and the Discord button beside it holds the row either
 * way.
 */
export function CreateAccountButton() {
  const { status } = useAuth();
  if (status !== "signedOut") return null;

  return (
    <Link
      href="/account/"
      className="press inline-flex items-center rounded-control border border-line-strong bg-paper px-5 py-2.5 font-sans text-sm font-semibold text-ink hover:-translate-y-0.5 hover:border-accent-line hover:bg-surface-raised"
    >
      Create an account
    </Link>
  );
}
