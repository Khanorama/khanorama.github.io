import type { Metadata } from "next";
import { SiteHeader } from "@/components/shell/SiteHeader";
import { AccountPanel } from "@/components/auth/AccountPanel";

export const metadata: Metadata = {
  title: "Account",
};

export default function AccountPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-6 pt-12 pb-16">
        <AccountPanel />
      </main>
    </>
  );
}
