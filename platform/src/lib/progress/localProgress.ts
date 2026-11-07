import type { LessonProgress } from "@/content/types";

/**
 * Progress storage, currently backed by localStorage.
 *
 * This is deliberately shaped like the eventual Firestore document so that
 * swapping the backend is a change of implementation, not of call sites: the
 * stored value matches LessonProgress from the content model, keyed by lesson
 * id, exactly as an Enrollment will be.
 *
 * Until accounts exist, progress is per browser. That is honest for a single
 * device and is replaced, not extended, once auth lands.
 *
 * Exposed through useSyncExternalStore, so the server snapshot is empty and a
 * static export cannot hydrate into a mismatch.
 */

const STORAGE_KEY = "leapcode-progress-v1";

export interface ProgressState {
  lessons: Record<string, LessonProgress>;
}

/** Stable reference. Returned on the server and whenever storage is unusable. */
const EMPTY: ProgressState = Object.freeze({ lessons: {} }) as ProgressState;

let cache: ProgressState | null = null;
const listeners = new Set<() => void>();

function parse(raw: string | null): ProgressState {
  if (!raw) return EMPTY;
  try {
    const parsed = JSON.parse(raw) as ProgressState;
    if (!parsed || typeof parsed !== "object" || !parsed.lessons) return EMPTY;
    return parsed;
  } catch {
    // Corrupted or from an older shape. Start clean rather than crash a lesson.
    return EMPTY;
  }
}

function load(): ProgressState {
  if (cache) return cache;
  if (typeof window === "undefined") return EMPTY;
  try {
    cache = parse(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    // Private browsing, or storage blocked.
    cache = EMPTY;
  }
  return cache;
}

function commit(next: ProgressState) {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Keep the in-memory value so the session still behaves correctly.
  }
  for (const listener of listeners) listener();
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);

  // Another tab may be further along in the same course.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    cache = parse(event.newValue);
    for (const l of listeners) l();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function getSnapshot(): ProgressState {
  return load();
}

export function getServerSnapshot(): ProgressState {
  return EMPTY;
}

/** Records the outcome of a single graded block. */
export function recordBlockResult(
  lessonId: string,
  blockId: string,
  passed: boolean,
  code?: string,
): void {
  const state = load();
  const lesson: LessonProgress = state.lessons[lessonId] ?? {
    startedAt: new Date().toISOString(),
    blocks: {},
  };
  const existing = lesson.blocks[blockId];

  // Once passed, a later experiment should not revoke the tick.
  const alreadyPassed = existing?.status === "passed";

  const nextBlock = {
    status: (passed || alreadyPassed ? "passed" : "attempted") as
      | "passed"
      | "attempted",
    attempts: (existing?.attempts ?? 0) + 1,
    code,
    passedAt:
      existing?.passedAt ?? (passed ? new Date().toISOString() : undefined),
  };

  commit({
    ...state,
    lessons: {
      ...state.lessons,
      [lessonId]: {
        ...lesson,
        blocks: { ...lesson.blocks, [blockId]: nextBlock },
      },
    },
  });
}

/** Marks a lesson read, used by lessons that have nothing to grade. */
export function markLessonCompleted(lessonId: string): void {
  const state = load();
  const lesson = state.lessons[lessonId];
  if (lesson?.completedAt) return;

  commit({
    ...state,
    lessons: {
      ...state.lessons,
      [lessonId]: {
        startedAt: lesson?.startedAt ?? new Date().toISOString(),
        blocks: lesson?.blocks ?? {},
        completedAt: new Date().toISOString(),
      },
    },
  });
}

/** Clears everything. Used by a reset control and by tests. */
export function resetProgress(): void {
  commit({ lessons: {} });
}
