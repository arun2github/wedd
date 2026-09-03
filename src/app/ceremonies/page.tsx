import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { demoWeddingContent } from "@/data/wedding-data";
import { PageShell } from "@/components/marketing/PageShell";
import { Reveal } from "@/components/marketing/Reveal";

export const metadata: Metadata = {
  title: "Every ceremony — Sehra",
  description:
    "Haldi, mehendi, sangeet, the wedding, the reception. Every ceremony gets its own card, colour, venue and directions.",
};

/**
 * The multi-event argument, on its own page and made only here.
 *
 * Laid out as a vertical rail because that is what the content *is* — days in
 * order, each one a stop. The rail earns its place the way a timeline does:
 * the sequence carries information a guest actually needs, which is the test
 * for whether ordered structure is real or decorative.
 */
const DAYS = [
  { day: "Day one", name: "Haldi", when: "Morning", what: "Turmeric, family, and nobody dressed up yet. Usually at home, usually chaotic, and the one your cousins will photograph most." },
  { day: "Day two", name: "Mehendi", when: "Afternoon into night", what: "Henna, music, and four hours where nobody can use their hands. Guests need to know it runs long." },
  { day: "Day two", name: "Sangeet", when: "Evening", what: "The performances. Both families need the running order, and the ones dancing need to know when to arrive." },
  { day: "Day three", name: "The wedding", when: "Muhurat", what: "The one time that cannot move. It goes at the top of the page with the muhurat spelled out, because guests plan their travel around it." },
  { day: "Day three", name: "Reception", when: "Late evening", what: "A different venue, a different guest list, and often a different dress code from the morning." },
  { day: "Day four", name: "After party", when: "If you're having one", what: "Not everyone is invited to this, and the site can say so without anyone having to." },
];

export default function CeremoniesPage() {
  const g = demoWeddingContent.gallery;

  return (
    <PageShell tone="aubergine">
      <section className="mx-auto w-full max-w-7xl px-5 pt-16 sm:px-8 lg:pt-24">
        <Reveal className="max-w-3xl">
          <p className="text-[0.68rem] uppercase tracking-[0.32em] text-gold">Made for Indian weddings</p>
          <h1 className="mt-5 font-display text-[clamp(3rem,7vw,5.6rem)] font-light leading-[0.98] tracking-[-0.025em]">
            Every part of the
            <br />
            celebration.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-linen/70">
            Almost every wedding website in the world holds one date, one venue
            and one map pin. Yours runs for days, in different places, for
            different people.
          </p>
        </Reveal>
      </section>

      {/* The rail. A single gold line the days hang off — the spine of the page,
          and the only ornament on it. */}
      <section className="mx-auto w-full max-w-4xl px-5 py-20 sm:px-8 lg:py-28">
        <ol className="relative border-l border-gold/35 pl-8 sm:pl-14">
          {DAYS.map((d, i) => (
            <Reveal key={d.name} delay={0.05} className="relative pb-14 last:pb-0">
              <span
                aria-hidden="true"
                className="absolute -left-[2.28rem] top-2 size-2.5 rotate-45 bg-gold sm:-left-[3.78rem]"
              />
              <p className="text-[0.62rem] uppercase tracking-[0.28em] text-gold">
                {d.day} · {d.when}
              </p>
              <h2 className="mt-3 font-display text-4xl font-light sm:text-5xl">{d.name}</h2>
              <p className="mt-3 max-w-md leading-relaxed text-linen/70">{d.what}</p>
              {i === 3 && (
                <div className="mt-6 max-w-md overflow-hidden rounded-xl">
                  <Image
                    src={g[12].src}
                    alt={g[12].alt}
                    width={640}
                    height={400}
                    className="h-auto w-full object-cover"
                  />
                </div>
              )}
            </Reveal>
          ))}
        </ol>
      </section>


      <section className="bg-linen text-ink">
        <div className="mx-auto w-full max-w-4xl px-5 py-24 text-center sm:px-8">
          <Reveal>
            <h2 className="font-display text-[clamp(2.2rem,5vw,3.6rem)] font-light leading-[1.05] tracking-[-0.02em]">
              Name them whatever your family calls them.
            </h2>
            <p className="mx-auto mt-5 max-w-lg leading-relaxed text-soft">
              Nothing here is limited to the six above. Add as many as you are
              holding, in the order they happen, and each one gets its own card.
            </p>
            <Link
              href="/designs"
              className="mt-9 inline-block rounded-full bg-aubergine px-8 py-3.5 text-sm font-medium tracking-wide text-linen transition-colors hover:bg-wine"
            >
              See the designs
            </Link>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
