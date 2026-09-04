/**
 * A design is a recipe, not a file.
 *
 * Nineteen designs were running on seven hardcoded component trees, so four of
 * them shared a hero, four shared a gallery, and "a new template" meant either
 * a repaint or a new file to maintain forever. Here a design instead *declares*
 * which variant fills each slot and in what order the sections run.
 *
 * Two things fall out of that. Combinations multiply without new files — four
 * heroes by three galleries by three event treatments is already thirty-six
 * distinct compositions before ordering. And the CMS becomes possible: an
 * admin can offer "swap the hero" or "move the gallery above the story"
 * because those are now values in a row, not code.
 */

export type HeroVariant =
  /** Curtain, envelope film, then the invitation grows out of it. */
  | "cinematic"
  /** Portrait on one half, type on the other, meeting on a hard edge. */
  | "split"
  /** The couple's initials drawn as a mark, photograph behind. */
  | "monogram"
  /** Type first, at scale, with the photograph reduced to a band. */
  | "typographic";

export type EventsVariant =
  /** Horizontal editorial timeline, days running left to right. */
  | "timeline"
  /** Vertical ruled schedule, the way an order of service prints it. */
  | "schedule"
  /** Large image cards, one photograph per ceremony. */
  | "cards";

export type GalleryVariant =
  /** Uneven masonry; heights follow each photograph's own aspect. */
  | "masonry"
  /** Full-bleed horizontal scroll, one plate at a time. */
  | "horizontal"
  /** Scattered prints with white borders, slightly rotated. */
  | "polaroid";

export type NavVariant =
  /** Centred monogram with the links beneath it. */
  | "centred"
  /** Transparent over the hero, solid once you scroll past it. */
  | "overlay"
  /** Initials only, fixed in the corner, no links until opened. */
  | "monogram";

export type MotionVariant =
  /** Long opacity fades, almost no travel. */
  | "slow-fade"
  /** Content wiped in behind a moving edge. */
  | "mask-reveal"
  /** Images drift against the scroll. */
  | "parallax"
  /** Short, springy, slightly overshooting. */
  | "spring";

/** Every section a template can render. Order is the design's to choose. */
export type SectionId =
  | "couple" | "story" | "events" | "gallery" | "venue"
  | "film" | "families" | "countdown" | "rsvp" | "closing";

export interface Recipe {
  hero: HeroVariant;
  events: EventsVariant;
  gallery: GalleryVariant;
  nav: NavVariant;
  motion: MotionVariant;
  /** The hero is always first and is not listed. Everything else is ordered
   *  here, and a section left out simply does not render. */
  order: SectionId[];
}

/** The order most couples expect, for designs with no reason to differ. */
export const DEFAULT_ORDER: SectionId[] = [
  "countdown", "couple", "story", "events", "venue",
  "gallery", "film", "families", "rsvp", "closing",
];
