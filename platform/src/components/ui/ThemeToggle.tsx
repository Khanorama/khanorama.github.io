"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "leapcode-theme";

function SunIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4">
      <circle cx="10" cy="10" r="3.6" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M10 1.8v2.1M10 16.1v2.1M18.2 10h-2.1M3.9 10H1.8" />
        <path d="M15.8 4.2l-1.5 1.5M5.7 14.3l-1.5 1.5M15.8 15.8l-1.5-1.5M5.7 5.7L4.2 4.2" />
      </g>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4">
      <path
        d="M17 12.3A7.5 7.5 0 0 1 7.7 3a7.5 7.5 0 1 0 9.3 9.3z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Light and dark toggle.
 *
 * Defaults to the reader's system preference rather than forcing one, and
 * remembers an explicit choice. The initial class is applied by an inline
 * script in the document head, before first paint, so there is no flash of
 * the wrong theme. This component only reports and changes it.
 */
export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  // Until mounted we cannot know the real theme, and rendering the wrong icon
  // then correcting it is its own flash.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    setMounted(true);
  }, []);

  function toggle() {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {
      // Private browsing; the choice simply will not persist.
    }
    setIsDark(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="press inline-flex h-8 w-8 items-center justify-center rounded-control text-on-navy-muted hover:bg-navy-raised hover:text-on-navy"
    >
      {/*
        Keyed on the theme so React replaces the element rather than
        swapping its contents, which restarts the animation. Without the
        key the icon would change shape with no acknowledgment that
        anything happened.
      */}
      {mounted ? (
        <span key={isDark ? "sun" : "moon"} className="animate-pop inline-flex">
          {isDark ? <SunIcon /> : <MoonIcon />}
        </span>
      ) : (
        <span className="h-4 w-4" />
      )}
    </button>
  );
}
