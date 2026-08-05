import type { ProductKind, RoomId } from "./products";
import type { TimeOfDay } from "./scene";

export type ScenePreset = {
  room: RoomId;
  kind: ProductKind;
  variant?: string;
  finishId: string;
  louvreId: string;
  tilt: number;
  time: TimeOfDay;
};

/**
 * A flattering default scene for each product — the angle, room and light that
 * show that particular covering at its best.
 */
export const scenePresets: Record<string, ScenePreset> = {
  "full-height": { room: "living", kind: "shutter", finishId: "silk-white", louvreId: "76", tilt: 52, time: "morning" },
  "tier-on-tier": { room: "bedroom", kind: "shutter", finishId: "white", louvreId: "63", tilt: 30, time: "afternoon" },
  "cafe-style": { room: "kitchen", kind: "shutter", finishId: "cream", louvreId: "63", tilt: 46, time: "morning" },
  tracked: { room: "living", kind: "shutter", finishId: "anthracite", louvreId: "89", tilt: 64, time: "evening" },
  "bay-window": { room: "office", kind: "shutter", finishId: "pure-white", louvreId: "76", tilt: 40, time: "afternoon" },
  "solid-panels": { room: "bedroom", kind: "shutter", variant: "solid-panels", finishId: "cream", louvreId: "63", tilt: 0, time: "evening" },
  wooden: { room: "office", kind: "wooden", finishId: "natural-wood", louvreId: "63", tilt: 48, time: "afternoon" },
  venetian: { room: "kitchen", kind: "venetian", finishId: "grey", louvreId: "47", tilt: 55, time: "morning" },
  roman: { room: "bedroom", kind: "roman", finishId: "cream", louvreId: "63", tilt: 30, time: "evening" },
  roller: { room: "bathroom", kind: "roller", finishId: "white", louvreId: "63", tilt: 34, time: "morning" },
  "perfect-fit": { room: "kitchen", kind: "perfect-fit", finishId: "white", louvreId: "47", tilt: 50, time: "afternoon" },
  electric: { room: "living", kind: "electric", finishId: "grey", louvreId: "63", tilt: 62, time: "evening" },
};

export const presetFor = (id: string): ScenePreset =>
  scenePresets[id] ?? scenePresets["full-height"];

/** Gallery categories, each rendered from a scene rather than a photograph. */
export type GalleryItem = {
  id: string;
  title: string;
  location: string;
  category: "Modern" | "Traditional" | "Bay Windows" | "Bedrooms" | "Bathrooms" | "Kitchens" | "Commercial";
  detail: string;
  /** Masonry weight — `tall` items span two rows. */
  span: "tall" | "wide" | "normal";
  scene: ScenePreset;
};

export const galleryItems: GalleryItem[] = [
  {
    id: "g1",
    title: "Full height shutters, 89mm",
    location: "New-build detached, Chelmsford",
    category: "Modern",
    detail: "Pure White in a south-facing living room. Wide louvres keep the garden view intact.",
    span: "tall",
    scene: { room: "living", kind: "shutter", finishId: "pure-white", louvreId: "89", tilt: 62, time: "afternoon" },
  },
  {
    id: "g2",
    title: "Café style in Silk White",
    location: "Victorian terrace, Leigh-on-Sea",
    category: "Kitchens",
    detail: "Privacy to the street below, morning light above the sill.",
    span: "normal",
    scene: { room: "kitchen", kind: "shutter", finishId: "silk-white", louvreId: "63", tilt: 40, time: "morning" },
  },
  {
    id: "g3",
    title: "Solid panels, Cream",
    location: "Nursery, Billericay",
    category: "Bedrooms",
    detail: "Georgian raised panels. Complete blackout, and noticeably warmer.",
    span: "normal",
    scene: { room: "bedroom", kind: "shutter", variant: "solid-panels", finishId: "cream", louvreId: "63", tilt: 0, time: "evening" },
  },
  {
    id: "g4",
    title: "Waterproof ABS, 47mm",
    location: "Coastal apartment, Southend",
    category: "Bathrooms",
    detail: "Three years of steam and not a warped louvre in sight.",
    span: "wide",
    scene: { room: "bathroom", kind: "shutter", finishId: "pure-white", louvreId: "47", tilt: 36, time: "morning" },
  },
  {
    id: "g5",
    title: "Tier on tier, 63mm",
    location: "Edwardian bay, Leigh-on-Sea",
    category: "Bay Windows",
    detail: "Top tier open for the estuary, bottom closed against the sun.",
    span: "tall",
    scene: { room: "living", kind: "shutter", finishId: "white", louvreId: "63", tilt: 22, time: "evening" },
  },
  {
    id: "g6",
    title: "Natural oak wooden blinds",
    location: "Home office, Rayleigh",
    category: "Traditional",
    detail: "63mm basswood with matching ladder tapes. Screen glare, solved.",
    span: "normal",
    scene: { room: "office", kind: "wooden", finishId: "natural-wood", louvreId: "63", tilt: 44, time: "afternoon" },
  },
  {
    id: "g7",
    title: "Tracked panels, Anthracite",
    location: "Rear extension, Rayleigh",
    category: "Modern",
    detail: "Six metres of bi-fold, stacked back to nothing in summer.",
    span: "wide",
    scene: { room: "living", kind: "shutter", finishId: "anthracite", louvreId: "89", tilt: 56, time: "afternoon" },
  },
  {
    id: "g8",
    title: "Venetian blinds, Grey",
    location: "Studio office, Basildon",
    category: "Commercial",
    detail: "25mm aluminium across a full glazed elevation.",
    span: "normal",
    scene: { room: "office", kind: "venetian", finishId: "grey", louvreId: "47", tilt: 52, time: "afternoon" },
  },
  {
    id: "g9",
    title: "Blackout roman, Cream",
    location: "Principal bedroom, Chelmsford",
    category: "Bedrooms",
    detail: "Thermal-lined and hand-finished. Warm, quiet and properly dark.",
    span: "normal",
    scene: { room: "bedroom", kind: "roman", finishId: "cream", louvreId: "63", tilt: 20, time: "evening" },
  },
  {
    id: "g10",
    title: "Full height, Silk White",
    location: "1930s semi, Benfleet",
    category: "Traditional",
    detail: "76mm louvres with a mid-rail — the most requested combination we fit.",
    span: "normal",
    scene: { room: "living", kind: "shutter", finishId: "silk-white", louvreId: "76", tilt: 46, time: "morning" },
  },
  {
    id: "g11",
    title: "Perfect fit, White",
    location: "Conservatory, Wickford",
    category: "Modern",
    detail: "Clipped into the beading. No drilling, and it moves with the door.",
    span: "normal",
    scene: { room: "kitchen", kind: "perfect-fit", finishId: "white", louvreId: "47", tilt: 48, time: "morning" },
  },
  {
    id: "g12",
    title: "Electric rollers, Grey",
    location: "Roof lantern, Ingatestone",
    category: "Commercial",
    detail: "Scheduled to track the sun. The house looks after itself.",
    span: "tall",
    scene: { room: "living", kind: "electric", finishId: "grey", louvreId: "63", tilt: 70, time: "evening" },
  },
];

export const galleryCategories = [
  "All",
  "Modern",
  "Traditional",
  "Bay Windows",
  "Bedrooms",
  "Bathrooms",
  "Kitchens",
  "Commercial",
] as const;
