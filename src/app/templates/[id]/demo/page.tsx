import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TEMPLATES, getTemplate, listTemplates } from "@/lib/templates";
import { WeddingSite } from "@/components/templates";
import { toWeddingData } from "@/lib/content-schema";
import { demoWeddingContent, DEMO_SLUG } from "@/data/wedding-data";

/**
 * One template, rendered full-size against the demo content.
 *
 * Deliberately reads the checked-in demo content rather than a tenant, so the
 * catalogue works with an empty database and a template can be reviewed before
 * anyone has bought one. It renders through `WeddingSite` — the same entry
 * point the public route uses — so what is previewed here is what ships.
 */

export function generateStaticParams() {
  return Object.keys(TEMPLATES).map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps<"/templates/[id]/demo">): Promise<Metadata> {
  const { id } = await params;
  const template = TEMPLATES[id];
  return {
    title: template ? `${template.name} — live demo` : "Template not found",
    robots: { index: false, follow: false },
  };
}

export default async function TemplatePreviewPage({ params }: PageProps<"/templates/[id]/demo">) {
  const { id } = await params;
  /* `getTemplate` falls back for a live site, which is right there and wrong
     here: a typo in the catalogue URL should say so, not quietly show a
     different template and let it be reviewed as the wrong one. */
  if (!TEMPLATES[id]) notFound();

  const template = getTemplate(id);
  const all = listTemplates();
  const index = all.findIndex((t) => t.id === template.id);
  const prev = all[(index - 1 + all.length) % all.length];
  const next = all[(index + 1) % all.length];

  return (
    <>
      {/*
        Above the curtain (`z-100`) so it survives the intro, and pinned to the
        bottom so it never covers the hero — the one part of a template a
        reviewer most needs to see uninterrupted.
      */}
      <nav
        aria-label="Template catalogue"
        className="fixed inset-x-0 bottom-0 z-200 flex items-center justify-between gap-3 border-t border-white/15 bg-neutral-900/90 px-4 py-2.5 text-sm text-white backdrop-blur-md"
      >
        <Link href={`/templates/${template.id}`} className="rounded px-2 py-1 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-white">
          ← Back to {template.name}
        </Link>
        <span className="min-w-0 truncate text-center">
          <strong className="font-medium">{template.name}</strong>
          <span className="hidden text-white/60 sm:inline"> · {template.tradition} · {template.archetype}</span>
        </span>
        <Link
          href={`/templates/${template.id}`}
          className="shrink-0 rounded-full bg-white px-4 py-1.5 text-xs font-medium text-neutral-900 transition-colors hover:bg-neutral-200"
        >
          Buy this design
        </Link>
        <span className="flex shrink-0 gap-1">
          <Link href={`/templates/${prev.id}/demo`} className="rounded px-2 py-1 hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-white" aria-label={`Previous template: ${prev.name}`}>←</Link>
          <Link href={`/templates/${next.id}/demo`} className="rounded px-2 py-1 hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-white" aria-label={`Next template: ${next.name}`}>→</Link>
        </span>
      </nav>

      <WeddingSite
        data={toWeddingData(demoWeddingContent, DEMO_SLUG)}
        templateId={template.id}
        skipIntro
      />
    </>
  );
}
