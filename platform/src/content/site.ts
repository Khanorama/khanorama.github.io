/**
 * Organisation content, carried over from the original leapcode.org.
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
   * optimisation, so whatever is committed is what every visitor downloads.
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
