import { pageTitle } from "@/lib/brand";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { PageShell } from "@/components/marketing/PageShell";
import { Reveal } from "@/components/marketing/Reveal";
import { demoWeddingContent } from "@/data/wedding-data";

export const metadata: Metadata = {
  title: pageTitle("How it works"),
  description:
    "Choose a design, send us your details, see it privately, publish when you are ready. Four steps and we do the building.",
};

/**
 * The process, on its own page.
 *
 * Numbered because it is genuinely sequential — none of these can happen
 * before the one above it, which is the only condition under which numbered
 * markers carry information rather than decorate a list.
 */
const STEPS = [
  { t: "Choose your design", d: "Open any of them running with real content first — nothing is bought sight unseen.", photoIndex: 1 },
  { t: "Send us your details", d: "Names, dates, venues, who is hosting, and your photographs. WhatsApp is fine; so is a folder of images and a voice note.", photoIndex: 7 },
  { t: "See it privately", d: "We build it and send back a private link. Free, and only the people you send it to can open it. Change anything you like.", photoIndex: 10 },
  { t: "Publish and share", d: "Pay once. The site goes live at your own address and starts collecting replies the moment you send the link.", photoIndex: 14 },
];

export default function HowItWorksPage() {
  const g = demoWeddingContent.gallery;

  return (
    <PageShell>
      <section className="mx-auto w-full max-w-7xl px-5 pt-16 sm:px-8 lg:pt-24">
        <Reveal className="max-w-3xl">
          <p className="text-[0.68rem] uppercase tracking-[0.32em] text-soft">How it works</p>
          <h1 className="mt-5 font-display text-[clamp(3rem,7vw,5.6rem)] font-light leading-[0.98] tracking-[-0.025em]">
            You send it.
            <br />
            We build it.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-soft">
            You are planning a wedding. You should not also be learning a
            website builder.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-24 px-5 py-24 sm:px-8 lg:gap-32 lg:py-32">
        {STEPS.map((s, i) => (
          <Reveal key={s.t}>
            <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
              <div className={`rounded-xl relative aspect-[4/5] overflow-hidden ${i % 2 ? "lg:order-2" : ""}`}>
                <Image
                  src={g[s.photoIndex].src}
                  alt={g[s.photoIndex].alt}
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className={i % 2 ? "lg:order-1" : ""}>
                <span className="font-display text-6xl font-light text-soft/45">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="mt-4 max-w-sm font-display text-[clamp(1.9rem,3.6vw,3rem)] font-light leading-[1.06] tracking-[-0.02em]">
                  {s.t}
                </h2>
                <p className="mt-4 max-w-md leading-relaxed text-soft">{s.d}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </section>

      <section className="border-t border-ink/10">
        <div className="mx-auto w-full max-w-3xl px-5 py-24 text-center sm:px-8">
          <Reveal>
            <h2 className="font-display text-[clamp(2.2rem,5vw,3.6rem)] font-light leading-[1.05] tracking-[-0.02em]">
              Start with a design.
            </h2>
            <Link
              href="/designs"
              className="mt-8 inline-block rounded-full bg-aubergine px-8 py-3.5 text-sm font-medium tracking-wide text-linen transition-colors hover:bg-wine"
            >
              See all designs
            </Link>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
