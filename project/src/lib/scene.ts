/**
 * The lighting model behind every rendered room on this site.
 *
 * Rather than shipping photographs — which cannot rotate their louvres — the
 * interactive sections draw a parametric SVG interior. This module holds the
 * colour maths and the physical-ish relationships between louvre angle, light
 * transmission and privacy, so the visualiser, the privacy simulator, the
 * light demo and the colour selector all agree with one another.
 */

import type { RoomId } from "./products";

export type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

/* ------------------------------------------------------------ colour utils */

type RGB = { r: number; g: number; b: number };

export function hexToRgb(hex: string): RGB {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

const clamp = (n: number, min = 0, max = 255) => Math.min(max, Math.max(min, n));

export function rgbToHex({ r, g, b }: RGB): string {
  const to = (n: number) => clamp(Math.round(n)).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

/** Linear blend. `amount` 0 returns `a`, 1 returns `b`. */
export function mix(a: string, b: string, amount: number): string {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  const t = Math.min(1, Math.max(0, amount));
  return rgbToHex({
    r: A.r + (B.r - A.r) * t,
    g: A.g + (B.g - A.g) * t,
    b: A.b + (B.b - A.b) * t,
  });
}

/** Multiply toward black (`amount` < 0) or white (`amount` > 0). */
export function shift(hex: string, amount: number): string {
  return amount >= 0 ? mix(hex, "#ffffff", amount) : mix(hex, "#000000", -amount);
}

export function rgba(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${alpha})`;
}

/* ------------------------------------------------------------- daylight */

export type Daylight = {
  id: TimeOfDay;
  label: string;
  clock: string;
  /** One-line description shown beside the control. */
  note: string;
  skyTop: string;
  skyBottom: string;
  /** Horizon accent — distant rooftops, sea, trees. */
  horizon: string;
  /** Colour of direct sunlight entering the room. */
  sun: string;
  /** 0–1. How strong the exterior light is. */
  intensity: number;
  /** Horizontal position of the sun within the aperture, 0 left → 1 right. */
  sunX: number;
  /** Vertical position, 0 top → 1 horizon. */
  sunY: number;
  /** Colour the interior surfaces drift toward. */
  ambient: string;
  /** Warm interior lighting switched on. */
  lampsOn: boolean;
};

export const daylight: Record<TimeOfDay, Daylight> = {
  morning: {
    id: "morning",
    label: "Morning",
    clock: "7:30am",
    note: "Low eastern sun. Tilt the louvres up and it washes the ceiling.",
    skyTop: "#A9C8DE",
    skyBottom: "#F6E2BB",
    horizon: "#D9C9AE",
    sun: "#FFDCA0",
    intensity: 0.88,
    sunX: 0.7,
    sunY: 0.62,
    ambient: "#FFF0D6",
    lampsOn: false,
  },
  afternoon: {
    id: "afternoon",
    label: "Afternoon",
    clock: "1:00pm",
    note: "High, bright and neutral. The hardest light to control.",
    skyTop: "#8FBBDC",
    skyBottom: "#D9E9F3",
    horizon: "#BCCBD3",
    sun: "#FFF8E7",
    intensity: 1,
    sunX: 0.5,
    sunY: 0.18,
    ambient: "#FBF8F1",
    lampsOn: false,
  },
  evening: {
    id: "evening",
    label: "Evening",
    clock: "7:45pm",
    note: "Long amber light at eye level — where glare becomes a problem.",
    skyTop: "#7C5A79",
    skyBottom: "#E9976A",
    horizon: "#C9705E",
    sun: "#FFB877",
    intensity: 0.6,
    sunX: 0.28,
    sunY: 0.74,
    ambient: "#F6D2AE",
    lampsOn: true,
  },
  night: {
    id: "night",
    label: "Night",
    clock: "10:30pm",
    note: "Now the question reverses: who can see in?",
    skyTop: "#0B1220",
    skyBottom: "#1D2E49",
    horizon: "#2A3E5C",
    sun: "#8FA8CE",
    intensity: 0.12,
    sunX: 0.78,
    sunY: 0.3,
    ambient: "#3C4257",
    lampsOn: true,
  },
};

export const timesOfDay = Object.values(daylight);

/* --------------------------------------------------------- louvre physics */

const rad = (deg: number) => (deg * Math.PI) / 180;

/**
 * Derived read-outs for a given louvre angle.
 *
 * `tilt` is degrees from closed: 0° the louvre faces sit flat against the
 * window and overlap; 90° they are edge-on and the aperture is clear.
 */
/**
 * Louvre thickness as a fraction of its width. A 76mm blade is roughly 11mm
 * through the middle, and that is what you still see edge-on at 90°.
 */
export const LOUVRE_THICKNESS = 0.15;
export const SLAT_THICKNESS = 0.07;

export function louvreState(tilt: number) {
  const t = Math.min(90, Math.max(0, tilt));
  /** Fraction of the aperture the louvre faces still cover. */
  const coverage = Math.cos(rad(t));
  const open = 1 - coverage;

  return {
    tilt: t,
    coverage,
    open,
    /** Needed for the edge-on thickness term when drawing a blade. */
    sin: Math.sin(rad(t)),
    /** 0–1 light admitted. Slightly eased so mid-angles read naturally. */
    transmission: Math.pow(open, 0.82),
    /** 0–1 privacy from the street. */
    privacy: Math.pow(coverage, 0.7),
    /** 0–1 insulation benefit — best fully closed. */
    insulation: 0.45 + coverage * 0.55,
    /** Human labels. */
    privacyLabel: labelFor(Math.pow(coverage, 0.7), ["Open to view", "Partial", "Screened", "Private", "Complete"]),
    lightLabel: labelFor(Math.pow(open, 0.82), ["Blacked out", "Dim", "Soft", "Bright", "Full daylight"]),
  };
}

function labelFor(v: number, labels: string[]) {
  const i = Math.min(labels.length - 1, Math.floor(v * labels.length));
  return labels[i];
}

/**
 * How much light actually reaches the room: the exterior light available,
 * scaled by what the covering lets through.
 */
export function roomLight(time: TimeOfDay, transmission: number) {
  const d = daylight[time];
  return d.intensity * (0.14 + transmission * 0.86);
}

/* ------------------------------------------------------------ room decor */

export type RoomPalette = {
  wall: string;
  wallShadow: string;
  floor: string;
  floorDark: string;
  accent: string;
  /** Secondary furnishing tone. */
  soft: string;
  skirting: string;
};

export const roomPalettes: Record<RoomId, RoomPalette> = {
  living: {
    wall: "#EBE5DA",
    wallShadow: "#D6CEC0",
    floor: "#B08655",
    floorDark: "#8A6640",
    accent: "#3F4A46",
    soft: "#C9BDA9",
    skirting: "#F3EFE7",
  },
  bedroom: {
    wall: "#E7E3DC",
    wallShadow: "#CFC9BF",
    floor: "#9C7F63",
    floorDark: "#7A6049",
    accent: "#4A4E5C",
    soft: "#D5CCC0",
    skirting: "#F4F1EB",
  },
  kitchen: {
    wall: "#EFEDE7",
    wallShadow: "#D8D5CC",
    floor: "#C4BDB0",
    floorDark: "#A39B8D",
    accent: "#2F3A3C",
    soft: "#DCD6C8",
    skirting: "#F7F5F0",
  },
  bathroom: {
    wall: "#E9EDEC",
    wallShadow: "#D0D6D5",
    floor: "#CFD4D3",
    floorDark: "#AEB5B4",
    accent: "#3A4A4E",
    soft: "#DEE4E3",
    skirting: "#F5F8F7",
  },
  office: {
    wall: "#E4E2DC",
    wallShadow: "#CBC8C0",
    floor: "#A8845C",
    floorDark: "#836444",
    accent: "#33383F",
    soft: "#CFC7B8",
    skirting: "#F1EFE9",
  },
};

/**
 * Surface colours for a room under a given light level, so walls and floors
 * darken together as the sun goes down.
 */
export function litSurfaces(room: RoomId, time: TimeOfDay, light: number) {
  const p = roomPalettes[room];
  const d = daylight[time];

  // Interior lamps stop night scenes collapsing to black.
  const lamp = d.lampsOn ? 0.3 : 0;
  const level = Math.min(1, light * 0.85 + lamp);

  const tone = (base: string) => {
    const warmed = mix(base, d.ambient, d.id === "night" ? 0.55 : 0.28);
    return shift(warmed, -0.52 + level * 0.62);
  };

  return {
    wall: tone(p.wall),
    wallShadow: tone(p.wallShadow),
    floor: tone(p.floor),
    floorDark: tone(p.floorDark),
    accent: tone(p.accent),
    soft: tone(p.soft),
    skirting: tone(p.skirting),
    level,
    daylight: d,
  };
}
