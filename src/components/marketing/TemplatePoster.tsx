import Image from "next/image";
import type { CSSProperties } from "react";
import { fontVars, paletteVars, type WeddingTemplate } from "@/lib/templates";

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
  return (
    <div
      style={{ ...paletteVars(template), ...fontVars(template.fonts) } as CSSProperties}
      className={`relative isolate overflow-hidden bg-[var(--surface)] ${className}`}
    >
      <Image
        src={photo}
        alt={`${template.name} — ${template.style} wedding website design`}
        fill
        sizes="(min-width: 1024px) 30vw, 80vw"
        priority={priority}
        className="object-cover"
      />

      {/* The live hero's own scrim, in this template's colour — which is what
          makes each preview read as a different site rather than as the same
          photograph twelve times. */}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-deep)] via-[color-mix(in_oklab,var(--brand-deep)_62%,transparent)] to-[color-mix(in_oklab,var(--brand-deep)_28%,transparent)]" />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-[0.5rem] uppercase tracking-[0.34em] text-[var(--surface)]/70">
          We&rsquo;re getting married
        </p>
        <p
          className="font-display text-[clamp(1.5rem,3.4vw,2.4rem)] leading-none"
          style={{ color: "var(--surface)" }}
        >
          {brideName} <span style={{ color: "var(--gilt)" }}>&</span> {groomName}
        </p>
        <span aria-hidden="true" className="flex items-center gap-2">
          <span className="h-px w-8" style={{ background: "var(--gilt)" }} />
          <span className="size-1 rotate-45" style={{ background: "var(--gilt)" }} />
          <span className="h-px w-8" style={{ background: "var(--gilt)" }} />
        </span>
        <p className="text-[0.6rem] tracking-[0.26em] text-[var(--surface)]/70">
          14 FEBRUARY 2027
        </p>
      </div>
    </div>
  );
}
