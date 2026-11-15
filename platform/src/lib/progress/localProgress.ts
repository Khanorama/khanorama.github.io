import type {
  BlockProgress,
  ExerciseStatus,
  LessonProgress,
} from "@/content/types";

/**
 * The progress store.
 *
 * Holds progress in memory, mirrors it to localStorage, and optionally
 * forwards every change to a remote sink. The store itself knows nothing
 * about Firebase: sync.ts installs the sink once a user signs in, which keeps
 * the signed-out path free of any account machinery.
 *
 * localStorage is always written, even when signed in, so a dropped
 * connection never costs a student the exercise they just solved.
 *
 * Exposed through useSyncExternalStore, so the server snapshot is empty and a
 * static export cannot hydrate into a mismatch.
 */

const STORAGE_KEY = "leapcode-progress-v1";

/**
 * Submitted code is stored so a student can leave and come back. It is capped
 * because the whole state goes into one Firestore document, and documents are
 * limited to 1MB.
 */
const MAX_STORED_CODE = 5000;

export interface CourseEnrollment {
  enrolledAt: string;
}

export interface ProgressState {
  lessons: Record<string, LessonProgress>;
  /**
   * Courses this student has joined, keyed by course id.
   *
   * Kept in the same document as progress so a course page costs one read,
   * and so enrolling on one device shows up on another without a second
   * round trip.
   */
  enrollments: Record<string, CourseEnrollment>;
}

/** Stable reference. Returned on the server and whenever storage is unusable. */
const EMPTY: ProgressState = Object.freeze({
  lessons: {},
  enrollments: {},
}) as ProgressState;

let cache: ProgressState | null = null;
const listeners = new Set<() => void>();

type RemoteSink = (state: ProgressState) => void;
let remoteSink: RemoteSink | null = null;

/** Installed by sync.ts on sign-in, cleared on sign-out. */
export function setRemoteSink(sink: RemoteSink | null): void {
  remoteSink = sink;
}

/* --------------------------------------------------------------- coercion */

/*
 * Progress arrives from two places this code does not control: localStorage,
 * which a student can edit, and their Firestore document, which they can
 * write to directly with their own token. The security rules require only
 * that `progress` is a map, so the shape inside it is a claim rather than a
 * guarantee, and a TypeScript cast checks nothing at runtime.
 *
 * That cannot inject anything: every value here renders as a React child and
 * is escaped on the way out. What it can do is crash a lesson. mergeProgress
 * calls Object.keys(lesson.blocks) and Math.max(a.attempts, b.attempts), so a
 * missing `blocks` throws and a string `attempts` poisons the count with NaN.
 * Either one would leave a student staring at an error boundary on their own
 * work, with no way to clear it from inside the page.
 *
 * So the shape is rebuilt field by field instead of trusted. Malformed
 * entries are dropped individually rather than failing the whole document: a
 * student with one bad lesson record keeps the rest of their course.
 */

const BLOCK_STATUSES: readonly ExerciseStatus[] = [
  "notStarted",
  "attempted",
  "passed",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Dates are only ever compared as strings and shown as-is, so any non-empty string will do. */
function coerceDate(value: unknown): string | undefined {
  return typeof value === "string" && value !== "" ? value : undefined;
}

function coerceBlock(value: unknown): BlockProgress | null {
  if (!isRecord(value)) return null;

  // An unreadable status is never promoted to "passed". The record exists at
  // all, so something happened here, which is what "attempted" means.
  const status = BLOCK_STATUSES.includes(value.status as ExerciseStatus)
    ? (value.status as ExerciseStatus)
    : "attempted";

  const attempts =
    typeof value.attempts === "number" && Number.isFinite(value.attempts)
      ? Math.max(0, Math.floor(value.attempts))
      : 0;

  return {
    status,
    attempts,
    // Capped on the way in as well as on the way out, so an oversized
    // document cannot be loaded back and rewritten over the 1MB limit.
    code:
      typeof value.code === "string"
        ? value.code.slice(0, MAX_STORED_CODE)
        : undefined,
    passedAt: coerceDate(value.passedAt),
  };
}

function coerceLesson(value: unknown): LessonProgress | null {
  if (!isRecord(value)) return null;

  const blocks: Record<string, BlockProgress> = {};
  if (isRecord(value.blocks)) {
    for (const [blockId, entry] of Object.entries(value.blocks)) {
      const block = coerceBlock(entry);
      if (block) blocks[blockId] = block;
    }
  }

  return {
    startedAt: coerceDate(value.startedAt),
    completedAt: coerceDate(value.completedAt),
    blocks,
  };
}

/**
 * Rebuilds a ProgressState from an untrusted value.
 *
 * Total: every input returns a usable state, including null, a string, or an
 * array. Documents written before enrollment existed simply have no
 * enrollments, which falls out of this rather than needing its own case.
 */
export function coerceProgress(value: unknown): ProgressState {
  if (!isRecord(value)) return EMPTY;

  const lessons: Record<string, LessonProgress> = {};
  if (isRecord(value.lessons)) {
    for (const [lessonId, entry] of Object.entries(value.lessons)) {
      const lesson = coerceLesson(entry);
      if (lesson) lessons[lessonId] = lesson;
    }
  }

  const enrollments: Record<string, CourseEnrollment> = {};
  if (isRecord(value.enrollments)) {
    for (const [courseId, entry] of Object.entries(value.enrollments)) {
      if (!isRecord(entry)) continue;
      // Being enrolled is the fact that matters and the date is not shown
      // anywhere, so an unreadable one falls back rather than discarding the
      // enrollment and quietly dropping a student out of their course.
      enrollments[courseId] = {
        enrolledAt: coerceDate(entry.enrolledAt) ?? EPOCH,
      };
    }
  }

  return { lessons, enrollments };
}

const EPOCH = new Date(0).toISOString();

function parse(raw: string | null): ProgressState {
  if (!raw) return EMPTY;
  try {
    return coerceProgress(JSON.parse(raw));
  } catch {
    // Not even JSON. Start clean rather than crash a lesson.
    return EMPTY;
  }
}

function load(): ProgressState {
  if (cache) return cache;
  if (typeof window === "undefined") return EMPTY;
  try {
    cache = parse(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    cache = EMPTY;
  }
  return cache;
}

function notify() {
  for (const listener of listeners) listener();
}

function commit(next: ProgressState, { pushRemote = true } = {}) {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Private browsing. Keep the in-memory value so the session still works.
  }
  if (pushRemote) remoteSink?.(next);
  notify();
}

/** Used by sync.ts after merging remote state in; does not echo back. */
export function replaceState(next: ProgressState): void {
  commit(next, { pushRemote: false });
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);

  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    cache = parse(event.newValue);
    notify();
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

  // Once passed, a later experiment must not revoke the tick.
  const alreadyPassed = existing?.status === "passed";

  const nextBlock: BlockProgress = {
    status: passed || alreadyPassed ? "passed" : "attempted",
    attempts: (existing?.attempts ?? 0) + 1,
    code: code?.slice(0, MAX_STORED_CODE),
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

export function resetProgress(): void {
  commit({ lessons: {}, enrollments: {} });
}

/** Joins a course. Idempotent; re-enrolling keeps the original date. */
export function enrollInCourse(courseId: string): void {
  const state = load();
  if (state.enrollments[courseId]) return;
  commit({
    ...state,
    enrollments: {
      ...state.enrollments,
      [courseId]: { enrolledAt: new Date().toISOString() },
    },
  });
}

export function isEnrolled(state: ProgressState, courseId: string): boolean {
  return Boolean(state.enrollments[courseId]);
}

/**
 * Combines two progress states, keeping the better outcome for each block.
 *
 * Used when a student who has been working signed out creates an account: the
 * work they just did has to survive, and so does anything already on the
 * account from another device. Nothing is ever downgraded, because losing a
 * passed exercise to a merge would be worse than any duplication.
 */
export function mergeProgress(
  a: ProgressState,
  b: ProgressState,
): ProgressState {
  const lessonIds = new Set([
    ...Object.keys(a.lessons),
    ...Object.keys(b.lessons),
  ]);
  const lessons: Record<string, LessonProgress> = {};

  for (const lessonId of lessonIds) {
    const left = a.lessons[lessonId];
    const right = b.lessons[lessonId];
    if (!left || !right) {
      lessons[lessonId] = (left ?? right)!;
      continue;
    }

    const blockIds = new Set([
      ...Object.keys(left.blocks),
      ...Object.keys(right.blocks),
    ]);
    const blocks: Record<string, BlockProgress> = {};

    for (const blockId of blockIds) {
      const lb = left.blocks[blockId];
      const rb = right.blocks[blockId];
      if (!lb || !rb) {
        blocks[blockId] = (lb ?? rb)!;
        continue;
      }
      const passed = lb.status === "passed" || rb.status === "passed";
      blocks[blockId] = {
        status: passed ? "passed" : "attempted",
        attempts: Math.max(lb.attempts, rb.attempts),
        // Prefer whichever side actually passed; otherwise the longer attempt.
        code:
          lb.status === "passed"
            ? lb.code
            : rb.status === "passed"
              ? rb.code
              : (lb.code?.length ?? 0) >= (rb.code?.length ?? 0)
                ? lb.code
                : rb.code,
        passedAt: lb.passedAt ?? rb.passedAt,
      };
    }

    lessons[lessonId] = {
      startedAt: earliest(left.startedAt, right.startedAt),
      completedAt: earliest(left.completedAt, right.completedAt),
      blocks,
    };
  }

  // Enrollment is a union: joining on either device counts, and the earlier
  // date wins so the record reflects when they actually started.
  const enrollments: Record<string, CourseEnrollment> = { ...b.enrollments };
  for (const [courseId, entry] of Object.entries(a.enrollments ?? {})) {
    const other = enrollments[courseId];
    enrollments[courseId] = other
      ? { enrolledAt: earliest(entry.enrolledAt, other.enrolledAt)! }
      : entry;
  }

  return { lessons, enrollments };
}

function earliest(a?: string, b?: string): string | undefined {
  if (!a) return b;
  if (!b) return a;
  return a < b ? a : b;
}
