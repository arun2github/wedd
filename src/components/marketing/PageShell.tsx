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

      <footer className={dark ? "border-t border-linen/12" : "border-t border-ink/10"}>
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-script text-3xl leading-none">Sehra</p>
            <p className={`mt-3 max-w-xs text-sm leading-relaxed ${dark ? "text-linen/65" : "text-soft"}`}>
              Wedding websites, designed — and built to hold every day of an
              Indian wedding.
            </p>
          </div>
          {[
            { h: "Explore", links: [["Designs", "/designs"], ["Ceremonies", "/ceremonies"], ["For couples", "/for-couples"], ["For guests", "/guests"]] },
            { h: "Get started", links: [["How it works", "/how-it-works"], ["Pricing", "/pricing"], ["Sign in", "/sign-in"]] },
          ].map((col) => (
            <nav key={col.h}>
              <p className={`text-[0.62rem] uppercase tracking-[0.26em] ${dark ? "text-gold" : "text-soft"}`}>
                {col.h}
              </p>
              <ul className="mt-4 flex flex-col gap-2.5 text-sm">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className={`transition-colors ${dark ? "text-linen/70 hover:text-linen" : "text-soft hover:text-ink"}`}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className={`px-5 py-6 text-center text-xs sm:px-8 ${dark ? "text-linen/50" : "text-soft"}`}>
          © {new Date().getFullYear()} Sehra
        </div>
      </footer>
    </div>
  );
}
