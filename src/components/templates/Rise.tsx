"use client";

import { m } from "framer-motion";
import type { ReactNode } from "react";

/**
 * The motion the newer architectures were missing.
 *
 * `scroll` feels alive because every block it composes — the hero, the ticket,
 * the gallery — animates itself. The architectures built after it render markup
 * inline and so had no motion at all, which is most of why they read as flat
 * beside it.
 *
 * One primitive, used per block rather than per element: content rises into
 * place once, on first sight, and then stays put. `once` matters — a page that
 * re-animates whenever a section re-enters the viewport reads as decorated
 * rather than designed.
 */
export function Rise({
  children,
  delay = 0,
  y = 18,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </m.div>
  );
}

/**
 * A name written on, rather than set in.
 *
 * Draws the couple's names as a stroke that completes itself — the closest a
 * web page gets to a hand moving across a card. Used only for names, because
 * script at any longer length stops being elegant and starts being unreadable.
 */
export function Signature({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <m.span
      className={`font-script ${className}`}
      initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </m.span>
  );
}
