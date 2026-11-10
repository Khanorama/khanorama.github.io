"use client";

import { useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/Button";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useProgress, lessonCompletion } from "@/lib/progress/useProgress";
import {
  getServerSyncStatus,
  getSyncStatus,
  subscribeSyncStatus,
} from "@/lib/progress/syncStatus";
import { courses } from "@/content/registry";
import { isEnrolled } from "@/lib/progress/localProgress";
import { courseLessons, gradedBlocks } from "@/content/types";

/**
 * Progress on every course this account is enrolled in.
 *
 * This read the single hard-coded course it was written against, which was
 * correct while there was only one and silently wrong the moment there were
 * two: a student enrolled in both saw one of them and no indication the
 * other existed. Enrolment is already recorded per course, so the panel can
 * simply ask.
 */
function CourseProgress() {
  const progress = useProgress();

  const enrolled = courses
    .filter((course) => isEnrolled(progress, course.id))
    .map((course) => {
      const lessons = courseLessons(course);
      const done = lessons.filter(
        (lesson) =>
          lessonCompletion(
            {
              id: lesson.id,
              gradedBlockIds: gradedBlocks(lesson).map((block) => block.id),
              written: lesson.blocks.length > 0,
            },
            progress,
          ).status === "complete",
      ).length;
      return { course, done, total: lessons.length };
    });

  if (enrolled.length === 0) {
    return (
      <p className="font-sans text-sm text-ink-muted">
        Not enrolled in a course yet.
      </p>
    );
  }

  return (
    <ul className="space-y-1">
      {enrolled.map(({ course, done, total }) => (
        <li key={course.id} className="font-sans text-sm text-ink-muted">
          <span className="text-ink">{course.title}</span>:{" "}
          <span className="font-semibold text-ink tabular-nums">{done}</span> of{" "}
          {total} lessons complete
        </li>
      ))}
    </ul>
  );
}

/**
 * Says whether progress is genuinely reaching the account.
 *
 * Without this the panel asserted "saved to your account" unconditionally,
 * which would be false on a project whose rules were never published, and
 * invisible until a student lost work moving between devices.
 */
function SyncNote() {
  const status = useSyncExternalStore(
    subscribeSyncStatus,
    getSyncStatus,
    getServerSyncStatus,
  );

  if (status.state === "error") {
    return (
      <p className="mt-2 rounded-control border border-warning-line bg-warning-soft px-2.5 py-1.5 font-sans text-xs text-ink">
        {status.message}
      </p>
    );
  }

  if (status.state === "syncing" || status.state === "idle") {
    return (
      <p className="mt-1 font-sans text-xs text-ink-faint">
        Checking your saved progress.
      </p>
    );
  }

  return (
    <p className="mt-1 font-sans text-xs text-ink-faint">
      Saved to your account and available on any device you sign in on.
    </p>
  );
}

export function AccountPanel() {
  const { status, user, needsVerification, signOutNow, resendVerification } =
    useAuth();
  const [sent, setSent] = useState(false);

  if (status === "loading") {
    return (
      <p className="font-sans text-sm text-ink-faint">Checking your account.</p>
    );
  }

  /*
    Accounts are not configured on this deployment. Saying so plainly beats
    showing a sign-in form that cannot work, and the product is still fully
    usable without one.
  */
  if (status === "unavailable") {
    return (
      <div className="mx-auto w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-ink">Accounts</h1>
        <p className="mt-2 font-reading text-reading text-ink">
          Accounts are not switched on for this site yet. Everything in the
          course still works, and your progress is saved in this browser.
        </p>
        <div className="mt-5 rounded-card border border-line bg-surface px-4 py-3">
          <CourseProgress />
          <p className="mt-1 font-sans text-xs text-ink-faint">
            Saved on this device only. Clearing your browser data will clear it.
          </p>
        </div>
      </div>
    );
  }

  if (status === "signedOut" || !user) {
    return <AuthForm />;
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <h1 className="text-2xl font-semibold text-ink">Your account</h1>

      <dl className="mt-5 space-y-3 border-y border-line py-4">
        {user.displayName && (
          <div className="flex justify-between gap-4">
            <dt className="font-sans text-sm text-ink-muted">Name</dt>
            <dd className="font-sans text-sm text-ink">{user.displayName}</dd>
          </div>
        )}
        <div className="flex justify-between gap-4">
          <dt className="font-sans text-sm text-ink-muted">Email</dt>
          <dd className="truncate font-sans text-sm text-ink">{user.email}</dd>
        </div>
      </dl>

      <div className="mt-4 rounded-card border border-line bg-surface px-4 py-3">
        <CourseProgress />
        <SyncNote />
      </div>

      {needsVerification && (
        <div className="mt-4 rounded-card border border-warning-line bg-warning-soft px-4 py-3">
          <p className="font-sans text-sm text-ink">
            Your email address is not confirmed yet. You can keep using the
            course, but confirming it means you can recover your password.
          </p>
          {sent ? (
            <p className="mt-2 font-sans text-xs text-ink-muted">
              Sent. Check your inbox, and your spam folder.
            </p>
          ) : (
            <Button
              variant="secondary"
              className="mt-2"
              onClick={async () => {
                await resendVerification();
                setSent(true);
              }}
            >
              Resend confirmation email
            </Button>
          )}
        </div>
      )}

      <Button variant="secondary" className="mt-6" onClick={signOutNow}>
        Sign out
      </Button>
    </div>
  );
}
