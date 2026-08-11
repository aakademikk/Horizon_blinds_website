/**
 * Single source of truth for brand, contact and coverage details.
 * Anything that appears in more than one place — nav, footer, schema.org
 * payloads, page metadata — reads from here.
 */

/**
 * Search engines are shut out unless this is explicitly switched on.
 *
 * The build carries a real company's name, logo, phone number and address, so
 * a prototype on a shareable URL must not be crawlable — it could be taken for
 * their actual site, or compete with it. Set NEXT_PUBLIC_ALLOW_INDEXING=true
 * only on the deployment that is genuinely theirs.
 */
export const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

export const site = {
  name: "Horizon Blinds & Shutters",
  shortName: "Horizon",
  tagline: "Made to Measure Blinds, Shutters & Curtains Across Essex",
  description:
    "Made-to-measure blinds, shutters and curtains, professionally measured and installed across South Essex. Family run, no hard sell, free fitting.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://horizonblindsandshutters.co.uk",
  locale: "en_GB",
  /**
   * Trading history is stated as the owner's time in the industry, which is
   * what their own site claims. `founded` is left out on purpose — we do not
   * have a verified incorporation date to put in the schema.org payload.
   */
  yearsTrading: 10,
  phone: "07375 802 259",
  phoneHref: "tel:+447375802259",
  whatsappHref: "https://wa.me/447375802259",
  email: "horizon4blinds@gmail.com",
  address: {
    street: "52 Denham Road",
    locality: "Canvey Island",
    region: "Essex",
    postcode: "SS8 9HA",
    country: "GB",
  },
  geo: { lat: 51.5209, lng: 0.5892 },
  hours: [
    { days: "Monday – Friday", time: "9:00am – 6:00pm" },
    { days: "Saturday", time: "9:00am – 4:00pm" },
    { days: "Sunday", time: "Appointments by arrangement" },
  ],
  openingHoursSpec: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "18:00" },
    { days: ["Saturday"], opens: "09:00", closes: "16:00" },
  ],
  social: {
    facebook: "https://www.facebook.com/p/Horizon-Blinds-Shutters-100091233764620/",
    instagram: "https://www.instagram.com/horizonblindsandshutters",
  },
  /** What they actually promise, in place of invented review scores. */
  guarantee: { blinds: 1, shutters: 3 },
  /** Optional outbound webhook for enquiries (Zapier, Make, n8n, CRM…). */
  webhookEnvKey: "ENQUIRY_WEBHOOK_URL",
} as const;

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string; note?: string }[];
};

export const navigation: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Shutters",
    href: "/shutters",
    children: [
      { label: "Full Height", href: "/shutters#full-height", note: "One clean sweep of louvres" },
      { label: "Tier on Tier", href: "/shutters#tier-on-tier", note: "Independent top and bottom" },
      { label: "Café Style", href: "/shutters#cafe-style", note: "Privacy below, light above" },
      { label: "Tracked", href: "/shutters#tracked", note: "For wide spans and bi-folds" },
      { label: "Bay Window", href: "/shutters#bay-window", note: "Angled to the millimetre" },
      { label: "Solid Panels", href: "/shutters#solid-panels", note: "Georgian and shaker" },
    ],
  },
  {
    label: "Blinds",
    href: "/blinds",
    children: [
      { label: "Venetian Blinds", href: "/blinds#venetian", note: "Precise light control" },
      { label: "Roman Blinds", href: "/blinds#roman", note: "Soft, tailored folds" },
      { label: "Roller Blinds", href: "/blinds#roller", note: "Quiet and uncluttered" },
      { label: "Perfect Fit", href: "/blinds#perfect-fit", note: "No drilling, no gaps" },
      { label: "Electric Blinds", href: "/blinds#electric", note: "Whisper-quiet motorisation" },
    ],
  },
  { label: "Commercial", href: "/commercial" },
  { label: "Gallery", href: "/gallery" },
  { label: "Reviews", href: "/reviews" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export type Area = {
  slug: string;
  name: string;
  intro: string;
  character: string;
  landmarks: string[];
  postcodes: string[];
  popular: string[];
};

export const areas: Area[] = [
  {
    slug: "canvey-island",
    name: "Canvey Island",
    intro:
      "We are based on Canvey, so this is very much home. We have dressed everything here from seafront flats to family homes on the estates behind them.",
    character:
      "Bright, exposed and close to the water. We specify moisture-resistant finishes as standard, and we know which rooms take the afternoon glare full in the face.",
    landmarks: ["Leigh Beck", "Winter Gardens", "Thorney Bay", "Benfleet", "South Benfleet"],
    postcodes: ["SS8", "SS7"],
    popular: ["Full height shutters", "Waterproof shutters", "Roller blinds"],
  },
  {
    slug: "leigh-on-sea",
    name: "Leigh-on-Sea",
    intro:
      "Light is the whole point in Leigh. We spend a lot of time here balancing estuary views against west-facing glare and the privacy of a busy street.",
    character:
      "Edwardian bays, sea light and salt air. We specify moisture-resistant finishes as standard within a mile of the water.",
    landmarks: ["Old Leigh", "Chalkwell", "Westcliff", "Thorpe Bay"],
    postcodes: ["SS9", "SS0"],
    popular: ["Café style shutters", "Tier on tier shutters", "Roller blinds"],
  },
  {
    slug: "chelmsford",
    name: "Chelmsford",
    intro:
      "From city-centre apartments to the villages beyond, Chelmsford is one of our busiest patches — and one of the most varied.",
    character:
      "A city of contrasts: crisp modern glazing in the centre, generous Victorian sashes in Moulsham and Springfield.",
    landmarks: ["Springfield", "Moulsham", "Great Baddow", "Writtle", "Danbury"],
    postcodes: ["CM1", "CM2", "CM3"],
    popular: ["Full height shutters", "Electric blinds", "Perfect fit blinds"],
  },
  {
    slug: "southend-on-sea",
    name: "Southend-on-Sea",
    intro:
      "Seafront apartments, family homes and a good number of holiday lets — Southend asks a lot of a window covering, and we specify accordingly.",
    character:
      "Bright, exposed and coastal. Waterproof ABS shutters earn their keep in bathrooms and sea-facing rooms.",
    landmarks: ["Westcliff", "Shoeburyness", "Prittlewell", "Eastwood"],
    postcodes: ["SS1", "SS2", "SS3"],
    popular: ["Waterproof shutters", "Roller blinds", "Commercial blinds"],
  },
  {
    slug: "basildon",
    name: "Basildon",
    intro:
      "Basildon is largely post-war and modern stock, which means clean apertures, square reveals and shutters that look sensational against simple architecture.",
    character:
      "Straightforward geometry, generous glazing. A place where minimal frames and wide louvres really sing.",
    landmarks: ["Billericay", "Wickford", "Laindon", "Pitsea", "Vange"],
    postcodes: ["SS13", "SS14", "SS15", "SS16"],
    popular: ["Full height shutters", "Venetian blinds", "Roman blinds"],
  },
  {
    slug: "rayleigh",
    name: "Rayleigh",
    intro:
      "A lot of our Rayleigh work comes by recommendation, one street at a time. It is that kind of town.",
    character:
      "Established family homes with big rear extensions — the sort of wide glazed spans that tracked shutters were invented for.",
    landmarks: ["Hockley", "Rochford", "Hullbridge", "Eastwood"],
    postcodes: ["SS6", "SS5", "SS4"],
    popular: ["Tracked shutters", "Bay window shutters", "Venetian blinds"],
  },
];

/** Only claims with a source. No review scores until they are pulled live. */
export const trustBadges = [
  { label: "Family Run", value: "Owner-led", note: "The person who quotes, fits" },
  { label: "In the Trade", value: "10+ Years", note: "Across South Essex" },
  { label: "Made to Measure", value: "100%", note: "Nothing off the shelf" },
  { label: "Shutter Guarantee", value: "3 Years", note: "One year on blinds" },
];
