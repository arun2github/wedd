"use client";

import { useRef } from "react";
import { m } from "framer-motion";
import { useCountdown } from "@/lib/countdown";
import { fadeUp, staggerContainer, revealViewport } from "@/lib/motion";
import { useParallax } from "@/lib/motion-hooks";

interface CountdownProps {
  weddingDate: string;
}

const UNITS: { key: "days" | "hours" | "minutes" | "seconds"; label: string }[] = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" },
];

export function Countdown({ weddingDate }: CountdownProps) {
  const parts = useCountdown(weddingDate);
  const sectionRef = useRef<HTMLElement>(null);
  const ornamentY = useParallax(sectionRef, 30);

  return (
    <section
      ref={sectionRef}
      id="countdown"
      className="relative overflow-hidden bg-ivory-dark py-20 sm:py-24"
    >
      {/* Decorative gold bloom behind the tiles. Over-sized so the drift never
          clips into a hard edge at the section boundary. */}
      <m.div
        style={{ y: ornamentY }}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -inset-y-[12%] bg-[radial-gradient(ellipse_45%_40%_at_50%_50%,rgba(176,141,87,0.16),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
        <m.p
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          variants={fadeUp}
          className="text-center font-display text-xl text-wine sm:text-2xl"
        >
          {parts.isPast ? "Forever begins" : "Counting down to forever"}
        </m.p>

        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          variants={staggerContainer(0.08)}
          className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6"
        >
          {UNITS.map((unit) => (
            <m.div
              key={unit.key}
              variants={fadeUp}
              className="flex flex-col items-center gap-2 rounded-2xl border border-gold/30 bg-ivory px-4 py-8 shadow-sm"
            >
              <span className="font-display text-4xl tabular-nums text-wine sm:text-5xl">
                {String(parts[unit.key]).padStart(2, "0")}
              </span>
              <span className="text-xs font-medium uppercase tracking-[0.25em] text-charcoal-muted">
                {unit.label}
              </span>
            </m.div>
          ))}
        </m.div>
      </div>
    </section>
  );
}
