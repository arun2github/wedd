import type { ReactNode } from "react";
import type { Recipe, SectionId } from "@/lib/recipe";
import type { WeddingData } from "@/types/wedding";
import { RSVP } from "@/components/sections/RSVP";
import { HeroSplit, HeroMonogram, HeroTypographic } from "./parts/heroes";
import { EventsTimeline, EventsSchedule, EventsCards } from "./parts/events";
import { GalleryMasonry, GalleryHorizontal, GalleryPolaroid } from "./parts/galleries";
import { NavCentred, NavOverlay, NavMonogram } from "./parts/navs";
import { CoupleBlock, StoryBlock, VenueBlock, FilmBlock, FamiliesBlock, ClosingBlock } from "./parts/common";
import { CountdownCells, CountdownPlate, CountdownRule } from "@/components/sections/countdowns";

/**
 * Renders a design from its recipe.
 *
 * This is the whole point of the refactor: a design is now a set of choices —
 * which hero, which gallery, which order — instead of a component file. Adding
 * a template stops meaning adding code, which is also what makes the CMS
 * possible: "swap the hero" and "move the gallery above the story" become
 * values in a row rather than a deploy.
 *
 * `cinematic` is deliberately absent from the hero map. It depends on the
 * curtain and the envelope film, which are wired to `IntroProvider`, so those
 * designs still run through `ScrollInvitation`. Lifting it out is worth doing,
 * but not worth doing badly.
 */

const HEROES = {
  split: HeroSplit,
  monogram: HeroMonogram,
  typographic: HeroTypographic,
} as const;

const EVENTS = {
  timeline: EventsTimeline,
  schedule: EventsSchedule,
  cards: EventsCards,
} as const;

const GALLERIES = {
  masonry: GalleryMasonry,
  horizontal: GalleryHorizontal,
  polaroid: GalleryPolaroid,
} as const;

const NAVS = {
  centred: NavCentred,
  overlay: NavOverlay,
  monogram: NavMonogram,
} as const;

/* The countdown follows the motion language rather than getting a fourth
   dropdown of its own — a ruled line suits a slow fade, cells suit a mask. */
const COUNTDOWNS = {
  "slow-fade": CountdownRule,
  "mask-reveal": CountdownCells,
  parallax: CountdownPlate,
  spring: CountdownCells,
} as const;

/** Only sections the recipe actually renders become nav links. A link to an
 *  anchor the page does not have is worse than no link. */
const NAV_LABELS: Partial<Record<SectionId, string>> = {
  events: "Ceremonies",
  story: "Our story",
  gallery: "Photographs",
  venue: "Venue",
  rsvp: "Reply",
};

export function ComposedInvitation({ data, recipe }: { data: WeddingData; recipe: Recipe }) {
  const Hero = HEROES[recipe.hero as keyof typeof HEROES] ?? HeroSplit;
  const Events = EVENTS[recipe.events];
  const Gallery = GALLERIES[recipe.gallery];
  const Nav = NAVS[recipe.nav];
  const Countdown = COUNTDOWNS[recipe.motion];

  const links = recipe.order
    .filter((id) => NAV_LABELS[id])
    .map((id) => ({ href: `#${id}`, label: NAV_LABELS[id]! }));

  const photos = data.gallery.map((g) => ({ src: g.src, alt: g.alt }));

  const render = (id: SectionId): ReactNode => {
    switch (id) {
      case "countdown": return <Countdown key={id} date={data.weddingDate} />;
      case "couple":    return <CoupleBlock key={id} data={data} />;
      case "story":     return <StoryBlock key={id} data={data} />;
      case "events":    return <Events key={id} events={data.events} photos={photos} />;
      case "gallery":   return <Gallery key={id} gallery={data.gallery} />;
      case "venue":     return <VenueBlock key={id} data={data} />;
      case "film":      return <FilmBlock key={id} data={data} />;
      case "families":  return <FamiliesBlock key={id} data={data} />;
      case "closing":   return <ClosingBlock key={id} data={data} />;
      case "rsvp":
        return <div key={id} id="rsvp"><RSVP rsvp={data.rsvp} /></div>;
    }
  };

  return (
    <div className="min-h-dvh bg-surface text-ink">
      <Nav brideName={data.couple.brideName} groomName={data.couple.groomName} links={links} />
      <Hero data={data} />
      {recipe.order.map(render)}
    </div>
  );
}
