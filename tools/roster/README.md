# Roster

Every account, what it has finished, and what badges it has earned, as a page
you open on your own machine.

```bash
cd tools/roster
npm install
npm run demo                                  # synthetic data, no key needed
npm run report -- --key ./service-account.json
```

The report lands in `out/roster.html`. Open it in a browser.

## Getting a key

Firebase console, Project settings, Service accounts, Generate new private
key. Save the downloaded file into this folder.

**That file is the whole project.** It reads and writes every account and
every document, and it ignores the security rules completely. Treat it like
the password to the project, because that is what it is:

- Every `.json` in this folder is gitignored by default, with the handful
  that belong in git allowed back by name. Adding a credential here is safe
  by default rather than safe if you remember.
- Do not put it in Drive, Slack, Discord, or an email.
- If it ever leaks, revoke it in the same console screen that made it.

`out/` is gitignored too, because a generated report lists real people and
the code they wrote. Delete reports when you are done reading them.

## Options

| Flag | Effect |
| --- | --- |
| `--key <path>` | Service account key. Defaults to `GOOGLE_APPLICATION_CREDENTIALS`. |
| `--demo` | Synthetic accounts. No credentials, no real data. |
| `--code` | Include the Python students submitted. Off by default. |
| `--out <path>` | Where to write the HTML. Defaults to `out/roster.html`. |

`--code` is off by default on purpose. Submitted code is the most personal
thing stored, and checking who finished Unit 2 does not need it.

## Why this is a script and not a page on the site

Two reasons.

A page could not do the job. The progress document is keyed by an opaque uid
and holds nothing but `progress` and `updatedAt`. Names and email addresses
live in Firebase Authentication, and the client SDK cannot list those, so an
admin screen inside the app would show rows of uids with no way to tell whose
work is whose. Resolving that needs the Admin SDK, which needs a key, which
cannot live in a static site. This reads both and joins them.

The second reason decided it. The privacy policy tells students that access
to their progress is "restricted to your own signed-in account, enforced by
rules on the database rather than only by the app". An admin account with
read access in the app would make that sentence false and `firestore.rules`
would have to say so. A service account is the same owner-level access the
Firebase console already has, so the rules stay exactly as published.

If you later want this as a page in the app, it means changing both the rules
and that sentence, and deciding whether to start storing names in Firestore
so the page has something to show besides uids.

## Badges

Recomputed from progress against the courses as they stand today, by calling
the same `earnedBadges` the account page calls. Badges are derived and never
stored, so reusing that function is the only way this report and a student's
own page can agree. A second implementation here would drift the first time a
lesson was added, and would do it quietly.

## Orphaned documents

A progress document with no account behind it gets its own marker at the top
of the report. Deleting an account removes the document first, so an orphan
means a deletion stopped halfway and someone's work outlived their account.
The privacy policy promises that deletion happens immediately, which makes
these worth looking at rather than ignoring.

## Note on `npm audit`

Eight moderate advisories, all of them the same `uuid` bounds-check issue
reaching this through Google's own client libraries. Nothing here is exposed
to a network and the tool runs locally against your own project, so there is
nothing to act on until Google updates those dependencies.
