"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth/AuthProvider";
import { authErrorMessage, isAuthCancellation } from "@/lib/auth/errors";

type Mode = "signIn" | "signUp" | "reset";

const COPY: Record<Mode, { title: string; action: string; blurb: string }> = {
  signIn: {
    title: "Sign in",
    action: "Sign in",
    blurb: "Pick up where you left off, on any device.",
  },
  signUp: {
    title: "Create an account",
    action: "Create account",
    blurb:
      "Your progress is saved to your account, so it follows you between devices.",
  },
  reset: {
    title: "Reset your password",
    action: "Send reset link",
    blurb: "We will email you a link to choose a new password.",
  },
};

const fieldClass =
  "w-full rounded-control border border-line bg-paper px-3 py-2 font-sans text-sm text-ink " +
  "placeholder:text-ink-faint focus-visible:border-accent";

export function AuthForm() {
  const { signIn, signUp, resetPassword, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<Mode>("signIn");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);

  function switchTo(next: Mode) {
    setMode(next);
    setError(null);
    setNotice(null);
  }

  async function handleGoogle() {
    setError(null);
    setNotice(null);
    setGoogleBusy(true);
    try {
      await signInWithGoogle();
    } catch (caught) {
      // Someone closing the popup has not hit a problem, so say nothing.
      if (!isAuthCancellation(caught)) setError(authErrorMessage(caught));
    } finally {
      setGoogleBusy(false);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setBusy(true);
    try {
      if (mode === "signIn") {
        await signIn(email.trim(), password);
      } else if (mode === "signUp") {
        await signUp(name, email.trim(), password);
      } else {
        await resetPassword(email.trim());
        setNotice(
          "If an account exists for that address, a reset link is on its way.",
        );
      }
    } catch (caught) {
      setError(authErrorMessage(caught));
    } finally {
      setBusy(false);
    }
  }

  const copy = COPY[mode];

  return (
    <div className="mx-auto w-full max-w-sm">
      <h1 className="text-2xl font-semibold text-ink">{copy.title}</h1>
      <p className="mt-1.5 font-sans text-sm text-ink-muted">{copy.blurb}</p>

      {/*
        Google sits above the email fields because it is the shorter path
        and most students already have a school Google account. Hidden in
        reset mode, where the subject is a password Google does not hold.
      */}
      {mode !== "reset" && (
        <>
          <Button
            type="button"
            variant="secondary"
            onClick={handleGoogle}
            disabled={busy || googleBusy}
            className="mt-6 w-full"
          >
            <GoogleMark />
            {googleBusy ? "Waiting for Google" : "Continue with Google"}
          </Button>

          <div className="mt-4 flex items-center gap-3" aria-hidden="true">
            <span className="h-px flex-1 bg-line" />
            <span className="font-sans text-xs text-ink-faint">or</span>
            <span className="h-px flex-1 bg-line" />
          </div>
        </>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-3">
        {mode === "signUp" && (
          <label className="block">
            <span className="mb-1 block font-sans text-xs font-medium text-ink-muted">
              Your name
            </span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              className={fieldClass}
            />
          </label>
        )}

        <label className="block">
          <span className="mb-1 block font-sans text-xs font-medium text-ink-muted">
            Email
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            className={fieldClass}
          />
        </label>

        {mode !== "reset" && (
          <label className="block">
            <span className="mb-1 block font-sans text-xs font-medium text-ink-muted">
              Password
            </span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={
                mode === "signUp" ? "new-password" : "current-password"
              }
              className={fieldClass}
            />
            {mode === "signUp" && (
              <span className="mt-1 block font-sans text-xs text-ink-faint">
                At least six characters.
              </span>
            )}
          </label>
        )}

        {error && (
          <p
            role="alert"
            className="rounded-control border border-danger-line bg-danger-soft px-3 py-2 font-sans text-sm text-ink"
          >
            {error}
          </p>
        )}

        {notice && (
          <p className="rounded-control border border-success-line bg-success-soft px-3 py-2 font-sans text-sm text-ink">
            {notice}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          disabled={busy || googleBusy}
          className="w-full"
        >
          {busy ? "Working" : copy.action}
        </Button>
      </form>

      <div className="mt-5 space-y-1.5 font-sans text-sm text-ink-muted">
        {mode === "signIn" && (
          <>
            <p>
              No account yet?{" "}
              <button
                type="button"
                onClick={() => switchTo("signUp")}
                className="text-accent hover:text-accent-hover"
              >
                Create one
              </button>
            </p>
            <p>
              <button
                type="button"
                onClick={() => switchTo("reset")}
                className="text-accent hover:text-accent-hover"
              >
                Forgotten your password?
              </button>
            </p>
          </>
        )}
        {mode !== "signIn" && (
          <p>
            <button
              type="button"
              onClick={() => switchTo("signIn")}
              className="text-accent hover:text-accent-hover"
            >
              Back to sign in
            </button>
          </p>
        )}
      </div>

      <p className="mt-8 border-t border-line pt-4 font-sans text-xs text-ink-faint">
        You do not need an account to use the lessons.{" "}
        <Link href="/" className="text-accent hover:text-accent-hover">
          Start learning
        </Link>{" "}
        and your progress saves in this browser. Signing in carries it across
        devices.
      </p>
    </div>
  );
}

/**
 * Google's G, drawn at its official four colours.
 *
 * Kept fixed across light and dark rather than recoloured to the palette:
 * it identifies someone else's service, and a navy or monochrome G would
 * read as a different button. This is the one mark on the site that does
 * not take the design system's colours, and that is deliberate.
 */
function GoogleMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"
      />
    </svg>
  );
}
