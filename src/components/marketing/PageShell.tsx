import { BRAND, BRAND_DOMAIN } from "@/lib/brand";
import Link from "next/link";
import type { ReactNode } from "react";
import { SiteChrome } from "./SiteChrome";

/**
 * Chrome, once.
 *
 * Six routes now share a header and a footer. Written once here rather than
 * pasted into each page — a nav that drifts between pages is the fastest way
 * to make a site feel stitched together rather than made.
 */
export function PageShell({
  children,
  /** The ground this page opens on, so the header sits on the right colour. */
  tone = "linen",
}: {
  children: ReactNode;
  tone?: "linen" | "aubergine";
}) {
  const dark = tone === "aubergine";
  return (
    <div
      className={`flex min-h-dvh flex-1 flex-col font-sans [--body-face:var(--font-jost)] [--display-face:var(--font-cormorant)] ${
        dark ? "bg-aubergine text-linen" : "bg-linen text-ink"
      }`}
    >
      <SiteChrome />
      <main className="flex-1">{children}</main>

      {/*
        The footer is peach on every page, whatever ground the page opened on.

        It is the one band that is the same everywhere, so giving it a colour
        of its own is what makes it read as the site signing off rather than as
        the page running out. On a linen page that is a warm step down; on an
        aubergine one it is a hard, deliberate cut.

        Nothing here branches on `tone` any more. It used to, and the dark
        branch set the column headings in gold — 1.9:1 on this ground, which is
        no heading at all. They are wine now, at 10.7:1.
      */}
      <footer className="bg-peach text-ink">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-mark text-3xl leading-none text-wine">{BRAND}</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-soft">
              Wedding websites, designed — and built to hold every day of an
              Indian wedding.
            </p>
          </div>
          {[
            { h: "Explore", links: [["Designs", "/designs"], ["Ceremonies", "/ceremonies"], ["For couples", "/for-couples"], ["For guests", "/guests"]] },
            { h: "Get started", links: [["How it works", "/how-it-works"], ["Pricing", "/pricing"], ["Sign in", "/sign-in"]] },
          ].map((col) => (
            <nav key={col.h}>
              <p className="text-[0.62rem] uppercase tracking-[0.26em] text-wine">
                {col.h}
              </p>
              <ul className="mt-4 flex flex-col gap-2.5 text-sm">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-soft transition-colors hover:text-ink"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="border-t border-peach-deep px-5 py-6 text-center text-xs text-soft sm:px-8">
          © {new Date().getFullYear()} {BRAND_DOMAIN}
        </div>
      </footer>
    </div>
  );
}
