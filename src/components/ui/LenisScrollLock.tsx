"use client";

import { useEffect } from "react";
import { useScrollController } from "@/components/providers/SmoothScrollProvider";

/**
 * Radix overlays lock the body via `react-remove-scroll`, which Lenis doesn't
 * observe — the page keeps scrolling underneath an open dialog. Mount this
 * inside any overlay that should freeze the page.
 */
export function LenisScrollLock({ active }: { active: boolean }) {
  const scroll = useScrollController();

  useEffect(() => {
    if (!active) return;
    scroll.lock();
    return () => scroll.unlock();
  }, [scroll, active]);

  return null;
}
