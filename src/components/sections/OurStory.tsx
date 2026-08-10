"use client";

import { useRef } from "react";
import Image from "next/image";
import { m, useTransform, useReducedMotion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { fadeUp, revealViewport } from "@/lib/motion";
import { useSectionProgress } from "@/lib/motion-hooks";
import { cn } from "@/lib/utils";
import type { StoryMilestone } from "@/types/wedding";

interface OurStoryProps {
  story: StoryMilestone[];
}

/**
 * Slice of the timeline's viewport pass over which the spine draws. It finishes
 * well before the timeline exits so the last milestone never sits on a bare gap.
 */
const DRAW_RANGE = [0.15, 0.75];

export function OurStory({ story }: OurStoryProps) {
  const prefersReducedMotion = useReducedMotion();
  const timelineRef = useRef<HTMLDivElement>(null);
  const progress = useSectionProgress(timelineRef);
  // Deliberately un-sprung — a spring visibly lags behind a drawn line.
  const scaleY = useTransform(
    progress,
    prefersReducedMotion ? [0, 1] : DRAW_RANGE,
    prefersReducedMotion ? [1, 1] : [0, 1]
  );

  return (
    <section id="story" className="bg-ivory-dark py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Our Story"
          title="How It All Began"
          description="Every love story is beautiful, but ours is our favorite."
        />

        <div ref={timelineRef} className="relative mt-16">
          {/*
            Timeline line: left-aligned on mobile, centered on desktop. The faint
            track stays put; the gold spine draws down over it.

            No `-translate-x-1/2` here — framer writes a full inline `transform`
            for `scaleY`, which would silently drop the class. On a 1px-wide rule
            that centring offset is half a pixel, so both layers just omit it.
          */}
          <div className="absolute inset-y-0 left-4 w-px bg-gold/15 sm:left-1/2" />
          <m.div
            style={{ scaleY }}
            className="absolute inset-y-0 left-4 w-px origin-top bg-gold/50 sm:left-1/2"
            aria-hidden="true"
          />

          <ol className="flex flex-col gap-12">
            {story.map((milestone, index) => {
              const isEven = index % 2 === 0;
              return (
                <li key={milestone.title} className="relative">
                  <m.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={revealViewport}
                    variants={fadeUp}
                    className={cn(
                      "relative grid grid-cols-1 items-center gap-4 pl-12 sm:grid-cols-2 sm:gap-10 sm:pl-0",
                      isEven ? "sm:text-right" : "sm:text-left"
                    )}
                  >
                    {/* Marker */}
                    <span
                      className="absolute top-1.5 left-4 size-3 -translate-x-1/2 rounded-full border-2 border-gold bg-ivory-dark sm:left-1/2"
                      aria-hidden="true"
                    />

                    <div className={cn(isEven ? "sm:order-1 sm:pr-10" : "sm:order-2 sm:pl-10")}>
                      <p className="text-xs font-medium uppercase tracking-[0.25em] text-gold">
                        {milestone.date}
                      </p>
                      <h3 className="mt-2 font-display text-2xl text-wine sm:text-3xl">
                        {milestone.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-charcoal-muted">
                        {milestone.description}
                      </p>
                    </div>

                    {milestone.image && (
                      <div
                        className={cn(
                          "group/shot relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-md transition-shadow duration-500 hover:shadow-lg",
                          isEven ? "sm:order-2 sm:pl-10" : "sm:order-1 sm:pr-10"
                        )}
                      >
                        <Image
                          src={milestone.image}
                          alt={milestone.title}
                          fill
                          sizes="(min-width: 640px) 40vw, 90vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover/shot:scale-105"
                        />
                        <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-gold/0 ring-inset transition-shadow duration-500 group-hover/shot:ring-gold/60" />
                      </div>
                    )}
                  </m.div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
