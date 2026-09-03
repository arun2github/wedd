"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { m, useReducedMotion } from "framer-motion";
import { Hero } from "./Hero";
import { useIntro } from "@/components/providers/IntroProvider";
import { useDeviceCapability } from "@/hooks/useDeviceCapability";
import { easeLux, easeOut } from "@/lib/motion";
import { ENVELOPE } from "@/lib/intro-timeline";
import type { CoupleInfo } from "@/types/wedding";

const CLIP = {
  desktop: "/envelope/envelope.mp4",
  mobile: "/envelope/envelope-m.mp4",
  sealed: "/envelope/sealed.jpg",
} as const;

/**
 * The point the whole sequence pivots around: the mouth of the opened envelope.
 * The envelope scales up *from* here, so it opens around the camera instead of
 * drifting off centre — and the invitation scales up from the same point, so it
 * reads as coming out of the opening rather than fading in over it.
 *
 * The clip is 16:9 shown `object-contain`, so where the mouth actually lands
 * depends on how much letterboxing the viewport adds: dead-on 37% at 16:9,
 * pushed toward the middle of the screen as the viewport gets taller.
 */
const MOUTH = "origin-[50%_46%] sm:origin-[50%_41%] lg:origin-[50%_38%]";

/**
 * The envelope has to be *gone* well before the invitation fills the frame —
 * otherwise the card reads as a small thing sitting inside an envelope that
 * never left, rather than as the letter that was inside it. So its opacity runs
 * out early and the rest of the climb belongs to the invitation alone.
 */
const ENVELOPE_FADE = ENVELOPE.emerge * 0.55;

/** The card is solid almost immediately; only its *size* takes the full move. */
const CARD_FADE = ENVELOPE.emerge * 0.35;

interface EnvelopeIntroProps {
  couple: CoupleInfo;
  weddingDate: string;
  invitationMessage: string;
}

/**
 * Step two of the opening, as one continuous shot.
 *
 * The curtain lifts onto a sealed envelope, the clip plays itself, and just
 * before its last frame the camera dives into the mouth: the envelope rushes
 * past and burns off while the invitation grows out of the same point to fill
 * the screen. Only when that lands does the hero cascade start and the page
 * become scrollable — so the guest watches the film once, start to finish,
 * rather than scrubbing past it.
 *
 * The envelope and the invitation share one stage precisely so the handoff can
 * be a single move. There is no cut between them because there is no boundary
 * between them.
 */
export function EnvelopeIntro({ couple, weddingDate, invitationMessage }: EnvelopeIntroProps) {
  const prefersReducedMotion = useReducedMotion();
  const tier = useDeviceCapability();
  const { phase, revealed, startReveal, skipped } = useIntro();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [diving, setDiving] = useState(false);
  const [painted, setPainted] = useState(false);

  /**
   * Reduced motion gets no film at all: this is a hard autoplay the guest cannot
   * interrupt, which is exactly what that setting asks us not to do. The
   * catalogue gets none either — there, the design is the subject, and the
   * opening is twelve seconds standing in front of it.
   */
  const cinematic = !prefersReducedMotion && !skipped;
  const playing = cinematic && phase === "envelope";

  // Held back until the curtain is out of the way, so the opening doesn't play
  // to nobody behind it.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !playing) return;
    // Safe to set here rather than on load: the capability tier settles within a
    // frame of hydration, so the source is long since final by the time the
    // curtain lifts and this runs.
    video.playbackRate = ENVELOPE.rate;
    // Muted autoplay is permitted, but a refusal must not strand the guest
    // behind a frozen page — the ceiling below carries the sequence either way.
    void video.play().catch(() => {});
  }, [playing]);

  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(() => setDiving(true), ENVELOPE.ceiling * 1000);
    return () => clearTimeout(id);
  }, [playing]);

  // Nothing plays without the film, so nothing would ever reach the dive.
  useEffect(() => {
    if (cinematic || phase !== "envelope") return;
    startReveal();
  }, [cinematic, phase, startReveal]);

  /**
   * `timeupdate` only fires about four times a second — and at `rate` that's a
   * coarser slice of wall time than it looks. Still plenty: the dive is
   * deliberately cued *early*, so landing anywhere in that window reads the same.
   */
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video?.duration) return;
    if (video.currentTime >= video.duration - ENVELOPE.overlap) setDiving(true);
  };

  if (!cinematic) {
    return (
      <section id="home" className="relative">
        <Hero couple={couple} weddingDate={weddingDate} invitationMessage={invitationMessage} />
      </section>
    );
  }

  return (
    <section id="home" className="relative h-dvh overflow-hidden">
      {/* The clip's own backdrop, extended to fill whatever the video can't. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 95% at 32% 18%, var(--color-stage) 0%, var(--color-stage-deep) 100%)",
        }}
      />

      {/* Once the cascade has started the envelope is finished for good — and a
          returning guest never mounts it at all. */}
      {!revealed && (
        <>
          <m.div
            aria-hidden="true"
            initial={false}
            animate={diving ? { scale: 2.6, opacity: 0 } : { scale: 1, opacity: 1 }}
            transition={{
              duration: ENVELOPE.emerge,
              ease: easeLux,
              opacity: { duration: ENVELOPE_FADE, ease: easeOut },
            }}
            className={`absolute inset-0 ${MOUTH}`}
          >
            {/*
              Held until the decoder paints its first frame. On iOS a video that
              has never played renders as a blank box, so this is load-time cover
              *and* insurance against an autoplay the browser refuses.
            */}
            <Image
              src={CLIP.sealed}
              alt="A wedding invitation envelope closed with a gold wax seal"
              fill
              priority
              sizes="100vw"
              className="object-contain transition-opacity duration-500"
              style={{ opacity: painted ? 0 : 1 }}
            />
            <video
              ref={videoRef}
              src={tier === "rich" ? CLIP.desktop : CLIP.mobile}
              muted
              playsInline
              preload="auto"
              tabIndex={-1}
              onLoadedData={() => setPainted(true)}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setDiving(true)}
              className="size-full object-contain transition-opacity duration-500"
              style={{ opacity: painted ? 1 : 0 }}
            />
          </m.div>

          {/* The studio light going out as the envelope burns off, so the card
              emerges into the dark rather than onto a lit table. */}
          <m.div
            aria-hidden="true"
            initial={false}
            animate={{ opacity: diving ? 1 : 0 }}
            transition={{ duration: ENVELOPE_FADE, ease: easeOut }}
            className="pointer-events-none absolute inset-0 bg-brand-deep"
          />
        </>
      )}

      {/* The invitation itself, drawn out of the mouth. */}
      <m.div
        initial={false}
        animate={
          diving
            ? { scale: 1, opacity: 1, borderRadius: "0px" }
            : { scale: 0.34, opacity: 0, borderRadius: "36px" }
        }
        transition={{
          duration: ENVELOPE.emerge,
          ease: easeLux,
          opacity: { duration: CARD_FADE, ease: easeOut },
        }}
        onAnimationComplete={() => {
          if (diving) startReveal();
        }}
        className={`absolute inset-0 overflow-hidden ${MOUTH}`}
      >
        <Hero couple={couple} weddingDate={weddingDate} invitationMessage={invitationMessage} />
        {/* Gold card edge — what makes it read as printed stock while it is
            small, gone by the time it fills the frame. */}
        <m.div
          aria-hidden="true"
          initial={false}
          animate={diving ? { opacity: 0, borderRadius: "0px" } : { opacity: 1, borderRadius: "36px" }}
          transition={{ duration: ENVELOPE.emerge, ease: easeLux }}
          className="pointer-events-none absolute inset-0 border-2 border-gilt/60"
        />
      </m.div>
    </section>
  );
}
