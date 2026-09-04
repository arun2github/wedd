"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";
import { formatWeddingDate } from "@/lib/format-date";
import type { WeddingData } from "@/types/wedding";
import { Rise, Signature } from "../Rise";

/**
 * The sections every design renders the same way.
 *
 * Not every section needs a variant. These carry information rather than
 * personality, and they already look different design to design because every
 * value in them is a palette token. Giving each one five treatments would be
 * variety for its own sake — the kind that makes a system expensive without
 * making the templates feel different.
 */

const longDate = (d: string) =>
  formatWeddingDate(d, { day: "numeric", month: "long", year: "numeric" });

export function CoupleBlock({ data }: { data: WeddingData }) {
  const { couple } = data;
  return (
    <section id="couple" className="px-6 py-20 md:px-12">
      <div className="mx-auto grid max-w-4xl gap-12 sm:grid-cols-2">
        {[
          { name: couple.brideName, intro: couple.brideIntro, photo: couple.bridePhoto },
          { name: couple.groomName, intro: couple.groomIntro, photo: couple.groomPhoto },
        ].map((p, i) => (
          <Rise key={p.name} delay={i * 0.1}>
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image src={p.photo} alt="" fill sizes="(min-width:640px) 40vw, 90vw" className="object-cover" />
            </div>
            <Signature className="mt-5 block text-3xl text-brand">{p.name}</Signature>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.intro}</p>
          </Rise>
        ))}
      </div>
    </section>
  );
}

export function StoryBlock({ data }: { data: WeddingData }) {
  return (
    <section id="story" className="px-6 py-20 md:px-12">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-[0.62rem] uppercase tracking-[0.32em] text-ink-soft">How we met</h2>
        <div className="mt-10">
          {data.story.map((m, i) => (
            <Rise key={m.title} delay={i * 0.05}>
              <article className="grid gap-2 border-b border-gilt/25 py-6 last:border-b-0 sm:grid-cols-[8rem_1fr] sm:gap-8">
                <p className="pt-1 text-[0.6rem] uppercase tracking-[0.22em] text-gilt-ink">{m.date}</p>
                <div>
                  <h3 className="font-display text-2xl text-brand">{m.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{m.description}</p>
                </div>
              </article>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}

export function VenueBlock({ data }: { data: WeddingData }) {
  const { venue } = data;
  return (
    <section id="venue" className="grid gap-10 px-6 py-20 md:grid-cols-2 md:px-12">
      <Rise className="relative aspect-[4/3] overflow-hidden">
        <Image src={venue.image} alt={venue.name} fill sizes="(min-width:768px) 45vw, 90vw" className="object-cover" />
      </Rise>
      <Rise delay={0.1} className="self-center">
        <h2 className="text-[0.62rem] uppercase tracking-[0.32em] text-ink-soft">The venue</h2>
        <h3 className="mt-4 font-display text-4xl text-brand">{venue.name}</h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-soft">{venue.address}</p>
        <a
          href={venue.directionsUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 text-sm text-brand underline decoration-gilt underline-offset-4"
        >
          <MapPin className="size-3.5" aria-hidden="true" />
          Directions
        </a>
      </Rise>
    </section>
  );
}

export function FilmBlock({ data }: { data: WeddingData }) {
  if (!data.video?.url) return null;
  return (
    <section id="film" className="px-6 py-20 md:px-12">
      <h2 className="text-[0.62rem] uppercase tracking-[0.32em] text-ink-soft">Our film</h2>
      <div className="relative mt-8 aspect-video w-full overflow-hidden">
        <iframe
          src={data.video.url}
          title={data.video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
          allowFullScreen
          className="size-full"
        />
      </div>
    </section>
  );
}

export function FamiliesBlock({ data }: { data: WeddingData }) {
  return (
    <section id="families" className="px-6 py-20 text-center md:px-12">
      <h2 className="text-[0.62rem] uppercase tracking-[0.32em] text-ink-soft">
        With the blessings of
      </h2>
      <div className="mx-auto mt-10 grid max-w-2xl gap-8 sm:grid-cols-2">
        {[data.families.brideFamily, data.families.groomFamily].map((f) => (
          <div key={f.title}>
            <p className="text-[0.56rem] uppercase tracking-[0.24em] text-gilt-ink">{f.title}</p>
            <p className="mt-2 font-display text-2xl text-brand">{f.names}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ClosingBlock({ data }: { data: WeddingData }) {
  const { couple, weddingDate } = data;
  return (
    <footer className="border-t border-gilt/30 px-6 py-20 text-center">
      <Signature className="block text-[clamp(2rem,7vw,3.4rem)] leading-none text-brand">
        {couple.brideName} &amp; {couple.groomName}
      </Signature>
      <p className="mt-4 text-[0.6rem] uppercase tracking-[0.3em] text-ink-soft">
        {longDate(weddingDate)}
      </p>
    </footer>
  );
}
