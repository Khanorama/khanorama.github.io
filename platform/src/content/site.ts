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
}

export const TEAM: TeamMember[] = [
  {
    name: "Ayaan Khan",
    roles: ["Founder and President", "Python Course Director"],
    email: "khan@leapcode.org",
  },
  {
    name: "Aayan Syed",
    roles: ["Java Course Director"],
    email: "syed@leapcode.org",
  },
  {
    name: "Ishaan Neelamana",
    roles: ["AI and ML Course Director"],
    email: "neelamana@leapcode.org",
  },
  {
    name: "Bryden Li",
    roles: ["Head of Communications"],
    email: "li@leapcode.org",
  },
];

export const SUPPORT_EMAIL = "support@leapcode.org";
