export interface CoupleInfo {
  brideName: string;
  groomName: string;
  brideIntro: string;
  groomIntro: string;
  bridePhoto: string;
  groomPhoto: string;
  heroPhoto: string;
}

export interface StoryMilestone {
  date: string;
  title: string;
  description: string;
  image?: string;
}

export interface WeddingEvent {
  name: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  icon: "flame" | "flower" | "heart" | "sparkles";
  mapUrl?: string;
}

export interface VenueInfo {
  name: string;
  address: string;
  image: string;
  mapEmbedUrl?: string;
  directionsUrl: string;
}

export type GalleryCategory =
  | "pre-wedding"
  | "engagement"
  | "haldi"
  | "mehendi"
  | "wedding";

export interface GalleryImage {
  src: string;
  category: GalleryCategory;
  alt: string;
  aspect: "portrait" | "landscape" | "square";
}

export interface WeddingVideo {
  thumbnail: string;
  url: string;
  title: string;
  description: string;
}

export interface FamilyGroup {
  title: string;
  names: string;
}

export interface FamiliesInfo {
  brideFamily: FamilyGroup;
  groomFamily: FamilyGroup;
}

export interface RsvpConfig {
  endpoint: string;
}

export interface WeddingData {
  couple: CoupleInfo;
  weddingDate: string;
  invitationMessage: string;
  story: StoryMilestone[];
  events: WeddingEvent[];
  venue: VenueInfo;
  gallery: GalleryImage[];
  video?: WeddingVideo;
  families: FamiliesInfo;
  rsvp: RsvpConfig;
}
