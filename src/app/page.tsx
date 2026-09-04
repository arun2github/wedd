import { BRAND } from "@/lib/brand";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { listTemplates } from "@/lib/templates";
import { demoWeddingContent } from "@/data/wedding-data";
import { PageShell } from "@/components/marketing/PageShell";
import { Scallop } from "@/components/marketing/Scallop";
import { Reveal } from "@/components/marketing/Reveal";
import { TemplatePoster } from "@/components/marketing/TemplatePoster";
import { DesignCarousel3D } from "@/components/marketing/DesignCarousel3D";
import { VideoHero } from "@/components/marketing/VideoHero";
import { SmartRsvp } from "@/components/marketing/SmartRsvp";
import { getTemplate } from "@/lib/templates";

export const metadata: Metadata = {
  title: `${BRAND} — wedding websites, designed`,
  description:
    "Designed wedding websites built to hold every day of an Indian wedding. Try any design free; pay once to publish.",
};

/**
 * The home page is a hub, not a summary.
 *
 * Every topic now has its own route, so this page introduces each one and
 * hands off. That is what finally removes the repetition: previously the
 * multi-event claim, the guest promise and the catalogue each appeared two or
 * three times on a single scroll because there was nowhere else to put them.
 * Each card below says one thing once and links to the page that says the rest.
 */
const ROOMS = [
  {
    href: "/designs",
    eyebrow: "The collection",
    title: "Find the one that feels like you",
    body: "Each drawn from the tradition it is for. Open any of them running with real content.",
    photo: 1,
  },
  {
    href: "/ceremonies",
    eyebrow: "Every ceremony",
    title: "Built for four days, not one date",
    body: "Haldi, mehendi, sangeet, the wedding, the reception — each with its own card and directions.",
    photo: 7,
  },
  {
    href: "/guests",
    eyebrow: "For your guests",
    title: "One link. No app. One tap to reply",
    body: "Three hundred and thirty people, most on a phone, most once. It has to work first time.",
    photo: 12,
  },
  {
    href: "/how-it-works",
    eyebrow: "How it works",
    title: "You send it. We build it",
    body: "You are planning a wedding. You should not also be learning a website builder.",
    photo: 10,
  },
];

export default function HomePage() {
  const templates = listTemplates();
  const { brideName, groomName, heroPhoto } = demoWeddingContent.couple;
  const g = demoWeddingContent.gallery;

  return (
    <PageShell>
      {/*
        The opening: one film, full bleed, looping.

        `hero-loop.mp4` is the supplied `Hero_vedio.mp4` cut to loop cleanly —
        its last second cross-dissolved into its first, so the clip meets its
        own opening rather than snapping back to it, and its audio stripped,
        which the muted element could never have played.
        `hero-loop-poster.jpg` is its frame 0, so the still shown while it
        decodes is the frame it starts on.

        The expanding card that used to sit over this is gone. It played a
        second film inside a frame on top of a film, and it held the page still
        for several seconds first.
      */}
      <VideoHero
        videoSrc="/vedio/hero-loop.mp4"
        posterSrc="/hero-loop-poster.jpg"
        title="Wedding websites, designed for every day of an Indian wedding"
      >
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-lg leading-relaxed text-linen">
            Designed wedding websites, built to hold every day of an Indian
            wedding. Choose one, we build it with you, and your guests
            get a single link.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/designs"
              className="rounded-full bg-linen px-8 py-3.5 text-sm font-medium tracking-wide text-aubergine transition-colors hover:bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-linen"
            >
              See the designs
            </Link>
            <Link
              href="/sign-in"
              className="rounded-full border border-linen/45 px-8 py-3.5 text-sm tracking-wide text-linen transition-colors hover:border-linen focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-linen"
            >
              Start yours
            </Link>
          </div>
          <p className="mt-6 text-sm text-linen/85">
            Try any design free. Pay once, only when you publish.
          </p>
        </Reveal>
      </VideoHero>

      {/*
        The designs on a turntable — the hero's subject, in real 3D.

        Placed full-bleed under the headline rather than beside it because
        perspective needs width: squeezed into half a column the cylinder reads
        as a row of tilted cards, and the depth that makes it worth doing
        disappears.
      */}
      {/* The turntable wants air on both sides of it. It had `pb-10` and
          nothing above, so it sat hard against the hero and the cards at the
          front of the ring — the ones nearest the viewer — were clipped by the
          section edge as they came round. */}
      <section className="overflow-hidden py-20 lg:py-28">
        <DesignCarousel3D
          templates={templates}
          photo={heroPhoto}
          brideName={brideName}
          groomName={groomName}
        />
        <p className="mt-10 text-center text-sm text-soft">
          Hover to hold it still. Try any design free — pay once, only when you publish.
        </p>
      </section>

      <SmartRsvp />

      {/*
        What happens after the wedding.

        Nowhere else on the site answers this, and it is the question a couple
        asks last and remembers longest — every claim below is real: `liveUntil`
        governs how long a site serves, and extending it is an existing line on
        the price list.
      */}
      <section className="border-t border-ink/10">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal className="relative aspect-[4/5] overflow-hidden rounded-xl">
            <Image
              src={g[13].src}
              alt={g[13].alt}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-[0.68rem] uppercase tracking-[0.32em] text-soft">Afterwards</p>
            <h2 className="mt-5 max-w-lg font-display text-[clamp(2.2rem,5vw,3.8rem)] font-light leading-[1.04] tracking-[-0.02em]">
              It does not disappear the next morning.
            </h2>
            <p className="mt-5 max-w-md leading-relaxed text-soft">
              The link you sent still works. Guests go back to it for the
              photographs, for the address of the reception they are still
              talking about, for the story of how you met. It stays yours for as
              long as you want it — extend it any time, including years later.
            </p>
            <dl className="mt-9 grid gap-6 sm:grid-cols-3">
              {[
                ["12–24", "months live, depending on the plan"],
                ["₹999", "to add another twelve months, any time"],
                ["0", "of it deleted when the time is up"],
              ].map(([stat, label]) => (
                <div key={label}>
                  <dt className="font-display text-3xl font-light">{stat}</dt>
                  <dd className="mt-1.5 text-sm leading-snug text-soft">{label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/*
        The one scalloped edge on the site.

        It was on four pages and three times on this one, which made it
        wallpaper rather than a signature — the exact repetition it was meant
        to break up. Kept for this single hand-off, where the page changes
        ground for the first time.
      */}
      <Scallop fill="var(--color-aubergine)" />

      {/* ------------------------------- the one claim worth the dark band */}
      <section className="bg-aubergine text-linen">
        <div className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8 lg:py-28">
          <Reveal className="grid items-center gap-12 lg:grid-cols-[1fr_0.75fr]">
            <div>
              <p className="text-[0.66rem] uppercase tracking-[0.3em] text-gold">
                The difference
              </p>
              <h2 className="mt-5 max-w-xl font-display text-[clamp(2.2rem,5vw,4rem)] font-light leading-[1.03] tracking-[-0.02em]">
                An Indian wedding is not one event.
              </h2>
              <p className="mt-6 max-w-md leading-relaxed text-linen/70">
                Almost every wedding website in the world holds one date, one
                venue and one map pin. Yours runs for days, in different places,
                for different people — and every design here is built that way.
              </p>
              <Link
                href="/ceremonies"
                className="mt-8 inline-block border-b border-gold pb-1 text-sm tracking-wide text-gold transition-colors hover:text-linen"
              >
                See how the days are handled
              </Link>
            </div>
            <div className="mx-auto w-full max-w-[15rem]">
              <TemplatePoster
                template={getTemplate("banarasi")}
                photo={heroPhoto}
                brideName={brideName}
                groomName={groomName}
                className="rounded-xl aspect-[3/4] shadow-2xl"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------ hub */}
      <section className="mx-auto w-full max-w-7xl px-5 py-24 sm:px-8 lg:py-28">
        <div className="grid gap-x-7 gap-y-14 sm:grid-cols-2">
          {ROOMS.map((r, i) => (
            <Reveal key={r.href} delay={(i % 2) * 0.08}>
              <Link href={r.href} className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-aubergine">
                <div className="rounded-xl relative aspect-[5/4] overflow-hidden">
                  <Image
                    src={g[r.photo].src}
                    alt={g[r.photo].alt}
                    fill
                    sizes="(min-width: 640px) 45vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                </div>
                <p className="mt-5 text-[0.62rem] uppercase tracking-[0.28em] text-soft">{r.eyebrow}</p>
                <h2 className="mt-2 font-display text-3xl font-light leading-tight">{r.title}</h2>
                <p className="mt-2 max-w-sm leading-relaxed text-soft">{r.body}</p>
                <span className="mt-3 inline-block border-b border-ink/30 pb-0.5 text-sm transition-colors group-hover:border-ink">
                  Read more
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------ a taste of it */}
      <section className="border-t border-ink/10">
        <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-[clamp(1.8rem,3.6vw,2.8rem)] font-light tracking-[-0.02em]">
              A few to start with
            </h2>
            <Link href="/designs" className="text-sm text-soft underline underline-offset-4 transition-colors hover:text-ink">
              See all designs
            </Link>
          </Reveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {templates.filter((t) => t.featured).slice(0, 3).map((t, i) => (
              <Reveal key={t.id} delay={i * 0.08}>
                <Link href={`/templates/${t.id}`} className="group block">
                  <TemplatePoster
                    template={t}
                    photo={heroPhoto}
                    brideName={brideName}
                    groomName={groomName}
                    className="rounded-xl aspect-[3/4] transition-transform duration-700 group-hover:-translate-y-1.5"
                  />
                  <p className="mt-4 font-display text-xl font-light">{t.name}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/*
        The closing, with petals falling behind it.

        `rosepetals-web.mp4` is 1.33MB, down from 4.54MB — scaled to 1280,
        24fps, audio stripped, because it sits behind a scrim at the very
        bottom of the page and never needed 1080p. `preload="none"` keeps it
        off the initial load: it is atmosphere, not content, and should cost
        nothing until someone has scrolled this far.
      */}
      <section className="relative isolate overflow-hidden border-t border-ink/10 bg-aubergine text-linen">
        <video
          src="/vedio/rosepetals-web.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 size-full object-cover opacity-40 motion-reduce:hidden"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-aubergine/60" />

        <div className="mx-auto w-full max-w-3xl px-5 py-28 text-center sm:px-8">
          <Reveal>
            <h2 className="font-display text-[clamp(2.4rem,6vw,4.2rem)] font-light leading-[1.02] tracking-[-0.02em]">
              Your story deserves a
              <br />
              <span className="font-script text-[1.25em] leading-[0.8] text-gold">beautiful</span> place.
            </h2>
            <Link
              href="/sign-in"
              className="mt-9 inline-block rounded-full bg-gold px-9 py-4 text-sm font-medium tracking-wide text-aubergine transition-colors hover:bg-gold/90"
            >
              Create your wedding website
            </Link>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
