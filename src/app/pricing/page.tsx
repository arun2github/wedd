import Link from "next/link";
import type { Metadata } from "next";
import { TIERS, ADD_ONS, inr } from "@/lib/pricing";
import { PageShell } from "@/components/marketing/PageShell";
import { Reveal } from "@/components/marketing/Reveal";

export const metadata: Metadata = {
  title: "Pricing — Sehra",
  description:
    "Pay once, when you publish. Build the whole site and share a private link for free. No subscription.",
};

const FAQ = [
  { q: "Is there a subscription?", a: "No. You pay once for the site and that is the whole transaction. Nothing renews and there is nothing to cancel." },
  { q: "What happens when the time is up?", a: "The site stops being public. Nothing is deleted — extend it any time, including after the wedding, and it comes straight back." },
  { q: "Can we change things after publishing?", a: "Yes, and guests never see a half-finished edit. The live site is a snapshot: we edit a draft and it replaces the live version only when you say so." },
  { q: "Do you take a cut of gifts?", a: "No. There is no registry and no commission on anything." },
];

/**
 * Pricing, on its own page.
 *
 * A page rather than a strip on the home page, because price is the question
 * people arrive with a second time — they come back to it, and a bookmark
 * should land on it.
 */
export default function PricingPage() {
  return (
    <PageShell>
      <section className="mx-auto w-full max-w-7xl px-5 pt-16 sm:px-8 lg:pt-24">
        <Reveal className="max-w-3xl">
          <p className="text-[0.68rem] uppercase tracking-[0.32em] text-soft">Pricing</p>
          <h1 className="mt-5 font-display text-[clamp(3rem,7vw,5.6rem)] font-light leading-[0.98] tracking-[-0.025em]">
            Pay once,
            <br />
            when you publish.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-soft">
            Build the whole thing and share a private link with your family for
            nothing. Money only changes hands when guests are about to see it.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          {TIERS.map((tier, i) => (
            <Reveal key={tier.id} delay={i * 0.08}>
              <div
                className={`flex h-full flex-col rounded-xl border bg-card p-8 ${
                  tier.highlight ? "border-aubergine" : "border-ink/10"
                }`}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="font-display text-2xl font-light">{tier.name}</h2>
                  <p className="font-display text-3xl">{inr(tier.price)}</p>
                </div>
                <p className="mt-4 text-sm leading-snug text-soft">{tier.pitch}</p>
                <ul className="mt-7 flex flex-1 flex-col gap-2.5 text-sm text-soft">
                  {tier.features.map((f) => (
                    <li key={f} className="flex gap-3">
                      <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-gold" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/sign-in"
                  className={`mt-8 rounded-xl px-5 py-3 text-center text-sm font-medium transition-colors ${
                    tier.highlight
                      ? "bg-aubergine text-linen hover:bg-wine"
                      : "border border-ink/20 hover:border-ink/50"
                  }`}
                >
                  Start with {tier.name}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-6 grid gap-6 rounded-xl border border-ink/10 p-8 sm:grid-cols-2 lg:grid-cols-4">
          {ADD_ONS.map((a) => (
            <div key={a.name}>
              <p className="flex items-baseline gap-2 text-sm">
                <span className="font-medium">{a.name}</span>
                <span className="text-soft">{inr(a.price)}</span>
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-soft">{a.note}</p>
            </div>
          ))}
        </Reveal>
      </section>


      <section className="bg-aubergine text-linen">
        <div className="mx-auto w-full max-w-3xl px-5 py-24 sm:px-8">
          <Reveal>
            <h2 className="text-center font-display text-[clamp(2.2rem,5vw,3.4rem)] font-light tracking-[-0.02em]">
              Before you ask
            </h2>
          </Reveal>
          <dl className="mt-12 divide-y divide-linen/15 border-y border-linen/15">
            {FAQ.map((f, i) => (
              <Reveal key={f.q} delay={i * 0.05}>
                <div className="grid gap-3 py-7 sm:grid-cols-[1fr_1.2fr] sm:gap-10">
                  <dt className="font-display text-xl font-light">{f.q}</dt>
                  <dd className="text-sm leading-relaxed text-linen/70">{f.a}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>
    </PageShell>
  );
}
