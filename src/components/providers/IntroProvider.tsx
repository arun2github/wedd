"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { useScrollController } from "./SmoothScrollProvider";
import { REVEAL } from "@/lib/intro-timeline";

/**
 * `loading`   — curtain is up, page is being prepared
 * `envelope`  — curtain lifted; the envelope clip is playing and opening
 * `revealing` — the hero cascade is playing
 * `done`      — cascade finished, the site is handed over to the guest
 *
 * Scroll is frozen for every phase before `done`: the whole opening is a piece
 * of film, and a guest who scrolls through it never sees it.
 *
 * Every load runs the sequence from the top — no session flag, no remembered
 * state. This is an invitation, and the opening *is* the invitation; the cost
 * of that choice is paid on every refresh, which is why the timings above are
 * kept short enough to sit through more than once.
 */
export type IntroPhase = "loading" | "envelope" | "revealing" | "done";

interface IntroContextValue {
  phase: IntroPhase;
  /** True once the hero content should be on screen (revealing or later). */
  revealed: boolean;
  /** Curtain finished lifting. */
  finishLoading: () => void;
  /** The envelope has finished opening — starts the hero cascade. Idempotent. */
  startReveal: () => void;
  /**
   * True when this page was mounted already finished.
   *
   * Components need this rather than `phase === "done"`, because every page
   * eventually reaches `done`. This says the opening never ran at all, so a
   * section can lay itself out as the finished article from the first frame
   * instead of switching layout when the film ends.
   */
  skipped: boolean;
}

const IntroContext = createContext<IntroContextValue | null>(null);

export function useIntro(): IntroContextValue {
  const value = useContext(IntroContext);
  if (!value) throw new Error("useIntro must be used inside <IntroProvider>");
  return value;
}

export function IntroProvider({
  children,
  /*
    The template catalogue mounts at `done`.

    Starting there rather than skipping forward after mount matters: the
    curtain renders on `phase === "loading"`, so a late skip mounts it closed
    and then races its own entrance animation with an exit — which strands it
    half-faded over the page. Beginning at `done` means it is never mounted.
  */
  initialPhase = "loading",
}: {
  children: ReactNode;
  initialPhase?: IntroPhase;
}) {
  const prefersReducedMotion = useReducedMotion();
  const scroll = useScrollController();
  const [phase, setPhase] = useState<IntroPhase>(initialPhase);
  const skipped = initialPhase === "done";

  const finishLoading = useCallback(() => {
    setPhase((current) => (current === "loading" ? "envelope" : current));
  }, []);

  const startReveal = useCallback(() => {
    setPhase((current) => (current === "envelope" ? "revealing" : current));
  }, []);

  // Advance to `done` once the cascade has played out.
  useEffect(() => {
    if (phase !== "revealing") return;
    const delay = prefersReducedMotion ? 200 : REVEAL.done * 1000;
    const id = setTimeout(() => setPhase("done"), delay);
    return () => clearTimeout(id);
  }, [phase, prefersReducedMotion]);

  // Gated on a boolean rather than the phase itself so the lock is taken once
  // and released once, instead of churning on every step of the intro.
  const locked = phase !== "done";
  useEffect(() => {
    if (!locked) return;
    scroll.lock();
    return () => scroll.unlock();
  }, [scroll, locked]);

  const value = useMemo<IntroContextValue>(
    () => ({
      phase,
      revealed: phase === "revealing" || phase === "done",
      finishLoading,
      startReveal,
      skipped,
    }),
    [phase, finishLoading, startReveal, skipped]
  );

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}
