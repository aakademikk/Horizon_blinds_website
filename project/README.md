# Fab Shutters & Blinds

A luxury interiors website for a made-to-measure shutter and blind company in
Essex. Built with Next.js 15, React 19, TypeScript and Tailwind CSS 4.

```bash
npm install
cp .env.example .env.local   # optional — the site runs without it
npm run dev                  # http://localhost:3000
```

| Script | Does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

---

## The artwork is drawn, not photographed

Every interior on this site is a **parametric SVG scene** rendered by
`src/components/scene/RoomScene.tsx`. There is no photography anywhere in the
repository.

This started as a constraint and became the right architecture. Four of the
interactive features — the room visualiser, the light demo, the privacy
simulator and the colour selector — need a window covering that responds to
input. A photograph cannot rotate its louvres, change its finish or move the
sun through the day. A drawn scene can, and every one of those tools shares the
same renderer, so they always agree with one another.

`RoomScene` takes a room, a product kind, a finish, a louvre width, a tilt angle
and a time of day, and draws:

- a room whose window, floor height and furniture change per room type;
- a sky that blows out toward white the way a backlit window actually does to
  the eye, which is what makes the gaps between louvres read as daylight;
- louvres whose projected height is `cos(tilt)`, overlapping slightly when
  closed — the reason a shutter seals;
- the light those louvres throw across the floor, banded to match their pitch;
- surfaces that darken together as the sun goes down.

The physical relationships live in `src/lib/scene.ts` — `louvreState(tilt)`
returns transmission, privacy and insulation from one angle, and every read-out
on the site is derived from it.

### Swapping in photography

If you later want real photographs:

1. Add the image host to `images.remotePatterns` in `next.config.ts`.
2. Replace `<RoomScene …/>` with `<Image …/>` in the presentational sections:
   `sections/ProductCategories.tsx`, `sections/GalleryGrid.tsx`,
   `sections/Projects.tsx`, `sections/Hero.tsx`, `layout/PageHero.tsx`.
3. **Leave the interactive modules alone.** `interactive/ProductExplorer.tsx`,
   `interactive/LightAndPrivacy.tsx`, `interactive/BeforeAfter.tsx` and
   `interactive/QuoteEstimator.tsx` depend on the scene being drawable.

`src/lib/presets.ts` maps each product and gallery entry to a scene, so it is
also the natural place to map them to image URLs instead.

### Two ways a scene is rendered

Inlining a scene into the page markup is right only when it has to redraw as
the visitor moves a control. Everywhere else it is served as an image:

| Component | Use for | Cost |
| --- | --- | --- |
| `SceneImage` | Cards, gallery tiles, page heroes, editorial figures | One `<img>`; the SVG is fetched once from `/scene` and cached immutably |
| `RoomScene` | The explorer and the light & privacy demo | ~700 DOM nodes, redrawn on every change |

Rendering every scene inline put 1.4 MB of HTML and 10,738 DOM nodes on the
home page. Moving the decorative ones to `SceneImage` cut that to 411 KB
(55 KB gzipped) and 3,137 nodes, and halved first contentful paint. Reach for
`RoomScene` directly only when an image genuinely cannot do the job.

---

## Structure

```
src/
├── app/                    routes, metadata, sitemap, robots, OG image
│   ├── api/enquiry/        POST endpoint for every form on the site
│   └── areas/[slug]/       generated landing page per town
├── components/
│   ├── scene/              the SVG renderer
│   ├── interactive/        explorer, light & privacy, finder, calculators
│   ├── sections/           page sections
│   ├── layout/             header, footer, page chrome
│   ├── forms/              enquiry form
│   └── ui/                 reveal, buttons, type, accordion, counters
└── lib/
    ├── site.ts             brand, contact, coverage — single source of truth
    ├── products.ts         catalogue, finishes, louvres, estimator maths
    ├── content.ts          reviews, projects, process, FAQs, comparison
    ├── scene.ts            lighting model and colour maths
    ├── presets.ts          scene presets and gallery data
    ├── schema.ts           Zod schemas shared by client and API route
    └── seo.tsx             metadata helpers and schema.org builders
```

Editing `src/lib/site.ts` updates the header, footer, contact section, page
metadata and every schema.org payload at once.

---

## Enquiries

All forms POST to `/api/enquiry`. The route validates against the same Zod
schema the client uses (`src/lib/schema.ts`), rejects honeypot submissions,
throttles by IP, then attempts two independent deliveries:

1. **Supabase** — inserted into the `enquiries` table.
2. **Webhook** — POSTed as JSON to `ENQUIRY_WEBHOOK_URL`.

Either can be left unconfigured. The route only reports failure to the visitor
when every *configured* destination failed, so a missing backend never produces
a false error, and a broken backend is never silently swallowed.

The form keeps a draft in `localStorage` so a half-finished enquiry survives a
reload. Consent is deliberately never restored from storage.

### Supabase

```sql
create table public.enquiries (
  id           bigint generated always as identity primary key,
  reference    text not null,
  kind         text not null default 'survey',
  name         text,
  email        text not null,
  phone        text,
  postcode     text,
  area         text,
  product      text,
  room         text,
  windows      integer,
  timeslot     text,
  message      text,
  consent      boolean,
  source       text,
  user_agent   text,
  submitted_at timestamptz not null default now()
);

alter table public.enquiries enable row level security;
-- No public policies: writes come from the server with the service role key.
```

---

## Accessibility

- Semantic landmarks, a skip link, and one `h1` per page.
- Every interactive control is reachable and operable by keyboard. The
  before/after comparison is a proper `role="slider"` with arrow, Home and End
  keys; the lightbox traps Escape and the arrow keys.
- Colour choices target WCAG AA. Charts carry direct labels and a table view,
  so nothing depends on colour alone.
- `prefers-reduced-motion` is honoured everywhere: Lenis never initialises,
  scroll reveals hold at their final state, and the hero intro is skipped
  rather than replayed silently.

## SEO

Metadata API throughout, plus `LocalBusiness`, `Product`, `Review`, `FAQPage`
and `BreadcrumbList` schema, canonical URLs, `sitemap.xml`, `robots.txt`, a
generated Open Graph image, and a landing page per town under `/areas`.

---

## Content notes

Reviews, projects, ratings and the company history are **illustrative sample
content** written to demonstrate the design. Replace them in
`src/lib/content.ts` and `src/lib/site.ts` before the site goes live —
particularly the review counts and platform scores, which should never be
published unless they are true.

Pricing is deliberately indicative. Every figure the visitor sees is framed as
an "estimated investment" and the maths lives in one place
(`estimate()` in `src/lib/products.ts`) so it can be tuned against real rates.
