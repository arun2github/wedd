import Link from "next/link";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { requireOperator } from "@/lib/dal";
import { SignOutButton } from "./SignOutButton";

export const metadata: Metadata = {
  title: { default: "Console", template: "%s · Console" },
  robots: { index: false, follow: false },
};

/**
 * The console shell.
 *
 * `requireOperator()` runs here, and again inside every DAL call the pages
 * make. That repetition is deliberate: a layout does not re-run for every
 * client-side navigation between its children, so a layout check alone would
 * be a boundary with gaps in it.
 */
export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const session = await requireOperator();

  return (
    /*
      The console gets its own palette rather than the default template's.
      Reusing the same role variables the templates use means the tool is built
      out of the system it manages — but a daily-driver admin should read as an
      instrument, not as a wedding invitation, so the ground is neutral and the
      warmth is spent only on the accent.
    */
    <div
      data-surface="console"
      className="flex min-h-dvh flex-1 flex-col bg-surface text-ink"
      style={{
        "--surface": "#fcfcfb", "--surface-sunk": "#f2f2f0",
        "--ink": "#1b1a19", "--ink-soft": "#61605d",
        "--brand": "#5c0e1d", "--brand-deep": "#3d0812",
        "--gilt": "#8a7a5e", "--gilt-soft": "#d8d6d0",
        "--rule": "#e2e1dd", "--raised": "#ffffff",
      } as CSSProperties}
    >
      <header className="sticky top-0 z-40 border-b border-rule bg-surface/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-5 py-3">
          <Link href="/admin" className="font-display text-lg tracking-tight">
            Console
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            <Link href="/admin" className="rounded px-2.5 py-1.5 text-ink-soft hover:bg-surface-sunk hover:text-ink">
              Sites
            </Link>
            <Link href="/templates" className="rounded px-2.5 py-1.5 text-ink-soft hover:bg-surface-sunk hover:text-ink">
              Templates
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-3 text-sm">
            <span className="hidden text-ink-soft sm:inline">{session.user.email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
