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

interface AuthContextValue {
  status: AuthStatus;
  user: User | null;
  /** True once signed in but before the address has been confirmed. */
  needsVerification: boolean;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
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
      signOutNow,
      resetPassword,
      resendVerification,
    }),
    [status, user, signUp, signIn, signOutNow, resetPassword, resendVerification],
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
