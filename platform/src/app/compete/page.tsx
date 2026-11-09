import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/shell/SiteHeader";
import { PageHero } from "@/components/shell/PageHero";
import { EnterButton } from "@/components/compete/EnterButton";
import { reveal } from "@/lib/motion/reveal";
import { DISCORD_INVITE, SUPPORT_EMAIL } from "@/content/site";
import {
  FORMAT_LABEL,
  STATUS_LABEL,
  liveCompetitions,
  pastCompetitions,
  type Competition,
  type CompetitionStatus,
} from "@/content/compete";

export const metadata: Metadata = {
  title: "Compete",
  description:
    "Hackathons, contests and challenges for LeapCode students. Build something in a weekend, or solve problems against the clock.",
};

/**
 * Status colour follows the system's existing meanings rather than
 * inventing a scale: blue is something you can act on, green is finished,
 * amber is time-sensitive, neutral is information.
 */
const STATUS_STYLE: Record<CompetitionStatus, string> = {
  registrationOpen: "border-accent-line bg-accent-soft text-accent",
  running: "border-warning-line bg-warning-soft text-warning",
  judging: "border-warning-line bg-warning-soft text-warning",
  announced: "border-line bg-surface text-ink-faint",
  finished: "border-success-line bg-success-soft text-success",
};

export default function CompetePage() {
  const live = liveCompetitions();
  const past = pastCompetitions();

  return (
    <>
      <SiteHeader />

      <PageHero
        eyebrow="Code. Compete. Connect."
        title="Compete"
        lede="Hackathons, contests and challenges. Build something in a weekend, or solve problems against the clock."
      />

      <main className="mx-auto max-w-3xl px-6 pt-12 pb-16">
        {live.length > 0 ? (
          <section>
            <h2
              className="font-sans text-sm font-semibold tracking-wide uppercase text-accent"
              {...reveal()}
            >
              On now and coming up
            </h2>
            <ul className="mt-5 space-y-5">
              {live.map((competition, index) => (
                <CompetitionCard
                  key={competition.id}
                  competition={competition}
                  delay={index * 70}
                />
              ))}
            </ul>
          </section>
        ) : (
          <NothingYet />
        )}

        <HowItWorks />

        {past.length > 0 && (
          <section className="mt-14">
            <h2
              className="font-sans text-sm font-semibold tracking-wide uppercase text-ink-faint"
              {...reveal()}
            >
              Previously
            </h2>
            <ul className="mt-5 space-y-5">
              {past.map((competition, index) => (
                <CompetitionCard
                  key={competition.id}
                  competition={competition}
                  delay={index * 70}
                />
              ))}
            </ul>
          </section>
        )}
      </main>
    </>
  );
}

function CompetitionCard({
  competition,
  delay,
}: {
  competition: Competition;
  delay: number;
}) {
  return (
    <li
      className="rounded-card border border-line bg-paper p-6 shadow-card transition-shadow duration-[var(--dur-base)] ease-snap hover:shadow-card-hover"
      {...reveal(delay)}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={[
            "inline-flex shrink-0 items-center rounded-full border px-2 py-0.5",
            "font-sans text-[10px] font-semibold tracking-[0.08em] uppercase",
            STATUS_STYLE[competition.status],
          ].join(" ")}
        >
          {STATUS_LABEL[competition.status]}
        </span>
        <span className="font-sans text-xs text-ink-faint">
          {FORMAT_LABEL[competition.format]}
        </span>
      </div>

      <h3 className="mt-3 font-sans text-xl font-semibold text-ink">
        {competition.title}
      </h3>
      <p className="mt-1 font-sans text-sm text-ink-muted">
        {competition.tagline}
      </p>

      <dl className="mt-5 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
        <Fact label="When">
          {competition.whenIso ? (
            <time dateTime={competition.whenIso}>{competition.when}</time>
          ) : (
            competition.when
          )}
        </Fact>
        <Fact label="Where">{competition.where}</Fact>
        <Fact label="Who">{competition.who}</Fact>
        <Fact label="Teams">{competition.teamSize}</Fact>
      </dl>

      <p className="font-reading mt-5 text-reading text-ink">
        {competition.summary}
      </p>

      {competition.details?.map((paragraph) => (
        <p
          key={paragraph.slice(0, 24)}
          className="mt-3 font-sans text-sm leading-relaxed text-ink-muted"
        >
          {paragraph}
        </p>
      ))}

      {competition.prizes && competition.prizes.length > 0 && (
        <div className="mt-5">
          <p className="font-sans text-xs font-semibold tracking-wide uppercase text-ink-faint">
            Prizes
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 marker:text-accent">
            {competition.prizes.map((prize) => (
              <li key={prize} className="font-sans text-sm text-ink-muted">
                {prize}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 border-t border-line pt-5">
        <EnterButton competition={competition} />
      </div>
    </li>
  );
}

function Fact({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="font-sans text-xs font-semibold tracking-wide uppercase text-ink-faint">
        {label}
      </dt>
      <dd className="mt-0.5 font-sans text-sm text-ink">{children}</dd>
    </div>
  );
}

/**
 * Shown while nothing is scheduled.
 *
 * It does the two useful things an empty page can: say plainly that there
 * is nothing yet, and give someone a way to hear about the first one. An
 * empty state that only apologises wastes the visit.
 */
function NothingYet() {
  return (
    <section
      className="rounded-card border border-line border-dashed bg-surface px-6 py-8 text-center"
      {...reveal()}
    >
      <h2 className="font-sans text-lg font-semibold text-ink">
        Nothing running just yet
      </h2>
      <p className="font-reading mx-auto mt-3 max-w-lg text-reading text-ink-muted">
        The first competition is being put together now. When it is dated it
        will appear here, and anyone with a LeapCode account can enter.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <a
          href={DISCORD_INVITE}
          target="_blank"
          rel="noopener noreferrer"
          className="press inline-flex items-center rounded-control bg-accent px-5 py-2.5 font-sans text-sm font-semibold text-ink-inverse shadow-card hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-card-hover"
        >
          Hear about it first
        </a>
        <Link
          href="/account"
          className="press inline-flex items-center rounded-control border border-line-strong bg-paper px-5 py-2.5 font-sans text-sm font-semibold text-ink hover:-translate-y-0.5 hover:border-accent-line hover:bg-surface-raised"
        >
          Create an account
        </Link>
      </div>
      <p className="mt-5 font-sans text-xs text-ink-faint">
        Announcements go out on the Discord.
      </p>
    </section>
  );
}

function HowItWorks() {
  const points = [
    {
      title: "Open to every student",
      body: "You do not need to have finished a course, or any course. Several of these are designed so that a beginner who has written a few loops can take part and finish something.",
    },
    {
      title: "An account, and that is all",
      body: "Entering needs a LeapCode account so we know who built what and can reach you about results. There is no fee for anything here, and there never will be.",
    },
    {
      title: "Solo or with other people",
      body: "Most events allow teams. If you do not have one, the Discord is where people find each other, and we pair up anyone who asks.",
    },
    {
      title: "Judged by people, with feedback",
      body: "Entries are read by the people who teach here. Everyone who submits gets written feedback, which for most students turns out to be worth more than the placing.",
    },
  ];

  return (
    <section className="mt-14">
      <h2
        className="font-sans text-sm font-semibold tracking-wide uppercase text-ink-faint"
        {...reveal()}
      >
        How these work
      </h2>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2">
        {points.map((point, index) => (
          <li
            key={point.title}
            className="press rounded-card border border-line bg-paper p-5 shadow-card hover:-translate-y-0.5 hover:shadow-card-hover"
            {...reveal(index * 70)}
          >
            <h3 className="font-sans text-base font-semibold text-ink">
              {point.title}
            </h3>
            <p className="mt-1.5 font-sans text-sm leading-relaxed text-ink-muted">
              {point.body}
            </p>
          </li>
        ))}
      </ul>

      <p className="mt-6 font-sans text-sm text-ink-muted" {...reveal()}>
        Want to run one, sponsor one, or suggest a theme? Email{" "}
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="text-accent transition-colors duration-[var(--dur-base)] ease-soft hover:text-accent-hover"
        >
          {SUPPORT_EMAIL}
        </a>
        .
      </p>
    </section>
  );
}
