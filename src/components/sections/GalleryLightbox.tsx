"use client";

import Image from "next/image";
import { m, useReducedMotion } from "framer-motion";
import type { PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { LenisScrollLock } from "@/components/ui/LenisScrollLock";
import { hoverSpring, tapPress } from "@/lib/motion";
import type { GalleryImage } from "@/types/wedding";

/** Past either threshold, the swipe counts as a page turn. */
const SWIPE_DISTANCE = 100;
const SWIPE_VELOCITY = 500;

interface GalleryLightboxProps {
  image: GalleryImage | null;
  /** Arrows and swiping are pointless with a single image. */
  hasSiblings: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function GalleryLightbox({
  image,
  hasSiblings,
  onClose,
  onPrev,
  onNext,
}: GalleryLightboxProps) {
  const prefersReducedMotion = useReducedMotion();
  const open = image !== null;

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (!hasSiblings) return;
    const { offset, velocity } = info;
    if (offset.x > SWIPE_DISTANCE || velocity.x > SWIPE_VELOCITY) onPrev();
    else if (offset.x < -SWIPE_DISTANCE || velocity.x < -SWIPE_VELOCITY) onNext();
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent
        showCloseButton
        /*
          Radix's default content is `-translate-x-1/2 -translate-y-1/2`. A
          transformed ancestor corrupts framer's layout projection, so the
          lightbox is laid out full-bleed with flex centring instead, and the
          zoom keyframes are dropped in favour of the shared-element flight.
        */
        className="inset-0 top-0 left-0 flex h-full max-h-none w-full max-w-none translate-x-0 translate-y-0 items-center justify-center border-none bg-transparent p-4 shadow-none ring-0 sm:max-w-none data-open:animate-none data-closed:animate-none"
      >
        <DialogTitle className="sr-only">{image?.alt ?? "Gallery image"}</DialogTitle>
        <LenisScrollLock active={open} />

        {image && (
          <m.div
            // Shared element: the thumbnail physically flies up into place.
            layoutId={`gal-${image.src}`}
            drag={hasSiblings && !prefersReducedMotion ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="relative aspect-[4/3] w-full max-w-3xl cursor-grab overflow-hidden rounded-xl bg-charcoal active:cursor-grabbing"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="90vw"
              draggable={false}
              className="object-contain"
            />
          </m.div>
        )}

        {image && hasSiblings && (
          <>
            <m.button
              type="button"
              onClick={onPrev}
              aria-label="Previous image"
              /* Centring lives in framer's `y`, not `-translate-y-1/2`: any
                 `whileHover` writes a full inline `transform` and would drop
                 the class, making the button jump on hover. */
              style={{ y: "-50%" }}
              whileHover={{ scale: 1.12, x: -2, transition: hoverSpring }}
              whileTap={tapPress}
              className="absolute top-1/2 left-4 rounded-full bg-ivory/80 p-2 text-wine transition-colors hover:bg-ivory focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <ChevronLeft className="size-5" />
            </m.button>
            <m.button
              type="button"
              onClick={onNext}
              aria-label="Next image"
              style={{ y: "-50%" }}
              whileHover={{ scale: 1.12, x: 2, transition: hoverSpring }}
              whileTap={tapPress}
              className="absolute top-1/2 right-4 rounded-full bg-ivory/80 p-2 text-wine transition-colors hover:bg-ivory focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <ChevronRight className="size-5" />
            </m.button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
