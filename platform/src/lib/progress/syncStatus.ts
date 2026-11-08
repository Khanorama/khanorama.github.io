/**
 * Whether progress is actually reaching the account.
 *
 * Sync failures are swallowed on purpose: a student mid-exercise should not
 * be shown a Firestore error, and their work is safe in localStorage either
 * way. But swallowing it silently means a misconfigured project looks
 * identical to a working one, and the account page would claim "saved to
 * your account" while nothing was being saved.
 *
 * So failures are recorded here and surfaced in one place, on the account
 * page, where someone setting the project up will look.
 */

export type SyncState = "idle" | "syncing" | "synced" | "error";

export interface SyncStatus {
  state: SyncState;
  /** Set when state is "error". Safe to show to a person. */
  message?: string;
}

const IDLE: SyncStatus = Object.freeze({ state: "idle" }) as SyncStatus;

let current: SyncStatus = IDLE;
const listeners = new Set<() => void>();

export function setSyncStatus(next: SyncStatus): void {
  current = next;
  for (const listener of listeners) listener();
}

export function subscribeSyncStatus(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSyncStatus(): SyncStatus {
  return current;
}

export function getServerSyncStatus(): SyncStatus {
  return IDLE;
}

/**
 * Turns a Firestore error into something a person setting this up can act on.
 *
 * permission-denied is by far the most likely, and it almost always means the
 * rules in firestore.rules have not been published yet.
 */
export function describeSyncError(error: unknown): string {
  // The friendly message below is what a student sees. The raw error goes to
  // the console, because the person setting the project up needs the code,
  // and a silent failure here is what made this hard to diagnose at all.
  console.warn("[leapcode] progress sync failed:", error);

  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code: unknown }).code)
      : "";

  if (code.includes("permission-denied")) {
    return "The database refused the write. The security rules in firestore.rules have probably not been published yet.";
  }
  if (code.includes("unavailable") || code.includes("network")) {
    return "Could not reach the database. Your work is saved in this browser and will sync when you are back online.";
  }
  if (code.includes("not-found")) {
    return "No Firestore database found for this project. Create one in the Firebase console.";
  }
  if (code.includes("unauthenticated")) {
    return "Your sign-in expired. Signing out and back in should fix it.";
  }
  return "Progress is not reaching your account. It is still saved in this browser.";
}
