"use client";

import { useEffect } from "react";
import { firestoreModule, loadFirestore } from "@/lib/firebase/client";
import { useAuth } from "@/lib/auth/AuthProvider";
import {
  getSnapshot,
  mergeProgress,
  replaceState,
  setRemoteSink,
  type ProgressState,
} from "@/lib/progress/localProgress";
import {
  describeSyncError,
  setSyncStatus,
} from "@/lib/progress/syncStatus";

/** Debounce so a burst of checks costs one write rather than several. */
const WRITE_DELAY_MS = 1500;

/**
 * Removes undefined values before writing.
 *
 * Firestore rejects undefined outright, while JSON.stringify silently drops
 * it. Progress has several optional fields (completedAt, passedAt, code), so
 * the same object that round-trips through localStorage without complaint
 * fails every single setDoc. That asymmetry meant sync was broken from the
 * start while looking fine locally.
 *
 * Dropping the key is correct here: absent and undefined mean the same thing
 * in this data, and null would read back as a value.
 */
function stripUndefined<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => stripUndefined(item)) as unknown as T;
  }
  if (value !== null && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
      if (item === undefined) continue;
      out[key] = stripUndefined(item);
    }
    return out as T;
  }
  return value;
}

/**
 * Keeps the progress store and the signed-in account in step.
 *
 * On sign-in it reads the account document once, merges it with whatever is
 * in this browser, and writes the result back. That merge is the point: a
 * student who works through two lessons before creating an account keeps
 * them, and a student signing in on a second device does not lose the first.
 *
 * One document per user, read once per session. That is what keeps this
 * inside Firestore's free tier at a few hundred students, since cost here is
 * driven by document reads rather than by how much work people do.
 *
 * Renders nothing.
 */
export function ProgressSync() {
  const { status, user } = useAuth();

  useEffect(() => {
    if (status !== "signedIn" || !user) {
      setRemoteSink(null);
      setSyncStatus({ state: "idle" });
      return;
    }

    const uid = user.uid;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let pending: ProgressState | null = null;

    async function write(state: ProgressState) {
      try {
        const [{ doc, setDoc }, db] = await Promise.all([
          firestoreModule(),
          loadFirestore(),
        ]);
        await setDoc(
          doc(db, "users", uid),
          { progress: stripUndefined(state), updatedAt: new Date().toISOString() },
          { merge: true },
        );
        setSyncStatus({ state: "synced" });
      } catch (error) {
        // Never surfaced mid-lesson: the work is safe in localStorage and the
        // next successful write sends the whole state anyway. Recorded so the
        // account page can say so rather than claiming everything is saved.
        setSyncStatus({ state: "error", message: describeSyncError(error) });
      }
    }

    function schedule(state: ProgressState) {
      pending = state;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        if (pending && !cancelled) void write(pending);
      }, WRITE_DELAY_MS);
    }

    (async () => {
      setSyncStatus({ state: "syncing" });

      let remote: ProgressState = { lessons: {} };
      try {
        const [{ doc, getDoc }, db] = await Promise.all([
          firestoreModule(),
          loadFirestore(),
        ]);
        const snapshot = await getDoc(doc(db, "users", uid));
        const stored = snapshot.data()?.progress as ProgressState | undefined;
        if (stored?.lessons) remote = stored;
      } catch (error) {
        // Could not read. Treat the account as empty rather than block the
        // lesson; the merge below still preserves local work.
        setSyncStatus({ state: "error", message: describeSyncError(error) });
      }
      if (cancelled) return;

      const merged = mergeProgress(getSnapshot(), remote);
      replaceState(merged);
      setRemoteSink(schedule);

      // Push the merge immediately so a second device sees it without
      // waiting for the student to finish another exercise.
      void write(merged);
    })();

    return () => {
      cancelled = true;
      if (timer) {
        clearTimeout(timer);
        // Do not drop work queued at the moment of sign-out or navigation.
        if (pending) void write(pending);
      }
      setRemoteSink(null);
    };
  }, [status, user]);

  return null;
}
