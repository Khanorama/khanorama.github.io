"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useProgress } from "@/lib/progress/useProgress";
import { isEnrolled } from "@/lib/progress/localProgress";

interface CourseGateProps {
  courseId: string;
  courseSlug: string;
  courseTitle: string;
  children: ReactNode;
}

/**
 * Keeps course material behind an account and an enrollment.
 *
 * This is a product gate, not a security boundary, and the distinction
 * matters. The site is a static export, so every lesson, solution and
 * expected answer is already inside the JavaScript bundle and anyone
 * determined can read it. What this does is make taking a course mean
 * something: you have somewhere for progress to live, and the course knows
 * you started it. Treating it as protection for the content would be
 * self-deception.
 */
export function CourseGate({
  courseId,
  courseSlug,
  courseTitle,
  children,
}: CourseGateProps) {
  const { status } = useAuth();
  const progress = useProgress();

  if (status === "loading") {
    return (
      <Panel>
        <p className="font-sans text-sm text-ink-faint">Checking your account.</p>
      </Panel>
    );
  }

  /*
    No Firebase configured. Rather than lock everyone out of a course that
    works perfectly well, fall through: the gate exists to anchor progress to
    an account, and with no accounts to anchor to it has nothing to enforce.
  */
  if (status === "unavailable") return <>{children}</>;

  if (status === "signedOut") {
    return (
      <Panel>
        <h2 className="font-sans text-lg font-semibold text-ink">
          Sign in to take this course
        </h2>
        <p className="font-reading text-reading mt-2 text-ink-muted">
          {courseTitle} is free, but it needs an account so your progress and
          the code you write are saved and follow you between devices.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/account/"
            className="inline-flex items-center rounded-control bg-accent px-5 py-2.5 font-sans text-sm font-semibold text-ink-inverse transition-colors hover:bg-accent-hover"
          >
            Sign in or create an account
          </Link>
          <Link
            href={`/courses/${courseSlug}/`}
            className="inline-flex items-center rounded-control border border-line-strong bg-paper px-5 py-2.5 font-sans text-sm font-semibold text-ink transition-colors hover:bg-surface-raised"
          >
            Back to the course
          </Link>
        </div>
      </Panel>
    );
  }

  if (!isEnrolled(progress, courseId)) {
    return (
      <Panel>
        <h2 className="font-sans text-lg font-semibold text-ink">
          You have not enrolled yet
        </h2>
        <p className="font-reading text-reading mt-2 text-ink-muted">
          Enroll in {courseTitle} from its overview page and this opens up.
        </p>
        <Link
          href={`/courses/${courseSlug}/`}
          className="mt-5 inline-flex items-center rounded-control bg-accent px-5 py-2.5 font-sans text-sm font-semibold text-ink-inverse transition-colors hover:bg-accent-hover"
        >
          Go to {courseTitle}
        </Link>
      </Panel>
    );
  }

  return <>{children}</>;
}

function Panel({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="rounded-card border border-line bg-surface px-6 py-7 shadow-card">
        {children}
      </div>
    </div>
  );
}
