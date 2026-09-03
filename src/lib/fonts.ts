import {
  Cormorant_Garamond, Great_Vibes, Inter, Marcellus, Fraunces, Yeseva_One,
  Jost, Spectral, Instrument_Serif, Italianno,
  Playfair_Display, Bodoni_Moda, Cinzel, Gilda_Display, Tenor_Sans,
} from "next/font/google";

/**
 * The face library the catalogue draws on.
 *
 * All eight are declared here so their CSS variables exist on every page, but
 * only two are preloaded. A font file is fetched when text actually uses the
 * family, so declaring a face a given template never reaches costs a variable
 * and no bytes — while preloading all eight would put six unused woff2 files
 * in the critical path of every wedding site.
 *
 * `next/font` resolves at module scope, which is why the library is fixed
 * rather than free text: a face a tenant types into a box cannot be loaded.
 * Eight across twelve templates is enough that no two share a voice.
 */

/*
  Each call is written out in full rather than spread from a shared options
  object: `next/font` is a compiler plugin, and it can only read arguments that
  are literals at the call site. A spread fails the build.

  Only the two faces the default template uses are preloaded. The rest declare
  a variable but stay out of the critical path — their files are fetched only
  when rendered text actually asks for the family.
*/
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant", subsets: ["latin"], display: "swap",
  weight: ["400", "500", "600", "700"], preload: true,
});
const inter = Inter({
  variable: "--font-inter", subsets: ["latin"], display: "swap",
  weight: ["300", "400", "500", "600"], preload: true,
});
const greatVibes = Great_Vibes({
  variable: "--font-great-vibes", subsets: ["latin"], display: "swap",
  weight: "400", preload: false,
});

/** Inscriptional Roman capitals — carved rather than written. Order of Service, Nikah Nama, Jali. */
const marcellus = Marcellus({
  variable: "--font-marcellus", subsets: ["latin"], display: "swap",
  weight: "400", preload: false,
});
/** Soft serif with optical sizing; warm and slightly irregular. The South Indian skins. */
const fraunces = Fraunces({
  variable: "--font-fraunces", subsets: ["latin"], display: "swap", preload: false,
});
/** High-contrast display with heavy vertical stress. The loud skins: Genda Raat, Patrika, Banarasi. */
const yeseva = Yeseva_One({
  variable: "--font-yeseva", subsets: ["latin"], display: "swap",
  weight: "400", preload: false,
});
/** Geometric sans. Reads as modern next to an ornate display face. */
const jost = Jost({
  variable: "--font-jost", subsets: ["latin"], display: "swap", preload: false,
});
/**
 * The platform's own voice — deliberately a face no template uses.
 *
 * A marketplace set in one of its products' faces looks like that product,
 * which quietly tells a visitor the other eleven are alternatives to the
 * house style rather than twelve equals. High contrast and a tight fit, so it
 * reads as a catalogue masthead rather than as an invitation.
 */
const instrument = Instrument_Serif({
  variable: "--font-instrument", subsets: ["latin"], display: "swap",
  /* Italic as well as roman: the italic is the platform's cinematic voice.
     It is high-contrast and flowing — cursive in feel — without being a
     script, which at headline size is the most dated thing in wedding
     design rather than the most luxurious. */
  weight: "400", style: ["normal", "italic"], preload: false,
});

/**
 * True script, rationed.
 *
 * Used for the wordmark and for single accent words only. A page set in script
 * reads as a wedding invitation from fifteen years ago; one word of it reads as
 * a signature on something expensive. The difference is entirely dosage.
 */
const italianno = Italianno({
  variable: "--font-italianno", subsets: ["latin"], display: "swap",
  weight: "400", preload: false,
});

/* Five more voices, so twenty designs can each sound like themselves rather
   than four faces recycled. Each is a different *kind* of serif, not five
   variations on one: a transitional, a didone, inscriptional capitals, an
   Art-Nouveau display and a refined humanist sans. */
const playfair = Playfair_Display({
  variable: "--font-playfair", subsets: ["latin"], display: "swap", preload: false,
});
const bodoni = Bodoni_Moda({
  variable: "--font-bodoni", subsets: ["latin"], display: "swap", preload: false,
});
const cinzel = Cinzel({
  variable: "--font-cinzel", subsets: ["latin"], display: "swap", preload: false,
});
const gilda = Gilda_Display({
  variable: "--font-gilda", subsets: ["latin"], display: "swap",
  weight: "400", preload: false,
});
const tenor = Tenor_Sans({
  variable: "--font-tenor", subsets: ["latin"], display: "swap",
  weight: "400", preload: false,
});

/** Serif built for long body text on screen. The document and album archetypes. */
const spectral = Spectral({
  variable: "--font-spectral", subsets: ["latin"], display: "swap",
  weight: ["300", "400", "500", "600"], preload: false,
});

/** Every face's variable, applied once on `<html>`. */
export const fontVariables = [
  cormorant, inter, greatVibes, marcellus, fraunces, yeseva, jost, spectral,
  instrument, italianno, playfair, bodoni, cinzel, gilda, tenor,
].map((f) => f.variable).join(" ");
