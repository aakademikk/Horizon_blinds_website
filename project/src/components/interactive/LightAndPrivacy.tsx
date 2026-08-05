"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { Eye, EyeOff, Sun } from "lucide-react";
import RoomScene from "@/components/scene/RoomScene";
import Reveal from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Type";
import { louvreState, roomLight, timesOfDay, type TimeOfDay } from "@/lib/scene";

/**
 * Two demonstrations sharing one scene: how the light changes through the day,
 * and what happens to privacy as the louvres close.
 */
export default function LightAndPrivacy() {
  const [time, setTime] = useState<TimeOfDay>("morning");
  const [tilt, setTilt] = useState(58);
  const reduce = useReducedMotion();

  const state = useMemo(() => louvreState(tilt), [tilt]);
  const light = roomLight(time, state.transmission);
  const active = timesOfDay.find((t) => t.id === time)!;

  return (
    <section id="light" className="section-y bg-paper texture-paper">
      <div className="shell">
        <Reveal>
          <SectionHeading
            eyebrow="Light & Privacy"
            align="center"
            title={
              <>
                A shutter is a dimmer switch
                <br />
                for daylight.
              </>
            }
            lede="Move the sun through the day, then close the louvres and watch what happens to the room. This is the argument for shutters, made better than any photograph could."
          />
        </Reveal>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-12">
          {/* --------------------------------------------------------- scene */}
          <figure className="relative aspect-[16/10] overflow-hidden border border-line bg-ink shadow-[0_40px_90px_-50px_rgba(35,27,12,0.55)]">
            <RoomScene
              room="living"
              kind="shutter"
              finishId="silk-white"
              louvreId="76"
              tilt={tilt}
              time={time}
              className="size-full"
              title={`Living room at ${active.label.toLowerCase()}, louvres ${Math.round(
                state.open * 100,
              )} per cent open`}
            />

            {/* Read-outs float over the scene like an instrument panel */}
            <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-6 bg-[linear-gradient(to_top,rgba(0,0,0,0.78),transparent)] p-6 pt-20">
              <div>
                <span className="eyebrow text-brand-light">{active.label}</span>
                <p className="mt-1.5 text-[0.9375rem] text-white/70" data-tnum>
                  {active.clock}
                </p>
              </div>
              <dl className="flex gap-8">
                <Metric icon={Sun} label="Light in the room" value={`${Math.round(light * 100)}%`} />
                <Metric
                  icon={state.privacy > 0.55 ? EyeOff : Eye}
                  label="Privacy"
                  value={state.privacyLabel}
                />
              </dl>
            </figcaption>
          </figure>

          {/* ------------------------------------------------------ controls */}
          <div className="flex flex-col justify-center gap-10">
            {/* Time of day */}
            <div>
              <h3 className="eyebrow text-faint">Time of day</h3>
              <div role="radiogroup" aria-label="Time of day" className="mt-5 grid grid-cols-2 gap-2">
                {timesOfDay.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    role="radio"
                    aria-checked={time === t.id}
                    onClick={() => setTime(t.id)}
                    className={[
                      "group relative overflow-hidden border px-4 py-4 text-left transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      time === t.id
                        ? "border-brand bg-section shadow-soft"
                        : "border-line bg-transparent hover:border-brand/45 hover:bg-section",
                    ].join(" ")}
                  >
                    {/* A sliver of that sky as a colour cue */}
                    <span
                      aria-hidden
                      className="absolute inset-y-0 left-0 w-1 transition-all duration-600"
                      style={{
                        background: `linear-gradient(to bottom, ${t.skyTop}, ${t.skyBottom})`,
                        opacity: time === t.id ? 1 : 0.4,
                      }}
                    />
                    <span className="block pl-2 text-[0.875rem] text-ink">{t.label}</span>
                    <span className="mt-0.5 block pl-2 text-[0.75rem] text-muted" data-tnum>
                      {t.clock}
                    </span>
                  </button>
                ))}
              </div>
              <motion.p
                key={time}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
                className="mt-5 text-[0.875rem] leading-relaxed text-muted"
              >
                {active.note}
              </motion.p>
            </div>

            {/* Privacy simulator */}
            <div className="border-t border-line pt-9">
              <div className="flex items-baseline justify-between">
                <label htmlFor="privacy-tilt" className="eyebrow text-faint">
                  Louvre position
                </label>
                <span className="text-[0.8125rem] text-brand-deep" data-tnum>
                  {Math.round(state.open * 100)}% open
                </span>
              </div>
              <input
                id="privacy-tilt"
                type="range"
                min={0}
                max={90}
                step={1}
                value={tilt}
                onChange={(e) => setTilt(Number(e.target.value))}
                className="rail mt-5"
                aria-valuetext={`${Math.round(state.open * 100)} per cent open, ${state.privacyLabel} privacy`}
              />
              <div className="mt-3 flex justify-between text-[0.6875rem] uppercase tracking-[0.16em] text-faint">
                <span>Closed</span>
                <span>Open</span>
              </div>

              <dl className="mt-8 space-y-5">
                <Bar label="Daylight admitted" value={state.transmission} caption={state.lightLabel} />
                <Bar label="Privacy from the street" value={state.privacy} caption={state.privacyLabel} />
                <Bar
                  label="Heat retained"
                  value={state.insulation}
                  caption={state.insulation > 0.8 ? "Excellent" : state.insulation > 0.6 ? "Good" : "Moderate"}
                />
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-[0.625rem] uppercase tracking-[0.18em] text-white/65">
        <Icon className="size-3.5" strokeWidth={1.4} />
        {label}
      </dt>
      <dd className="mt-1 text-[0.9375rem] text-white/90" data-tnum>
        {value}
      </dd>
    </div>
  );
}

/**
 * `dt` and `dd` must be direct children of the wrapping `div` inside a `dl`,
 * so the row is laid out with grid rather than nested flex containers.
 */
function Bar({ label, value, caption }: { label: string; value: number; caption: string }) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-baseline gap-x-4">
      <dt className="text-[0.8125rem] text-body">{label}</dt>
      <dd className="text-right text-[0.75rem] text-muted">{caption}</dd>
      <dd className="col-span-2 mt-2 h-[3px] w-full overflow-hidden bg-line">
        <motion.span
          className="block h-full origin-left bg-gradient-to-r from-brand-deep to-brand-light"
          animate={{ scaleX: Math.max(0.02, value) }}
          initial={false}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </dd>
    </div>
  );
}
