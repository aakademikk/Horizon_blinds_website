import {
  LOUVRE_THICKNESS,
  SLAT_THICKNESS,
  daylight,
  litSurfaces,
  louvreState,
  mix,
  rgba,
  roomLight,
  shift,
  type TimeOfDay,
} from "@/lib/scene";
import { finishById, louvreById, type ProductKind, type RoomId } from "@/lib/products";

/* --------------------------------------------------------------- geometry */

const W = 1200;
const H = 800;

/**
 * Background surfaces are drawn wider than the viewBox so the scene can be
 * panned horizontally (see the `pan` prop) without exposing an edge.
 */
const BG_X = -420;
const BG_W = W + 840;

type Aperture = { x: number; y: number; w: number; h: number };

/**
 * Each room gets its own window and its own place in the frame. Without this
 * every card on the site resolves to the same symmetrical diagram.
 */
const APERTURES: Record<RoomId, { ap: Aperture; floor: number }> = {
  living: { ap: { x: 250, y: 46, w: 660, h: 528 }, floor: 622 },
  bedroom: { ap: { x: 344, y: 62, w: 560, h: 470 }, floor: 604 },
  kitchen: { ap: { x: 296, y: 58, w: 624, h: 322 }, floor: 640 },
  bathroom: { ap: { x: 404, y: 50, w: 452, h: 470 }, floor: 630 },
  office: { ap: { x: 288, y: 52, w: 690, h: 468 }, floor: 612 },
};

/**
 * Gradient and clip-path ids must be unique per *distinct* scene, not per
 * instance — two scenes with identical settings generate byte-identical defs,
 * so sharing an id between them is harmless. Deriving the id from the props
 * rather than `useId` keeps this component free of hooks, which lets it render
 * on the server wherever it is used decoratively.
 */
function sceneKey(parts: (string | number | boolean | undefined)[]) {
  let hash = 0x811c9dc5;
  const source = parts.join("|");
  for (let i = 0; i < source.length; i++) {
    hash ^= source.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(36);
}

export type SceneProps = {
  room?: RoomId;
  /** Product family drives which covering is drawn. */
  kind?: ProductKind;
  /** Shutter configuration slug — only `solid-panels` changes the drawing. */
  variant?: string;
  finishId?: string;
  louvreId?: string;
  /** 0 = closed, 90 = fully open. */
  tilt?: number;
  time?: TimeOfDay;
  className?: string;
  /** Decorative by default; pass a description to expose it to assistive tech. */
  title?: string;
  /** Drop the furniture for tight crops where it would only be clutter. */
  bare?: boolean;
  /**
   * Horizontal pan in scene units. Negative values move the composition right
   * in frame, which is how the hero keeps its headline off the glass.
   */
  pan?: number;
};

export default function RoomScene({
  room = "living",
  kind = "shutter",
  variant,
  finishId = "silk-white",
  louvreId = "76",
  tilt = 45,
  time = "morning",
  className,
  title,
  bare = false,
  pan = 0,
}: SceneProps) {
  const uid = sceneKey([room, kind, variant, finishId, louvreId, Math.round(tilt), time]);
  const rawFinish = finishById(finishId);
  const louvre = louvreById(louvreId);
  const day = daylight[time];

  const { ap, floor: FLOOR_Y } = APERTURES[room];
  const AP_R = ap.x + ap.w;
  const AP_B = ap.y + ap.h;

  const state = louvreState(tilt);
  const light = roomLight(time, state.transmission);
  const surf = litSurfaces(room, time, light);

  // Rollers and romans have no louvres — the control raises and lowers them.
  const isDrop = kind === "roller" || kind === "roman" || kind === "electric";
  const drop = isDrop ? 1 - state.open : 0;
  const openness = isDrop ? 1 - drop : state.transmission;

  const id = (n: string) => `${n}-${uid}`;
  const isDay = day.id !== "night";

  /**
   * The covering has to obey the same lighting model as the walls and floor,
   * or a white shutter stays bright cream in a dark room. It is also lit from
   * the *room* side, with the sun behind it, so its faces sit a little darker
   * than the wall rather than glowing — the opposite of what an unlit fill does.
   */
  const faceLevel = 0.45 + surf.level * 0.55;
  const faceTone = (c: string) =>
    shift(mix(c, day.ambient, isDay ? 0.14 : 0.45), -0.42 + faceLevel * 0.42);

  const finish = {
    ...rawFinish,
    hex: faceTone(rawFinish.hex),
    shade: faceTone(rawFinish.shade),
    highlight: faceTone(rawFinish.highlight),
  };

  return (
    <svg
      viewBox={`${pan} 0 ${W} ${H}`}
      className={className}
      preserveAspectRatio="xMidYMid slice"
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <linearGradient id={id("sky")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={day.skyTop} />
          <stop offset="70%" stopColor={day.skyBottom} />
          <stop offset="100%" stopColor={day.horizon} />
        </linearGradient>

        {/*
          Looking at a window from inside a room, the exterior is orders of
          magnitude brighter than the interior. Eyes and cameras both expose for
          the room, so the glass blows out toward white. This bloom is what makes
          the gaps between louvres read as daylight rather than grey stripes.
        */}
        <radialGradient
          id={id("bloom")}
          cx={`${day.sunX * 100}%`}
          cy={`${day.sunY * 100}%`}
          r="88%"
        >
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={isDay ? 0.96 : 0.16} />
          <stop offset="34%" stopColor={mix("#FFFFFF", day.sun, 0.45)} stopOpacity={isDay ? 0.82 : 0.1} />
          <stop offset="72%" stopColor={day.sun} stopOpacity={isDay ? 0.46 : 0.04} />
          <stop offset="100%" stopColor={day.sun} stopOpacity={isDay ? 0.2 : 0} />
        </radialGradient>

        <linearGradient id={id("wall")} x1="0" y1="0" x2="1" y2="0.35">
          <stop offset="0%" stopColor={shift(surf.wallShadow, -0.1)} />
          <stop offset="28%" stopColor={surf.wall} />
          <stop offset="66%" stopColor={shift(surf.wall, 0.04)} />
          <stop offset="100%" stopColor={shift(surf.wallShadow, -0.14)} />
        </linearGradient>

        <linearGradient id={id("floor")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={shift(surf.floorDark, -0.08)} />
          <stop offset="22%" stopColor={surf.floor} />
          <stop offset="100%" stopColor={shift(surf.floorDark, -0.24)} />
        </linearGradient>

        <linearGradient id={id("pool")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={mix(day.sun, "#FFFFFF", 0.35)} stopOpacity="0.85" />
          <stop offset="42%" stopColor={day.sun} stopOpacity="0.42" />
          <stop offset="100%" stopColor={day.sun} stopOpacity="0" />
        </linearGradient>

        {/* A hint of reflection on the glass — not a wash over the panels. */}
        <linearGradient id={id("glass")} x1="0" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.09" />
          <stop offset="36%" stopColor="#ffffff" stopOpacity="0.015" />
          <stop offset="58%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        {/* Louvre face: catches light along the top, shadowed beneath */}
        <linearGradient id={id("slat")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={finish.highlight} />
          <stop offset="30%" stopColor={finish.hex} />
          <stop offset="100%" stopColor={finish.shade} />
        </linearGradient>

        <linearGradient id={id("frame")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={finish.highlight} />
          <stop offset="42%" stopColor={finish.hex} />
          <stop offset="100%" stopColor={finish.shade} />
        </linearGradient>

        {finish.grain && (
          <pattern id={id("grain")} width="6" height="60" patternUnits="userSpaceOnUse">
            <rect width="6" height="60" fill="none" />
            <path d="M1 0 Q3 30 1 60" stroke={rgba(finish.shade, 0.5)} strokeWidth="0.7" fill="none" />
            <path d="M4.5 0 Q2.5 26 4.5 60" stroke={rgba(finish.highlight, 0.45)} strokeWidth="0.5" fill="none" />
          </pattern>
        )}

        <radialGradient id={id("vig")} cx="50%" cy="44%" r="74%">
          <stop offset="48%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity={isDay ? 0.3 : 0.55} />
        </radialGradient>

        <filter id={id("blur")} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="26" />
        </filter>
        <filter id={id("blurSoft")} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <filter id={id("blurEdge")} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>

        <filter id={id("grainF")}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>

        <clipPath id={id("apClip")}>
          <rect x={ap.x} y={ap.y} width={ap.w} height={ap.h} />
        </clipPath>
        <clipPath id={id("floorClip")}>
          <rect x={BG_X} y={FLOOR_Y} width={BG_W} height={H - FLOOR_Y} />
        </clipPath>
        <clipPath id={id("sceneClip")}>
          <rect x={BG_X} y="0" width={BG_W} height={H} />
        </clipPath>
      </defs>

      <g clipPath={`url(#${id("sceneClip")})`}>
        {/* ---------------------------------------------------- architecture */}
        <rect x={BG_X} y="0" width={BG_W} height={FLOOR_Y} fill={`url(#${id("wall")})`} />
        <rect x={BG_X} y={FLOOR_Y} width={BG_W} height={H - FLOOR_Y} fill={`url(#${id("floor")})`} />

        {/* Ceiling shadow — stops the wall reading as a flat swatch */}
        <rect
          x={BG_X}
          y="0"
          width={BG_W}
          height="150"
          fill={rgba("#000", isDay ? 0.11 : 0.2)}
          filter={`url(#${id("blur")})`}
        />

        {/* Floorboards converging toward the viewer */}
        <g clipPath={`url(#${id("floorClip")})`} opacity="0.42">
          {[-420, -260, -110, 30, 175, 330, 500, 690].map((offset) => (
            <line
              key={offset}
              x1={W / 2 + offset * 0.45}
              y1={FLOOR_Y}
              x2={W / 2 + offset * 1.5}
              y2={H}
              stroke={shift(surf.floorDark, -0.34)}
              strokeWidth="1.5"
            />
          ))}
          <line
            x1={BG_X}
            y1={FLOOR_Y + 74}
            x2={BG_X + BG_W}
            y2={FLOOR_Y + 74}
            stroke={shift(surf.floorDark, -0.26)}
            strokeWidth="1.1"
          />
        </g>

        {/* Skirting */}
        <rect x={BG_X} y={FLOOR_Y - 27} width={BG_W} height="27" fill={surf.skirting} />
        <rect x={BG_X} y={FLOOR_Y - 27} width={BG_W} height="2.5" fill={shift(surf.skirting, 0.4)} />
        <rect x={BG_X} y={FLOOR_Y - 3} width={BG_W} height="3" fill={shift(surf.skirting, -0.35)} opacity="0.55" />

        {/* -------------------------------------------------------- aperture */}
        <g clipPath={`url(#${id("apClip")})`}>
          <rect x={ap.x} y={ap.y} width={ap.w} height={ap.h} fill={`url(#${id("sky")})`} />

          {/* Rooftops and trees, only ever a suggestion */}
          <g opacity={isDay ? 0.5 : 0.9}>
            <path
              d={`M${ap.x} ${AP_B - 92} L${ap.x + 74} ${AP_B - 92} L${ap.x + 100} ${AP_B - 130} L${ap.x + 128} ${AP_B - 92}
                  L${ap.x + 240} ${AP_B - 92} L${ap.x + 240} ${AP_B - 146} L${ap.x + 312} ${AP_B - 146}
                  L${ap.x + 312} ${AP_B - 92} L${AP_R} ${AP_B - 92} L${AP_R} ${AP_B} L${ap.x} ${AP_B} Z`}
              fill={mix(day.horizon, "#2b2f38", isDay ? 0.4 : 0.74)}
            />
            <path
              d={`M${ap.x + 340} ${AP_B - 74} q62 -48 134 0 q66 -56 160 0 L${AP_R} ${AP_B} L${ap.x + 340} ${AP_B} Z`}
              fill={mix(day.horizon, "#33402f", isDay ? 0.46 : 0.72)}
            />
          </g>

          {day.id === "night" &&
            [0, 1, 2, 3, 4].map((i) => (
              <rect
                key={i}
                x={ap.x + 40 + i * 62}
                y={AP_B - 80}
                width="13"
                height="17"
                fill="#F5D79A"
                opacity={0.5 - i * 0.07}
              />
            ))}

          {/* The blow-out. Everything above is only ever glimpsed through it. */}
          <rect x={ap.x} y={ap.y} width={ap.w} height={ap.h} fill={`url(#${id("bloom")})`} />
        </g>

        {/* --------------------------------------- daylight entering the room */}
        <LightSpill
          id={id}
          ap={ap}
          apR={AP_R}
          floorY={FLOOR_Y}
          state={state}
          day={day}
          isDrop={isDrop}
          openness={openness}
          pitch={Math.max(14, louvre.mm * 0.42)}
        />

        {/* -------------------------------------------------------- covering */}
        <g clipPath={`url(#${id("apClip")})`}>
          <Covering
            id={id}
            ap={ap}
            kind={kind}
            variant={variant}
            finish={finish}
            pitch={Math.max(14, louvre.mm * 0.42)}
            state={state}
            drop={drop}
          />

          {/* Light wrapping around the edges of the panels */}
          {isDay && openness > 0.05 && (
            <rect
              x={ap.x}
              y={ap.y}
              width={ap.w}
              height={ap.h}
              fill={`url(#${id("bloom")})`}
              opacity={0.02 + openness * 0.05}
              style={{ mixBlendMode: "screen" }}
            />
          )}
        </g>

        <rect
          x={ap.x}
          y={ap.y}
          width={ap.w}
          height={ap.h}
          fill={`url(#${id("glass")})`}
          pointerEvents="none"
        />

        {/* ------------------------------------------------ reveal and frame */}
        <g>
          <rect x={ap.x - 30} y={ap.y - 30} width={ap.w + 60} height="30" fill={shift(surf.skirting, 0.08)} />
          <rect x={ap.x - 30} y={ap.y - 30} width="30" height={ap.h + 60} fill={shift(surf.skirting, -0.04)} />
          <rect x={AP_R} y={ap.y - 30} width="30" height={ap.h + 60} fill={shift(surf.skirting, -0.16)} />
          <rect x={ap.x - 46} y={AP_B} width={ap.w + 92} height="27" fill={shift(surf.skirting, 0.18)} />
          <rect
            x={ap.x - 46}
            y={AP_B + 27}
            width={ap.w + 92}
            height="10"
            fill={rgba("#000", 0.3)}
            filter={`url(#${id("blurEdge")})`}
          />
          <rect
            x={ap.x}
            y={ap.y}
            width={ap.w}
            height={ap.h}
            fill="none"
            stroke={rgba("#000", 0.14)}
            strokeWidth="2"
          />
        </g>

        {/* ------------------------------------------------------- furniture */}
        {!bare && (
          <Furniture room={room} surf={surf} id={id} floorY={FLOOR_Y} lampsOn={day.lampsOn} />
        )}

        {/* --------------------------------------------------------- finish */}
        <rect x={BG_X} y="0" width={BG_W} height={H} fill={`url(#${id("vig")})`} pointerEvents="none" />
        <rect
          x={BG_X}
          y="0"
          width={BG_W}
          height={H}
          filter={`url(#${id("grainF")})`}
          opacity="0.06"
          style={{ mixBlendMode: "overlay" }}
          pointerEvents="none"
        />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------ light spill */

function LightSpill({
  id,
  ap,
  apR,
  floorY,
  state,
  day,
  isDrop,
  openness,
  pitch,
}: {
  id: (n: string) => string;
  ap: Aperture;
  apR: number;
  floorY: number;
  state: ReturnType<typeof louvreState>;
  day: (typeof daylight)[TimeOfDay];
  isDrop: boolean;
  openness: number;
  pitch: number;
}) {
  const strength = openness * day.intensity;
  if (strength < 0.02) return null;

  // The pool widens as it comes toward the viewer, and is thrown slightly to
  // the side the sun is on.
  const skew = (day.sunX - 0.5) * -260;
  const pool = `${ap.x + 40},${floorY} ${apR - 40},${floorY} ${apR + 210 + skew},${H} ${
    ap.x - 210 + skew
  },${H}`;

  // Louvres band the pool — the detail that sells the product.
  const bands: { y: number; h: number }[] = [];
  if (!isDrop && state.coverage > 0.08 && state.open > 0.08) {
    const projected = Math.max(20, pitch * 1.6);
    for (let y = 0; y < H - floorY; y += projected) {
      bands.push({ y: floorY + y, h: projected * state.open * 0.9 });
    }
  }

  const spread = (y: number) => (y - floorY) * 1.25;

  return (
    <g pointerEvents="none">
      {/* Glow bleeding onto the wall around the reveal */}
      <ellipse
        cx={(ap.x + apR) / 2}
        cy={ap.y + ap.h * 0.62}
        rx={ap.w * 0.88}
        ry={ap.h * 0.66}
        fill={mix(day.sun, "#ffffff", 0.4)}
        opacity={0.1 + strength * 0.26}
        filter={`url(#${id("blur")})`}
      />

      <g clipPath={`url(#${id("floorClip")})`}>
        <g filter={`url(#${id("blurSoft")})`}>
          <polygon points={pool} fill={`url(#${id("pool")})`} opacity={0.3 + strength * 0.6} />
        </g>

        <g
          opacity={0.35 + strength * 0.45}
          style={{ mixBlendMode: "screen" }}
          filter={`url(#${id("blurSoft")})`}
        >
          {bands.map((b, i) => (
            <polygon
              key={i}
              points={`${ap.x + 40 - spread(b.y) + skew},${b.y} ${apR - 40 + spread(b.y) + skew},${b.y} ${
                apR - 40 + spread(b.y + b.h) + skew
              },${b.y + b.h} ${ap.x + 40 - spread(b.y + b.h) + skew},${b.y + b.h}`}
              fill={mix(day.sun, "#ffffff", 0.3)}
              opacity="0.45"
            />
          ))}
        </g>
      </g>

      {/* Motes in the shaft — morning only, and only when it is genuinely open */}
      {day.id === "morning" && strength > 0.32 && (
        <g opacity="0.55">
          {[
            { x: ap.x + 180, y: floorY - 110, d: 0, s: 13 },
            { x: ap.x + 320, y: floorY - 160, d: 3.5, s: 17 },
            { x: ap.x + 450, y: floorY - 85, d: 6.5, s: 15 },
            { x: ap.x + 255, y: floorY - 215, d: 9, s: 19 },
            { x: ap.x + 528, y: floorY - 140, d: 1.8, s: 16 },
          ].map((m, i) => (
            <circle
              key={i}
              cx={m.x}
              cy={m.y}
              r="2.8"
              fill="#fff6dd"
              className="mote"
              style={{ ["--delay" as string]: `${m.d}s`, ["--dur" as string]: `${m.s}s` }}
            />
          ))}
        </g>
      )}
    </g>
  );
}

/* --------------------------------------------------------------- covering */

type Finish = ReturnType<typeof finishById>;

function Covering({
  id,
  ap,
  kind,
  variant,
  finish,
  pitch,
  state,
  drop,
}: {
  id: (n: string) => string;
  ap: Aperture;
  kind: ProductKind;
  variant?: string;
  finish: Finish;
  pitch: number;
  state: ReturnType<typeof louvreState>;
  drop: number;
}) {
  if (kind === "roller" || kind === "electric") {
    return <RollerBlind id={id} ap={ap} finish={finish} drop={drop} motorised={kind === "electric"} />;
  }
  if (kind === "roman") return <RomanBlind id={id} ap={ap} finish={finish} drop={drop} />;
  if (kind === "venetian" || kind === "wooden") {
    return <SlatBlind id={id} ap={ap} finish={finish} pitch={pitch} state={state} tapes={kind === "wooden"} />;
  }
  if (kind === "perfect-fit") {
    return <SlatBlind id={id} ap={ap} finish={finish} pitch={pitch * 0.75} state={state} tapes={false} inset={26} />;
  }
  return <Shutter id={id} ap={ap} finish={finish} pitch={pitch} state={state} solid={variant === "solid-panels"} />;
}

/** Plantation shutter: hinged panels in a frame. */
function Shutter({
  id,
  ap,
  finish,
  pitch,
  state,
  solid,
}: {
  id: (n: string) => string;
  ap: Aperture;
  finish: Finish;
  pitch: number;
  state: ReturnType<typeof louvreState>;
  solid: boolean;
}) {
  const FRAME = 16;
  const STILE = 24;
  const RAIL = 30;
  // Wide openings get four panels rather than two absurdly wide ones.
  const panelCount = ap.w > 620 ? 4 : 2;
  const panelW = (ap.w - FRAME * 2) / panelCount;
  const AP_R = ap.x + ap.w;
  const AP_B = ap.y + ap.h;

  return (
    <g>
      <rect x={ap.x} y={ap.y} width={ap.w} height={FRAME} fill={`url(#${id("frame")})`} />
      <rect x={ap.x} y={AP_B - FRAME} width={ap.w} height={FRAME} fill={finish.shade} />
      <rect x={ap.x} y={ap.y} width={FRAME} height={ap.h} fill={`url(#${id("frame")})`} />
      <rect x={AP_R - FRAME} y={ap.y} width={FRAME} height={ap.h} fill={finish.shade} />

      {Array.from({ length: panelCount }, (_, p) => {
        const px = ap.x + FRAME + p * panelW;
        const py = ap.y + FRAME;
        const ph = ap.h - FRAME * 2;
        const ix = px + STILE;
        const iw = panelW - STILE * 2;
        const iy = py + RAIL;
        const ih = ph - RAIL * 2;

        return (
          <g key={p}>
            {solid ? (
              <SolidPanel x={ix} y={iy} w={iw} h={ih} finish={finish} id={id} />
            ) : (
              <Louvres x={ix} y={iy} w={iw} h={ih} pitch={pitch} state={state} finish={finish} id={id} />
            )}

            {/* Stiles and rails drawn over the louvre ends */}
            <rect x={px} y={py} width={STILE} height={ph} fill={`url(#${id("frame")})`} />
            <rect x={px + panelW - STILE} y={py} width={STILE} height={ph} fill={`url(#${id("frame")})`} />
            <rect x={px} y={py} width={panelW} height={RAIL} fill={`url(#${id("frame")})`} />
            <rect x={px} y={py + ph - RAIL} width={panelW} height={RAIL} fill={`url(#${id("frame")})`} />

            <rect x={px} y={py} width={panelW} height="2" fill={finish.highlight} opacity="0.8" />
            <rect x={px + panelW - 2} y={py} width="2" height={ph} fill={finish.shade} />
            <rect
              x={px}
              y={py}
              width={panelW}
              height={ph}
              fill="none"
              stroke={rgba("#000", 0.13)}
              strokeWidth="1"
            />

            {/* Shadow each panel casts on its neighbour */}
            {p > 0 && <rect x={px} y={py} width="9" height={ph} fill={rgba("#000", 0.14)} />}

            {[0.16, 0.5, 0.84].map((f) => (
              <rect
                key={f}
                x={p % 2 === 0 ? px + 2 : px + panelW - 8}
                y={py + ph * f - 16}
                width="6"
                height="32"
                rx="1"
                fill={mix(finish.shade, "#8b8b8b", 0.5)}
              />
            ))}
          </g>
        );
      })}
    </g>
  );
}

/** Louvres inside a panel opening. */
function Louvres({
  x,
  y,
  w,
  h,
  pitch,
  state,
  finish,
  id,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  pitch: number;
  state: ReturnType<typeof louvreState>;
  finish: Finish;
  id: (n: string) => string;
}) {
  const count = Math.max(3, Math.floor(h / pitch));
  const step = h / count;

  /**
   * A louvre is a solid blade, so what you see is its width foreshortened plus
   * its thickness stood on edge: `w·cos θ + t·sin θ`. That never reaches zero —
   * fully open you are still looking at ~11mm of timber, which is exactly what
   * you see through a real shutter.
   *
   * The 1.14 on the cosine term is the overlap a closed louvre has with its
   * neighbour, and the reason a shutter seals.
   */
  const half =
    (step / 2) * (state.coverage * 1.14 + LOUVRE_THICKNESS * state.sin);

  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const cy = y + step * (i + 0.5);
        const top = cy - half;
        const height = half * 2;
        if (height < 0.4) return null;
        return (
          <g key={i}>
            <rect x={x} y={top} width={w} height={height} fill={`url(#${id("slat")})`} />
            {finish.grain && (
              <rect x={x} y={top} width={w} height={height} fill={`url(#${id("grain")})`} opacity="0.5" />
            )}
            {/* Shadow the louvre above casts onto this one */}
            <rect x={x} y={top} width={w} height={Math.min(2.6, height * 0.3)} fill={rgba("#000", 0.24)} />
            {/* Daylight rimming the leading edge */}
            <rect
              x={x}
              y={top + height - Math.min(1.8, height * 0.22)}
              width={w}
              height={Math.min(1.8, height * 0.22)}
              fill={finish.highlight}
              opacity="0.6"
            />
          </g>
        );
      })}
    </g>
  );
}

/** Georgian-style solid panel — raised mouldings, no louvres. */
function SolidPanel({
  x,
  y,
  w,
  h,
  finish,
  id,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  finish: Finish;
  id: (n: string) => string;
}) {
  const gap = 14;
  const ph = (h - gap * 3) / 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={`url(#${id("frame")})`} />
      {[0, 1].map((i) => {
        const py = y + gap + i * (ph + gap);
        return (
          <g key={i}>
            <rect x={x + gap} y={py} width={w - gap * 2} height={ph} fill={finish.shade} opacity="0.5" />
            <rect x={x + gap + 5} y={py + 5} width={w - gap * 2 - 10} height={ph - 10} fill={finish.hex} />
            <rect x={x + gap + 5} y={py + 5} width={w - gap * 2 - 10} height="2" fill={finish.highlight} />
          </g>
        );
      })}
    </g>
  );
}

/** Wooden or venetian blind — headrail, slats, bottom rail. */
function SlatBlind({
  id,
  ap,
  finish,
  pitch,
  state,
  tapes,
  inset = 0,
}: {
  id: (n: string) => string;
  ap: Aperture;
  finish: Finish;
  pitch: number;
  state: ReturnType<typeof louvreState>;
  tapes: boolean;
  inset?: number;
}) {
  const x = ap.x + inset;
  const w = ap.w - inset * 2;
  const top = ap.y + inset;
  const head = 30;
  const bottomRail = 20;
  const y = top + head;
  const h = ap.h - inset * 2 - head - bottomRail;
  const count = Math.max(4, Math.floor(h / pitch));
  const step = h / count;
  // Same blade geometry as a shutter louvre, on a thinner slat.
  const half = (step / 2) * (state.coverage * 1.12 + SLAT_THICKNESS * state.sin);

  return (
    <g>
      {inset > 0 && (
        <rect
          x={ap.x + 8}
          y={ap.y + 8}
          width={ap.w - 16}
          height={ap.h - 16}
          fill="none"
          stroke={finish.hex}
          strokeWidth="14"
        />
      )}

      <rect x={x} y={top} width={w} height={head} fill={`url(#${id("frame")})`} />
      <rect x={x} y={top} width={w} height="2" fill={finish.highlight} />
      <rect x={x} y={top + head - 3} width={w} height="3" fill={rgba("#000", 0.22)} />

      {Array.from({ length: count }, (_, i) => {
        const cy = y + step * (i + 0.5);
        const sh = half * 2;
        if (sh < 0.6) return null;
        return (
          <g key={i}>
            <rect x={x} y={cy - half} width={w} height={sh} rx={Math.min(2, sh / 2)} fill={`url(#${id("slat")})`} />
            {finish.grain && (
              <rect x={x} y={cy - half} width={w} height={sh} fill={`url(#${id("grain")})`} opacity="0.45" />
            )}
            <rect x={x} y={cy - half} width={w} height={Math.min(2, sh * 0.28)} fill={rgba("#000", 0.22)} />
          </g>
        );
      })}

      {tapes &&
        [0.24, 0.76].map((f) => (
          <rect
            key={f}
            x={x + w * f - 9}
            y={y - 4}
            width="18"
            height={h + 8}
            fill={mix(finish.hex, "#ffffff", 0.3)}
            opacity="0.88"
          />
        ))}

      {!tapes &&
        [0.22, 0.78].map((f) => (
          <line
            key={f}
            x1={x + w * f}
            y1={y}
            x2={x + w * f}
            y2={y + h}
            stroke={rgba(finish.shade, 0.75)}
            strokeWidth="1.4"
          />
        ))}

      <rect x={x} y={y + h} width={w} height={bottomRail} rx="2" fill={`url(#${id("frame")})`} />
      <rect x={x} y={y + h + bottomRail - 3} width={w} height="3" fill={rgba("#000", 0.3)} />
    </g>
  );
}

/** Roller blind on a slim cassette. */
function RollerBlind({
  id,
  ap,
  finish,
  drop,
  motorised,
}: {
  id: (n: string) => string;
  ap: Aperture;
  finish: Finish;
  drop: number;
  motorised: boolean;
}) {
  const head = 34;
  const usable = ap.h - head - 14;
  const fabricH = Math.max(0, usable * drop);
  const AP_R = ap.x + ap.w;

  return (
    <g>
      {fabricH > 4 && (
        <>
          <rect x={ap.x} y={ap.y + head} width={ap.w} height={fabricH} fill={finish.hex} opacity="0.95" />
          <rect
            x={ap.x}
            y={ap.y + head}
            width={ap.w}
            height={fabricH}
            fill={`url(#${id("slat")})`}
            opacity="0.28"
          />
          <rect x={ap.x} y={ap.y + head + fabricH - 14} width={ap.w} height="14" fill={finish.shade} rx="2" />
          <rect x={ap.x} y={ap.y + head} width={ap.w} height="6" fill={rgba("#000", 0.15)} />
        </>
      )}

      <rect x={ap.x} y={ap.y} width={ap.w} height={head} rx="3" fill={`url(#${id("frame")})`} />
      <rect x={ap.x} y={ap.y} width={ap.w} height="2" fill={finish.highlight} />
      <rect x={ap.x} y={ap.y + head - 4} width={ap.w} height="4" fill={rgba("#000", 0.26)} />

      {motorised ? (
        <g>
          <rect x={AP_R - 76} y={ap.y + 6} width="62" height={head - 12} rx="3" fill={mix(finish.shade, "#2a2a2a", 0.6)} />
          <circle cx={AP_R - 45} cy={ap.y + head / 2} r="4" fill="#C9A646" />
        </g>
      ) : (
        <line
          x1={AP_R - 26}
          y1={ap.y + head}
          x2={AP_R - 26}
          y2={ap.y + head + 150}
          stroke={rgba(finish.shade, 0.8)}
          strokeWidth="2"
        />
      )}
    </g>
  );
}

/** Roman blind — flat when down, stacked folds when raised. */
function RomanBlind({
  id,
  ap,
  finish,
  drop,
}: {
  id: (n: string) => string;
  ap: Aperture;
  finish: Finish;
  drop: number;
}) {
  const usable = ap.h - 20;
  const fabricH = Math.max(56, usable * drop);
  const folds = 5;
  const stack = Math.max(0, 1 - drop);

  return (
    <g>
      <rect x={ap.x} y={ap.y} width={ap.w} height={fabricH} fill={finish.hex} />
      <rect x={ap.x} y={ap.y} width={ap.w} height={fabricH} fill={`url(#${id("slat")})`} opacity="0.24" />

      {Array.from({ length: folds }, (_, i) => {
        const spread = fabricH * (1 - stack * 0.62);
        const fy = ap.y + 18 + (spread / folds) * i;
        if (fy > ap.y + fabricH - 8) return null;
        return (
          <g key={i}>
            <rect x={ap.x} y={fy} width={ap.w} height="12" fill={finish.shade} opacity={0.32 + stack * 0.3} />
            <rect x={ap.x} y={fy + 12} width={ap.w} height="3" fill={finish.highlight} opacity="0.55" />
          </g>
        );
      })}

      <rect x={ap.x} y={ap.y + fabricH - 8} width={ap.w} height="8" fill={finish.shade} />
      <rect
        x={ap.x}
        y={ap.y + fabricH}
        width={ap.w}
        height="12"
        fill={rgba("#000", 0.2)}
        filter={`url(#${id("blurEdge")})`}
      />
      <rect x={ap.x} y={ap.y} width={ap.w} height="10" fill={rgba("#000", 0.13)} />
    </g>
  );
}

/* -------------------------------------------------------------- furniture */

function Furniture({
  room,
  surf,
  id,
  floorY,
  lampsOn,
}: {
  room: RoomId;
  surf: ReturnType<typeof litSurfaces>;
  id: (n: string) => string;
  floorY: number;
  lampsOn: boolean;
}) {
  const dark = shift(surf.accent, -0.14);
  const soft = surf.soft;

  const glow = lampsOn && (
    <ellipse cx={128} cy={470} rx={210} ry={190} fill="#FFD9A0" opacity="0.18" filter={`url(#${id("blur")})`} />
  );

  if (room === "living") {
    return (
      <g>
        {glow}
        <ellipse cx={600} cy={H - 30} rx={480} ry={70} fill={shift(surf.floor, 0.16)} opacity="0.4" />
        {/* Sofa, cropped hard at the left edge */}
        <path
          d={`M${BG_X} ${H} L${BG_X} 566 q0 -24 26 -24 L196 542 q26 0 26 24 L222 ${H} Z`}
          fill={dark}
        />
        <path d={`M${BG_X} 604 L222 604 L222 632 L${BG_X} 632 Z`} fill={shift(dark, 0.12)} />
        <rect x="10" y="500" width="126" height="48" rx="11" fill={shift(soft, -0.06)} />
        {/* Side table and lamp */}
        <rect x="1024" y="506" width="156" height="10" rx="3" fill={dark} />
        <rect x="1046" y="516" width="8" height={floorY - 516} fill={shift(dark, -0.12)} />
        <rect x="1150" y="516" width="8" height={floorY - 516} fill={shift(dark, -0.12)} />
        <path d="M1066 506 L1082 432 L1136 432 L1152 506 Z" fill={lampsOn ? "#F6DFB4" : soft} />
        {/* Potted fig — a soft mass, not a wire diagram */}
        <g fill={shift(surf.accent, -0.26)}>
          <path
            d={`M986 ${floorY - 20} q-2 -70 -6 -104 M986 ${floorY - 20} q4 -84 22 -118 M986 ${floorY - 20} q10 -60 44 -86`}
            stroke={shift(surf.accent, -0.3)}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          <ellipse cx={958} cy={floorY - 132} rx={30} ry={20} transform={`rotate(-24 958 ${floorY - 132})`} />
          <ellipse cx={1012} cy={floorY - 156} rx={33} ry={22} transform={`rotate(18 1012 ${floorY - 156})`} />
          <ellipse cx={966} cy={floorY - 196} rx={28} ry={19} transform={`rotate(-12 966 ${floorY - 196})`} />
          <ellipse cx={1034} cy={floorY - 112} rx={27} ry={18} transform={`rotate(34 1034 ${floorY - 112})`} />
          <ellipse cx={1006} cy={floorY - 224} rx={24} ry={16} transform={`rotate(6 1006 ${floorY - 224})`} />
        </g>
        <path d={`M952 ${floorY - 22} h70 l-11 66 h-48 Z`} fill={shift(soft, -0.26)} />
        <rect x={948} y={floorY - 30} width={78} height={12} rx={2} fill={shift(soft, -0.16)} />
      </g>
    );
  }

  if (room === "bedroom") {
    return (
      <g>
        {glow}
        <ellipse cx={600} cy={H - 24} rx={450} ry={62} fill={shift(surf.floor, 0.18)} opacity="0.36" />
        {/* Bed, cropped at the left */}
        <rect x="-60" y="516" width="350" height="28" rx="9" fill={dark} />
        <rect x="-60" y="544" width="350" height={H - 544} fill={shift(dark, 0.1)} />
        <rect x="-40" y="474" width="148" height="46" rx="17" fill={shift(soft, 0.08)} />
        <rect x="94" y="480" width="138" height="42" rx="16" fill={soft} />
        {/* Reading lamp */}
        <rect x="1052" y="468" width="126" height="8" rx="3" fill={dark} />
        <rect x="1066" y="476" width="7" height={floorY - 476} fill={shift(dark, -0.14)} />
        <rect x="1156" y="476" width="7" height={floorY - 476} fill={shift(dark, -0.14)} />
        {lampsOn && <circle cx="1114" cy="446" r="23" fill="#F8E3B8" opacity="0.9" />}
      </g>
    );
  }

  if (room === "kitchen") {
    return (
      <g>
        {glow}
        {/*
          One continuous run of units under the window, with the sink set into
          the worktop. The tap has to rise from that worktop — previously the
          units stopped either side of the window and the tap floated in the
          gap between them.
        */}
        <rect x={BG_X} y={floorY - 212} width={BG_W} height={212} fill={shift(soft, -0.16)} />
        <rect x={BG_X} y={floorY - 224} width={BG_W} height="16" rx="2" fill={shift(surf.skirting, 0.26)} />
        <rect x={BG_X} y={floorY - 224} width={BG_W} height="3" fill={shift(surf.skirting, 0.45)} />

        {/* Cupboard doors, skipping the run the sink sits over */}
        {[-260, -110, 40, 760, 910, 1060].map((x) => (
          <g key={x}>
            <rect
              x={x}
              y={floorY - 200}
              width="132"
              height="180"
              rx="2"
              fill="none"
              stroke={rgba("#000", 0.12)}
            />
            <rect x={x + 96} y={floorY - 176} width="26" height="4" rx="2" fill={rgba("#000", 0.32)} />
          </g>
        ))}

        {/* Sink, recessed into the worktop */}
        <rect x="470" y={floorY - 208} width="260" height="14" rx="3" fill={rgba("#000", 0.22)} />
        <rect x="482" y={floorY - 206} width="236" height="9" rx="3" fill={shift(soft, -0.34)} />

        {/* Mixer tap, rising from the worktop behind the sink */}
        <path
          d={`M600 ${floorY - 222} v-58 q0 -22 26 -22 h30`}
          stroke={dark}
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="600" cy={floorY - 222} r="9" fill={dark} />
        <ellipse cx={600} cy={H - 26} rx={430} ry={58} fill={shift(surf.floor, 0.14)} opacity="0.3" />
      </g>
    );
  }

  if (room === "bathroom") {
    return (
      <g>
        {glow}
        {/* Tiled floor */}
        <g opacity="0.26">
          {[floorY + 44, floorY + 96, floorY + 158].map((y) => (
            <line key={y} x1="0" y1={y} x2={W} y2={y} stroke={shift(surf.floorDark, -0.32)} strokeWidth="1.4" />
          ))}
        </g>
        {/* Freestanding bath under the window */}
        <path
          d={`M280 ${H - 74} q-14 -112 100 -116 h440 q114 4 100 116 Z`}
          fill={shift("#FFFFFF", -0.04)}
          opacity="0.95"
        />
        <path d={`M280 ${H - 74} h640 q-8 46 -62 48 H342 q-54 -2 -62 -48 Z`} fill={shift(soft, -0.12)} />

        {/*
          A floor-standing filler beside the bath. It used to start inside the
          bath body, which read as a stray black angle rather than a tap.
        */}
        <g stroke={dark} fill="none" strokeLinecap="round">
          <path d={`M968 ${H - 44} v-192 q0 -26 -28 -26 h-38`} strokeWidth="7" />
        </g>
        <ellipse cx="968" cy={H - 42} rx="26" ry="7" fill={dark} />
      </g>
    );
  }

  return (
    <g>
      {glow}
      <ellipse cx={600} cy={H - 26} rx={460} ry={60} fill={shift(surf.floor, 0.14)} opacity="0.32" />
      {/* Desk across the window */}
      <rect x="160" y={floorY - 68} width="880" height="16" rx="3" fill={shift(surf.accent, -0.08)} />
      <rect x="192" y={floorY - 52} width="12" height="52" fill={shift(dark, -0.16)} />
      <rect x="996" y={floorY - 52} width="12" height="52" fill={shift(dark, -0.16)} />
      {/* Monitor */}
      <rect x="502" y={floorY - 190} width="250" height="116" rx="5" fill={shift(dark, -0.32)} />
      <rect x="510" y={floorY - 182} width="234" height="100" rx="2" fill={lampsOn ? "#2C3A4D" : shift(soft, -0.32)} />
      <rect x="614" y={floorY - 74} width="26" height="10" fill={shift(dark, -0.22)} />
      {/* Chair back */}
      <rect x="-30" y="480" width="158" height="190" rx="28" fill={dark} />
    </g>
  );
}
