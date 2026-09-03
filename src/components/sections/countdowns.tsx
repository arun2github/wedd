"use client";

import { useCountdown } from "@/lib/countdown";

/**
 * One countdown, six presentations.
 *
 * Every architecture now carries a countdown, because a guest checking "how
 * long have I got" is the second most common reason a wedding link is opened.
 * But a single shared component pasted into seven layouts is precisely the
 * sameness this catalogue has been shedding — so the *timing* is shared (one
 * hook, already SSR-safe) and the *presentation* belongs to the architecture.
 *
 * A programme states it in a ruled line. A lattice sets it in geometric cells.
 * An album prints it as a plate number. Same data, six different objects.
 */

const LABELS = ["days", "hours", "minutes", "seconds"] as const;
const pad = (n: number) => String(n).padStart(2, "0");

function useParts(date: string) {
  const p = useCountdown(date);
  return { parts: [p.days, p.hours, p.minutes, p.seconds] as const, isPast: p.isPast };
}

/** `program` — a ruled line in the order of service. No boxes, no grid. */
export function CountdownRule({ date }: { date: string }) {
  const { parts, isPast } = useParts(date);
  return (
    <div className="mx-auto max-w-2xl px-6 py-14 text-center">
      <div className="flex items-center gap-4">
        <span className="h-px flex-1 bg-gilt/40" />
        <span className="text-[0.6rem] uppercase tracking-[0.34em] text-ink-soft">
          {isPast ? "Married" : "Until the day"}
        </span>
        <span className="h-px flex-1 bg-gilt/40" />
      </div>
      {!isPast && (
        <p className="mt-6 font-display text-2xl text-brand">
          {parts.map((v, i) => (
            <span key={LABELS[i]}>
              {v}
              <span className="px-1.5 text-sm lowercase text-ink-soft">{LABELS[i]}</span>
              {i < 3 && <span className="px-1 text-gilt-ink">·</span>}
            </span>
          ))}
        </p>
      )}
    </div>
  );
}

/** `screen` — numerals set into lattice cells, hard geometric borders. */
export function CountdownCells({ date }: { date: string }) {
  const { parts, isPast } = useParts(date);
  if (isPast) return null;
  return (
    <section className="border-t border-gilt/30 px-6 py-14 md:px-12">
      <h2 className="text-[0.62rem] uppercase tracking-[0.32em] text-ink-soft">Until the day</h2>
      <div className="mt-6 grid grid-cols-4 gap-px bg-gilt/30">
        {parts.map((v, i) => (
          <div key={LABELS[i]} className="bg-surface py-8 text-center">
            <span className="font-display text-4xl tabular-nums text-brand sm:text-6xl">{pad(v)}</span>
            <span className="mt-2 block text-[0.52rem] uppercase tracking-[0.28em] text-ink-soft">
              {LABELS[i]}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

/** `album` — printed like a plate number: one huge thin figure, tiny caption. */
export function CountdownPlate({ date }: { date: string }) {
  const { parts, isPast } = useParts(date);
  if (isPast) return null;
  return (
    <section className="grid gap-6 border-t border-gilt/30 px-6 py-16 md:grid-cols-12 md:px-12">
      <p className="text-[0.58rem] uppercase tracking-[0.3em] text-ink-soft md:col-span-3">
        Days remaining
      </p>
      <div className="md:col-span-9">
        <p className="font-display text-[clamp(4rem,16vw,11rem)] leading-[0.82] tabular-nums text-brand">
          {parts[0]}
        </p>
        <p className="mt-3 text-xs text-ink-soft">
          and {parts[1]} hours, {parts[2]} minutes — counting down to the muhurat.
        </p>
      </div>
    </section>
  );
}

/** `patrika` — inline in the ribbon, hairline-separated, never boxed. */
export function CountdownRibbon({ date }: { date: string }) {
  const { parts, isPast } = useParts(date);
  if (isPast) return null;
  return (
    <div className="text-center">
      <span aria-hidden="true" className="mx-auto block h-px w-24 bg-gilt/60" />
      <p className="mt-14 text-[0.58rem] uppercase tracking-[0.36em] text-gilt-ink">Until the day</p>
      <p className="mt-6 font-display text-[clamp(2rem,7vw,3rem)] leading-none tabular-nums text-brand">
        {parts[0]}
        <span className="px-2 text-[0.4em] uppercase tracking-[0.2em] text-ink-soft">days</span>
        {parts[1]}
        <span className="px-2 text-[0.4em] uppercase tracking-[0.2em] text-ink-soft">hrs</span>
      </p>
    </div>
  );
}

/** `panel` — its own full-height panel in the horizontal track. */
export function CountdownPanel({ date }: { date: string }) {
  const { parts, isPast } = useParts(date);
  return (
    <section className="flex h-full w-screen shrink-0 snap-center flex-col items-center justify-center gap-8 bg-surface-sunk px-8">
      <p className="text-[0.58rem] uppercase tracking-[0.38em] text-ink-soft">
        {isPast ? "Married" : "Until the day"}
      </p>
      {!isPast && (
        <div className="flex items-end gap-6 sm:gap-12">
          {parts.map((v, i) => (
            <div key={LABELS[i]} className="text-center">
              <span
                className="font-display text-[clamp(2.5rem,11vw,6rem)] leading-none tabular-nums"
                style={{ color: `var(--${(["rite-1", "rite-2", "brand", "rite-3"] as const)[i]})` }}
              >
                {pad(v)}
              </span>
              <span className="mt-2 block text-[0.5rem] uppercase tracking-[0.26em] text-ink-soft">
                {LABELS[i]}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/** `card` — one line of small caps inside the border. Nothing added. */
export function CountdownLine({ date }: { date: string }) {
  const { parts, isPast } = useParts(date);
  if (isPast) return null;
  return (
    <p className="mt-10 text-[0.56rem] uppercase tracking-[0.3em] text-ink-soft">
      {parts[0]} days · {parts[1]} hours · {parts[2]} minutes
      <span className="mt-1 block text-gilt-ink">until we say yes</span>
    </p>
  );
}
