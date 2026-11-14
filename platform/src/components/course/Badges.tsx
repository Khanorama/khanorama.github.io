"use client";

import Link from "next/link";
import { courses } from "@/content/registry";
import { courseUrl } from "@/content/registry";
import { useProgress } from "@/lib/progress/useProgress";
import { Seal } from "@/components/course/Seal";
import {
  badgeDate,
  earnedBadges,
  type CourseBadge,
} from "@/lib/progress/badges";

function BadgeRow({ badge }: { badge: CourseBadge }) {
  const on = badgeDate(badge);

  return (
    <li>
      <Link
        href={courseUrl(badge.slug)}
        className="press flex items-center gap-4 rounded-card border border-success-line bg-success-soft px-4 py-3 hover:-translate-y-0.5 hover:shadow-card-hover"
      >
        <Seal />
        <div className="min-w-0">
          <p className="font-sans text-sm font-semibold text-ink">
            {badge.title}
          </p>
          <p className="mt-0.5 font-sans text-xs text-ink-muted">
            All {badge.lessons} lessons complete
            {on ? ` · ${on}` : ""}
          </p>
        </div>
      </Link>
    </li>
  );
}

/**
 * Badges on the account page.
 *
 * The empty state names what earns one rather than saying "no badges
 * yet", because a student with none is exactly the person for whom that
 * sentence is useless.
 */
export function Badges() {
  const progress = useProgress();
  const badges = earnedBadges(courses, progress);

  return (
    <section className="mt-6">
      <h2 className="font-sans text-xs font-semibold tracking-wide uppercase text-ink-faint">
        Badges
      </h2>

      {badges.length === 0 ? (
        <p className="mt-2 font-sans text-sm text-ink-muted">
          Finish every lesson in a course and its badge appears here.
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {badges.map((badge) => (
            <BadgeRow key={badge.courseId} badge={badge} />
          ))}
        </ul>
      )}
    </section>
  );
}
