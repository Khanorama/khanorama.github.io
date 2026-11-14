import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/shell/SiteHeader";
import { PageHero } from "@/components/shell/PageHero";
import { reveal } from "@/lib/motion/reveal";
import { POLICY_UPDATED, SUPPORT_EMAIL } from "@/content/site";

/**
 * Cookies and storage.
 *
 * Titled "and storage" because "cookie policy" would be inaccurate: this
 * site sets no cookies at all. What it does use is a handful of
 * localStorage keys and the IndexedDB that the Firebase SDK creates, and
 * naming those honestly is more useful to a reader than a page about a
 * technology we do not use.
 *
 * The absence of a consent banner is a consequence of this rather than an
 * oversight, and the page says why. If anything is ever added that is not
 * strictly necessary, this reasoning stops holding and a banner becomes
 * required.
 *
 * KEEP THE TABLE IN STEP WITH THE CODE. The three keys below are the ones
 * that existed when this was written: leapcode-progress-v1,
 * leapcode-user-hint and leapcode-theme.
 */
export const metadata: Metadata = {
  title: "Cookies and storage",
  description:
    "LeapCode sets no cookies. This page lists what is stored in your browser instead, and why there is no consent banner.",
};

const STORED: { name: string; what: string; when: string }[] = [
  {
    name: "leapcode-theme",
    what: "Whether you chose light or dark.",
    when: "Only once you use the theme switch.",
  },
  {
    name: "leapcode-progress-v1",
    what: "Your progress through lessons and the code you typed into exercises.",
    when: "When you start a lesson, signed in or not.",
  },
  {
    name: "leapcode-user-hint",
    what: "Your first name, so a returning visit can greet you without waiting for sign-in to finish.",
    when: "When you sign in. Removed when you sign out.",
  },
  {
    name: "firebaseLocalStorageDb and firebase-heartbeat-database",
    what: "Created by Google's sign-in library to keep you signed in between visits.",
    when: "When you open a page that offers sign-in.",
  },
];

export default function CookiesPage() {
  return (
    <>
      <SiteHeader />

      <PageHero
        eyebrow="Legal"
        title="Cookies and storage"
        lede="There are no cookies. Here is what there is instead."
      />

      <main className="mx-auto max-w-2xl px-6 pt-12 pb-16">
        <p className="font-reading text-reading text-ink" {...reveal()}>
          This site sets no cookies, of any kind, at any point. We checked by
          loading it fresh and looking. What it does use is a small amount of
          storage inside your own browser, which never gets sent anywhere except
          where this page says.
        </p>
        <p className="mt-2 font-sans text-xs text-ink-faint" {...reveal()}>
          Last updated {POLICY_UPDATED}.
        </p>

        <section className="mt-10" {...reveal()}>
          <h2 className="font-sans text-sm font-semibold tracking-wide uppercase text-accent">
            What gets stored
          </h2>
          <ul className="mt-4 space-y-4">
            {STORED.map((item) => (
              <li
                key={item.name}
                className="rounded-card border border-line bg-paper p-4 shadow-card"
              >
                <p className="font-mono text-xs break-words text-ink">
                  {item.name}
                </p>
                <p className="mt-2 font-sans text-sm leading-relaxed text-ink-muted">
                  {item.what}
                </p>
                <p className="mt-1 font-sans text-xs text-ink-faint">
                  {item.when}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10" {...reveal()}>
          <h2 className="font-sans text-sm font-semibold tracking-wide uppercase text-accent">
            Why there is no banner
          </h2>
          <div className="mt-3 space-y-3 font-sans text-sm leading-relaxed text-ink-muted">
            <p>
              Consent banners exist because of storage that is not necessary to
              provide the thing you asked for: analytics, advertising, and
              tracking you between sites. We have none of that.
            </p>
            <p>
              Everything in the list above is either something you asked for by
              using the site, or the mechanics of staying signed in. Asking you
              to approve your own theme preference would be theater, and would
              train you to click through the ones that matter elsewhere.
            </p>
            <p>
              If we ever add analytics, this stops being true and a banner
              becomes necessary. We have no plans to.
            </p>
          </div>
        </section>

        <section className="mt-10" {...reveal()}>
          <h2 className="font-sans text-sm font-semibold tracking-wide uppercase text-accent">
            Clearing it
          </h2>
          <div className="mt-3 space-y-3 font-sans text-sm leading-relaxed text-ink-muted">
            <p>
              Clearing site data for leapcode.org in your browser settings
              removes all of it. You will be signed out and any progress not yet
              synced to an account will be gone.
            </p>
            <p>
              This only clears your own device. To remove progress saved to your
              account, see the{" "}
              <Link
                href="/privacy/"
                className="text-accent transition-colors duration-[var(--dur-base)] ease-soft hover:text-accent-hover"
              >
                privacy policy
              </Link>
              .
            </p>
            <p>
              Questions to{" "}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="text-accent transition-colors duration-[var(--dur-base)] ease-soft hover:text-accent-hover"
              >
                {SUPPORT_EMAIL}
              </a>
              .
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
