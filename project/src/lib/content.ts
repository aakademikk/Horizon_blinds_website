/**
 * Editorial content: reviews, projects, process, FAQs and comparison data.
 * Kept apart from the product catalogue so copy can be edited without
 * touching pricing logic.
 */

/* --------------------------------------------------------------- reviews */

export type Review = {
  id: string;
  name: string;
  location: string;
  rating: 5;
  source: "Google" | "Checkatrade" | "Facebook" | "Trustpilot";
  date: string;
  headline: string;
  body: string;
  product: string;
  /** Initials used for the portrait medallion. */
  initials: string;
};

export const reviews: Review[] = [
  {
    id: "r1",
    name: "Charlotte Bennett",
    location: "Shenfield, Brentwood",
    rating: 5,
    source: "Google",
    date: "2026-05-18",
    headline: "The bay is the best thing in the house now",
    body:
      "We had put off doing the bay for four years because everyone told us it was awkward. Fab templated every angle on site and the finished frames meet so cleanly you would think the window was built around them. The fitter was here seven hours and left the room cleaner than he found it.",
    product: "Bay window shutters, 76mm, Silk White",
    initials: "CB",
  },
  {
    id: "r2",
    name: "Michael Osei",
    location: "Chalkwell, Leigh-on-Sea",
    rating: 5,
    source: "Checkatrade",
    date: "2026-04-02",
    headline: "Finally solved our west-facing glare",
    body:
      "Our sitting room faces the estuary and from four o'clock it was unusable. Ian talked us out of the blackout blind we thought we wanted and into tier on tier — open the top for the view, close the bottom against the sun. Exactly right. Should have called them years ago.",
    product: "Tier on tier shutters, 63mm, White",
    initials: "MO",
  },
  {
    id: "r3",
    name: "Priya Shah",
    location: "Springfield, Chelmsford",
    rating: 5,
    source: "Google",
    date: "2026-03-21",
    headline: "Nine windows, one day, no mess",
    body:
      "Whole house done in a single day by two fitters who clearly enjoy their work. They dust-sheeted everything, took the old blinds away and hoovered up. The 89mm louvres were the right call — you barely notice them when they are open.",
    product: "Full height shutters throughout, 89mm, Pure White",
    initials: "PS",
  },
  {
    id: "r4",
    name: "David & Ann Whitfield",
    location: "Hockley, Rayleigh",
    rating: 5,
    source: "Trustpilot",
    date: "2026-02-09",
    headline: "Tracked panels across the bi-folds",
    body:
      "Five metres of bi-fold and no idea what to do with it. The tracked shutters glide with one finger and stack right back out of the way when the doors are open in summer. Quality of the timber is a step above what we were shown elsewhere.",
    product: "Tracked shutters, 89mm, Anthracite",
    initials: "DW",
  },
  {
    id: "r5",
    name: "Rebecca Lyons",
    location: "Billericay, Basildon",
    rating: 5,
    source: "Facebook",
    date: "2026-01-15",
    headline: "Our daughter sleeps through now",
    body:
      "Solid panel shutters in the nursery and the difference is genuinely absurd. Pitch black at seven in the evening in midsummer. Warmer too — we noticed within a week. No hesitation recommending them.",
    product: "Solid panel shutters, Cream",
    initials: "RL",
  },
  {
    id: "r6",
    name: "James Thornbury",
    location: "Thorpe Bay, Southend",
    rating: 5,
    source: "Google",
    date: "2025-12-04",
    headline: "Straightforward, honest, no pressure",
    body:
      "The survey took an hour and there was no hard sell whatsoever — he actually told us the room we were least worried about was the one that needed doing first. Quote came through the same evening, itemised properly. Fitted five weeks later to the day.",
    product: "Wooden blinds and roller blinds",
    initials: "JT",
  },
];

export const reviewPlatforms = [
  { name: "Google", score: 4.9, count: 387 },
  { name: "Checkatrade", score: 9.8, count: 142, suffix: "/10" },
  { name: "Trustpilot", score: 4.8, count: 96 },
  { name: "Facebook", score: 5.0, count: 211 },
] as const;

/* -------------------------------------------------------------- projects */

export type Project = {
  id: string;
  title: string;
  property: string;
  location: string;
  installed: string[];
  duration: string;
  quote: string;
  attribution: string;
  /** Scene preset used to render the project artwork. */
  scene: { room: import("./products").RoomId; product: string; finish: string; louvre: string; tilt: number; time: import("./scene").TimeOfDay };
};

export const projects: Project[] = [
  {
    id: "p1",
    title: "A Victorian bay, put right",
    property: "Four-bedroom Victorian semi",
    location: "Brentwood, Essex",
    installed: ["Bay window shutters", "Full height shutters", "76mm louvres"],
    duration: "One day",
    quote: "They made the hardest window in the house look effortless.",
    attribution: "Charlotte B.",
    scene: { room: "living", product: "full-height", finish: "silk-white", louvre: "76", tilt: 45, time: "morning" },
  },
  {
    id: "p2",
    title: "Estuary light, tamed",
    property: "Edwardian townhouse",
    location: "Leigh-on-Sea, Essex",
    installed: ["Tier on tier shutters", "Café style shutters", "63mm louvres"],
    duration: "Two days",
    quote: "We got the view back and lost the glare. That was the whole brief.",
    attribution: "Michael O.",
    scene: { room: "living", product: "tier-on-tier", finish: "white", louvre: "63", tilt: 20, time: "evening" },
  },
  {
    id: "p3",
    title: "Nine windows in a single day",
    property: "New-build detached",
    location: "Chelmsford, Essex",
    installed: ["Full height shutters", "89mm louvres", "Electric roller blinds"],
    duration: "One day",
    quote: "Two fitters, no mess, and the house felt finished by teatime.",
    attribution: "Priya S.",
    scene: { room: "bedroom", product: "full-height", finish: "pure-white", louvre: "89", tilt: 70, time: "afternoon" },
  },
  {
    id: "p4",
    title: "Six metres of bi-fold",
    property: "Rear extension, 1930s semi",
    location: "Rayleigh, Essex",
    installed: ["Tracked shutters", "89mm louvres", "Anthracite finish"],
    duration: "One day",
    quote: "They glide with one finger and stack completely out of the way.",
    attribution: "David W.",
    scene: { room: "living", product: "tracked", finish: "anthracite", louvre: "89", tilt: 55, time: "afternoon" },
  },
  {
    id: "p5",
    title: "A nursery that stays dark",
    property: "Family home",
    location: "Billericay, Essex",
    installed: ["Solid panel shutters", "Cream finish", "Blackout roman blind"],
    duration: "Half a day",
    quote: "Pitch black at seven in the evening in midsummer. Worth every penny.",
    attribution: "Rebecca L.",
    scene: { room: "bedroom", product: "solid-panels", finish: "cream", louvre: "63", tilt: 0, time: "evening" },
  },
  {
    id: "p6",
    title: "Wet room, no compromise",
    property: "Coastal apartment",
    location: "Southend-on-Sea, Essex",
    installed: ["Waterproof ABS shutters", "47mm louvres", "Pure White"],
    duration: "Half a day",
    quote: "Three years of steam and they still look like the day they went in.",
    attribution: "Helen M.",
    scene: { room: "bathroom", product: "full-height", finish: "pure-white", louvre: "47", tilt: 35, time: "morning" },
  },
];

/* --------------------------------------------------------------- process */

export const processSteps = [
  {
    n: "01",
    title: "Book your survey",
    duration: "2 minutes",
    body:
      "Call us or send the form. We will find a time that suits — evenings and Saturdays included — and confirm it the same day.",
  },
  {
    n: "02",
    title: "Home consultation",
    duration: "About an hour",
    body:
      "We bring the full sample range to your sofa. You see the timber, feel the weight of a panel and hold the finishes against your own walls in your own light.",
  },
  {
    n: "03",
    title: "Laser measuring",
    duration: "Same visit",
    body:
      "Every aperture measured to the millimetre, every bay angle templated, every out-of-square reveal recorded. This is the step that decides whether the job is beautiful.",
  },
  {
    n: "04",
    title: "Manufacture",
    duration: "4 to 6 weeks",
    body:
      "Your order goes into production against your measurements alone. Nothing is cut to a standard size and adjusted on site.",
  },
  {
    n: "05",
    title: "Professional installation",
    duration: "Usually one day",
    body:
      "Our own fitters, never subcontractors. Dust sheets down, old coverings taken away, everything hoovered before we leave.",
  },
  {
    n: "06",
    title: "Enjoy your home",
    duration: "For decades",
    body:
      "Five-year guarantee on parts and workmanship, and a phone number that still answers years later. We are usually only a few miles away.",
  },
];

/* ------------------------------------------------------------ why choose */

export const pillars = [
  {
    icon: "Ruler",
    title: "Made to Measure",
    body:
      "Nothing we fit came off a shelf. Every panel is manufactured to the measurements of one specific window in your home, which is why the shadow gaps are even and the reveals sit flush.",
  },
  {
    icon: "Hammer",
    title: "Expert Installation",
    body:
      "Our own fitters, on our own payroll, most of them a decade in. They template the bay, scribe to the plaster and take the old blinds away with them.",
  },
  {
    icon: "TreePine",
    title: "Premium Materials",
    body:
      "Sustainably sourced hardwood, engineered timber and waterproof ABS. Everything is FSC certified and finished with low-VOC lacquers that will not yellow.",
  },
  {
    icon: "Palette",
    title: "Beautiful Finishes",
    body:
      "Forty-two standard colours, hand-oiled natural timbers and a colour-match service for anything else. Hinges and tilt rods finished to match, never left white as an afterthought.",
  },
  {
    icon: "HeartHandshake",
    title: "Personal Service",
    body:
      "The person who measures your windows is the person who quotes them and the person who answers when you call. No call centre, no subcontracted survey.",
  },
  {
    icon: "ShieldCheck",
    title: "Long Guarantees",
    body:
      "Five years on parts and workmanship as standard, ten on shutter frames. We have been trading here since 2009 and intend to be here in another fifteen.",
  },
] as const;

/* ------------------------------------------------------------ comparison */

export type CompareMetric = {
  id: string;
  label: string;
  detail: string;
  scores: { curtains: number; blinds: number; shutters: number };
};

export const compareMetrics: CompareMetric[] = [
  {
    id: "privacy",
    label: "Privacy",
    detail:
      "Shutters close to a genuine seal with no light gaps at the edges. Curtains billow; most blinds leave a channel down each side.",
    scores: { curtains: 3, blinds: 3.5, shutters: 5 },
  },
  {
    id: "energy",
    label: "Energy Efficiency",
    detail:
      "A closed shutter panel creates a still air pocket against the glass. Independent testing puts the heat-loss reduction at up to 51% versus bare glazing.",
    scores: { curtains: 3.5, blinds: 2.5, shutters: 5 },
  },
  {
    id: "light",
    label: "Light Control",
    detail:
      "Louvres tilt through 180 degrees, so you can bounce daylight up onto the ceiling or shut it out entirely. Curtains are essentially open or closed.",
    scores: { curtains: 1.5, blinds: 4, shutters: 5 },
  },
  {
    id: "maintenance",
    label: "Maintenance",
    detail:
      "A dry cloth along the louvres, twice a year. No taking down, no dry cleaning, no fabric holding dust and cooking smells.",
    scores: { curtains: 1.5, blinds: 3, shutters: 5 },
  },
  {
    id: "longevity",
    label: "Longevity",
    detail:
      "Fabric fades and fraying cords fail. A properly made shutter is a fixture — most of ours will outlast the decorating scheme around them several times over.",
    scores: { curtains: 2, blinds: 3, shutters: 5 },
  },
  {
    id: "value",
    label: "Property Value",
    detail:
      "Shutters stay with the house and read as a fitted improvement in a valuation, in the way a curtain pole never will.",
    scores: { curtains: 1, blinds: 2, shutters: 5 },
  },
];

/* ------------------------------------------------------------------ FAQs */

export type Faq = { q: string; a: string; group: string };

export const faqs: Faq[] = [
  {
    group: "Getting started",
    q: "Is the home survey really free, and is there any obligation?",
    a: "Genuinely free and genuinely no obligation. We bring the full sample range to you, measure everything properly and leave you with an itemised written quotation — usually the same evening. Plenty of people take it away and think about it for months. That is fine.",
  },
  {
    group: "Getting started",
    q: "How long does the whole process take?",
    a: "From survey to installation is typically five to seven weeks. The survey is about an hour, manufacture takes four to six weeks because everything is built to your measurements, and installation for a whole house is usually a single day.",
  },
  {
    group: "Pricing",
    q: "How much do plantation shutters cost?",
    a: "As a broad guide, most rooms land between £600 and £1,400 per window supplied and fitted, depending on size, material and configuration. A whole house is commonly £4,000 to £9,000. The estimator on this site will give you a considered range in about a minute — but only a survey produces a real figure.",
  },
  {
    group: "Pricing",
    q: "Do you offer finance?",
    a: "Yes. Interest-free credit over 12 months and longer low-rate terms are available on orders above £1,000, subject to status. We will talk you through the options at the survey with no pressure either way.",
  },
  {
    group: "Products",
    q: "Which louvre size should I choose?",
    a: "63mm is the safe all-rounder and 76mm is what we fit most often — wider louvres mean fewer lines across the glass and more view when open. 47mm suits smaller cottage panes and period properties. We bring samples of all four so you can hold them up to your own window.",
  },
  {
    group: "Products",
    q: "Will shutters work in a bathroom or kitchen?",
    a: "Very well, provided you specify the right material. We use waterproof ABS in wet rooms and en suites — it will not warp, swell, peel or discolour, and it looks identical to painted timber once fitted. In kitchens, a wipe-clean finish handles steam and cooking residue easily.",
  },
  {
    group: "Products",
    q: "Can you do bay windows and awkward shapes?",
    a: "Yes, and it is a good deal of what we do. Square, splayed and box bays, arches, circles, triangles and raked windows in loft conversions. Every angle is templated on site rather than estimated, which is why the frames meet cleanly at the mullions.",
  },
  {
    group: "Practical",
    q: "Do shutters block too much light?",
    a: "It is the most common worry and almost always the wrong way round. Louvres tilt through a full range — open, they let in more usable daylight than most blinds because there is no fabric across the glass. Wider louvres like 76mm and 89mm leave a remarkably clear view.",
  },
  {
    group: "Practical",
    q: "Are they safe with young children?",
    a: "Shutters have no cords or chains at all, which makes them the safest window covering you can fit. All of our blinds are supplied child-safe as standard, in line with current UK regulations.",
  },
  {
    group: "Practical",
    q: "How do I clean them?",
    a: "A dry microfibre cloth or a soft brush attachment along the louvres, twice a year. Painted finishes take a damp cloth if something is sticky. That is the entire maintenance schedule.",
  },
  {
    group: "Aftercare",
    q: "What does the guarantee cover?",
    a: "Five years on parts and workmanship as standard, and ten years on shutter frames. If a hinge works loose or a louvre pin fails, we come back and put it right. Our fitters are employed by us, so there is never a question of who is responsible.",
  },
  {
    group: "Aftercare",
    q: "Which areas do you cover?",
    a: "All of Essex — Brentwood, Chelmsford, Leigh-on-Sea, Southend, Basildon, Rayleigh and everywhere in between — plus parts of east London and south Suffolk. If you are unsure, call us; if we cannot help we will usually know someone good who can.",
  },
];

/* ------------------------------------------------------- product finder */

export type FinderQuestion = {
  id: string;
  question: string;
  hint: string;
  options: { id: string; label: string; note: string; weights: Record<string, number> }[];
};

export const finderQuestions: FinderQuestion[] = [
  {
    id: "room",
    question: "Which room are we dressing?",
    hint: "Different rooms ask completely different questions of a window covering.",
    options: [
      { id: "living", label: "Living room", note: "Daylight and evening privacy", weights: { "full-height": 3, tracked: 2, wooden: 2 } },
      { id: "bedroom", label: "Bedroom", note: "Darkness matters most", weights: { "solid-panels": 3, roman: 3, "full-height": 2 } },
      { id: "kitchen", label: "Kitchen", note: "Steam and wipe-clean surfaces", weights: { "cafe-style": 3, venetian: 3, "perfect-fit": 2 } },
      { id: "bathroom", label: "Bathroom", note: "Privacy and moisture", weights: { "full-height": 3, roller: 2, venetian: 2 } },
    ],
  },
  {
    id: "priority",
    question: "What matters most to you?",
    hint: "There is rarely one right answer — tell us where you would compromise last.",
    options: [
      { id: "privacy", label: "Privacy", note: "Keeping the street out", weights: { "full-height": 3, "solid-panels": 3, "perfect-fit": 2 } },
      { id: "light", label: "Light control", note: "Managing sun and glare", weights: { "full-height": 3, venetian: 3, "tier-on-tier": 3 } },
      { id: "warmth", label: "Warmth", note: "Cutting heat loss", weights: { "solid-panels": 3, "full-height": 2, roman: 2 } },
      { id: "looks", label: "Pure aesthetics", note: "It has to be beautiful", weights: { "full-height": 3, wooden: 3, roman: 2 } },
    ],
  },
  {
    id: "style",
    question: "How would you describe the house?",
    hint: "We will steer the proportions to suit the architecture.",
    options: [
      { id: "period", label: "Period", note: "Victorian, Edwardian, cottage", weights: { "tier-on-tier": 3, "solid-panels": 2, "cafe-style": 2 } },
      { id: "classic", label: "Classic", note: "Thirties semi, family home", weights: { "full-height": 3, wooden: 2, roman: 2 } },
      { id: "modern", label: "Contemporary", note: "New-build, extension, clean lines", weights: { "full-height": 3, tracked: 3, roller: 2 } },
      { id: "coastal", label: "Coastal", note: "Sea light, salt air", weights: { "cafe-style": 3, roller: 2, "full-height": 2 } },
    ],
  },
  {
    id: "window",
    question: "What sort of window is it?",
    hint: "Shape decides more than anything else on this list.",
    options: [
      { id: "standard", label: "Standard", note: "Square or rectangular", weights: { "full-height": 2, venetian: 2, roller: 2 } },
      { id: "bay", label: "Bay", note: "Splayed, square or box", weights: { "bay-window": 4, "full-height": 2 } },
      { id: "wide", label: "Wide or bi-fold", note: "Patio doors, large spans", weights: { tracked: 4, roller: 1 } },
      { id: "hard", label: "Hard to reach", note: "High, or above a stairwell", weights: { electric: 4, roller: 2 } },
    ],
  },
  {
    id: "budget",
    question: "Where would you like to sit on budget?",
    hint: "We will show you the honest option, not the expensive one.",
    options: [
      { id: "value", label: "Best value", note: "Do it well, keep it sensible", weights: { roller: 3, venetian: 3, "perfect-fit": 2 } },
      { id: "mid", label: "Balanced", note: "Quality that lasts", weights: { wooden: 3, roman: 2, "cafe-style": 2 } },
      { id: "premium", label: "Investment", note: "The best we make", weights: { "full-height": 3, "tier-on-tier": 3, tracked: 2 } },
      { id: "unsure", label: "Not sure yet", note: "Show me the range", weights: { "full-height": 2, wooden: 2, venetian: 1 } },
    ],
  },
];
