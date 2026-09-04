"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";

/**
 * A full-bleed looping film with the page's opening copy over it.
 *
 * This replaced `ScrollExpandMedia` on the home page. That component locked
 * the page for several seconds while a card grew to fill the viewport — a
 * scroll hijack a visitor could not interrupt, and, once the background was a
 * film in its own right, a second film playing inside a card on top of it.
 * The film is now simply the hero.
 *
 * Two behaviours the plain markup does not give you:
 *
 * - **Reduced motion shows the poster instead.** A hero that expands once
 *   ends; a background loop never does, which is exactly the case that setting
 *   exists for.
 * - **Playback stops when the hero leaves the screen.** Browsers keep decoding
 *   an off-screen video, and this one sits at the top of a long page, so
 *   without this it decodes for the entire scroll.
 */

interface VideoHeroProps {
  videoSrc: string;
  /** First frame of `videoSrc` — shown while it decodes, and in place of it
   *  when motion is reduced, so the hero is never a blank rectangle. */
  posterSrc: string;
  /**
   * The page's `h1`, rendered for screen readers and search engines only.
   *
   * A hero can be wordless; a document cannot be headingless. Dropping the
   * heading would leave the page with no top-level heading at all, so it stays
   * in the markup and leaves the screen.
   */
  title: string;
  children?: ReactNode;
}

export function VideoHero({
  videoSrc,
  posterSrc,
  title,
  children,
}: VideoHeroProps) {
  const prefersReduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Autoplay can still be refused (a data-saver setting, a policy the
          // page cannot see). The poster stays up, so a rejection is a still
          // hero rather than a black one.
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <section className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden">
      {/*
        `z-0`, never `-z-10`. This section establishes no stacking context of
        its own, so a negative index does not sit behind the hero's content —
        it escapes the section entirely and lands behind the page background,
        which then paints straight over the film and it never appears at all.
      */}
      <div aria-hidden="true" className="absolute inset-0 z-0">
        {prefersReduced ? (
          <Image
            src={posterSrc}
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover object-center"
          />
        ) : (
          <video
            ref={videoRef}
            src={videoSrc}
            poster={posterSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            tabIndex={-1}
            className="size-full object-cover object-center"
          />
        )}
        {/*
          The clip runs at a mean luma of 156/255 across its 216 frames — a
          consistently bright, high-key scene, which needs far more scrim than
          a photograph would. Sampled over 201,600 pixels spanning the whole
          clip, 68% carries linen at 5.9:1 and linen/85 at 4.8:1 against the
          worst 1% of ground. 55% measured 4.2:1 — a fail for body copy on the
          brightest frames, which is where a moving background bites.
        */}
        <div className="absolute inset-0 bg-aubergine/68" />
      </div>

      <h1 className="sr-only relative z-10">{title}</h1>

      <div className="relative z-10 w-full px-5 py-24 sm:px-8">{children}</div>
    </section>
  );
}
