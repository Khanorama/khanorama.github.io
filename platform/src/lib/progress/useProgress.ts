"use client";

import { useSyncExternalStore } from "react";
import {
  subscribe,
  getSnapshot,
  getServerSnapshot,
  type ProgressState,
} from "@/lib/progress/localProgress";
/**
 * The minimum a client needs to compute completion.
 *
 * The outline is built in a server component, and shipping whole Lesson
 * objects to the browser would send every lesson's prose and solutions just
 * to draw sixteen rings. This carries ids only.
 */
export interface LessonProgressShape {
  id: string;
  gradedBlockIds: string[];
  /** False while a lesson has no content; nothing to complete. */
  written: boolean;
}

export type LessonStatus = "notStarted" | "inProgress" | "complete";

export interface LessonCompletion {
  status: LessonStatus;
  /** 0 to 1, for the partial ring. */
  fraction: number;
  passed: number;
  total: number;
}

export function useProgress(): ProgressState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Completion is derived from content rather than stored.
 *
 * Storing a "complete" flag would go stale the moment a lesson gains an
 * exercise: a student marked done against three tasks would still look done
 * against four. Recomputing against the current lesson keeps the outline
 * honest when the curriculum changes.
 */
export function lessonCompletion(
  lesson: LessonProgressShape,
  state: ProgressState,
): LessonCompletion {
  const progress = state.lessons[lesson.id];
  const total = lesson.gradedBlockIds.length;

  // Nothing written yet; there is nothing to complete.
  if (!lesson.written) {
    return { status: "notStarted", fraction: 0, passed: 0, total };
  }

  // Reading-only lessons complete when the student says they are done.
  if (total === 0) {
    const done = Boolean(progress?.completedAt);
    return {
      status: done ? "complete" : progress ? "inProgress" : "notStarted",
      fraction: done ? 1 : 0,
      passed: 0,
      total: 0,
    };
  }

  const passed = lesson.gradedBlockIds.filter(
    (blockId) => progress?.blocks[blockId]?.status === "passed",
  ).length;

  const fraction = passed / total;
  const touched = passed > 0 || Boolean(progress);

  return {
    status: passed === total ? "complete" : touched ? "inProgress" : "notStarted",
    fraction,
    passed,
    total,
  };
}
