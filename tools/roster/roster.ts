/**
 * The roster: every account, what it has finished, and what it has earned.
 *
 * WHY THIS IS A LOCAL SCRIPT AND NOT A PAGE ON THE SITE
 *
 * Two reasons, and the second is the one that decided it.
 *
 * First, a page could not do the job. The progress document is keyed by an
 * opaque uid and holds nothing but progress and updatedAt; names and email
 * addresses live in Firebase Authentication, which the client SDK cannot
 * list. An in-app admin screen would therefore show rows of uids with no way
 * to tell whose work is whose. The Admin SDK can read both and join them,
 * which is what this does.
 *
 * Second, the published privacy policy tells students that access to their
 * progress is "restricted to your own signed-in account, enforced by rules on
 * the database rather than only by the app". Granting an admin account read
 * access in the app would make that sentence false, and the security rules
 * would have to say so. This reads with a service account instead, which is
 * the same owner-level access the Firebase console already has, so the rules
 * stay exactly as published and students keep the guarantee they were given.
 *
 * WHAT IT NEEDS
 *
 * A service account key, from the Firebase console: Project settings, Service
 * accounts, Generate new private key. That file grants full read and write
 * over the whole project and bypasses every security rule, so it stays out of
 * git (see .gitignore here) and off any shared drive.
 *
 *   npm install
 *   npm run report -- --key ./service-account.json
 *   npm run demo                     # synthetic data, no credentials needed
 *
 * Writes out/roster.html and prints a summary. Submitted code is excluded
 * unless --code is passed: it is the most personal thing stored, and a report
 * you glance at to check progress has no business carrying it by default.
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { courses } from "@/content/registry";
import { courseLessons, isLessonComplete } from "@/content/types";
import {
  coerceProgress,
  isEnrolled,
  type ProgressState,
} from "@/lib/progress/localProgress";
import { badgeDate, earnedBadges } from "@/lib/progress/badges";

const HERE = dirname(fileURLToPath(import.meta.url));

/* ------------------------------------------------------------------ types */

interface Account {
  uid: string;
  name: string | null;
  email: string | null;
  signInWith: string;
  createdAt: string | null;
  lastSignInAt: string | null;
  /** When progress was last written. Null when nothing was ever saved. */
  savedAt: string | null;
  /** True when Authentication has no account for a progress document. */
  orphaned: boolean;
  state: ProgressState;
}

interface CourseLine {
  title: string;
  total: number;
  complete: number;
  started: number;
  enrolled: boolean;
  badge: boolean;
}

interface Row {
  account: Account;
  courses: CourseLine[];
  badges: { title: string; on: string | null }[];
  exercisesPassed: number;
  lessonsComplete: number;
  lessonsStarted: number;
}

/* ------------------------------------------------------------------- args */

const argv = process.argv.slice(2);
const has = (flag: string) => argv.includes(flag);
function value(flag: string): string | undefined {
  const i = argv.indexOf(flag);
  return i === -1 ? undefined : argv[i + 1];
}

const options = {
  demo: has("--demo"),
  withCode: has("--code"),
  key: value("--key") ?? process.env.GOOGLE_APPLICATION_CREDENTIALS,
  out: resolve(HERE, value("--out") ?? "out/roster.html"),
};

/* ------------------------------------------------------------- derivation */

/**
 * Everything the report shows about one account, worked out from progress
 * using the same functions the site itself uses.
 *
 * That reuse is the point rather than a convenience. A badge is derived and
 * never stored, so the only way for this report to agree with what a student
 * sees on their own account page is to run the same derivation over the same
 * course content. A second implementation here would drift the first time a
 * lesson is added, and would do it silently.
 */
function describe(account: Account): Row {
  const state = account.state;

  const lines: CourseLine[] = courses.map((course) => {
    const lessons = courseLessons(course);
    const complete = lessons.filter((lesson) =>
      isLessonComplete(lesson, state.lessons[lesson.id]),
    ).length;
    const started = lessons.filter(
      (lesson) => state.lessons[lesson.id] !== undefined,
    ).length;

    return {
      title: course.title,
      total: lessons.length,
      complete,
      started,
      enrolled: isEnrolled(state, course.id),
      badge: lessons.length > 0 && complete === lessons.length,
    };
  });

  const badges = earnedBadges(courses, state).map((badge) => ({
    title: badge.title,
    on: badgeDate(badge),
  }));

  let exercisesPassed = 0;
  for (const lesson of Object.values(state.lessons)) {
    for (const block of Object.values(lesson.blocks)) {
      if (block.status === "passed") exercisesPassed += 1;
    }
  }

  return {
    account,
    courses: lines,
    badges,
    exercisesPassed,
    lessonsComplete: lines.reduce((sum, line) => sum + line.complete, 0),
    lessonsStarted: lines.reduce((sum, line) => sum + line.started, 0),
  };
}

/* ----------------------------------------------------------------- firebase */

async function readFirebase(keyPath: string): Promise<Account[]> {
  const { cert, initializeApp } = await import("firebase-admin/app");
  const { getAuth } = await import("firebase-admin/auth");
  const { getFirestore } = await import("firebase-admin/firestore");

  const serviceAccount = JSON.parse(readFileSync(keyPath, "utf8"));
  const app = initializeApp({ credential: cert(serviceAccount) });

  // Authentication holds identity; Firestore holds progress. Neither knows
  // about the other, so both are read in full and joined on the uid.
  const users = new Map<
    string,
    {
      name: string | null;
      email: string | null;
      signInWith: string;
      createdAt: string | null;
      lastSignInAt: string | null;
    }
  >();

  let pageToken: string | undefined;
  do {
    const page = await getAuth(app).listUsers(1000, pageToken);
    for (const user of page.users) {
      users.set(user.uid, {
        name: user.displayName?.trim() || null,
        email: user.email ?? null,
        signInWith:
          user.providerData.map((p) => p.providerId).join(", ") || "unknown",
        createdAt: user.metadata.creationTime ?? null,
        lastSignInAt: user.metadata.lastSignInTime ?? null,
      });
    }
    pageToken = page.pageToken;
  } while (pageToken);

  const documents = new Map<string, { progress: unknown; savedAt: unknown }>();
  const snapshot = await getFirestore(app).collection("users").get();
  for (const doc of snapshot.docs) {
    const data = doc.data();
    documents.set(doc.id, { progress: data.progress, savedAt: data.updatedAt });
  }

  const accounts: Account[] = [];

  for (const [uid, user] of users) {
    const document = documents.get(uid);
    accounts.push({
      uid,
      ...user,
      savedAt: typeof document?.savedAt === "string" ? document.savedAt : null,
      orphaned: false,
      state: coerceProgress(document?.progress),
    });
  }

  // A progress document with no account behind it. Deleting an account is
  // supposed to remove the document first, so anything landing here means a
  // deletion stopped halfway and a student's work outlived their account.
  // Worth seeing, because the privacy policy promises otherwise.
  for (const [uid, document] of documents) {
    if (users.has(uid)) continue;
    accounts.push({
      uid,
      name: null,
      email: null,
      signInWith: "none",
      createdAt: null,
      lastSignInAt: null,
      savedAt: typeof document.savedAt === "string" ? document.savedAt : null,
      orphaned: true,
      state: coerceProgress(document.progress),
    });
  }

  return accounts;
}

/* --------------------------------------------------------------- demo data */

/**
 * Synthetic accounts, so the report can be run and read without credentials
 * and without looking at anybody's real work. Covers the cases that are easy
 * to get wrong: a finished course, a half-finished one, an account that has
 * never saved anything, and an orphaned document.
 */
function demoAccounts(): Account[] {
  const course = courses[0];
  const lessons = courseLessons(course);

  function completeThrough(count: number, code?: string): ProgressState {
    const state: ProgressState = { lessons: {}, enrollments: {} };
    state.enrollments[course.id] = { enrolledAt: "2026-10-01T09:00:00.000Z" };
    lessons.slice(0, count).forEach((lesson, index) => {
      const day = String(2 + index).padStart(2, "0");
      const at = `2026-10-${day}T17:05:00.000Z`;
      const blocks: ProgressState["lessons"][string]["blocks"] = {};
      for (const block of lesson.blocks) {
        blocks[block.id] = { status: "passed", attempts: 2, passedAt: at, code };
      }
      state.lessons[lesson.id] = {
        startedAt: at,
        completedAt: at,
        blocks,
      };
    });
    return state;
  }

  /*
   * Deliberately hostile fixture.
   *
   * This report puts a student's display name and their submitted Python into
   * an HTML page that an organizer opens on their own machine. Python is just
   * text, so nothing stops a student typing a script tag into an exercise and
   * waiting for someone to look at it. Keeping a nasty one in the demo data
   * means every `npm run demo -- --code` re-tests the escaping rather than
   * trusting that it was right the day it was written.
   */
  const HOSTILE_NAME = `<img src=x onerror="alert('name')">`;
  const HOSTILE_CODE =
    `print("hello")\n` +
    `</pre><script>alert("escaped the report")</script><pre>\n` +
    `# and an attribute break: " onmouseover="alert(1)\n`;

  return [
    {
      uid: "demo-finished",
      name: "Rosa Iyer",
      email: "rosa@example.edu",
      signInWith: "google.com",
      createdAt: "2026-09-28T12:00:00.000Z",
      lastSignInAt: "2026-11-14T08:30:00.000Z",
      savedAt: "2026-11-14T08:41:00.000Z",
      orphaned: false,
      state: completeThrough(lessons.length),
    },
    {
      uid: "demo-partway",
      name: "Daniel Okonkwo",
      email: "daniel@example.edu",
      signInWith: "password",
      createdAt: "2026-10-11T15:20:00.000Z",
      lastSignInAt: "2026-11-13T19:02:00.000Z",
      savedAt: "2026-11-13T19:44:00.000Z",
      orphaned: false,
      state: completeThrough(Math.max(1, Math.floor(lessons.length / 3))),
    },
    {
      uid: "demo-nothing",
      name: "Priya Raman",
      email: "priya@example.edu",
      signInWith: "password",
      createdAt: "2026-11-12T10:00:00.000Z",
      lastSignInAt: "2026-11-12T10:00:00.000Z",
      savedAt: null,
      orphaned: false,
      state: coerceProgress(null),
    },
    {
      uid: "demo-hostile",
      name: HOSTILE_NAME,
      email: `trouble+<b>@example.edu`,
      signInWith: "password",
      createdAt: "2026-10-20T09:00:00.000Z",
      lastSignInAt: "2026-11-13T07:15:00.000Z",
      savedAt: "2026-11-13T07:20:00.000Z",
      orphaned: false,
      state: completeThrough(2, HOSTILE_CODE),
    },
    {
      uid: "demo-orphan",
      name: null,
      email: null,
      signInWith: "none",
      createdAt: null,
      lastSignInAt: null,
      savedAt: "2026-11-01T11:11:00.000Z",
      orphaned: true,
      state: completeThrough(2),
    },
  ];
}

/* ---------------------------------------------------------------- rendering */

const DAY = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function day(value: string | null): string {
  if (!value) return "never";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "unreadable" : DAY.format(date);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function terminalSummary(rows: Row[]): string {
  const width = Math.max(4, ...rows.map((r) => (r.account.name ?? r.account.uid).length));
  const lines: string[] = [];

  for (const row of rows) {
    const who = (row.account.name ?? row.account.uid).padEnd(width);
    const badges = row.badges.length > 0 ? `${row.badges.length} badge${row.badges.length === 1 ? "" : "s"}` : "";
    const flag = row.account.orphaned ? "  [orphaned document]" : "";
    lines.push(
      `  ${who}  ${String(row.lessonsComplete).padStart(3)} lessons  ` +
        `${String(row.exercisesPassed).padStart(4)} exercises  ` +
        `last seen ${day(row.account.lastSignInAt).padEnd(13)}${badges}${flag}`,
    );
  }

  return lines.join("\n");
}

function renderHtml(rows: Row[], generatedAt: Date): string {
  const totals = {
    accounts: rows.filter((r) => !r.account.orphaned).length,
    active: rows.filter((r) => r.lessonsStarted > 0).length,
    badges: rows.reduce((sum, r) => sum + r.badges.length, 0),
    orphans: rows.filter((r) => r.account.orphaned).length,
  };

  const cards = rows
    .map((row) => {
      const a = row.account;
      const heading = escapeHtml(a.name ?? "No name on the account");
      const contact = a.email ? escapeHtml(a.email) : "no email";

      const courseRows = row.courses
        .filter((line) => line.total > 0 && (line.started > 0 || line.enrolled))
        .map(
          (line) => `
            <tr>
              <td>${escapeHtml(line.title)}</td>
              <td class="n">${line.complete} of ${line.total}</td>
              <td class="bar"><span style="width:${line.total ? Math.round((line.complete / line.total) * 100) : 0}%"></span></td>
              <td class="muted">${line.badge ? "badge earned" : line.enrolled ? "enrolled" : "not enrolled"}</td>
            </tr>`,
        )
        .join("");

      const badges =
        row.badges.length > 0
          ? `<ul class="badges">${row.badges
              .map(
                (b) =>
                  `<li>${escapeHtml(b.title)}${b.on ? ` <span class="muted">${escapeHtml(b.on)}</span>` : ""}</li>`,
              )
              .join("")}</ul>`
          : `<p class="muted">No badges yet.</p>`;

      const code = options.withCode ? renderCode(row) : "";

      return `
      <article class="account${a.orphaned ? " orphan" : ""}">
        <header>
          <h2>${heading}</h2>
          <p class="muted">${contact} &middot; ${escapeHtml(a.signInWith)} &middot; <code>${escapeHtml(a.uid)}</code></p>
          ${a.orphaned ? `<p class="warn">Progress document with no account behind it. A deletion did not finish.</p>` : ""}
        </header>

        <dl class="facts">
          <div><dt>Lessons complete</dt><dd>${row.lessonsComplete}</dd></div>
          <div><dt>Exercises passed</dt><dd>${row.exercisesPassed}</dd></div>
          <div><dt>Joined</dt><dd>${day(a.createdAt)}</dd></div>
          <div><dt>Last signed in</dt><dd>${day(a.lastSignInAt)}</dd></div>
          <div><dt>Progress saved</dt><dd>${day(a.savedAt)}</dd></div>
        </dl>

        ${courseRows ? `<table class="courses"><tbody>${courseRows}</tbody></table>` : `<p class="muted">Not enrolled in anything, and nothing started.</p>`}

        <h3>Badges</h3>
        ${badges}
        ${code}
      </article>`;
    })
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<!--
  This page embeds names and Python written by students, and Python is only
  text: nothing stops someone typing a script tag into an exercise and waiting
  for an organizer to open the report. Every value is escaped on the way in,
  and this is the second lock on the same door. There is no script, style
  sheet, image or connection this file legitimately needs, so everything is
  denied and only the inline style block above is allowed back.
-->
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:; base-uri 'none'; form-action 'none'">
<title>LeapCode roster</title>
<style>
  :root {
    --paper: #fefdfb; --surface: #f7f4ee; --line: #e6dfd4; --line-strong: #d0c7b8;
    --ink: #14202f; --muted: #4a5868; --faint: #5b6773;
    --navy: #0b2038; --accent: #0b5fd0; --green: #0d7a44; --warn: #8a2b2b;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; padding: 2.5rem 1.25rem 5rem; background: var(--paper); color: var(--ink);
    font: 15px/1.55 ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  }
  .wrap { max-width: 56rem; margin: 0 auto; }
  h1 { font-size: 1.5rem; margin: 0 0 .25rem; letter-spacing: -.01em; }
  .lede { color: var(--muted); margin: 0 0 2rem; font-size: .875rem; }
  .totals { display: flex; flex-wrap: wrap; gap: 2rem; padding: 1rem 0 1.25rem;
            border-top: 1px solid var(--line-strong); border-bottom: 1px solid var(--line-strong); margin-bottom: 2.5rem; }
  .totals div { min-width: 6rem; }
  .totals dt { font-size: .6875rem; text-transform: uppercase; letter-spacing: .06em; color: var(--faint); }
  .totals dd { margin: .2rem 0 0; font-size: 1.5rem; font-variant-numeric: tabular-nums; }
  .account { padding: 1.5rem 0; border-bottom: 1px solid var(--line); }
  .account.orphan { border-left: 3px solid var(--warn); padding-left: 1rem; }
  .account h2 { font-size: 1.0625rem; margin: 0; }
  .account h3 { font-size: .6875rem; text-transform: uppercase; letter-spacing: .06em;
                color: var(--faint); margin: 1.25rem 0 .5rem; font-weight: 600; }
  .muted { color: var(--muted); font-size: .8125rem; margin: .25rem 0 0; }
  .warn { color: var(--warn); font-size: .8125rem; margin: .5rem 0 0; font-weight: 600; }
  code { font-family: ui-monospace, "SF Mono", Menlo, monospace; font-size: .75rem; color: var(--faint); }
  .facts { display: flex; flex-wrap: wrap; gap: 1.75rem; margin: 1rem 0 1.25rem; }
  .facts dt { font-size: .6875rem; text-transform: uppercase; letter-spacing: .06em; color: var(--faint); }
  .facts dd { margin: .15rem 0 0; font-variant-numeric: tabular-nums; font-size: .9375rem; }
  table.courses { width: 100%; border-collapse: collapse; font-size: .875rem; }
  table.courses td { padding: .4rem 0; border-top: 1px solid var(--line); vertical-align: middle; }
  table.courses td.n { width: 6rem; text-align: right; font-variant-numeric: tabular-nums; color: var(--muted); }
  td.bar { width: 10rem; padding-left: 1rem; padding-right: 1rem; }
  td.bar span { display: block; height: 4px; background: var(--accent); border-radius: 2px; min-width: 2px; }
  td.muted { width: 8rem; text-align: right; }
  ul.badges { list-style: none; margin: 0; padding: 0; font-size: .875rem; }
  ul.badges li { padding: .35rem .6rem; border: 1px solid var(--line-strong); border-radius: 4px;
                 display: inline-block; margin: 0 .4rem .4rem 0; }
  ul.badges .muted { display: inline; margin-left: .35rem; }
  pre { background: var(--surface); border: 1px solid var(--line); border-radius: 4px;
        padding: .75rem; overflow-x: auto; font-size: .75rem; margin: .4rem 0 1rem; }
  .foot { color: var(--faint); font-size: .75rem; margin-top: 3rem; }
</style>
</head>
<body>
<div class="wrap">
  <h1>LeapCode roster</h1>
  <p class="lede">
    Generated ${escapeHtml(generatedAt.toISOString())}${options.demo ? " from synthetic demo data, not from real accounts" : ""}.
    Badges are recomputed from progress against the courses as they stand today, the same way a student's account page works them out.
  </p>

  <dl class="totals">
    <div><dt>Accounts</dt><dd>${totals.accounts}</dd></div>
    <div><dt>Started something</dt><dd>${totals.active}</dd></div>
    <div><dt>Badges earned</dt><dd>${totals.badges}</dd></div>
    <div><dt>Orphaned documents</dt><dd>${totals.orphans}</dd></div>
  </dl>

  ${cards}

  <p class="foot">
    This file lists real people and what they have written. It is ignored by git and belongs
    nowhere public. Delete it when you are done with it.
  </p>
</div>
</body>
</html>
`;
}

function renderCode(row: Row): string {
  const pieces: string[] = [];
  for (const [lessonId, lesson] of Object.entries(row.account.state.lessons)) {
    for (const [blockId, block] of Object.entries(lesson.blocks)) {
      if (!block.code) continue;
      pieces.push(
        `<p class="muted">${escapeHtml(lessonId)} &middot; ${escapeHtml(blockId)} &middot; ${block.status}, ${block.attempts} attempt${block.attempts === 1 ? "" : "s"}</p>` +
          `<pre>${escapeHtml(block.code)}</pre>`,
      );
    }
  }
  if (pieces.length === 0) return "";
  return `<h3>Submitted code</h3>${pieces.join("")}`;
}

/* -------------------------------------------------------------------- main */

async function main() {
  if (!options.demo && !options.key) {
    console.error(
      "\n  No service account key.\n\n" +
        "  Firebase console, Project settings, Service accounts, Generate new private key,\n" +
        "  then run:  npm run report -- --key ./service-account.json\n\n" +
        "  Or see the shape of the report without credentials:  npm run demo\n",
    );
    process.exitCode = 1;
    return;
  }

  const accounts = options.demo
    ? demoAccounts()
    : await readFirebase(options.key as string);

  // Most recently seen first: the people using it now are the ones worth
  // reading first, and an account that has never signed in sorts to the end.
  const rows = accounts
    .map(describe)
    .sort((a, b) =>
      (b.account.lastSignInAt ?? "").localeCompare(a.account.lastSignInAt ?? ""),
    );

  const generatedAt = new Date();
  mkdirSync(dirname(options.out), { recursive: true });
  writeFileSync(options.out, renderHtml(rows, generatedAt), "utf8");

  const real = rows.filter((r) => !r.account.orphaned).length;
  const orphans = rows.length - real;

  console.log(
    `\n  ${real} account${real === 1 ? "" : "s"}` +
      (orphans > 0 ? `, ${orphans} orphaned document${orphans === 1 ? "" : "s"}` : "") +
      (options.demo ? "  (synthetic demo data)" : "") +
      "\n",
  );
  console.log(terminalSummary(rows));
  console.log(`\n  Written to ${options.out}`);
  if (!options.withCode) {
    console.log("  Submitted code excluded. Pass --code to include it.\n");
  } else {
    console.log("  Includes submitted code.\n");
  }
}

main().catch((error) => {
  console.error("\n  Failed:", error instanceof Error ? error.message : error, "\n");
  process.exitCode = 1;
});
