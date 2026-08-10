"use client";

import { useScroll, useSpring, useTransform, useReducedMotion } from "framer-motion";
import type { MotionValue } from "framer-motion";
import type { RefObject } from "react";
import { parallaxSpring } from "./motion";
import { useDeviceCapability } from "@/hooks/useDeviceCapability";

/** Scales parallax travel down on constrained devices. */
const TIER_SCALE = { rich: 1, standard: 0.7, lite: 0.45 } as const;

interface ParallaxOptions {
  /** Skip the spring — springs visibly lag drawn lines and progress bars. */
  smooth?: boolean;
}

/**
 * Translates an element against the scroll direction as its section passes
 * through the viewport. `distance` is the peak offset in px: the element sits at
 * `+distance` when the section enters and `-distance` when it leaves.
 *
 * Returns a `MotionValue<number>` for `style={{ y }}`.
 *
 * IMPORTANT: the moving element must be over-sized relative to its section
 * (e.g. `absolute -inset-y-[12%]`), otherwise the translate exposes a gap at
 * the section edge.
 */
export function useParallax(
  target: RefObject<HTMLElement | null>,
  distance: number,
  { smooth = true }: ParallaxOptions = {}
): MotionValue<number> {
  const prefersReducedMotion = useReducedMotion();
  const tier = useDeviceCapability();

  const { scrollYProgress } = useScroll({
    target,
    offset: ["start end", "end start"],
  });

  const travel = prefersReducedMotion ? 0 : distance * TIER_SCALE[tier];
  const raw = useTransform(scrollYProgress, [0, 1], [travel, -travel]);
  const smoothed = useSpring(raw, parallaxSpring);

  return smooth ? smoothed : raw;
}

/**
 * Raw 0→1 progress of a section through the viewport, for non-translate uses
 * (drawing a timeline spine, fading a scrim). Never sprung.
 */
export function useSectionProgress(
  target: RefObject<HTMLElement | null>
): MotionValue<number> {
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start end", "end start"],
  });
  return scrollYProgress;
}
