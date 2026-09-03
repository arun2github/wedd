"use client";

import { useRef } from "react";
import Image from "next/image";
import { m } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { fadeUp, staggerContainer, revealViewport } from "@/lib/motion";
import { useParallax } from "@/lib/motion-hooks";
import type { CoupleInfo } from "@/types/wedding";

interface CoupleSectionProps {
  couple: CoupleInfo;
}

export function CoupleSection({ couple }: CoupleSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  // Opposed drift — the two portraits pass each other as the section scrolls.
  const brideY = useParallax(sectionRef, 50);
  const groomY = useParallax(sectionRef, -50);

  return (
    <section ref={sectionRef} id="couple" className="bg-surface py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading eyebrow="The Couple" title="Two Hearts, One Story" />

        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          variants={staggerContainer(0.15)}
          className="mt-14 grid grid-cols-1 items-center gap-10 sm:grid-cols-[1fr_auto_1fr] sm:gap-6"
        >
          {/* Parallax sits on a wrapper: `fadeUp` also animates `y`, and the two
              would fight over the same transform channel on one element. */}
          <m.div style={{ y: brideY }}>
            <m.figure variants={fadeUp} className="flex flex-col items-center gap-5 text-center">
              <div className="group/frame relative size-48 sm:size-56">
                {/* The gold hairline expands on hover; the photo itself holds
                    still, so the frame reads as opening around it. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-1 rounded-full border border-gilt/0 transition-all duration-500 ease-out group-hover/frame:-inset-2 group-hover/frame:border-gilt/70"
                />
                <div className="relative size-full overflow-hidden rounded-full border-4 border-gilt/40 shadow-md transition-colors duration-500 group-hover/frame:border-gilt/70">
                  <Image
                    src={couple.bridePhoto}
                    alt={`Portrait of ${couple.brideName}`}
                    fill
                    sizes="224px"
                    className="object-cover"
                  />
                </div>
              </div>
              <figcaption>
                <p className="font-display text-2xl text-brand sm:text-3xl">{couple.brideName}</p>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-soft">
                  {couple.brideIntro}
                </p>
              </figcaption>
            </m.figure>
          </m.div>

          <m.span
            variants={fadeUp}
            className="font-script text-5xl text-gilt-ink sm:text-6xl"
            aria-hidden="true"
          >
            &amp;
          </m.span>

          <m.div style={{ y: groomY }}>
            <m.figure variants={fadeUp} className="flex flex-col items-center gap-5 text-center">
              <div className="group/frame relative size-48 sm:size-56">
                {/* The gold hairline expands on hover; the photo itself holds
                    still, so the frame reads as opening around it. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-1 rounded-full border border-gilt/0 transition-all duration-500 ease-out group-hover/frame:-inset-2 group-hover/frame:border-gilt/70"
                />
                <div className="relative size-full overflow-hidden rounded-full border-4 border-gilt/40 shadow-md transition-colors duration-500 group-hover/frame:border-gilt/70">
                  <Image
                    src={couple.groomPhoto}
                    alt={`Portrait of ${couple.groomName}`}
                    fill
                    sizes="224px"
                    className="object-cover"
                  />
                </div>
              </div>
              <figcaption>
                <p className="font-display text-2xl text-brand sm:text-3xl">{couple.groomName}</p>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-soft">
                  {couple.groomIntro}
                </p>
              </figcaption>
            </m.figure>
          </m.div>
        </m.div>
      </div>
    </section>
  );
}
