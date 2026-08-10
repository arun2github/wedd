"use client";

import { m, useReducedMotion } from "framer-motion";
import { wordReveal } from "@/lib/motion";
import { WORD_STAGGER } from "@/lib/intro-timeline";

interface SplitTextProps {
  text: string;
  /** Seconds before the first word starts. */
  delay?: number;
  className?: string;
}

/**
 * Reveals a phrase word by word, each rotating up from behind its baseline.
 *
 * Under reduced motion the text renders as a single plain span so screen
 * readers announce it as one phrase and copy-paste stays intact.
 */
export function SplitText({ text, delay = 0, className }: SplitTextProps) {
  const prefersReducedMotion = useReducedMotion();
  const words = text.split(" ");

  if (prefersReducedMotion) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={className} style={{ perspective: 800 }}>
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="inline-block overflow-hidden align-bottom"
          // Trailing space belongs outside the clipped box or it collapses.
          style={{ marginRight: index < words.length - 1 ? "0.25em" : undefined }}
        >
          <m.span
            className="inline-block"
            variants={wordReveal}
            initial="hidden"
            animate="visible"
            transition={{ delay: delay + index * WORD_STAGGER }}
            style={{ transformOrigin: "bottom center" }}
          >
            {word}
          </m.span>
        </span>
      ))}
    </span>
  );
}
