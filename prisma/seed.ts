import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { SCHEMA_VERSION, weddingContentSchema } from "../src/lib/content-schema";
import { DEMO_SLUG, demoWeddingContent } from "../src/data/wedding-data";

/**
 * Seeds the demo tenant.
 *
 * This script is the one place outside `src/lib/dal.ts` that talks to Prisma
 * directly. It has to be: the DAL is `server-only`, which throws outside a
 * Next runtime. The exemption is safe because a seed has no request and no
 * caller — there is no tenant to confuse it with.
 *
 * Idempotent. The `arun-priya` tenant already exists in any database that ran
 * the multi-tenant migration (it was created from the slug the old `RSVP` rows
 * carried), so this upserts rather than creates, and can be re-run after every
 * content edit without orphaning the RSVPs already attached to it.
 */

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Validated here, not just type-checked, so the seed cannot write a document
  // that `parseContent` would later refuse to read back.
  const content = weddingContentSchema.parse(demoWeddingContent);

  const tenant = await prisma.tenant.upsert({
    where: { slug: DEMO_SLUG },
    // Published, not draft: this row is the public demo the marketing site
    // links to, so it has to serve without an order behind it.
    create: { slug: DEMO_SLUG, status: "ACTIVE", tier: "PLATINUM" },
    update: { status: "ACTIVE", tier: "PLATINUM" },
    select: { id: true },
  });

  const site = {
    schemaVersion: SCHEMA_VERSION,
    draftContent: content,
    publishedContent: content,
    publishedAt: new Date(),
  };

  await prisma.weddingSite.upsert({
    where: { tenantId: tenant.id },
    create: { tenantId: tenant.id, ...site },
    update: site,
  });

  const rsvps = await prisma.rsvpResponse.count({ where: { tenantId: tenant.id } });
  console.log(`Seeded /wedding/${DEMO_SLUG} — ${rsvps} RSVP response(s) attached.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
