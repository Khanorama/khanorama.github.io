import type { Metadata } from "next";
import { SiteHeader } from "@/components/shell/SiteHeader";

export const metadata: Metadata = {
  title: "Library",
  description:
    "A free collection of computer science resources, currently in development.",
};

export default function LibraryPage() {
  return (
    <>
      <SiteHeader />

      <main className="mx-auto max-w-2xl px-6 pt-12 pb-16">
        <h1 className="text-3xl font-semibold text-ink">The Library</h1>

        <div className="mt-6 rounded-card border border-warning-line bg-warning-soft px-5 py-4">
          <p className="font-sans text-xs font-semibold tracking-wide uppercase text-warning">
            In development
          </p>
          <p className="font-reading text-reading mt-2 text-ink">
            The Library will hold a collection of resources across different
            languages, concepts and formats, for AP students, LeapCode
            students, and anyone studying computer science anywhere. All of it
            free.
          </p>
          <p className="mt-3 font-sans text-sm text-ink-muted">
            We are working on it, and expect it to be ready in Spring 2026.
          </p>
        </div>
      </main>
    </>
  );
}
