import { notFound } from "next/navigation";
import { getPublishedSite } from "@/lib/dal";
import { weddingMetadata } from "@/lib/site-metadata";
import { WeddingSite } from "@/components/templates";

/**
 * A tenant's public wedding site.
 *
 * Reads `publishedContent`, never `draftContent`, so a half-finished edit is
 * never visible to a guest. `getPublishedSite` returns `null` for an unknown
 * slug, a draft, a suspended tenant and an expired one alike — all four become
 * the same `notFound()`, so a stranger cannot enumerate slugs or work out who
 * has stopped paying.
 *
 * `generateMetadata` and the component below both call `getPublishedSite`, but
 * it is memoised with React `cache`, so that is one query per request.
 */

/*
  Rendered per request rather than cached.

  A published site is read far more often than it is written, so this is the
  wrong end state — but the right invalidation is a cache tag dropped when the
  couple hits Publish, and Publish does not exist until Phase 2. Serving a
  stale invitation to 330 guests is a worse failure than serving a fresh one
  slowly, so correctness first, and this line comes out with `revalidateTag`.
*/
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/wedding/[slug]">) {
  const { slug } = await params;
  const site = await getPublishedSite(slug);

  // Metadata for a page that is about to 404. Deliberately says nothing.
  if (!site) return { title: "Invitation not found" };

  return weddingMetadata(site.data);
}

export default async function WeddingSitePage({ params }: PageProps<"/wedding/[slug]">) {
  const { slug } = await params;
  const site = await getPublishedSite(slug);
  if (!site) notFound();

  return <WeddingSite data={site.data} templateId={site.templateId} colorwayId={site.colorwayId} />;
}
