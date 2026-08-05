"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Info, Minus, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import RoomScene from "@/components/scene/RoomScene";
import { CtaLink } from "@/components/ui/Cta";
import {
  estimate,
  finishes,
  gbp,
  louvres,
  motorisationUplift,
  products,
  type ProductKind,
} from "@/lib/products";

const WINDOW_TYPES = [
  { id: "standard", label: "Standard", w: 120, h: 130, note: "Square or rectangular" },
  { id: "large", label: "Large", w: 180, h: 200, note: "Picture window or patio" },
  { id: "bay", label: "Bay", w: 260, h: 140, note: "Three or five panel" },
  { id: "small", label: "Small", w: 60, h: 90, note: "Landing, cloakroom, en suite" },
] as const;

const KIND_OF: Record<string, ProductKind> = {
  "full-height": "shutter",
  "tier-on-tier": "shutter",
  "cafe-style": "shutter",
  "bay-window": "shutter",
  tracked: "shutter",
  "solid-panels": "shutter",
  wooden: "wooden",
  venetian: "venetian",
  roman: "roman",
  roller: "roller",
  "perfect-fit": "perfect-fit",
  electric: "electric",
};

export default function QuoteEstimator() {
  const [type, setType] = useState<(typeof WINDOW_TYPES)[number]["id"]>("standard");
  const [width, setWidth] = useState(120);
  const [height, setHeight] = useState(130);
  const [productId, setProductId] = useState("full-height");
  const [finishId, setFinishId] = useState("silk-white");
  const [louvreId, setLouvreId] = useState("76");
  const [motorised, setMotorised] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const reduce = useReducedMotion();

  const product = products.find((p) => p.id === productId)!;
  const kind = KIND_OF[productId];
  const hasLouvres = kind === "shutter" && productId !== "solid-panels";

  const quote = useMemo(
    () =>
      estimate({
        productId,
        widthCm: width,
        heightCm: height,
        finishId,
        louvreId,
        motorised,
        quantity,
      }),
    [productId, width, height, finishId, louvreId, motorised, quantity],
  );

  function pickType(id: (typeof WINDOW_TYPES)[number]["id"]) {
    const t = WINDOW_TYPES.find((x) => x.id === id)!;
    setType(id);
    setWidth(t.w);
    setHeight(t.h);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:gap-14">
      {/* ------------------------------------------------------------ inputs */}
      <div className="flex flex-col gap-9">
        <Group label="Window type">
          <div role="radiogroup" aria-label="Window type" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {WINDOW_TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={type === t.id}
                onClick={() => pickType(t.id)}
                className={[
                  "border px-4 py-3.5 text-left transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  type === t.id ? "border-brand bg-brand/[0.08]" : "border-line hover:border-brand/50",
                ].join(" ")}
              >
                <span className="block text-[0.875rem] text-ink">{t.label}</span>
                <span className="mt-0.5 block text-[0.6875rem] leading-tight text-muted">
                  {t.note}
                </span>
              </button>
            ))}
          </div>
        </Group>

        <Group label="Measurements">
          <div className="grid gap-7 sm:grid-cols-2">
            <Dimension id="q-width" label="Width" value={width} min={40} max={320} onChange={setWidth} />
            <Dimension id="q-height" label="Drop" value={height} min={40} max={280} onChange={setHeight} />
          </div>
          <p className="mt-4 text-[0.75rem] text-muted" data-tnum>
            Approximately {quote.areaM2}m² per window. Measure the recess, not the glass — we will
            check everything at the survey.
          </p>
        </Group>

        <Group label="Product">
          <div role="radiogroup" aria-label="Product" className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {products.map((p) => (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={productId === p.id}
                onClick={() => setProductId(p.id)}
                className={[
                  "border px-4 py-3 text-left text-[0.8125rem] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  productId === p.id
                    ? "border-brand bg-brand/[0.08] text-ink"
                    : "border-line text-muted hover:border-brand/50 hover:text-ink",
                ].join(" ")}
              >
                {p.name.replace(" Shutters", "").replace(" Blinds", "")}
              </button>
            ))}
          </div>
        </Group>

        <Group label="Finish">
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
                  "size-10 rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  finishId === f.id
                    ? "ring-2 ring-brand ring-offset-4 ring-offset-white"
                    : "ring-1 ring-line hover:ring-brand/60",
                ].join(" ")}
                style={{
                  background: f.grain
                    ? `repeating-linear-gradient(115deg, ${f.hex} 0 5px, ${f.shade} 5px 7px)`
                    : `linear-gradient(150deg, ${f.highlight}, ${f.hex} 45%, ${f.shade})`,
                }}
              />
            ))}
          </div>
        </Group>

        {hasLouvres && (
          <Group label="Louvre size">
            <div role="radiogroup" aria-label="Louvre size" className="flex flex-wrap gap-2">
              {louvres.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  role="radio"
                  aria-checked={louvreId === l.id}
                  onClick={() => setLouvreId(l.id)}
                  className={[
                    "border px-5 py-2.5 text-[0.8125rem] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    louvreId === l.id
                      ? "border-brand bg-brand/[0.08] text-ink"
                      : "border-line text-muted hover:border-brand/50 hover:text-ink",
                  ].join(" ")}
                >
                  <span data-tnum>{l.label}</span>
                </button>
              ))}
            </div>
          </Group>
        )}

        <Group label="Options">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={motorised}
                onChange={(e) => setMotorised(e.target.checked)}
                className="size-4 accent-[#2F9BD8]"
              />
              <span className="text-[0.875rem] text-ink">
                Motorised
                <span className="ml-2 text-[0.75rem] text-muted" data-tnum>
                  +{Math.round(motorisationUplift * 100)}%
                </span>
              </span>
            </label>

            <div className="flex items-center gap-3">
              <span className="text-[0.875rem] text-ink">Windows</span>
              <div className="flex items-center border border-line">
                <Stepper label="Fewer windows" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                  <Minus className="size-3.5" strokeWidth={1.6} />
                </Stepper>
                <span className="min-w-10 px-2 text-center text-[0.9375rem] text-ink" data-tnum>
                  {quantity}
                </span>
                <Stepper label="More windows" onClick={() => setQuantity((q) => Math.min(40, q + 1))}>
                  <Plus className="size-3.5" strokeWidth={1.6} />
                </Stepper>
              </div>
            </div>
          </div>
        </Group>
      </div>

      {/* ---------------------------------------------------------- read-out */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="overflow-hidden border border-line bg-section">
          <div className="relative aspect-[4/3] bg-ink">
            <RoomScene
              room="living"
              kind={kind}
              variant={productId === "solid-panels" ? "solid-panels" : undefined}
              finishId={finishId}
              louvreId={louvreId}
              tilt={productId === "solid-panels" ? 0 : 50}
              time="morning"
              className="size-full"
            />
          </div>

          <div className="p-8">
            <span className="eyebrow text-faint">Estimated investment</span>
            <motion.p
              key={quote.total}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="mt-3 font-display text-[2.75rem] font-light leading-none text-ink"
              data-tnum
            >
              {gbp(quote.low)}–{gbp(quote.high)}
            </motion.p>
            {quantity > 1 && (
              <p className="mt-3 text-[0.8125rem] text-muted" data-tnum>
                About {gbp(quote.perWindow)} per window across {quantity}
              </p>
            )}

            <dl className="mt-8 space-y-3 border-t border-line pt-7 text-[0.8125rem]">
              <Row label="Product" value={product.name} />
              <Row label="Size" value={`${width} × ${height} cm`} />
              <Row label="Finish" value={finishes.find((f) => f.id === finishId)!.name} />
              {hasLouvres && (
                <Row label="Louvre" value={louvres.find((l) => l.id === louvreId)!.label} />
              )}
              <Row label="Operation" value={motorised ? "Motorised" : "Manual"} />
            </dl>

            <p className="mt-7 flex items-start gap-2 text-[0.75rem] leading-relaxed text-faint">
              <Info className="mt-0.5 size-3.5 shrink-0" strokeWidth={1.5} />
            <span>
              An estimate, supplied and fitted, not a quotation. Bays, out-of-square reveals and
              specialist shapes are priced at survey.</span>
          </p>

            <CtaLink href="/contact#survey" variant="ink" className="mt-7 w-full">
              Get an Exact Quote
            </CtaLink>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ parts */

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="eyebrow mb-5 text-faint">{label}</h3>
      {children}
    </div>
  );
}

function Dimension({
  id,
  label,
  value,
  min,
  max,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-[0.8125rem] text-muted">
          {label}
        </label>
        <span className="text-[0.9375rem] text-ink" data-tnum>
          {value} cm
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="rail mt-4"
      />
    </div>
  );
}

function Stepper({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid size-9 place-items-center text-muted transition-colors duration-400 hover:text-brand-deep"
    >
      {children}
    </button>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right text-ink" data-tnum>
        {value}
      </dd>
    </div>
  );
}
