import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface SiteHeaderProps {
  /** Course context shown beside the wordmark, e.g. while inside a lesson. */
  courseTitle?: string;
  courseHref?: string;
}

/**
 * The application frame.
 *
 * Navy in both themes. The header is the one piece of structural colour that
 * never moves, which gives the product a fixed edge to sit against and stops
 * a long white reading column from feeling like an untitled document.
 */
export function SiteHeader({ courseTitle, courseHref }: SiteHeaderProps) {
  return (
    <header className="border-b border-navy-line bg-navy">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-6">
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

        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
