"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import type { ReactNode } from "react";
import { useAnimationFrame, useReducedMotion } from "framer-motion";
import Lenis from "lenis";

export interface ScrollController {
  /**
   * Freezes page scrolling. Reference-counted, so the intro sequence and an
   * open dialog can hold a lock at the same time without fighting each other.
   */
  lock: () => void;
  unlock: () => void;
}

const ScrollContext = createContext<ScrollController | null>(null);

export function useScrollController(): ScrollController {
  const controller = useContext(ScrollContext);
  if (!controller) {
    throw new Error("useScrollController must be used inside <SmoothScrollProvider>");
  }
  return controller;
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);
  const lockCount = useRef(0);

  // Kept in a ref rather than state: the instance is an external system, and
  // storing it in state would mean a setState inside the creating effect.
  const applyLock = useCallback(() => {
    const locked = lockCount.current > 0;
    const lenis = lenisRef.current;

    if (lenis) {
      if (locked) lenis.stop();
      else lenis.start();
      return;
    }

    // No Lenis (reduced motion) — lock the document directly. Uses
    // documentElement so it doesn't collide with Radix's body-level lock.
    document.documentElement.style.overflow = locked ? "hidden" : "";
  }, []);

  const controller = useMemo<ScrollController>(
    () => ({
      lock: () => {
        lockCount.current += 1;
        applyLock();
      },
      unlock: () => {
        lockCount.current = Math.max(0, lockCount.current - 1);
        applyLock();
      },
    }),
    [applyLock]
  );

  useEffect(() => {
    if (prefersReducedMotion) return;

    const instance = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // Native touch scrolling on iOS — Lenis' synthetic touch is janky there.
      syncTouch: false,
      // Driven from framer-motion's rAF below so scroll and motion share a frame.
      autoRaf: false,
    });

    lenisRef.current = instance;
    // A consumer may already hold a lock: child effects run before this one.
    applyLock();

    return () => {
      instance.destroy();
      lenisRef.current = null;
    };
  }, [prefersReducedMotion, applyLock]);

  useAnimationFrame((time) => {
    lenisRef.current?.raf(time);
  });

  return <ScrollContext.Provider value={controller}>{children}</ScrollContext.Provider>;
}
