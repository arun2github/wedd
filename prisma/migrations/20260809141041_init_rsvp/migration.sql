-- CreateTable
CREATE TABLE "RSVP" (
    "id" TEXT NOT NULL,
    "weddingSlug" TEXT NOT NULL DEFAULT 'arun-priya',
    "guestName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "attending" BOOLEAN NOT NULL,
    "guestCount" INTEGER NOT NULL DEFAULT 1,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RSVP_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RSVP_weddingSlug_idx" ON "RSVP"("weddingSlug");
