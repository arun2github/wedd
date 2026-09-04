import { BRAND } from "@/lib/brand";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TEMPLATES, getTemplate, sectionsOf, COLLECTIONS, DESIGN_TIERS } from "@/lib/templates";
import { colorwaysOf } from "@/lib/colorways";
import { TIERS, inr } from "@/lib/pricing";
import { demoWeddingContent } from "@/data/wedding-data";
import { SiteChrome } from "@/components/marketing/SiteChrome";
import { TemplatePoster } from "@/components/marketing/TemplatePoster";
import { Reveal } from "@/components/marketing/Reveal";

/**
 * One design's page: look at it, then take it.
 *
 * A couple clicking a design wants two things and the page gives them exactly
 * those two — see it running with real content, or buy it. Everything else
 * here is the information needed to choose between designs, and nothing is a
 * feature list borrowed from a competitor: what is listed is what the template
 * renders, read from the registry.
 */

export function generateStaticParams() {
  return Object.keys(TEMPLATES).map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps<"/templates/[id]">): Promise<Metadata> {
  const { id } = await params;
  const t = TEMPLATES[id];
  if (!t) return { title: "Design not found" };
  return {
    title: `${t.name} — ${t.style} wedding website`,
    description: t.blurb,
  };
}

const TYPE_LABEL: Record<string, string> = {
  indian: "Indian weddings", destination: "Destination weddings",
  intimate: "Intimate weddings", large: "Large guest lists",
  "multi-day": "Multi-day celebrations",
};

export default async function TemplateDetailPage({ params, searchParams }: PageProps<"/templates/[id]">) {
  const { id } = await params;
  /* Carried from the catalogue card, so the colour a couple was looking at is
     the colour they land on. Unknown values fall back to the design's own
     palette rather than erroring. */
  const { c } = await searchParams;
  const colorwayId = typeof c === "string" ? c : undefined;
  /* A typo in a catalogue URL should say so, not quietly show a different
     design and let it be judged as the wrong one. */
  if (!TEMPLATES[id]) notFound();

  const t = getTemplate(id, colorwayId);
  const sections = sectionsOf(t);
  const { brideName, groomName, heroPhoto } = demoWeddingContent.couple;
  const entry = TIERS[0];

  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-linen font-sans text-ink [--body-face:var(--font-jost)] [--display-face:var(--font-cormorant)]">
      <SiteChrome />

      <main className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
        <Link href="/#designs" className="text-sm text-soft underline-offset-4 hover:underline">
          ← All designs
        </Link>

        <div className="mt-8 grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <Reveal>
            <TemplatePoster
              template={t}
              photo={heroPhoto}
              brideName={brideName}
              groomName={groomName}
              priority
              className="rounded-xl aspect-[3/4]"
            />
          </Reveal>

          <Reveal delay={0.1}>
            {/* Tier and collection are different questions — how much design
                is on the page, and what kind. Both, in that order. */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="rounded-full bg-peach px-3 py-1 text-[0.6rem] uppercase tracking-[0.22em] text-wine">
                {DESIGN_TIERS[t.tier].name}
              </span>
              <p className="text-[0.68rem] uppercase tracking-[0.32em] text-soft">
                {COLLECTIONS[t.collection].name}
              </p>
            </div>
            <h1 className="mt-4 font-display text-[clamp(2.6rem,6vw,4.6rem)] font-light leading-[1.0] tracking-[-0.02em]">
              {t.name}
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-soft">{t.blurb}</p>

            {/* The two doors, and no third. */}
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href={`/templates/${t.id}/demo`}
                className="rounded-full border border-ink/20 px-8 py-3.5 text-sm tracking-wide transition-colors hover:border-ink/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage"
              >
                View live demo
              </Link>
              <Link
                href={`/sign-in?next=${encodeURIComponent(`/templates/${t.id}`)}`}
                className="rounded-full bg-sage px-8 py-3.5 text-sm font-medium tracking-wide text-linen transition-colors hover:bg-forest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage"
              >
                Buy now — {inr(entry.price)}
              </Link>
            </div>
            <p className="mt-4 text-sm text-soft">
              Build it free and share a private link. You pay only when you publish.
            </p>

            <dl className="mt-12 grid gap-x-8 gap-y-6 border-t border-ink/10 pt-8 sm:grid-cols-2">
              <div>
                <dt className="text-[0.62rem] uppercase tracking-[0.26em] text-soft">Style</dt>
                <dd className="mt-2 capitalize">{t.style} · {t.tradition}</dd>
              </div>
              <div>
                <dt className="text-[0.62rem] uppercase tracking-[0.26em] text-soft">Best for</dt>
                <dd className="mt-2">{t.weddingTypes.map((w) => TYPE_LABEL[w] ?? w).join(", ")}</dd>
              </div>
              <div>
                <dt className="text-[0.62rem] uppercase tracking-[0.26em] text-soft">Mood</dt>
                <dd className="mt-2 capitalize">{t.moods.join(", ")}</dd>
              </div>
              <div>
                <dt className="text-[0.62rem] uppercase tracking-[0.26em] text-soft">Colour</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {/* The other colourways of this same design — one click, and
                      not a word of content moves. */}
                  {colorwaysOf(t.id).map((w) => (
                    <Link
                      key={w.id}
                      href={`/templates/${t.id}${w.id === "signature" ? "" : `?c=${w.id}`}`}
                      title={w.name}
                      aria-label={`${w.name} colourway`}
                      className={`size-8 rounded-full transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage ${
                        (colorwayId ?? "signature") === w.id
                          ? "scale-110 ring-2 ring-ink ring-offset-2 ring-offset-linen"
                          : "ring-1 ring-ink/20"
                      }`}
                      style={{ background: w.palette.surface, boxShadow: `inset 0 0 0 6px ${w.palette.brand}` }}
                    />
                  ))}
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>

        <Reveal className="mt-20 border-t border-ink/10 pt-10">
          <h2 className="font-display text-3xl font-light">What&rsquo;s included</h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-soft">
            Every section below is on this design today, with as many ceremonies
            as your family is holding.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {sections.map((s) => (
              <li key={s} className="rounded-full border border-ink/15 bg-card px-4 py-2 text-sm text-soft">
                {s}
              </li>
            ))}
          </ul>
        </Reveal>
      </main>

      <footer className="mt-8 border-t border-ink/10">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-8 sm:px-8">
          <p className="font-mark text-3xl leading-none">{BRAND}</p>
          <Link href="/#designs" className="text-sm text-soft transition-colors hover:text-ink">
            See all designs
          </Link>
        </div>
      </footer>
    </div>
  );
}
