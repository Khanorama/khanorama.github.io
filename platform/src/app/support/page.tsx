import type { Metadata } from "next";
import { SiteHeader } from "@/components/shell/SiteHeader";
import { SUPPORT_EMAIL } from "@/content/site";

export const metadata: Metadata = {
  title: "Support",
  description: "Volunteer with LeapCode and help more students learn to code.",
};

export default function SupportPage() {
  return (
    <>
      <SiteHeader />

      <main className="mx-auto max-w-2xl px-6 pt-12 pb-16">
        <h1 className="text-3xl font-semibold text-ink">Support LeapCode</h1>
        <p className="mt-1.5 font-sans text-sm text-ink-muted">
          Be part of a powerful cause.
        </p>

        <section className="mt-10">
          <h2 className="font-sans text-sm font-semibold tracking-wide uppercase text-accent">
            Volunteer with us
          </h2>
          <p className="font-reading text-reading mt-4 text-ink">
            We are always looking for people who want to help, whether that is
            teaching an online course, helping run an in-person event, or
            lending a hand with something smaller. Every bit of it makes a
            difference, and we are genuinely grateful for it.
          </p>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="mt-5 inline-flex items-center rounded-control bg-accent px-4 py-2.5 font-sans text-sm font-medium text-ink-inverse transition-colors hover:bg-accent-hover"
          >
            Get in touch
          </a>
        </section>
      </main>
    </>
  );
}
