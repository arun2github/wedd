"use client";

import { useState } from "react";
import Image from "next/image";
import { m } from "framer-motion";
import { Play } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { LenisScrollLock } from "@/components/ui/LenisScrollLock";
import { fadeUp, revealViewport, hoverSpring, tapPress } from "@/lib/motion";
import type { WeddingVideo as WeddingVideoData } from "@/types/wedding";

interface WeddingVideoProps {
  video: WeddingVideoData;
}

export function WeddingVideo({ video }: WeddingVideoProps) {
  const [open, setOpen] = useState(false);

  /*
    No film, no section — better an absent block than a placeholder standing in
    for the couple's own film.

    The guard sits *after* the hook, not before it. An early return above
    `useState` changes how many hooks run between renders, which React forbids:
    the moment a couple added a film the hook order would shift and the
    component would break rather than simply appear.
  */
  if (!video?.url) return null;

  return (
    <section className="bg-surface-sunk py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading eyebrow="Our Film" title={video.title} description={video.description} />

        <m.button
          type="button"
          onClick={() => setOpen(true)}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          variants={fadeUp}
          whileHover={{ scale: 1.01, transition: hoverSpring }}
          whileTap={tapPress}
          className="group relative mt-14 block aspect-21/9 w-full overflow-hidden rounded-2xl shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gilt"
          aria-label={`Play video: ${video.title}`}
        >
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            sizes="100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute inset-0 bg-brand-deep/40 transition-colors group-hover:bg-brand-deep/50" />
          <span className="absolute top-1/2 left-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-brand shadow-lg transition-transform duration-300 group-hover:scale-110 group-focus-visible:scale-110 sm:size-20">
            {/* Ring pulses outward from behind the button. */}
            <span className="absolute inset-0 animate-ping rounded-full bg-surface/40 [animation-duration:2.4s]" />
            <Play className="relative ml-1 size-6 fill-brand sm:size-8" aria-hidden="true" />
          </span>
        </m.button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton
          className="max-w-[calc(100%-2rem)] border-none bg-transparent p-0 shadow-none sm:max-w-3xl"
        >
          <DialogTitle className="sr-only">{video.title}</DialogTitle>
          <LenisScrollLock active={open} />
          {/*
            Lenis sets `iframe { pointer-events: none }` while scrolling, which
            would swallow clicks on the player. `data-lenis-allow-pointer` opts
            this subtree back in — see the rule in `globals.css`.
          */}
          <div
            data-lenis-allow-pointer
            className="aspect-video w-full overflow-hidden rounded-xl bg-ink"
          >
            {open && (
              <iframe
                src={`${video.url}?autoplay=1`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
