"use client";

import { useState, type FormEvent } from "react";
import { m, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { fadeUp, revealViewport, hoverSpring, tapPress } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { RsvpConfig } from "@/types/wedding";

interface RSVPProps {
  rsvp: RsvpConfig;
}

interface FieldErrors {
  guestName?: string[];
  email?: string[];
  phone?: string[];
  message?: string[];
}

export function RSVP({ rsvp }: RSVPProps) {
  const [attending, setAttending] = useState<boolean | null>(null);
  const [guestCount, setGuestCount] = useState("1");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setFormError(null);

    if (attending === null) {
      setFormError("Please let us know if you'll be attending.");
      return;
    }

    const form = new FormData(event.currentTarget);
    const payload = {
      guestName: String(form.get("guestName") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      attending,
      guestCount: Number(guestCount),
      message: String(form.get("message") || ""),
    };

    setStatus("submitting");
    try {
      const res = await fetch(rsvp.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setFieldErrors(data.fieldErrors ?? {});
        setFormError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setFormError("Something went wrong. Please check your connection and try again.");
    }
  }

  return (
    <section id="rsvp" className="bg-ivory-dark py-20 sm:py-24">
      <div className="mx-auto max-w-xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="RSVP"
          title="Confirm Your Attendance"
          description="Kindly respond by the end of January 2027 so we can prepare a seat for you."
        />

        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          variants={fadeUp}
          className="mt-12 rounded-2xl border border-gold/25 bg-ivory p-6 shadow-sm sm:p-10"
        >
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <m.div
                key="success"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-4 py-6 text-center"
              >
                <CheckCircle2 className="size-12 text-wine" aria-hidden="true" />
                <h3 className="font-display text-2xl text-wine">Thank You!</h3>
                <p className="max-w-sm text-sm text-charcoal-muted">
                  Your RSVP has been received. We can&apos;t wait to celebrate with you.
                </p>
              </m.div>
            ) : (
              <m.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit}
                className="flex flex-col gap-5"
                noValidate
              >
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="guestName">Full Name</Label>
                  <Input id="guestName" name="guestName" required aria-invalid={!!fieldErrors.guestName} />
                  {fieldErrors.guestName && (
                    <p className="text-xs text-destructive">{fieldErrors.guestName[0]}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required aria-invalid={!!fieldErrors.email} />
                    {fieldErrors.email && (
                      <p className="text-xs text-destructive">{fieldErrors.email[0]}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" type="tel" required aria-invalid={!!fieldErrors.phone} />
                    {fieldErrors.phone && (
                      <p className="text-xs text-destructive">{fieldErrors.phone[0]}</p>
                    )}
                  </div>
                </div>

                <fieldset className="flex flex-col gap-2">
                  <legend className="mb-1 text-sm font-medium">Will you be attending?</legend>
                  <div className="flex gap-3">
                    {[
                      { label: "Joyfully Accepts", value: true },
                      { label: "Regretfully Declines", value: false },
                    ].map((option) => (
                      <m.button
                        key={option.label}
                        type="button"
                        onClick={() => setAttending(option.value)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={tapPress}
                        transition={hoverSpring}
                        className={cn(
                          "relative flex-1 rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
                          attending === option.value
                            ? "border-wine text-ivory"
                            : "border-gold/40 bg-transparent text-charcoal hover:border-wine"
                        )}
                        aria-pressed={attending === option.value}
                      >
                        {/* One fill that slides between the two options rather
                            than two that cross-fade. */}
                        {attending === option.value && (
                          <m.span
                            layoutId="rsvp-attending"
                            className="absolute inset-0 rounded-full bg-wine"
                            transition={{ type: "spring", stiffness: 350, damping: 32 }}
                          />
                        )}
                        <span className="relative z-10">{option.label}</span>
                      </m.button>
                    ))}
                  </div>
                  {formError && <p className="text-xs text-destructive">{formError}</p>}
                </fieldset>

                {attending && (
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="guestCount">Number of Guests</Label>
                    <Select value={guestCount} onValueChange={setGuestCount}>
                      <SelectTrigger id="guestCount" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                          <SelectItem key={n} value={String(n)}>
                            {n} {n === 1 ? "Guest" : "Guests"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="message">Message (optional)</Label>
                  <Textarea id="message" name="message" rows={3} />
                </div>

                <Button type="submit" size="lg" disabled={status === "submitting"} className="mt-2">
                  {status === "submitting" ? "Sending..." : "Confirm Attendance"}
                </Button>
              </m.form>
            )}
          </AnimatePresence>
        </m.div>
      </div>
    </section>
  );
}
