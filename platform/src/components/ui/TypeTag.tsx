import { LESSON_KIND_LABEL, type LessonKind } from "@/content/types";

/**
 * Says what kind of work an item is before a student opens it.
 *
 * Color follows the system's existing meanings rather than inventing a third
 * scheme: taught material is neutral, something you actively do is the action
 * color, and anything that counts for a grade takes the amber used elsewhere
 * for "pay attention to this one".
 */
const STYLES: Record<LessonKind, string> = {
  lesson: "border-line bg-surface text-ink-faint",
  progressCheck: "border-accent-line bg-accent-soft text-accent",
  // A connection is something you do, so it shares the action color with a
  // progress check. A unit quiz counts towards the unit, so it takes the
  // green the system already reserves for earned progress rather than the
  // amber that means "this one is graded and you only get one go".
  connection: "border-accent-line bg-accent-soft text-accent",
  unitQuiz: "border-success-line bg-success-soft text-success",
  assessment: "border-warning-line bg-warning-soft text-warning",
};

export function TypeTag({ kind }: { kind: LessonKind }) {
  return (
    <span
      className={[
        "inline-flex shrink-0 items-center rounded-full border px-2 py-0.5",
        "font-sans text-[10px] font-semibold tracking-[0.08em] uppercase",
        STYLES[kind],
      ].join(" ")}
    >
      {LESSON_KIND_LABEL[kind]}
    </span>
  );
}
