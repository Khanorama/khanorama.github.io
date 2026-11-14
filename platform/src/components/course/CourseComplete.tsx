"use client";

import { Seal } from "@/components/course/Seal";
import { getCourse } from "@/content/registry";
import { useProgress } from "@/lib/progress/useProgress";
import { badgeDate, badgeFor } from "@/lib/progress/badges";

/**
 * The badge, on the course it belongs to.
 *
 * Until this existed, finishing a course was marked in exactly one place:
 * a row near the bottom of the account page, which is a settings screen
 * most students never open. Fifty-four lessons of work left no mark on the
 * course itself, so a student who came back to the page they started from
 * saw the same invitation to begin that a stranger sees.
 *
 * Derived from progress on every render, like every other badge. Nothing
 * is stored, so this cannot disagree with the account page or outlive a
 * curriculum change that adds a unit.
 *
 * Renders nothing when the course is unfinished rather than showing an
 * empty state. The account page names what earns a badge because that is a
 * page about you; this is a page about the course, and a reader who has
 * not started it is not served by being told what they have not done.
 */
export function CourseComplete({ courseSlug }: { courseSlug: string }) {
  const progress = useProgress();
  const course = getCourse(courseSlug);
  const badge = course ? badgeFor(course, progress) : null;

  // Also the server render, where progress is always empty. Nothing is
  // reserved for it, so the hero does not shift when it appears.
  if (!badge) return null;

  const on = badgeDate(badge);

  return (
    <div className="mt-6 inline-flex items-center gap-3 rounded-card border border-success-line bg-success-soft px-4 py-3">
      <Seal size={40} />
      <div>
        <p className="font-sans text-sm font-semibold text-ink">
          You finished this course
        </p>
        <p className="mt-0.5 font-sans text-xs text-ink-muted">
          All {badge.lessons} lessons complete
          {on ? ` · ${on}` : ""}
        </p>
      </div>
    </div>
  );
}
