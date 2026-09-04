"use client";

import Image from "next/image";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { formatWeddingDate } from "@/lib/format-date";
import type { WeddingData } from "@/types/wedding";

/**
 * Hero variants.
 *
 * The first attempt at these changed the *container* — split, stacked,
 * monogram — and kept one type lockup inside all three: small-caps date on
 * top, bride name, script "and", groom name, centred paragraph. They looked
 * identical, because the lockup is what a visitor sees and the container is
 * not.
 *
 * So these differ where it shows: alignment, what the names do, whether there
 * is a connector at all, what the date is, and whether the hero carries prose.
 * No two are centred the same way and none share a connector.
 */

export interface HeroProps {
  data: WeddingData;
}

/**
 * `split` — everything flush left, names on one line, the date turned on its
 * side against the edge. Asymmetric and typeset, not a poster.
 */
export function HeroSplit({ data }: HeroProps) {
  const { couple, weddingDate } = data;
  return (
    <section id="top" className="grid min-h-[94vh] md:grid-cols-[1.05fr_0.95fr]">
      <div className="relative flex flex-col justify-end bg-surface px-8 py-14 md:px-16">
        {/* The date runs vertically up the edge — a spine, not a caption. */}
        <span
          aria-hidden="true"
          className="absolute left-4 top-14 hidden text-[0.58rem] uppercase tracking-[0.5em] text-ink-soft md:block"
          style={{ writingMode: "vertical-rl" }}
        >
          {formatWeddingDate(weddingDate, { day: "numeric", month: "long", year: "numeric" })}
        </span>

        <h1 className="font-display text-[clamp(2.4rem,6.5vw,5.2rem)] leading-[0.94] tracking-[-0.02em] text-brand">
          {couple.brideName}
          <span className="px-3 text-gilt-ink">&amp;</span>
          {couple.groomName}
        </h1>
        <p className="mt-6 max-w-xs text-sm leading-relaxed text-ink-soft">
          {data.invitationMessage}
        </p>
      </div>

      <div className="relative min-h-[52vh] md:min-h-full">
        <Image src={couple.heroPhoto} alt="" fill sizes="50vw" priority className="object-cover" />
      </div>
    </section>
  );
}

/**
 * `monogram` — the mark is the hero. Two initials at full height, the names
 * demoted to a single wide-tracked line beneath, and no prose at all.
 */
export function HeroMonogram({ data }: HeroProps) {
  const { couple, weddingDate } = data;
  const reduce = useReducedMotion();

  return (
    <section id="top" className="relative isolate flex min-h-[96vh] items-center justify-center overflow-hidden">
      <Image src={couple.heroPhoto} alt="" fill sizes="100vw" priority className="-z-20 object-cover" />
      {/*
        A gradient, not a flat wash. A single 72% scrim turned the photograph
        into a muddy field of the brand colour — the picture stopped reading and
        the type still had to fight it. This keeps the image open at the top and
        darkens under the mark, which is the only place contrast is needed.
      */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,color-mix(in_oklab,var(--brand-deep)_35%,transparent),color-mix(in_oklab,var(--brand-deep)_78%,transparent))]" />

      <div className="px-6 text-center">
        {/* Initials, letter-spaced apart, at display scale. The ring draws
            itself around them once and then stops. */}
        <div className="relative mx-auto w-fit">
          <m.span
            aria-hidden="true"
            className="absolute -inset-x-10 -inset-y-8 rounded-full border border-gilt/60"
            initial={reduce ? false : { scale: 0.86, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          />
          <span className="relative font-display text-[clamp(5rem,20vw,13rem)] leading-[0.82] tracking-[0.06em] text-[var(--surface)]">
            {couple.brideName[0]}
            {couple.groomName[0]}
          </span>
        </div>

        <p className="mt-14 text-[0.66rem] uppercase tracking-[0.44em] text-[var(--surface)]/85">
          {couple.brideName} — {couple.groomName}
        </p>
        <p className="mt-4 text-[0.6rem] uppercase tracking-[0.3em] text-[var(--surface)]/55">
          {formatWeddingDate(weddingDate, { day: "numeric", month: "short", year: "numeric" })}
        </p>
      </div>
    </section>
  );
}

/**
 * `typographic` — the date set as a number at display size, names ranged
 * right against it, prose in a narrow column at the foot. Nothing centred.
 */
export function HeroTypographic({ data }: HeroProps) {
  const { couple, weddingDate, invitationMessage } = data;
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "16%"]);

  const day = formatWeddingDate(weddingDate, { day: "numeric" });
  const monthYear = formatWeddingDate(weddingDate, { month: "long", year: "numeric" });

  return (
    <section id="top" ref={ref} className="bg-surface">
      <div className="mx-auto grid max-w-6xl gap-6 px-6 pb-14 pt-24 md:grid-cols-[auto_1fr] md:gap-12 md:pt-32">
        {/* The day as a numeral, at the same scale as the names. */}
        <div className="flex items-start gap-4">
          <span className="font-display text-[clamp(4rem,13vw,9rem)] leading-[0.8] text-gilt-ink">{day}</span>
          <span className="mt-3 text-[0.58rem] uppercase leading-relaxed tracking-[0.3em] text-ink-soft">
            {monthYear.split(" ").map((w) => <span key={w} className="block">{w}</span>)}
          </span>
        </div>

        <h1 className="self-end text-right font-display text-[clamp(2.4rem,8vw,6rem)] leading-[0.92] tracking-[-0.02em] text-brand">
          <span className="block">{couple.brideName}</span>
          <span className="block">{couple.groomName}</span>
        </h1>

        <p className="col-start-1 max-w-xs text-sm leading-relaxed text-ink-soft md:col-start-2 md:justify-self-end">
          {invitationMessage}
        </p>
      </div>

      <div className="relative h-[46vh] overflow-hidden">
        <m.div style={{ y }} className="absolute inset-x-0 -top-[8%] h-[116%]">
          <Image src={couple.heroPhoto} alt="" fill sizes="100vw" priority className="object-cover" />
        </m.div>
      </div>
    </section>
  );
}
