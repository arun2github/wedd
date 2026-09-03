import { NextResponse } from "next/server";
import { z } from "zod";
import { createRsvp, getAcceptingTenantId } from "@/lib/dal";

/**
 * Accepts one guest's RSVP for one tenant.
 *
 * The slug is a path segment rather than a field in the body: a body field is
 * something the client chooses, and this endpoint is unauthenticated by
 * design. Either way the value is untrusted, which is why it is never written
 * anywhere — it is exchanged for a tenant id through the DAL first, and the
 * write is keyed on that id.
 *
 * The previous version of this route wrote no tenant scope at all, so every
 * response in the database landed on the schema default. That is the bug this
 * file closes.
 */

const rsvpSchema = z.object({
  guestName: z.string().trim().min(2, "Please enter your full name").max(100),
  email: z.email("Please enter a valid email address"),
  phone: z.string().trim().min(7, "Please enter a valid phone number").max(20),
  attending: z.boolean(),
  guestCount: z.number().int().min(1).max(10),
  message: z.string().trim().max(500).optional().or(z.literal("")),
});

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  const parsed = rsvpSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed", fieldErrors: z.flattenError(parsed.error).fieldErrors },
      { status: 422 }
    );
  }

  /* Resolved before the write, and only for a tenant currently serving. A
     draft, suspended or expired site rejects RSVPs exactly like one that never
     existed — a 404 here would otherwise tell a stranger which slugs are
     taken. */
  const tenantId = await getAcceptingTenantId(slug);
  if (!tenantId) {
    return NextResponse.json({ ok: false, error: "This invitation is no longer accepting responses." }, { status: 404 });
  }

  try {
    await createRsvp(tenantId, parsed.data);
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong saving your RSVP. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
