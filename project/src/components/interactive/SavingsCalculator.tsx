"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Info } from "lucide-react";
import { gbp, rooms } from "@/lib/products";
import { CtaLink } from "@/components/ui/Cta";

/**
 * Indicative energy modelling.
 *
 * The 51% figure is the widely cited upper bound for heat-loss reduction from a
 * closed shutter panel against single glazing; we treat it as a ceiling and
 * subtract whatever the visitor already has at the window. Every number shown
 * is labelled as an estimate.
 */
const BASE_LOSS_PER_WINDOW = 26; // £ per year, typical UK home
const SHUTTER_RETENTION = 0.51;

const EXISTING = [
  { id: "none", label: "Nothing at all", retention: 0, note: "Bare glass" },
  { id: "curtains", label: "Curtains", retention: 0.14, note: "Lined, floor length" },
  { id: "blinds", label: "Blinds", retention: 0.12, note: "Roller or venetian" },
  { id: "old", label: "Tired shutters", retention: 0.3, note: "Ill-fitting or ageing" },
] as const;

const ROOM_FACTOR: Record<string, number> = {
  living: 1.15,
  bedroom: 1,
  kitchen: 0.85,
  bathroom: 0.6,
  office: 0.95,
};

const GRID = "#E8E4DB";
const SERIES = "#A8842F";
const INK = "#222222";
const MUTED = "#666666";

export default function SavingsCalculator() {
  const [windows, setWindows] = useState(8);
  const [room, setRoom] = useState("living");
  const [existing, setExisting] = useState<(typeof EXISTING)[number]["id"]>("curtains");

  const model = useMemo(() => {
    const current = EXISTING.find((e) => e.id === existing)!;
    const factor = ROOM_FACTOR[room] ?? 1;
    const gain = Math.max(0, SHUTTER_RETENTION - current.retention);

    const annual = windows * BASE_LOSS_PER_WINDOW * factor * gain;
    const series = Array.from({ length: 11 }, (_, year) => ({
      year,
      label: year === 0 ? "Now" : `Yr ${year}`,
      // A modest 4% annual energy-price drift, compounded.
      saving: Math.round(
        Array.from({ length: year }, (_, i) => annual * Math.pow(1.04, i)).reduce(
          (a, b) => a + b,
          0,
        ),
      ),
    }));

    return {
      annual: Math.round(annual),
      tenYear: series[10].saving,
      retention: Math.round(SHUTTER_RETENTION * 100),
      uplift: Math.round(gain * 100),
      current,
      series,
    };
  }, [windows, room, existing]);

  return (
    <div className="grid gap-10 lg:grid-cols-[380px_1fr] lg:gap-14">
      {/* ------------------------------------------------------------ inputs */}
      <div className="flex flex-col gap-9">
        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="calc-windows" className="eyebrow text-faint">
              Number of windows
            </label>
            <span className="text-[0.9375rem] text-ink" data-tnum>
              {windows}
            </span>
          </div>
          <input
            id="calc-windows"
            type="range"
            min={1}
            max={30}
            value={windows}
            onChange={(e) => setWindows(Number(e.target.value))}
            className="rail mt-5"
          />
          <div className="mt-3 flex justify-between text-[0.6875rem] uppercase tracking-[0.16em] text-faint">
            <span>1</span>
            <span>30</span>
          </div>
        </div>

        <div>
          <h3 className="eyebrow text-faint">Room type</h3>
          <div role="radiogroup" aria-label="Room type" className="mt-5 flex flex-wrap gap-2">
            {rooms.map((r) => (
              <button
                key={r.id}
                type="button"
                role="radio"
                aria-checked={room === r.id}
                onClick={() => setRoom(r.id)}
                className={[
                  "border px-4 py-2.5 text-[0.8125rem] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  room === r.id
                    ? "border-gold bg-gold/[0.08] text-ink"
                    : "border-line text-muted hover:border-gold/50 hover:text-ink",
                ].join(" ")}
              >
                {r.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="eyebrow text-faint">At the window today</h3>
          <div role="radiogroup" aria-label="Current window coverings" className="mt-5 grid gap-2">
            {EXISTING.map((e) => (
              <button
                key={e.id}
                type="button"
                role="radio"
                aria-checked={existing === e.id}
                onClick={() => setExisting(e.id)}
                className={[
                  "flex items-baseline justify-between gap-4 border px-5 py-3.5 text-left transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  existing === e.id
                    ? "border-gold bg-gold/[0.08]"
                    : "border-line hover:border-gold/50",
                ].join(" ")}
              >
                <span className="text-[0.875rem] text-ink">{e.label}</span>
                <span className="text-[0.75rem] text-faint">{e.note}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------- results */}
      <div>
        {/* Headline numbers are tiles, not chart marks */}
        <dl className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
          <Tile
            label="Estimated saving"
            value={gbp(model.annual)}
            unit="per year"
          />
          <Tile
            label="Over ten years"
            value={gbp(model.tenYear)}
            unit="cumulative"
          />
          <Tile
            label="Heat retained"
            value={`${model.retention}%`}
            unit={`up from ${Math.round(model.current.retention * 100)}%`}
          />
        </dl>

        {/* ------------------------------------------------------- the chart */}
        <figure className="mt-8 border border-line bg-section p-6 md:p-8">
          <figcaption className="mb-1 text-[0.9375rem] text-ink">
            Cumulative energy saving, {model.current.label.toLowerCase()} to plantation shutters
          </figcaption>
          <p className="mb-7 text-[0.75rem] text-muted">
            Assumes a 4% annual drift in energy prices. Estimate only.
          </p>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={model.series}
                margin={{ top: 8, right: 56, bottom: 4, left: 4 }}
              >
                <defs>
                  <linearGradient id="savingFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={SERIES} stopOpacity={0.24} />
                    <stop offset="100%" stopColor={SERIES} stopOpacity={0.02} />
                  </linearGradient>
                </defs>

                <CartesianGrid stroke={GRID} strokeDasharray="0" vertical={false} />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={{ stroke: GRID }}
                  tick={{ fill: MUTED, fontSize: 11 }}
                  interval={1}
                  dy={6}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: MUTED, fontSize: 11 }}
                  width={62}
                  tickFormatter={(v: number) => gbp(v)}
                />
                <Tooltip
                  cursor={{ stroke: GRID, strokeWidth: 1 }}
                  content={<SavingTooltip />}
                />
                <Area
                  type="monotone"
                  dataKey="saving"
                  stroke={SERIES}
                  strokeWidth={2}
                  fill="url(#savingFill)"
                  activeDot={{ r: 5, fill: SERIES, stroke: "#fff", strokeWidth: 2 }}
                  isAnimationActive
                  animationDuration={800}
                />
                {/* Direct label on the one point that matters */}
                <ReferenceDot
                  x="Yr 10"
                  y={model.tenYear}
                  r={4}
                  fill={SERIES}
                  stroke="#fff"
                  strokeWidth={2}
                  label={{
                    value: gbp(model.tenYear),
                    position: "right",
                    fill: INK,
                    fontSize: 12,
                    offset: 10,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* The same data, readable without the chart */}
          <details className="mt-6 border-t border-line pt-5">
            <summary className="cursor-pointer text-[0.8125rem] text-muted transition-colors duration-400 hover:text-ink">
              View as a table
            </summary>
            <div className="mt-4 overflow-x-auto no-scrollbar">
              <table className="w-full min-w-[420px] text-left text-[0.8125rem]">
                <caption className="sr-only">
                  Cumulative estimated energy saving by year
                </caption>
                <thead>
                  <tr className="border-b border-line text-muted">
                    <th scope="col" className="py-2 pr-6 font-normal">
                      Year
                    </th>
                    <th scope="col" className="py-2 font-normal">
                      Cumulative saving
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {model.series.slice(1).map((row) => (
                    <tr key={row.year} className="border-b border-line/60">
                      <th scope="row" className="py-2 pr-6 font-normal text-muted">
                        {row.year}
                      </th>
                      <td className="py-2 text-ink" data-tnum>
                        {gbp(row.saving)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </figure>

        <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex max-w-md items-start gap-2 text-[0.75rem] leading-relaxed text-faint">
            <Info className="mt-0.5 size-3.5 shrink-0" strokeWidth={1.5} />
            An illustration, not a guarantee. Actual savings depend on glazing, orientation,
            insulation and how you use the room. Shutters also stay with the property as a fitted
            improvement.
          </p>
          <CtaLink href="/contact#survey" variant="ink" size="sm" className="shrink-0">
            Book Free Survey
          </CtaLink>
        </div>
      </div>
    </div>
  );
}

function Tile({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="bg-section p-6">
      <dt className="eyebrow text-faint">{label}</dt>
      <dd className="mt-3 font-display text-[2.125rem] font-light leading-none text-ink" data-tnum>
        {value}
      </dd>
      <dd className="mt-2 text-[0.75rem] text-muted">{unit}</dd>
    </div>
  );
}

function SavingTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="border border-line bg-section px-4 py-3 shadow-soft">
      <p className="text-[0.6875rem] uppercase tracking-[0.16em] text-faint">{label}</p>
      <p className="mt-1.5 text-[0.9375rem] text-ink" data-tnum>
        {gbp(payload[0].value)}
      </p>
      <p className="mt-0.5 text-[0.6875rem] text-muted">saved to date</p>
    </div>
  );
}
