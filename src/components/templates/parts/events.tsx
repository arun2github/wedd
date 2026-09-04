"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";
import { formatWeddingDate } from "@/lib/format-date";
import type { WeddingEvent } from "@/types/wedding";

/**
 * Event variants.
 *
 * Four architectures ran events→story→venue→rsvp in the same shape, so the
 * ceremonies — the section that carries the whole multi-day argument — looked
 * the same on most designs. These are three different objects made from the
 * same data.
 */

export interface EventsProps {
  events: WeddingEvent[];
  /** Gallery images, used by the variant that gives each ceremony a picture. */
  photos: { src: string; alt: string }[];
}

const RITES = ["rite-1", "rite-2", "brand", "rite-3"] as const;
const shortDate = (d: string) => formatWeddingDate(d, { day: "numeric", month: "short" });
const longDate = (d: string) => formatWeddingDate(d, { day: "numeric", month: "long" });

function MapLink({ event, tone }: { event: WeddingEvent; tone: string }) {
  if (!event.mapUrl) return <p className="mt-2 text-sm text-ink-soft">{event.venue}</p>;
  return (
    <a
      href={event.mapUrl}
      target="_blank"
      rel="noreferrer"
      className="mt-2 inline-flex items-center gap-1.5 text-sm underline decoration-gilt underline-offset-4"
      style={{ color: `var(--${tone})` }}
    >
      <MapPin className="size-3.5" aria-hidden="true" />
      {event.venue}
    </a>
  );
}

/** `timeline` — days running left to right, read as a week rather than a list. */
export function EventsTimeline({ events }: EventsProps) {
  return (
    <section id="events" className="py-20">
      <h2 className="px-6 text-[0.62rem] uppercase tracking-[0.32em] text-ink-soft md:px-12">
        The ceremonies
      </h2>
      <div className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-4 md:px-12">
        {events.map((e, i) => (
          <article key={e.name} className="w-72 shrink-0 snap-start sm:w-80">
            {/* The rail each day hangs from, with its own colour marker. */}
            <div className="relative border-t border-gilt/40 pt-5">
              <span
                aria-hidden="true"
                className="absolute -top-1 left-0 size-2 rotate-45"
                style={{ background: `var(--${RITES[i % 4]})` }}
              />
              <p className="text-[0.58rem] uppercase tracking-[0.24em]" style={{ color: `var(--${RITES[i % 4]})` }}>
                {shortDate(e.date)} · {e.time}
              </p>
              <h3 className="mt-2 font-display text-2xl leading-tight text-brand">{e.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{e.description}</p>
              <MapLink event={e} tone={RITES[i % 4]} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/** `schedule` — a ruled vertical order, printed rather than designed. */
export function EventsSchedule({ events }: EventsProps) {
  return (
    <section id="events" className="mx-auto max-w-2xl px-6 py-20">
      <div className="flex items-center gap-4">
        <span className="h-px flex-1 bg-gilt/40" />
        <h2 className="text-[0.6rem] uppercase tracking-[0.34em] text-ink-soft">The order of the day</h2>
        <span className="h-px flex-1 bg-gilt/40" />
      </div>
      <ol className="mt-10">
        {events.map((e, i) => (
          <li key={e.name} className="grid grid-cols-[3.5rem_1fr] gap-5 border-b border-gilt/25 py-6 last:border-b-0">
            <span className="font-display text-lg text-gilt-ink">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h3 className="font-display text-2xl leading-tight text-brand">{e.name}</h3>
              <p className="mt-1 text-[0.66rem] uppercase tracking-[0.22em] text-ink-soft">
                {longDate(e.date)} · {e.time}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{e.description}</p>
              <MapLink event={e} tone="brand" />
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** `cards` — one photograph per ceremony, so the days are seen not read. */
export function EventsCards({ events, photos }: EventsProps) {
  return (
    <section id="events" className="px-6 py-20 md:px-12">
      <h2 className="text-[0.62rem] uppercase tracking-[0.32em] text-ink-soft">The ceremonies</h2>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {events.map((e, i) => (
          <article key={e.name} className="group">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={photos[(i * 3) % photos.length]?.src ?? photos[0].src}
                alt=""
                fill
                sizes="(min-width:1280px) 22vw, (min-width:640px) 45vw, 90vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div
                className="absolute inset-0"
                style={{ background: `color-mix(in oklab, var(--${RITES[i % 4]}) 34%, transparent)` }}
              />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-[0.56rem] uppercase tracking-[0.24em] text-[var(--surface)]/80">
                  {shortDate(e.date)} · {e.time}
                </p>
                <h3 className="mt-1 font-display text-2xl leading-tight text-[var(--surface)]">{e.name}</h3>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{e.description}</p>
            <MapLink event={e} tone={RITES[i % 4]} />
          </article>
        ))}
      </div>
    </section>
  );
}
