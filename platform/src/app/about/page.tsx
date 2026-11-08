import type { Metadata } from "next";
import { SiteHeader } from "@/components/shell/SiteHeader";
import { PageHero } from "@/components/shell/PageHero";
import { MISSION, TEAM, SUPPORT_EMAIL } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "LeapCode's mission, the people behind it, and how to join the community.",
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />

      <PageHero
        eyebrow="Code. Compete. Connect."
        title="About LeapCode"
        lede="Our story, our mission, and the people behind it."
        art={{ src: "/art/mission.webp", width: 260, height: 146 }}
      />

      <main className="mx-auto max-w-2xl px-6 pt-12 pb-16">
        <section>
          <h2 className="font-sans text-sm font-semibold tracking-wide uppercase text-accent">
            Our mission
          </h2>
          {MISSION.map((paragraph) => (
            <p
              key={paragraph.slice(0, 24)}
              className="font-reading text-reading mt-4 text-ink"
            >
              {paragraph}
            </p>
          ))}
        </section>

        <section className="mt-12">
          <h2 className="font-sans text-sm font-semibold tracking-wide uppercase text-accent">
            The team
          </h2>
          <ul className="mt-6 grid gap-x-6 gap-y-9 sm:grid-cols-2">
            {TEAM.map((member) => (
              <li key={member.email}>
                {/*
                  Plain img rather than next/image: a static export disables
                  optimisation anyway, so the component would add weight
                  without doing its job. Dimensions are set to reserve space
                  and stop the text jumping as photos load.

                  Sources are 384px for a 128px slot, so they stay sharp on a
                  retina screen without shipping the multi-megabyte originals.
                */}
                <img
                  src={member.photo}
                  alt={member.name}
                  width={128}
                  height={128}
                  loading="lazy"
                  decoding="async"
                  className="h-32 w-32 rounded-full border border-line bg-surface object-cover"
                />
                <p className="mt-3.5 font-sans text-base font-semibold text-ink">
                  {member.name}
                </p>
                <p className="mt-0.5 font-sans text-sm text-ink-muted">
                  {member.roles.join(", ")}
                </p>
                <a
                  href={`mailto:${member.email}`}
                  className="mt-1 block font-sans text-sm text-accent hover:text-accent-hover"
                >
                  {member.email}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="font-sans text-sm font-semibold tracking-wide uppercase text-accent">
            The community
          </h2>
          <p className="font-reading text-reading mt-4 text-ink">
            The LeapCode Discord is where students, coders and anyone curious
            about this stuff end up: asking questions, finding study partners,
            getting help on a project, or just talking to other people who
            write code. If you are stuck on something in a course, it is the
            fastest place to get unstuck.
          </p>
          <p className="mt-4 font-sans text-sm text-ink-muted">
            Ask us for an invite at{" "}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-accent hover:text-accent-hover"
            >
              {SUPPORT_EMAIL}
            </a>
            .
          </p>
        </section>
      </main>
    </>
  );
}
