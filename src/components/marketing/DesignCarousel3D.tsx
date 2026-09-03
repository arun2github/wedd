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
  const CARD_W = 176;
  const radius = Math.round(CARD_W / 2 / Math.tan(Math.PI / count));

  return (
    <div
      className="relative flex h-[26rem] items-center justify-center sm:h-[30rem]"
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
              marginTop: -(CARD_W * 1.34) / 2,
              transform: `rotateY(${i * step}deg) translateZ(${radius}px)`,
              backfaceVisibility: "hidden",
              transformStyle: "preserve-3d",
            } as CSSProperties}
          >
            <Link
              href={`/templates/${t.id}`}
              className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            >
              <TemplatePoster
                template={t}
                photo={photo}
                brideName={brideName}
                groomName={groomName}
                priority={i < 4}
                className="rounded-xl aspect-[3/4] shadow-2xl ring-1 ring-black/10"
              />
              <p className="mt-3 text-center text-[0.68rem] uppercase tracking-[0.24em] text-soft opacity-0 transition-opacity group-hover:opacity-100">
                {t.name}
              </p>
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
