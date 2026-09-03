import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import type { TenantStatus, Tier } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { parseContent, toWeddingData, type WeddingContent } from "@/lib/content-schema";
import type { WeddingData } from "@/types/wedding";

/**
 * The Data Access Layer — the only module permitted to import `prisma`.
 *
 * That rule is enforced mechanically by `no-restricted-imports` in
 * `eslint.config.mjs`, not by convention, because tenant isolation is exactly
 * the kind of invariant that survives review and then dies to one hurried
 * route handler. Every function here either takes a tenant it has already
 * resolved, or resolves one itself and scopes the query to it. There is no
 * exported path to an unscoped query.
 *
 * Next's own guidance is that Proxy (née Middleware) must not be the
 * authorization boundary — it runs on prefetches and can only read cookies.
 * This file is the boundary.
 */

/** What a public visitor is allowed to know about a tenant. */
export interface PublicSite {
  slug: string;
  data: WeddingData;
  /** Which design renders this site. Validated by `getTemplate`, which falls
   *  back rather than throwing, so an unknown id shows the default rather than
   *  taking a paid-for site down. */
  templateId: string;
  /** Which colourway of that design. Null means the design's own palette. */
  colorwayId: string | null;
}

/**
 * A published site by slug, or `null`.
 *
 * `null` covers four cases the caller must not be able to tell apart — no such
 * slug, still a draft, suspended, and expired. They all become the same 404,
 * so the platform doesn't leak which slugs are taken or who has stopped
 * paying.
 *
 * Memoised with React `cache` so `generateMetadata` and the page component
 * share one query per request instead of two.
 */
export const getPublishedSite = cache(async (slug: string): Promise<PublicSite | null> => {
  const tenant = await prisma.tenant.findUnique({
    where: { slug },
    select: {
      slug: true,
      status: true,
      liveUntil: true,
      site: { select: { publishedContent: true, templateId: true, colorwayId: true } },
    },
  });

  if (!tenant || tenant.status !== "ACTIVE") return null;
  if (tenant.liveUntil && tenant.liveUntil < new Date()) return null;

  const content = parseContent(tenant.site?.publishedContent);
  if (!content) return null;

  return {
    slug: tenant.slug,
    data: toWeddingData(content, tenant.slug),
    templateId: tenant.site!.templateId,
    colorwayId: tenant.site!.colorwayId,
  };
});

/**
 * A site's *draft* by preview token.
 *
 * Keyed on the token rather than the slug so that holding the link is the
 * whole authorisation — there is nothing to guess, and a couple who shared it
 * with the wrong person can rotate `previewToken` to revoke it. Status is not
 * checked here: previewing before paying is the point.
 */
export const getPreviewSite = cache(async (token: string): Promise<PublicSite | null> => {
  const tenant = await prisma.tenant.findUnique({
    where: { previewToken: token },
    select: { slug: true, site: { select: { draftContent: true, templateId: true, colorwayId: true } } },
  });

  if (!tenant) return null;

  const content = parseContent(tenant.site?.draftContent);
  if (!content) return null;

  return {
    slug: tenant.slug,
    data: toWeddingData(content, tenant.slug),
    templateId: tenant.site!.templateId,
    colorwayId: tenant.site!.colorwayId,
  };
});

/**
 * Resolves a slug to a tenant id for accepting an RSVP.
 *
 * Deliberately narrow: it returns an id and nothing else, and only for a
 * tenant currently serving. A guest posting to a draft or expired site is
 * indistinguishable from posting to one that never existed.
 */
export const getAcceptingTenantId = cache(async (slug: string): Promise<string | null> => {
  const tenant = await prisma.tenant.findUnique({
    where: { slug },
    select: { id: true, status: true, liveUntil: true },
  });

  if (!tenant || tenant.status !== "ACTIVE") return null;
  if (tenant.liveUntil && tenant.liveUntil < new Date()) return null;

  return tenant.id;
});

export interface RsvpSubmission {
  guestName: string;
  email: string;
  phone: string;
  attending: boolean;
  guestCount: number;
  message?: string;
}

/**
 * Records a response against a tenant id the caller has already resolved
 * through `getAcceptingTenantId`.
 *
 * Taking the id rather than the slug is what makes the tenant scope
 * unforgeable at this layer: there is no code path that writes an RSVP without
 * a tenant having been resolved first.
 */
export async function createRsvp(tenantId: string, submission: RsvpSubmission): Promise<void> {
  await prisma.rsvpResponse.create({
    data: {
      tenantId,
      guestName: submission.guestName,
      email: submission.email,
      phone: submission.phone,
      attending: submission.attending,
      guestCount: submission.guestCount,
      message: submission.message || undefined,
    },
  });
}

/**
 * Creates a tenant with its initial draft content.
 *
 * Content is validated by the caller before it gets here — `draftContent`
 * takes a `WeddingContent`, not `unknown`, so an unvalidated document cannot
 * reach the column through this function.
 */
export async function createTenant(slug: string, content: WeddingContent): Promise<string> {
  const tenant = await prisma.tenant.create({
    data: {
      slug,
      site: { create: { draftContent: content } },
    },
    select: { id: true },
  });
  return tenant.id;
}

/* ------------------------------------------------------------------ operator
   Everything below runs for a signed-in operator and is *not* tenant-scoped —
   the console's whole job is to see across tenants. That is exactly why every
   function here begins by resolving a session: with no tenant in the query to
   constrain it, the session is the only thing standing between a request and
   every couple's data.
------------------------------------------------------------------------- */

/**
 * The session, or `null`.
 *
 * Memoised per request, so a layout, a page and three server actions in the
 * same render cost one lookup rather than five.
 */
export const getSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});

/**
 * Asserts a signed-in operator, or redirects to sign-in.
 *
 * This is the authorisation boundary, and it lives here rather than in
 * `proxy.ts` on purpose: the proxy runs on prefetches and sees only a cookie's
 * presence, which makes it a fast filter and a poor gate. Next's own docs are
 * explicit that proxy "should not be used as a full session management or
 * authorization solution". So the proxy bounces the obviously-signed-out, and
 * every operator read and write calls this.
 */
export async function requireOperator() {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  /*
    A session is no longer enough.

    Registration is open so couples can build their own site, which means most
    accounts that exist are customers. The console sees across every tenant, so
    it checks the role explicitly — and reads it from the database rather than
    trusting the session payload, because the row is the thing an operator was
    actually granted.
  */
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (user?.role !== "operator") redirect("/");

  return session;
}

/** True when the signed-in account may open the console. Used for nav, never
 *  as a gate — the gate is `requireOperator`, which runs server-side. */
export const isOperator = cache(async (): Promise<boolean> => {
  const session = await getSession();
  if (!session) return false;
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  return user?.role === "operator";
});

export interface TenantRow {
  id: string;
  slug: string;
  status: TenantStatus;
  tier: Tier | null;
  liveUntil: Date | null;
  previewToken: string;
  templateId: string;
  isPublished: boolean;
  coupleNames: string | null;
  rsvpCount: number;
  updatedAt: Date;
}

/** Every tenant, newest first — the console's home screen. */
export async function listTenants(): Promise<TenantRow[]> {
  await requireOperator();

  const tenants = await prisma.tenant.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true, slug: true, status: true, tier: true, liveUntil: true,
      previewToken: true, updatedAt: true,
      site: { select: { templateId: true, draftContent: true, publishedAt: true } },
      _count: { select: { rsvps: true } },
    },
  });

  return tenants.map((t) => {
    /* Read the names off the draft rather than joining another table: the
       console lists sites, and a site without names in its draft is one that
       has not been started yet, which is worth seeing as a blank. */
    const draft = parseContent(t.site?.draftContent);
    return {
      id: t.id, slug: t.slug, status: t.status, tier: t.tier,
      liveUntil: t.liveUntil, previewToken: t.previewToken,
      templateId: t.site?.templateId ?? "royal-ivory",
      isPublished: Boolean(t.site?.publishedAt),
      coupleNames: draft ? `${draft.couple.brideName} & ${draft.couple.groomName}` : null,
      rsvpCount: t._count.rsvps,
      updatedAt: t.updatedAt,
    };
  });
}

/** One tenant's editable state. */
export async function getTenantForOperator(slug: string) {
  await requireOperator();

  const tenant = await prisma.tenant.findUnique({
    where: { slug },
    select: {
      id: true, slug: true, status: true, tier: true, liveUntil: true,
      previewToken: true, createdAt: true,
      site: { select: { templateId: true, draftContent: true, publishedAt: true } },
      _count: { select: { rsvps: true } },
    },
  });
  if (!tenant) return null;

  return {
    ...tenant,
    draft: parseContent(tenant.site?.draftContent),
    templateId: tenant.site?.templateId ?? "royal-ivory",
    isPublished: Boolean(tenant.site?.publishedAt),
    rsvpCount: tenant._count.rsvps,
  };
}

/** Creates a site. Returns the slug so the caller can navigate to it. */
export async function createSite(
  slug: string,
  content: WeddingContent,
  templateId: string
): Promise<string> {
  await requireOperator();
  const tenant = await prisma.tenant.create({
    /* Born a DRAFT: it is previewable immediately and publicly invisible until
       someone decides otherwise. Creating a site and publishing it are two
       different decisions and should take two different clicks. */
    data: { slug, site: { create: { draftContent: content, templateId } } },
    select: { slug: true },
  });
  return tenant.slug;
}

/**
 * Publishes the current draft.
 *
 * Publishing *copies* the draft into `publishedContent` rather than flipping a
 * pointer. That is what lets editing continue safely afterwards: the live site
 * is a snapshot, so a half-finished sentence typed tomorrow is not on a
 * guest's screen a second later.
 */
export async function publishSite(slug: string): Promise<void> {
  await requireOperator();
  const tenant = await prisma.tenant.findUnique({
    where: { slug },
    select: { id: true, site: { select: { draftContent: true } } },
  });
  if (!tenant?.site) throw new Error("No site to publish.");

  /* Publish the *parsed* draft, not the raw column. What goes live is then
     exactly what validation approved — a document edited directly in the
     database cannot be promoted to the public site by clicking Publish. */
  const content = parseContent(tenant.site.draftContent);
  if (!content) throw new Error("The draft is incomplete, so it cannot be published yet.");

  await prisma.$transaction([
    prisma.weddingSite.update({
      where: { tenantId: tenant.id },
      data: { publishedContent: content, publishedAt: new Date() },
    }),
    prisma.tenant.update({ where: { id: tenant.id }, data: { status: "ACTIVE" } }),
  ]);
}

/**
 * Takes a site off the public web without destroying anything.
 *
 * `publishedContent` is left in place. Unpublishing is usually temporary — a
 * date changed, a name was wrong — and deleting the last known-good snapshot
 * to express "not right now" would turn a small correction into a rebuild.
 */
export async function unpublishSite(slug: string): Promise<void> {
  await requireOperator();
  await prisma.tenant.update({ where: { slug }, data: { status: "DRAFT" } });
}

/** Switches which template renders a site. Content is untouched — that is the
 *  entire point of keeping content and presentation apart. */
export async function setTemplate(slug: string, templateId: string): Promise<void> {
  await requireOperator();
  const tenant = await prisma.tenant.findUnique({ where: { slug }, select: { id: true } });
  if (!tenant) throw new Error("No such site.");
  await prisma.weddingSite.update({ where: { tenantId: tenant.id }, data: { templateId } });
}

/** Saves an edited draft. Never touches what is live. */
export async function saveDraft(slug: string, content: WeddingContent): Promise<void> {
  await requireOperator();
  const tenant = await prisma.tenant.findUnique({ where: { slug }, select: { id: true } });
  if (!tenant) throw new Error("No such site.");
  await prisma.weddingSite.update({
    where: { tenantId: tenant.id },
    data: { draftContent: content },
  });
}

/** One site's responses, newest first. */
export async function listRsvps(slug: string) {
  await requireOperator();
  const tenant = await prisma.tenant.findUnique({ where: { slug }, select: { id: true } });
  if (!tenant) return [];
  return prisma.rsvpResponse.findMany({
    where: { tenantId: tenant.id },
    orderBy: { createdAt: "desc" },
  });
}
