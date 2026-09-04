"use client";

import { useMemo, useState } from "react";
import {
  DESIGN_TIERS,
  DESIGN_TIER_ORDER,
  discountPct,
  type DesignTierId,
  type WeddingTemplate,
} from "@/lib/templates";
import { inr } from "@/lib/pricing";
import { TemplateCard } from "./TemplateCard";
import { Reveal } from "./Reveal";

/**
 * The catalogue, shown once.
 *
 * Previously the designs appeared three times on one page — a filtered grid, a
 * collections list, and feature rows illustrated with the same cards. They
 * appear here and nowhere else.
 *
 * Each card carries the two actions a browsing couple actually wants, and no
 * others: look at it working, or take it. "Learn more" would be a third door
 * to the same room.
 *
 * Banded into the three tiers, quietest first, so the page reads as a ladder
 * rather than as nineteen equal things. A band with nothing in it renders
 * nothing at all — which is what stops an orphan heading appearing the moment
 * a filter empties a tier.
 */

type TraditionId = WeddingTemplate["tradition"];

const TRADITIONS: { id: TraditionId; label: string }[] = [
  { id: "hindu", label: "Hindu" },
  { id: "christian", label: "Christian" },
  { id: "muslim", label: "Muslim" },
  { id: "secular", label: "Secular" },
];

/**
 * A filter chip, in glass.
 *
 * `backdrop-blur` only shows if there is something behind it to blur, so the
 * bar it lives in carries its own colour blooms — on a flat linen page glass
 * over nothing is just a pale rectangle. The bar is sticky under the header
 * for the same reason: the cards scrolling beneath are what the blur is for.
 *
 * Selected state is a filled chip rather than a heavier blur. Two glass states
 * differing only in opacity is not a state a person can see.
 */
function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-4 py-1.5 text-[0.72rem] uppercase tracking-[0.16em] backdrop-blur-md transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine ${
        active
          ? "border-wine/25 bg-wine text-linen shadow-sm"
          : "border-white/60 bg-white/45 text-soft hover:border-wine/30 hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

export function TemplateGrid({
  templates, photo, brideName, groomName,
}: {
  templates: WeddingTemplate[];
  photo: string;
  brideName: string;
  groomName: string;
}) {
  const [tier, setTier] = useState<DesignTierId | "all">("all");
  const [tradition, setTradition] = useState<TraditionId | "all">("all");

  const shown = useMemo(
    () =>
      templates.filter(
        (t) =>
          (tier === "all" || t.tier === tier) &&
          (tradition === "all" || t.tradition === tradition),
      ),
    [templates, tier, tradition],
  );

  return (
    <section id="designs" className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
      <Reveal className="max-w-2xl">
        <p className="text-[0.68rem] uppercase tracking-[0.32em] text-soft">The collection</p>
        <h2 className="mt-4 font-display text-[clamp(2.6rem,6vw,5rem)] font-light leading-[1.02] tracking-[-0.02em]">
          Drawn one at a time.
        </h2>
        <p className="mt-5 max-w-md leading-relaxed text-soft">
          Each drawn from the tradition it is for. Look at any of them running
          with real content before you decide.
        </p>
      </Reveal>

      {/* `top-[4.25rem]` clears the sticky header, which is `py-4` on a single
          row of controls. */}
      <div className="sticky top-[4.25rem] z-30 -mx-5 mt-10 px-5 py-3 sm:-mx-8 sm:px-8">
        <div className="relative overflow-hidden rounded-[1.5rem] border border-white/55 bg-white/40 px-4 py-3.5 shadow-[0_10px_30px_-18px_rgba(42,21,32,0.4)] backdrop-blur-xl">
          {/* What the glass has to refract. Without these the bar is flat. */}
          <span aria-hidden="true" className="pointer-events-none absolute -left-10 -top-12 size-40 rounded-full bg-peach/70 blur-2xl" />
          <span aria-hidden="true" className="pointer-events-none absolute -bottom-14 right-6 size-44 rounded-full bg-gold/25 blur-2xl" />
          <span aria-hidden="true" className="pointer-events-none absolute -bottom-10 left-1/3 size-36 rounded-full bg-wine/12 blur-2xl" />

          <div className="relative flex flex-wrap items-center gap-x-2 gap-y-2.5">
            <Chip active={tier === "all" && tradition === "all"} onClick={() => { setTier("all"); setTradition("all"); }}>
              All
            </Chip>

            <span aria-hidden="true" className="mx-1 h-5 w-px bg-ink/12" />

            {DESIGN_TIER_ORDER.map((id) => (
              <Chip key={id} active={tier === id} onClick={() => setTier(tier === id ? "all" : id)}>
                {DESIGN_TIERS[id].name}
              </Chip>
            ))}

            <span aria-hidden="true" className="mx-1 h-5 w-px bg-ink/12" />

            {TRADITIONS.map((t) => (
              <Chip
                key={t.id}
                active={tradition === t.id}
                onClick={() => setTradition(tradition === t.id ? "all" : t.id)}
              >
                {t.label}
              </Chip>
            ))}

            <p aria-live="polite" className="ml-auto pl-2 text-xs text-soft">
              {shown.length} {shown.length === 1 ? "design" : "designs"}
            </p>
          </div>
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="mt-16 text-center leading-relaxed text-soft">
          Nothing in the catalogue matches both of those yet. Clear one and the
          rest come back.
        </p>
      ) : (
        DESIGN_TIER_ORDER.map((tierId) => {
          const inTier = shown.filter((t) => t.tier === tierId);
          if (inTier.length === 0) return null;
          const band = DESIGN_TIERS[tierId];

          return (
            <div key={tierId} className="mt-16 first:mt-12">
              <Reveal className="flex flex-wrap items-baseline gap-x-5 gap-y-2 border-t border-ink/10 pt-8">
                <h3 className="font-display text-[clamp(1.7rem,3.2vw,2.4rem)] font-light tracking-[-0.02em]">
                  {band.name}
                </h3>
                {/* The band heading carries the price because the ladder is a
                    price ladder — reading it design by design makes you do the
                    arithmetic the bands already did. */}
                <p className="flex items-baseline gap-2 text-[0.65rem] uppercase tracking-[0.16em]">
                  <s className="text-soft/80">{inr(band.listPrice)}</s>
                  <span className="rounded-full bg-peach px-3 py-1 text-wine">
                    {inr(band.price)} one-time
                  </span>
                  {discountPct(band.listPrice, band.price) > 0 && (
                    <span className="rounded-full bg-wine px-2.5 py-1 text-linen">
                      {discountPct(band.listPrice, band.price)}% off
                    </span>
                  )}
                </p>
                <p className="max-w-md text-sm leading-relaxed text-soft">{band.line}</p>
              </Reveal>

              <div className="mt-10 grid gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                {inTier.map((t, i) => (
                  <Reveal key={t.id} delay={(i % 3) * 0.08}>
                    <TemplateCard
                      template={t}
                      photo={photo}
                      brideName={brideName}
                      groomName={groomName}
                      /* Only the first band's first row is above the fold. */
                      priority={tierId === DESIGN_TIER_ORDER[0] && i < 3}
                    />
                  </Reveal>
                ))}
              </div>
            </div>
          );
        })
      )}
    </section>
  );
}
