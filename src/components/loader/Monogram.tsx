"use client";

import { m } from "framer-motion";
import { drawPath, easeOut } from "@/lib/motion";
import { CURTAIN } from "@/lib/intro-timeline";

interface MonogramProps {
  brideName: string;
  groomName: string;
}

/**
 * The couple's initials inside a drawn-on gold ring — the loader's focal point.
 * The ring is a real SVG circle so it can be revealed with `pathLength`; the
 * letters are HTML text so they inherit the site's script face.
 */
export function Monogram({ brideName, groomName }: MonogramProps) {
  const initials = `${brideName.charAt(0)}${groomName.charAt(0)}`.toUpperCase();

  return (
    <div className="relative flex size-36 items-center justify-center">
      <m.svg
        viewBox="0 0 100 100"
        className="absolute inset-0 size-full text-gold"
        fill="none"
        aria-hidden="true"
      >
        <m.circle
          cx="50"
          cy="50"
          r="46"
          stroke="currentColor"
          strokeWidth="0.75"
          variants={drawPath}
          initial="hidden"
          animate="visible"
          transition={{ pathLength: { duration: CURTAIN.monogramDraw, ease: easeOut } }}
        />
        <m.circle
          cx="50"
          cy="50"
          r="41"
          stroke="currentColor"
          strokeWidth="0.4"
          strokeOpacity="0.5"
          variants={drawPath}
          initial="hidden"
          animate="visible"
          transition={{
            pathLength: { duration: CURTAIN.monogramDraw, ease: easeOut, delay: 0.15 },
          }}
        />
      </m.svg>

      <m.span
        className="font-script text-5xl text-gold-light"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.35, ease: easeOut }}
      >
        {initials.charAt(0)}
        <span className="mx-0.5 text-3xl text-gold">&amp;</span>
        {initials.charAt(1)}
      </m.span>
    </div>
  );
}
