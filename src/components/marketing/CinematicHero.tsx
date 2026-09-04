import { BRAND } from "@/lib/brand";
import Image from "next/image";
import Link from "next/link";

/**
 * The opening frame.
 *
 * A hairline of light widens into a full-bleed photograph while the title
 * arrives in beats — one orchestrated moment, then stillness. Everything is
 * CSS keyframes rather than JavaScript animation, which matters twice over: it
 * runs before hydration, so the first thing a visitor sees is not a blank
 * rectangle waiting for a bundle; and it degrades to "already open" if it never
 * runs at all, so the hero can never be an empty page.
 *
 * Letterbox bars are real elements rather than a crop. They hold the frame at
 * roughly 2.39:1 on any screen, and they are the cheapest honest way to say
 * "this is a film" without a video file on the critical path.
 */
export function CinematicHero({ photo }: { photo: string }) {
  return (
    <section className="relative isolate flex min-h-dvh flex-col justify-center overflow-hidden bg-noir">
      {/* The frame itself, opening. */}
      <div className="absolute inset-0 motion-safe:animate-[aperture-open_1.4s_cubic-bezier(0.16,1,0.3,1)_0.15s_backwards]">
        <div className="absolute inset-0 motion-safe:animate-[slow-push_28s_ease-out_forwards]">
          <Image
            src={photo}
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
        </div>
        {/*
          Two scrims, deliberately light. The first pass sat at 45–95% over an
          already-dark evening photograph and rendered the frame black — the
          image was doing no work at all. A scrim exists to protect the type,
          not to hide what was chosen to be seen.
        */}
        <div className="absolute inset-0 bg-gradient-to-b from-noir/70 via-noir/20 to-noir/85" />
        <div className="absolute inset-0 bg-[radial-gradient(75%_65%_at_50%_48%,transparent_0%,rgba(18,16,14,0.55)_100%)]" />
      </div>

      {/* Letterbox. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[7vh] bg-noir" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[7vh] bg-noir" />

      {/*
        The hairline the frame opens from, fading as the aperture passes it.

        `both`, not `backwards`: a reversed animation ends on its `from` frame,
        but without a forwards fill the element snaps back to its natural state
        the instant it finishes — which left the line drawn across the title
        permanently.
      */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 z-10 h-px w-[60vw] -translate-x-1/2 bg-bone/70 motion-safe:animate-[rise-in_0.5s_ease-out_1.1s_reverse_both] motion-reduce:hidden"
      />

      <div className="relative z-20 mx-auto w-full max-w-4xl px-6 text-center sm:px-8">
        <p className="text-[0.62rem] uppercase tracking-[0.42em] text-dust motion-safe:animate-[rise-in_0.9s_ease-out_1.1s_backwards]">
          A design for every tradition · one for your wedding
        </p>

        <h1 className="mt-7 font-display text-[clamp(3rem,9vw,7.5rem)] italic leading-[0.92] tracking-[-0.02em] text-bone motion-safe:animate-[rise-in_1.1s_ease-out_1.35s_backwards]">
          The invitation
          <br />
          they&rsquo;ll{" "}
          {/* The one true script on the page. A signature, not a typeface
              choice — which is the only dose at which script reads expensive
              rather than dated. */}
          <span className="font-script not-italic text-[1.35em] leading-[0.6] text-bone">
            keep
          </span>
          .
        </h1>

        <p className="mx-auto mt-8 max-w-lg text-base leading-relaxed text-bone/75 motion-safe:animate-[rise-in_1.1s_ease-out_1.6s_backwards] sm:text-lg">
          Designed wedding websites. Choose one, we build it with you,
          and every ceremony of your wedding lives at a single link.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 motion-safe:animate-[rise-in_1.1s_ease-out_1.85s_backwards]">
          <a
            href="#reel"
            className="rounded-full bg-bone px-8 py-3.5 text-sm font-medium tracking-wide text-noir transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bone"
          >
            See the designs
          </a>
          <Link
            href="#start"
            className="rounded-full border border-bone/30 px-8 py-3.5 text-sm tracking-wide text-bone transition-colors hover:border-bone/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bone"
          >
            Start yours
          </Link>
        </div>
      </div>

      {/* Film slate. Names what you are looking at, the way a frame is labelled. */}
      <div className="absolute inset-x-0 bottom-[7vh] z-20 flex items-end justify-between px-6 pb-5 text-[0.58rem] uppercase tracking-[0.3em] text-dust sm:px-10">
        <span>{BRAND}</span>
        <span className="hidden sm:inline">Free to preview · pay once to publish</span>
      </div>
    </section>
  );
}
