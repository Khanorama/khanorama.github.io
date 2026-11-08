/**
 * Turns Firebase error codes into something a student can act on.
 *
 * Firebase reports failures as codes like "auth/invalid-credential", which
 * tells a beginner nothing and looks like the site is broken. Each message
 * below says what happened and what to do instead.
 *
 * Note that wrong-password and unknown-email deliberately produce the same
 * message. Distinguishing them would let anyone test which email addresses
 * have accounts here, and these are school students.
 */
const MESSAGES: Record<string, string> = {
  "auth/invalid-email": "That does not look like an email address.",
  "auth/missing-password": "Enter your password.",
  "auth/weak-password":
    "That password is too short. Use at least six characters.",
  "auth/email-already-in-use":
    "There is already an account with that email. Try signing in instead.",
  "auth/invalid-credential": "That email and password do not match an account.",
  "auth/wrong-password": "That email and password do not match an account.",
  "auth/user-not-found": "That email and password do not match an account.",
  "auth/user-disabled": "This account has been disabled. Contact your teacher.",
  "auth/too-many-requests":
    "Too many attempts. Wait a few minutes and try again.",
  "auth/network-request-failed":
    "Could not reach the server. Check your connection and try again.",
  // Google sign-in. A blocked popup is the common one, and it is worth
  // naming the pop-up blocker explicitly: the window simply never appears,
  // so without being told, a student assumes the button is broken.
  "auth/popup-blocked":
    "Your browser blocked the Google sign-in window. Allow pop-ups for this site, or sign in with your email and password instead.",
  "auth/account-exists-with-different-credential":
    "You already have an account with that email address, set up with a password. Sign in with your password instead.",
  "auth/unauthorized-domain":
    "Google sign-in is not authorised for this web address yet. This is a setup problem, not something you did.",

  // The four below are setup problems rather than student mistakes. They
  // say so plainly, because a student seeing "check your password" when the
  // project is misconfigured will just keep retrying a correct password.
  //
  // This one stays provider-neutral: it fires for whichever sign-in method
  // is switched off in the Firebase console, not only email and password.
  "auth/operation-not-allowed":
    "That way of signing in is not switched on for this site yet. This is a setup problem, not something you did.",
  "auth/configuration-not-found":
    "Accounts are not finished being set up for this site yet. This is a setup problem, not something you did.",
  "auth/api-key-not-valid": "This site is not configured correctly yet. Let your teacher know.",
  "auth/invalid-api-key": "This site is not configured correctly yet. Let your teacher know.",
};

function codeOf(error: unknown): string {
  return typeof error === "object" && error !== null && "code" in error
    ? String((error as { code: unknown }).code)
    : "";
}

export function authErrorMessage(error: unknown): string {
  return (
    MESSAGES[codeOf(error)] ??
    "Something went wrong signing you in. Please try again."
  );
}

/**
 * Closing the Google popup is a decision, not a failure.
 *
 * Firebase reports it as a thrown error either way, but showing a red alert
 * to someone who simply changed their mind reads as though the site broke.
 * Callers use this to stay quiet instead.
 *
 * Two codes count. The first is the student dismissing the window. The
 * second fires when a double-click opens a second popup that supersedes the
 * first, which is a mis-click rather than anything worth reporting.
 */
const CANCELLATIONS = new Set([
  "auth/popup-closed-by-user",
  "auth/cancelled-popup-request",
  "auth/user-cancelled",
]);

export function isAuthCancellation(error: unknown): boolean {
  return CANCELLATIONS.has(codeOf(error));
}
