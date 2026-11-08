"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth/AuthProvider";
import { authErrorMessage } from "@/lib/auth/errors";

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
  const { signIn, signUp, resetPassword } = useAuth();
  const [mode, setMode] = useState<Mode>("signIn");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function switchTo(next: Mode) {
    setMode(next);
    setError(null);
    setNotice(null);
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
          disabled={busy}
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
