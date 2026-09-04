"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { GlowBorder } from "@/components/ui/glow-border";

/**
 * A pill with a light travelling round its rim.
 *
 * Built on the existing `GlowBorder` rather than a second implementation: a
 * conic gradient spinning behind a masked ring is exactly this effect, and
 * that component already parks its loop off-screen and stands still under
 * `prefers-reduced-motion`.
 *
 * Two rings, not one. The outer is wider, blurred and half-transparent — the
 * bloom a neon tube throws onto whatever it is mounted on; the inner is a
 * hairline and stays sharp. One ring alone reads as a coloured border; it is
 * the bloom that makes it read as something lit.
 *
 * `rounded={100}` puts the corner at half the shorter edge, which on a pill is
 * a true semicircle at any size — a percentage `border-radius` in CSS would
 * give an ellipse instead.
 *
 * Gold, not a neon green. The metal is the site's, and the head of the comet
 * is that same gold mixed toward white, because a neon needs a hot core to
 * read as lit rather than as painted.
 */

const HEAD = "color-mix(in srgb, var(--color-gold) 45%, white)";
const TAIL = "color-mix(in srgb, var(--color-gold) 75%, transparent)";
const REST = "color-mix(in srgb, var(--color-gold) 14%, transparent)";

export function NeonGlowButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group relative inline-flex items-center justify-center rounded-full bg-aubergine px-9 py-4 text-sm font-medium uppercase tracking-[0.18em] text-linen transition-colors hover:bg-[color-mix(in_srgb,var(--color-aubergine)_80%,black)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold ${className}`}
    >
      {/* The bloom. Blurred and set back, so it spills rather than outlines. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-0.5 opacity-70 blur-[7px] transition-opacity duration-500 group-hover:opacity-100"
      >
        <GlowBorder
          rounded={100}
          borderWidth={5}
          speed={9}
          hoverMultiplier={3}
          tailLength={46}
          glowColor={HEAD}
          tailColor={TAIL}
          baseColor="transparent"
        />
      </div>

      {/* The tube itself. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <GlowBorder
          rounded={100}
          borderWidth={1}
          speed={9}
          hoverMultiplier={3}
          tailLength={46}
          glowColor={HEAD}
          tailColor={TAIL}
          baseColor={REST}
        />
      </div>

      <span className="relative">{children}</span>
    </Link>
  );
}
