import Image from "next/image";
import { MapPin } from "lucide-react";
import { RSVP } from "@/components/sections/RSVP";
import { CountdownPanel } from "@/components/sections/countdowns";
import { formatWeddingDate } from "@/lib/format-date";
import { Rise, Signature } from "./Rise";
import type { WeddingData } from "@/types/wedding";

/**
 * `panel` — the wedding as a hand of cards, read sideways.
 *
 * The whole invitation is a horizontal track: full-height panels swiped through
 * left to right, one per ceremony, the way the insert cards in a printed set
 * are dealt out. Vertical scrolling is reduced to almost nothing, which is the
 * point — every other architecture is a column, and this one refuses the column
 * entirely.
 *
 * Native scroll-snap rather than a JS carousel: a swipe on a phone, a trackpad
 * flick on a desktop, keyboard and screen-reader order intact, and nothing to
 * desynchronise.
 */
export function PanelInvitation({ data }: { data: WeddingData }) {
  const { couple, events, story, venue, gallery, families, weddingDate, invitationMessage } = data;

  const panels = [
    { key: "open", rite: "brand" as const },
    ...events.map((e, i) => ({ key: e.name, rite: (["rite-1", "rite-2", "brand", "rite-3"] as const)[i % 4] })),
    { key: "story", rite: "gilt" as const },
    { key: "venue", rite: "brand" as const },
  ];

  return (
    <div className="relative h-dvh overflow-hidden bg-surface text-ink">
      {/* Fixed, not sticky: the page scrolls horizontally, so a bar that
          followed vertical scroll would never move. Section anchors are
          omitted for the same reason — the track is swiped, not jumped. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-4 sm:px-10">
        <span className="font-script text-2xl leading-none text-[var(--surface)] drop-shadow">
          {couple.brideName} &amp; {couple.groomName}
        </span>
        <span className="text-[0.56rem] uppercase tracking-[0.28em] text-[var(--surface)]/70">
          Swipe
        </span>
      </div>
      <div className="flex h-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden">
        {/* ------------------------------------------------------- the title */}
        <section className="relative flex h-full w-screen shrink-0 snap-center items-center justify-center px-8">
          <Image src={couple.heroPhoto} alt="" fill sizes="100vw" priority className="object-cover" />
          <div className="absolute inset-0 bg-[color-mix(in_oklab,var(--brand-deep)_72%,transparent)]" />
          <div className="relative text-center">
            <p className="text-[0.58rem] uppercase tracking-[0.4em] text-[var(--surface)]/70">
              {formatWeddingDate(weddingDate, { day: "numeric", month: "long", year: "numeric" })}
            </p>
            <h1 className="mt-6 font-display text-[clamp(2.6rem,9vw,5.5rem)] leading-[1] text-[var(--surface)]">
              <Signature className="block">{couple.brideName}</Signature>
              <span className="block font-script text-[0.55em] text-gilt-ink">and</span>
              <Signature className="block">{couple.groomName}</Signature>
            </h1>
            <p className="mx-auto mt-8 max-w-sm text-sm leading-relaxed text-[var(--surface)]/75">
              {invitationMessage}
            </p>
            <p className="mt-12 text-[0.56rem] uppercase tracking-[0.32em] text-[var(--surface)]/60">
              Swipe →
            </p>
          </div>
        </section>

        {/* --------------------------------------------- one panel per day */}
        {events.map((e, i) => {
          const rite = (["rite-1", "rite-2", "brand", "rite-3"] as const)[i % 4];
          return (
            <section
              key={e.name}
              className="flex h-full w-screen shrink-0 snap-center flex-col justify-center gap-8 px-8 md:flex-row md:items-center md:px-16"
            >
              <Rise className="md:w-1/2">
                <span className="inline-block px-3 py-1 text-[0.56rem] uppercase tracking-[0.24em]"
                      style={{ color: `var(--${rite})`, background: `color-mix(in oklab, var(--${rite}) 12%, transparent)` }}>
                  Day {i + 1}
                </span>
                <h2 className="mt-5 font-display text-[clamp(2.2rem,6vw,4rem)] leading-[1.02]"
                    style={{ color: `var(--${rite})` }}>
                  {e.name}
                </h2>
                <p className="mt-3 text-[0.66rem] uppercase tracking-[0.24em] text-ink-soft">
                  {formatWeddingDate(e.date, { day: "numeric", month: "long" })} · {e.time}
                </p>
                <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-soft">{e.description}</p>
                {e.mapUrl && (
                  <a href={e.mapUrl} target="_blank" rel="noreferrer"
                     className="mt-5 inline-flex items-center gap-1.5 text-sm underline decoration-gilt underline-offset-4"
                     style={{ color: `var(--${rite})` }}>
                    <MapPin className="size-3.5" aria-hidden="true" />{e.venue}
                  </a>
                )}
              </Rise>
              <div className="relative aspect-[4/3] w-full overflow-hidden md:aspect-[3/4] md:w-1/2">
                <Image src={gallery[(i * 3) % gallery.length].src} alt="" fill
                       sizes="(min-width:768px) 45vw, 90vw" className="object-cover" />
              </div>
            </section>
          );
        })}

        {/* ------------------------------------------------------- the story */}
        <section className="flex h-full w-screen shrink-0 snap-center flex-col justify-center px-8 md:px-16">
          <p className="text-[0.58rem] uppercase tracking-[0.34em] text-gilt-ink">How we met</p>
          <div className="mt-8 flex gap-6 overflow-x-auto pb-4">
            {story.map((m) => (
              <div key={m.title} className="w-64 shrink-0">
                <p className="text-[0.56rem] uppercase tracking-[0.22em] text-ink-soft">{m.date}</p>
                <h3 className="mt-2 font-display text-2xl text-brand">{m.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{m.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* -------------------------------------------------------- venue */}
        <section className="relative flex h-full w-screen shrink-0 snap-center items-end px-8 pb-16 md:px-16">
          <Image src={venue.image} alt={venue.name} fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-deep)] via-[color-mix(in_oklab,var(--brand-deep)_50%,transparent)] to-transparent" />
          <div className="relative">
            <h2 className="font-display text-[clamp(2rem,6vw,3.6rem)] text-[var(--surface)]">{venue.name}</h2>
            <p className="mt-2 max-w-sm text-sm text-[var(--surface)]/80">{venue.address}</p>
            <a href={venue.directionsUrl} target="_blank" rel="noreferrer"
               className="mt-4 inline-flex items-center gap-1.5 text-sm text-gilt-ink underline underline-offset-4">
              <MapPin className="size-3.5" aria-hidden="true" />Directions
            </a>
            <div className="mt-8 flex gap-6">
              {[families.brideFamily, families.groomFamily].map((f) => (
                <p key={f.title} className="text-sm text-[var(--surface)]/80">
                  <span className="block text-[0.54rem] uppercase tracking-[0.22em] text-gilt-ink">{f.title}</span>
                  {f.names}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- the couple */}
        <section className="flex h-full w-screen shrink-0 snap-center flex-col justify-center gap-8 px-8 md:flex-row md:items-center md:px-16">
          {[
            { name: couple.brideName, intro: couple.brideIntro, photo: couple.bridePhoto },
            { name: couple.groomName, intro: couple.groomIntro, photo: couple.groomPhoto },
          ].map((person) => (
            <Rise key={person.name} className="md:w-1/2">
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image src={person.photo} alt="" fill sizes="(min-width:768px) 45vw, 90vw" className="object-cover" />
              </div>
              <p className="mt-4 font-script text-4xl text-brand">{person.name}</p>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">{person.intro}</p>
            </Rise>
          ))}
        </section>

        {data.video?.url && (
          <section className="flex h-full w-screen shrink-0 snap-center items-center justify-center px-8">
            <div className="relative aspect-video w-full max-w-3xl">
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

        <CountdownPanel date={weddingDate} />

        {/* --------------------------------------------------------- reply */}
        <section className="h-full w-screen shrink-0 snap-center overflow-y-auto">
          <RSVP rsvp={data.rsvp} />
        </section>

        {/* --------------------------------------------------- the last panel */}
        <section className="flex h-full w-screen shrink-0 snap-center flex-col items-center justify-center bg-surface-sunk px-8 text-center">
          <Signature className="block text-[clamp(2.2rem,8vw,4rem)] leading-none text-brand">
            {couple.brideName} & {couple.groomName}
          </Signature>
          <p className="mt-5 text-[0.58rem] uppercase tracking-[0.34em] text-ink-soft">
            {formatWeddingDate(weddingDate, { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </section>
      </div>

      {/* Position indicator — the only chrome, and it says how far along you are. */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 bottom-5 flex justify-center gap-1.5">
        {panels.map((p, i) => (
          <span key={i} className="size-1.5 rounded-full" style={{ background: `var(--${p.rite})`, opacity: 0.55 }} />
        ))}
      </div>
    </div>
  );
}
