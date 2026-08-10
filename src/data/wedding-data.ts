import type { WeddingData } from "@/types/wedding";

/**
 * Single source of truth for this wedding invitation.
 * Every section reads its slice from here via props — swap this file
 * (or fetch it per-tenant) to reuse the entire template for a new couple.
 */

function unsplash(id: string, w: number) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
}

export const weddingData: WeddingData = {
  couple: {
    brideName: "Aman",
    groomName: "Priya",
    brideIntro:
      "A dreamer with a warm heart, Aman finds joy in quiet mornings, old films, and building a home filled with love and laughter.",
    groomIntro:
      "Steady and kind, Priya believes the best stories are the ones written together — one adventure, one cup of chai at a time.",
    bridePhoto: unsplash("1519741497674-611481863552", 900),
    groomPhoto: unsplash("1493863641943-9b68992a8d07", 900),
    heroPhoto: unsplash("1606216794074-735e91aa2c92", 1920),
  },
  weddingDate: "2027-02-14T19:00:00+05:30",
  invitationMessage:
    "Together with our families, we joyfully invite you to celebrate the beginning of our forever.",
  story: [
    {
      date: "August 2021",
      title: "First Meeting",
      description:
        "A chance introduction at a mutual friend's gathering turned into a conversation that lasted till midnight.",
      image: unsplash("1522673607200-164d1b6ce486", 900),
    },
    {
      date: "March 2022",
      title: "First Date",
      description:
        "Coffee turned into a long walk through the old city — and we both knew we'd found something rare.",
      image: unsplash("1544078751-58fee2d8a03b", 900),
    },
    {
      date: "December 2023",
      title: "Engagement",
      description:
        "Surrounded by family and fairy lights, we promised each other forever with rings and happy tears.",
      image: unsplash("1517457373958-b7bdd4587205", 900),
    },
    {
      date: "June 2026",
      title: "The Proposal",
      description:
        "On a quiet evening by the water, under a sky full of stars, the question was finally asked.",
      image: unsplash("1522413452208-996ff3f3e740", 900),
    },
    {
      date: "February 2027",
      title: "Wedding Day",
      description:
        "The day our two families become one, and our forever officially begins.",
      image: unsplash("1583939003579-730e3918a45a", 900),
    },
  ],
  events: [
    {
      name: "Haldi Ceremony",
      date: "2027-02-10",
      time: "11:00 AM",
      venue: "Sharma Residence, Garden Courtyard",
      description:
        "A joyful morning of turmeric, laughter, and blessings as we prepare for the days ahead.",
      icon: "sparkles",
      mapUrl: "https://maps.google.com/?q=Sharma+Residence",
    },
    {
      name: "Mehendi Night",
      date: "2027-02-11",
      time: "5:00 PM",
      venue: "The Ivory Lawns, Banquet Hall",
      description:
        "An evening of intricate henna art, music, and dancing to welcome the celebrations.",
      icon: "flower",
      mapUrl: "https://maps.google.com/?q=The+Ivory+Lawns",
    },
    {
      name: "Wedding Ceremony",
      date: "2027-02-14",
      time: "7:00 PM",
      venue: "Rosewood Estate, Main Pavilion",
      description:
        "The sacred rites uniting Arun and Priya, followed by an evening of celebration.",
      icon: "flame",
      mapUrl: "https://maps.google.com/?q=Rosewood+Estate",
    },
    {
      name: "Reception",
      date: "2027-02-15",
      time: "7:00 PM",
      venue: "Rosewood Estate, Grand Ballroom",
      description:
        "Dinner, dancing, and toasts as we celebrate the newest chapter of our story with you.",
      icon: "heart",
      mapUrl: "https://maps.google.com/?q=Rosewood+Estate",
    },
  ],
  venue: {
    name: "Rosewood Estate",
    address: "14 Lakeview Road, Udaipur, Rajasthan 313001",
    image: unsplash("1519225421980-715cb0215aed", 1600),
    directionsUrl: "https://maps.google.com/?q=Rosewood+Estate+Udaipur",
  },
  gallery: [
    { src: unsplash("1600096194534-95cf5ece04cf", 900), category: "pre-wedding", alt: "Arun and Priya walking together at golden hour", aspect: "portrait" },
    { src: unsplash("1595407753234-0882f1e77954", 900), category: "pre-wedding", alt: "Candid pre-wedding portrait of the couple", aspect: "landscape" },
    { src: unsplash("1583417319070-4a69db38a482", 900), category: "pre-wedding", alt: "Pre-wedding shoot by the lake", aspect: "square" },
    { src: unsplash("1526047932273-341f2a7631f9", 900), category: "engagement", alt: "Engagement ring close-up", aspect: "square" },
    { src: unsplash("1519671482749-fd09be7ccebf", 900), category: "engagement", alt: "The couple celebrating their engagement", aspect: "portrait" },
    { src: unsplash("1503104834685-7205e8607eb9", 900), category: "engagement", alt: "Engagement ceremony decor", aspect: "landscape" },
    { src: unsplash("1523438885200-e635ba2c371e", 900), category: "haldi", alt: "Haldi ceremony turmeric ritual", aspect: "square" },
    { src: unsplash("1465146633011-14f8e0781093", 900), category: "haldi", alt: "Family gathered for the haldi celebration", aspect: "landscape" },
    { src: unsplash("1524704796725-9fc3044a58b2", 900), category: "haldi", alt: "Marigold flowers used in the haldi ceremony", aspect: "portrait" },
    { src: unsplash("1418065460487-3e41a6c84dc5", 900), category: "mehendi", alt: "Intricate mehendi henna design", aspect: "square" },
    { src: unsplash("1550258987-190a2d41a8ba", 900), category: "mehendi", alt: "Mehendi night celebrations", aspect: "landscape" },
    { src: unsplash("1414235077428-338989a2e8c0", 900), category: "mehendi", alt: "Bangles and henna detail shot", aspect: "portrait" },
    { src: unsplash("1497633762265-9d179a990aa6", 900), category: "wedding", alt: "Wedding ceremony rituals", aspect: "landscape" },
    { src: unsplash("1465495976277-4387d4b0b4c6", 900), category: "wedding", alt: "Bride on her wedding day", aspect: "portrait" },
    { src: unsplash("1606800052052-a08af7148866", 900), category: "wedding", alt: "Newlyweds sharing a joyful moment", aspect: "square" },
  ],
  video: {
    thumbnail: unsplash("1611930022073-b7a4ba5fcccd", 1600),
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    title: "Our Journey Together",
    description:
      "A short film capturing the moments, big and small, that brought us to this day.",
  },
  families: {
    brideFamily: {
      title: "Bride's Family",
      names: "Mr. & Mrs. Sharma",
    },
    groomFamily: {
      title: "Groom's Family",
      names: "Mr. & Mrs. Kumar",
    },
  },
  rsvp: {
    endpoint: "/api/rsvp",
  },
};
