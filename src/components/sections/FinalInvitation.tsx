"use client";

import { useRef } from "react";
import Image from "next/image";
import { m } from "framer-motion";
import { GoldDivider } from "@/components/ui/ornaments/GoldDivider";
import { fadeUp, staggerContainer, revealViewport } from "@/lib/motion";
import { useParallax } from "@/lib/motion-hooks";
import { formatWeddingDate } from "@/lib/format-date";
import type { CoupleInfo } from "@/types/wedding";

interface FinalInvitationProps {
  couple: CoupleInfo;
  weddingDate: string;
}

export function FinalInvitation({ couple, weddingDate }: FinalInvitationProps) {
  const sectionRef = useRef<HTMLElement>(null);
  // Deepest parallax on the page — this is the closing beat.
  const y = useParallax(sectionRef, 100);

  const formattedDate = formatWeddingDate(weddingDate, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-wine-dark py-24"
    >
      {/* Over-sized so the translate never exposes a gap at the section edge. */}
      <m.div style={{ y }} className="absolute -inset-y-[12%] inset-x-0">
        <Image src={couple.heroPhoto} alt="" fill sizes="100vw" className="object-cover" />
      </m.div>
      <div className="absolute inset-0 bg-wine-dark/75" />

      <m.div
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        variants={staggerContainer(0.15)}
        className="relative z-10 flex flex-col items-center gap-5 px-6 text-center text-ivory"
      >
        <m.p
          variants={fadeUp}
          className="max-w-md text-balance font-display text-2xl leading-snug sm:text-3xl"
        >
          We can&apos;t wait to celebrate with you
        </m.p>
        <m.div variants={fadeUp}>
          <GoldDivider className="text-gold-light" />
        </m.div>
        <m.p variants={fadeUp} className="font-script text-4xl text-gold-light sm:text-5xl">
          {couple.brideName} &amp; {couple.groomName}
        </m.p>
        <m.p variants={fadeUp} className="text-sm tracking-[0.2em] text-ivory/80 uppercase">
          {formattedDate}
        </m.p>
      </m.div>
    </section>
  );
}
