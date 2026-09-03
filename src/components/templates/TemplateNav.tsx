"use client";

import { useState } from "react";
import { m, useMotionValueEvent, useScroll, useSpring } from "framer-motion";

/**
 * The header every architecture shares.
 *
 * Six of the seven had no navigation at all, which is a guest problem before it
 * is a design one: someone opening the link to check the venue had to scroll
 * the whole invitation to find it.
 *
 * Deliberately *not* the `scroll` archetype's `Navbar`. That one is wired to
 * the curtain and the envelope film — it waits for `revealed` before appearing
 * — and the other six have no intro to wait for. This is the same job with none
 * of that dependency.
 *
 * It carries no colour of its own: every value is a palette token, so the bar
 * is plum on Midnight Velvet and linen on Earthy Haven without a line of
 * per-theme code.
 */
export function TemplateNav({
  brideName,
  groomName,
  links,
}: {
  brideName: string;
  groomName: string;
  /** Only the sections this architecture actually renders — a nav that links
   *  to an anchor the page does not have is worse than no nav. */
  links: { href: string; label: string }[];
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.2 });

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-500 ${
        scrolled ? "bg-[color-mix(in_oklab,var(--surface)_92%,transparent)] backdrop-blur" : ""
      }`}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center gap-6 px-5 py-3.5 sm:px-8">
        <a href="#top" className="font-script text-2xl leading-none text-brand">
          {brideName} &amp; {groomName}
        </a>

        <nav className="ml-auto hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[0.62rem] uppercase tracking-[0.24em] text-ink-soft transition-colors hover:text-brand"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="ml-auto p-2 text-ink md:hidden"
        >
          <span aria-hidden="true" className="block h-px w-5 bg-current" />
          <span aria-hidden="true" className="mt-1.5 block h-px w-5 bg-current" />
        </button>
      </div>

      {/* How far through the invitation you are. The only ornament on the bar,
          and it says something true. */}
      <m.div
        aria-hidden="true"
        className="h-px origin-left bg-gilt"
        style={{ scaleX: progress }}
      />

      {open && (
        <nav className="border-t border-gilt/25 bg-surface px-5 py-2 md:hidden">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-[0.68rem] uppercase tracking-[0.22em] text-ink-soft"
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
