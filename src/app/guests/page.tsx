import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/marketing/PageShell";
import { Reveal } from "@/components/marketing/Reveal";
import { getTemplate } from "@/lib/templates";
import { demoWeddingContent } from "@/data/wedding-data";
import { TemplatePoster } from "@/components/marketing/TemplatePoster";

export const metadata: Metadata = {
  title: "What your guests see — Sehra",
  description:
    "One link, no app, one tap to reply. What 330 guests actually find when they open your wedding website.",
};

/**
 * The guest side, on its own page.
 *
 * Framed as questions rather than features because that is how a guest arrives
 * — they are not browsing, they are checking one thing and closing the tab.
 * The order is the order they ask them in.
 */
const QUESTIONS = [
  { q: "Which days am I invited to?", a: "Every ceremony listed with its date, time and dress code. Guests invited to some days and not others see only theirs." },
  { q: "Where is it, and how do I get there?", a: "Each venue with its own address and a directions link that opens in whichever maps app is already on their phone." },
  { q: "Can I come, and who with?", a: "One tap to reply, and a number for how many are coming. No account, no app, no password." },
  { q: "What should I expect?", a: "Your story, the gallery, the film, and who is hosting — the things that make a link worth opening twice." },
];

export default function GuestsPage() {
  const { brideName, groomName, heroPhoto } = demoWeddingContent.couple;
  const showcase = getTemplate("kanjeevaram");

  return (
    <PageShell>
      <section className="mx-auto grid w-full max-w-7xl items-center gap-14 px-5 pt-16 sm:px-8 lg:grid-cols-[1fr_0.8fr] lg:pt-24">
        <Reveal>
          <p className="text-[0.68rem] uppercase tracking-[0.32em] text-soft">The guest experience</p>
          <h1 className="mt-5 font-display text-[clamp(3rem,7vw,5.4rem)] font-light leading-[0.98] tracking-[-0.025em]">
            Everything they
            <br />
            need. One link.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-soft">
            Three hundred and thirty people will open it. Most on a phone, most
            once, many of them your grandparents. It has to work first time.
          </p>
        </Reveal>

        {/* A phone, because that is the object this is read on. Deliberately a
            plain frame around the real design rather than a branded device
            render — the product is what is on the screen. */}
        <Reveal delay={0.12} className="mx-auto w-full max-w-[16rem]">
          <div className="rounded-[2.2rem] border-8 border-ink/85 bg-ink/85 shadow-2xl">
            <TemplatePoster
              template={showcase}
              photo={heroPhoto}
              brideName={brideName}
              groomName={groomName}
              className="aspect-[9/19] rounded-[1.5rem]"
            />
          </div>
        </Reveal>
      </section>

      <section className="mx-auto w-full max-w-5xl px-5 py-24 sm:px-8">
        <ol className="divide-y divide-ink/10 border-y border-ink/10">
          {QUESTIONS.map((item, i) => (
            <Reveal key={item.q} delay={i * 0.06}>
              <li className="grid gap-3 py-9 sm:grid-cols-[1.1fr_1fr] sm:gap-10">
                <h2 className="font-display text-2xl font-light leading-snug sm:text-3xl">{item.q}</h2>
                <p className="leading-relaxed text-soft">{item.a}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>


      <section className="bg-aubergine text-linen">
        <div className="mx-auto w-full max-w-3xl px-5 py-24 text-center sm:px-8">
          <Reveal>
            <h2 className="font-display text-[clamp(2.2rem,5vw,3.6rem)] font-light leading-[1.05] tracking-[-0.02em]">
              No app. No account. No password.
            </h2>
            <p className="mx-auto mt-5 max-w-lg leading-relaxed text-linen/70">
              A guest who has to install something to reply will not reply. The
              whole thing is a web page, and it opens straight from WhatsApp.
            </p>
            <Link
              href="/designs"
              className="mt-9 inline-block rounded-full bg-gold px-8 py-3.5 text-sm font-medium tracking-wide text-aubergine transition-colors hover:bg-gold/90"
            >
              See the designs
            </Link>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
