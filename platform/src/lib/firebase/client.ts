import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";

/**
 * Firebase client setup, loaded on demand.
 *
 * Every import here is a type-only import, and the SDK itself is pulled in
 * with dynamic import() inside the functions below. That keeps roughly 180kB
 * of Firebase out of the initial bundle of every page, which matters twice
 * over: lesson pages are already carrying a code editor and a Python runtime,
 * and when the project is not configured at all the SDK is never fetched.
 *
 * The config values are public by design. They ship inside any client-side
 * Firebase app and identify the project rather than authorise anything; the
 * real security boundary is firestore.rules.
 *
 * In a static export these are inlined at build time, so the deploy workflow
 * must define them. Each must appear as a full literal below, or Next cannot
 * substitute it.
 */

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/**
 * Whether there is enough configuration to reach Firebase at all.
 *
 * When false the product runs signed out: lessons work, code runs, progress
 * is kept in this browser, and nothing offers an account it cannot create.
 */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
);

let appPromise: Promise<FirebaseApp> | null = null;

function loadApp(): Promise<FirebaseApp> {
  if (!isFirebaseConfigured) {
    return Promise.reject(
      new Error("Firebase is not configured; check isFirebaseConfigured first."),
    );
  }
  if (!appPromise) {
    appPromise = (async () => {
      const { initializeApp, getApps, getApp } = await import("firebase/app");
      return getApps().length
        ? getApp()
        : initializeApp(firebaseConfig as Required<typeof firebaseConfig>);
    })();
  }
  return appPromise;
}

let authPromise: Promise<Auth> | null = null;

export function loadAuth(): Promise<Auth> {
  if (!authPromise) {
    authPromise = (async () => {
      const [{ getAuth }, app] = await Promise.all([
        import("firebase/auth"),
        loadApp(),
      ]);
      return getAuth(app);
    })();
  }
  return authPromise;
}

let dbPromise: Promise<Firestore> | null = null;

export function loadFirestore(): Promise<Firestore> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const [{ getFirestore }, app] = await Promise.all([
        import("firebase/firestore"),
        loadApp(),
      ]);
      return getFirestore(app);
    })();
  }
  return dbPromise;
}

/** The auth SDK functions, fetched in the same chunk as the instance. */
export function authModule() {
  return import("firebase/auth");
}

/** The Firestore SDK functions. */
export function firestoreModule() {
  return import("firebase/firestore");
}
