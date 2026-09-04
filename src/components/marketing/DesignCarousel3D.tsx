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
    176, not larger.

    The front of the ring sits at `translateZ(radius)`, and with a 1100px
    perspective that magnifies it by `1100 / (1100 - radius)`. Widening the
    card widens the radius, which pushes the front card closer to the eye and
    magnifies it faster than it grew: at 208 the front face projects 480×625
    inside a 480px-tall stage and its top and bottom are cut off. At 176 it
    projects 338×442, which clears a 32rem stage. A bigger card here has to be
    paid for in perspective, not in width.
  */
  const CARD_W = 176;
  /* The mount, per side. It is part of the card's outer size, so the
     seating radius and the vertical centring below both have to know about it
     — a mount added to the markup alone leaves every card hanging a few pixels
     low on the turntable. */
  const MOUNT = 8;
  const CARD_H = Math.round((CARD_W - MOUNT * 2) * (4 / 3) + MOUNT * 2);
  const radius = Math.round(CARD_W / 2 / Math.tan(Math.PI / count));

  return (
    <div
      className="relative flex h-[30rem] items-center justify-center sm:h-[34rem]"
      style={{ perspective: "1100px" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="relative h-full w-full motion-safe:animate-[cylinder-spin_64s_linear_infinite] motion-reduce:rotate-y-0"
        style={{
          transformStyle: "preserve-3d",
          animationPlayState: paused ? "paused" : "running",
        }}
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
              <div className="relative">
                {/* A pool of warmth under the card, lit only on approach. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-gold/25 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                />

                <div
                  style={{ padding: MOUNT }}
                  className="relative rounded-[1.45rem] bg-aubergine shadow-[0_0_0_1px_rgba(201,162,75,0.4),0_28px_50px_-24px_rgba(42,21,32,0.75)] transition-[transform,box-shadow] duration-500 ease-out group-hover:-translate-y-2.5 group-hover:shadow-[0_0_0_1px_rgba(201,162,75,0.8),0_0_28px_0_rgba(201,162,75,0.4),0_34px_60px_-24px_rgba(42,21,32,0.85)]"
                >
                  <div className="overflow-hidden rounded-[0.95rem] ring-1 ring-gold/35">
                    <TemplatePoster
                      template={t}
                      photo={photo}
                      brideName={brideName}
                      groomName={groomName}
                      priority={i < 4}
                      className="aspect-[3/4]"
                    />
                  </div>

                  {/*
                    A fixed specular sweep. The cylinder turns underneath it, so
                    the highlight travels across each card as it comes round —
                    the one thing that makes the mount read as a material with a
                    surface rather than as a flat rectangle.
                  */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-[1.45rem] bg-gradient-to-tr from-transparent via-white/12 to-transparent"
                  />
                  {/* Light from above, so the top edge of the mount catches. */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-1/3 rounded-t-[1.45rem] bg-gradient-to-b from-white/14 to-transparent"
                  />

                  {/*
                    The name plate sits ON the card, not under it.

                    Below the card it was laid out inside the rotated seat, so
                    the same perspective that magnifies the front face by ~1.9×
                    pushed the label right out of the stage and onto the caption
                    beneath it. Anything that has to stay within the card has to
                    be inside the card.
                  */}
                  <span className="pointer-events-none absolute inset-x-3 bottom-3 mx-auto w-fit max-w-[calc(100%-1.5rem)] truncate rounded-full bg-aubergine/85 px-3 py-1 text-[0.6rem] uppercase tracking-[0.18em] text-linen opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                    {t.name}
                  </span>
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
