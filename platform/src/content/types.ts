/**
 * Course content model.
 *
 * The shapes here were derived from the existing Python I notebooks rather than
 * invented up front, so every block type corresponds to something the
 * curriculum actually does:
 *
 *   prose      explanation cells
 *   example    worked, runnable code with a known output
 *   predict    "What do you think this will output?" cells
 *   errorDemo  deliberately failing code (e.g. proving strings are immutable)
 *   exercise   "##CODE HERE##" cells, auto-graded
 *   sandbox    "##SANDBOX AREA##" cells, ungraded free play
 *   written    prose answers (Progress Check problem 5), self-assessed
 *
 * Content lives in the repo as typed data, not in Firestore. Curriculum is then
 * versioned, reviewable in a diff, and cannot be broken by a bad write at
 * runtime. Firestore only ever stores per-student state.
 */

/* ------------------------------------------------------------------ checks */

/**
 * A single pass/fail assertion against a student's submission.
 *
 * Output checks cover most exercises, because the notebooks already state the
 * expected output. Source checks exist because several exercises constrain
 * *how* the answer is written ("you must use exactly 8 variables", "using only
 * one print() statement", "using all math operations"). Those cannot be graded
 * from stdout alone.
 */
export type Check =
  /** stdout must match exactly, after trimming trailing whitespace per line. */
  | { kind: "stdout"; expected: string; message?: string }
  /** stdout compared line by line; clearer feedback than one long diff. */
  | { kind: "stdoutLines"; expected: string[]; message?: string }
  /** stdout must contain this substring. */
  | { kind: "stdoutContains"; needle: string; message?: string }
  /** Source must match a pattern, e.g. requiring a `<` comparison. */
  | { kind: "sourceRequires"; pattern: string; flags?: string; message: string }
  /** Source must not match a pattern, e.g. banning a hard-coded literal. */
  | { kind: "sourceForbids"; pattern: string; flags?: string; message: string }
  /** Constrain how often a function is called, e.g. exactly one print(). */
  | {
      kind: "callCount";
      name: string;
      exactly?: number;
      atLeast?: number;
      atMost?: number;
      message: string;
    }
  /** Constrain how many variables are assigned, e.g. exactly 8. */
  | {
      kind: "assignCount";
      exactly?: number;
      atLeast?: number;
      atMost?: number;
      message: string;
    }
  /**
   * Require specific operators, written as symbols the author actually thinks
   * in: "<", ">", "==", "+", "and". Resolved against the parsed AST, so an
   * operator inside a string or comment does not count.
   */
  | { kind: "usesOperators"; operators: string[]; message: string }
  /** Require that a module was imported, e.g. "math". */
  | { kind: "importsModule"; module: string; message: string }
  /** The snippet is expected to raise; used by errorDemo and by lessons on exceptions. */
  | { kind: "raises"; errorType: string; message?: string };

/* ------------------------------------------------------------------ blocks */

interface BlockBase {
  /** Stable within a lesson. Used for progress keys and deep links. */
  id: string;
}

/** Instructional prose. Markdown, rendered in the serif reading face. */
export interface ProseBlock extends BlockBase {
  kind: "prose";
  markdown: string;
}

/**
 * Lines fed to input() when the snippet runs.
 *
 * There is no terminal to type into, so any lesson teaching input() has to
 * supply the answers up front. The runner echoes each line as it is consumed,
 * the way a real terminal shows what you typed, so expected output must
 * account for the echo.
 */
export type Stdin = string[];

/** A worked example the student can run, and optionally edit and re-run. */
export interface ExampleBlock extends BlockBase {
  kind: "example";
  caption?: string;
  code: string;
  /** Shown after running so a student on a slow device still sees the point. */
  expectedOutput?: string;
  /** Worked examples are editable by default; set false to pin the canonical form. */
  editable?: boolean;
  stdin?: Stdin;
  /**
   * "warning" marks code that is expected to misbehave without raising, such
   * as a loop that never ends. Code that raises an exception should be an
   * errorDemo instead.
   */
  tone?: "default" | "warning";
}

/** "What do you think this will output?" Answer stays hidden until committed. */
export interface PredictBlock extends BlockBase {
  kind: "predict";
  prompt: string;
  code: string;
  /** Optional multiple choice. Omit for free-form prediction. */
  choices?: string[];
  answer: string;
  explanation: string;
}

/**
 * Code that is supposed to fail. The notebooks use this to prove a rule, e.g.
 * `string[1] = 'Y'` raising TypeError to show strings are immutable.
 * Treating it as its own block type stops it reading like a broken example.
 */
export interface ErrorDemoBlock extends BlockBase {
  kind: "errorDemo";
  caption?: string;
  code: string;
  /** e.g. "TypeError" */
  expectedError: string;
  /** Why this fails, and what the rule is. */
  explanation: string;
}

/** An auto-graded exercise. */
export interface ExerciseBlock extends BlockBase {
  kind: "exercise";
  /** What the student is asked to do. Markdown. */
  prompt: string;
  /** Pre-filled editor contents, including any scaffold the notebook provided. */
  starter: string;
  checks: Check[];
  /** Revealed only after a genuine attempt, or on request. */
  hints?: string[];
  /** Reference answer, revealed after success or after enough attempts. */
  solution?: string;
  stdin?: Stdin;
}

/** Ungraded experimentation. Nothing is recorded beyond "opened". */
export interface SandboxBlock extends BlockBase {
  kind: "sandbox";
  prompt?: string;
  starter?: string;
}

/**
 * A written answer. Cannot be auto-graded, so the student writes, then compares
 * against a model answer and self-marks. Honest about what it is.
 */
export interface WrittenBlock extends BlockBase {
  kind: "written";
  prompt: string;
  modelAnswer: string;
}

export type Block =
  | ProseBlock
  | ExampleBlock
  | PredictBlock
  | ErrorDemoBlock
  | ExerciseBlock
  | SandboxBlock
  | WrittenBlock;

/** Blocks that contribute to a lesson's completion percentage. */
export type GradedBlock = ExerciseBlock | PredictBlock | WrittenBlock;

export function isGraded(block: Block): block is GradedBlock {
  return (
    block.kind === "exercise" ||
    block.kind === "predict" ||
    block.kind === "written"
  );
}

/* ----------------------------------------------------------------- lessons */

/**
 * What a student is being asked to do, which drives the label in the outline.
 *
 *   lesson         taught material        -> "Lesson"
 *   progressCheck  practice between units -> "Activity"
 *   assessment     graded quiz or exam    -> "Assessment"
 *
 * Nothing is an assessment yet. Graded exams cannot be made cheat-proof on a
 * static client, where every expected answer ships in the bundle, so they stay
 * instructor-run until there is a server-side grader. The kind exists so the
 * outline can represent them when that changes.
 */
export type LessonKind = "lesson" | "progressCheck" | "assessment";

export const LESSON_KIND_LABEL: Record<LessonKind, string> = {
  lesson: "Lesson",
  progressCheck: "Activity",
  assessment: "Assessment",
};

export interface Lesson {
  /** Globally unique and stable; progress is keyed on this. Never renumber. */
  id: string;
  slug: string;
  title: string;
  kind: LessonKind;
  /** One sentence shown in the unit list. */
  summary: string;
  estimatedMinutes: number;
  /** Concrete, checkable outcomes. Shown at the top of the lesson. */
  objectives: string[];
  blocks: Block[];
}

export interface Unit {
  id: string;
  slug: string;
  title: string;
  summary: string;
  lessons: Lesson[];
}

export type CourseStatus = "available" | "inDevelopment";

/** One reason to take the course, shown on its overview page. */
export interface CourseHighlight {
  title: string;
  body: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  /** Short positioning line for the catalog card. */
  subtitle: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  status: CourseStatus;
  /** Shown on the overview page, before anyone commits to enrolling. */
  highlights: CourseHighlight[];
  /** Rough total, shown on the overview. */
  estimatedHours: number;
  units: Unit[];
}

/* ---------------------------------------------------------------- progress */

export type ExerciseStatus = "notStarted" | "attempted" | "passed";

export interface BlockProgress {
  status: ExerciseStatus;
  /** Last submission, so a student can leave and come back mid-thought. */
  code?: string;
  attempts: number;
  passedAt?: string;
}

export interface LessonProgress {
  startedAt?: string;
  completedAt?: string;
  blocks: Record<string, BlockProgress>;
}

/**
 * One Firestore document per student per course.
 *
 * Deliberately denormalized: a course page costs exactly one read regardless of
 * how many lessons it contains, which is what keeps this inside the free tier
 * at a few hundred students.
 */
export interface Enrollment {
  courseId: string;
  enrolledAt: string;
  lastLessonId?: string;
  lessons: Record<string, LessonProgress>;
}

/* ------------------------------------------------------------- derivations */

export function courseLessons(course: Course): Lesson[] {
  return course.units.flatMap((unit) => unit.lessons);
}

export function gradedBlocks(lesson: Lesson): GradedBlock[] {
  return lesson.blocks.filter(isGraded);
}

/**
 * A lesson counts as complete when every graded block has passed. Lessons with
 * no graded blocks complete on being read to the end.
 */
export function isLessonComplete(
  lesson: Lesson,
  progress: LessonProgress | undefined,
): boolean {
  if (!progress) return false;
  const graded = gradedBlocks(lesson);
  if (graded.length === 0) return Boolean(progress.completedAt);
  return graded.every((block) => progress.blocks[block.id]?.status === "passed");
}

export function courseCompletion(
  course: Course,
  enrollment: Enrollment | undefined,
): { completed: number; total: number; fraction: number } {
  const lessons = courseLessons(course);
  const total = lessons.length;
  if (!enrollment || total === 0) {
    return { completed: 0, total, fraction: 0 };
  }
  const completed = lessons.filter((lesson) =>
    isLessonComplete(lesson, enrollment.lessons[lesson.id]),
  ).length;
  return { completed, total, fraction: completed / total };
}
