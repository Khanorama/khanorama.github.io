# LeapCode platform

The interactive learning platform, built as a Next.js static export so it can
be served from GitHub Pages with no server and no hosting cost.

## Running locally

```bash
npm install
npm run dev
```

`predev` and `prebuild` stage the Pyodide runtime from `node_modules` into
`public/pyodide` (about 13MB, gitignored). Anything deploying this must run
the build rather than serve the repository directly, or Python will 404.

## How it works

- **Lesson content** lives in `src/content/courses/`, as typed data rather
  than database rows, so the curriculum is versioned and reviewable in a diff.
  Each unit file documents the corrections made to the source notebooks.
- **Python runs in the browser** via Pyodide in a module worker
  (`public/pyodide-worker.js`). Nothing is sent to a server. Runaway loops are
  stopped by terminating the worker, because Pyodide's interrupt buffer needs
  cross-origin isolation headers that GitHub Pages cannot send.
- **Exercises are graded** on both output and structure. Structure comes from
  parsing the submission with Python's own `ast` module, so a `print()` inside
  a string is not miscounted.
- **Progress** is held in `localStorage` and mirrored to Firestore when a
  student is signed in.

## Accounts (optional)

The platform runs without Firebase. Lessons work, code runs, and progress
saves to the browser. Accounts add cross-device progress.

To switch them on:

1. In the [Firebase console](https://console.firebase.google.com), open the
   project and go to **Authentication > Sign-in method**, then enable
   **Email/Password**. Skipping this is the most common first-run failure and
   produces `auth/configuration-not-found`.
2. Create a **Web app** under **Project settings > General** if there is not
   one already, and copy its config values.
3. Copy `.env.example` to `.env.local` and fill in the six values. Set the
   same names in the deployment workflow: a static export inlines them at
   build time, so they must exist in the build environment.

   Add them as **repository secrets** (Settings > Secrets and variables >
   Actions, Secrets tab), not environment secrets. The build job declares no
   `environment:`, so secrets scoped to the `github-pages` environment are
   invisible to it and arrive as empty strings. That would produce a
   successful build of a site where sign-in silently does not exist, so the
   workflow fails the build instead if they are missing.
4. Publish the security rules from `firestore.rules`. In the console, go to
   **Firestore Database > Rules**, select all of the existing contents,
   replace them with that file, and press Publish.

   Check you are in **Firestore Database** and not **Realtime Database**.
   Firebase ships two unrelated databases and the console surfaces both.
   Realtime Database rules are JSON, so pasting these into it fails with
   `Line 1: Parse error`, because `rules_version = '2';` is not JSON. The
   URL should contain `/firestore/`, not `/database/`.

   Paste the whole file in one go. A truncated paste produces the same
   `Line 1: Parse error`, since unclosed braces make the whole document
   fail to parse rather than any single line.

   There is deliberately no `firebase.json` in this repository, so the
   Firebase CLI cannot deploy the rules without `firebase init` being run
   first. The console is the shorter path for a file that changes rarely.

### A note on the keys

The `NEXT_PUBLIC_FIREBASE_*` values are public. They ship inside the client
bundle by design and identify the project; they do not authorise anything.
The security boundary is `firestore.rules`, which restricts every student to
their own document and rejects any field the client does not send. Do not put
a service account key or any admin credential in these variables.

## Data model

One document per student at `users/{uid}`, holding the whole progress state.
A course page therefore costs one read regardless of how many lessons it
contains, which is what keeps a few hundred students inside Firestore's free
tier, since cost is driven by document reads rather than by activity.

## What is deliberately not here

Graded exams. Every expected answer ships inside the JavaScript bundle, so a
static client cannot secure an assessment that counts for a grade. The
`assessment` lesson kind exists in the content model for when there is a
server-side grader; until then, exams stay instructor-run.
