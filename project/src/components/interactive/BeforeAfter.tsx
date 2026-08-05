"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MoveHorizontal } from "lucide-react";
import SceneImage from "@/components/scene/SceneImage";
import Reveal from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Type";
import type { ScenePreset } from "@/lib/presets";

const BEFORE: ScenePreset = {
  room: "living",
  kind: "roller",
  finishId: "white",
  louvreId: "63",
  // A fully raised roller leaves the glass bare — glare and no privacy.
  tilt: 90,
  time: "afternoon",
};

const AFTER: ScenePreset = {
  room: "living",
  kind: "shutter",
  finishId: "silk-white",
  louvreId: "76",
  tilt: 44,
  time: "afternoon",
};

export default function BeforeAfter() {
  return (
    <section className="section-y bg-section">
      <div className="shell">
        <Reveal>
          <SectionHeading
            eyebrow="Before & After"
            align="center"
            title="The same room, twice."
            lede="Drag the handle. On the left, bare glass at one o'clock in the afternoon. On the right, the same window with 76mm louvres doing their work."
          />
        </Reveal>

        <Reveal delay={0.15} className="mt-14">
          <Slider />
        </Reveal>
      </div>
    </section>
  );
}

function Slider() {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, next)));
  }, []);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (!dragging.current) return;
      e.preventDefault();
      setFromClientX(e.clientX);
    };
    const up = () => {
      dragging.current = false;
    };

    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [setFromClientX]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const stepBy = e.shiftKey ? 10 : 3;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPos((p) => Math.max(0, p - stepBy));
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setPos((p) => Math.min(100, p + stepBy));
    }
    if (e.key === "Home") setPos(0);
    if (e.key === "End") setPos(100);
  };

  return (
    <div
      ref={ref}
      className="relative aspect-[16/10] w-full touch-none select-none overflow-hidden border border-line bg-ink shadow-[0_40px_100px_-55px_rgba(35,27,12,0.6)]"
      onPointerDown={(e) => {
        dragging.current = true;
        setFromClientX(e.clientX);
      }}
    >
      {/* After — the full-width base layer */}
      <div className="absolute inset-0">
        <SceneImage {...AFTER} className="size-full" alt="After: the same living room with plantation shutters fitted" />
      </div>

      {/* Before — clipped to the left of the handle */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        aria-hidden={pos < 4}
      >
        <SceneImage {...BEFORE} className="size-full" alt="Before: bare glass with no window covering" />
      </div>

      {/* Labels */}
      <span
        className="pointer-events-none absolute left-5 top-5 border border-white/25 bg-black/35 px-4 py-2 text-[0.625rem] uppercase tracking-[0.22em] text-white backdrop-blur-sm transition-opacity duration-500"
        style={{ opacity: pos > 16 ? 1 : 0 }}
      >
        Before
      </span>
      <span
        className="pointer-events-none absolute right-5 top-5 border border-brand/50 bg-black/35 px-4 py-2 text-[0.625rem] uppercase tracking-[0.22em] text-brand-light backdrop-blur-sm transition-opacity duration-500"
        style={{ opacity: pos < 84 ? 1 : 0 }}
      >
        After
      </span>

      {/* Handle */}
      <div
        className="pointer-events-none absolute inset-y-0 z-10 w-px bg-white/85 shadow-[0_0_24px_rgba(0,0,0,0.5)]"
        style={{ left: `${pos}%` }}
      >
        <button
          type="button"
          role="slider"
          aria-label="Compare before and after"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          aria-valuetext={`${Math.round(pos)} per cent showing the room before shutters`}
          aria-orientation="horizontal"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onPointerDown={(e) => {
            e.stopPropagation();
            dragging.current = true;
          }}
          className="pointer-events-auto absolute left-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-full border border-white/70 bg-ink/85 text-white backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 hover:border-brand hover:text-brand-light"
        >
          <MoveHorizontal className="size-5" strokeWidth={1.3} />
        </button>
      </div>
    </div>
  );
}
