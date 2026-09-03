"use client";

import { m } from "framer-motion";
import { GoldDivider } from "@/components/ui/ornaments/GoldDivider";
import { fadeUp, staggerContainer, revealViewport } from "@/lib/motion";
import type { FamiliesInfo } from "@/types/wedding";

interface FamilySectionProps {
  families: FamiliesInfo;
}

export function FamilySection({ families }: FamilySectionProps) {
  return (
    <section className="bg-surface py-20 sm:py-24">
      <m.div
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        variants={staggerContainer(0.12)}
        className="mx-auto flex max-w-2xl flex-col items-center gap-10 px-4 text-center sm:px-6"
      >
        <m.div variants={fadeUp} className="flex flex-col items-center gap-3">
          <h2 className="text-balance font-display text-3xl font-medium text-brand sm:text-4xl">
            With the Blessings of Our Families
          </h2>
          <GoldDivider />
        </m.div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-16">
          <m.div variants={fadeUp} className="flex flex-col gap-2">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-gilt-ink">
              {families.brideFamily.title}
            </p>
            <p className="font-display text-xl text-ink">{families.brideFamily.names}</p>
          </m.div>
          <m.div variants={fadeUp} className="flex flex-col gap-2">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-gilt-ink">
              {families.groomFamily.title}
            </p>
            <p className="font-display text-xl text-ink">{families.groomFamily.names}</p>
          </m.div>
        </div>
      </m.div>
    </section>
  );
}
