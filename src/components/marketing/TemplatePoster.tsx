import Image from "next/image";
import type { CSSProperties } from "react";
import {
  fontVars,
  paletteVars,
  posterInk,
  posterMetal,
  posterScrim,
  type WeddingTemplate,
} from "@/lib/templates";

/**
 * What a template actually looks like.
 *
 * This is the template's real hero composition, not an invented card: the same
 * photograph, the same `brand-deep` scrim, the same display face and the same
 * metal rule that `Hero` renders on the live site. Reproducing the composition
 * rather than mocking up a poster means a visitor is never shown something the
 * product cannot deliver — and it stays correct on its own when a palette
 * changes, because every value here comes from the same tokens the site uses.
 *
 * The arch is the platform's shape, not the template's; it frames the work the
 * way a mount frames a print.
 */
export function TemplatePoster({
  template,
  photo,
  brideName,
  groomName,
  className = "",
  priority = false,
}: {
  template: WeddingTemplate;
  photo: string;
  brideName: string;
  groomName: string;
  className?: string;
  priority?: boolean;
}) {
  /*
    The type over the scrim is the palette's pale colour, not `surface`.

    `surface` is only pale on the light-ground designs. On the 25 dark-ground
    colourways it is the near-black page colour, and setting the couple's names
    in it put dark type over a dark scrim — with the photograph showing through
    at 28% behind it in the upper half of the card.
  */
  const overlay = posterInk(template);
  const scrim = posterScrim(template);
  const metal = posterMetal(template);

  return (
    <div
      style={{ ...paletteVars(template), ...fontVars(template.fonts), "--poster-scrim": scrim } as CSSProperties}
      /* `@container` so everything below can size in `cqw`. See the note
         on the lockup. */
      className={`@container relative isolate overflow-hidden bg-[var(--surface)] ${className}`}
    >
      <Image
        src={photo}
        alt={`${template.name} — ${template.style} wedding website design`}
        fill
        sizes="(min-width: 1024px) 30vw, 80vw"
        priority={priority}
        className="object-cover"
      />

      {/* The scrim, in this template's own darkest ground — which is what
          makes each preview read as a different site rather than as the same
          photograph over and over. It was `brand-deep`, which is pale on every
          `midnight` colourway; see `posterScrim`. */}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--poster-scrim)] via-[color-mix(in_oklab,var(--poster-scrim)_62%,transparent)] to-[color-mix(in_oklab,var(--poster-scrim)_28%,transparent)]" />

      {/*
        The lockup scales with the card, in `cqw`, not with the viewport.

        It was `clamp(1.5rem, 3.4vw, 2.4rem)`, and `vw` is the width of the
        window — so one poster on the 3D turntable and one in the 380px grid
        got the same 24px names. On the turntable that is a third of the card
        width, and "Priya & Aman" broke onto three lines inside a frame it was
        never meant to fill. Measured across the ring: cards projecting at 311,
        253, 131 and 20px all rendered type at exactly 24px.

        `cqw` is a percent of *this poster's* width, so one set of numbers is
        correct at every size it is ever shown at. The clamps only stop it
        getting silly at the extremes.
      */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-[2.4cqw] px-[8cqw] text-center">
        <p
          className="text-[clamp(0.34rem,3cqw,0.78rem)] uppercase tracking-[0.34em]"
          style={{ color: overlay }}
        >
          We&rsquo;re getting married
        </p>
        <p
          className="font-display text-[clamp(0.8rem,12cqw,3.4rem)] leading-none"
          style={{ color: overlay }}
        >
          {brideName} <span style={{ color: metal }}>&</span> {groomName}
        </p>
        <span aria-hidden="true" className="flex items-center gap-[2cqw]">
          <span className="h-px w-[13cqw]" style={{ background: "var(--gilt)" }} />
          <span className="size-[1.6cqw] rotate-45" style={{ background: "var(--gilt)" }} />
          <span className="h-px w-[13cqw]" style={{ background: "var(--gilt)" }} />
        </span>
        <p
          className="text-[clamp(0.36rem,3.4cqw,0.9rem)] tracking-[0.26em]"
          style={{ color: overlay }}
        >
          14 FEBRUARY 2027
        </p>
      </div>
    </div>
  );
}
