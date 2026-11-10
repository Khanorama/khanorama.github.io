"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useProgress } from "@/lib/progress/useProgress";
import { enrollInCourse, isEnrolled } from "@/lib/progress/localProgress";
import { courseLearnUrl } from "@/content/registry";

interface EnrollButtonProps {
  courseId: string;
  courseSlug: string;
}

const PRIMARY =
  "inline-flex items-center rounded-control bg-accent px-6 py-3 font-sans text-sm font-semibold text-ink-inverse shadow-card transition-all hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-card-hover";

/**
 * Enroll, or continue if already enrolled.
 *
 * Enrolling writes one record and moves straight into the course. There is
 * no confirmation step, because the course is free and leaving is just not
 * coming back; a dialog would only be ceremony.
 */
export function EnrollButton({ courseId, courseSlug }: EnrollButtonProps) {
  const { status } = useAuth();
  const progress = useProgress();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const learnUrl = courseLearnUrl(courseSlug);

  // No accounts configured: nothing to enroll into, so just let people in.
  if (status === "unavailable") {
    return (
      <Link href={learnUrl} className={PRIMARY}>
        Start the course
      </Link>
    );
  }

  if (status === "loading") {
    return (
      <span className={`${PRIMARY} pointer-events-none opacity-60`}>
        Loading
      </span>
    );
  }

  if (status === "signedOut") {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/account/" className={PRIMARY}>
          Sign in to enroll
        </Link>
        <span className="font-sans text-sm text-ink-muted">
          Free, and your progress is saved to your account.
        </span>
      </div>
    );
  }

  if (isEnrolled(progress, courseId)) {
    return (
      <Link href={learnUrl} className={PRIMARY}>
        Continue the course
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={PRIMARY}
      disabled={busy}
      onClick={() => {
        setBusy(true);
        enrollInCourse(courseId);
        router.push(learnUrl);
      }}
    >
      {busy ? "Enrolling" : "Enroll for free"}
    </button>
  );
}
