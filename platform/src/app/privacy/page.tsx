import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/shell/SiteHeader";
import { PageHero } from "@/components/shell/PageHero";
import { reveal } from "@/lib/motion/reveal";
import {
  MINIMUM_AGE,
  ORG_DESCRIPTION,
  ORG_LEGAL_NAME,
  POLICY_UPDATED,
  SUPPORT_EMAIL,
} from "@/content/site";

/**
 * Privacy policy.
 *
 * Written from an audit of what the code actually does rather than from a
 * template, which is why it can be specific: the exact Firestore fields,
 * the exact browser storage keys, and the fact that there are no cookies
 * and no analytics anywhere. A policy that overstates what is collected is
 * as misleading as one that understates it, and the specifics here were
 * checked against the running site.
 *
 * Anything that changes what is collected or where it goes has to change
 * this page too. The list of browser keys in particular will rot silently
 * if someone adds a fourth one.
 */
export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What LeapCode collects, why, where it is stored, and how to have it deleted.",
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

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />

      <PageHero
        eyebrow="Legal"
        title="Privacy"
        lede="What we collect, why we collect it, and how to get rid of it."
      />

      <main id="main" tabIndex={-1} className="mx-auto max-w-2xl px-6 pt-12 pb-16">
        <p className="font-reading text-reading text-ink" {...reveal()}>
          {ORG_LEGAL_NAME} is {ORG_DESCRIPTION} running free coding courses.
          This page describes what happens to your information when you use
          leapcode.org. It is written to be read rather than to be
          comprehensive, and if anything here is unclear you can email us and
          ask.
        </p>
        <p className="mt-2 font-sans text-xs text-ink-faint" {...reveal()}>
          Last updated {POLICY_UPDATED}.
        </p>

        <Section heading="The short version">
          <p>
            You can read everything on this site without giving us anything at
            all. We set no cookies. We run no analytics. We have no advertising,
            and nothing here is sold or shared with anyone for marketing.
          </p>
          <p>
            If you create an account, we hold your email address, the name you
            give us, and your progress through the courses. That is the entire
            list.
          </p>
        </Section>

        <Section heading="If you only read" delay={60}>
          <p>
            Nothing is collected and nothing is stored on your device, beyond
            the light or dark setting if you change it. We confirmed this by
            loading the site fresh and checking: no cookies are set, no data is
            written, and no request goes to any company other than the one
            serving the page.
          </p>
        </Section>

        <Section heading="If you create an account" delay={80}>
          <p>We hold three things.</p>
          <p>
            <strong>Your email address.</strong> Used to sign you in, to let you
            reset a forgotten password, and to contact you if something about
            your account needs it. We do not send newsletters.
          </p>
          <p>
            <strong>The name you give us.</strong> Shown back to you so the site
            can greet you. It does not have to be your real name.
          </p>
          <p>
            <strong>Your course progress.</strong> Which lessons you have
            finished, which exercises you have passed, and the code you typed
            into exercises, so you can leave in the middle of something and come
            back to it on another device.
          </p>
          <p>
            Your password is handled by Google&rsquo;s authentication service
            and stored hashed. Nobody at LeapCode can see it, and we cannot
            recover it for you.
          </p>
          <p>
            If you sign in with Google instead, Google tells us your email
            address, your name and an account identifier. We do not receive your
            Google password or anything else from your Google account.
          </p>
        </Section>

        <Section heading="What we deliberately do not collect" delay={100}>
          <p>
            No analytics or tracking of any kind. No advertising identifiers. No
            location. No contacts. No device fingerprinting. We do not ask your
            age beyond the minimum below, your school, or where you live.
          </p>
          <p>
            <strong>Your code never leaves your browser while it runs.</strong>{" "}
            Python in the lessons executes on your own device, not on a server.
            The only reason any of it reaches us is so your work is still there
            when you come back.
          </p>
        </Section>

        <Section heading="Who else is involved" delay={120}>
          <p>
            <strong>Google.</strong> We use Firebase Authentication and Cloud
            Firestore to handle sign-in and to store progress. Google processes
            this on our behalf, on servers in the United States.
          </p>
          <p>
            <strong>GitHub.</strong> The site is hosted on GitHub Pages. Like
            any web host, GitHub receives the network requests that load the
            page, which includes your IP address.
          </p>
          <p>
            <strong>Discord.</strong> Only if you choose to follow our invite
            link. Discord is a separate service with its own policy, and we have
            no access to anything you do there beyond what any member of the
            server can see.
          </p>
          <p>
            There are no other third parties. Fonts and the Python runtime are
            served from this site rather than from anyone else&rsquo;s network,
            so loading a page tells no one but our host that you were here.
          </p>
        </Section>

        <Section heading="How long we keep it" delay={140}>
          <p>
            For as long as your account exists. We do not have a schedule for
            deleting inactive accounts, so if you want yours gone you need to
            ask.
          </p>
        </Section>

        <Section heading="Getting your data, or deleting it" delay={160}>
          <p>
            Email{" "}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-accent transition-colors duration-[var(--dur-base)] ease-soft hover:text-accent-hover"
            >
              {SUPPORT_EMAIL}
            </a>{" "}
            from the address on the account and tell us what you want:
          </p>
          <p>
            <strong>A copy</strong> of everything we hold about you.{" "}
            <strong>A correction</strong> if something is wrong.{" "}
            <strong>Deletion</strong> of your account and your progress.
          </p>
          <p>
            We will do it within 30 days and confirm when it is done. Deletion
            removes your sign-in record and your stored progress, and it cannot
            be undone. Anything saved in your own browser is cleared by clearing
            your browser data, which is covered on the{" "}
            <Link
              href="/cookies/"
              className="text-accent transition-colors duration-[var(--dur-base)] ease-soft hover:text-accent-hover"
            >
              cookies and storage
            </Link>{" "}
            page.
          </p>
          <p>
            <strong>You can also do it yourself.</strong> Signed in, go to your{" "}
            <Link
              href="/account/"
              className="text-accent transition-colors duration-[var(--dur-base)] ease-soft hover:text-accent-hover"
            >
              account page
            </Link>{" "}
            and choose &ldquo;delete your account&rdquo;. It happens immediately
            and nobody has to read an email first.
          </p>
        </Section>

        <Section heading="Age" delay={180}>
          <p>
            Accounts are for people aged {MINIMUM_AGE} and over. We do not
            knowingly collect anything from children under {MINIMUM_AGE}. If you
            believe a child under {MINIMUM_AGE} has created an account, email us
            and we will delete it.
          </p>
          <p>Anyone can read the courses without an account, at any age.</p>
        </Section>

        <Section heading="Security, honestly" delay={200}>
          <p>
            Access to your progress is restricted to your own signed-in account,
            enforced by rules on the database rather than only by the app.
            Passwords are hashed by Google and never reach us.
          </p>
          <p>
            We are students running this in our spare time, not a security team.
            Please do not store anything sensitive in an exercise, and do not
            reuse a password you use anywhere that matters.
          </p>
        </Section>

        <Section heading="Changes" delay={220}>
          <p>
            If we change what we collect, we will change this page and update
            the date at the top. If the change is significant and you have an
            account, we will email you.
          </p>
        </Section>

        <Section heading="Asking us something" delay={240}>
          <p>
            Email{" "}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-accent transition-colors duration-[var(--dur-base)] ease-soft hover:text-accent-hover"
            >
              {SUPPORT_EMAIL}
            </a>
            . A real person reads it.
          </p>
        </Section>
      </main>
    </>
  );
}
