"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth/AuthProvider";
import { SUPPORT_EMAIL } from "@/content/site";

/**
 * Deleting your account, for real.
 *
 * The privacy policy promises deletion, and until now that promise was
 * kept by a person reading an inbox. This is the same promise kept by the
 * student directly.
 *
 * THE CONFIRMATION IS A TYPED EMAIL ADDRESS, not a second button. The
 * action is irreversible and removes work someone may have spent weeks
 * on, and "are you sure?" is a dialog people dismiss by reflex. Typing
 * the address requires reading the sentence it appears in.
 *
 * Failure is reported rather than swallowed, and specifically: the two
 * things that actually go wrong here have different fixes, and a single
 * "something went wrong" would leave a student unable to act on either.
 */
function explain(error: unknown): string {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code: unknown }).code)
      : "";

  // Firebase refuses to delete an account on a stale session. There is no
  // way around it and nothing is broken, so say what to do.
  if (code === "auth/requires-recent-login") {
    return "For security, this needs a recent sign-in. Sign out, sign back in, and come straight here.";
  }

  // The rules on the progress document have not been published, or were
  // changed. Nothing was deleted, which is the safe failure.
  if (code === "permission-denied" || code.endsWith("/permission-denied")) {
    return `We could not remove your saved progress, so nothing has been deleted. Email ${SUPPORT_EMAIL} and we will do it by hand.`;
  }

  return `Something went wrong and nothing has been deleted. Email ${SUPPORT_EMAIL} and we will sort it out.`;
}

export function DeleteAccount({ onDeleted }: { onDeleted: () => void }) {
  const { user, deleteAccount } = useAuth();
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const email = user?.email ?? "";
  const confirmed = typed.trim().toLowerCase() === email.toLowerCase();

  async function run() {
    if (!confirmed || busy) return;
    setBusy(true);
    setError(null);
    try {
      await deleteAccount();
      onDeleted();
    } catch (err) {
      setError(explain(err));
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <div className="mt-8 border-t border-line pt-5">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="font-sans text-sm text-ink-faint underline-offset-4 transition-colors duration-[var(--dur-base)] ease-soft hover:text-danger hover:underline"
        >
          Delete your account
        </button>
      </div>
    );
  }

  return (
    <section className="mt-8 rounded-card border border-danger-line bg-danger-soft px-4 py-4">
      <h2 className="font-sans text-sm font-semibold text-ink">
        Delete your account
      </h2>

      <div className="mt-2 space-y-2 font-sans text-sm leading-relaxed text-ink">
        <p>
          This removes your sign-in, every lesson you have completed, and all
          the code you have written in exercises.
        </p>
        <p>
          <strong>It cannot be undone</strong>, and we cannot get any of it back
          for you afterwards.
        </p>
      </div>

      <label className="mt-4 block">
        <span className="block font-sans text-xs text-ink-muted">
          Type <span className="font-semibold text-ink">{email}</span> to
          confirm
        </span>
        <input
          value={typed}
          onChange={(event) => setTyped(event.target.value)}
          autoComplete="off"
          spellCheck={false}
          disabled={busy}
          aria-label={`Type ${email} to confirm deletion`}
          className="mt-1.5 w-full rounded-control border border-line-strong bg-paper px-3 py-2 font-sans text-sm text-ink"
        />
      </label>

      {error && (
        <p
          role="alert"
          className="mt-3 rounded-control border border-danger-line bg-paper px-3 py-2 font-sans text-sm text-ink"
        >
          {error}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button
          variant="primary"
          onClick={run}
          disabled={!confirmed || busy}
          className="bg-danger hover:bg-danger"
        >
          {busy ? "Deleting" : "Delete it permanently"}
        </Button>
        <Button
          variant="quiet"
          onClick={() => {
            setOpen(false);
            setTyped("");
            setError(null);
          }}
          disabled={busy}
        >
          Keep my account
        </Button>
      </div>
    </section>
  );
}
