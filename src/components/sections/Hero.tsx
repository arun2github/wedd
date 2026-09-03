"use client";

import Image from "next/image";
import { m, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SplitText } from "@/components/ui/SplitText";
import { useIntro } from "@/components/providers/IntroProvider";
import { easeOut, easeLux, drawPath, hoverSpring } from "@/lib/motion";
import { REVEAL, BACKGROUND_SETTLE } from "@/lib/intro-timeline";
import { cn } from "@/lib/utils";
import { formatWeddingDate } from "@/lib/format-date";
import type { CoupleInfo } from "@/types/wedding";

interface HeroProps {
  couple: CoupleInfo;
  weddingDate: string;
  invitationMessage: string;
}

/**
 * The invitation's contents.
 *
 * This is not a standalone section — it fills whatever box `EnvelopeIntro`
 * gives it, which starts as a small card sitting in the envelope's mouth and
 * ends as the full viewport. So it sizes to its parent rather than to the
 * screen, and it owns none of its own entrance: the growing out of the envelope
 * *is* the entrance, and the cascade below only starts once that has nearly
 * finished.
 */
export function Hero({ couple, weddingDate, invitationMessage }: HeroProps) {
  const prefersReducedMotion = useReducedMotion();
  const { revealed } = useIntro();

  const formattedDate = formatWeddingDate(weddingDate, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  /**
   * Reduced motion collapses the whole cascade into one short fade — every beat
   * lands at once instead of staggering.
   */
  const at = (seconds: number) => (prefersReducedMotion ? 0 : seconds);
  const span = (seconds: number) => (prefersReducedMotion ? 0.24 : seconds);

  const beat = (delay: number) => ({
    initial: { opacity: 0, y: prefersReducedMotion ? 0 : 12 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: at(delay), duration: span(0.5), ease: easeLux },
  });

  const restingScale = prefersReducedMotion ? 1 : BACKGROUND_SETTLE.from;

  return (
    // `bg-brand-deep` is also the colour the envelope stage washes to, so the
    // card and the frame it emerges into are never two different blacks.
    <section
      className="relative flex size-full min-h-dvh flex-col items-center justify-center overflow-hidden bg-brand-deep"
    >
      {/*
        Background photo. Visible from the moment the card appears — it is what
        makes the emerging card read as a photograph being drawn out of the
        envelope rather than an empty rectangle. Only the Ken Burns settle waits
        for the reveal.
      */}
      <m.div
        initial={{ scale: restingScale }}
        animate={{ scale: revealed ? BACKGROUND_SETTLE.to : restingScale }}
        transition={{ duration: span(BACKGROUND_SETTLE.duration), ease: easeLux }}
        className="absolute inset-0"
      >
        {/*
          `priority`, not lazy.

          This is the largest element on the first screen of every wedding
          site, and it sits under a scrim whose bottom stop is fully opaque —
          so until it paints, the whole viewport is a flat block of
          `brand-deep` with the couple's names invisible against it. Lazy
          loading defers exactly the one image the page cannot open without,
          and it is worst on the template catalogue, where someone stepping
          through designs sees a plain colour rectangle each time.
        */}
        <Image src={couple.heroPhoto} alt="" fill sizes="100vw" priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-deep via-brand-deep/65 to-brand-deep/30" />
      </m.div>

      {/*
        Revealed hero content — each beat timed off `intro-timeline`.

        Always mounted, never conditionally rendered: this block holds the page's
        only `<h1>`, and gating it on `revealed` kept it out of the server HTML
        entirely. Before the reveal it's pulled out of flow and `invisible`
        (which also drops it from the tab order) rather than removed — which
        doubles as the reason the card looks like a photo and not a headline
        while it is still small. The key flips on reveal so every
        `initial → animate` beat replays then.
      */}
      <m.div
        key={revealed ? "hero-revealed" : "hero-sealed"}
        aria-hidden={!revealed}
        className={cn(
          "z-10 flex flex-col items-center gap-6 px-6 text-center text-surface",
          revealed ? "relative" : "pointer-events-none invisible absolute inset-x-0"
        )}
      >
        <m.p
          {...beat(REVEAL.eyebrow)}
          className="font-sans text-xs uppercase tracking-[0.35em] text-gilt-soft"
        >
          We&apos;re Getting Married
        </m.p>

        <h1 className="font-display text-5xl font-medium sm:text-6xl md:text-7xl">
          <SplitText text={couple.brideName} delay={at(REVEAL.brideName)} />{" "}
          <m.span
            initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.4, rotate: -12 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0.24 }
                : { delay: REVEAL.ampersand, type: "spring", stiffness: 260, damping: 15 }
            }
            className="inline-block font-script text-4xl text-gilt-ink sm:text-5xl md:text-6xl"
          >
            &amp;
          </m.span>{" "}
          <SplitText text={couple.groomName} delay={at(REVEAL.groomName)} />
        </h1>

        {/* Gold divider, drawn rather than faded. */}
        <m.svg
          viewBox="0 0 120 16"
          className="h-4 w-24 text-gilt-ink"
          fill="none"
          aria-hidden="true"
          initial="hidden"
          animate="visible"
          transition={{ delayChildren: at(REVEAL.divider) }}
        >
          <m.line
            x1="0"
            y1="8"
            x2="48"
            y2="8"
            stroke="currentColor"
            strokeWidth="1"
            variants={drawPath}
          />
          <m.path
            d="M60 2 L66 8 L60 14 L54 8 Z"
            fill="currentColor"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: at(REVEAL.divider + 0.25), duration: span(0.4), ease: easeOut }}
            style={{ transformOrigin: "60px 8px" }}
          />
          <m.line
            x1="120"
            y1="8"
            x2="72"
            y2="8"
            stroke="currentColor"
            strokeWidth="1"
            variants={drawPath}
          />
        </m.svg>

        <m.p
          {...beat(REVEAL.message)}
          className="max-w-md text-base leading-relaxed text-surface/85 sm:text-lg"
        >
          {invitationMessage}
        </m.p>

        <m.p
          initial={{ opacity: 0, letterSpacing: prefersReducedMotion ? "0.2em" : "0.4em" }}
          animate={{ opacity: 1, letterSpacing: "0.2em" }}
          transition={{ delay: at(REVEAL.date), duration: span(0.9), ease: easeLux }}
          className="font-display text-lg text-gilt-soft sm:text-xl"
        >
          {formattedDate}
        </m.p>
      </m.div>

      {/* Scroll cue */}
      {revealed && (
        <m.a
          href="#countdown"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: at(REVEAL.scrollCue), duration: span(0.6) }}
          whileHover={{ y: -3, transition: hoverSpring }}
          className="absolute bottom-8 z-10 flex flex-col items-center gap-1 text-surface/70 transition-colors hover:text-surface focus-visible:text-surface focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gilt"
          aria-label="Scroll to next section"
        >
          <span className="text-[0.65rem] uppercase tracking-[0.3em]">Scroll</span>
          <m.span
            animate={prefersReducedMotion ? undefined : { y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="size-4" />
          </m.span>
        </m.a>
      )}
    </section>
  );
}
