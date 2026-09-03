"use client";

import { m } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Scroll reveal, used once per block rather than on every element.
 *
 * `whileInView` with `once` so a section animates the first time it is reached
 * and then stays put — content that re-animates every time it re-enters the
 * viewport is the single clearest tell of a page decorated with motion rather
 * than designed with it.
 *
 * `m` rather than `motion`: the feature bundle is already loaded lazily by
 * `MotionProvider`, and `strict` mode makes `motion.*` throw to keep it that way.
 */
export function Reveal({
  children,
  delay = 0,
  y = 22,
  className,
}: {
  children: ReactNode;
  delay?: number;
  /** Distance travelled. Small by default — a long slide reads as a slideshow. */
  y?: number;
  className?: string;
}) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </m.div>
  );
}
