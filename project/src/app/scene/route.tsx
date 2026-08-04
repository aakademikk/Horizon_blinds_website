import RoomScene from "@/components/scene/RoomScene";
import { finishes, louvres, rooms, type ProductKind, type RoomId } from "@/lib/products";
import { daylight, type TimeOfDay } from "@/lib/scene";

export const runtime = "nodejs";

/**
 * Renders a room scene as a standalone SVG image.
 *
 * Inlining these scenes into the page markup is right for the interactive
 * modules — they redraw as the visitor moves a slider — but wrong everywhere
 * else: a page with twenty decorative scenes was shipping 1.4 MB of HTML and
 * ten thousand DOM nodes. Served this way each distinct scene is one cacheable
 * request, the browser reuses repeats for free, and the document collapses to
 * a handful of `<img>` tags.
 */

const KINDS: ProductKind[] = [
  "shutter",
  "wooden",
  "venetian",
  "roman",
  "roller",
  "perfect-fit",
  "electric",
];

const ROOM_IDS = rooms.map((r) => r.id);
const TIMES = Object.keys(daylight) as TimeOfDay[];

/** Dust motes animate via CSS, which only applies if it travels inside the SVG. */
const MOTE_KEYFRAMES = `
@keyframes dust {
  0%   { transform: translate3d(0,0,0); opacity: 0; }
  12%  { opacity: .55; }
  88%  { opacity: .45; }
  100% { transform: translate3d(14px,-70px,0); opacity: 0; }
}
.mote { animation: dust var(--dur,14s) linear infinite; animation-delay: var(--delay,0s); }
@media (prefers-reduced-motion: reduce) { .mote { animation: none; } }
`;

export async function GET(request: Request) {
  // Imported at call time rather than at module scope: the App Router rejects a
  // static `react-dom/server` import anywhere in its graph, and this handler
  // only ever runs on the server.
  const { renderToStaticMarkup } = await import("react-dom/server");

  const q = new URL(request.url).searchParams;

  const pick = <T extends string>(name: string, allowed: readonly T[], fallback: T): T => {
    const v = q.get(name);
    return v && (allowed as readonly string[]).includes(v) ? (v as T) : fallback;
  };

  const num = (name: string, min: number, max: number, fallback: number) => {
    const v = Number(q.get(name));
    return Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : fallback;
  };

  const markup = renderToStaticMarkup(
    <RoomScene
      room={pick<RoomId>("room", ROOM_IDS, "living")}
      kind={pick<ProductKind>("kind", KINDS, "shutter")}
      variant={q.get("variant") === "solid-panels" ? "solid-panels" : undefined}
      finishId={pick(
        "finish",
        finishes.map((f) => f.id),
        "silk-white",
      )}
      louvreId={pick(
        "louvre",
        louvres.map((l) => l.id),
        "76",
      )}
      tilt={num("tilt", 0, 90, 45)}
      time={pick<TimeOfDay>("time", TIMES, "morning")}
      bare={q.get("bare") === "1"}
      pan={num("pan", -600, 600, 0)}
    />,
  );

  // A standalone SVG needs its own namespace and a copy of the mote animation.
  const svg = markup
    .replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" ')
    .replace("<defs>", `<defs><style>${MOTE_KEYFRAMES}</style>`);

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      // Output depends only on the query string, so it never needs revalidating.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
