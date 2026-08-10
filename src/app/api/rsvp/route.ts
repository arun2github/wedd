import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const rsvpSchema = z.object({
  guestName: z.string().trim().min(2, "Please enter your full name").max(100),
  email: z.email("Please enter a valid email address"),
  phone: z.string().trim().min(7, "Please enter a valid phone number").max(20),
  attending: z.boolean(),
  guestCount: z.number().int().min(1).max(10),
  message: z.string().trim().max(500).optional().or(z.literal("")),
});

export async function POST(request: Request) {
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

  const { guestName, email, phone, attending, guestCount, message } = parsed.data;

  try {
    await prisma.rSVP.create({
      data: {
        guestName,
        email,
        phone,
        attending,
        guestCount,
        message: message || undefined,
      },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong saving your RSVP. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
