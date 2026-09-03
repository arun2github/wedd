import type { Metadata } from "next";
import type { WeddingData } from "@/types/wedding";

/**
 * Builds a tenant's page metadata from its own content.
 *
 * The root layout used to hardcode "Aman & Priya" in `metadata`, which was
 * correct for exactly one wedding and wrong for every other. Deriving it here
 * means a tenant cannot ship with someone else's name in the tab, the WhatsApp
 * link preview, or the search result — and since a wedding invitation
 * circulates almost entirely as a pasted link, the preview card *is* the
 * product's first impression.
 */
export function weddingMetadata(data: WeddingData): Metadata {
  const { brideName, groomName, heroPhoto } = data.couple;
  const title = `${brideName} & ${groomName} | Wedding Invitation`;

  return {
    title,
    description: data.invitationMessage,
    openGraph: {
      title,
      description: data.invitationMessage,
      type: "website",
      /* Absolute already — media is remote — so this resolves without a
         `metadataBase`, which the platform cannot know at build time. */
      images: [{ url: heroPhoto }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: data.invitationMessage,
      images: [heroPhoto],
    },
  };
}
