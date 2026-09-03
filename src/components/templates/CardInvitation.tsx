import Image from "next/image";
import { MapPin } from "lucide-react";
import { RSVP } from "@/components/sections/RSVP";
import { TemplateNav } from "./TemplateNav";
import { CountdownLine } from "@/components/sections/countdowns";
import { formatWeddingDate } from "@/lib/format-date";
import { Rise, Signature } from "./Rise";
import type { WeddingData } from "@/types/wedding";

/**
 * `card` — the whole wedding on one card.
 *
 * A single ornate panel that holds everything at once: no scrolling to reach
 * the ceremonies, no sections to move between. It is the printed card itself,
 * reproduced — dense, symmetrical, bordered, and read in one look the way you
 * read a card that arrives in an envelope.
 *
 * The opposite discipline to every other architecture here. Where `album`
 * spreads content across plates and `panel` deals it out sideways, this one
 * compresses all of it into a single framed rectangle and lets the ornament
 * carry the hierarchy.
 */
export function CardInvitation({ data }: { data: WeddingData }) {
  const { couple, events, story, gallery, venue, families, weddingDate, invitationMessage } = data;

  return (
    <div className="relative isolate min-h-dvh px-4 py-8 text-ink sm:px-6 sm:py-14">
      <span id="top" />
      <TemplateNav
        brideName={couple.brideName}
        groomName={couple.groomName}
        links={[{ href: "#rsvp", label: "Reply" }]}
      />
      {/*
        The card lies on something. It was floating on flat colour, which is
        why it read as a box rather than as an object — a printed card is
        always photographed on a surface.
      */}
      <Image src={venue.image} alt="" fill sizes="100vw" priority className="-z-20 object-cover" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[color-mix(in_oklab,var(--brand-deep)_86%,transparent)]" />

      <Rise className="relative mx-auto max-w-3xl bg-surface p-2 shadow-2xl">
        {/* Double rule, the way a card is bordered — the outer in metal, the
            inner a hairline, with the corners left open. */}
        <div className="border-2 border-gilt/70 p-1">
          <div className="border border-gilt/40 px-6 py-12 text-center sm:px-12 sm:py-16">

            <p className="text-[0.55rem] uppercase tracking-[0.44em] text-ink-soft">
              Together with our families
            </p>

            <h1 className="mt-10 font-display text-[clamp(2.2rem,8vw,4rem)] leading-[1.08] text-brand">
              <Signature className="block">{couple.brideName}</Signature>
              <span className="block py-1 font-script text-[0.6em] text-gilt-ink">and</span>
              <Signature className="block">{couple.groomName}</Signature>
            </h1>

            <p className="mt-8 text-[0.62rem] uppercase tracking-[0.32em] text-ink-soft">
              {formatWeddingDate(weddingDate, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>

            <span aria-hidden="true" className="mx-auto my-9 flex w-40 items-center gap-2">
              <span className="h-px flex-1 bg-gilt/50" />
              <span className="size-1.5 rotate-45 bg-gilt" />
              <span className="h-px flex-1 bg-gilt/50" />
            </span>

            <p className="mx-auto max-w-md text-sm leading-loose text-ink-soft">{invitationMessage}</p>

            <CountdownLine date={weddingDate} />

            {/* Every ceremony, on the same card. Two columns so nothing is
                pushed below a fold that this architecture does not have. */}
            <div className="mt-12 grid gap-x-10 gap-y-8 text-left sm:grid-cols-2">
              {events.map((e, i) => (
                <div key={e.name} className="border-t border-gilt/35 pt-4">
                  <p className="text-[0.54rem] uppercase tracking-[0.24em]"
                     style={{ color: `var(--${(["rite-1", "rite-2", "brand", "rite-3"] as const)[i % 4]})` }}>
                    {formatWeddingDate(e.date, { day: "numeric", month: "long" })} · {e.time}
                  </p>
                  <h2 className="mt-1.5 font-display text-2xl text-brand">{e.name}</h2>
                  {e.mapUrl ? (
                    <a href={e.mapUrl} target="_blank" rel="noreferrer"
                       className="mt-1 inline-flex items-center gap-1.5 text-xs text-ink-soft underline decoration-gilt/60 underline-offset-4">
                      <MapPin className="size-3" aria-hidden="true" />{e.venue}
                    </a>
                  ) : (
                    <p className="mt-1 text-xs text-ink-soft">{e.venue}</p>
                  )}
                </div>
              ))}
            </div>

            {/* One photograph only, small, set into the card like a locket. */}
            <div className="relative mx-auto mt-12 aspect-square w-32 overflow-hidden rounded-full border-2 border-gilt/60">
              <Image src={couple.heroPhoto} alt="" fill sizes="8rem" className="object-cover" />
            </div>

            <p className="mt-10 font-display text-xl text-brand">{venue.name}</p>
            <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-ink-soft">{venue.address}</p>
            <a href={venue.directionsUrl} target="_blank" rel="noreferrer"
               className="mt-2 inline-flex items-center gap-1.5 text-xs text-brand underline decoration-gilt underline-offset-4">
              <MapPin className="size-3" aria-hidden="true" />Directions
            </a>

            {/*
              The remaining sections, kept inside the card rather than added
              below it. The architecture is "everything on one panel", so a
              second panel underneath would quietly become a different design —
              these are set tighter and smaller instead.
            */}
            <div className="mt-12 grid gap-8 border-t border-gilt/35 pt-8 text-left sm:grid-cols-2">
              {[
                { name: couple.brideName, intro: couple.brideIntro, photo: couple.bridePhoto },
                { name: couple.groomName, intro: couple.groomIntro, photo: couple.groomPhoto },
              ].map((person) => (
                <div key={person.name} className="flex gap-4">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-full border border-gilt/50">
                    <Image src={person.photo} alt="" fill sizes="4rem" className="object-cover" />
                  </div>
                  <div>
                    <p className="font-script text-2xl text-brand">{person.name}</p>
                    <p className="mt-1 text-xs leading-relaxed text-ink-soft">{person.intro}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 border-t border-gilt/35 pt-8 text-left">
              <p className="text-center text-[0.52rem] uppercase tracking-[0.3em] text-gilt-ink">Our story</p>
              <div className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {story.map((m) => (
                  <div key={m.title}>
                    <p className="text-[0.5rem] uppercase tracking-[0.2em] text-ink-soft">{m.date}</p>
                    <p className="mt-0.5 font-display text-base text-brand">{m.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-ink-soft">{m.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 border-t border-gilt/35 pt-8">
              <p className="text-[0.52rem] uppercase tracking-[0.3em] text-gilt-ink">Photographs</p>
              <div className="mt-5 grid grid-cols-4 gap-1.5">
                {gallery.slice(0, 8).map((img) => (
                  <div key={img.src} className="relative aspect-square overflow-hidden border border-gilt/30">
                    <Image src={img.src} alt={img.alt} fill sizes="8rem" className="object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {data.video?.url && (
              <div className="mt-12 border-t border-gilt/35 pt-8">
                <p className="text-[0.52rem] uppercase tracking-[0.3em] text-gilt-ink">Our film</p>
                <div className="relative mt-5 aspect-video w-full overflow-hidden border border-gilt/40">
                  <iframe
                    src={data.video.url}
                    title={data.video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                    allowFullScreen
                    className="size-full"
                  />
                </div>
              </div>
            )}

            <div className="mt-12 grid gap-6 border-t border-gilt/35 pt-8 sm:grid-cols-2">
              {[families.brideFamily, families.groomFamily].map((f) => (
                <div key={f.title}>
                  <p className="text-[0.52rem] uppercase tracking-[0.24em] text-gilt-ink">{f.title}</p>
                  <p className="mt-1.5 text-sm text-brand">{f.names}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Rise>

      <div className="relative mx-auto mt-8 max-w-3xl bg-surface">
        <div id="rsvp"><RSVP rsvp={data.rsvp} /></div>
      </div>

      {/* The card is signed. */}
      <div className="relative mx-auto mt-8 max-w-3xl bg-surface p-2">
        <div className="border-2 border-gilt/70 p-1">
          <div className="border border-gilt/40 py-14 text-center">
            <Signature className="block text-[clamp(1.8rem,6vw,3rem)] leading-none text-brand">
              {couple.brideName} & {couple.groomName}
            </Signature>
            <p className="mt-4 text-[0.54rem] uppercase tracking-[0.32em] text-ink-soft">
              {formatWeddingDate(weddingDate, { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
