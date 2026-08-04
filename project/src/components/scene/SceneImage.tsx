import type { SceneProps } from "./RoomScene";

/**
 * A room scene as a cached image rather than inline markup.
 *
 * Use this everywhere a scene is decorative — cards, gallery tiles, page
 * heroes, editorial figures. Reach for `RoomScene` directly only when the
 * drawing has to change in response to the visitor, because that is the one
 * thing an image cannot do.
 */
export default function SceneImage({
  room = "living",
  kind = "shutter",
  variant,
  finishId = "silk-white",
  louvreId = "76",
  tilt = 45,
  time = "morning",
  bare = false,
  pan = 0,
  alt = "",
  className,
  priority = false,
}: Omit<SceneProps, "title" | "className"> & {
  /** Empty alt marks the scene decorative, which is right for most cards. */
  alt?: string;
  className?: string;
  /** Set on the one scene above the fold so it is not lazily loaded. */
  priority?: boolean;
}) {
  const params = new URLSearchParams({
    room,
    kind,
    finish: finishId,
    louvre: louvreId,
    tilt: String(Math.round(tilt)),
    time,
  });
  if (variant) params.set("variant", variant);
  if (bare) params.set("bare", "1");
  if (pan) params.set("pan", String(Math.round(pan)));

  // `next/image` is deliberately not used here: these are vector SVGs served
  // from our own route with immutable caching, so the optimiser has nothing to
  // resize or re-encode and would only add a hop.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/scene?${params.toString()}`}
      alt={alt}
      aria-hidden={alt === "" ? true : undefined}
      width={1200}
      height={800}
      loading={priority ? "eager" : "lazy"}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...({ fetchpriority: priority ? "high" : undefined } as any)}
      decoding={priority ? "sync" : "async"}
      // The drawing has a fixed 1200×800 frame, so it must be cropped to fit
      // its box, never stretched — a portrait phone hero would otherwise
      // squash the room to a third of its width. Listed first so a caller can
      // still override with `object-contain`.
      className={["object-cover", className].filter(Boolean).join(" ")}
      draggable={false}
    />
  );
}
