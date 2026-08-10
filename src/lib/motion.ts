import type { Variants, Transition } from "framer-motion";

/** Shared power-out easing used across all scroll reveals. */
export const easeOut: Transition["ease"] = [0.22, 1, 0.36, 1];

/** Slower, more deliberate easing for hero-scale moments (curtain, reveal). */
export const easeLux: Transition["ease"] = [0.76, 0, 0.24, 1];

/** Spring used for parallax layers — soft enough to feel weighted, not laggy. */
export const parallaxSpring = { stiffness: 60, damping: 22, mass: 0.35 } as const;

/** Spring used for hover/tap feedback — snappy, no overshoot wobble. */
export const hoverSpring = { type: "spring", stiffness: 300, damping: 30 } as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: easeOut },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: easeOut },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: easeOut },
  },
};

/**
 * Heavier reveal for section-defining elements — travels further, takes longer,
 * and lifts a touch of scale so it reads as arriving rather than fading.
 */
export const luxeReveal: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.75, ease: easeLux },
  },
};

/** Wipes content in from below a clipped edge. Parent needs `overflow-hidden`. */
export const maskReveal: Variants = {
  hidden: { y: "110%" },
  visible: {
    y: "0%",
    transition: { duration: 0.7, ease: easeLux },
  },
};

/** Per-word name reveal — rotates up from behind the baseline. */
export const wordReveal: Variants = {
  hidden: { opacity: 0, y: "50%", rotateX: -55 },
  visible: {
    opacity: 1,
    y: "0%",
    rotateX: 0,
    transition: { duration: 0.65, ease: easeLux },
  },
};

/** Draws an SVG stroke on. Element needs `pathLength`-animatable geometry. */
export const drawPath: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration: 1, ease: easeOut }, opacity: { duration: 0.2 } },
  },
};

/** Card/button lift on hover. Pair with `tapPress`. */
export const hoverLift = { y: -6, transition: hoverSpring } as const;

/** Subtle scale for interactive surfaces that shouldn't move position. */
export const hoverGlow = { scale: 1.03, transition: hoverSpring } as const;

export const tapPress = { scale: 0.97, transition: { duration: 0.1 } } as const;

/** Wraps a set of children with a staggered reveal. Apply to the parent. */
export function staggerContainer(stagger = 0.08, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren,
      },
    },
  };
}

/** Standard viewport config for scroll-triggered reveals — plays once. */
export const revealViewport = { once: true, margin: "-10% 0px -10% 0px" };
