import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPreviewSite } from "@/lib/dal";
import { WeddingSite } from "@/components/templates";

/**
 * A private preview of a tenant's *draft*.
 *
 * Keyed on `previewToken`, not on the slug, so possession of the link is the
 * whole authorisation. That is a deliberate trade: there is no login to build
 * yet, the token is a cuid rather than anything guessable, and a couple who
 * sent it to the wrong group can rotate the column to revoke it. Status is not
 * checked — previewing before paying is exactly the point of the free tier.
 */

/* Same reasoning as the public route, but stronger: a preview that lags the
   draft the couple just saved is a bug report waiting to happen. */
export const dynamic = "force-dynamic";

/**
 * Never indexed.
 *
 * A draft leaking into a search result would defeat the paywall and publish a
 * couple's private details before they chose to. The title is generic for the
 * same reason — a preview link pasted into a chat should not render a card
 * announcing the wedding.
 */
export const metadata: Metadata = {
  title: "Draft preview",
  robots: { index: false, follow: false, nocache: true },
};

export default async function PreviewPage({ params }: PageProps<"/preview/[token]">) {
  const { token } = await params;
  const site = await getPreviewSite(token);
  if (!site) notFound();

  return (
    <>
      {/*
        Above the curtain (`z-100`) so it is legible from the first frame. A
        preview is visually identical to the published site by design, which is
        precisely why it needs to say so — without this, a couple can share the
        preview link believing they are live, and their guests hit a URL that
        dies the moment the token rotates.
      */}
      <div
        role="status"
        className="fixed inset-x-0 top-0 z-200 flex items-center justify-center gap-2 bg-brand px-4 py-1.5 text-center text-xs font-medium tracking-wide text-surface"
      >
        Draft preview — not published. Only people with this link can see it.
      </div>
      <WeddingSite data={site.data} templateId={site.templateId} colorwayId={site.colorwayId} />
    </>
  );
}
