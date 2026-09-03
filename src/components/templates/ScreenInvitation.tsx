import Image from "next/image";
import { MapPin } from "lucide-react";
import { RSVP } from "@/components/sections/RSVP";
import { TemplateNav } from "./TemplateNav";
import { CountdownCells } from "@/components/sections/countdowns";
import { formatWeddingDate } from "@/lib/format-date";
import { Rise, Signature } from "./Rise";
import type { WeddingData } from "@/types/wedding";

/**
 * The `screen` archetype: everything seen through a lattice.
 *
 * A jali is a perforated stone screen — it exists to pass light and a view
 * while keeping what is behind it private, which is exactly what an invitation
 * does. So this architecture never shows a photograph whole: images arrive
 * inside a pierced frame, and the page is built from panels set into a grid
 * rather than from full-width bands stacked in a column.
 *
 * Structurally unlike `scroll` (cinematic, full-bleed, linear) and unlike
 * `program` (one narrow measure, ruled, sequential). Two columns from the
 * start, hard geometric borders, no cinematic intro, and the ornament is
 * structural rather than applied — the lattice *is* the layout.
 */

/** One eight-fold girih unit, tiled. Drawn rather than imported so it inherits
 *  the template's metal instead of shipping a coloured asset. */
function Lattice({ className = "", opacity = 0.22 }: { className?: string; opacity?: number }) {
  return (
    <svg aria-hidden="true" className={className} style={{ opacity }}>
      <defs>
        <pattern id="girih" width="56" height="56" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="var(--gilt)" strokeWidth="1">
            <path d="M28 2 34 14 46 14 38 24 42 38 28 31 14 38 18 24 10 14 22 14Z" />
            <circle cx="28" cy="28" r="20" />
            <path d="M0 28H8M48 28H56M28 0V8M28 48V56" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#girih)" />
    </svg>
  );
}

/** A photograph seen through the screen, never whole. */
function Pierced({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden border border-gilt/45 ${className}`}>
      <Image src={src} alt={alt} fill sizes="(min-width:768px) 40vw, 90vw" className="object-cover" />
      <Lattice className="absolute inset-0 size-full" opacity={0.3} />
    </div>
  );
}

export function ScreenInvitation({ data }: { data: WeddingData }) {
  const { couple, events, story, venue, gallery, families, weddingDate, invitationMessage } = data;

  return (
    <div className="min-h-dvh bg-surface text-ink">
      <span id="top" />
      <TemplateNav
        brideName={couple.brideName}
        groomName={couple.groomName}
        links={[{ href: "#events", label: "Ceremonies" }, { href: "#story", label: "Our story" }, { href: "#venue", label: "Venue" }, { href: "#rsvp", label: "Reply" }]}
      />
      {/* ----------------------------------------------- the screen opens */}
      <header className="relative isolate grid min-h-[88vh] items-center gap-8 px-6 py-16 md:grid-cols-2 md:px-12">
        <Lattice className="absolute inset-0 -z-10 size-full" opacity={0.14} />

        <div className="order-2 md:order-1">
          <p className="text-[0.6rem] uppercase tracking-[0.38em] text-ink-soft">
            {formatWeddingDate(weddingDate, { day: "numeric", month: "long", year: "numeric" })}
          </p>
          {/* Names stacked, not centred — the screen is read from one side. */}
          <h1 className="mt-6 font-display text-[clamp(2.8rem,8vw,5.5rem)] leading-[0.92] text-brand">
            <Signature className="block">{couple.brideName}</Signature>
            <span className="block py-2 font-script text-[0.5em] text-gilt-ink">and</span>
            <Signature className="block">{couple.groomName}</Signature>
          </h1>
          <p className="mt-8 max-w-sm text-sm leading-relaxed text-ink-soft">{invitationMessage}</p>
        </div>

        {/* The arch, cut into the screen. */}
        <div className="order-1 md:order-2">
          <Pierced
            src={couple.heroPhoto}
            alt=""
            className="aspect-[3/4] [border-radius:999px_999px_4px_4px]"
          />
        </div>
      </header>

      {/* ------------------------------------------- ceremonies as panels */}
      <section id="events" className="border-t border-gilt/30 px-6 py-16 md:px-12">
        <h2 className="text-[0.62rem] uppercase tracking-[0.32em] text-ink-soft">The ceremonies</h2>
        {/* A grid of framed panels, not a stack of bands. */}
        <Rise>
        <div className="mt-8 grid gap-px bg-gilt/30 md:grid-cols-2 xl:grid-cols-4">
          {events.map((e, i) => (
            <article key={e.name} className="relative isolate bg-surface p-7">
              <Lattice className="absolute inset-0 -z-10 size-full" opacity={0.08} />
              <p className="text-[0.58rem] uppercase tracking-[0.26em] text-ink-soft">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-4 font-display text-2xl leading-tight text-brand">{e.name}</h3>
              <p className="mt-2 text-[0.68rem] uppercase tracking-[0.2em] text-ink-soft">
                {formatWeddingDate(e.date, { day: "numeric", month: "short" })} · {e.time}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-ink-soft">{e.description}</p>
              {e.mapUrl && (
                <a
                  href={e.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm text-brand underline decoration-gilt underline-offset-4"
                >
                  <MapPin className="size-3.5" aria-hidden="true" />
                  {e.venue}
                </a>
              )}
            </article>
          ))}
        </div>
        </Rise>
      </section>

      {/* --------------------------------------------- story beside a screen */}
      <section id="story" className="grid gap-10 border-t border-gilt/30 px-6 py-16 md:grid-cols-[0.85fr_1.15fr] md:px-12">
        <Pierced src={gallery[3]?.src ?? couple.bridePhoto} alt="" className="aspect-[4/5]" />
        <div>
          <h2 className="text-[0.62rem] uppercase tracking-[0.32em] text-ink-soft">How they met</h2>
          <div className="mt-8 grid gap-px bg-gilt/25">
            {story.map((m) => (
              <div key={m.title} className="bg-surface py-5">
                <p className="text-[0.58rem] uppercase tracking-[0.22em] text-gilt-ink">{m.date}</p>
                <h3 className="mt-1.5 font-display text-xl text-brand">{m.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{m.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ couple, two panels */}
      <section className="grid gap-px border-t border-gilt/30 bg-gilt/25 md:grid-cols-2">
        {[
          { name: couple.brideName, intro: couple.brideIntro, photo: couple.bridePhoto },
          { name: couple.groomName, intro: couple.groomIntro, photo: couple.groomPhoto },
        ].map((p) => (
          <div key={p.name} className="grid gap-6 bg-surface p-8 sm:grid-cols-[10rem_1fr] md:p-10">
            <Pierced src={p.photo} alt="" className="aspect-square" />
            <div>
              <h3 className="font-script text-4xl text-brand">{p.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{p.intro}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ------------------------------------------------------- venue + grid */}
      <section id="venue" className="grid gap-10 border-t border-gilt/30 px-6 py-16 md:grid-cols-2 md:px-12">
        <div>
          <h2 className="text-[0.62rem] uppercase tracking-[0.32em] text-ink-soft">The venue</h2>
          <h3 className="mt-5 font-display text-4xl text-brand">{venue.name}</h3>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-soft">{venue.address}</p>
          <a
            href={venue.directionsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 text-sm text-brand underline decoration-gilt underline-offset-4"
          >
            <MapPin className="size-3.5" aria-hidden="true" />
            Directions
          </a>
          <div className="mt-8 grid grid-cols-3 gap-px bg-gilt/25">
            {gallery.slice(0, 6).map((img) => (
              <div key={img.src} className="relative aspect-square bg-surface">
                <Image src={img.src} alt={img.alt} fill sizes="12rem" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
        <Pierced src={venue.image} alt={venue.name} className="aspect-[4/5]" />
      </section>

      {/* ------------------------------------------------------- families */}
      <section className="relative isolate border-t border-gilt/30 px-6 py-16 text-center md:px-12">
        <Lattice className="absolute inset-0 -z-10 size-full" opacity={0.1} />
        <h2 className="text-[0.62rem] uppercase tracking-[0.32em] text-ink-soft">With the blessings of</h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          {[families.brideFamily, families.groomFamily].map((f) => (
            <div key={f.title}>
              <p className="text-[0.58rem] uppercase tracking-[0.24em] text-ink-soft">{f.title}</p>
              <p className="mt-2 font-display text-2xl text-brand">{f.names}</p>
            </div>
          ))}
        </div>
      </section>

      <CountdownCells date={weddingDate} />

      {data.video?.url && (
        <section className="border-t border-gilt/30 px-6 py-16 md:px-12">
          <h2 className="text-[0.62rem] uppercase tracking-[0.32em] text-ink-soft">Our film</h2>
          <div className="relative mt-6 aspect-video w-full overflow-hidden border border-gilt/45">
            <iframe
              src={data.video.url}
              title={data.video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
              allowFullScreen
              className="size-full"
            />
          </div>
        </section>
      )}

      <div id="rsvp"><RSVP rsvp={data.rsvp} /></div>

      {/* The screen closes. */}
      <footer className="relative isolate border-t border-gilt/30 px-6 py-20 text-center md:px-12">
        <Lattice className="absolute inset-0 -z-10 size-full" opacity={0.12} />
        <Signature className="block text-[clamp(2rem,7vw,3.5rem)] leading-none text-brand">
          {couple.brideName} & {couple.groomName}
        </Signature>
        <p className="mt-4 text-[0.6rem] uppercase tracking-[0.3em] text-ink-soft">
          {formatWeddingDate(weddingDate, { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </footer>
    </div>
  );
}
