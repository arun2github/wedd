"use client";

import { useRef } from "react";
import { m } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { staggerContainer, revealViewport } from "@/lib/motion";
import { useParallax } from "@/lib/motion-hooks";
import { EventTicket } from "./EventTicket";
import type { WeddingEvent } from "@/types/wedding";

interface WeddingEventsProps {
  events: WeddingEvent[];
}

export function WeddingEvents({ events }: WeddingEventsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  /*
    One value per grid column, indexed by `index % 4`, so the row drifts as a
    staircase rather than a slab. They're hoisted out of the `.map` because a
    hook cannot be called from inside a callback.
  */
  const columnY = [
    useParallax(sectionRef, 24),
    useParallax(sectionRef, 18),
    useParallax(sectionRef, 12),
    useParallax(sectionRef, 6),
  ];

  return (
    // Stays light: OurStory and Venue on either side are both `ivory-dark`,
    // and the ticket notches are cut in this section's colour.
    <section ref={sectionRef} id="events" className="bg-ivory py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Celebrations"
          title="Wedding Events"
          description="Join us for each ceremony as we celebrate our union, one tradition at a time."
        />

        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          variants={staggerContainer(0.1)}
          /* No `items-start`: grid items stretch by default, which is what lets
             every card in a row share the tallest one's height and keeps the
             perforations on a single line across the section. */
          className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {events.map((event, index) => (
            <EventTicket
              key={event.name}
              event={event}
              day={index + 1}
              y={columnY[index % columnY.length]}
            />
          ))}
        </m.div>
      </div>
    </section>
  );
}
