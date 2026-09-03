import Image from "next/image";
import { MapPin } from "lucide-react";
import { RSVP } from "@/components/sections/RSVP";
import { TemplateNav } from "./TemplateNav";
import { CountdownPlate } from "@/components/sections/countdowns";
import { formatWeddingDate } from "@/lib/format-date";
import { Rise, Signature } from "./Rise";
import type { WeddingData } from "@/types/wedding";

/**
 * The `album` archetype: photographs first, words in the margin.
 *
 * Laid out as a printed album — full-bleed plates, numbered, on an asymmetric
 * grid that never settles into a column. Text is deliberately subordinate:
 * captions are small and set to one side, the way a plate is captioned rather
 * than described. Where `scroll` uses a photograph as a backdrop for words,
 * this inverts it — the words exist to say what you are looking at.
 *
 * No lattice, no rules, no cinematic intro, no centred stack. The grid offsets
 * are the design, which is why this reads as a different product from the other
 * three rather than the same one repainted.
 */

/** Plates alternate their offset so no two sit on the same axis. */
const OFFSETS = [
  "md:col-span-7 md:col-start-1",
  "md:col-span-5 md:col-start-8 md:mt-24",
  "md:col-span-6 md:col-start-3 md:mt-16",
  "md:col-span-5 md:col-start-9",
  "md:col-span-8 md:col-start-1 md:mt-20",
  "md:col-span-4 md:col-start-9 md:mt-8",
];

export function AlbumInvitation({ data }: { data: WeddingData }) {
  const { couple, events, story, venue, gallery, families, weddingDate, invitationMessage } = data;

  return (
    <div className="min-h-dvh bg-surface text-ink">
      <span id="top" />
      <TemplateNav
        brideName={couple.brideName}
        groomName={couple.groomName}
        links={[{ href: "#gallery", label: "Plates" }, { href: "#events", label: "The days" }, { href: "#story", label: "Our story" }, { href: "#venue", label: "Venue" }, { href: "#rsvp", label: "Reply" }]}
      />
      {/* --------------------------------------------------- plate: opening */}
      <header className="relative">
        <div className="relative aspect-[3/4] w-full sm:aspect-[16/9]">
          <Image src={couple.heroPhoto} alt="" fill sizes="100vw" priority className="object-cover" />
        </div>
        {/* The caption sits under the plate, not over it — an album does not
            print its title across the photograph. */}
        <div className="grid gap-6 px-6 py-10 md:grid-cols-12 md:px-12">
          <div className="md:col-span-3">
            <p className="text-[0.58rem] uppercase tracking-[0.3em] text-ink-soft">Plate one</p>
            <p className="mt-2 text-[0.62rem] uppercase tracking-[0.22em] text-gilt-ink">
              {formatWeddingDate(weddingDate, { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <h1 className="font-display text-[clamp(2.4rem,6vw,4.6rem)] leading-[0.98] text-brand md:col-span-6">
            <Signature>{couple.brideName}</Signature> <span className="text-gilt-ink">&</span> <Signature>{couple.groomName}</Signature>
          </h1>
          <p className="text-sm leading-relaxed text-ink-soft md:col-span-3">{invitationMessage}</p>
        </div>
      </header>

      {/* ------------------------------------------- plates on an offset grid */}
      <section id="gallery" className="grid gap-y-12 px-6 pb-16 md:grid-cols-12 md:gap-x-6 md:px-12">
        {gallery.slice(0, 6).map((img, i) => (
          <Rise key={img.src} delay={(i % 3) * 0.07} className={OFFSETS[i]}>
          <figure>
            <div className={`relative w-full ${i % 3 === 1 ? "aspect-[3/4]" : "aspect-[4/3]"}`}>
              <Image src={img.src} alt={img.alt} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
            </div>
            <figcaption className="mt-3 flex items-baseline gap-3">
              <span className="text-[0.58rem] uppercase tracking-[0.26em] text-gilt-ink">
                {String(i + 2).padStart(2, "0")}
              </span>
              <span className="text-xs leading-snug text-ink-soft">{img.alt}</span>
            </figcaption>
          </figure>
          </Rise>
        ))}
      </section>

      {/* ---------------------------------------- the days, as a caption list */}
      <section id="events" className="grid gap-8 border-t border-gilt/30 px-6 py-16 md:grid-cols-12 md:px-12">
        <h2 className="text-[0.6rem] uppercase tracking-[0.3em] text-ink-soft md:col-span-3">
          The days
        </h2>
        <div className="md:col-span-9">
          {events.map((e) => (
            <article key={e.name} className="grid gap-2 border-b border-gilt/25 py-6 last:border-b-0 sm:grid-cols-[9rem_1fr] sm:gap-8">
              <p className="text-[0.62rem] uppercase tracking-[0.2em] text-gilt-ink">
                {formatWeddingDate(e.date, { day: "numeric", month: "short" })}
                <span className="block text-ink-soft">{e.time}</span>
              </p>
              <div>
                <h3 className="font-display text-3xl leading-tight text-brand">{e.name}</h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">{e.description}</p>
                {e.mapUrl && (
                  <a
                    href={e.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-sm text-brand underline decoration-gilt underline-offset-4"
                  >
                    <MapPin className="size-3.5" aria-hidden="true" />
                    {e.venue}
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* --------------------------------------------- two portraits, offset */}
      <section className="grid gap-10 px-6 py-16 md:grid-cols-12 md:px-12">
        <figure className="md:col-span-5 md:col-start-1">
          <div className="relative aspect-[4/5] w-full">
            <Image src={couple.bridePhoto} alt="" fill sizes="45vw" className="object-cover" />
          </div>
          <figcaption className="mt-3">
            <p className="font-display text-2xl text-brand">{couple.brideName}</p>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">{couple.brideIntro}</p>
          </figcaption>
        </figure>
        <figure className="md:col-span-5 md:col-start-7 md:mt-28">
          <div className="relative aspect-[4/5] w-full">
            <Image src={couple.groomPhoto} alt="" fill sizes="45vw" className="object-cover" />
          </div>
          <figcaption className="mt-3">
            <p className="font-display text-2xl text-brand">{couple.groomName}</p>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">{couple.groomIntro}</p>
          </figcaption>
        </figure>
      </section>

      {/* ------------------------------------------------------------ story */}
      <section id="story" className="grid gap-8 border-t border-gilt/30 px-6 py-16 md:grid-cols-12 md:px-12">
        <h2 className="text-[0.6rem] uppercase tracking-[0.3em] text-ink-soft md:col-span-3">
          How they met
        </h2>
        <div className="grid gap-8 md:col-span-9 sm:grid-cols-2">
          {story.map((m) => (
            <div key={m.title}>
              <p className="text-[0.58rem] uppercase tracking-[0.24em] text-gilt-ink">{m.date}</p>
              <h3 className="mt-2 font-display text-xl text-brand">{m.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{m.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------- venue as a plate */}
      <section id="venue" className="relative">
        <div className="relative aspect-[16/9] w-full">
          <Image src={venue.image} alt={venue.name} fill sizes="100vw" className="object-cover" />
        </div>
        <div className="grid gap-6 px-6 py-10 md:grid-cols-12 md:px-12">
          <p className="text-[0.58rem] uppercase tracking-[0.3em] text-ink-soft md:col-span-3">The venue</p>
          <div className="md:col-span-6">
            <h2 className="font-display text-4xl text-brand">{venue.name}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{venue.address}</p>
            <a
              href={venue.directionsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm text-brand underline decoration-gilt underline-offset-4"
            >
              <MapPin className="size-3.5" aria-hidden="true" />
              Directions
            </a>
          </div>
          <div className="text-sm text-ink-soft md:col-span-3">
            {[families.brideFamily, families.groomFamily].map((f) => (
              <p key={f.title} className="mb-3">
                <span className="block text-[0.56rem] uppercase tracking-[0.22em] text-gilt-ink">{f.title}</span>
                {f.names}
              </p>
            ))}
          </div>
        </div>
      </section>

      <CountdownPlate date={weddingDate} />

      {data.video?.url && (
        <section className="border-t border-gilt/30 px-6 py-16 md:px-12">
          <p className="text-[0.58rem] uppercase tracking-[0.3em] text-ink-soft">The film</p>
          <div className="relative mt-5 aspect-video w-full">
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

      {/* Colophon — how an album signs off. */}
      <footer className="grid gap-6 border-t border-gilt/30 px-6 py-20 md:grid-cols-12 md:px-12">
        <p className="text-[0.58rem] uppercase tracking-[0.3em] text-ink-soft md:col-span-3">
          Plate the last
        </p>
        <div className="md:col-span-9">
          <Signature className="block text-[clamp(2rem,6vw,3.6rem)] leading-none text-brand">
            {couple.brideName} & {couple.groomName}
          </Signature>
          <p className="mt-3 text-xs uppercase tracking-[0.24em] text-ink-soft">
            {formatWeddingDate(weddingDate, { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </footer>
    </div>
  );
}
