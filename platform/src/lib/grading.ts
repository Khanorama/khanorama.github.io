import type { Check } from "@/content/types";
import type { Analysis, RunResult } from "@/lib/python/runner";

/**
 * Exercise grading.
 *
 * Two sources of truth: what the program printed, and what the program is
 * structurally made of. Output alone is not enough, because several exercises
 * in this curriculum constrain the shape of the answer ("you must use exactly
 * 8 variables", "using only one print() statement"). Structure comes from the
 * AST rather than regex, so a print() inside a string is not miscounted.
 *
 * Feedback is deliberately specific. "Expected 77 on line 2, got 7" teaches;
 * "Incorrect" does not.
 */

export interface CheckResult {
  passed: boolean;
  /** Short statement of what was required. Always shown. */
  label: string;
  /** Why it failed. Only present on failure. */
  detail?: string;
}

export interface GradeResult {
  passed: boolean;
  checks: CheckResult[];
}

/** Author-facing operator symbols mapped to Python AST node names. */
const OPERATOR_AST_NAMES: Record<string, string[]> = {
  "+": ["Add"],
  "-": ["Sub", "USub"],
  "*": ["Mult"],
  "/": ["Div"],
  "//": ["FloorDiv"],
  "%": ["Mod"],
  "**": ["Pow"],
  "<": ["Lt"],
  ">": ["Gt"],
  "<=": ["LtE"],
  ">=": ["GtE"],
  "==": ["Eq"],
  "!=": ["NotEq"],
  and: ["And"],
  or: ["Or"],
  not: ["Not"],
  in: ["In"],
  "not in": ["NotIn"],
  is: ["Is"],
};

/**
 * Trailing whitespace and a trailing newline are not mistakes worth failing a
 * beginner for, so both are normalized away before comparison.
 */
export function normalizeOutput(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[ \t]+$/, ""))
    .join("\n")
    .replace(/\n+$/, "");
}

function outputLines(text: string): string[] {
  const normalized = normalizeOutput(text);
  return normalized === "" ? [] : normalized.split("\n");
}

function quote(value: string): string {
  return value === "" ? "(nothing)" : `"${value}"`;
}

function describeOperator(symbol: string): string {
  return symbol;
}

function checkLabel(check: Check): string {
  switch (check.kind) {
    case "stdout":
    case "stdoutLines":
      return "Produces the expected output";
    case "stdoutContains":
      return `Output includes ${quote(check.needle)}`;
    case "sourceRequires":
    case "sourceForbids":
    case "callCount":
    case "assignCount":
    case "usesOperators":
    case "importsModule":
      return check.message;
    case "raises":
      return check.message ?? `Raises ${check.errorType}`;
  }
}

function countRequirement(
  actual: number,
  spec: { exactly?: number; atLeast?: number; atMost?: number },
): { ok: boolean; detail?: string } {
  if (spec.exactly !== undefined && actual !== spec.exactly) {
    return { ok: false, detail: `Found ${actual}, expected exactly ${spec.exactly}.` };
  }
  if (spec.atLeast !== undefined && actual < spec.atLeast) {
    return { ok: false, detail: `Found ${actual}, expected at least ${spec.atLeast}.` };
  }
  if (spec.atMost !== undefined && actual > spec.atMost) {
    return { ok: false, detail: `Found ${actual}, expected at most ${spec.atMost}.` };
  }
  return { ok: true };
}

function evaluate(
  check: Check,
  source: string,
  result: RunResult,
  analysis: Analysis,
): CheckResult {
  const label = checkLabel(check);
  const fail = (detail: string): CheckResult => ({ passed: false, label, detail });
  const pass = (): CheckResult => ({ passed: true, label });

  switch (check.kind) {
    case "stdout": {
      const actual = normalizeOutput(result.stdout);
      const expected = normalizeOutput(check.expected);
      if (actual === expected) return pass();
      return fail(
        check.message ??
          `Expected ${quote(expected)} but your program printed ${quote(actual)}.`,
      );
    }

    case "stdoutLines": {
      const actual = outputLines(result.stdout);
      const expected = check.expected.map((line) => line.replace(/[ \t]+$/, ""));

      for (let i = 0; i < Math.max(actual.length, expected.length); i++) {
        if (actual[i] === expected[i]) continue;
        if (actual[i] === undefined) {
          return fail(
            `Your program printed ${actual.length} line(s) but ${expected.length} were expected. ` +
              `Line ${i + 1} should be ${quote(expected[i])}.`,
          );
        }
        if (expected[i] === undefined) {
          return fail(
            `Your program printed an extra line ${i + 1}: ${quote(actual[i])}.`,
          );
        }
        return fail(
          `Line ${i + 1} should be ${quote(expected[i])} but was ${quote(actual[i])}.`,
        );
      }
      return pass();
    }

    case "stdoutContains":
      return normalizeOutput(result.stdout).includes(check.needle)
        ? pass()
        : fail(check.message ?? `Could not find ${quote(check.needle)} in the output.`);

    case "sourceRequires":
      return new RegExp(check.pattern, check.flags ?? "").test(source)
        ? pass()
        : fail(check.message);

    case "sourceForbids":
      return new RegExp(check.pattern, check.flags ?? "").test(source)
        ? fail(check.message)
        : pass();

    case "callCount": {
      const actual = analysis.callCounts[check.name] ?? 0;
      const verdict = countRequirement(actual, check);
      return verdict.ok
        ? pass()
        : fail(`${check.message} ${verdict.detail ?? ""}`.trim());
    }

    case "assignCount": {
      const verdict = countRequirement(analysis.assignCount, check);
      return verdict.ok
        ? pass()
        : fail(`${check.message} ${verdict.detail ?? ""}`.trim());
    }

    case "usesOperators": {
      const used = new Set(analysis.operators);
      const missing = check.operators.filter((symbol) => {
        const names = OPERATOR_AST_NAMES[symbol];
        if (!names) return false;
        return !names.some((name) => used.has(name));
      });
      return missing.length === 0
        ? pass()
        : fail(
            `${check.message} Missing: ${missing.map(describeOperator).join(", ")}.`,
          );
    }

    case "importsModule":
      return analysis.imports.includes(check.module)
        ? pass()
        : fail(`${check.message} Add \`import ${check.module}\`.`);

    case "raises":
      if (result.ok) {
        return fail(
          check.message ?? `Expected this to raise ${check.errorType}, but it ran without error.`,
        );
      }
      return result.errorType === check.errorType
        ? pass()
        : fail(
            check.message ??
              `Expected ${check.errorType} but got ${result.errorType ?? "no error"}.`,
          );
  }
}

/** True when a check reads the program's output rather than its structure. */
function isOutputCheck(check: Check): boolean {
  return (
    check.kind === "stdout" ||
    check.kind === "stdoutLines" ||
    check.kind === "stdoutContains"
  );
}

export function grade(
  checks: Check[],
  source: string,
  result: RunResult,
  analysis: Analysis,
): GradeResult {
  // A syntax error means nothing else can be judged fairly.
  if (analysis.syntaxError) {
    return {
      passed: false,
      checks: [
        {
          passed: false,
          label: "Code runs",
          detail: `Python could not read your code: ${analysis.syntaxError}`,
        },
      ],
    };
  }

  const expectsFailure = checks.some((check) => check.kind === "raises");

  // If the program crashed and wasn't meant to, say so once rather than
  // reporting every output check as a separate mystery failure.
  if (!result.ok && !expectsFailure) {
    const structural = checks
      .filter((check) => !isOutputCheck(check))
      .map((check) => evaluate(check, source, result, analysis));

    return {
      passed: false,
      checks: [
        {
          passed: false,
          label: "Code runs without errors",
          detail: result.error ?? "Your program stopped with an error.",
        },
        ...structural,
      ],
    };
  }

  const results = checks.map((check) => evaluate(check, source, result, analysis));
  return { passed: results.every((r) => r.passed), checks: results };
}
