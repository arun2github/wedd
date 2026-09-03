import Image from "next/image";
import { MapPin } from "lucide-react";
import { RSVP } from "@/components/sections/RSVP";
import { TemplateNav } from "./TemplateNav";
import { CountdownRule } from "@/components/sections/countdowns";
import { formatWeddingDate } from "@/lib/format-date";
import { Rise, Signature } from "./Rise";
import type { WeddingData } from "@/types/wedding";

/**
 * The `program` archetype: a printed order of service.
 *
 * Structurally the opposite of `scroll`, which is the point — until now every
 * design ran through that one composition and "a different template" meant a
 * different palette. Here there is no curtain, no envelope film and no
 * full-bleed anything. One narrow measure the width of a printed page, ruled
 * dividers, small-caps labels, and the day numbered in the order it happens.
 *
 * Roman numerals rather than decoration: an order of service is the one place
 * numbering is genuinely earned, because a guest follows it in sequence and
 * the order is information they need.
 *
 * It renders the same `WeddingData` as every other archetype, so a couple can
 * switch to it and keep every word they have written.
 */

const ROMAN = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"];

/** A ruled small-caps label. The programme's only recurring device. */
function Rubric({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <span className="h-px flex-1 bg-gilt/40" />
      <span className="text-[0.6rem] uppercase tracking-[0.34em] text-ink-soft">{children}</span>
      <span className="h-px flex-1 bg-gilt/40" />
    </div>
  );
}

export function ProgramInvitation({ data }: { data: WeddingData }) {
  const { couple, events, story, venue, gallery, families, weddingDate, invitationMessage } = data;

  return (
    <div className="min-h-dvh bg-surface text-ink">
      <span id="top" />
      <TemplateNav
        brideName={couple.brideName}
        groomName={couple.groomName}
        links={[{ href: "#events", label: "The day" }, { href: "#story", label: "Our story" }, { href: "#venue", label: "Venue" }, { href: "#gallery", label: "Photographs" }, { href: "#rsvp", label: "Reply" }]}
      />
      {/*
        The title page, over a photograph.

        A printed programme has a cover, and this one had none — it opened on
        bare paper, which is most of why it read as flat beside `scroll`. The
        rules and the roman numerals below are untouched; what changed is that
        the programme now has a front.
      */}
      <header className="relative isolate flex min-h-[88vh] flex-col items-center justify-center px-6 py-20 text-center">
        <Image
          src={couple.heroPhoto}
          alt=""
          fill
          sizes="100vw"
          priority
          className="-z-20 object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[color-mix(in_oklab,var(--brand-deep)_78%,transparent)]" />

        <Rise>
          <p className="text-[0.6rem] uppercase tracking-[0.36em] text-[var(--surface)]/70">
            The order of service
          </p>
        </Rise>

        <div className="mt-10 w-full max-w-xl border-y border-[var(--gilt)]/50 py-12">
          <Signature className="block text-[clamp(3rem,11vw,6rem)] leading-[0.9] text-[var(--surface)]">
            {couple.brideName}
          </Signature>
          <p className="my-3 text-[0.7rem] uppercase tracking-[0.4em] text-[var(--gilt)]">and</p>
          <Signature className="block text-[clamp(3rem,11vw,6rem)] leading-[0.9] text-[var(--surface)]">
            {couple.groomName}
          </Signature>
        </div>

        <Rise delay={0.15}>
          <p className="mt-10 text-sm tracking-[0.3em] text-[var(--surface)]/75">
            {formatWeddingDate(weddingDate, { day: "numeric", month: "long", year: "numeric" }).toUpperCase()}
          </p>
          <p className="mx-auto mt-8 max-w-sm text-sm leading-relaxed text-[var(--surface)]/70">
            {invitationMessage}
          </p>
        </Rise>
      </header>

      {/* --------------------------------------------------- order of the day */}
      <section id="events" className="mx-auto max-w-2xl px-6 py-16">
        <Rubric>The order of the day</Rubric>

        <Rise>
        <ol className="mt-10">
          {events.map((e, i) => (
            <li key={e.name} className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-gilt/25 py-7 last:border-b-0">
              <span className="font-display text-lg lowercase text-gilt-ink">{ROMAN[i] ?? i + 1}</span>
              <div>
                <h2 className="font-display text-2xl leading-tight text-brand">{e.name}</h2>
                <p className="mt-1.5 text-[0.7rem] uppercase tracking-[0.24em] text-ink-soft">
                  {formatWeddingDate(e.date, { day: "numeric", month: "short" })} · {e.time}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{e.description}</p>
                {e.mapUrl ? (
                  <a
                    href={e.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 border-b border-gilt/50 pb-0.5 text-sm text-brand transition-colors hover:border-brand"
                  >
                    <MapPin className="size-3.5" aria-hidden="true" />
                    {e.venue}
                  </a>
                ) : (
                  <p className="mt-3 text-sm text-ink-soft">{e.venue}</p>
                )}
              </div>
            </li>
          ))}
        </ol>
        </Rise>
      </section>

      {/* ------------------------------------------------------------ story */}
      <section id="story" className="mx-auto max-w-2xl px-6 py-16">
        <Rubric>How they met</Rubric>
        <div className="mt-10">
          {story.map((m) => (
            <article key={m.title} className="grid gap-1 border-b border-gilt/25 py-6 last:border-b-0 sm:grid-cols-[7rem_1fr] sm:gap-6">
              {/* The date sits in the margin, the way a hymn number does. */}
              <p className="pt-1 text-[0.62rem] uppercase tracking-[0.22em] text-ink-soft">{m.date}</p>
              <div>
                <h3 className="font-display text-xl text-brand">{m.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{m.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------- the couple */}
      <section className="mx-auto max-w-2xl px-6 py-16">
        <Rubric>The couple</Rubric>
        <div className="mt-10 grid gap-10 sm:grid-cols-2">
          {[
            { name: couple.brideName, intro: couple.brideIntro, photo: couple.bridePhoto },
            { name: couple.groomName, intro: couple.groomIntro, photo: couple.groomPhoto },
          ].map((p) => (
            <div key={p.name}>
              {/* Inset and squared, not a full-bleed portrait — a programme
                  reproduces photographs, it does not stage them. */}
              <div className="relative aspect-[4/5] overflow-hidden border border-gilt/30">
                <Image src={p.photo} alt="" fill sizes="(min-width:640px) 40vw, 90vw" className="object-cover" />
              </div>
              <h3 className="mt-4 font-script text-3xl text-brand">{p.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.intro}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------ venue */}
      <section id="venue" className="mx-auto max-w-2xl px-6 py-16">
        <Rubric>The venue</Rubric>
        <div className="relative mt-10 aspect-[16/9] overflow-hidden border border-gilt/30">
          <Image src={venue.image} alt={venue.name} fill sizes="(min-width:768px) 42rem, 90vw" className="object-cover" />
        </div>
        <h2 className="mt-6 font-display text-3xl text-brand">{venue.name}</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{venue.address}</p>
        <a
          href={venue.directionsUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 border-b border-gilt/50 pb-0.5 text-sm text-brand transition-colors hover:border-brand"
        >
          <MapPin className="size-3.5" aria-hidden="true" />
          Directions
        </a>
      </section>

      {/* ---------------------------------------------------------- gallery */}
      <section id="gallery" className="mx-auto max-w-2xl px-6 py-16">
        <Rubric>Photographs</Rubric>
        <div className="mt-10 grid grid-cols-2 gap-3">
          {gallery.slice(0, 8).map((img) => (
            <figure key={img.src} className="relative aspect-square overflow-hidden border border-gilt/25">
              <Image src={img.src} alt={img.alt} fill sizes="(min-width:768px) 20rem, 45vw" className="object-cover" />
            </figure>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------- families */}
      <section className="mx-auto max-w-2xl px-6 py-16">
        <Rubric>With the blessings of</Rubric>
        <div className="mt-10 grid gap-8 text-center sm:grid-cols-2">
          {[families.brideFamily, families.groomFamily].map((f) => (
            <div key={f.title}>
              <p className="text-[0.6rem] uppercase tracking-[0.26em] text-ink-soft">{f.title}</p>
              <p className="mt-3 font-display text-2xl text-brand">{f.names}</p>
            </div>
          ))}
        </div>
      </section>

      {data.video?.url && (
        <section className="mx-auto max-w-2xl px-6 py-16">
          <Rubric>Our film</Rubric>
          <div className="relative mt-10 aspect-video w-full overflow-hidden border border-gilt/30">
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

      <CountdownRule date={weddingDate} />

      <div id="rsvp"><RSVP rsvp={data.rsvp} /></div>

      <footer className="border-t border-gilt/30 py-14 text-center">
        <p className="font-script text-4xl text-brand">
          {couple.brideName} &amp; {couple.groomName}
        </p>
        <p className="mt-3 text-[0.62rem] uppercase tracking-[0.3em] text-ink-soft">
          {formatWeddingDate(weddingDate, { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </footer>
    </div>
  );
}
