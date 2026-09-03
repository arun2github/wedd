import Image from "next/image";
import { MapPin } from "lucide-react";
import { RSVP } from "@/components/sections/RSVP";
import { TemplateNav } from "./TemplateNav";
import { CountdownRibbon } from "@/components/sections/countdowns";
import { formatWeddingDate } from "@/lib/format-date";
import { Rise, Signature } from "./Rise";
import type { WeddingData } from "@/types/wedding";

/**
 * `patrika` — a scroll that unrolls.
 *
 * One continuous vertical band with a hard edge either side, the way a rolled
 * invitation opens: content is centred inside a fixed narrow ribbon that runs
 * unbroken from the top of the page to the bottom, with no section boundaries
 * at all. Every other architecture divides the page into blocks; this one
 * refuses to, and that refusal is the design.
 *
 * Deckled edges top and bottom, a repeating side border, and dates set in the
 * band's margin. Nothing is full-bleed and nothing is gridded.
 */
export function PatrikaInvitation({ data }: { data: WeddingData }) {
  const { couple, events, story, venue, gallery, families, weddingDate, invitationMessage } = data;

  return (
    <div className="min-h-dvh bg-surface-sunk py-6 text-ink sm:py-10">
      <span id="top" />
      <TemplateNav
        brideName={couple.brideName}
        groomName={couple.groomName}
        links={[{ href: "#events", label: "Ceremonies" }, { href: "#story", label: "Our story" }, { href: "#venue", label: "Venue" }, { href: "#rsvp", label: "Reply" }]}
      />
      {/* The rolled band itself — one column, edge to edge, never broken. */}
      <div className="relative mx-auto w-full max-w-xl bg-surface px-6 shadow-[0_0_60px_rgba(0,0,0,0.12)] sm:px-10">
        {/* Rolled ends. */}
        <div aria-hidden="true" className="absolute inset-x-0 -top-3 h-6 rounded-full bg-brand/90" />
        <div aria-hidden="true" className="absolute inset-x-0 -bottom-3 h-6 rounded-full bg-brand/90" />
        {/* The band's own selvedge, repeating down both sides. */}
        <div aria-hidden="true" className="absolute inset-y-6 left-0 w-1.5 bg-[repeating-linear-gradient(180deg,var(--gilt)_0_6px,transparent_6px_14px)] opacity-60" />
        <div aria-hidden="true" className="absolute inset-y-6 right-0 w-1.5 bg-[repeating-linear-gradient(180deg,var(--gilt)_0_6px,transparent_6px_14px)] opacity-60" />

        {/* The scroll's head — a photograph the ribbon unrolls out of. */}
        <div className="relative -mx-6 h-64 overflow-hidden sm:-mx-10 sm:h-80">
          <Image src={couple.heroPhoto} alt="" fill sizes="40rem" priority className="object-cover" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--surface)]" />
        </div>

        <div className="py-16 text-center">
          <p className="text-[0.58rem] uppercase tracking-[0.4em] text-ink-soft">
            {formatWeddingDate(weddingDate, { day: "numeric", month: "long", year: "numeric" })}
          </p>
          <h1 className="mt-10 font-display text-[clamp(2.6rem,10vw,4.6rem)] leading-[1.05] text-brand">
            <Signature className="block">{couple.brideName}</Signature>
            <span className="block py-1 font-script text-[0.55em] text-gilt-ink">and</span>
            <Signature className="block">{couple.groomName}</Signature>
          </h1>
          <p className="mx-auto mt-8 max-w-sm text-sm leading-loose text-ink-soft">{invitationMessage}</p>

          <span aria-hidden="true" className="mx-auto mt-16 block h-px w-24 bg-gilt/60" />

          {/* Everything below continues in the same column. No new sections,
              no new grid — the scroll simply keeps unrolling. */}
          <CountdownRibbon date={weddingDate} />

          <p className="mt-16 text-[0.58rem] uppercase tracking-[0.36em] text-gilt-ink">The ceremonies</p>
          {events.map((e, i) => (
            <Rise key={e.name} delay={i * 0.05} className="mt-10">
              <h2 className="font-display text-3xl text-brand">{e.name}</h2>
              <p className="mt-2 text-[0.62rem] uppercase tracking-[0.24em] text-ink-soft">
                {formatWeddingDate(e.date, { day: "numeric", month: "long" })} · {e.time}
              </p>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-loose text-ink-soft">{e.description}</p>
              {e.mapUrl && (
                <a href={e.mapUrl} target="_blank" rel="noreferrer"
                   className="mt-3 inline-flex items-center gap-1.5 text-sm text-brand underline decoration-gilt underline-offset-4">
                  <MapPin className="size-3.5" aria-hidden="true" />{e.venue}
                </a>
              )}
            </Rise>
          ))}

          <span aria-hidden="true" className="mx-auto mt-16 block h-px w-24 bg-gilt/60" />

          <p className="mt-16 text-[0.58rem] uppercase tracking-[0.36em] text-gilt-ink">Our story</p>
          {story.map((m) => (
            <div key={m.title} className="mt-9">
              <p className="text-[0.58rem] uppercase tracking-[0.22em] text-ink-soft">{m.date}</p>
              <h3 className="mt-1.5 font-display text-2xl text-brand">{m.title}</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-loose text-ink-soft">{m.description}</p>
            </div>
          ))}

          <div className="relative mx-auto mt-16 aspect-[3/4] w-56 overflow-hidden rounded-full border-2 border-gilt/50">
            <Image src={couple.heroPhoto} alt="" fill sizes="14rem" className="object-cover" />
          </div>

          <span aria-hidden="true" className="mx-auto mt-16 block h-px w-24 bg-gilt/60" />

          {/* The couple, still in the same column — the ribbon never splits. */}
          <p className="mt-16 text-[0.58rem] uppercase tracking-[0.36em] text-gilt-ink">The couple</p>
          {[
            { name: couple.brideName, intro: couple.brideIntro, photo: couple.bridePhoto },
            { name: couple.groomName, intro: couple.groomIntro, photo: couple.groomPhoto },
          ].map((person) => (
            <Rise key={person.name} className="mt-10">
              <div className="relative mx-auto aspect-square w-36 overflow-hidden rounded-full border border-gilt/50">
                <Image src={person.photo} alt="" fill sizes="9rem" className="object-cover" />
              </div>
              <p className="mt-4 font-script text-3xl text-brand">{person.name}</p>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-loose text-ink-soft">{person.intro}</p>
            </Rise>
          ))}

          {data.video?.url && (
            <>
              <span aria-hidden="true" className="mx-auto mt-16 block h-px w-24 bg-gilt/60" />
              <p className="mt-16 text-[0.58rem] uppercase tracking-[0.36em] text-gilt-ink">Our film</p>
              <div className="relative mt-6 aspect-video w-full overflow-hidden border border-gilt/40">
                <iframe
                  src={data.video.url}
                  title={data.video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                  allowFullScreen
                  className="size-full"
                />
              </div>
            </>
          )}

          <span aria-hidden="true" className="mx-auto mt-16 block h-px w-24 bg-gilt/60" />

          <p className="mt-16 text-[0.58rem] uppercase tracking-[0.36em] text-gilt-ink">The venue</p>
          <h2 className="mt-4 font-display text-3xl text-brand">{venue.name}</h2>
          <p className="mx-auto mt-2 max-w-xs text-sm leading-loose text-ink-soft">{venue.address}</p>
          <a href={venue.directionsUrl} target="_blank" rel="noreferrer"
             className="mt-3 inline-flex items-center gap-1.5 text-sm text-brand underline decoration-gilt underline-offset-4">
            <MapPin className="size-3.5" aria-hidden="true" />Directions
          </a>

          <div className="mx-auto mt-14 grid max-w-sm grid-cols-2 gap-2">
            {gallery.slice(0, 4).map((img) => (
              <div key={img.src} className="relative aspect-square overflow-hidden rounded-full border border-gilt/40">
                <Image src={img.src} alt={img.alt} fill sizes="10rem" className="object-cover" />
              </div>
            ))}
          </div>

          <span aria-hidden="true" className="mx-auto mt-16 block h-px w-24 bg-gilt/60" />

          <div className="mt-16 grid gap-8 sm:grid-cols-2">
            {[families.brideFamily, families.groomFamily].map((f) => (
              <div key={f.title}>
                <p className="text-[0.56rem] uppercase tracking-[0.24em] text-gilt-ink">{f.title}</p>
                <p className="mt-2 font-display text-xl text-brand">{f.names}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 w-full max-w-xl">
        <div id="rsvp"><RSVP rsvp={data.rsvp} /></div>
      </div>

      {/* The foot of the scroll. */}
      <div className="mx-auto mt-10 w-full max-w-xl bg-surface py-16 text-center shadow-[0_0_60px_rgba(0,0,0,0.12)]">
        <Signature className="block text-[clamp(2rem,7vw,3.2rem)] leading-none text-brand">
          {couple.brideName} & {couple.groomName}
        </Signature>
        <p className="mt-4 text-[0.58rem] uppercase tracking-[0.32em] text-ink-soft">
          {formatWeddingDate(weddingDate, { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>
    </div>
  );
}
