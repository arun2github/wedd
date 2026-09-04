/**
 * What we charge, and why.
 *
 * Anchored against researched competitor pricing: the Indian commodity floor
 * is ~₹900 and a race to the bottom, self-serve runs ₹999–₹9,999, and agency
 * bespoke starts near ₹40,000. These three sit deliberately above the
 * self-serve shops — the product is materially more — and well below the
 * agency band they substitute for.
 *
 * One-time, never subscription. Every successful Indian comparable charges
 * once; the only INR subscription found in the market is a foreign product
 * applying a foreign model to a country that does not buy that way.
 */

export interface Tier {
  id: "silver" | "gold" | "platinum";
  name: string;
  price: number;
  /** The single reason to choose this one over the one below it. */
  pitch: string;
  features: string[];
  highlight?: boolean;
}

export const TIERS: Tier[] = [
  {
    id: "silver",
    name: "Silver",
    price: 4999,
    pitch: "Everything a guest needs, on your own address.",
    features: [
      "Any design in the collection",
      "All twelve sections, unlimited ceremonies",
      "RSVP up to 200 responses, exportable",
      "2 GB for photos and video",
      "Live for 12 months",
      "Small “Made with” credit in the footer",
    ],
  },
  {
    id: "gold",
    name: "Gold",
    price: 11999,
    /* Gold's real job is selling the removal of the Silver footer credit —
       which is also why that credit exists. Average guest list is 330, so a
       published Silver site introduces the brand to 330 engaged-adjacent
       people over WhatsApp at no cost. */
    pitch: "No credit in the footer, and the guest photo wall.",
    features: [
      "Everything in Silver",
      "Footer credit removed",
      "Unlimited RSVP responses",
      "Guest photo wall — guests upload from a QR code",
      "Video section and RSVP breakdown",
      "10 GB for photos and video",
      "Live for 18 months",
    ],
    highlight: true,
  },
  {
    id: "platinum",
    name: "Platinum",
    price: 24999,
    pitch: "Your own domain, and we set the whole thing up with you.",
    features: [
      "Everything in Gold",
      "Your own domain for a year",
      "Password-protected pages for close family",
      "Two languages",
      "A setup call — we build it with you on the phone",
      "25 GB for photos and video",
      "Live for 24 months",
    ],
  },
];

export const ADD_ONS = [
  { name: "Your own domain", price: 1499, note: "One year, registered and pointed for you." },
  { name: "Guest photo wall", price: 2999, note: "Guests scan a QR at the venue and their photos appear on your site." },
  { name: "Another 12 months online", price: 999, note: "Added any time, including after the wedding." },
  { name: "WhatsApp invite video", price: 2999, note: "A short film built from your site, sized for sharing." },
];

/** ₹4,999 — Indian digit grouping, no decimals. */
export function inr(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0,
  }).format(amount);
}
