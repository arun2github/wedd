"use client";

import { useState } from "react";
import { m, useScroll, useSpring, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIntro } from "@/components/providers/IntroProvider";
import { LenisScrollLock } from "@/components/ui/LenisScrollLock";
import { easeLux } from "@/lib/motion";
import { REVEAL } from "@/lib/intro-timeline";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#story", label: "Our Story" },
  { href: "#events", label: "Events" },
  { href: "#gallery", label: "Gallery" },
  { href: "#venue", label: "Venue" },
  { href: "#rsvp", label: "RSVP" },
];

interface NavbarProps {
  brideName: string;
  groomName: string;
}

export function Navbar({ brideName, groomName }: NavbarProps) {
  const prefersReducedMotion = useReducedMotion();
  const { revealed } = useIntro();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Replaces a manual `scroll` listener: framer already tracks this, and the
  // progress hairline needs the motion value anyway.
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.2 });

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 24);
  });

  return (
    <m.header
      // Always in the DOM (SSR keeps the names crawlable); it just waits above
      // the fold until the invitation has been opened.
      initial={{ y: "-100%" }}
      animate={{ y: revealed ? "0%" : "-100%" }}
      transition={
        prefersReducedMotion
          ? { duration: 0.2 }
          : { delay: revealed ? REVEAL.navbar : 0, duration: 0.7, ease: easeLux }
      }
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-colors duration-300",
        scrolled
          ? "bg-surface/90 backdrop-blur-sm shadow-[0_1px_0_0_var(--color-border)]"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a
          href="#home"
          className="font-display text-lg font-medium text-brand transition-colors hover:text-brand-deep focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gilt"
        >
          {brideName} <span className="font-script text-xl text-gilt">&amp;</span> {groomName}
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="group relative text-sm font-medium text-ink transition-colors hover:text-brand focus-visible:text-brand focus-visible:outline-none"
              >
                {link.label}
                {/* Gold underline wipes out from the centre. CSS, not a spring:
                    six of these on screen and it's pure decoration. */}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-center scale-x-0 bg-gilt transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>

        <Sheet open={open} onOpenChange={setOpen}>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-11 w-11 text-brand"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
          <SheetContent side="right" className="bg-surface">
            {/* Radix locks the body, but Lenis doesn't watch that. */}
            <LenisScrollLock active={open} />
            <SheetHeader>
              <SheetTitle className="font-display text-brand">
                {brideName} &amp; {groomName}
              </SheetTitle>
            </SheetHeader>
            <ul className="flex flex-col gap-1 px-4 pb-4">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <SheetClose asChild>
                    <a
                      href={link.href}
                      className="flex min-h-11 items-center text-base font-medium text-ink transition-colors hover:text-brand"
                    >
                      {link.label}
                    </a>
                  </SheetClose>
                </li>
              ))}
            </ul>
          </SheetContent>
        </Sheet>
      </nav>

      {/* Reading-progress hairline */}
      <m.div
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-gilt/0 via-gilt to-gilt/0"
        style={{ scaleX: progress }}
        aria-hidden="true"
      />
    </m.header>
  );
}
