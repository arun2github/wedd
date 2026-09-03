import Link from "next/link";
import { Reveal } from "./Reveal";

/**
 * What the couple receives when guests reply.
 *
 * Distinct from `/guests`, which is what a guest *sees*. This is the other end
 * of the same action, and it is the half a couple is actually buying.
 *
 * Two of the four items below are marked as not yet available, in the
 * interface rather than in a footnote. Every capability listed without a badge
 * runs today; a page that quietly lists what is planned alongside what ships
 * generates refund requests, not sales.
 */

const NOW = [
  { t: "Every reply in one list", d: "Who is coming, how many they are bringing, who declined — and the note they left with it." },
  { t: "A running headcount", d: "Attending, declined and total guests, recalculated as replies land. The number the caterer asks for." },
];

const COMING = [
  { t: "Replies per ceremony", d: "Which guests are coming to the haldi, the wedding and the reception separately, rather than one yes for the whole week." },
  { t: "Replies on your phone", d: "The guest list in a mobile app, with a notification when someone answers." },
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
    <section className="mx-auto w-full max-w-7xl px-5 py-24 sm:px-8 lg:py-28">
      <div className="grid items-start gap-14 lg:grid-cols-[1fr_0.85fr] lg:gap-20">
        <Reveal>
          <p className="text-[0.68rem] uppercase tracking-[0.32em] text-soft">Replies</p>
          <h2 className="mt-5 max-w-lg font-display text-[clamp(2.2rem,5vw,3.8rem)] font-light leading-[1.04] tracking-[-0.02em]">
            You will know who is coming.
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-soft">
            Guests answer on the same page they read the invitation on. No
            account, no app, nothing to install — and the answers arrive
            somewhere you can actually read them.
          </p>

          <div className="mt-10 space-y-7">
            {NOW.map((c) => (
              <div key={c.t} className="border-t border-ink/12 pt-5">
                <h3 className="font-display text-xl font-light">{c.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-soft">{c.d}</p>
              </div>
            ))}

            {COMING.map((c) => (
              <div key={c.t} className="border-t border-ink/12 pt-5">
                <h3 className="flex flex-wrap items-center gap-3 font-display text-xl font-light text-soft">
                  {c.t}
                  <span className="rounded-full border border-gold/60 px-2.5 py-0.5 font-sans text-[0.58rem] uppercase tracking-[0.18em] text-gold">
                    In build
                  </span>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-soft">{c.d}</p>
              </div>
            ))}
          </div>

          <Link
            href="/guests"
            className="mt-9 inline-block border-b border-ink/30 pb-1 text-sm transition-colors hover:border-ink"
          >
            See what your guests get
          </Link>
        </Reveal>

        {/* The list, at the shape it actually arrives in. */}
        <Reveal delay={0.12}>
          <div className="rounded-xl border border-ink/12 bg-card p-6 shadow-sm">
            <div className="flex items-baseline justify-between gap-3 border-b border-ink/10 pb-4">
              <p className="font-display text-lg font-light">Replies</p>
              <p className="text-[0.6rem] uppercase tracking-[0.2em] text-soft">Sample view</p>
            </div>

            <dl className="grid grid-cols-3 gap-3 border-b border-ink/10 py-5 text-center">
              {[["Attending", "2"], ["Guests", "6"], ["Declined", "1"]].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[0.58rem] uppercase tracking-[0.2em] text-soft">{k}</dt>
                  <dd className="mt-1 font-display text-3xl font-light">{v}</dd>
                </div>
              ))}
            </dl>

            <ul className="divide-y divide-ink/10">
              {SAMPLE.map((r, i) => (
                <li key={i} className="flex items-center justify-between gap-4 py-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm">{r.name}</p>
                    <p className="mt-0.5 text-xs text-soft">
                      {r.state === "Attending" ? `Bringing ${r.party}` : "Sends their love"}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-[0.62rem] uppercase tracking-[0.14em] ${
                      r.state === "Attending"
                        ? "bg-aubergine/8 text-aubergine"
                        : "bg-ink/5 text-soft"
                    }`}
                  >
                    {r.state}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
