"use client";

import Link from "next/link";
import { useState } from "react";
import {
  DESIGN_TIERS,
  discountPct,
  getTemplate,
  listPriceOf,
  priceOf,
  type WeddingTemplate,
} from "@/lib/templates";
import { inr } from "@/lib/pricing";
import { colorwaysOf } from "@/lib/colorways";
import { TemplatePoster } from "./TemplatePoster";

/**
 * One design, with its colourways underneath it.
 *
 * The swatches repaint the preview in place rather than navigating, because
 * choosing a colour is a comparison and a page load breaks a comparison. The
 * chosen colourway rides along to the detail page in the query string, so the
 * design a couple was looking at is the one they land on.
 *
 * Only the palette changes. The architecture, the layout and the faces are the
 * design — which is why three colourways cost nothing to maintain and why
 * switching one never moves a word of a couple's content.
 *
 * The tier chip sits on the artwork and the price sits with the name. Both
 * come from `DESIGN_TIERS`, so a design cannot carry a badge that disagrees
 * with what it costs — and a price change is one number, not nineteen.
 */
export function TemplateCard({
  template, photo, brideName, groomName, priority = false,
}: {
  template: WeddingTemplate;
  photo: string;
  brideName: string;
  groomName: string;
  priority?: boolean;
}) {
  const ways = colorwaysOf(template.id);
  const [wayId, setWayId] = useState(ways[0]?.id ?? "signature");
  const shown = getTemplate(template.id, wayId);
  const tier = DESIGN_TIERS[template.tier];
  const price = priceOf(template);
  const listPrice = listPriceOf(template);
  const off = discountPct(listPrice, price);
  const href = `/templates/${template.id}${wayId !== "signature" ? `?c=${wayId}` : ""}`;

  return (
    <article className="group">
      <Link href={href} className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-aubergine">
        <div className="relative transition-transform duration-700 ease-out group-hover:-translate-y-1.5">
          <TemplatePoster
            template={shown}
            photo={photo}
            brideName={brideName}
            groomName={groomName}
            priority={priority}
            className="rounded-xl aspect-[3/4]"
          />

          {/*
            Glass, not a solid pill. Nineteen palettes pass under this chip
            and six of them are near-black, so a fixed light or dark fill is
            unreadable on a third of the catalogue either way. A blurred sample
            of whatever is behind it, with linen type over an aubergine veil,
            reads on all of them.

            The veil is 70%, not 55%. At 55% the chip measured 3.6:1 against
            the brightest ground a photograph could put under it — the top of
            the poster is where the scrim is thinnest, which is exactly where
            this sits. At 70% the same worst case is 6:1.
          */}
          <span className="pointer-events-none absolute left-3 top-3 rounded-full border border-linen/25 bg-aubergine/70 px-2.5 py-1 text-[0.58rem] uppercase tracking-[0.18em] text-linen backdrop-blur-md">
            {tier.name}
          </span>
        </div>
      </Link>

      <div className="mt-5">
        <div className="flex items-baseline justify-between gap-3">
          <h4 className="font-display text-2xl font-light">{template.name}</h4>
          {/*
            The struck price is marked up as `<s>`, not styled with a
            line-through class. A screen reader announces the deletion; a
            strike drawn in CSS reads out as a second, equally valid price —
            which on a page with two numbers on it is the one thing that must
            not happen.
          */}
          <p className="flex shrink-0 items-baseline gap-2">
            <s className="text-sm text-soft/80">{inr(listPrice)}</s>
            <span className="font-display text-xl font-light text-wine">
              {inr(price)}
            </span>
          </p>
        </div>
        <div className="mt-1.5 flex items-baseline justify-between gap-3">
          <p className="text-[0.6rem] uppercase tracking-[0.22em] text-soft">{template.style}</p>
          <span className="flex shrink-0 items-baseline gap-2 text-[0.6rem] uppercase tracking-[0.18em]">
            {off > 0 && (
              <span className="rounded-full bg-wine px-2 py-0.5 text-linen">
                {off}% off
              </span>
            )}
            {/* Said next to the number rather than in a footnote nobody
                reaches: this is the whole cost, not a deposit or a yearly fee. */}
            <span className="text-soft">One-time</span>
          </span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-soft">{template.blurb}</p>

        {ways.length > 1 && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-[0.6rem] uppercase tracking-[0.2em] text-soft">Colour</span>
            <div role="radiogroup" aria-label={`Colourway for ${template.name}`} className="flex gap-1.5">
              {ways.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  role="radio"
                  aria-checked={w.id === wayId}
                  aria-label={w.name}
                  title={w.name}
                  onClick={() => setWayId(w.id)}
                  className={`size-6 rounded-full transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aubergine ${
                    w.id === wayId ? "scale-110 ring-2 ring-ink ring-offset-2 ring-offset-linen" : "ring-1 ring-ink/20 hover:scale-105"
                  }`}
                  style={{
                    background: w.palette.surface,
                    boxShadow: `inset 0 0 0 5px ${w.palette.brand}`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <Link
            href={`/templates/${template.id}/demo`}
            className="flex-1 rounded-xl border border-ink/15 px-4 py-2.5 text-center text-sm transition-colors hover:border-ink/40"
          >
            View demo
          </Link>
          <Link
            href={href}
            className="flex-1 rounded-xl bg-aubergine px-4 py-2.5 text-center text-sm font-medium text-linen transition-colors hover:bg-wine"
          >
            Buy now
          </Link>
        </div>
      </div>
    </article>
  );
}
