import type { Metadata } from "next";
import { SiteHeader } from "@/components/shell/SiteHeader";
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

      <main className="mx-auto max-w-2xl px-6 pt-12 pb-16">
        <h1 className="text-3xl font-semibold text-ink">About LeapCode</h1>
        <p className="mt-1.5 font-sans text-sm text-ink-muted">
          Our story, our mission, and the people behind it.
        </p>

        <section className="mt-10">
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
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {TEAM.map((member) => (
              <li
                key={member.email}
                className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3"
              >
                <div>
                  <p className="font-sans text-sm font-semibold text-ink">
                    {member.name}
                  </p>
                  <p className="font-sans text-sm text-ink-muted">
                    {member.roles.join(", ")}
                  </p>
                </div>
                <a
                  href={`mailto:${member.email}`}
                  className="font-sans text-sm text-accent hover:text-accent-hover"
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
