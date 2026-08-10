"use client";

import { LazyMotion, MotionConfig, domMax } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Loads framer-motion's feature bundle once, lazily, instead of pulling it in
 * through every `motion.*` import site.
 *
 * `domMax` (not `domAnimation`) because the gallery needs `layout`/`layoutId`
 * projection and drag-to-swipe. `strict` makes the `motion.*` component throw,
 * which is what we want — it forces every call site onto `m.*` so the bundle
 * stays lazy.
 *
 * `reducedMotion="user"` makes every transform/layout animation in the tree a
 * no-op when the OS asks for reduced motion, without touching each component.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
