"use client";

import { useState } from "react";
import { m, useMotionValueEvent, useScroll, useSpring } from "framer-motion";

/**
 * Navigation variants.
 *
 * One sticky bar had been added to five architectures, which fixed a real
 * guest problem and created a sameness problem in the same move. These are
 * three different pieces of chrome doing the same job.
 */
export interface NavProps {
  brideName: string;
  groomName: string;
  links: { href: string; label: string }[];
}

function useScrolled() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));
  return { scrolled, progress: useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.2 }) };
}

/** `centred` — monogram over the links, stacked and symmetrical. */
export function NavCentred({ brideName, groomName, links }: NavProps) {
  const { scrolled, progress } = useScrolled();
  return (
    <header className={`sticky top-0 z-50 transition-colors duration-500 ${scrolled ? "bg-[color-mix(in_oklab,var(--surface)_93%,transparent)] backdrop-blur" : ""}`}>
      <div className="flex flex-col items-center gap-2 py-4">
        <a href="#top" className="font-script text-2xl leading-none text-brand">
          {brideName} &amp; {groomName}
        </a>
        <nav className="hidden gap-6 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-[0.58rem] uppercase tracking-[0.26em] text-ink-soft transition-colors hover:text-brand">
              {l.label}
            </a>
          ))}
        </nav>
      </div>
      <m.div aria-hidden="true" className="h-px origin-left bg-gilt" style={{ scaleX: progress }} />
    </header>
  );
}

/** `overlay` — invisible over the hero, solid once you have left it. */
export function NavOverlay({ brideName, groomName, links }: NavProps) {
  const { scrolled } = useScrolled();
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-[color-mix(in_oklab,var(--surface)_94%,transparent)] py-3 backdrop-blur" : "py-6"
      }`}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6">
        <a href="#top" className={`font-script text-2xl leading-none transition-colors ${scrolled ? "text-brand" : "text-[var(--surface)] drop-shadow"}`}>
          {brideName} &amp; {groomName}
        </a>
        <nav className="hidden gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`text-[0.58rem] uppercase tracking-[0.26em] transition-colors ${
                scrolled ? "text-ink-soft hover:text-brand" : "text-[var(--surface)]/85 hover:text-[var(--surface)]"
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

/** `monogram` — initials only, in the corner. Links appear when asked for,
 *  which suits designs that do not want chrome across the photograph. */
export function NavMonogram({ brideName, groomName, links }: NavProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className="fixed left-5 top-5 z-50 flex size-12 items-center justify-center rounded-full border border-gilt/50 bg-[color-mix(in_oklab,var(--surface)_88%,transparent)] font-script text-xl leading-none text-brand backdrop-blur"
      >
        {brideName[0]}{groomName[0]}
      </button>

      {open && (
        <m.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-[color-mix(in_oklab,var(--surface)_97%,transparent)] backdrop-blur"
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-display text-3xl text-brand transition-opacity hover:opacity-60"
            >
              {l.label}
            </a>
          ))}
        </m.nav>
      )}
    </>
  );
}
