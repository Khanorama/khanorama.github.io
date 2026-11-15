/**
 * Emulator tests for platform/firestore.rules.
 *
 * These rules are the only thing standing between one student and another
 * student's work. The API key is public, the whole app is static files, and
 * anybody can open a console and call the Firestore SDK with their own
 * credentials. Nothing in the UI constrains what requests get made, so a rule
 * that is wrong is not a bug that shows up as a broken screen: it is quiet,
 * and the first sign of it would be somebody reading work that is not theirs.
 *
 * So the point here is less "does the happy path work" than "does everything
 * that must be refused actually get refused". Roughly two thirds of what
 * follows asserts a failure.
 *
 *   npm test
 */

import { readFileSync } from "node:fs";
import { after, before, describe, it } from "node:test";

import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";

let env;

const STUDENT = "student-alice";
const OTHER = "student-bob";
const ORGANIZER = "organizer-kim";

/** A well-formed record, the shape the app actually writes. */
const record = (name = "Alice") => ({
  progress: {
    lessons: { "py1-u1-l1": { blocks: {}, startedAt: "2026-11-01T00:00:00Z" } },
    enrollments: {},
  },
  updatedAt: "2026-11-01T00:00:00Z",
  name,
});

before(async () => {
  env = await initializeTestEnvironment({
    projectId: "demo-leapcode",
    firestore: {
      rules: readFileSync("./firestore.rules", "utf8"),
      host: "127.0.0.1",
      port: 8080,
    },
  });

  // Seed through a context that bypasses the rules, so the fixtures exist
  // regardless of whether the rules would have allowed them to be created.
  await env.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await setDoc(doc(db, "users", STUDENT), record("Alice"));
    await setDoc(doc(db, "users", OTHER), record("Bob"));
    await setDoc(doc(db, "admins", ORGANIZER), { added: "2026-11-15" });
  });
});

after(async () => {
  await env?.cleanup();
});

const asStudent = () => env.authenticatedContext(STUDENT).firestore();
const asOther = () => env.authenticatedContext(OTHER).firestore();
const asOrganizer = () => env.authenticatedContext(ORGANIZER).firestore();
const asStranger = () => env.unauthenticatedContext().firestore();

describe("a student and their own record", () => {
  it("reads it", async () => {
    await assertSucceeds(getDoc(doc(asStudent(), "users", STUDENT)));
  });

  it("writes it", async () => {
    await assertSucceeds(
      setDoc(doc(asStudent(), "users", STUDENT), record("Alice")),
    );
  });

  it("writes it without a name", async () => {
    const { name, ...withoutName } = record();
    void name;
    await assertSucceeds(
      setDoc(doc(asStudent(), "users", STUDENT), withoutName),
    );
  });

  it("deletes it, which is what the delete account button does", async () => {
    await env.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), "users", "doomed"), record());
    });
    await assertSucceeds(
      deleteDoc(doc(env.authenticatedContext("doomed").firestore(), "users", "doomed")),
    );
  });
});

describe("a student and somebody else's record", () => {
  it("cannot read it", async () => {
    await assertFails(getDoc(doc(asStudent(), "users", OTHER)));
  });

  it("cannot write it", async () => {
    await assertFails(setDoc(doc(asStudent(), "users", OTHER), record("Bob")));
  });

  it("cannot delete it", async () => {
    await assertFails(deleteDoc(doc(asStudent(), "users", OTHER)));
  });

  it("cannot list the whole collection to get around that", async () => {
    await assertFails(getDocs(collection(asStudent(), "users")));
  });
});

describe("the field allowlist", () => {
  it("refuses a field nobody asked for", async () => {
    await assertFails(
      setDoc(doc(asStudent(), "users", STUDENT), {
        ...record(),
        organizer: true,
      }),
    );
  });

  it("refuses progress that is not a map", async () => {
    await assertFails(
      setDoc(doc(asStudent(), "users", STUDENT), {
        progress: "everything",
        updatedAt: "2026-11-01T00:00:00Z",
      }),
    );
  });

  it("refuses a name that is not a string", async () => {
    await assertFails(
      setDoc(doc(asStudent(), "users", STUDENT), { ...record(), name: 42 }),
    );
  });

  it("refuses a name used as bulk storage", async () => {
    await assertFails(
      setDoc(doc(asStudent(), "users", STUDENT), {
        ...record(),
        name: "x".repeat(81),
      }),
    );
  });

  it("accepts a name at the limit", async () => {
    await assertSucceeds(
      setDoc(doc(asStudent(), "users", STUDENT), {
        ...record(),
        name: "x".repeat(80),
      }),
    );
  });
});

describe("an organizer", () => {
  it("reads another account's record", async () => {
    await assertSucceeds(getDoc(doc(asOrganizer(), "users", STUDENT)));
  });

  it("lists every account, which is what the roster does", async () => {
    await assertSucceeds(getDocs(collection(asOrganizer(), "users")));
  });

  it("still cannot write to somebody else's record", async () => {
    await assertFails(
      setDoc(doc(asOrganizer(), "users", STUDENT), record("tampered")),
    );
  });

  it("still cannot delete somebody else's record", async () => {
    await assertFails(deleteDoc(doc(asOrganizer(), "users", STUDENT)));
  });
});

describe("the admins collection", () => {
  it("lets an account check its own membership", async () => {
    await assertSucceeds(getDoc(doc(asOrganizer(), "admins", ORGANIZER)));
  });

  it("answers a non-organizer without an error, so the app can ask", async () => {
    await assertSucceeds(getDoc(doc(asStudent(), "admins", STUDENT)));
  });

  it("will not reveal whether somebody else is an organizer", async () => {
    await assertFails(getDoc(doc(asStudent(), "admins", ORGANIZER)));
  });

  it("cannot be listed, so organizers cannot be enumerated", async () => {
    await assertFails(getDocs(collection(asOrganizer(), "admins")));
  });

  it("cannot be written by a student promoting themselves", async () => {
    await assertFails(
      setDoc(doc(asStudent(), "admins", STUDENT), { added: "today" }),
    );
  });

  it("cannot be written even by an organizer", async () => {
    await assertFails(
      setDoc(doc(asOrganizer(), "admins", OTHER), { added: "today" }),
    );
  });
});

describe("a signed-out visitor", () => {
  it("cannot read a record", async () => {
    await assertFails(getDoc(doc(asStranger(), "users", STUDENT)));
  });

  it("cannot write a record", async () => {
    await assertFails(setDoc(doc(asStranger(), "users", STUDENT), record()));
  });

  it("cannot list records", async () => {
    await assertFails(getDocs(collection(asStranger(), "users")));
  });

  it("cannot read the admins collection", async () => {
    await assertFails(getDoc(doc(asStranger(), "admins", ORGANIZER)));
  });
});

describe("a second student", () => {
  it("is not an organizer just because one exists", async () => {
    await assertFails(getDocs(collection(asOther(), "users")));
  });
});
