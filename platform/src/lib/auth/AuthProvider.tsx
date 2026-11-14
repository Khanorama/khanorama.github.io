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
import {
  authModule,
  firestoreModule,
  isFirebaseConfigured,
  loadAuth,
  loadFirestore,
} from "@/lib/firebase/client";
import { resetProgress } from "@/lib/progress/localProgress";

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
  /** Irreversible. Removes the stored progress, then the account itself. */
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Where Firebase sends the student after they click the link in the email.
 *
 * Without this, confirming drops them on Firebase's own generic success
 * page with no route back to the site: they have done what was asked and
 * are now stranded somewhere that is not LeapCode.
 *
 * The origin is read from the page rather than configured, so it is
 * correct in development and in production without a second setting to
 * keep in step. It must be an authorized domain in the Firebase console;
 * if it is not, Firebase rejects the whole send, which is why the callers
 * below fall back to sending without it.
 */
function returnToAccount() {
  return { url: `${window.location.origin}/account/`, handleCodeInApp: false };
}

/**
 * Sends the confirmation email, preferring one that can get back here.
 *
 * A worse email beats no email: if the continue URL is refused, usually
 * because the domain has not been authorized, this retries without it
 * rather than leaving the student with nothing in their inbox.
 */
async function sendVerification(
  mod: Awaited<ReturnType<typeof authModule>>,
  target: User,
) {
  try {
    await mod.sendEmailVerification(target, returnToAccount());
  } catch {
    await mod.sendEmailVerification(target);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>(
    isFirebaseConfigured ? "loading" : "unavailable",
  );
  const [user, setUser] = useState<User | null>(null);
  /*
    Kept apart from `user` on purpose. Firebase mutates the User object in
    place when it is reloaded and does not fire onAuthStateChanged, so the
    reference React holds never changes and nothing re-renders. Reading
    emailVerified into its own piece of state is what lets the banner
    actually disappear.
  */
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured) return;

    let canceled = false;
    let unsubscribe: (() => void) | null = null;

    (async () => {
      try {
        const [{ onAuthStateChanged }, auth] = await Promise.all([
          authModule(),
          loadAuth(),
        ]);
        if (canceled) return;
        unsubscribe = onAuthStateChanged(auth, (next) => {
          setUser(next);
          setVerified(Boolean(next?.emailVerified));
          setStatus(next ? "signedIn" : "signedOut");
          writeUserHint(next);
        });
      } catch {
        // The SDK could not load, most likely offline. Fall back to the
        // signed-out experience rather than leaving the UI spinning.
        if (!canceled) setStatus("signedOut");
      }
    })();

    return () => {
      canceled = true;
      unsubscribe?.();
    };
  }, []);

  /*
    Notices that the student has confirmed their address.

    Clicking the link in the email verifies the account on Firebase's
    servers, but this tab is still holding the token it was given at
    sign-in, which says the address is unconfirmed. Nothing pushes an
    update: onAuthStateChanged does not fire for this, so without asking,
    the banner keeps telling someone who has just done what was asked that
    they have not done it. The stale token can live for about an hour.

    Asking on return is enough, and it is the moment that matters: the
    student clicks the link, lands back here or switches back to this tab,
    and the answer is already correct. Polling on a timer would cost
    requests for every signed-in reader to catch a case that only happens
    once per account.

    It stops entirely once verified, so a confirmed account never checks
    again.
  */
  useEffect(() => {
    if (!user || verified) return;

    let dropped = false;

    async function check() {
      try {
        await user!.reload();
        if (!dropped) setVerified(Boolean(user!.emailVerified));
      } catch {
        // Offline, or the account is gone. If it is gone, the auth
        // listener signs them out on its own and this is moot.
      }
    }

    function onVisible() {
      if (!document.hidden) void check();
    }

    void check();
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);

    return () => {
      dropped = true;
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
    };
  }, [user, verified]);

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
        await sendVerification(mod, credential.user);
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

  /**
   * Deletes the account and everything stored with it.
   *
   * ORDER MATTERS AND IS NOT NEGOTIABLE. The Firestore document goes
   * first, then the auth record. The security rule on that document keys
   * on request.auth.uid, so deleting the account first would leave the
   * progress sitting there permanently unreachable: no one could ever
   * authenticate as that uid again to remove it. Deleting the document
   * first means a failure anywhere leaves the account intact and the
   * student able to try again or to email us.
   *
   * If the Firestore delete is refused, this throws without touching the
   * account. That is the safe direction to fail in, and it is also what
   * happens if the updated rules have not been published yet.
   */
  const deleteAccount = useCallback(async () => {
    const [mod, auth] = await Promise.all([authModule(), loadAuth()]);
    const current = auth.currentUser;
    if (!current) throw new Error("Not signed in.");

    const [store, db] = await Promise.all([firestoreModule(), loadFirestore()]);
    await store.deleteDoc(store.doc(db, "users", current.uid));

    await mod.deleteUser(current);

    // Local copies last, once the remote ones are definitely gone. Doing
    // this first would wipe the student's work and then leave it on the
    // server if the delete failed.
    resetProgress();
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
    if (auth.currentUser) await sendVerification(mod, auth.currentUser);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      needsVerification: Boolean(user) && !verified,
      signUp,
      signIn,
      signInWithGoogle,
      signOutNow,
      deleteAccount,
      resetPassword,
      resendVerification,
    }),
    [
      status,
      user,
      verified,
      signUp,
      signIn,
      signInWithGoogle,
      signOutNow,
      deleteAccount,
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
