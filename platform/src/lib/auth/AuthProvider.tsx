"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "firebase/auth";
import { authModule, isFirebaseConfigured, loadAuth } from "@/lib/firebase/client";

/**
 * "unavailable" is a real, supported state, not an error.
 *
 * Without Firebase keys the platform still teaches: lessons run, code
 * executes, progress saves to this browser. The UI uses this to avoid
 * offering accounts it cannot create.
 */
export type AuthStatus = "loading" | "signedIn" | "signedOut" | "unavailable";

/**
 * A cheap, synchronous hint about who was last signed in.
 *
 * Firebase keeps its session in IndexedDB and resolves it asynchronously
 * after the SDK loads, which takes long enough that a returning student
 * would see the signed-out page first and then watch it change under them.
 * This is only a hint for choosing what to render immediately; it grants no
 * access and is corrected the moment real auth state arrives.
 */
const HINT_KEY = "leapcode-user-hint";

export interface UserHint {
  name: string | null;
}

export function readUserHint(): UserHint | null {
  try {
    const raw = window.localStorage.getItem(HINT_KEY);
    return raw ? (JSON.parse(raw) as UserHint) : null;
  } catch {
    return null;
  }
}

function writeUserHint(user: User | null) {
  try {
    if (user) {
      window.localStorage.setItem(
        HINT_KEY,
        JSON.stringify({ name: user.displayName }),
      );
    } else {
      window.localStorage.removeItem(HINT_KEY);
    }
  } catch {
    // Private browsing. The page simply resolves a moment later.
  }
}

interface AuthContextValue {
  status: AuthStatus;
  user: User | null;
  /** True once signed in but before the address has been confirmed. */
  needsVerification: boolean;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOutNow: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resendVerification: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>(
    isFirebaseConfigured ? "loading" : "unavailable",
  );
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured) return;

    let cancelled = false;
    let unsubscribe: (() => void) | null = null;

    (async () => {
      try {
        const [{ onAuthStateChanged }, auth] = await Promise.all([
          authModule(),
          loadAuth(),
        ]);
        if (cancelled) return;
        unsubscribe = onAuthStateChanged(auth, (next) => {
          setUser(next);
          setStatus(next ? "signedIn" : "signedOut");
          writeUserHint(next);
        });
      } catch {
        // The SDK could not load, most likely offline. Fall back to the
        // signed-out experience rather than leaving the UI spinning.
        if (!cancelled) setStatus("signedOut");
      }
    })();

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      const [mod, auth] = await Promise.all([authModule(), loadAuth()]);
      const credential = await mod.createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      if (name.trim()) {
        await mod.updateProfile(credential.user, { displayName: name.trim() });
      }
      // Sent, but not enforced. Blocking a student from their first lesson
      // over an unread email would cost more than it protects.
      try {
        await mod.sendEmailVerification(credential.user);
      } catch {
        // Rate limited or offline. The account still exists and works.
      }
    },
    [],
  );

  const signIn = useCallback(async (email: string, password: string) => {
    const [mod, auth] = await Promise.all([authModule(), loadAuth()]);
    await mod.signInWithEmailAndPassword(auth, email, password);
  }, []);

  /**
   * Google sign-in, through a popup rather than a redirect.
   *
   * signInWithRedirect needs the Firebase auth domain to write storage in a
   * third-party context on the way back, which Safari and Chrome now block
   * by default. The app is served from leapcode.org while the auth domain is
   * a firebaseapp.com address, so redirect would fail for a large share of
   * students, and fail silently: they would land back on the page still
   * signed out with nothing to read. A popup keeps the exchange first-party.
   *
   * Nothing here creates a profile record. onAuthStateChanged fires exactly
   * as it does for email sign-in, so progress sync and the name hint already
   * handle a Google account without needing to know it is one.
   */
  const signInWithGoogle = useCallback(async () => {
    const [mod, auth] = await Promise.all([authModule(), loadAuth()]);
    const provider = new mod.GoogleAuthProvider();
    // Always ask which account to use. Students share machines, and
    // silently reusing whichever Google session the browser happens to be
    // holding is how one student's progress lands on another's account.
    provider.setCustomParameters({ prompt: "select_account" });
    await mod.signInWithPopup(auth, provider);
  }, []);

  const signOutNow = useCallback(async () => {
    const [mod, auth] = await Promise.all([authModule(), loadAuth()]);
    await mod.signOut(auth);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const [mod, auth] = await Promise.all([authModule(), loadAuth()]);
    await mod.sendPasswordResetEmail(auth, email);
  }, []);

  const resendVerification = useCallback(async () => {
    const [mod, auth] = await Promise.all([authModule(), loadAuth()]);
    if (auth.currentUser) await mod.sendEmailVerification(auth.currentUser);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      needsVerification: Boolean(user && !user.emailVerified),
      signUp,
      signIn,
      signInWithGoogle,
      signOutNow,
      resetPassword,
      resendVerification,
    }),
    [
      status,
      user,
      signUp,
      signIn,
      signInWithGoogle,
      signOutNow,
      resetPassword,
      resendVerification,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
