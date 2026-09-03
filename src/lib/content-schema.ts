import { z } from "zod";
import type { WeddingData } from "@/types/wedding";

/**
 * Runtime contract for tenant-authored wedding content.
 *
 * `src/types/wedding.ts` describes the same shape to the compiler, but a JSONB
 * column arrives as `unknown` — the compiler has nothing to check. This is the
 * boundary where a stored document becomes a `WeddingData` again, and it runs
 * on write *and* on read: a document written under an older schema, or edited
 * directly in the database, must not reach the template as a half-object.
 *
 * `SCHEMA_VERSION` is stamped on every site. When this file changes shape,
 * bump it and branch on read rather than backfilling every tenant.
 */
export const SCHEMA_VERSION = 1;

/** Guards against `javascript:` and `data:` URLs reaching an `href` or `src`. */
const webUrl = z.url().max(2048);

/**
 * Deliberately *not* `z.string().datetime()`. The template renders these
 * through `formatWeddingDate`, and event dates are plain `"2027-02-10"` while
 * `weddingDate` carries a timezone offset. Both are valid input to `new Date`.
 */
const dateish = z.string().trim().min(1).max(64);

const coupleSchema = z.object({
  brideName: z.string().trim().min(1).max(60),
  groomName: z.string().trim().min(1).max(60),
  brideIntro: z.string().trim().max(600),
  groomIntro: z.string().trim().max(600),
  bridePhoto: webUrl,
  groomPhoto: webUrl,
  heroPhoto: webUrl,
});

const storyMilestoneSchema = z.object({
  date: dateish,
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(600),
  image: webUrl.optional(),
});

const weddingEventSchema = z.object({
  name: z.string().trim().min(1).max(120),
  date: dateish,
  time: z.string().trim().min(1).max(40),
  venue: z.string().trim().min(1).max(200),
  description: z.string().trim().max(600),
  /* The icon is the ceremony discriminator — it picks the card's whole palette
     in `EventTicket`. An unknown value would index `CEREMONY` to `undefined`
     and crash the section, so the enum is the real guard, not decoration. */
  icon: z.enum(["flame", "flower", "heart", "sparkles"]),
  mapUrl: webUrl.optional(),
});

const venueSchema = z.object({
  name: z.string().trim().min(1).max(200),
  address: z.string().trim().min(1).max(400),
  image: webUrl,
  mapEmbedUrl: webUrl.optional(),
  directionsUrl: webUrl,
});

const galleryImageSchema = z.object({
  src: webUrl,
  category: z.enum(["pre-wedding", "engagement", "haldi", "mehendi", "wedding"]),
  alt: z.string().trim().max(300),
  /* Drives the grid row-span, so an unknown value would collapse the tile. */
  aspect: z.enum(["portrait", "landscape", "square"]),
});

const videoSchema = z.object({
  thumbnail: webUrl,
  url: webUrl,
  title: z.string().trim().max(160),
  description: z.string().trim().max(600),
});

const familyGroupSchema = z.object({
  title: z.string().trim().max(80),
  names: z.string().trim().max(300),
});

/**
 * Everything a tenant may author.
 *
 * `rsvp` is absent on purpose. It holds the endpoint the guest form posts to,
 * which is platform infrastructure rather than couple content — a tenant admin
 * able to edit it could point their guests' submissions at another tenant, or
 * off-platform entirely. It is derived from the slug at render time instead.
 */
export const weddingContentSchema = z.object({
  couple: coupleSchema,
  weddingDate: dateish,
  invitationMessage: z.string().trim().max(600),
  story: z.array(storyMilestoneSchema).max(20),
  events: z.array(weddingEventSchema).max(20),
  venue: venueSchema,
  gallery: z.array(galleryImageSchema).max(200),
  /* Optional. A couple who has no film yet should not be forced to invent
     one, and the section simply does not render without a url — which is also
     how the joke placeholder that shipped on all twelve demos was removed. */
  video: videoSchema.optional(),
  families: z.object({
    brideFamily: familyGroupSchema,
    groomFamily: familyGroupSchema,
  }),
});

export type WeddingContent = z.infer<typeof weddingContentSchema>;

/**
 * Rejoins stored content with the platform-owned RSVP endpoint to produce the
 * `WeddingData` the template already accepts. The endpoint is built from the
 * slug here, in one place, so no caller can supply their own.
 */
export function toWeddingData(content: WeddingContent, slug: string): WeddingData {
  return { ...content, rsvp: { endpoint: `/api/rsvp/${slug}` } };
}

/**
 * Parses a JSONB column into content.
 *
 * Returns `null` rather than throwing: a single malformed document should take
 * one site to a 404, not every render that touches it to a 500.
 */
export function parseContent(value: unknown): WeddingContent | null {
  const parsed = weddingContentSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}
