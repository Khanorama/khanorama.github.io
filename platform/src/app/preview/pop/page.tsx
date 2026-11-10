import type { Metadata } from "next";
import { PopPreview, type PopCourse, type PopFigure } from "@/components/preview/PopPreview";
import { courses } from "@/content/registry";
import { MISSION, UPCOMING } from "@/content/site";
import "./pop.css";

/**
 * A design preview, at its own route and linked from nowhere.
 *
 * noindex because this is an alternative treatment of the home page: two
 * pages making the same pitch in the same words is exactly what a search
 * engine deduplicates badly, and a preview outranking the real home page
 * would be a self-inflicted wound.
 */
export const metadata: Metadata = {
  title: "Design preview",
  description: "An alternative visual treatment of leapcode.org.",
  robots: { index: false, follow: false },
};

/**
 * Figures taken from the content files rather than written down.
 *
 * Every number here is something the repository already knows, so none of
 * them can quietly become a lie. The temptation in this style is a row of
 * big round numbers about students taught and projects shipped, which at
 * this point would all be invented.
 */
function buildFigures(): PopFigure[] {
  const course = courses[0];
  const lessons = courses.reduce(
    (total, entry) =>
      total + entry.units.reduce((sum, unit) => sum + unit.lessons.length, 0),
    0,
  );

  return [
    { value: String(lessons), label: "Written lessons, every one with code you run" },
    {
      value: String(course?.units.length ?? 0),
      label: "Units, each closed by a progress check",
    },
    { value: "$0", label: "What any of it costs, now and later" },
  ];
}

function buildCourses(): PopCourse[] {
  const live: PopCourse[] = courses.map((course) => ({
    title: course.title,
    note: course.subtitle,
    level: course.level,
    state: "Open now",
    href: `/courses/${course.slug}/`,
  }));

  const soon: PopCourse[] = UPCOMING.map((course) => ({
    title: course.title,
    note: course.blurb,
    level: course.level,
    state: "In progress",
  }));

  return [...live, ...soon];
}

export default function PopPreviewPage() {
  return (
    <PopPreview
      courses={buildCourses()}
      figures={buildFigures()}
      mission={MISSION}
    />
  );
}
