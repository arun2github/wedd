"use client";

import { m } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeUp, revealViewport } from "@/lib/motion";
import { GoldDivider } from "@/components/ui/ornaments/GoldDivider";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <m.div
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
      variants={fadeUp}
      className={cn(
        "flex flex-col gap-3",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow && (
        <span className="text-xs font-medium tracking-[0.25em] text-gold uppercase">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-wine text-balance">
        {title}
      </h2>
      <GoldDivider />
      {description && (
        <p className="max-w-xl text-charcoal-muted text-balance">{description}</p>
      )}
    </m.div>
  );
}
