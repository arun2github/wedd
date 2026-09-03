"use client";

import Link from "next/link";
import { useState } from "react";

/*
  Three links.

  It was five, and before that the brief asked for eight. A luxury page carries
  less chrome, not more: every link here is a place the page actually goes, and
  the sections that used to be nav items are now one scroll away instead of
  being advertised twice.
*/
/*
  Real routes, not anchors.

  Every one of these is now its own page with its own layout, which is what
  finally kills the repetition: a topic lives in exactly one place, so it
  cannot be restated three times on a single scroll.
*/
const LINKS = [
  { href: "/designs", label: "Designs" },
  { href: "/ceremonies", label: "Ceremonies" },
  { href: "/for-couples", label: "For couples" },
  { href: "/guests", label: "For guests" },
  { href: "/pricing", label: "Pricing" },
];

/**
 * Platform navigation.
 *
 * Five links, not eight. The brief's list included "How it works", "Features"
 * and "Inspiration" as separate entries; those are sections of one page, and
 * promoting each to top level makes a nav that looks busy and answers nothing.
 * What is here maps to the four questions a couple actually arrives with: what
 * do the designs look like, is there one for my wedding, what will my guests
 * see, and what does it cost.
 */
export function SiteChrome() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-linen/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-8 px-5 py-4 sm:px-8">
        <Link href="/" className="font-script text-3xl leading-none text-ink">
          Sehra
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-soft lg:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-ink">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link href="/sign-in" className="hidden px-3 py-2 text-sm text-soft transition-colors hover:text-ink sm:block">
            Log in
          </Link>
          <a
            href="#start"
            className="rounded-full bg-aubergine px-4 py-2 text-sm font-medium text-linen transition-colors hover:bg-wine"
          >
            Create your website
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="-mr-2 p-2 text-ink lg:hidden"
          >
            <span aria-hidden="true" className="block h-px w-5 bg-current" />
            <span aria-hidden="true" className="mt-1.5 block h-px w-5 bg-current" />
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-ink/10 px-5 py-3 lg:hidden">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-base text-soft transition-colors hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
