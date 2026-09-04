import Link from "next/link";
import { Heart, Users, PartyPopper, Smartphone, Sparkles } from "lucide-react";
import { Reveal } from "./Reveal";
import { GlowBorder } from "@/components/ui/glow-border";

/**
 * What the couple receives when guests reply.
 *
 * Distinct from `/guests`, which is what a guest *sees*. This is the other end
 * of the same action, and it is the half a couple is actually buying.
 *
 * The band is deliberately the softest thing on the page. Everything around it
 * is editorial — full-bleed film, a dark aubergine claim, square photo cards —
 * so this one section is drawn as paper and stickers instead: a blush panel,
 * rounded corners, a card tilted a degree off true. That contrast is the whole
 * point; a *second* austere band here just read as more of the same scroll.
 *
 * The replies card itself is drawn in the purple family rather than the
 * wine everything else uses, and lit with a travelling ring. It is the one
 * object on this page that shows the product doing its job, so it is the one
 * object allowed to be the brightest thing in view.
 *
 * Two of the four items below are marked as not yet available, in the
 * interface rather than in a footnote. Every capability listed without a badge
 * runs today; a page that quietly lists what is planned alongside what ships
 * generates refund requests, not sales.
 */

const NOW = [
  {
    icon: Heart,
    t: "Every reply in one list",
    d: "Who is coming, how many they are bringing, who declined — and the note they left with it.",
  },
  {
    icon: Users,
    t: "A running headcount",
    d: "Attending, declined and total guests, recalculated as replies land. The number the caterer asks for.",
  },
];

const COMING = [
  {
    icon: PartyPopper,
    t: "Replies per ceremony",
    d: "Which guests are coming to the haldi, the wedding and the reception separately, rather than one yes for the whole week.",
  },
  {
    icon: Smartphone,
    t: "Replies on your phone",
    d: "The guest list in a mobile app, with a notification when someone answers.",
  },
];

/** A shape, not a claim. Generic names, because inventing named guests to
 *  decorate a marketing page is one short step from inventing testimonials. */
const SAMPLE = [
  { name: "Guest name", party: 4, state: "Attending" },
  { name: "Guest name", party: 2, state: "Attending" },
  { name: "Guest name", party: 0, state: "Declined" },
];

export function SmartRsvp() {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
      {/*
        One rounded panel holding the whole band, rather than the page ground.

        The blush is `--color-wine` at 4% over linen, not a new hex: it stays in
        the family the rest of the site is painted from, and it re-tints itself
        if the wine ever moves.
      */}
      <div className="relative overflow-hidden rounded-[2rem] border border-wine/10 bg-gradient-to-br from-wine/[0.05] via-linen to-plum/[0.09] px-5 py-14 sm:rounded-[2.5rem] sm:px-10 sm:py-16 lg:px-14 lg:py-20">
        {/* Confetti — two soft blooms and a dot field, all behind the content. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-wine/[0.06] blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 -right-20 size-80 rounded-full bg-lilac/[0.22] blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(var(--color-gold)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]"
        />

        <div className="relative grid items-center gap-12 lg:grid-cols-[1fr_0.82fr] lg:gap-16">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-plum/15 bg-card/80 px-3.5 py-1.5 text-[0.62rem] uppercase tracking-[0.24em] text-plum shadow-sm">
              <Heart className="size-3 fill-current" aria-hidden="true" />
              Replies
            </p>

            <h2 className="mt-5 max-w-lg font-display text-[clamp(2.1rem,4.6vw,3.5rem)] font-light leading-[1.06] tracking-[-0.02em]">
              You will know{" "}
              <span className="font-script text-[1.32em] leading-[0.7] text-wine">
                who is coming
              </span>
              .
            </h2>

            <p className="mt-5 max-w-md leading-relaxed text-soft">
              Guests answer on the same page they read the invitation on. No
              account, no app, nothing to install — and the answers arrive
              somewhere you can actually read them.
            </p>

            {/*
              Stickers rather than rules. The previous list separated each item
              with a hairline, which is the same device the four hub cards and
              the afterwards band already use; here the item *is* the card.
            */}
            <div className="mt-9 grid gap-3 sm:grid-cols-2">
              {NOW.map(({ icon: Icon, t, d }) => (
                <div
                  key={t}
                  className="rounded-2xl border border-wine/10 bg-card/85 p-5 shadow-[0_1px_0_rgba(42,21,32,0.04)] transition-transform duration-500 ease-out hover:-translate-y-0.5"
                >
                  <span className="inline-flex size-9 items-center justify-center rounded-xl bg-wine/10 text-wine">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <h3 className="mt-3.5 font-display text-lg font-light leading-snug">
                    {t}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-soft">
                    {d}
                  </p>
                </div>
              ))}

              {COMING.map(({ icon: Icon, t, d }) => (
                <div
                  key={t}
                  className="rounded-2xl border border-dashed border-gold/40 bg-card/45 p-5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex size-9 items-center justify-center rounded-xl bg-gold/15 text-gold">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-gold/15 px-2.5 py-1 text-[0.55rem] uppercase tracking-[0.16em] text-gold">
                      <Sparkles className="size-2.5" aria-hidden="true" />
                      Soon
                    </span>
                  </div>
                  <h3 className="mt-3.5 font-display text-lg font-light leading-snug text-soft">
                    {t}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-soft">
                    {d}
                  </p>
                </div>
              ))}
            </div>

            <Link
              href="/guests"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-wine/20 bg-card/80 px-6 py-3 text-sm tracking-wide text-wine shadow-sm transition-colors hover:border-wine/50 hover:bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine"
            >
              See what your guests get
              <span aria-hidden="true">→</span>
            </Link>
          </Reveal>

          {/* The list, at the shape it actually arrives in — laid down like a
              card someone left on the table, not squared to the grid. */}
          <Reveal delay={0.12}>
            <div className="relative mx-auto w-full max-w-sm">
              {/* A second sheet behind, so the panel reads as paper on paper. */}
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 translate-x-2 translate-y-3 rotate-2 rounded-[1.6rem] border border-plum/10 bg-card/60"
              />

              {/*
                The ring and the card share this one rotated wrapper. Tilting
                them separately looks identical at rest and comes apart the
                moment the card straightens on hover — the ring is a frame, so
                a pixel of drift is the whole illusion gone.
              */}
              <div className="relative -rotate-1 transition-transform duration-700 ease-out hover:rotate-0">
                <div className="pointer-events-none absolute -inset-px z-10">
                  <GlowBorder
                    /* 25.6px is `rounded-[1.6rem]`, plus the 1px inset. */
                    radiusPx={26.6}
                    borderWidth={2}
                    speed={7}
                    hoverMultiplier={4}
                    tailLength={52}
                    glowColor="var(--color-lilac)"
                    tailColor="color-mix(in srgb, var(--color-orchid) 40%, transparent)"
                    baseColor="color-mix(in srgb, var(--color-plum) 9%, transparent)"
                  />
                </div>

                {/* The shadow colour is `--color-plum` written out. Tailwind
                    accepts a `color-mix()` inside an arbitrary shadow and then
                    lands it as transparent, so the card silently loses its
                    lift — the one place in this file a literal is correct. */}
                <div className="relative rounded-[1.6rem] border border-plum/12 bg-card p-6 shadow-[0_22px_50px_-26px_rgba(74,31,78,0.55)]">
                  <div className="flex items-baseline justify-between gap-3 border-b border-plum/10 pb-4">
                    <p className="font-display text-lg font-light">Replies</p>
                    <p className="rounded-full bg-plum/[0.07] px-2.5 py-1 text-[0.55rem] uppercase tracking-[0.18em] text-soft">
                      Sample view
                    </p>
                  </div>

                  <dl className="grid grid-cols-3 gap-2 py-5">
                    {[
                      ["Attending", "2"],
                      ["Guests", "6"],
                      ["Declined", "1"],
                    ].map(([k, v]) => (
                      <div
                        key={k}
                        className="rounded-2xl bg-plum/[0.06] px-2 py-3 text-center"
                      >
                        <dd className="font-display text-3xl font-light text-plum">
                          {v}
                        </dd>
                        <dt className="mt-1 text-[0.55rem] uppercase tracking-[0.16em] text-soft">
                          {k}
                        </dt>
                      </div>
                    ))}
                  </dl>

                  <ul className="space-y-2.5">
                    {SAMPLE.map((r, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 rounded-2xl bg-plum/[0.04] px-3.5 py-3"
                      >
                        <span
                          aria-hidden="true"
                          className={`grid size-9 shrink-0 place-items-center rounded-full font-display text-sm ${
                            r.state === "Attending"
                              ? "bg-orchid/15 text-plum"
                              : "bg-ink/[0.06] text-soft"
                          }`}
                        >
                          {r.state === "Attending" ? (
                            <Heart className="size-3.5 fill-current" />
                          ) : (
                            "—"
                          )}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm">{r.name}</p>
                          <p className="mt-0.5 text-xs text-soft">
                            {r.state === "Attending"
                              ? `Bringing ${r.party}`
                              : "Sends their love"}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-[0.58rem] uppercase tracking-[0.12em] ${
                            r.state === "Attending"
                              ? "bg-orchid/12 text-plum"
                              : "bg-ink/[0.05] text-soft"
                          }`}
                        >
                          {r.state}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
