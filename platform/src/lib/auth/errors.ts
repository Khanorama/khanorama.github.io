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
  // The three below are setup problems rather than student mistakes. They
  // say so plainly, because a student seeing "check your password" when the
  // project is misconfigured will just keep retrying a correct password.
  "auth/operation-not-allowed":
    "Email and password sign-in is not switched on for this site yet. This is a setup problem, not something you did.",
  "auth/configuration-not-found":
    "Accounts are not finished being set up for this site yet. This is a setup problem, not something you did.",
  "auth/api-key-not-valid": "This site is not configured correctly yet. Let your teacher know.",
  "auth/invalid-api-key": "This site is not configured correctly yet. Let your teacher know.",
};

export function authErrorMessage(error: unknown): string {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code: unknown }).code)
      : "";
  return (
    MESSAGES[code] ?? "Something went wrong signing you in. Please try again."
  );
}
