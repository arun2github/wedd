"use client";

import { useState, type CSSProperties } from "react";
import { fontVars, getTemplate, paletteVars, type WeddingTemplate } from "@/lib/templates";

/**
 * The page's thesis, as an object you can almost pick up.
 *
 * An Indian wedding invitation is not a card — it is a *set*. A main card, then
 * one insert per function: haldi, mehendi, the vivah, the reception. They come
 * stacked in an envelope and you fan them out in your hands. Every other
 * wedding-site builder gives a couple one card for one day, and that single
 * fact is the whole sales argument; showing the set makes it something a
 * visitor sees in the first second rather than something they have to read.
 *
 * Built in CSS 3D rather than WebGL on purpose. The cards carry live type in
 * each template's real display face and palette, because that is the thing
 * being sold — in WebGL the words become textures, stop being real type, and
 * fall outside the token system that repaints them. Perspective transforms give
 * the depth without any of that, and without a renderer in the bundle of a page
 * that has to open on Indian mobile data.
 *
 * The fan is a plain transform, always applied. Motion is an enhancement layered
 * on top by one keyframe, never the thing that makes the cards visible.
 */

interface Ceremony {
  name: string;
  date: string;
  time: string;
  venue: string;
  /** Which palette role paints this card — the same mapping `EventTicket` uses,
   *  so a ceremony keeps its colour from storefront to published invitation. */
  role: "rite-1" | "rite-2" | "brand" | "rite-3";
}

interface Props {
  templates: Pick<WeddingTemplate, "id" | "name" | "tradition">[];
  ceremonies: Ceremony[];
  brideName: string;
  groomName: string;
  weddingDate: string;
}

/** Short date for a card corner: "10 FEB". */
function cardDate(iso: string) {
  const d = new Date(iso);
  return `${d.getDate()} ${d.toLocaleString("en-IN", { month: "short" }).toUpperCase()}`;
}

export function InvitationSet({ templates, ceremonies, brideName, groomName, weddingDate }: Props) {
  const [index, setIndex] = useState(0);
  const [lifted, setLifted] = useState<number | null>(null);

  const template = getTemplate(templates[index]?.id);
  const theme = { ...paletteVars(template), ...fontVars(template.fonts) } as CSSProperties;

  /* The main card sits at the centre of the fan, the way the set is actually
     held — ceremonies falling away either side in the order they happen. */
  const cards: (Ceremony | null)[] = [
    ...ceremonies.slice(0, 2),
    null,
    ...ceremonies.slice(2),
  ];
  const centre = 2;

  return (
    <div className="flex flex-col gap-6">
      <div
        style={theme}
        /* One vanishing point for the whole set, so it reads as a single object
           in space rather than five separately-tilted rectangles. */
        /*
          The fan's spread and tilt are CSS variables, not React state.

          They were state driven by `matchMedia`, and on a phone the listener
          did not apply before paint — the set overflowed the viewport and the
          whole page scrolled sideways. Breakpoints are the browser's job;
          expressing them in CSS means the geometry is correct on the first
          frame and cannot race hydration.
        */
        className="relative flex h-[22rem] items-center justify-center [--fan:34px] [--tilt:4deg] [perspective:1500px] sm:h-[26rem] sm:[--fan:60px] sm:[--tilt:5.5deg] md:h-[28rem] md:[--fan:82px] md:[--tilt:6.5deg]"
      >
        {/* The set is resting on something. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-10 h-6 w-[70%] rounded-[50%] bg-black/50 blur-2xl"
        />

        {cards.map((ceremony, i) => {
          const offset = i - centre;
          const isMain = ceremony === null;
          const isLifted = lifted === i;
          const ty = Math.abs(offset) * 10 - (isLifted ? 20 : 0);
          const tz = isLifted ? 70 : -Math.abs(offset) * 46;
          /*
            A fanned card only shows one end of itself, and which end depends on
            which side of the centre it sits. Cards to the right are covered on
            their left edge, so their text moves to the right — the same reason
            playing cards carry their index in opposite corners.
          */
          const showsRightEdge = offset > 0;

          return (
            <article
              key={isMain ? "main" : ceremony.name}
              onMouseEnter={() => setLifted(i)}
              onMouseLeave={() => setLifted(null)}
              className="absolute w-32 origin-bottom transition-transform duration-500 ease-out sm:w-36 md:w-40"
              style={{
                transform: `translate3d(calc(var(--fan) * ${offset}), ${ty}px, ${tz}px) rotate(calc(var(--tilt) * ${offset}))`,
                zIndex: isLifted ? 50 : 10 - Math.abs(offset),
              }}
            >
              {/*
                The entrance lives on an inner element so the fan transform above
                is never overwritten. Its `from` state is the exact inverse of
                this card's place in the fan, so all five begin stacked in the
                middle and unwind outwards.
              */}
              <div
                className="motion-safe:[animation:deal-in_0.75s_cubic-bezier(0.22,1,0.36,1)_backwards]"
                style={{
                  ["--deal-x" as string]: `calc(var(--fan) * ${-offset})`,
                  ["--deal-r" as string]: `calc(var(--tilt) * ${-offset})`,
                  animationDelay: `${0.15 + Math.abs(offset) * 0.09}s`,
                }}
              >
                <div
                  className="overflow-hidden rounded-xl border transition-colors duration-500"
                  style={{
                    background: "var(--surface)",
                    /* The card's own metal, not a neutral hairline. A dark
                       template's cards sit on a dark storefront and would
                       otherwise dissolve into it; a gilt edge is how a real
                       printed card separates from whatever it lies on, and it
                       reads on cream and on emerald alike. */
                    borderColor: "color-mix(in oklab, var(--gilt) 45%, transparent)",
                    /* Two shadows: one cast on the ground, one hairline directly
                       under the face so the card reads as having thickness. */
                    boxShadow:
                      "0 20px 40px -14px rgba(0,0,0,0.65), 0 2px 0 0 color-mix(in oklab, var(--ink) 16%, transparent)",
                  }}
                >
                  {isMain ? (
                    <div className="flex aspect-[5/7] flex-col items-center justify-center gap-2.5 px-4 text-center">
                      <p className="text-[0.5rem] uppercase tracking-[0.26em]" style={{ color: "var(--ink-soft)" }}>
                        Together with our families
                      </p>
                      <p className="font-display text-xl leading-tight sm:text-2xl" style={{ color: "var(--brand)" }}>
                        {brideName}
                        <span className="px-1" style={{ color: "var(--gilt)" }}>&</span>
                        {groomName}
                      </p>
                      <span aria-hidden="true" className="flex items-center gap-1.5">
                        <span className="h-px w-6" style={{ background: "var(--gilt)" }} />
                        <span className="size-1 rotate-45" style={{ background: "var(--gilt)" }} />
                        <span className="h-px w-6" style={{ background: "var(--gilt)" }} />
                      </span>
                      <p className="text-[0.55rem] tracking-[0.2em]" style={{ color: "var(--ink-soft)" }}>
                        {weddingDate}
                      </p>
                    </div>
                  ) : (
                    <div
                      className={`flex aspect-[5/7] flex-col justify-between px-3.5 py-4 ${
                        showsRightEdge ? "items-end text-right" : "items-start text-left"
                      }`}
                    >
                      {/* Each function gets its own ink, the way a printed set does. */}
                      <span
                        aria-hidden="true"
                        className="h-1 w-7 rounded-full"
                        style={{ background: `var(--${ceremony.role})` }}
                      />
                      <div>
                        <p className="text-[0.5rem] uppercase tracking-[0.22em]" style={{ color: "var(--ink-soft)" }}>
                          {cardDate(ceremony.date)}
                        </p>
                        {/*
                          The ritual's own name, not the section heading — an
                          insert is printed "Haldi", not "Haldi Ceremony". It
                          also has to survive being half-covered by the card in
                          front of it, which is what a fanned set does.
                        */}
                        <p
                          className="mt-1 font-display text-base leading-tight sm:text-lg"
                          style={{ color: `var(--${ceremony.role})` }}
                        >
                          {ceremony.name.split(" ")[0]}
                        </p>
                      </div>
                      <p className="text-[0.6rem]" style={{ color: "var(--ink-soft)" }}>{ceremony.time}</p>
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div>
        <p className="mb-2 text-center text-xs uppercase tracking-[0.2em] text-mist">
          {template.name} · for {template.tradition} weddings
        </p>
        <div role="tablist" aria-label="Preview a design" className="flex flex-wrap justify-center gap-1.5">
          {templates.map((t, i) => {
            const p = getTemplate(t.id).palette;
            const selected = i === index;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={selected}
                onClick={() => setIndex(i)}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marigold ${
                  selected
                    ? "border-marigold/70 bg-marigold/15 text-paper"
                    : "border-paper/15 text-mist hover:border-paper/35 hover:text-paper"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="size-3 rounded-full ring-1 ring-black/25"
                  style={{ background: p.surface, boxShadow: `inset 0 0 0 3px ${p.brand}` }}
                />
                {t.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
