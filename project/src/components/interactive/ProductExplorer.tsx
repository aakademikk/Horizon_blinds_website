"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { ArrowRight, Info } from "lucide-react";
import RoomScene from "@/components/scene/RoomScene";
import Reveal from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Type";
import { CtaLink } from "@/components/ui/Cta";
import {
  estimate,
  finishes,
  gbp,
  louvres,
  products,
  rooms,
  type ProductKind,
  type RoomId,
} from "@/lib/products";
import { louvreState } from "@/lib/scene";

/** Products offered in the explorer, in the order we would present them. */
const CHOICES = [
  "full-height",
  "tier-on-tier",
  "cafe-style",
  "solid-panels",
  "wooden",
  "venetian",
  "roman",
  "roller",
] as const;

const KIND_OF: Record<string, ProductKind> = {
  "full-height": "shutter",
  "tier-on-tier": "shutter",
  "cafe-style": "shutter",
  "solid-panels": "shutter",
  wooden: "wooden",
  venetian: "venetian",
  roman: "roman",
  roller: "roller",
};

export default function ProductExplorer() {
  const [room, setRoom] = useState<RoomId>("living");
  const [productId, setProductId] = useState<string>("full-height");
  const [finishId, setFinishId] = useState("silk-white");
  const [louvreId, setLouvreId] = useState("76");
  const [tilt, setTilt] = useState(52);
  const reduce = useReducedMotion();

  const roomData = rooms.find((r) => r.id === room)!;
  const product = products.find((p) => p.id === productId)!;
  const kind = KIND_OF[productId];
  const hasLouvres = kind === "shutter" || kind === "wooden" || kind === "venetian";
  const isSolid = productId === "solid-panels";

  const state = useMemo(() => louvreState(isSolid ? 0 : tilt), [tilt, isSolid]);

  const price = useMemo(() => {
    const area = roomData.typicalArea;
    const h = Math.sqrt(area / 0.75);
    const w = area / h;
    return estimate({
      productId,
      widthCm: Math.round(w * 100),
      heightCm: Math.round(h * 100),
      finishId,
      louvreId,
    });
  }, [roomData.typicalArea, productId, finishId, louvreId]);

  const readouts = [
    {
      label: "Daylight",
      value: isSolid ? "Blacked out" : state.lightLabel,
      fill: isSolid ? 0.02 : state.transmission,
    },
    {
      label: "Privacy",
      value: isSolid ? "Complete" : state.privacyLabel,
      fill: isSolid ? 1 : state.privacy,
    },
    {
      label: "Maintenance",
      value: ["Demanding", "Occasional", "Easy", "Very easy", "Wipe and forget"][
        product.scores.maintenance - 1
      ],
      fill: product.scores.maintenance / 5,
    },
    {
      label: "Insulation",
      value: ["Minimal", "Modest", "Good", "Very good", "Exceptional"][product.scores.insulation - 1],
      fill: product.scores.insulation / 5,
    },
  ];

  return (
    <section id="explorer" className="section-y bg-ink text-white">
      <div className="shell">
        <Reveal>
          <SectionHeading
            eyebrow="The Explorer"
            tone="light"
            align="center"
            title={
              <>
                Design it here.
                <br />
                We will build it exactly.
              </>
            }
            lede="Choose a room, a product and a finish. Everything on the right — light, privacy, upkeep and the estimated investment — moves with you."
          />
        </Reveal>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
          {/* -------------------------------------------------------- scene */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <figure className="relative aspect-[4/3] overflow-hidden border border-white/10 bg-black">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${room}-${productId}-${finishId}-${louvreId}`}
                  initial={reduce ? false : { opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <RoomScene
                    room={room}
                    kind={kind}
                    variant={isSolid ? "solid-panels" : undefined}
                    finishId={finishId}
                    louvreId={louvreId}
                    tilt={isSolid ? 0 : tilt}
                    time="morning"
                    className="size-full"
                    title={`${roomData.name} with ${product.name.toLowerCase()} in ${
                      finishes.find((f) => f.id === finishId)?.name
                    }`}
                  />
                </motion.div>
              </AnimatePresence>

              <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-x-4 gap-y-1 bg-[linear-gradient(to_top,rgba(0,0,0,0.8),transparent)] px-6 pb-5 pt-16 text-[0.75rem] tracking-[0.06em] text-white/70">
                <span className="text-gold-light">{roomData.name}</span>
                <span aria-hidden className="text-white/25">/</span>
                <span>{product.name}</span>
                <span aria-hidden className="text-white/25">/</span>
                <span>{finishes.find((f) => f.id === finishId)?.name}</span>
                {hasLouvres && !isSolid && (
                  <>
                    <span aria-hidden className="text-white/25">/</span>
                    <span data-tnum>{louvres.find((l) => l.id === louvreId)?.label}</span>
                  </>
                )}
              </figcaption>
            </figure>

            {/* Louvre angle — the control that makes the scene come alive */}
            {!isSolid && (
              <div className="mt-6 border border-white/10 bg-white/[0.03] p-6">
                <div className="flex items-baseline justify-between">
                  <label htmlFor="explorer-tilt" className="eyebrow text-white/65">
                    Louvre angle
                  </label>
                  <span className="text-[0.8125rem] text-gold-light" data-tnum>
                    {Math.round(tilt)}° · {state.lightLabel.toLowerCase()}
                  </span>
                </div>
                <input
                  id="explorer-tilt"
                  type="range"
                  min={0}
                  max={90}
                  step={1}
                  value={tilt}
                  onChange={(e) => setTilt(Number(e.target.value))}
                  className="rail mt-5 !bg-white/15"
                  aria-valuetext={`${Math.round(tilt)} degrees, ${state.lightLabel}`}
                />
                <div className="mt-3 flex justify-between text-[0.6875rem] uppercase tracking-[0.16em] text-white/60">
                  <span>Closed</span>
                  <span>Open</span>
                </div>
              </div>
            )}
          </div>

          {/* ----------------------------------------------------- controls */}
          <div className="flex flex-col gap-10">
            {/* Room */}
            <Control label="Room" step="01">
              <div role="radiogroup" aria-label="Room" className="flex flex-wrap gap-2">
                {rooms.map((r) => (
                  <Pill
                    key={r.id}
                    selected={room === r.id}
                    onClick={() => setRoom(r.id)}
                    label={r.name}
                  />
                ))}
              </div>
              <p className="mt-4 text-[0.875rem] leading-relaxed text-white/65">{roomData.blurb}</p>
            </Control>

            {/* Product */}
            <Control label="Product" step="02">
              <div role="radiogroup" aria-label="Product" className="grid grid-cols-2 gap-2">
                {CHOICES.map((id) => {
                  const p = products.find((x) => x.id === id)!;
                  const recommended = roomData.recommends.includes(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      role="radio"
                      aria-checked={productId === id}
                      onClick={() => setProductId(id)}
                      className={[
                        "relative border px-4 py-3.5 text-left text-[0.8125rem] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        productId === id
                          ? "border-gold bg-gold/12 text-white"
                          : "border-white/12 text-white/65 hover:border-white/35 hover:text-white",
                      ].join(" ")}
                    >
                      {p.name.replace(" Shutters", "").replace(" Blinds", "")}
                      {recommended && (
                        <span
                          className="absolute right-2.5 top-2.5 size-1.5 rounded-full bg-gold"
                          title="Recommended for this room"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="mt-4 flex items-start gap-2 text-[0.75rem] leading-relaxed text-white/62">
                <span aria-hidden className="mt-[0.4em] size-1.5 shrink-0 rounded-full bg-gold" />
                <span>
                  Marked options are what we would put forward first for a{" "}
                  {roomData.name.toLowerCase()}.
                </span>
              </p>
            </Control>

            {/* Finish */}
            <Control label="Finish" step="03">
              <div role="radiogroup" aria-label="Finish" className="flex flex-wrap gap-3">
                {finishes.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    role="radio"
                    aria-checked={finishId === f.id}
                    aria-label={f.name}
                    title={f.name}
                    onClick={() => setFinishId(f.id)}
                    className={[
                      "group relative size-11 rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      finishId === f.id
                        ? "ring-2 ring-gold ring-offset-4 ring-offset-ink"
                        : "ring-1 ring-white/20 hover:ring-white/50 hover:ring-offset-2 hover:ring-offset-ink",
                    ].join(" ")}
                    style={{
                      background: f.grain
                        ? `repeating-linear-gradient(115deg, ${f.hex} 0 5px, ${f.shade} 5px 7px)`
                        : `linear-gradient(150deg, ${f.highlight}, ${f.hex} 45%, ${f.shade})`,
                    }}
                  />
                ))}
              </div>
              <p className="mt-4 text-[0.875rem] text-white/65">
                <span className="text-white/85">{finishes.find((f) => f.id === finishId)?.name}</span>
                {" — "}
                {finishes.find((f) => f.id === finishId)?.note}
              </p>
            </Control>

            {/* Louvre size */}
            {hasLouvres && !isSolid && (
              <Control label="Louvre size" step="04">
                <div role="radiogroup" aria-label="Louvre size" className="flex flex-wrap gap-2">
                  {louvres.map((l) => (
                    <Pill
                      key={l.id}
                      selected={louvreId === l.id}
                      onClick={() => setLouvreId(l.id)}
                      label={l.label}
                    />
                  ))}
                </div>
                <p className="mt-4 text-[0.875rem] leading-relaxed text-white/65">
                  {louvres.find((l) => l.id === louvreId)?.note}
                </p>
              </Control>
            )}

            {/* --------------------------------------------------- readouts */}
            <div className="border-t border-white/10 pt-9">
              <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                {readouts.map((r) => (
                  <div key={r.label}>
                    <div className="flex items-baseline justify-between">
                      <span className="eyebrow text-white/62">{r.label}</span>
                      <span className="text-[0.8125rem] text-white/85">{r.value}</span>
                    </div>
                    <div className="mt-2.5 h-[3px] w-full overflow-hidden bg-white/10">
                      <motion.div
                        className="h-full bg-gradient-to-r from-gold-deep to-gold-light"
                        animate={{ scaleX: Math.max(0.02, r.fill) }}
                        initial={false}
                        style={{ transformOrigin: "left" }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* ----------------------------------------------- estimate */}
              <div className="mt-10 border border-white/10 bg-white/[0.03] p-7">
                <span className="eyebrow text-white/62">Estimated investment</span>
                <p className="mt-3 flex items-baseline gap-2">
                  <motion.span
                    key={price.total}
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="display-lg !text-[2.5rem] text-white"
                    data-tnum
                  >
                    {gbp(price.low)}–{gbp(price.high)}
                  </motion.span>
                </p>
                <p className="mt-3 flex items-start gap-2 text-[0.75rem] leading-relaxed text-white/62">
                  <Info className="mt-0.5 size-3.5 shrink-0" strokeWidth={1.5} />
                  <span>
                    Indicative only, for one typical {roomData.name.toLowerCase()} window of about{" "}
                    <span data-tnum>{roomData.typicalArea}m²</span>, supplied and fitted. A survey
                    produces the real figure.
                  </span>
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <CtaLink href="/contact#survey" variant="gold" className="flex-1">
                    Book Free Survey
                  </CtaLink>
                  <CtaLink href="/design-studio" variant="outline" className="flex-1 text-white">
                    More Tools
                    <ArrowRight className="size-3.5" strokeWidth={1.5} />
                  </CtaLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ parts */

function Control({
  label,
  step,
  children,
}: {
  label: string;
  step: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <span className="text-[0.6875rem] tracking-[0.2em] text-gold">{step}</span>
        <span aria-hidden className="h-px w-6 bg-white/20" />
        <h3 className="eyebrow text-white/70">{label}</h3>
      </div>
      {children}
    </div>
  );
}

function Pill({
  selected,
  onClick,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={[
        "border px-5 py-2.5 text-[0.8125rem] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
        selected
          ? "border-gold bg-gold/12 text-white"
          : "border-white/12 text-white/60 hover:border-white/35 hover:text-white",
      ].join(" ")}
    >
      <span data-tnum>{label}</span>
    </button>
  );
}
