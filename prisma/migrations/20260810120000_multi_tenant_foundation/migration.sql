-- Multi-tenant foundation.
--
-- Hand-written rather than generated, because the generated version drops
-- `RSVP` outright. Existing responses belong to a real couple; they are
-- migrated onto a Tenant row keyed by the slug they already carry, and the old
-- table is only dropped once they are safely across.

-- CreateEnum
CREATE TYPE "TenantStatus" AS ENUM ('DRAFT', 'ACTIVE', 'SUSPENDED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "Tier" AS ENUM ('SILVER', 'GOLD', 'PLATINUM');

-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "TenantStatus" NOT NULL DEFAULT 'DRAFT',
    "tier" "Tier",
    "liveUntil" TIMESTAMP(3),
    "previewToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeddingSite" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "schemaVersion" INTEGER NOT NULL DEFAULT 1,
    "templateId" TEXT NOT NULL DEFAULT 'royal-ivory',
    "draftContent" JSONB NOT NULL,
    "publishedContent" JSONB,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeddingSite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RsvpResponse" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "guestName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "attending" BOOLEAN NOT NULL,
    "guestCount" INTEGER NOT NULL DEFAULT 1,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RsvpResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_slug_key" ON "Tenant"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_previewToken_key" ON "Tenant"("previewToken");

-- CreateIndex
CREATE INDEX "Tenant_status_idx" ON "Tenant"("status");

-- CreateIndex
CREATE UNIQUE INDEX "WeddingSite_tenantId_key" ON "WeddingSite"("tenantId");

-- CreateIndex
CREATE INDEX "RsvpResponse_tenantId_createdAt_idx" ON "RsvpResponse"("tenantId", "createdAt");

-- AddForeignKey
ALTER TABLE "WeddingSite" ADD CONSTRAINT "WeddingSite_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RsvpResponse" ADD CONSTRAINT "RsvpResponse_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DataMigration: one Tenant per distinct slug already present in RSVP.
-- Left ACTIVE: these sites were already publicly serving before the platform
-- existed, and a migration must not take a live site down.
INSERT INTO "Tenant" ("id", "slug", "status", "previewToken", "createdAt", "updatedAt")
SELECT gen_random_uuid()::text,
       "weddingSlug",
       'ACTIVE',
       gen_random_uuid()::text,
       now(),
       now()
FROM "RSVP"
GROUP BY "weddingSlug";

-- DataMigration: carry the responses across, preserving their original ids and
-- timestamps so nothing looks newly submitted.
INSERT INTO "RsvpResponse" ("id", "tenantId", "guestName", "email", "phone", "attending", "guestCount", "message", "createdAt")
SELECT r."id",
       t."id",
       r."guestName",
       r."email",
       r."phone",
       r."attending",
       r."guestCount",
       r."message",
       r."createdAt"
FROM "RSVP" r
JOIN "Tenant" t ON t."slug" = r."weddingSlug";

-- DropTable
DROP TABLE "RSVP";
