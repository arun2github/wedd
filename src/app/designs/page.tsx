import type { Metadata } from "next";
import { listTemplates } from "@/lib/templates";
import { demoWeddingContent } from "@/data/wedding-data";
import { PageShell } from "@/components/marketing/PageShell";
import { TemplateGrid } from "@/components/marketing/TemplateGrid";
import { Reveal } from "@/components/marketing/Reveal";

export const metadata: Metadata = {
  title: "Wedding website designs — Sehra",
  description:
    "Twelve designed wedding websites for Hindu, Christian and Muslim weddings. See any of them running with real content before you choose.",
};

/** The catalogue, and the only place it appears. */
export default function DesignsPage() {
  const templates = listTemplates();
  const { brideName, groomName, heroPhoto } = demoWeddingContent.couple;

  return (
    <PageShell>
      <section className="mx-auto w-full max-w-7xl px-5 pb-4 pt-16 sm:px-8 lg:pt-24">
        <Reveal className="max-w-3xl">
          <p className="text-[0.68rem] uppercase tracking-[0.32em] text-soft">The collection</p>
          <h1 className="mt-5 font-display text-[clamp(3rem,7vw,5.6rem)] font-light leading-[0.98] tracking-[-0.025em]">
            Twelve designs.
            <br />
            One for your wedding.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-soft">
            Each drawn from the tradition it is for — its materials, its
            ornament, its ceremonies. Open any of them and it runs with real
            content, on a real page.
          </p>
        </Reveal>
      </section>

      <TemplateGrid
        templates={templates}
        photo={heroPhoto}
        brideName={brideName}
        groomName={groomName}
      />
    </PageShell>
  );
}
