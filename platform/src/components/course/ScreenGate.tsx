"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/** Kept in step with the lesson-room variant in globals.css. */
const ROOM = "(min-width: 768px) and (min-height: 500px)";

/**
 * Keeps lessons off phones.
 *
 * A lesson is instructions, a code editor and a program's output read
 * together. On a phone the editor wraps Python mid-expression and the
 * output sits a screen and a half below the code that produced it, which
 * is not a worse version of the lesson so much as a different and much
 * harder one. Saying so plainly is better than letting a student conclude
 * they cannot code.
 *
 * The gate is drawn twice, and both are needed:
 *
 *   CSS   hides the lesson before any script runs, so a phone never sees a
 *         flash of a lesson it is about to lose. A static export serves the
 *         same HTML to every device, so without this the lesson is in the
 *         first paint on every one of them.
 *
 *   JS    stops rendering the lesson at all once it knows the viewport is
 *         too small. CSS alone would leave the editor mounted inside a
 *         display:none subtree, where CodeMirror measures itself at zero
 *         width and then stays wrong if the window is later resized to fit.
 *
 * Listening for changes rather than reading once is what makes a desktop
 * window dragged narrow, or a tablet turned over, behave sensibly instead
 * of needing a reload.
 */
export function ScreenGate({
  courseTitle,
  outlineHref,
  children,
}: {
  courseTitle: string;
  outlineHref: string;
  children: React.ReactNode;
}) {
  // null until measured. The CSS has it covered in the meantime.
  const [roomy, setRoomy] = useState<boolean | null>(null);

  useEffect(() => {
    const query = window.matchMedia(ROOM);
    const read = () => setRoomy(query.matches);
    read();
    query.addEventListener("change", read);
    return () => query.removeEventListener("change", read);
  }, []);

  return (
    <>
      {roomy !== false && <div className="lesson-cramped:hidden">{children}</div>}

      <div className="lesson-room:hidden">
        <div className="mx-auto max-w-md px-6 py-16 text-center">
          <SmallScreenMark />

          <h1 className="mt-6 text-2xl font-semibold tracking-tight text-ink">
            This one needs a bigger screen
          </h1>

          <p className="font-reading mt-3 text-reading text-ink-muted">
            Lessons put the explanation, a code editor and your program&rsquo;s
            output together on one page. That needs more room than a phone
            has, and squeezing it in would make the code harder to read than
            the lesson is to follow.
          </p>

          <p className="mt-4 font-sans text-sm text-ink-muted">
            Open this on a tablet, laptop or desktop and it will be exactly
            where you left it. Your progress is saved to your account, not to
            the device.
          </p>

          <div className="mt-8">
            <Link
              href={outlineHref}
              className="press inline-flex items-center rounded-control border border-line-strong bg-paper px-5 py-2.5 font-sans text-sm font-semibold text-ink hover:-translate-y-0.5 hover:border-accent-line hover:bg-surface-raised"
            >
              Back to {courseTitle}
            </Link>
          </div>

          <p className="mt-8 border-t border-line pt-5 font-sans text-xs text-ink-faint">
            The rest of the site works here. You can browse courses, read what
            each one covers and check how far through you are.
          </p>
        </div>
      </div>
    </>
  );
}

/**
 * A phone with the lesson layout refusing to fit inside it. Says what the
 * problem is in one glance, which a warning triangle would not.
 */
function SmallScreenMark() {
  return (
    <svg
      viewBox="0 0 64 44"
      width="72"
      height="50"
      aria-hidden="true"
      className="mx-auto"
      fill="none"
    >
      {/* The room a lesson wants */}
      <rect
        x="1"
        y="1"
        width="62"
        height="42"
        rx="4"
        stroke="var(--color-line-strong)"
        strokeWidth="1.5"
        strokeDasharray="4 3"
      />
      {/* The phone it is being asked to fit into */}
      <rect
        x="24"
        y="7"
        width="16"
        height="30"
        rx="3"
        fill="var(--color-surface)"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
      />
      <path
        d="M28 15h8M28 20h8M28 25h5"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}
