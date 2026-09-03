"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { Monogram } from "./Monogram";
import { useIntro } from "@/components/providers/IntroProvider";
import { easeLux, easeOut } from "@/lib/motion";
import { CURTAIN } from "@/lib/intro-timeline";

interface CurtainLoaderProps {
  brideName: string;
  groomName: string;
  /**
   * The first image the curtain uncovers — the sealed envelope. Preloaded so it
   * is never caught half-decoded as the halves draw apart.
   */
  poster: string;
}

/** Resolves once the image is decoded, or immediately if it can't be. */
function decodeImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function CurtainLoader({ brideName, groomName, poster }: CurtainLoaderProps) {
  const prefersReducedMotion = useReducedMotion();
  const { phase, finishLoading } = useIntro();
  const [ready, setReady] = useState(false);

  // Real readiness: fonts decoded + the envelope poster decoded, floored at the
  // monogram draw time so it never flashes, and ceilinged so a slow network
  // can't trap the user behind the curtain. All state updates land in async
  // callbacks, so this never triggers a synchronous setState during the effect.
  useEffect(() => {
    let cancelled = false;
    const markReady = () => {
      if (!cancelled) setReady(true);
    };

    if (prefersReducedMotion) {
      markReady();
      return () => {
        cancelled = true;
      };
    }

    const ceiling = setTimeout(markReady, CURTAIN.maxWait * 1000);

    Promise.all([
      document.fonts?.ready ?? Promise.resolve(),
      decodeImage(poster),
      // Floor: let the monogram finish drawing before we tear the curtain down.
      delay((CURTAIN.monogramDraw + 0.25) * 1000),
    ]).then(() => {
      clearTimeout(ceiling);
      markReady();
    });

    return () => {
      cancelled = true;
      clearTimeout(ceiling);
    };
  }, [prefersReducedMotion, poster]);

  // Hand control to the envelope once the curtain has finished pulling apart.
  useEffect(() => {
    if (!ready) return;
    const splitMs = prefersReducedMotion ? 0 : CURTAIN.split * 1000;
    const id = setTimeout(finishLoading, splitMs);
    return () => clearTimeout(id);
  }, [ready, prefersReducedMotion, finishLoading]);

  const splitTransition = { duration: CURTAIN.split, ease: easeLux };

  return (
    <AnimatePresence>
      {phase === "loading" && (
        <m.div
          key="curtain"
          className="fixed inset-0 z-100 overflow-hidden"
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          aria-hidden="true"
        >
          {/* Two halves that draw apart like a theatre curtain. */}
          <m.div
            className="absolute inset-y-0 left-0 w-1/2 bg-brand-deep"
            initial={{ x: "0%" }}
            animate={{ x: ready && !prefersReducedMotion ? "-100%" : "0%" }}
            transition={splitTransition}
          />
          <m.div
            className="absolute inset-y-0 right-0 w-1/2 bg-brand-deep"
            initial={{ x: "0%" }}
            animate={{ x: ready && !prefersReducedMotion ? "100%" : "0%" }}
            transition={splitTransition}
          />
          {/* Hairline seam where the halves meet. */}
          <m.div
            className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gilt/30"
            animate={{ opacity: ready ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          />

          <m.div
            className="absolute inset-0 flex flex-col items-center justify-center gap-8"
            animate={{ opacity: ready ? 0 : 1 }}
            transition={{ duration: 0.35, ease: easeOut }}
          >
            <Monogram brideName={brideName} groomName={groomName} />

            <div className="h-px w-40 overflow-hidden bg-gilt/20">
              <m.div
                className="h-full w-full origin-left bg-gilt"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: ready ? 1 : 0.7 }}
                transition={{
                  duration: ready ? 0.35 : CURTAIN.maxWait,
                  ease: ready ? easeOut : "linear",
                }}
              />
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
