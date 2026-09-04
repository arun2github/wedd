"use client";

import Link from "next/link";
import { useState } from "react";
import { getTemplate, type WeddingTemplate } from "@/lib/templates";
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
  const href = `/templates/${template.id}${wayId !== "signature" ? `?c=${wayId}` : ""}`;

  return (
    <article className="group">
      <Link href={href} className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-aubergine">
        <TemplatePoster
          template={shown}
          photo={photo}
          brideName={brideName}
          groomName={groomName}
          priority={priority}
          className="rounded-xl aspect-[3/4] transition-transform duration-700 ease-out group-hover:-translate-y-1.5"
        />
      </Link>

      <div className="mt-5">
        <div className="flex items-baseline justify-between gap-3">
          <h4 className="font-display text-2xl font-light">{template.name}</h4>
          <p className="text-[0.6rem] uppercase tracking-[0.22em] text-soft">{template.style}</p>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-soft">{template.blurb}</p>

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
