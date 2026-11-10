/**
 * Organization content, carried over from the original leapcode.org.
 *
 * Kept as data rather than hard-coded in pages so the team list and contact
 * details have one home. This is the part of the site that is about LeapCode
 * rather than about the software.
 */

export const MISSION = [
  `At LeapCode we believe coding is more than a skill. It is a route into creativity, problem solving and invention. Our mission is to give learners at every level a way in, from people writing their first line to those with a foundation already who want to sharpen it, by combining taught courses with real practice and resources that go deep enough to matter.`,
  `We also believe collaboration and competition drive growth. Through coding challenges, regular competitions and team events, we try to build somewhere people push their limits and work together. LeapCode is not only about code. It is about opening opportunities, creating a sense of belonging, and building a community where people can do well in a field that keeps changing.`,
];

export interface TeamMember {
  name: string;
  roles: string[];
  email: string;
  /**
   * Served from public/team. The originals on the old site were up to
   * 4284x4284 and 2MB each for a thumbnail; these are resampled to 256px,
   * which is 2x the display size. Static export disables Next's image
   * optimization, so whatever is committed is what every visitor downloads.
   */
  photo: string;
}

export const TEAM: TeamMember[] = [
  {
    name: "Ayaan Khan",
    roles: ["Founder and President", "Python Course Director"],
    email: "khan@leapcode.org",
    photo: "/team/ayaan.jpg",
  },
  {
    name: "Aayan Syed",
    roles: ["Java Course Director"],
    email: "syed@leapcode.org",
    photo: "/team/aayan.jpg",
  },
  {
    name: "Ishaan Neelamana",
    roles: ["AI and ML Course Director"],
    email: "neelamana@leapcode.org",
    photo: "/team/ishaan.jpg",
  },
  {
    name: "Bryden Li",
    roles: ["Head of Communications"],
    email: "li@leapcode.org",
    photo: "/team/bryden.jpg",
  },
];

export const SUPPORT_EMAIL = "support@leapcode.org";

/**
 * The Discord invite.
 *
 * Kept here rather than inline so there is one place to change it if the
 * invite is ever rotated. A dead invite on the About page is worse than no
 * link at all, because it reads as an abandoned community.
 */
export const DISCORD_INVITE = "https://discord.gg/YqY4RAYcYG";

/**
 * Courses that are coming but do not exist on the platform yet.
 *
 * Listed separately from the real courses in content/registry.ts so they can
 * be shown without generating a route to an empty page. They appear in the
 * catalog as plainly unavailable, because the platform should look like what
 * it is becoming without pretending the work is done.
 */
export interface UpcomingCourse {
  title: string;
  level: string;
  blurb: string;
  art: string;
}

export const UPCOMING: UpcomingCourse[] = [
  {
    title: "Java I",
    level: "Beginner",
    blurb:
      "Objects, types and the structure behind large programs, taught the same way.",
    art: "/art/java.webp",
  },
  {
    title: "Machine Learning with Python",
    level: "Intermediate",
    blurb:
      "Regression, exploratory analysis, and building a model of your own. Python I first.",
    art: "/art/ai.webp",
  },
];
