import Link from "next/link";
import {
  DISCORD_INVITE,
  ORG_DESCRIPTION,
  ORG_LEGAL_NAME,
  SUPPORT_EMAIL,
} from "@/content/site";

/**
 * The site footer.
 *
 * It exists because the legal pages have to be reachable from everywhere.
 * A privacy policy linked only from the sign-up form is not findable by
 * someone who already has an account and wants to know what is held about
 * them, and that is the person most entitled to find it.
 *
 * Rendered from the root layout rather than per page, so a page added
 * later cannot forget it.
 */
const GROUPS: { heading: string; links: { label: string; href: string }[] }[] =
  [
    {
      heading: "Learn",
      links: [
        { label: "Courses", href: "/#courses" },
        { label: "Compete", href: "/compete/" },
        { label: "Library", href: "/library/" },
      ],
    },
    {
      heading: "LeapCode",
      links: [
        { label: "About", href: "/about/" },
        { label: "Support us", href: "/support/" },
        { label: "Your account", href: "/account/" },
      ],
    },
    {
      heading: "Legal",
      links: [
        { label: "Privacy", href: "/privacy/" },
        { label: "Terms", href: "/terms/" },
        { label: "Cookies and storage", href: "/cookies/" },
      ],
    },
  ];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <p className="font-brand text-lg font-black tracking-tight">
              <span className="text-brand-blue">LEAP</span>
              <span className="text-brand-green">CODE</span>
            </p>
            <p className="mt-3 max-w-xs font-sans text-sm leading-relaxed text-ink-muted">
              Free coding courses, competitions and resources, run by students.
            </p>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="mt-3 inline-block font-sans text-sm text-accent transition-colors duration-[var(--dur-base)] ease-soft hover:text-accent-hover"
            >
              {SUPPORT_EMAIL}
            </a>
          </div>

          {GROUPS.map((group) => (
            <nav key={group.heading} aria-label={group.heading}>
              <h2 className="font-sans text-xs font-semibold tracking-wide uppercase text-ink-faint">
                {group.heading}
              </h2>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-sans text-sm text-ink-muted transition-colors duration-[var(--dur-base)] ease-soft hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
          <p className="font-sans text-xs leading-relaxed text-ink-faint">
            {ORG_LEGAL_NAME} is {ORG_DESCRIPTION}. Everything here is free.
          </p>
          <a
            href={DISCORD_INVITE}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-xs text-ink-faint transition-colors duration-[var(--dur-base)] ease-soft hover:text-accent"
          >
            Discord
          </a>
        </div>
      </div>
    </footer>
  );
}
