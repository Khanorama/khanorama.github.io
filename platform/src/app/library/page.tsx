import type { Metadata } from "next";
import { SiteHeader } from "@/components/shell/SiteHeader";
import { PageHero } from "@/components/shell/PageHero";
import { reveal } from "@/lib/motion/reveal";

export const metadata: Metadata = {
  title: "Library",
  description:
    "A free collection of computer science resources, currently in development.",
};

export default function LibraryPage() {
  return (
    <>
      <SiteHeader />

      <PageHero
        eyebrow="Coming soon"
        title="The Library"
        lede="Free resources for anyone studying computer science."
        art={{ src: "/art/library.webp", width: 190, height: 166 }}
      />

      <main id="main" tabIndex={-1} className="mx-auto max-w-2xl px-6 pt-12 pb-16">
        <div
          className="rounded-card border border-warning-line bg-warning-soft px-5 py-4 shadow-card"
          {...reveal()}
        >
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
            We are working on it, and expect it to be ready in January 2027.
          </p>
        </div>
      </main>
    </>
  );
}
