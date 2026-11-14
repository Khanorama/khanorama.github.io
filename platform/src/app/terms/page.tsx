import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/shell/SiteHeader";
import { PageHero } from "@/components/shell/PageHero";
import { reveal } from "@/lib/motion/reveal";
import {
  GOVERNING_STATE,
  MINIMUM_AGE,
  ORG_DESCRIPTION,
  ORG_LEGAL_NAME,
  POLICY_UPDATED,
  SUPPORT_EMAIL,
} from "@/content/site";

/**
 * Terms of use.
 *
 * Deliberately short and in plain words, because the people agreeing to it
 * are mostly teenagers and a document nobody can read is not consent to
 * anything. The disclaimers are the parts that exist to protect an
 * unincorporated group of volunteers from being sued, and they say so
 * rather than hiding in capital letters.
 *
 * There is no payment anywhere on this site, which is why there is no
 * refund policy: a section saying "no refunds" on a service that never
 * charges would imply a possibility that does not exist.
 */
export const metadata: Metadata = {
  title: "Terms",
  description:
    "The rules for using LeapCode: who it is for, what you can do with the material, and what we do not promise.",
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

export default function TermsPage() {
  return (
    <>
      <SiteHeader />

      <PageHero
        eyebrow="Legal"
        title="Terms of use"
        lede="What you can expect from us, and what we ask of you."
      />

      <main id="main" tabIndex={-1} className="mx-auto max-w-2xl px-6 pt-12 pb-16">
        <p className="font-reading text-reading text-ink" {...reveal()}>
          By using leapcode.org you agree to what is on this page. It is short
          on purpose. If you disagree with any of it, the honest answer is to
          not use the site, and there is no hard feeling in that.
        </p>
        <p className="mt-2 font-sans text-xs text-ink-faint" {...reveal()}>
          Last updated {POLICY_UPDATED}.
        </p>

        <Section heading="Who we are">
          <p>
            {ORG_LEGAL_NAME} is {ORG_DESCRIPTION}. We are not a company and not
            a school. The site is built and run by volunteers, and everything on
            it is free.
          </p>
        </Section>

        <Section heading="Who can use it" delay={60}>
          <p>
            Anyone can read the courses. To create an account you must be at
            least {MINIMUM_AGE} years old.
          </p>
          <p>
            If you are under 18, please make sure a parent or guardian is happy
            with you signing up.
          </p>
        </Section>

        <Section heading="Your account" delay={80}>
          <p>
            Keep your password to yourself, and tell us if you think someone
            else has it. You are responsible for what happens under your
            account.
          </p>
          <p>
            Give us an email address that actually reaches you, or you will not
            be able to recover the account.
          </p>
          <p>One account per person. Do not share one.</p>
        </Section>

        <Section heading="Using the site sensibly" delay={100}>
          <p>Please do not:</p>
          <p>
            Attack the site or try to break into anyone else&rsquo;s account.
            Use the lesson runtime to mine, scan, attack or host anything.
            Scrape the course material wholesale. Upload anything illegal.
            Harass anyone, here or on our Discord.
          </p>
          <p>
            We can suspend or remove an account that does any of this, and we
            will usually just ask you to stop first.
          </p>
        </Section>

        <Section heading="The course material" delay={120}>
          <p>
            The courses, text, diagrams and exercises belong to LeapCode and the
            people who wrote them.
          </p>
          <p>
            <strong>You may</strong> use them to learn, and share links to them.
            Teachers may use them with a class, and we would love to hear from
            you if you do.
          </p>
          <p>
            <strong>Please do not</strong> republish them as your own, or sell
            them.
          </p>
          <p>
            <strong>The code you write is yours.</strong> We store it so you can
            come back to it, and claim nothing else over it.
          </p>
        </Section>

        <Section
          heading="It is free, so there is nothing to refund"
          delay={140}
        >
          <p>
            We do not charge for anything, anywhere on this site. There is no
            subscription, no paid tier and no payment details to give us. If you
            are ever asked to pay to use LeapCode, it is not us, and we would be
            grateful if you told us about it.
          </p>
        </Section>

        <Section heading="What we do not promise" delay={160}>
          <p>
            The site is provided as it is. We do not promise it will always be
            available, that it will be free of mistakes, or that it will keep
            working the way it does today. We may change courses, remove
            features or stop running the site altogether.
          </p>
          <p>
            <strong>Back up anything you care about.</strong> We take care with
            your progress, but we are volunteers running on free infrastructure
            and we cannot guarantee it against loss.
          </p>
          <p>
            Nothing here is professional, legal, financial or career advice. The
            courses explain how technology works; what you do with that is your
            decision.
          </p>
        </Section>

        <Section heading="Limits on our liability" delay={180}>
          <p>
            To the fullest extent the law allows, LeapCode and its volunteers
            are not liable for loss or damage arising from your use of the site,
            including lost work or lost progress.
          </p>
          <p>
            This exists because a group of students giving away free courses
            cannot carry the risk of a lawsuit. It is not an attempt to escape
            responsibility for treating you badly, and if we get something wrong
            we would like you to tell us.
          </p>
        </Section>

        <Section heading="Ending it" delay={200}>
          <p>
            You can stop using the site whenever you like, and ask us to delete
            your account under the{" "}
            <Link
              href="/privacy/"
              className="text-accent transition-colors duration-[var(--dur-base)] ease-soft hover:text-accent-hover"
            >
              privacy policy
            </Link>
            .
          </p>
          <p>
            We can close an account that breaks these terms. If we do, we will
            tell you why.
          </p>
        </Section>

        <Section heading="Changes" delay={220}>
          <p>
            We may update these terms. The date at the top says when they last
            changed, and if a change matters we will tell account holders by
            email rather than quietly editing the page.
          </p>
        </Section>

        <Section heading="Which law applies" delay={240}>
          <p>
            These terms are governed by the laws of the State of{" "}
            {GOVERNING_STATE}, United States, without regard to its conflict of
            law rules.
          </p>
        </Section>

        <Section heading="Contact" delay={260}>
          <p>
            Questions about any of this go to{" "}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-accent transition-colors duration-[var(--dur-base)] ease-soft hover:text-accent-hover"
            >
              {SUPPORT_EMAIL}
            </a>
            .
          </p>
        </Section>
      </main>
    </>
  );
}
