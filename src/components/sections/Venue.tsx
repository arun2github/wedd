"use client";

import { useRef } from "react";
import Image from "next/image";
import { m } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { fadeUp, revealViewport, hoverSpring, tapPress } from "@/lib/motion";
import { useParallax } from "@/lib/motion-hooks";
import type { VenueInfo } from "@/types/wedding";

interface VenueProps {
  venue: VenueInfo;
}

export function Venue({ venue }: VenueProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const y = useParallax(sectionRef, 60);

  return (
    <section ref={sectionRef} id="venue" className="bg-surface-sunk py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading eyebrow="Venue" title="Where We'll Celebrate" />

        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          variants={fadeUp}
          className="mt-14 grid grid-cols-1 overflow-hidden rounded-2xl border border-gilt/25 bg-surface shadow-sm sm:grid-cols-2"
        >
          <div className="relative aspect-[4/3] overflow-hidden sm:aspect-auto">
            {/* Over-sized so the translate never exposes a gap at the tile edge. */}
            <m.div style={{ y }} className="absolute inset-x-0 -inset-y-[12%]">
              <Image
                src={venue.image}
                alt={venue.name}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </m.div>
          </div>

          <div className="flex flex-col justify-center gap-4 p-8 sm:p-10">
            <h3 className="font-display text-2xl text-brand sm:text-3xl">{venue.name}</h3>
            <p className="flex items-start gap-2 text-sm leading-relaxed text-ink-soft">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gilt-ink" aria-hidden="true" />
              {venue.address}
            </p>
            <m.a
              href={venue.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={tapPress}
              transition={hoverSpring}
              className="group mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-medium text-surface transition-colors hover:bg-brand-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gilt"
            >
              <Navigation
                className="size-4 transition-transform duration-300 group-hover:-rotate-12 group-focus-visible:-rotate-12"
                aria-hidden="true"
              />
              Get Directions
            </m.a>
          </div>
        </m.div>
      </div>
    </section>
  );
}
