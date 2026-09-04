/**
 * The template catalogue.
 *
 * Twelve templates are twelve *skins over four page architectures*, not twelve
 * hand-built sites. That distinction is the whole product: a bespoke component
 * tree per template would mean twelve codebases to keep alive, and the
 * thirteenth would cost the same as the first. Here an archetype supplies the
 * structural difference — how the page is composed — and a skin supplies the
 * identity: ground, palette, type, ornament.
 *
 * Everything below is data. Adding a template is an entry in this file, never
 * an edit to a stylesheet, which is what makes the catalogue manageable from
 * the admin panel rather than from a deploy.
 */

/**
 * How the page is *built*, as opposed to how it is painted.
 *
 * Four archetypes rather than twelve because structure is expensive and
 * identity is cheap. Two templates on the same archetype still read as
 * different sites when their ground, type and ornament all differ; two
 * templates that differ only in hue read as the same site twice.
 */
/* Note: `patrika` names both a design and an architecture. They are different
   namespaces — a design id keys `TEMPLATES`, an architecture id keys the
   component map — and the collision is harmless, but it is worth knowing
   before someone greps for it. */
export type ArchetypeId =
  | "scroll" | "program" | "screen" | "album"
  | "patrika" | "panel" | "card";

export const ARCHETYPES: Record<ArchetypeId, { name: string; premise: string }> = {
  scroll: {
    name: "Scroll invitation",
    premise:
      "Full-bleed cinematic sections that arrive one at a time. The page is a sequence you fall through.",
  },
  program: {
    name: "Order of service",
    premise:
      "A printed document: one narrow measure, ruled sections, the day numbered in the order it happens. Numbering is earned here — a liturgy genuinely is a sequence the guest follows.",
  },
  screen: {
    name: "Lattice screen",
    premise:
      "Content framed and revealed through perforated geometry. Panels and wide borders rather than full bleeds.",
  },
  album: {
    name: "Album",
    premise:
      "Photography-led editorial. Asymmetric grid, large plates, small captions carrying the words.",
  },
  patrika: {
    name: "Unrolling scroll",
    premise:
      "One continuous ribbon with no section breaks at all, opening like a rolled invitation.",
  },
  panel: {
    name: "Swipe panels",
    premise:
      "Read sideways. One full-height panel per ceremony, dealt out like the insert cards in a printed set.",
  },
  card: {
    name: "Single card",
    premise:
      "The entire wedding on one dense ornate panel, read in a single look. No scrolling between sections.",
  },
};

/**
 * The faces available to a skin.
 *
 * A fixed library rather than free choice: `next/font` resolves at module
 * scope, so a font a tenant types into a box cannot be loaded. Twelve
 * templates drawing on seven faces is plenty of variety, and it keeps the
 * loaded weight predictable.
 */
export type DisplayFont =
  | "cormorant" | "marcellus" | "fraunces" | "yeseva"
  | "playfair" | "bodoni" | "cinzel" | "gilda" | "instrument";
export type BodyFont = "inter" | "jost" | "spectral" | "tenor";

/**
 * Face id → the CSS variable `next/font` publishes for it.
 *
 * Kept here rather than in `fonts.ts` because it is data, not font loading:
 * `next/font` only evaluates inside the Next compiler, so anything importing
 * that module cannot be exercised outside a build. This mapping stays testable.
 */
const DISPLAY_VAR: Record<DisplayFont, string> = {
  cormorant: "var(--font-cormorant)",
  marcellus: "var(--font-marcellus)",
  fraunces: "var(--font-fraunces)",
  yeseva: "var(--font-yeseva)",
  playfair: "var(--font-playfair)",
  bodoni: "var(--font-bodoni)",
  cinzel: "var(--font-cinzel)",
  gilda: "var(--font-gilda)",
  instrument: "var(--font-instrument)",
};

const BODY_VAR: Record<BodyFont, string> = {
  inter: "var(--font-inter)",
  jost: "var(--font-jost)",
  spectral: "var(--font-spectral)",
  tenor: "var(--font-tenor)",
};

/**
 * A template's type choice, as the two variables the utilities resolve through.
 *
 * `font-display` and `font-sans` point at `--display-face` and `--body-face`
 * rather than at a family, so a template changes its voice the same way it
 * changes its palette: by redefining two variables on its wrapper.
 */
export function fontVars(fonts: { display: DisplayFont; body: BodyFont }): Record<string, string> {
  return {
    "--display-face": DISPLAY_VAR[fonts.display],
    "--body-face": BODY_VAR[fonts.body],
  };
}

/**
 * The fifteen values a template repaints.
 *
 * Role names, never colour names. `brand` is wine in Royal Ivory, gold leaf in
 * Jali and peacock green in Muggu; `surface` is cream in most and near-black
 * indigo in three. Naming these `wine` and `ivory` would have made every dark
 * template a lie at every call site.
 */
export interface TemplatePalette {
  /** The page ground, and the recessed band that alternates against it. */
  surface: string;
  "surface-sunk": string;
  /** Body text and its quieter sibling. Both must clear 4.5:1 on both surfaces. */
  ink: string;
  "ink-soft": string;
  /** The ceremonial colour. Carries small text, so it is held to the same bar. */
  brand: string;
  "brand-deep": string;
  /** The metal, for ornament: borders, rules, dividers. Free to be light,
   *  because nothing depends on reading it. */
  gilt: string;
  "gilt-soft": string;
  /**
   * The metal, darkened until it can carry text.
   *
   * These were one role, and that was a mistake: a hairline can be a pale gold
   * and still read, but the same value used for a section label failed 4.5:1 on
   * twelve of seventeen designs. Ornament and copy have different contrast
   * requirements, so they get different values.
   */
  "gilt-ink": string;
  /**
   * Per-ceremony accents. `EventTicket` keys these off the event's icon, so a
   * card's whole palette follows from the ritual it describes. On a dark
   * ground these have to invert to light values or the tickets go unreadable.
   */
  "rite-1": string;
  "rite-2": string;
  "rite-3": string;
  /** Letterbox behind the 16:9 invitation film on a portrait screen. */
  stage: string;
  "stage-deep": string;
  /** Hairline rules, and a surface lifted *above* the page rather than sunk below. */
  rule: string;
  raised: string;
}

/**
 * The facets a couple actually browses by.
 *
 * Separate axes rather than one flat "category", because a couple filters on
 * more than one at once — "traditional, for a multi-day Indian wedding, in
 * green" is a normal thing to want and a single category list cannot express
 * it. Each axis is a closed union so the CMS cannot invent a facet the filter
 * UI has no button for.
 */
export type TemplateStyle =
  | "minimal" | "luxury" | "editorial" | "floral" | "traditional" | "modern" | "romantic" | "royal";
export type TemplateMood =
  | "elegant" | "playful" | "timeless" | "romantic" | "bold" | "contemporary";
export type WeddingType = "indian" | "destination" | "intimate" | "large" | "multi-day";
export type ColorFamily = "ivory" | "black" | "gold" | "green" | "pink" | "blue" | "terracotta";
export type CollectionId =
  | "royal" | "editorial" | "garden" | "minimal" | "destination" | "indian-heritage";

/**
 * The three tiers the catalogue is sold in, quietest first.
 *
 * A different axis from `collection`, and both are kept. A collection says
 * what a design *is* — a point of view, an aesthetic; a tier says how much
 * design is on the page. A couple who wants something plain and a couple who
 * wants Mughal ornament are not choosing between the same three things.
 *
 * Named `DESIGN_TIERS`, not `TIERS`: `@/lib/pricing` already exports a `TIERS`
 * — Silver, Gold, Platinum — and these are not those. Two of the three values
 * collide as well (`royal` is also a collection, `signature` also a colourway
 * id), which is why `royal-tier` is spelt out and why this is always reached
 * through the `tier` field rather than as a bare string.
 */
export type DesignTierId = "signature" | "royal-tier" | "luxe";

export const DESIGN_TIERS: Record<
  DesignTierId,
  { name: string; line: string; order: number; listPrice: number; price: number }
> = {
  signature: {
    name: "Signature",
    order: 1,
    listPrice: 9999,
    price: 4999,
    line: "Light grounds, quiet type, one idea per page. The day does the talking.",
  },
  "royal-tier": {
    name: "Royal",
    order: 2,
    listPrice: 23999,
    price: 11999,
    line: "Deep colour and real metal, drawn from the textiles and thresholds these ceremonies already live in.",
  },
  luxe: {
    name: "Luxe",
    order: 3,
    listPrice: 49999,
    price: 24999,
    line: "The most made of them — dark grounds, cinematic openings, ornament carried edge to edge.",
  },
};

/**
 * Pricing, per tier rather than per design.
 *
 * Nineteen independently editable prices is nineteen chances to contradict the
 * price list. These live in code today; when the operator console can edit
 * them they move to the tenant-independent settings table and these become the
 * seed values — the shape stays the same either way.
 *
 * `listPrice` is what is struck through, `price` is what is charged. The
 * percentage is never stored: it is derived from the two, so a badge cannot
 * claim a discount the numbers do not show.
 */
export function priceOf(t: WeddingTemplate): number {
  return DESIGN_TIERS[t.tier].price;
}

export function listPriceOf(t: WeddingTemplate): number {
  return DESIGN_TIERS[t.tier].listPrice;
}

/** Whole-percent discount, derived. Returns 0 when there is nothing to claim,
 *  so the badge disappears rather than reading "0% off". */
export function discountPct(listPrice: number, price: number): number {
  if (!listPrice || price >= listPrice) return 0;
  return Math.round((1 - price / listPrice) * 100);
}

/** The tiers in ladder order, for anything that lists all three. */
export const DESIGN_TIER_ORDER: DesignTierId[] = ["signature", "royal-tier", "luxe"];

/**
 * Editorial groupings, written the way a catalogue is written rather than the
 * way a database is. A collection is a point of view, not a filter result —
 * which is why each carries its own line of copy.
 */
export const COLLECTIONS: Record<CollectionId, { name: string; line: string }> = {
  royal: { name: "The Royal Collection", line: "Deep colour, real metal, and the weight of a printed card." },
  "indian-heritage": { name: "Indian Heritage", line: "Drawn from the textiles and thresholds these ceremonies already live in." },
  editorial: { name: "The Editorial Collection", line: "Set like a printed programme. Quiet, ruled, read top to bottom." },
  garden: { name: "The Garden Collection", line: "Light grounds and green, for weddings held outdoors." },
  minimal: { name: "The Minimal Collection", line: "Nothing on the page that the day does not need." },
  destination: { name: "The Destination Collection", line: "Built for guests arriving from somewhere else." },
};

/**
 * The sections every template renders today.
 *
 * A single shared list because all twelve run on one archetype. It is stated
 * as data rather than assumed so the marketing site can only ever claim what
 * the templates actually ship — and so a future archetype with a different
 * section list has somewhere to declare it.
 */
export const DEFAULT_SECTIONS = [
  "Hero", "Countdown", "Couple", "Our story", "Events", "Venue",
  "Gallery", "Film", "Family", "RSVP", "Invitation",
] as const;

export interface WeddingTemplate {
  id: string;
  name: string;
  /**
   * Faith and region are separate fields on purpose.
   *
   * "Telugu" is a language, not a religion — a Telugu wedding is a Hindu
   * wedding with Andhra and Telangana rites. Collapsing the two into one
   * "category" works until the first request for Tamil, Punjabi, Bengali or
   * Malayali Christian, at which point the taxonomy has to be rebuilt with
   * live tenants sitting on it.
   */
  tradition: "hindu" | "christian" | "muslim" | "secular";
  region: "north" | "south" | "east" | "west" | "pan-india";
  archetype: ArchetypeId;
  /** One line, written for the couple choosing it — not for the developer. */
  blurb: string;
  style: TemplateStyle;
  collection: CollectionId;
  /** Which of the three tiers this design is sold in. See `DESIGN_TIERS`. */
  tier: DesignTierId;
  /** The single colour a couple would name if asked. Not the whole palette —
   *  a swatch filter with fifteen values is a filter nobody uses. */
  colorFamily: ColorFamily;
  moods: TemplateMood[];
  weddingTypes: WeddingType[];
  /** Surfaced first in the catalogue. Absent means false. */
  featured?: boolean;
  /** Overrides `DEFAULT_SECTIONS` when an archetype ships something different. */
  sections?: readonly string[];
  /**
   * A composed design: which hero, which gallery, which order.
   *
   * When present this wins over `archetype` and the page is assembled by
   * `ComposedInvitation`. Designs still on a hardcoded architecture leave it
   * unset — `scroll` in particular, whose curtain and envelope film cannot be
   * lifted into a slot without being rebuilt.
   */
  recipe?: Recipe;
  fonts: { display: DisplayFont; body: BodyFont };
  palette: TemplatePalette;
}

import { colorwaysOf } from "@/lib/colorways";
import type { Recipe } from "@/lib/recipe";

export const DEFAULT_TEMPLATE_ID = "royal-ivory";

export const TEMPLATES: Record<string, WeddingTemplate> = {
  /* ---------------------------------------------------------------- scroll */
  "royal-ivory": {
    id: "royal-ivory",
    name: "Royal Ivory",
    tradition: "hindu",
    region: "north",
    archetype: "scroll",
    blurb: "Ivory and wine, the way a palace card is printed. Gold used sparingly.",
    style: "luxury",
    collection: "royal",
    tier: "luxe",
    colorFamily: "ivory",
    moods: ["elegant", "timeless"],
    weddingTypes: ["indian", "large", "multi-day"],
    featured: true,
    fonts: { display: "cormorant", body: "inter" },
    palette: {
      surface: "#fbf6ee", "surface-sunk": "#f3ebdd",
      ink: "#2b2520", "ink-soft": "#6b6158",
      brand: "#5c0e1d", "brand-deep": "#3d0812",
      gilt: "#b08d57", "gilt-soft": "#d9c39a",
      "gilt-ink": "#886d43",
      "rite-1": "#82600f", "rite-2": "#40562c", "rite-3": "#4a2545",
      stage: "#cbc4ba", "stage-deep": "#9d9385",
      rule: "#e3d5bd", raised: "#fffdf9",
    },
  },
  "genda-raat": {
    id: "genda-raat",
    name: "Genda Raat",
    tradition: "hindu",
    region: "north",
    archetype: "panel",
    /* The risk in the catalogue: a dark ground for a wedding. It is defensible
       because the sangeet, the baraat and the phere all happen after dark —
       the indigo is the Rajasthani dye vat, and marigold is the light on it. */
    blurb: "Indigo night, marigold light. For a sangeet that runs until morning.",
    style: "royal",
    collection: "royal",
    tier: "royal-tier",
    colorFamily: "blue",
    moods: ["bold", "romantic"],
    weddingTypes: ["indian", "large", "multi-day"],
    fonts: { display: "yeseva", body: "jost" },
    palette: {
      surface: "#16192f", "surface-sunk": "#1e2340",
      ink: "#f2e8d5", "ink-soft": "#b9ae96",
      brand: "#e87a17", "brand-deep": "#c2570a",
      gilt: "#d4af54", "gilt-soft": "#ebd79c",
      "gilt-ink": "#d4af54",
      "rite-1": "#e0a81c", "rite-2": "#8fbc6b", "rite-3": "#e2a0bc",
      stage: "#1e2340", "stage-deep": "#0e1122",
      rule: "#3a4166", raised: "#232849",
    },
  },
  kanjeevaram: {
    id: "kanjeevaram",
    name: "Kanjeevaram",
    tradition: "hindu",
    region: "south",
    archetype: "patrika",
    blurb: "Kumkum red against peacock green, bordered like the silk it is named for.",
    style: "traditional",
    collection: "indian-heritage",
    tier: "royal-tier",
    colorFamily: "terracotta",
    moods: ["timeless", "bold"],
    weddingTypes: ["indian", "large", "multi-day"],
    fonts: { display: "instrument", body: "tenor" },
    recipe: { hero: "typographic", events: "schedule", gallery: "polaroid", nav: "centred", motion: "slow-fade", order: ["countdown","story","events","couple","gallery","venue","film","families","rsvp","closing"] },
    palette: {
      surface: "#fbf8f2", "surface-sunk": "#f2ece0",
      ink: "#241e1b", "ink-soft": "#635a52",
      brand: "#9e1b32", "brand-deep": "#6e0f21",
      gilt: "#b08d3f", "gilt-soft": "#e0cb94",
      "gilt-ink": "#886d30",
      "rite-1": "#8a6407", "rite-2": "#16624f", "rite-3": "#7a2e52",
      stage: "#d6cdbe", "stage-deep": "#a79c88",
      rule: "#e6dac4", raised: "#fffdf8",
    },
  },

  /* --------------------------------------------------------------- program */
  "order-of-service": {
    id: "order-of-service",
    name: "Order of Service",
    tradition: "christian",
    region: "pan-india",
    archetype: "program",
    blurb: "Set like the printed order you are handed in the pew. Cobalt and brass on paper.",
    style: "editorial",
    collection: "editorial",
    tier: "signature",
    colorFamily: "blue",
    moods: ["timeless", "elegant"],
    weddingTypes: ["destination", "intimate"],
    fonts: { display: "marcellus", body: "spectral" },
    recipe: { hero: "monogram", events: "schedule", gallery: "horizontal", nav: "centred", motion: "slow-fade", order: ["countdown","events","story","couple","gallery","venue","film","families","rsvp","closing"] },
    palette: {
      surface: "#fafaf7", "surface-sunk": "#efefe9",
      ink: "#14161a", "ink-soft": "#5a5f66",
      brand: "#1f3a93", "brand-deep": "#142657",
      gilt: "#9c7a3c", "gilt-soft": "#cdb88a",
      "gilt-ink": "#8d6e36",
      "rite-1": "#7a5c18", "rite-2": "#2d6a4f", "rite-3": "#a33b52",
      stage: "#d5d5ce", "stage-deep": "#a3a39b",
      rule: "#deded6", raised: "#ffffff",
    },
  },
  "nikah-nama": {
    id: "nikah-nama",
    name: "Nikah Nama",
    tradition: "muslim",
    region: "pan-india",
    archetype: "card",
    blurb: "The contract as the keepsake. Emerald ink on unbleached paper, no figures.",
    style: "minimal",
    collection: "minimal",
    tier: "signature",
    colorFamily: "green",
    moods: ["timeless", "elegant"],
    weddingTypes: ["indian", "intimate"],
    fonts: { display: "cinzel", body: "tenor" },
    palette: {
      surface: "#f7f4ec", "surface-sunk": "#ede7d9",
      ink: "#1b1a16", "ink-soft": "#5e5850",
      brand: "#0e5e4a", "brand-deep": "#073b2e",
      gilt: "#a8873e", "gilt-soft": "#dcc894",
      "gilt-ink": "#826930",
      "rite-1": "#7a6212", "rite-2": "#2c6152", "rite-3": "#6b3a5c",
      stage: "#cfc8b6", "stage-deep": "#9c9482",
      rule: "#ded4bc", raised: "#fffdf6",
    },
  },
  patrika: {
    id: "patrika",
    name: "Patrika",
    tradition: "hindu",
    region: "north",
    archetype: "patrika",
    blurb: "The folded red-and-gold card, read top to bottom in the order the days fall.",
    style: "traditional",
    collection: "indian-heritage",
    tier: "royal-tier",
    colorFamily: "terracotta",
    moods: ["bold", "romantic"],
    weddingTypes: ["indian", "large"],
    fonts: { display: "gilda", body: "inter" },
    recipe: { hero: "split", events: "timeline", gallery: "polaroid", nav: "monogram", motion: "spring", order: ["events","countdown","couple","story","gallery","venue","film","families","rsvp","closing"] },
    palette: {
      surface: "#fff6f0", "surface-sunk": "#fbe7dc",
      ink: "#2a1a16", "ink-soft": "#6b544c",
      brand: "#b3141e", "brand-deep": "#7a0a12",
      gilt: "#996f08", "gilt-soft": "#e8ce86",
      "gilt-ink": "#916908",
      "rite-1": "#8a6207", "rite-2": "#4a6030", "rite-3": "#8c2050",
      stage: "#e0cbbe", "stage-deep": "#b09a8c",
      rule: "#f0d5c4", raised: "#fffbf8",
    },
  },

  /* ---------------------------------------------------------------- screen */
  jali: {
    id: "jali",
    name: "Jali",
    tradition: "muslim",
    region: "pan-india",
    archetype: "screen",
    /* The one template with a *functional* requirement rather than only a
       visual one: it has to be beautiful with no photograph of the couple,
       because many families prefer not to publish the bride's face. The
       calligraphic name treatment carries the hero instead. */
    blurb: "Eight-fold lattice, emerald and gold leaf. Built to be beautiful without photographs.",
    style: "luxury",
    collection: "royal",
    tier: "luxe",
    colorFamily: "green",
    moods: ["elegant", "bold"],
    weddingTypes: ["indian", "large", "multi-day"],
    featured: true,
    fonts: { display: "gilda", body: "jost" },
    recipe: { hero: "monogram", events: "timeline", gallery: "masonry", nav: "monogram", motion: "mask-reveal", order: ["countdown","events","couple","story","gallery","venue","film","families","rsvp","closing"] },
    palette: {
      surface: "#0e3b2e", "surface-sunk": "#0a2c22",
      ink: "#f1eada", "ink-soft": "#a9b8ac",
      brand: "#c6a15b", "brand-deep": "#a2803f",
      gilt: "#e0c88a", "gilt-soft": "#f0e2be",
      "gilt-ink": "#e0c88a",
      "rite-1": "#d7b85c", "rite-2": "#7fb89a", "rite-3": "#c99bb0",
      stage: "#0a2c22", "stage-deep": "#05170f",
      rule: "#1f5443", raised: "#14493a",
    },
  },
  muggu: {
    id: "muggu",
    name: "Muggu",
    tradition: "hindu",
    region: "south",
    archetype: "card",
    blurb: "The dot grid drawn at the threshold each morning, resolving into line as you read.",
    style: "minimal",
    collection: "garden",
    tier: "signature",
    colorFamily: "green",
    moods: ["contemporary", "playful"],
    weddingTypes: ["indian", "intimate"],
    fonts: { display: "playfair", body: "jost" },
    palette: {
      surface: "#fcfbf7", "surface-sunk": "#f1ede2",
      ink: "#1c1e1c", "ink-soft": "#575d57",
      brand: "#16624f", "brand-deep": "#0d4234",
      gilt: "#a8842c", "gilt-soft": "#e8d5a0",
      "gilt-ink": "#896b24",
      "rite-1": "#8a6407", "rite-2": "#9e1b32", "rite-3": "#6a4a8c",
      stage: "#dad3c5", "stage-deep": "#a8a091",
      rule: "#e7dfcc", raised: "#fffffc",
    },
  },
  jharokha: {
    id: "jharokha",
    name: "Jharokha",
    tradition: "hindu",
    region: "west",
    archetype: "screen",
    blurb: "Framed in sandstone arches, the way a Jaisalmer balcony frames the street below.",
    style: "royal",
    collection: "royal",
    tier: "royal-tier",
    colorFamily: "terracotta",
    moods: ["timeless", "bold"],
    weddingTypes: ["indian", "destination"],
    fonts: { display: "cormorant", body: "tenor" },
    recipe: { hero: "split", events: "schedule", gallery: "polaroid", nav: "centred", motion: "slow-fade", order: ["countdown","couple","events","story","venue","gallery","film","families","rsvp","closing"] },
    palette: {
      surface: "#f6efe3", "surface-sunk": "#ebdfcb",
      ink: "#2b231a", "ink-soft": "#6a5c4a",
      brand: "#a33b1f", "brand-deep": "#6e2412",
      gilt: "#a67c3d", "gilt-soft": "#dfc79a",
      "gilt-ink": "#886531",
      "rite-1": "#6f5210", "rite-2": "#4e6238", "rite-3": "#7c3a54",
      stage: "#d9cbb4", "stage-deep": "#a89478",
      rule: "#dfceb2", raised: "#fffbf3",
    },
  },

  /* ----------------------------------------------------------------- album */
  sepia: {
    id: "sepia",
    name: "Sepia",
    tradition: "christian",
    region: "south",
    archetype: "album",
    blurb: "Warm monochrome, photographs given the whole page and the words kept small.",
    style: "editorial",
    collection: "editorial",
    tier: "signature",
    colorFamily: "ivory",
    moods: ["timeless", "romantic"],
    weddingTypes: ["intimate", "destination"],
    fonts: { display: "playfair", body: "spectral" },
    recipe: { hero: "typographic", events: "schedule", gallery: "masonry", nav: "centred", motion: "slow-fade", order: ["countdown","story","couple","gallery","events","venue","film","families","rsvp","closing"] },
    palette: {
      surface: "#f4f0ea", "surface-sunk": "#e7e1d8",
      ink: "#241e18", "ink-soft": "#6b6055",
      brand: "#6b4a2f", "brand-deep": "#432c1a",
      gilt: "#8f7245", "gilt-soft": "#cbb48d",
      "gilt-ink": "#81673f",
      "rite-1": "#7a5c1e", "rite-2": "#4f5b3e", "rite-3": "#6e4152",
      stage: "#d4cbbe", "stage-deep": "#a2978a",
      rule: "#dcd2c4", raised: "#fcfaf6",
    },
  },
  malabar: {
    id: "malabar",
    name: "Malabar",
    tradition: "christian",
    region: "south",
    archetype: "album",
    blurb: "Backwater green and brass, for a wedding held where the water meets the palms.",
    style: "floral",
    collection: "garden",
    tier: "signature",
    colorFamily: "green",
    moods: ["romantic", "elegant"],
    weddingTypes: ["destination", "intimate"],
    featured: true,
    fonts: { display: "fraunces", body: "spectral" },
    recipe: { hero: "split", events: "cards", gallery: "horizontal", nav: "overlay", motion: "parallax", order: ["countdown","events","gallery","story","couple","venue","film","families","rsvp","closing"] },
    palette: {
      surface: "#f3f6f0", "surface-sunk": "#e4ebe0",
      ink: "#1a211c", "ink-soft": "#556056",
      brand: "#1b4d3e", "brand-deep": "#0f3227",
      gilt: "#8f7133", "gilt-soft": "#d8c393",
      "gilt-ink": "#886b30",
      "rite-1": "#7e6414", "rite-2": "#2f6b4f", "rite-3": "#74405e",
      stage: "#cbd4c6", "stage-deep": "#97a392",
      rule: "#d3dcce", raised: "#fbfdfa",
    },
  },
  banarasi: {
    id: "banarasi",
    name: "Banarasi",
    tradition: "hindu",
    region: "east",
    archetype: "scroll",
    blurb: "Brocade plum and antique gold, woven the way the silk it is named for is woven.",
    style: "luxury",
    collection: "royal",
    tier: "luxe",
    colorFamily: "gold",
    moods: ["bold", "romantic"],
    weddingTypes: ["indian", "large", "multi-day"],
    fonts: { display: "bodoni", body: "jost" },
    palette: {
      surface: "#2a1230", "surface-sunk": "#1e0b24",
      ink: "#f0e4e8", "ink-soft": "#b7a2bc",
      brand: "#d9a441", "brand-deep": "#b07f2a",
      gilt: "#e8c878", "gilt-soft": "#f3e3b6",
      "gilt-ink": "#e8c878",
      "rite-1": "#dfae3c", "rite-2": "#8fb88f", "rite-3": "#e09bb4",
      stage: "#1e0b24", "stage-deep": "#120616",
      rule: "#47264f", raised: "#3a1b42",
    },
  },

  /* ------------------------------------------------- five house themes ---
     Each takes an existing architecture and gives it a different palette,
     type pairing and card treatment. The architecture supplies the layout;
     these supply the identity. */
  "royal-celebration": {
    id: "royal-celebration",
    name: "Royal Celebration",
    tradition: "hindu",
    region: "north",
    archetype: "scroll",
    blurb: "Crimson and leaf gold, bordered heavily, the way a palace card is printed.",
    style: "royal",
    collection: "royal",
    tier: "royal-tier",
    colorFamily: "terracotta",
    moods: ["bold", "timeless"],
    weddingTypes: ["indian", "large", "multi-day"],
    featured: true,
    fonts: { display: "cinzel", body: "spectral" },
    palette: {
      surface: "#fdf7f0", "surface-sunk": "#f6e9dc",
      ink: "#2a1512", "ink-soft": "#6b4c42",
      brand: "#9b1b30", "brand-deep": "#6b0f20",
      gilt: "#9a6f09", "gilt-soft": "#e6ce8f",
      "gilt-ink": "#926909",
      "rite-1": "#8a5a0a", "rite-2": "#42542a", "rite-3": "#7b2a45",
      stage: "#e2cdbb", "stage-deep": "#b39887",
      rule: "#efd9c2", raised: "#fffdfa",
    },
  },
  "atelier-noir": {
    id: "atelier-noir",
    name: "Atelier Noir",
    tradition: "secular",
    region: "pan-india",
    archetype: "album",
    blurb: "Near-black and bone. Hairline rules, no ornament, nothing that is not the photograph.",
    style: "minimal",
    collection: "editorial",
    tier: "luxe",
    colorFamily: "black",
    moods: ["contemporary", "bold"],
    weddingTypes: ["intimate", "destination"],
    fonts: { display: "bodoni", body: "tenor" },
    recipe: { hero: "typographic", events: "timeline", gallery: "horizontal", nav: "monogram", motion: "mask-reveal", order: ["gallery","countdown","events","story","couple","venue","film","families","rsvp","closing"] },
    palette: {
      surface: "#121212", "surface-sunk": "#1a1a1a",
      ink: "#efebe3", "ink-soft": "#a8a298",
      brand: "#efebe3", "brand-deep": "#c9c3b8",
      gilt: "#968d80", "gilt-soft": "#bab2a5",
      "gilt-ink": "#968d80",
      "rite-1": "#c9b98f", "rite-2": "#9bae9b", "rite-3": "#c79ba5",
      stage: "#1a1a1a", "stage-deep": "#0a0a0a",
      rule: "#2c2c2c", raised: "#1e1e1e",
    },
  },
  "midnight-velvet": {
    id: "midnight-velvet",
    name: "Midnight Velvet",
    tradition: "secular",
    region: "pan-india",
    archetype: "screen",
    blurb: "Plum velvet and gold, lit low. For a wedding that begins after dark.",
    style: "luxury",
    collection: "royal",
    tier: "luxe",
    colorFamily: "blue",
    moods: ["romantic", "elegant"],
    weddingTypes: ["large", "multi-day"],
    featured: true,
    fonts: { display: "gilda", body: "spectral" },
    recipe: { hero: "monogram", events: "cards", gallery: "masonry", nav: "overlay", motion: "parallax", order: ["countdown","events","gallery","couple","story","venue","film","families","rsvp","closing"] },
    palette: {
      surface: "#15101f", "surface-sunk": "#1b1326",
      ink: "#ede6f2", "ink-soft": "#a99bb3",
      brand: "#c8a24b", "brand-deep": "#a8853a",
      gilt: "#c8a24b", "gilt-soft": "#e6d3a0", "gilt-ink": "#d8b76a",
      "rite-1": "#d8b76a", "rite-2": "#a3b3a0", "rite-3": "#c08bab",
      stage: "#1b1326", "stage-deep": "#0c0812",
      rule: "#2e2340", raised: "#241a33",
    },
  },
  "ivory-atelier": {
    id: "ivory-atelier",
    name: "Ivory Atelier",
    tradition: "christian",
    region: "pan-india",
    archetype: "program",
    blurb: "Bone on bone. The only ornament is the edge of the paper.",
    style: "minimal",
    collection: "minimal",
    tier: "signature",
    colorFamily: "ivory",
    moods: ["timeless", "elegant"],
    weddingTypes: ["intimate", "destination"],
    fonts: { display: "marcellus", body: "inter" },
    recipe: { hero: "split", events: "timeline", gallery: "masonry", nav: "overlay", motion: "mask-reveal", order: ["countdown","couple","events","gallery","story","venue","film","families","rsvp","closing"] },
    palette: {
      surface: "#f8f5ef", "surface-sunk": "#efeae1",
      ink: "#23201b", "ink-soft": "#665f55",
      brand: "#4a443a", "brand-deep": "#2f2a23",
      gilt: "#948871", "gilt-soft": "#d3cbb9",
      "gilt-ink": "#796f5c",
      "rite-1": "#6f6039", "rite-2": "#4d5741", "rite-3": "#654d57",
      stage: "#ded8cc", "stage-deep": "#ada697",
      rule: "#e3dcce", raised: "#ffffff",
    },
  },
  "saffron-house": {
    id: "saffron-house",
    name: "Saffron House",
    tradition: "hindu",
    region: "west",
    archetype: "patrika",
    blurb: "Turmeric and ink, block-printed, unrolling like the card it is named for.",
    style: "traditional",
    collection: "indian-heritage",
    tier: "royal-tier",
    colorFamily: "gold",
    moods: ["bold", "playful"],
    weddingTypes: ["indian", "multi-day"],
    fonts: { display: "yeseva", body: "spectral" },
    recipe: { hero: "split", events: "cards", gallery: "masonry", nav: "centred", motion: "spring", order: ["countdown","events","story","gallery","couple","venue","film","families","rsvp","closing"] },
    palette: {
      surface: "#fffaf0", "surface-sunk": "#fbefd8",
      ink: "#241e14", "ink-soft": "#665941",
      brand: "#a55c0a", "brand-deep": "#7e4708",
      gilt: "#9a7b36", "gilt-soft": "#e0c88a",
      "gilt-ink": "#8b6f30",
      "rite-1": "#7f5a06", "rite-2": "#4c5f2a", "rite-3": "#8a3a2a",
      stage: "#e8d5b4", "stage-deep": "#b9a484",
      rule: "#f2dfc0", raised: "#fffdf7",
    },
  },

  "cinematic-reel": {
    id: "cinematic-reel",
    name: "Cinematic Reel",
    tradition: "secular",
    region: "pan-india",
    archetype: "album",
    blurb: "Near-black and clay, graded like a film still. The photographs carry it.",
    style: "editorial",
    collection: "editorial",
    tier: "luxe",
    colorFamily: "black",
    moods: ["contemporary", "bold"],
    weddingTypes: ["destination", "intimate"],
    featured: true,
    fonts: { display: "instrument", body: "jost" },
    recipe: { hero: "monogram", events: "cards", gallery: "horizontal", nav: "overlay", motion: "parallax", order: ["gallery","events","countdown","story","couple","venue","film","families","rsvp","closing"] },
    palette: {
      surface: "#1a1a1a", "surface-sunk": "#2c2c2c",
      ink: "#fafaf8", "ink-soft": "#a8a49e",
      brand: "#c4856a", "brand-deep": "#a56b52",
      gilt: "#d9a441", "gilt-soft": "#ebc97f", "gilt-ink": "#d9a441",
      "rite-1": "#d9a441", "rite-2": "#a3b8a3", "rite-3": "#d4788c",
      stage: "#2c2c2c", "stage-deep": "#0f0f0f",
      rule: "#343434", raised: "#242424",
    },
  },
  "earthy-haven": {
    id: "earthy-haven",
    name: "Earthy Haven",
    tradition: "secular",
    region: "south",
    archetype: "scroll",
    blurb: "Warm browns and undyed linen, for a wedding held outdoors and in daylight.",
    style: "floral",
    collection: "garden",
    tier: "signature",
    colorFamily: "terracotta",
    moods: ["timeless", "romantic"],
    weddingTypes: ["destination", "intimate", "multi-day"],
    fonts: { display: "fraunces", body: "tenor" },
    palette: {
      surface: "#f5f1e8", "surface-sunk": "#ede8db",
      ink: "#3d2b1f", "ink-soft": "#6b5648",
      brand: "#5c4433", "brand-deep": "#3d2b1f",
      gilt: "#c4a882", "gilt-soft": "#ded0b8", "gilt-ink": "#7f6744",
      "rite-1": "#856327", "rite-2": "#55613f", "rite-3": "#8a5548",
      stage: "#ded5c4", "stage-deep": "#a89680",
      rule: "#ded5c4", raised: "#ffffff",
    },
  },

};

/**
 * Resolves a design, optionally repainted in one of its colourways.
 *
 * Falls back at both levels rather than throwing: an unknown design id shows
 * the default design, and an unknown colourway shows that design's own
 * palette. A row edited by hand in the database should never take a paid-for
 * site off the web.
 *
 * The returned shape is a plain `WeddingTemplate` with `palette` already
 * swapped, so every consumer — the theme wrapper, the posters, the carousel —
 * keeps working without knowing colourways exist.
 */
export function getTemplate(
  id: string | null | undefined,
  colorwayId?: string | null
): WeddingTemplate {
  const base = (id && TEMPLATES[id]) || TEMPLATES[DEFAULT_TEMPLATE_ID];
  if (!colorwayId) return base;
  const way = colorwaysOf(base.id).find((c) => c.id === colorwayId);
  return way ? { ...base, palette: way.palette } : base;
}

export function listTemplates(): WeddingTemplate[] {
  return Object.values(TEMPLATES);
}

/** What a template actually renders — never a wish list. */
export function sectionsOf(t: WeddingTemplate): readonly string[] {
  return t.sections ?? DEFAULT_SECTIONS;
}

export interface TemplateFilter {
  style?: TemplateStyle;
  mood?: TemplateMood;
  weddingType?: WeddingType;
  color?: ColorFamily;
  collection?: CollectionId;
}

/**
 * Narrowing, not searching. Every clause is an AND, and an absent clause means
 * "don't care" — so an empty filter returns the whole catalogue rather than
 * nothing, which is the behaviour a browsing couple expects.
 */
export function filterTemplates(all: WeddingTemplate[], f: TemplateFilter): WeddingTemplate[] {
  return all.filter((t) =>
    (!f.style || t.style === f.style) &&
    (!f.mood || t.moods.includes(f.mood)) &&
    (!f.weddingType || t.weddingTypes.includes(f.weddingType)) &&
    (!f.color || t.colorFamily === f.color) &&
    (!f.collection || t.collection === f.collection)
  );
}

/** The palette as inline custom properties, for the element that scopes a
 *  template. Every colour utility in the tree resolves through these. */
/**
 * The lighter of a palette's two type colours.
 *
 * `TemplatePoster` lays type over a `brand-deep` scrim, which is dark in every
 * palette — so the type has to be the palette's *pale* colour. It used to take
 * `surface` and assume that was pale, which is only true of the light-ground
 * designs. On the 25 dark-ground colourways it inverted: Banarasi Signature
 * put near-black #2a1230 names over a gold scrim, and every Midnight colourway
 * did the same, with the upper half of the card showing the photograph through
 * a 28% scrim behind dark text.
 *
 * Reading it off relative luminance rather than off a flag means a new palette
 * cannot get this wrong by forgetting to declare which kind it is.
 */
function relativeLuminance(hex: string): number {
  const h = hex.replace("#", "");
  const channel = (i: number) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4);
}

export function posterInk(t: WeddingTemplate): string {
  const { surface, ink } = t.palette;
  return relativeLuminance(surface) >= relativeLuminance(ink) ? surface : ink;
}

/**
 * A metal that can carry the poster's `&`, or the type colour if none can.
 *
 * `gilt` is documented as ornament — free to be light, because nothing depends
 * on reading it — and `gilt-ink` is its darkened sibling for text. Neither is
 * right here: `gilt-ink` is tuned against the template's own *surface*, so on a
 * light-ground design it is a mid-dark gold that vanishes on this dark scrim
 * (32 of 57 colourways below 4.5:1), and `gilt` fails the same 32.
 *
 * So: try the palest metal first, then the plain one, and fall back to the
 * type colour when a palette simply has no metal that reads on its own darkest
 * ground. Six colourways take the fallback and lose the gold `&`; all 57 keep
 * a legible one. The hairlines either side stay `gilt` — those are ornament,
 * and nothing depends on reading them.
 */
export function posterMetal(t: WeddingTemplate): string {
  const scrim = posterScrim(t);
  const ink = posterInk(t);
  const contrast = (a: string, b: string) => {
    const [la, lb] = [relativeLuminance(a), relativeLuminance(b)];
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  };
  return (
    [t.palette["gilt-soft"], t.palette.gilt].find((c) => contrast(c, scrim) >= 4.5) ?? ink
  );
}

/**
 * The darkest ground a palette owns, for the poster's scrim.
 *
 * The scrim was hardcoded to `brand-deep` on the assumption that a "deep"
 * brand is dark. It is not: on the `midnight` colourways the metal and the
 * ceremonial colour trade places — a deep wine disappears against a night
 * ground — so `brand-deep` comes back a pale gold. Royal Ivory Midnight has it
 * at relative luminance 0.56, Genda Raat Midnight at 0.69. Scrimming a
 * photograph in those and then setting pale type on top is two pale layers,
 * and 19 of the 57 colourways were doing it.
 *
 * Taking the darkest of the four grounds the palette already defines keeps the
 * card in the template's own colours — no value is invented here — while
 * guaranteeing the type has something to sit on. Paired with `posterInk`, the
 * worst of all 57 colourways measures 4.55:1.
 */
export function posterScrim(t: WeddingTemplate): string {
  const grounds = [
    t.palette["brand-deep"],
    t.palette["stage-deep"],
    t.palette["surface-sunk"],
    t.palette.surface,
  ];
  return grounds.reduce((a, b) => (relativeLuminance(b) < relativeLuminance(a) ? b : a));
}

export function paletteVars(t: WeddingTemplate): Record<string, string> {
  return Object.fromEntries(
    Object.entries(t.palette).map(([role, value]) => [`--${role}`, value])
  );
}
