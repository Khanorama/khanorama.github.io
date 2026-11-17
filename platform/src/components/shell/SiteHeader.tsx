"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { AccountLink } from "@/components/shell/AccountLink";

/**
 * Carried over from the original site, in its order: About, Courses,
 * Library, Support, with Compete added where it belongs among them. Most
 * of these are the organization rather than the course software, and a
 * visitor who has never heard of LeapCode needs them before a list of
 * courses means anything.
 *
 * Courses is the exception and has to be here. The original nav had the
 * tab; dropping it left the catalog reachable only by scrolling the home
 * page, so every other page in the site was a dead end for the one thing
 * a visitor came to find.
 */
const NAV = [
  { href: "/about/", label: "About" },
  { href: "/courses/", label: "Courses" },
  { href: "/compete/", label: "Compete" },
  { href: "/library/", label: "Library" },
  { href: "/support/", label: "Support" },
];

interface SiteHeaderProps {
  /** Course context shown beside the wordmark, e.g. while inside a lesson. */
  courseTitle?: string;
  courseHref?: string;
}

/**
 * The application frame.
 *
 * Navy in both themes. The header is the one piece of structural color that
 * never moves, which gives the product a fixed edge to sit against and stops
 * a long white reading column from feeling like an untitled document.
 */
export function SiteHeader({ courseTitle, courseHref }: SiteHeaderProps) {
  const scrolled = useScrolled();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();

  const isCurrent = (href: string) =>
    pathname.replace(/\/+$/, "") === href.replace(/\/+$/, "");

  // Escape closes it, which is the one keyboard affordance a disclosure
  // like this is always expected to have and never gets for free.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header
      className={[
        "sticky top-0 z-40 border-b bg-navy transition-[box-shadow,border-color] duration-[var(--dur-slow)] ease-soft",
        scrolled ? "border-transparent shadow-header" : "border-navy-line",
      ].join(" ")}
    >
      <div
        className={[
          "mx-auto flex max-w-5xl items-center gap-3 px-6",
          // Loses eight pixels of height on the way down. Small enough to
          // go unnoticed as an event, large enough that the reading column
          // gets the room back on a long lesson page.
          "transition-[height] duration-[var(--dur-slow)] ease-snap",
          scrolled ? "h-12" : "h-14",
        ].join(" ")}
      >
        <Link
          href="/"
          className="font-brand text-lg font-black tracking-tight whitespace-nowrap"
        >
          <span className="text-brand-blue-bright">LEAP</span>
          <span className="text-brand-green-bright">CODE</span>
        </Link>

        {courseTitle && (
          <>
            <span aria-hidden="true" className="text-navy-line">
              /
            </span>
            {courseHref ? (
              <Link
                href={courseHref}
                className="truncate font-sans text-sm text-on-navy-muted transition-colors hover:text-on-navy"
              >
                {courseTitle}
              </Link>
            ) : (
              <span className="truncate font-sans text-sm text-on-navy-muted">
                {courseTitle}
              </span>
            )}
          </>
        )}

        <nav className="ml-auto hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isCurrent(item.href) ? "page" : undefined}
              className="nav-link rounded-control px-2.5 py-1.5 font-sans text-sm font-medium text-on-navy transition-colors duration-[var(--dur-base)] ease-soft hover:bg-navy-raised"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-3">
          <AccountLink />
          <ThemeToggle />
          <MenuButton
            open={menuOpen}
            controls={menuId}
            onToggle={() => setMenuOpen((v) => !v)}
          />
        </div>
      </div>

      {/*
        The small-screen menu, holding the same five links as the bar.

        It used to take over below sm, which stopped fitting once Courses
        made a fifth item: between 640px and roughly 760px the row ran out
        of width and the account control folded onto a second line, making
        the header visibly taller than it is anywhere else. The inline nav
        now waits for md and this takes everything narrower, which is the
        honest answer to five items plus a wordmark, an account and a
        theme toggle.

        It is absolutely positioned rather than part of the header's flow so
        opening it overlays the page instead of shoving it down, and it
        keeps pointer events off while closed so an invisible panel can
        never swallow a tap meant for the content underneath.
      */}
      <div
        id={menuId}
        className={[
          "absolute inset-x-0 top-full origin-top border-b border-navy-line bg-navy shadow-header md:hidden",
          "transition-[opacity,transform] duration-[var(--dur-base)] ease-snap",
          menuOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0",
        ].join(" ")}
      >
        <nav className="flex flex-col px-4 py-2">
          {NAV.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              tabIndex={menuOpen ? undefined : -1}
              aria-current={isCurrent(item.href) ? "page" : undefined}
              className={[
                "rounded-control px-2 py-3 font-sans text-sm font-medium transition-colors duration-[var(--dur-base)] ease-soft hover:bg-navy-raised",
                isCurrent(item.href)
                  ? "text-brand-green-bright"
                  : "text-on-navy",
              ].join(" ")}
              style={
                menuOpen
                  ? { animation: `settle var(--dur-base) var(--ease-snap) ${index * 45}ms backwards` }
                  : undefined
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

/**
 * The small-screen menu trigger.
 *
 * The two bars rotate into a cross rather than being swapped for an X
 * glyph, so the control visibly becomes the thing that closes it. The
 * middle bar is absent by design: three bars cannot fold into a clean
 * cross without one of them fading, and a fade competing with two
 * rotations reads as sloppier than two bars doing it exactly.
 */
function MenuButton({
  open,
  controls,
  onToggle,
}: {
  open: boolean;
  controls: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls={controls}
      aria-label={open ? "Close menu" : "Open menu"}
      className="press inline-flex h-8 w-8 items-center justify-center rounded-control text-on-navy-muted hover:bg-navy-raised hover:text-on-navy md:hidden"
    >
      <span className="relative block h-3 w-4" aria-hidden="true">
        <span
          className={[
            "absolute left-0 block h-0.5 w-4 rounded-full bg-current",
            "transition-transform duration-[var(--dur-base)] ease-snap",
            open ? "top-1.5 rotate-45" : "top-0",
          ].join(" ")}
        />
        <span
          className={[
            "absolute left-0 block h-0.5 w-4 rounded-full bg-current",
            "transition-transform duration-[var(--dur-base)] ease-snap",
            open ? "top-1.5 -rotate-45" : "top-3",
          ].join(" ")}
        />
      </span>
    </button>
  );
}

/**
 * Whether the page has moved away from the top.
 *
 * The listener is passive, so it can never delay a scroll, and the state is
 * only ever set when the answer actually flips. A scroll handler that calls
 * setState on every frame would re-render the header sixty times a second
 * to arrive at the same markup, which is how a cheap effect turns into a
 * janky one.
 */
function useScrolled(threshold = 8): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const read = () => setScrolled(window.scrollY > threshold);
    read();
    window.addEventListener("scroll", read, { passive: true });
    return () => window.removeEventListener("scroll", read);
  }, [threshold]);

  return scrolled;
}
