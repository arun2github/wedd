import type { WeddingTemplate } from "@/lib/templates";
import { TemplateCard } from "./TemplateCard";
import { Reveal } from "./Reveal";

/**
 * The catalogue, shown once.
 *
 * Previously the twelve designs appeared three times on one page — a filtered
 * grid, a collections list, and feature rows illustrated with the same cards.
 * They appear here and nowhere else.
 *
 * Each card carries the two actions a browsing couple actually wants, and no
 * others: look at it working, or take it. "Learn more" would be a third door
 * to the same room.
 */
export function TemplateGrid({
  templates, photo, brideName, groomName,
}: {
  templates: WeddingTemplate[];
  photo: string;
  brideName: string;
  groomName: string;
}) {
  return (
    <section id="designs" className="mx-auto w-full max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
      <Reveal className="max-w-2xl">
        <p className="text-[0.68rem] uppercase tracking-[0.32em] text-soft">The collection</p>
        <h2 className="mt-4 font-display text-[clamp(2.6rem,6vw,5rem)] font-light leading-[1.02] tracking-[-0.02em]">
          Twelve, and only twelve.
        </h2>
        <p className="mt-5 max-w-md leading-relaxed text-soft">
          Each drawn from the tradition it is for. Look at any of them running
          with real content before you decide.
        </p>
      </Reveal>

      <div className="mt-16 grid gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((t, i) => (
          <Reveal key={t.id} delay={(i % 3) * 0.08}>
            <TemplateCard
              template={t}
              photo={photo}
              brideName={brideName}
              groomName={groomName}
              priority={i < 3}
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
