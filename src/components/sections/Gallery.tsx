"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GalleryLightbox } from "./GalleryLightbox";
import { useParallax } from "@/lib/motion-hooks";
import { easeOut, hoverSpring } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { GalleryCategory, GalleryImage } from "@/types/wedding";

interface GalleryProps {
  gallery: GalleryImage[];
}

const FILTERS: { value: GalleryCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pre-wedding", label: "Pre-Wedding" },
  { value: "engagement", label: "Engagement" },
  { value: "haldi", label: "Haldi" },
  { value: "mehendi", label: "Mehendi" },
  { value: "wedding", label: "Wedding" },
];

/** Seconds between tiles on the entry stagger. */
const TILE_STAGGER = 0.04;

export function Gallery({ gallery }: GalleryProps) {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const headingY = useParallax(sectionRef, 20);
  const [filter, setFilter] = useState<GalleryCategory | "all">("all");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () => (filter === "all" ? gallery : gallery.filter((img) => img.category === filter)),
    [gallery, filter]
  );

  const activeImage = activeIndex !== null ? (filtered[activeIndex] ?? null) : null;

  const showPrev = () =>
    setActiveIndex((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length));
  const showNext = () => setActiveIndex((i) => (i === null ? null : (i + 1) % filtered.length));

  return (
    <section ref={sectionRef} id="gallery" className="bg-ivory py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <m.div style={{ y: headingY }}>
          <SectionHeading eyebrow="Gallery" title="Moments We Cherish" />
        </m.div>

        <Tabs
          value={filter}
          onValueChange={(value) => setFilter(value as GalleryCategory | "all")}
          className="mt-10 items-center"
        >
          <TabsList className="h-auto flex-wrap gap-2 bg-transparent p-0">
            {FILTERS.map((f) => (
              <TabsTrigger
                key={f.value}
                value={f.value}
                className="h-9 rounded-full border border-gold/30 px-4 text-sm data-active:border-wine data-active:bg-transparent data-active:text-ivory"
              >
                {/* The filled pill is a single element that slides between
                    triggers rather than six that cross-fade. */}
                {filter === f.value && (
                  <m.span
                    layoutId="gallery-pill"
                    className="absolute inset-0 rounded-full bg-wine"
                    transition={{ type: "spring", stiffness: 350, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{f.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/*
          Mosaic on a fixed row height — portraits take two rows. CSS `columns`
          can't be used here: the browser fragments items across column boxes,
          which makes framer's layout projection (the `layoutId` flight into
          the lightbox, and the filter reflow) measure garbage.
        */}
        <ul className="mt-10 grid auto-rows-[9rem] grid-cols-2 gap-4 sm:auto-rows-[11rem] sm:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {filtered.map((image, index) => (
              <m.li
                // Keyed on `src`, not index, so a tile that survives a filter
                // change slides to its new cell instead of being rebuilt.
                key={image.src}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{
                  duration: 0.4,
                  ease: easeOut,
                  delay: prefersReducedMotion ? 0 : index * TILE_STAGGER,
                  layout: { type: "spring", stiffness: 260, damping: 30, delay: 0 },
                }}
                className={cn(image.aspect === "portrait" && "row-span-2")}
              >
                <m.button
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  layoutId={`gal-${image.src}`}
                  whileHover={prefersReducedMotion ? undefined : { scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={hoverSpring}
                  className="group relative block size-full overflow-hidden rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 640px) 33vw, 50vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  />
                  {/* Scrim + gold inset ring, both hover- and focus-driven. */}
                  <span className="absolute inset-0 bg-gradient-to-t from-wine-dark/70 via-wine-dark/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
                  <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-gold/0 ring-inset transition-shadow duration-300 group-hover:ring-gold/70 group-focus-visible:ring-gold/70" />
                  <span className="absolute inset-x-0 bottom-0 translate-y-full p-3 text-left text-xs leading-snug text-ivory transition-transform duration-300 ease-out group-hover:translate-y-0 group-focus-visible:translate-y-0">
                    {image.alt}
                  </span>
                </m.button>
              </m.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>

      <GalleryLightbox
        image={activeImage}
        hasSiblings={filtered.length > 1}
        onClose={() => setActiveIndex(null)}
        onPrev={showPrev}
        onNext={showNext}
      />
    </section>
  );
}
