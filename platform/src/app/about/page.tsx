import type { Metadata } from "next";
import { SiteHeader } from "@/components/shell/SiteHeader";
import { PageHero } from "@/components/shell/PageHero";
import { reveal } from "@/lib/motion/reveal";
import { DISCORD_INVITE, MISSION, TEAM, SUPPORT_EMAIL } from "@/content/site";

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
        <section {...reveal()}>
          <h2 className="font-sans text-sm font-semibold tracking-wide uppercase text-accent">
            Our mission
          </h2>
          {MISSION.map((paragraph, index) => (
            <p
              key={paragraph.slice(0, 24)}
              className="font-reading text-reading mt-4 text-ink"
              {...reveal(index * 60)}
            >
              {paragraph}
            </p>
          ))}
        </section>

        <section className="mt-12">
          <h2
            className="font-sans text-sm font-semibold tracking-wide uppercase text-accent"
            {...reveal()}
          >
            The team
          </h2>
          <ul className="mt-6 grid gap-x-6 gap-y-9 sm:grid-cols-2">
            {TEAM.map((member, index) => (
              <li key={member.email} {...reveal(index * 70)}>
                {/*
                  Plain img rather than next/image: a static export disables
                  optimization anyway, so the component would add weight
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
                  className="h-32 w-32 rounded-full border border-line bg-surface object-cover transition-transform duration-[var(--dur-slow)] ease-snap hover:scale-[1.04]"
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

        <section className="mt-12" {...reveal()}>
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
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
            <a
              href={DISCORD_INVITE}
              target="_blank"
              rel="noopener noreferrer"
              className="press inline-flex items-center rounded-control bg-accent px-5 py-2.5 font-sans text-sm font-semibold text-ink-inverse shadow-card hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-card-hover"
            >
              Join the Discord
            </a>
            <span className="font-sans text-sm text-ink-muted">
              or email{" "}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="text-accent transition-colors duration-[var(--dur-base)] ease-soft hover:text-accent-hover"
              >
                {SUPPORT_EMAIL}
              </a>
            </span>
          </div>
        </section>
      </main>
    </>
  );
}
