"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";

/**
 * `rich`     — wide desktop with decent hardware: full-resolution media, deep parallax
 * `standard` — capable but constrained (small viewport, or coarse pointer)
 * `lite`     — very weak hardware: lighter media, reduced parallax
 */
export type DeviceTier = "rich" | "standard" | "lite";

const RICH_MIN_WIDTH = 1024;

interface NavigatorWithHints extends Navigator {
  deviceMemory?: number;
}

function detectTier(): DeviceTier {
  const nav = navigator as NavigatorWithHints;
  const memory = nav.deviceMemory ?? 8;
  const cores = nav.hardwareConcurrency ?? 8;
  if (memory <= 2 || cores <= 2) return "lite";

  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
  const isWide = window.innerWidth >= RICH_MIN_WIDTH;
  if (!hasFinePointer || !isWide) return "standard";

  return "rich";
}

/**
 * Detects the device's motion budget once on the client. Renders `"lite"` on the
 * server and on the hydration pass so SSR and first client paint agree, then
 * settles to the real tier — same `useSyncExternalStore` approach used by
 * `useCountdown`. The tier never changes after first detection, so `subscribe`
 * is a no-op.
 */
export function useDeviceCapability(): DeviceTier {
  const cacheRef = useRef<DeviceTier | null>(null);

  const subscribe = useCallback(() => () => {}, []);
  const getSnapshot = useCallback(() => {
    if (cacheRef.current === null) {
      cacheRef.current = detectTier();
    }
    return cacheRef.current;
  }, []);
  const getServerSnapshot = useCallback((): DeviceTier => "lite", []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
