"use client";

import Image from "next/image";
import { m } from "framer-motion";
import type { GalleryImage } from "@/types/wedding";

/**
 * Gallery variants.
 *
 * Gallery was already the best-differentiated section in the audit, so these
 * keep that variety and make it selectable rather than baked into a file.
 */
export interface GalleryProps {
  gallery: GalleryImage[];
}

/** `masonry` — heights follow each photograph's own aspect, so the grid is
 *  uneven the way a wall of prints is uneven. */
export function GalleryMasonry({ gallery }: GalleryProps) {
  const span = { portrait: "row-span-2", landscape: "", square: "" } as const;
  return (
    <section id="gallery" className="px-6 py-20 md:px-12">
      <h2 className="text-[0.62rem] uppercase tracking-[0.32em] text-ink-soft">Photographs</h2>
      <div className="mt-8 grid auto-rows-[11rem] grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {gallery.map((img) => (
          <figure key={img.src} className={`relative overflow-hidden ${span[img.aspect]}`}>
            <Image src={img.src} alt={img.alt} fill sizes="(min-width:1024px) 24vw, 45vw" className="object-cover" />
          </figure>
        ))}
      </div>
    </section>
  );
}

/** `horizontal` — one plate at a time, swiped. The page stops being a column. */
export function GalleryHorizontal({ gallery }: GalleryProps) {
  return (
    <section id="gallery" className="py-20">
      <h2 className="px-6 text-[0.62rem] uppercase tracking-[0.32em] text-ink-soft md:px-12">
        Photographs
      </h2>
      <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 md:px-12">
        {gallery.map((img) => (
          <figure key={img.src} className="relative aspect-[3/4] w-[72vw] shrink-0 snap-center sm:w-[38vw] lg:w-[26vw]">
            <Image src={img.src} alt={img.alt} fill sizes="(min-width:1024px) 26vw, 72vw" className="object-cover" />
          </figure>
        ))}
      </div>
    </section>
  );
}

/** `polaroid` — prints with a white border, dropped slightly askew, as if
 *  laid on a table rather than hung on a wall. */
export function GalleryPolaroid({ gallery }: GalleryProps) {
  const tilt = [-3.5, 2.5, -1.5, 3, -2.5, 1.5, -3, 2];
  return (
    <section id="gallery" className="px-6 py-20 md:px-12">
      <h2 className="text-[0.62rem] uppercase tracking-[0.32em] text-ink-soft">Photographs</h2>
      <div className="mt-10 flex flex-wrap justify-center gap-6">
        {gallery.slice(0, 8).map((img, i) => (
          <m.figure
            key={img.src}
            className="bg-white p-2.5 pb-9 shadow-xl"
            initial={{ opacity: 0, y: 16, rotate: tilt[i % tilt.length] }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ rotate: 0, scale: 1.03 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ rotate: tilt[i % tilt.length] }}
          >
            <div className="relative aspect-square w-40 sm:w-48">
              <Image src={img.src} alt={img.alt} fill sizes="12rem" className="object-cover" />
            </div>
            <figcaption className="mt-2 text-center font-script text-lg leading-none text-neutral-700">
              {img.category.replace("-", " ")}
            </figcaption>
          </m.figure>
        ))}
      </div>
    </section>
  );
}
