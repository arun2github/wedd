import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { PageShell } from "@/components/marketing/PageShell";
import { Reveal } from "@/components/marketing/Reveal";
import { sectionsOf, listTemplates } from "@/lib/templates";
import { demoWeddingContent } from "@/data/wedding-data";

export const metadata: Metadata = {
  title: "For couples — Sehra",
  description:
    "Change your design without retyping anything. Stay private until you publish. Edit after the invitations go out. What you actually get.",
};

/**
 * What a couple gets, on its own page.
 *
 * Every item below is something the product does today — most of them fall out
 * of one architectural decision, that content and presentation are stored
 * apart. Nothing here is a roadmap item written in the present tense, which is
 * the usual failure of a page like this.
 */
const CAPABILITIES = [
  {
    t: "Change your design without retyping a word",
    d: "Your story, dates, venues and photographs are kept separately from the design. Switch from Royal Ivory to Jali a week before the wedding and everything you have written moves with it.",
  },
  {
    t: "Nobody sees it until you say so",
    d: "Your site is private while you build. Share a link with your parents and your sister, get it wrong, fix it, and no guest is any the wiser.",
  },
  {
    t: "Share the wrong link? Revoke it",
    d: "The private link can be rotated. If it reaches a group chat you did not intend, the old one simply stops working.",
  },
  {
    t: "Edit after the invitations go out",
    d: "The live site is a snapshot. We change the draft, you read it, and it only replaces what guests see when you approve — so a half-finished sentence is never on someone's phone.",
  },
  {
    t: "Take it down, put it back",
    d: "Unpublish at any time without losing anything. The last published version is kept, so putting it back is one click, not a rebuild.",
  },
];

export default function ForCouplesPage() {
  const sections = sectionsOf(listTemplates()[0]);
  const g = demoWeddingContent.gallery;

  return (
    <PageShell>
      <section className="mx-auto w-full max-w-7xl px-5 pt-16 sm:px-8 lg:pt-24">
        <Reveal className="max-w-3xl">
          <p className="text-[0.68rem] uppercase tracking-[0.32em] text-soft">For couples</p>
          <h1 className="mt-5 font-display text-[clamp(3rem,7vw,5.6rem)] font-light leading-[0.98] tracking-[-0.025em]">
            Nothing you write
            <br />
            is ever wasted.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-soft">
            You will change your mind. About the design, the wording, the guest
            list, probably the venue. All of that is fine here.
          </p>
        </Reveal>
      </section>

      {/* Two columns of plain statements. No icons: a small picture next to
          each line would say nothing the line does not already say. */}
      <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8">
        <div className="grid gap-x-12 gap-y-12 sm:grid-cols-2">
          {CAPABILITIES.map((c, i) => (
            <Reveal key={c.t} delay={(i % 2) * 0.06}>
              <div className="border-t border-ink/12 pt-6">
                <h2 className="font-display text-2xl font-light leading-snug">{c.t}</h2>
                <p className="mt-3 leading-relaxed text-soft">{c.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-aubergine text-linen">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal className="arch-soft relative aspect-[4/5] overflow-hidden">
            <Image
              src={g[4].src}
              alt={g[4].alt}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-[0.66rem] uppercase tracking-[0.3em] text-gold">On every design</p>
            <h2 className="mt-5 font-display text-[clamp(2rem,4.4vw,3.4rem)] font-light leading-[1.05] tracking-[-0.02em]">
              Eleven sections, however many ceremonies.
            </h2>
            <ul className="mt-7 flex flex-wrap gap-2">
              {sections.map((s) => (
                <li key={s} className="rounded-full border border-linen/25 px-3.5 py-1.5 text-sm text-linen/80">
                  {s}
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-linen/65">
              You are not choosing between designs that have different features.
              All twelve carry all of it — they differ in how they look, which
              is the only thing worth choosing between.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-ink/10">
        <div className="mx-auto w-full max-w-3xl px-5 py-24 text-center sm:px-8">
          <Reveal>
            <h2 className="font-display text-[clamp(2.2rem,5vw,3.6rem)] font-light leading-[1.05] tracking-[-0.02em]">
              Start with a design. Change it later.
            </h2>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link
                href="/designs"
                className="rounded-full bg-aubergine px-8 py-3.5 text-sm font-medium tracking-wide text-linen transition-colors hover:bg-wine"
              >
                See all twelve
              </Link>
              <Link
                href="/pricing"
                className="rounded-full border border-ink/20 px-8 py-3.5 text-sm tracking-wide transition-colors hover:border-ink/50"
              >
                What it costs
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
