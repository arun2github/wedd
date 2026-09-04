"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import type { WeddingTemplate } from "@/lib/templates";
import { TemplatePoster } from "./TemplatePoster";

/**
 * Twelve designs standing on a turntable.
 *
 * Real 3D: the cards sit on the surface of a cylinder, each rotated to its own
 * angle and pushed out along Z, inside a shared `perspective`. They are not
 * scaled to fake depth — the browser is doing the projection, which is why the
 * far side genuinely turns away instead of just getting smaller.
 *
 * `backface-visibility: hidden` retires each card as it passes behind the
 * axis. Without it the back half shows through mirrored, which reads as a bug
 * rather than as depth.
 *
 * The rotation is a CSS keyframe, so it survives a busy main thread and starts
 * before hydration; hovering pauses it, because a visitor who has stopped to
 * look at one design should not have it rotate away from them.
 */
export function DesignCarousel3D({
  templates, photo, brideName, groomName,
}: {
  templates: WeddingTemplate[];
  photo: string;
  brideName: string;
  groomName: string;
}) {
  const [paused, setPaused] = useState(false);
  const count = templates.length;
  const step = 360 / count;

  /* Radius that seats `count` cards of this width around the cylinder without
     them intersecting: r = (w / 2) / tan(π / count). */
  /*
    Card width and perspective are one decision, not two.

    The front of the ring sits at `translateZ(radius)`, so the browser
    magnifies it by `P / (P - radius)`. A short perspective magnifies the front
    card far harder than its neighbours — at P=1100 with a 176px card, the
    front projects 338px against 223px two seats along, a 1.51× step that reads
    as one card zoomed in and the rest pushed back.

    Lengthening the perspective flattens that, but it also shrinks the front
    card (338 → 226 at P=2400), so the two have to move together: a longer
    perspective for an even ring, a wider card to keep the front one large.

    Measured across the ring at these numbers — 339, 313, 244, 153 — the step
    to the neighbour is 1.08× and to the next 1.39×, against 1.11× and 1.51×
    before. Still clearly a cylinder; no longer one hero and a row of extras.
  */
  const CARD_W = 232;
  /* The mount, per side. It is part of the card's outer size, so the
     seating radius and the vertical centring below both have to know about it
     — a mount added to the markup alone leaves every card hanging a few pixels
     low on the turntable. */
  const MOUNT = 5;
  const CARD_H = Math.round((CARD_W - MOUNT * 2) * (4 / 3) + MOUNT * 2);
  const radius = Math.round(CARD_W / 2 / Math.tan(Math.PI / count));

  /*
    The stage is sized from the geometry, not guessed in `rem`.

    The front of the ring sits at `translateZ(radius)`, so the browser scales it
    by `P / (P - radius)` — 1.92× at these numbers. A hand-picked stage height
    is a number that happens to clear that today and silently crops the cards
    the moment anyone changes the card width, the count or the perspective,
    because the section clips what overflows. Deriving it means the stage
    cannot be too short.

    `LIFT` is the hover translate plus the shadow beneath it, which are outside
    the projected box and would otherwise be the thing that gets cut.
  */
  const PERSPECTIVE = 2200;
  /* Shared by the ring and by each card's focus falloff — they have to be the
     same length or the lit card drifts away from the front over time. */
  const SPIN_SECONDS = 64;
  const LIFT = 34;
  const frontScale = PERSPECTIVE / (PERSPECTIVE - radius);
  const stageHeight = Math.ceil(CARD_H * frontScale) + LIFT * 2;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ height: stageHeight, perspective: `${PERSPECTIVE}px` }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="relative h-full w-full motion-safe:animate-[cylinder-spin_var(--spin)_linear_infinite] motion-reduce:rotate-y-0"
        style={{
          transformStyle: "preserve-3d",
          animationPlayState: paused ? "paused" : "running",
          "--spin": `${SPIN_SECONDS}s`,
        } as CSSProperties}
      >
        {templates.map((t, i) => (
          <div
            key={t.id}
            className="absolute left-1/2 top-1/2"
            style={{
              width: CARD_W,
              marginLeft: -CARD_W / 2,
              marginTop: -CARD_H / 2,
              transform: `rotateY(${i * step}deg) translateZ(${radius}px)`,
              backfaceVisibility: "hidden",
              transformStyle: "preserve-3d",
            } as CSSProperties}
          >
            <Link
              href={`/templates/${t.id}`}
              className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            >
              {/*
                The card is a framed print, not a bare image.

                An aubergine mount — the same ground the dark band further
                down this page stands on — with a gold hairline holding it off
                the artwork. The poster inside stays the template's own, and is
                untouched: the frame may flatter it but must never stand in
                for it.

                Dark, not metal. Nineteen palettes come round on this ring, and
                a light frame competes with every one of them; a dark one reads
                as a mount and lets each poster be the brightest thing in its
                own card.

                The lift is box-shadow, not the animated `GlowBorder` the
                button uses. Nineteen cards are on screen at once here, and
                nineteen spinning conic gradients is nineteen rAF loops and
                nineteen large composited layers — the one place on this page
                where the cheap version is the right one.

                `gold`, not `gilt`. `gilt` resolves through `--gilt`, which
                only exists inside a template's own palette scope — out here on
                the marketing page it is undefined, and the rule would simply
                not draw.
              */}
              {/*
                The size falloff rides here, on the wrapper, so it never fights
                the mount's hover translate below it — and on the same clock and
                the same delay as the veil, so a card is at its largest exactly
                when it is at its brightest.
              */}
              <div
                style={{
                  animationDelay: `${(i / count - 1) * SPIN_SECONDS}s`,
                  animationPlayState: paused ? "paused" : "running",
                }}
                className="relative motion-safe:animate-[card-shrink_var(--spin)_linear_infinite]"
              >
                {/* A pool of warmth under the card, lit only on approach. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-4 rounded-[2.4rem] bg-gold/25 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                />

                <div
                  style={{ padding: MOUNT }}
                  className="relative rounded-[1.75rem] bg-aubergine shadow-[0_0_0_1px_rgba(201,162,75,0.4),0_10px_20px_-12px_rgba(42,21,32,0.45),0_40px_80px_-30px_rgba(42,21,32,0.6)] transition-[translate,box-shadow] duration-500 ease-out group-hover:-translate-y-2.5 group-hover:shadow-[0_0_0_1px_rgba(201,162,75,0.8),0_0_30px_0_rgba(201,162,75,0.35),0_14px_26px_-12px_rgba(42,21,32,0.5),0_48px_92px_-30px_rgba(42,21,32,0.7)]"
                >
                  <div className="@container relative overflow-hidden rounded-[1.45rem] ring-1 ring-gold/55">
                    <TemplatePoster
                      template={t}
                      photo={photo}
                      brideName={brideName}
                      groomName={groomName}
                      priority={i < 4}
                      className="aspect-[3/4]"
                    />

                    {/*
                      The card's own foot: the design's name, and the door in.

                      It lives inside the frame rather than under the card. Laid
                      out below the card it sits in the rotated seat, and the
                      same perspective that magnifies the front face by ~1.9×
                      pushes it clean out of the stage and onto the caption
                      beneath. Anything that must stay on the card has to be
                      drawn on the card.

                      Sized in `cqw` against the frame, like the poster above
                      it, so the whole composition holds together at whatever
                      size the ring is built at — and a `span`, not a button,
                      because the entire card is already one link and an
                      interactive element inside a link is a broken control.
                    */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-aubergine via-aubergine/85 to-transparent px-[6cqw] pb-[5cqw] pt-[14cqw] text-center">
                      <p className="truncate text-[3.4cqw] uppercase tracking-[0.26em] text-gold">
                        {t.name}
                      </p>
                      <span className="mt-[3cqw] inline-flex items-center gap-[2cqw] rounded-full border border-linen/45 px-[5cqw] py-[2.2cqw] text-[3.7cqw] uppercase tracking-[0.16em] text-linen transition-colors duration-500 group-hover:border-gold group-hover:text-gold">
                        View invitation
                        <span aria-hidden="true">&rarr;</span>
                      </span>
                    </div>
                  </div>

                  {/*
                    A fixed specular sweep. The cylinder turns underneath it, so
                    the highlight travels across each card as it comes round —
                    the one thing that makes the mount read as a material with a
                    surface rather than as a flat rectangle.
                  */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-[1.75rem] bg-gradient-to-tr from-transparent via-white/12 to-transparent"
                  />
                  {/* Light from above, so the top edge of the mount catches. */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-1/3 rounded-t-[1.75rem] bg-gradient-to-b from-white/14 to-transparent"
                  />

                  {/*
                    Focus falloff. Lit at the front, veiled as it turns away.

                    Driven by `animation-delay`, not by state: the ring turns at
                    a constant rate, so the moment this card faces front is
                    arithmetic. Sharing `--spin` with the ring is what keeps the
                    two from drifting apart over a long session.
                  */}
                  <span
                    aria-hidden="true"
                    style={{
                      animationDelay: `${(i / count - 1) * SPIN_SECONDS}s`,
                      animationPlayState: paused ? "paused" : "running",
                    }}
                    className="pointer-events-none absolute inset-0 rounded-[1.75rem] bg-aubergine opacity-0 motion-safe:animate-[card-recede_var(--spin)_linear_infinite]"
                  />

                </div>
              </div>

            </Link>
          </div>
        ))}
      </div>

      {/* The turntable it stands on — a soft ellipse of shadow, so the cards
          are on something rather than floating in nothing. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-6 h-10 w-[60%] rounded-[50%] bg-ink/12 blur-2xl"
      />
    </div>
  );
}
