/**
 * Competitions: hackathons, contests and challenges.
 *
 * Content lives here as typed data for the same reason the courses do. It
 * is versioned, reviewable in a diff, and cannot be broken at runtime by a
 * bad write. Adding a competition is an edit to the array at the bottom of
 * this file and nothing else.
 *
 * TWO DECISIONS WORTH KNOWING ABOUT BEFORE EDITING THIS FILE.
 *
 * Status is written down, not worked out from the dates. It would be easy
 * to compare `opens` against the clock and decide whether registration is
 * open, and it would be wrong twice over: this site is a static export, so
 * the HTML is generated once at build time and would go stale the moment a
 * deadline passed, and computing it in the browser instead renders
 * something different from the prerendered markup, which React reports as a
 * hydration error. One authored word is always correct and never drifts.
 *
 * Dates are written the way a person would say them. A machine-readable
 * ISO value is optional and only used for the <time> element, so a date
 * can read "Saturday 7 March, 10am to 8pm CST" rather than whatever a
 * formatter decides, and no timezone guessing happens in anyone's browser.
 */

export type CompetitionFormat = "hackathon" | "contest" | "challenge";

export const FORMAT_LABEL: Record<CompetitionFormat, string> = {
  hackathon: "Hackathon",
  contest: "Contest",
  challenge: "Challenge",
};

/**
 * Where a competition is in its life.
 *
 *   announced         dated and described, registration not yet open
 *   registrationOpen  taking entries now
 *   running           under way
 *   judging           entries closed, results not out
 *   finished          done, kept for the record
 */
export type CompetitionStatus =
  | "announced"
  | "registrationOpen"
  | "running"
  | "judging"
  | "finished";

export const STATUS_LABEL: Record<CompetitionStatus, string> = {
  announced: "Announced",
  registrationOpen: "Registration open",
  running: "Under way",
  judging: "Judging",
  finished: "Finished",
};

export interface Competition {
  /** Stable. Never reuse one, even after a competition has finished. */
  id: string;
  title: string;
  /** One line, shown under the title. */
  tagline: string;
  format: CompetitionFormat;
  status: CompetitionStatus;

  /** As a person would say it, e.g. "Saturday 7 March, 10am to 8pm CST". */
  when: string;
  /** Optional machine-readable form for the <time> element. */
  whenIso?: string;
  /** "Online", or a venue. */
  where: string;
  /** Who can enter, in plain words. */
  who: string;
  /** "Solo, or teams of up to four". */
  teamSize: string;

  /** A paragraph of what this actually is. */
  summary: string;
  /** What entrants get, what they build, how it is judged. */
  details?: string[];
  prizes?: string[];

  /**
   * Where entries are taken. Omit until registration is genuinely open:
   * the page shows a dated placeholder rather than a link to nowhere.
   */
  registerUrl?: string;
}

/**
 * Every competition, newest first.
 *
 * Deliberately empty. Inventing a hackathon to make the page look busy
 * would put fake dates and fake prizes in front of students, and a date
 * someone turns up for is the one thing on this site that must never be
 * decorative. The page has a proper empty state and will fill itself in as
 * soon as entries are added here.
 */
export const COMPETITIONS: Competition[] = [];

/** Anything a student can act on now, in the order they should see it. */
const LIVE_ORDER: CompetitionStatus[] = [
  "registrationOpen",
  "running",
  "judging",
  "announced",
];

export function liveCompetitions(): Competition[] {
  return COMPETITIONS.filter((c) => c.status !== "finished").sort(
    (a, b) => LIVE_ORDER.indexOf(a.status) - LIVE_ORDER.indexOf(b.status),
  );
}

export function pastCompetitions(): Competition[] {
  return COMPETITIONS.filter((c) => c.status === "finished");
}
