import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/shell/SiteHeader";
import { PageHero } from "@/components/shell/PageHero";
import { reveal } from "@/lib/motion/reveal";
import { POLICY_UPDATED, SUPPORT_EMAIL } from "@/content/site";

/**
 * Accessibility statement.
 *
 * The rule this page is written under: it claims only what has actually
 * been checked, and names what has not. A statement that overstates is
 * worse than no statement, because it is a promise made to exactly the
 * people least able to work around it being false.
 *
 * So there is no "we are committed to accessibility" paragraph and no
 * claim of WCAG conformance. There is a list of what was measured, a list
 * of what was not, and the one real barrier the site has.
 *
 * KEEP THIS HONEST. If someone adds a screen reader pass, move it out of
 * the "not checked" list. If someone adds a component with a contrast
 * problem, this page is now wrong.
 */
export const metadata: Metadata = {
  title: "Accessibility",
  description:
    "What has been checked on leapcode.org, what has not, and the one place the site does not work.",
};

function Section({
  heading,
  children,
  delay = 0,
}: {
  heading: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <section className="mt-10" {...reveal(delay)}>
      <h2 className="font-sans text-sm font-semibold tracking-wide uppercase text-accent">
        {heading}
      </h2>
      <div className="mt-3 space-y-3 font-sans text-sm leading-relaxed text-ink-muted [&_strong]:text-ink">
        {children}
      </div>
    </section>
  );
}

export default function AccessibilityPage() {
  return (
    <>
      <SiteHeader />

      <PageHero
        eyebrow="Legal"
        title="Accessibility"
        lede="What we have checked, what we have not, and where the site falls short."
      />

      <main
        id="main"
        tabIndex={-1}
        className="mx-auto max-w-2xl px-6 pt-12 pb-16"
      >
        <p className="font-reading text-reading text-ink" {...reveal()}>
          We would rather tell you precisely what has been tested than promise
          that everything works. This page is the list. If you hit something it
          does not cover, please tell us, because a report from someone who ran
          into the problem is worth more than any audit we run ourselves.
        </p>
        <p className="mt-2 font-sans text-xs text-ink-faint" {...reveal()}>
          Last updated {POLICY_UPDATED}.
        </p>

        <Section heading="The one real limitation">
          <p>
            <strong>
              Lessons do not run on a phone, and that is deliberate.
            </strong>{" "}
            A lesson puts the explanation, a code editor and your
            program&rsquo;s output on one page, and below roughly 768 by 500
            pixels that stops being a worse version of the lesson and becomes a
            different and much harder one.
          </p>
          <p>
            If a phone is your only device, you cannot currently take a course.
            We think saying so is better than letting you find out after signing
            up, and the gate explains itself rather than failing silently.
            Everything else on the site, including every course outline and all
            of this, works at any size.
          </p>
          <p>
            If this is blocking you, email us. We would like to know how many
            people it affects.
          </p>
        </Section>

        <Section heading="What we have checked" delay={60}>
          <p>
            <strong>Color contrast.</strong> Every text and background pair in
            the design, computed in both the light and dark themes against the
            WCAG AA threshold of 4.5 to 1 for normal text. One pairing failed,
            used for small metadata, and it was darkened until it passed on
            every background it appears on.
          </p>
          <p>
            <strong>Images.</strong> Every image carries alt text, and the ones
            that are purely decorative carry empty alt text so a screen reader
            skips them instead of reading a filename.
          </p>
          <p>
            <strong>Forms.</strong> Every input has a real label attached to it,
            autocomplete is set so a password manager can fill them, and errors
            are announced rather than only colored.
          </p>
          <p>
            <strong>Keyboard.</strong> Every page starts with a &ldquo;skip to
            content&rdquo; link, so you are not tabbing through the navigation
            on every page. Focus is always visible. We checked that the skip
            link lands inside the content.
          </p>
          <p>
            <strong>Motion.</strong> If your system asks for reduced motion,
            every animation and transition on the site is switched off. This is
            a single rule applied globally, not something each component opts
            into, so it cannot be forgotten.
          </p>
          <p>
            <strong>Structure.</strong> Each page has a single main heading and
            one main landmark once it has loaded. Scroll animations fail safe:
            if scripts never run, content stays visible rather than hidden. The
            courses themselves do need JavaScript and an account, so those pages
            will not work with scripts turned off. Our &ldquo;page not
            found&rdquo; page is the web framework&rsquo;s default and is the
            one page without a main landmark.
          </p>
        </Section>

        <Section heading="What we have not checked" delay={80}>
          <p>
            <strong>Screen readers.</strong> We have not tested with VoiceOver,
            NVDA or JAWS. The markup is built to work with them and we have not
            confirmed that it does.
          </p>
          <p>
            <strong>The code editor.</strong> The editor used in lessons is a
            third-party component. Its keyboard behavior is good, but we have
            not audited it ourselves and cannot vouch for it.
          </p>
          <p>
            <strong>Zoom and magnification</strong> beyond ordinary browser
            zoom, and <strong>voice control</strong> software.
          </p>
          <p>
            <strong>A formal audit.</strong> Nobody independent has reviewed
            this site. We make no claim of WCAG conformance, because we have not
            done the work that would justify one.
          </p>
        </Section>

        <Section heading="Telling us something is wrong" delay={100}>
          <p>
            Email{" "}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-accent transition-colors duration-[var(--dur-base)] ease-soft hover:text-accent-hover"
            >
              {SUPPORT_EMAIL}
            </a>
            . If you can, say what page, what you were using, and what happened.
            You do not need to know the technical reason.
          </p>
          <p>
            We are volunteers, so we cannot promise a fix by a given date. We
            can promise to read it, reply, and tell you honestly whether we can
            fix it.
          </p>
        </Section>

        <Section heading="Elsewhere" delay={120}>
          <p>
            <Link
              href="/privacy/"
              className="text-accent transition-colors duration-[var(--dur-base)] ease-soft hover:text-accent-hover"
            >
              Privacy
            </Link>
            {", "}
            <Link
              href="/terms/"
              className="text-accent transition-colors duration-[var(--dur-base)] ease-soft hover:text-accent-hover"
            >
              terms of use
            </Link>
            {", and "}
            <Link
              href="/cookies/"
              className="text-accent transition-colors duration-[var(--dur-base)] ease-soft hover:text-accent-hover"
            >
              cookies and storage
            </Link>
            .
          </p>
        </Section>
      </main>
    </>
  );
}
