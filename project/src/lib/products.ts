/**
 * Product catalogue, finish library and the numbers behind the estimator.
 *
 * Pricing here is deliberately indicative — every figure the site shows the
 * visitor is framed as an "estimated investment", never a quotation.
 */

export type ProductKind =
  | "shutter"
  | "wooden"
  | "venetian"
  | "roman"
  | "roller"
  | "perfect-fit"
  | "electric";

export type Product = {
  id: string;
  slug: string;
  kind: ProductKind;
  family: "shutters" | "blinds";
  name: string;
  strapline: string;
  description: string;
  /** Indicative £ per square metre, supplied and fitted. */
  rate: number;
  /** 1–5 scores that drive the comparison and explorer read-outs. */
  scores: {
    privacy: number;
    light: number;
    insulation: number;
    durability: number;
    maintenance: number;
    value: number;
  };
  features: string[];
  bestFor: string[];
};

export const products: Product[] = [
  {
    id: "full-height",
    slug: "full-height",
    kind: "shutter",
    family: "shutters",
    name: "Full Height Shutters",
    strapline: "One uninterrupted sweep of louvres",
    description:
      "The purest expression of the plantation shutter. Louvres run the full height of the window in a single panel, with an optional mid-rail where you want the top and bottom to move separately. It is the choice that flatters almost every room we work in.",
    rate: 385,
    scores: { privacy: 5, light: 5, insulation: 5, durability: 5, maintenance: 5, value: 5 },
    features: [
      "Hidden tilt rod as standard",
      "Optional mid-rail for split control",
      "47mm to 89mm louvre widths",
      "Concealed hinges, colour-matched",
    ],
    bestFor: ["Living rooms", "Bedrooms", "Period properties"],
  },
  {
    id: "tier-on-tier",
    slug: "tier-on-tier",
    kind: "shutter",
    family: "shutters",
    name: "Tier on Tier Shutters",
    strapline: "Independent top and bottom panels",
    description:
      "Two sets of panels, stacked and hinged separately. Open the top for daylight while the bottom stays closed for privacy — then fold the whole thing back when you want the window entirely clear.",
    rate: 445,
    scores: { privacy: 5, light: 5, insulation: 4, durability: 5, maintenance: 5, value: 5 },
    features: [
      "Fully independent tiers",
      "Ideal for sash and casement windows",
      "Complete clear-view option",
      "Popular in Victorian and Edwardian homes",
    ],
    bestFor: ["Sash windows", "Street-facing rooms", "Town houses"],
  },
  {
    id: "cafe-style",
    slug: "cafe-style",
    kind: "shutter",
    family: "shutters",
    name: "Café Style Shutters",
    strapline: "Privacy below, daylight above",
    description:
      "Panels cover only the lower portion of the window, leaving the top open to the sky. You keep the view out and the light in, and passers-by keep their distance. A quiet classic.",
    rate: 320,
    scores: { privacy: 4, light: 5, insulation: 3, durability: 5, maintenance: 5, value: 4 },
    features: [
      "Set at any height you choose",
      "Maximum daylight retention",
      "Beautiful with a deep sill",
      "Kitchens and front-facing rooms",
    ],
    bestFor: ["Kitchens", "Front rooms", "Cottages"],
  },
  {
    id: "tracked",
    slug: "tracked",
    kind: "shutter",
    family: "shutters",
    name: "Tracked Shutters",
    strapline: "For wide spans and bi-fold doors",
    description:
      "Panels hang from a slimline top track and glide sideways, stacking neatly at one or both ends. The answer for patio doors, bi-folds and any opening too wide to hinge.",
    rate: 495,
    scores: { privacy: 5, light: 4, insulation: 5, durability: 5, maintenance: 4, value: 5 },
    features: [
      "Bypass or bi-fold configurations",
      "Spans up to 6 metres",
      "Smooth, weighted glide",
      "Full stack-back clearance",
    ],
    bestFor: ["Bi-fold doors", "Patio doors", "Open-plan extensions"],
  },
  {
    id: "bay-window",
    slug: "bay-window",
    kind: "shutter",
    family: "shutters",
    name: "Bay Window Shutters",
    strapline: "Angled to the millimetre",
    description:
      "Bays are where a made-to-measure shutter proves itself. Every angle is templated on site so the frames meet cleanly at each mullion, with no daylight gaps and no compromise at the returns.",
    rate: 455,
    scores: { privacy: 5, light: 5, insulation: 5, durability: 5, maintenance: 5, value: 5 },
    features: [
      "On-site angle templating",
      "Square, splayed and box bays",
      "Seamless corner posts",
      "Bespoke to every reveal",
    ],
    bestFor: ["Bay windows", "Period homes", "Front elevations"],
  },
  {
    id: "solid-panels",
    slug: "solid-panels",
    kind: "shutter",
    family: "shutters",
    name: "Solid Panel Shutters",
    strapline: "Georgian and shaker traditions",
    description:
      "No louvres — just beautifully made solid panels, in raised Georgian or flat shaker profiles. Complete blackout, exceptional insulation, and a look that belongs in a period property.",
    rate: 420,
    scores: { privacy: 5, light: 1, insulation: 5, durability: 5, maintenance: 5, value: 4 },
    features: [
      "Total blackout when closed",
      "Georgian raised or shaker flat",
      "Best-in-class insulation",
      "Handsome on cottage windows",
    ],
    bestFor: ["Bedrooms", "Listed buildings", "Snugs"],
  },
  {
    id: "wooden",
    slug: "wooden-blinds",
    kind: "wooden",
    family: "blinds",
    name: "Wooden Blinds",
    strapline: "Warm, tactile, and quietly grand",
    description:
      "Real hardwood slats in widths from 25mm to 63mm, finished with decorative ladder tapes if you want them. Wooden blinds bring the grain and warmth of timber without the commitment of a full shutter.",
    rate: 195,
    scores: { privacy: 4, light: 4, insulation: 3, durability: 4, maintenance: 3, value: 4 },
    features: [
      "Basswood and oak veneers",
      "25mm, 50mm and 63mm slats",
      "Optional decorative tapes",
      "Wide colour and stain library",
    ],
    bestFor: ["Living rooms", "Studies", "Dining rooms"],
  },
  {
    id: "venetian",
    slug: "venetian-blinds",
    kind: "venetian",
    family: "blinds",
    name: "Venetian Blinds",
    strapline: "Precise, architectural light control",
    description:
      "Slimline aluminium slats that tilt through a full range, from wide open to fully closed. Crisp, contemporary and remarkably good value — particularly in kitchens and offices.",
    rate: 145,
    scores: { privacy: 4, light: 5, insulation: 2, durability: 4, maintenance: 3, value: 4 },
    features: [
      "25mm and 50mm slats",
      "Matt, gloss and metallic finishes",
      "Moisture resistant throughout",
      "Cordless and child-safe options",
    ],
    bestFor: ["Kitchens", "Offices", "Bathrooms"],
  },
  {
    id: "roman",
    slug: "roman-blinds",
    kind: "roman",
    family: "blinds",
    name: "Roman Blinds",
    strapline: "Soft, tailored, beautifully folded",
    description:
      "Fabric that draws up into deep horizontal folds and drops flat when lowered. The softest option we make — and the one that does most for the acoustics and warmth of a room.",
    rate: 235,
    scores: { privacy: 5, light: 3, insulation: 4, durability: 3, maintenance: 2, value: 4 },
    features: [
      "Designer fabric houses",
      "Blackout and thermal linings",
      "Hand-finished folds",
      "Chain or motorised operation",
    ],
    bestFor: ["Bedrooms", "Sitting rooms", "Nurseries"],
  },
  {
    id: "roller",
    slug: "roller-blinds",
    kind: "roller",
    family: "blinds",
    name: "Roller Blinds",
    strapline: "Quiet, uncluttered, endlessly versatile",
    description:
      "A single clean panel of fabric on a slim cassette. Choose sheer for daytime privacy, dim-out for softness, or blackout for a bedroom that stays properly dark.",
    rate: 125,
    scores: { privacy: 4, light: 3, insulation: 3, durability: 4, maintenance: 4, value: 4 },
    features: [
      "Sheer, dim-out and blackout",
      "Slim cassette or open roll",
      "Waterproof options",
      "Excellent value per window",
    ],
    bestFor: ["Bathrooms", "Kids' rooms", "Utility rooms"],
  },
  {
    id: "perfect-fit",
    slug: "perfect-fit-blinds",
    kind: "perfect-fit",
    family: "blinds",
    name: "Perfect Fit Blinds",
    strapline: "No drilling, no gaps, no fuss",
    description:
      "A slim frame clips into the rubber beading of your double glazing. The blind sits flush against the glass, moves with the window when you open it, and leaves no holes behind.",
    rate: 175,
    scores: { privacy: 5, light: 4, insulation: 4, durability: 4, maintenance: 4, value: 4 },
    features: [
      "Zero drilling into frames",
      "Sits flush to the glass",
      "Moves with tilt-and-turn windows",
      "Venetian or pleated inserts",
    ],
    bestFor: ["Conservatories", "Doors", "Rented homes"],
  },
  {
    id: "electric",
    slug: "electric-blinds",
    kind: "electric",
    family: "blinds",
    name: "Electric Blinds",
    strapline: "Whisper-quiet motorisation",
    description:
      "Rechargeable or hard-wired motors, controlled by handset, wall switch, app or voice. Set them to follow the sun and the house will look after itself.",
    rate: 345,
    scores: { privacy: 5, light: 5, insulation: 4, durability: 5, maintenance: 5, value: 5 },
    features: [
      "App, voice and handset control",
      "Scheduling and sun-tracking",
      "Rechargeable lithium motors",
      "Ideal for high or hard-to-reach windows",
    ],
    bestFor: ["Tall windows", "Roof lanterns", "Smart homes"],
  },
];

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);
export const shutters = products.filter((p) => p.family === "shutters");
export const blinds = products.filter((p) => p.family === "blinds");

/* ---------------------------------------------------------------- finishes */

export type Finish = {
  id: string;
  name: string;
  /** Face colour of the louvre or slat. */
  hex: string;
  /** Shadowed edge, used for the underside of each louvre. */
  shade: string;
  /** Catching the light along the top edge. */
  highlight: string;
  grain: boolean;
  note: string;
  /** Multiplier applied to the base rate. */
  premium: number;
};

export const finishes: Finish[] = [
  { id: "white", name: "White", hex: "#F4F2ED", shade: "#D9D5CC", highlight: "#FFFFFF", grain: false, note: "The default, and still the most requested", premium: 1 },
  { id: "pure-white", name: "Pure White", hex: "#FFFFFF", shade: "#E2E2E2", highlight: "#FFFFFF", grain: false, note: "Crisp and contemporary against modern glazing", premium: 1 },
  { id: "silk-white", name: "Silk White", hex: "#F6F1E7", shade: "#DCD4C4", highlight: "#FFFDF8", grain: false, note: "A whisper of warmth — flattering in older homes", premium: 1.02 },
  { id: "cream", name: "Cream", hex: "#EDE3D0", shade: "#D2C4A9", highlight: "#FBF5E9", grain: false, note: "Soft and traditional, beautiful with natural stone", premium: 1.02 },
  { id: "grey", name: "Grey", hex: "#B7B5B0", shade: "#918F8A", highlight: "#D3D1CC", grain: false, note: "Quiet, architectural, endlessly easy to live with", premium: 1.06 },
  { id: "anthracite", name: "Anthracite", hex: "#4A4C4E", shade: "#303234", highlight: "#65686B", grain: false, note: "Deep and moody — stunning against pale walls", premium: 1.08 },
  { id: "black", name: "Black", hex: "#232323", shade: "#141414", highlight: "#3B3B3B", grain: false, note: "Graphic and confident. Not for the faint-hearted", premium: 1.08 },
  { id: "natural-wood", name: "Natural Wood", hex: "#B98B54", shade: "#8A6337", highlight: "#D6AC77", grain: true, note: "Visible grain, oiled by hand. Warmth you can feel", premium: 1.18 },
];

export const finishById = (id: string) => finishes.find((f) => f.id === id) ?? finishes[0];

/* ------------------------------------------------------------ louvre sizes */

export type Louvre = { id: string; mm: number; label: string; note: string; premium: number };

export const louvres: Louvre[] = [
  { id: "25", mm: 25, label: "25mm", note: "Slim and precise. Classic venetian slat width.", premium: 0.96 },
  { id: "50", mm: 50, label: "50mm", note: "Broader slats for a bolder, more contemporary look.", premium: 1 },
  { id: "47", mm: 47, label: "47mm", note: "Fine and traditional. Suits smaller panes and cottage windows.", premium: 0.97 },
  { id: "63", mm: 63, label: "63mm", note: "The all-rounder. Balanced proportion for most British windows.", premium: 1 },
  { id: "76", mm: 76, label: "76mm", note: "Our most popular. More glass, more view, fewer louvre lines.", premium: 1.04 },
  { id: "89", mm: 89, label: "89mm", note: "Bold and contemporary. Maximum view when open.", premium: 1.08 },
];

export const louvreById = (id: string) => louvres.find((l) => l.id === id) ?? louvres[2];

/* -------------------------------------------------------------- room types */

export type RoomId = "living" | "bedroom" | "kitchen" | "bathroom" | "office";

export type Room = {
  id: RoomId;
  name: string;
  blurb: string;
  /** Typical window area in m² used by the estimator. */
  typicalArea: number;
  /** Products we would genuinely put forward first. */
  recommends: string[];
};

export const rooms: Room[] = [
  {
    id: "living",
    name: "Living Room",
    blurb:
      "The room you look at most and photograph least. Generous louvres, plenty of daylight, and privacy the moment the sun drops.",
    typicalArea: 3.2,
    recommends: ["full-height", "tracked", "wooden"],
  },
  {
    id: "bedroom",
    name: "Bedroom",
    blurb:
      "Darkness when you want it, softness always. Solid panels or a blackout-lined roman will change how you sleep.",
    typicalArea: 2.4,
    recommends: ["solid-panels", "roman", "full-height"],
  },
  {
    id: "kitchen",
    name: "Kitchen",
    blurb:
      "Steam, splashes and south-facing glare. Wipe-clean finishes and café style panels earn their place here.",
    typicalArea: 1.8,
    recommends: ["cafe-style", "venetian", "perfect-fit"],
  },
  {
    id: "bathroom",
    name: "Bathroom",
    blurb:
      "The one room where privacy is non-negotiable. Waterproof ABS shutters will not warp, swell or peel.",
    typicalArea: 1.1,
    recommends: ["full-height", "roller", "venetian"],
  },
  {
    id: "office",
    name: "Home Office",
    blurb:
      "Screen glare is the enemy. Tilt the louvres down and you keep the daylight without the reflection.",
    typicalArea: 2.2,
    recommends: ["full-height", "venetian", "electric"],
  },
];

export const roomById = (id: RoomId) => rooms.find((r) => r.id === id) ?? rooms[0];

/* ------------------------------------------------------------- estimator */

export const motorisationUplift = 0.28;
export const minimumOrder = 550;

/**
 * Indicative supply-and-fit estimate. Rounded to the nearest £10 so it never
 * reads like a quotation.
 */
export function estimate(opts: {
  productId: string;
  widthCm: number;
  heightCm: number;
  finishId: string;
  louvreId?: string;
  motorised?: boolean;
  quantity?: number;
}) {
  const product = products.find((p) => p.id === opts.productId) ?? products[0];
  const finish = finishById(opts.finishId);
  const louvre = opts.louvreId ? louvreById(opts.louvreId) : null;
  const qty = Math.max(1, opts.quantity ?? 1);

  const areaM2 = Math.max(0.4, (opts.widthCm / 100) * (opts.heightCm / 100));

  let unit = areaM2 * product.rate * finish.premium;
  if (louvre && product.kind === "shutter") unit *= louvre.premium;
  if (opts.motorised) unit *= 1 + motorisationUplift;

  // Small windows carry a disproportionate share of fitting time.
  if (areaM2 < 1) unit *= 1.22;

  const total = Math.max(minimumOrder, unit * qty);
  const round = (n: number) => Math.round(n / 10) * 10;

  return {
    perWindow: round(total / qty),
    total: round(total),
    low: round(total * 0.9),
    high: round(total * 1.15),
    areaM2: Math.round(areaM2 * 100) / 100,
    product,
    finish,
  };
}

export const gbp = (n: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(n);
