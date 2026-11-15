import type { Metadata } from "next";
import { SiteHeader } from "@/components/shell/SiteHeader";
import { Roster } from "@/components/admin/Roster";

/**
 * The roster, for organizers.
 *
 * Unlisted rather than secret. The page exists in a static export like every
 * other page and anyone can load it, which is why nothing here decides who
 * may see the data: the security rules refuse the underlying read to every
 * account that is not in /admins, whatever this page renders. Visiting
 * without that row shows a page with nothing on it.
 *
 * noindex keeps it out of search results. That is tidiness, not a control.
 */
export const metadata: Metadata = {
  title: "Roster",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <>
      <SiteHeader />
      <main
        id="main"
        tabIndex={-1}
        className="mx-auto max-w-3xl px-6 pt-12 pb-16"
      >
        <Roster />
      </main>
    </>
  );
}
