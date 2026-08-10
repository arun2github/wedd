"use client";

import { useCallback } from "react";
import {
  m,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Flame, Flower, Heart, Sparkles, MapPin } from "lucide-react";
import { fadeUp } from "@/lib/motion";
import { formatWeddingDate } from "@/lib/format-date";
import { useDeviceCapability } from "@/hooks/useDeviceCapability";
import type { WeddingEvent } from "@/types/wedding";

/**
 * Ceremony identity, keyed off the icon already in the data.
 *
 * The icon is the only ceremony-type discriminator `WeddingEvent` carries, so
 * it drives the whole palette — a template user picking `icon: "flower"` gets
 * the henna card without configuring anything extra.
 *
 * Each ceremony owns a real surface, not just an accent: haldi is turmeric,
 * mehendi is henna, the wedding is wine, the reception is plum. The tint is
 * held at 8–10% so four of them can sit in a row without the section turning
 * into a paint chart, and so the charcoal body text keeps its contrast.
 *
 * Classes are written out in full rather than composed (`text-${accent}`)
 * because Tailwind only generates what it can find as a literal in the source.
 */
const CEREMONY = {
  sparkles: {
    Icon: Sparkles,
    text: "text-haldi",
    rail: "bg-haldi",
    chip: "bg-haldi/10 text-haldi",
    surface: "bg-gradient-to-br from-haldi/10 via-ivory-dark to-ivory-dark",
    edge: "group-hover/ticket:border-haldi/50 group-focus-within/ticket:border-haldi/50",
    glow: "rgba(130,96,15,0.30)",
  },
  flower: {
    Icon: Flower,
    text: "text-mehendi",
    rail: "bg-mehendi",
    chip: "bg-mehendi/10 text-mehendi",
    surface: "bg-gradient-to-br from-mehendi/10 via-ivory-dark to-ivory-dark",
    edge: "group-hover/ticket:border-mehendi/50 group-focus-within/ticket:border-mehendi/50",
    glow: "rgba(64,86,44,0.30)",
  },
  flame: {
    Icon: Flame,
    text: "text-wine",
    rail: "bg-wine",
    chip: "bg-wine/10 text-wine",
    surface: "bg-gradient-to-br from-wine/10 via-ivory-dark to-ivory-dark",
    edge: "group-hover/ticket:border-wine/50 group-focus-within/ticket:border-wine/50",
    glow: "rgba(92,14,29,0.30)",
  },
  heart: {
    Icon: Heart,
    text: "text-plum",
    rail: "bg-plum",
    chip: "bg-plum/10 text-plum",
    surface: "bg-gradient-to-br from-plum/10 via-ivory-dark to-ivory-dark",
    edge: "group-hover/ticket:border-plum/50 group-focus-within/ticket:border-plum/50",
    glow: "rgba(74,37,69,0.30)",
  },
} as const;

/** Max tilt in degrees at the card's corners. Past ~8 the text starts to smear. */
const TILT = 7;
const tiltSpring = { stiffness: 220, damping: 22, mass: 0.4 } as const;

interface EventTicketProps {
  event: WeddingEvent;
  /** 1-based position, printed on the stub rail. */
  day: number;
  /** Scroll parallax offset, owned by the parent so the hook count stays fixed. */
  y: MotionValue<number>;
}

export function EventTicket({ event, day, y }: EventTicketProps) {
  const prefersReducedMotion = useReducedMotion();
  const tier = useDeviceCapability();
  // Tilt is a fine-pointer affordance: it needs a cursor to track, and it's the
  // kind of continuous transform that costs the most on weak hardware.
  const interactive = tier === "rich" && !prefersReducedMotion;

  const ceremony = CEREMONY[event.icon];

  // Pointer position within the card, normalised to -0.5…0.5 from the centre.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  // Raw pixel position, used to park the specular highlight under the cursor.
  const gx = useMotionValue(0);
  const gy = useMotionValue(0);
  const glowOpacity = useMotionValue(0);

  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [TILT, -TILT]), tiltSpring);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-TILT, TILT]), tiltSpring);
  const sheen = useMotionTemplate`radial-gradient(24rem circle at ${gx}px ${gy}px, ${ceremony.glow}, transparent 65%)`;

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (!interactive) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      gx.set(x);
      gy.set(y);
      px.set(x / rect.width - 0.5);
      py.set(y / rect.height - 0.5);
      glowOpacity.set(1);
    },
    [interactive, gx, gy, px, py, glowOpacity]
  );

  const handlePointerLeave = useCallback(() => {
    px.set(0);
    py.set(0);
    glowOpacity.set(0);
  }, [px, py, glowOpacity]);

  const formattedDate = formatWeddingDate(event.date, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return (
    // Parallax sits on the outer wrapper because `fadeUp` also drives `y`, and
    // the perspective has to live on an ancestor of the tilting element.
    <m.div style={{ y }} className="h-full [perspective:1200px]">
      <m.article
        variants={fadeUp}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        whileHover={interactive ? undefined : { y: -6 }}
        style={interactive ? { rotateX, rotateY, transformStyle: "preserve-3d" } : undefined}
        className={`group/ticket relative flex h-full flex-col overflow-hidden rounded-xl border border-gold/25 ${ceremony.surface} shadow-sm transition-[box-shadow,border-color] duration-300 hover:shadow-xl focus-within:shadow-xl ${ceremony.edge}`}
      >
        {/*
          Ceremony watermark. Large, barely-there, and clipped by the card's
          corner — it's what makes a haldi card read as a haldi card from across
          the page, before any of the text is legible.
        */}
        <ceremony.Icon
          aria-hidden="true"
          className={`pointer-events-none absolute -top-6 -right-6 size-32 opacity-[0.07] ${ceremony.text}`}
          strokeWidth={1}
        />

        {/*
          Specular highlight tracking the cursor. Opacity is a motion value
          rather than a hover class so it fades rather than snapping when the
          pointer leaves mid-card.
        */}
        {interactive && (
          <m.span
            aria-hidden="true"
            style={{ backgroundImage: sheen, opacity: glowOpacity }}
            className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
          />
        )}

        {/* Stub rail — the ticket's torn-off edge. */}
        <span
          aria-hidden="true"
          className={`absolute inset-y-0 left-0 w-8 ${ceremony.rail} opacity-[0.14]`}
        />
        <span
          aria-hidden="true"
          className={`absolute inset-y-0 left-8 w-px ${ceremony.rail} opacity-30`}
        />
        <span
          aria-hidden="true"
          className={`absolute top-5 left-0 flex w-8 justify-center text-[0.625rem] font-semibold tracking-[0.2em] [writing-mode:vertical-rl] ${ceremony.text}`}
        >
          {`DAY ${String(day).padStart(2, "0")}`}
        </span>

        {/* `flex-1` here is what equalises the cards: this block absorbs the
            slack, so every stub below lands on the same line across the row. */}
        <div className="relative flex flex-1 flex-col gap-3 py-6 pr-6 pl-12">
          <span
            className={`flex size-11 items-center justify-center rounded-full ${ceremony.chip} transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover/ticket:scale-110 group-hover/ticket:-rotate-6 group-focus-within/ticket:scale-110`}
          >
            <ceremony.Icon className="size-5" aria-hidden="true" />
          </span>

          <h3 className="font-display text-xl leading-tight text-charcoal">{event.name}</h3>

          <p className={`text-sm font-semibold tracking-wide ${ceremony.text}`}>
            <time dateTime={event.date}>{formattedDate}</time>
            <span aria-hidden="true"> &middot; </span>
            {event.time}
          </p>

          <p className="text-sm leading-relaxed text-charcoal-muted">{event.description}</p>
        </div>

        {/*
          Perforation. The notches are discs in the *section's* colour, not the
          card's, so they read as punched through it. `overflow-hidden` on the
          article clips each one to the half that falls inside the edge — which
          is exactly the bite a real perforation leaves.
        */}
        <div aria-hidden="true" className="relative px-12">
          <span className="absolute top-1/2 -left-2 size-4 -translate-y-1/2 rounded-full bg-ivory" />
          <span className="absolute top-1/2 -right-2 size-4 -translate-y-1/2 rounded-full bg-ivory" />
          <span className="block border-t border-dashed border-gold/40" />
        </div>

        {/* Stub footer — where a real ticket prints the venue and admission. */}
        <div className="relative flex flex-col gap-2 py-5 pr-6 pl-12">
          <p className="text-xs tracking-[0.14em] text-charcoal-muted/70 uppercase">Venue</p>

          {event.mapUrl ? (
            /*
              No button. The venue *is* the link — a pin and an underline on the
              address the guest was already reading, rather than a second control
              underneath repeating it.

              Deliberately not stretched over the whole card: the card is a
              `relative` ancestor chain, the sheen already owns the overlay
              layer, and a full-bleed hit area would swallow text selection on
              the description for a target nobody is struggling to hit.
            */
            <a
              href={event.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-9 w-fit items-start gap-1.5 text-sm leading-snug text-charcoal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <MapPin
                className={`mt-0.5 size-4 shrink-0 ${ceremony.text} transition-transform duration-300 group-hover/ticket:-translate-y-0.5`}
                aria-hidden="true"
              />
              <span className="underline decoration-gold/30 decoration-1 underline-offset-4 transition-colors duration-300 group-hover/ticket:decoration-gold">
                {event.venue}
              </span>
              <span className="sr-only">, map for {event.name}</span>
            </a>
          ) : (
            <p className="min-h-9 text-sm leading-snug text-charcoal">{event.venue}</p>
          )}
        </div>
      </m.article>
    </m.div>
  );
}
