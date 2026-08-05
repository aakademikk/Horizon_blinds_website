"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { areas, site } from "@/lib/site";

/**
 * An illustrative coverage map — a stylised rendering of the patch we work,
 * not a survey drawing. Town positions are plotted from real coordinates; the
 * coastline is drawn for character rather than accuracy.
 */

const BOUNDS = { west: 0.22, east: 0.78, north: 51.8, south: 51.5 };
const VB = { w: 800, h: 520 };

const project = (lat: number, lng: number) => ({
  x: ((lng - BOUNDS.west) / (BOUNDS.east - BOUNDS.west)) * VB.w,
  y: ((BOUNDS.north - lat) / (BOUNDS.north - BOUNDS.south)) * VB.h,
});

const TOWNS = [
  { slug: "chelmsford", name: "Chelmsford", lat: 51.7356, lng: 0.4685 },
  { slug: "canvey-island", name: "Canvey Island", lat: 51.5209, lng: 0.5892 },
  { slug: "basildon", name: "Basildon", lat: 51.5761, lng: 0.4886 },
  { slug: "rayleigh", name: "Rayleigh", lat: 51.5865, lng: 0.6045 },
  { slug: "leigh-on-sea", name: "Leigh-on-Sea", lat: 51.5424, lng: 0.6433 },
  { slug: "southend-on-sea", name: "Southend-on-Sea", lat: 51.5459, lng: 0.7077 },
];

export default function CoverageMap() {
  const [hover, setHover] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const active = areas.find((a) => a.slug === hover);

  return (
    <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
      <figure className="relative overflow-hidden border border-line bg-[#F2F0E9]">
        <svg viewBox={`0 0 ${VB.w} ${VB.h}`} className="w-full" role="img" aria-label="Map of the Essex towns we cover">
          <defs>
            <linearGradient id="land" x1="0" y1="0" x2="0.6" y2="1">
              <stop offset="0%" stopColor="#EFEDE4" />
              <stop offset="100%" stopColor="#E4E0D3" />
            </linearGradient>
            <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#DFE7E9" />
              <stop offset="100%" stopColor="#CFDBDF" />
            </linearGradient>
            <radialGradient id="reach" cx="46%" cy="52%" r="52%">
              <stop offset="0%" stopColor="#2F9BD8" stopOpacity="0.18" />
              <stop offset="70%" stopColor="#2F9BD8" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#2F9BD8" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width={VB.w} height={VB.h} fill="url(#water)" />

          {/* Landmass */}
          <path
            d="M-20 -20 H820 V150 q-60 30 -130 46 q-90 20 -150 62 q-70 48 -168 62 q-84 12 -150 44 q-60 30 -132 34 q-56 3 -90 -8 Z"
            fill="url(#land)"
          />
          <path
            d="M820 150 q-60 30 -130 46 q-90 20 -150 62 q-70 48 -168 62 q-84 12 -150 44 q-60 30 -132 34"
            fill="none"
            stroke="#C3BFB0"
            strokeWidth="1.5"
          />

          {/* The estuary, and the Kent shore beyond it */}
          <path d="M470 520 q140 -70 350 -96 V520 Z" fill="#DDE5E7" opacity="0.6" />

          {/* Coverage halo */}
          <ellipse cx={430} cy={300} rx={330} ry={215} fill="url(#reach)" />
          <ellipse
            cx={430}
            cy={300}
            rx={330}
            ry={215}
            fill="none"
            stroke="#2F9BD8"
            strokeOpacity="0.35"
            strokeWidth="1"
            strokeDasharray="3 7"
          />

          {/* Roads, suggested rather than drawn */}
          <g stroke="#D3CFC0" strokeWidth="2" fill="none" opacity="0.9">
            <path d="M60 330 Q220 300 355 112" />
            <path d="M122 310 Q260 360 384 388" />
            <path d="M384 388 Q470 380 549 370" />
            <path d="M549 370 Q580 410 605 447" />
            <path d="M605 447 H697" />
          </g>

          {TOWNS.map((t, i) => {
            const { x, y } = project(t.lat, t.lng);
            const isHome = t.slug === "canvey-island";
            const on = hover === t.slug;

            return (
              <motion.g
                key={t.slug}
                initial={reduce ? false : { opacity: 0, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: `${x}px ${y}px` }}
                onMouseEnter={() => setHover(t.slug)}
                onMouseLeave={() => setHover(null)}
                className="cursor-pointer"
              >
                {on && <circle cx={x} cy={y} r="26" fill="#2F9BD8" opacity="0.16" />}
                <circle
                  cx={x}
                  cy={y}
                  r={isHome ? 8 : 6}
                  fill={isHome ? "#0B2739" : on ? "#2F9BD8" : "#FFFFFF"}
                  stroke="#2F9BD8"
                  strokeWidth="2"
                />
                {isHome && <circle cx={x} cy={y} r="2.6" fill="#2F9BD8" />}
                <text
                  x={x}
                  y={y - 15}
                  textAnchor="middle"
                  fontFamily="var(--font-inter), sans-serif"
                  fontSize="12.5"
                  fontWeight={on || isHome ? 600 : 500}
                  fill={on ? "#A8842F" : "#3A382F"}
                  letterSpacing="0.03em"
                >
                  {t.name}
                </text>
              </motion.g>
            );
          })}

          <text
            x={700}
            y={505}
            textAnchor="middle"
            fontFamily="var(--font-inter), sans-serif"
            fontSize="10"
            fill="#9AA6A9"
            letterSpacing="0.2em"
          >
            THAMES ESTUARY
          </text>
        </svg>

        <figcaption className="border-t border-line bg-section px-6 py-4 text-[0.75rem] text-muted">
          Illustrative coverage map. Our workshop is marked in {site.address.locality} — we travel
          across Essex and into east London daily.
        </figcaption>
      </figure>

      {/* -------------------------------------------------------- area list */}
      <div>
        <h3 className="eyebrow text-faint">Areas Covered</h3>
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {areas.map((a) => (
            <li key={a.slug}>
              <Link
                href={`/areas/${a.slug}`}
                onMouseEnter={() => setHover(a.slug)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(a.slug)}
                onBlur={() => setHover(null)}
                className="group flex items-baseline justify-between gap-6 py-4 transition-colors duration-500"
              >
                <span className="font-display text-[1.25rem] font-light text-ink transition-colors duration-500 group-hover:text-brand-deep">
                  {a.name}
                </span>
                <span className="shrink-0 text-[0.75rem] text-faint" data-tnum>
                  {a.postcodes.join(" · ")}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <motion.p
          key={active?.slug ?? "none"}
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mt-7 min-h-[5.5rem] text-[0.875rem] leading-[1.8] text-muted"
        >
          {active
            ? active.character
            : "Hover a town to see what we tend to fit there — or open an area page for the full picture, including the postcodes we cover and the products that suit those houses."}
        </motion.p>
      </div>
    </div>
  );
}
