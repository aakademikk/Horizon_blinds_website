"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import SceneImage from "@/components/scene/SceneImage";
import { galleryCategories, galleryItems, type GalleryItem } from "@/lib/presets";

/**
 * Column-flow masonry rather than a row-span grid: with mixed aspect ratios a
 * `row-span` grid leaves large holes wherever a tall item does not divide
 * evenly into the row height. Columns pack tight and never gap.
 */
const SPAN: Record<GalleryItem["span"], string> = {
  tall: "aspect-[4/5]",
  wide: "aspect-[16/10]",
  normal: "aspect-[4/3]",
};

export default function GalleryGrid({
  limit,
  showFilters = true,
}: {
  limit?: number;
  showFilters?: boolean;
}) {
  const [category, setCategory] = useState<(typeof galleryCategories)[number]>("All");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduce = useReducedMotion();

  const filtered = galleryItems.filter((g) => category === "All" || g.category === category);
  const shown = limit ? filtered.slice(0, limit) : filtered;

  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setOpenIndex((i) => (i === null ? null : (i + dir + shown.length) % shown.length)),
    [shown.length],
  );

  return (
    <>
      {showFilters && (
        <div className="mb-10 flex flex-wrap gap-2" role="tablist" aria-label="Gallery categories">
          {galleryCategories.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={category === c}
              onClick={() => {
                setCategory(c);
                setOpenIndex(null);
              }}
              className={[
                "border px-5 py-2.5 text-[0.75rem] tracking-[0.08em] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                category === c
                  ? "border-ink bg-ink text-white"
                  : "border-line text-muted hover:border-brand hover:text-brand-deep",
              ].join(" ")}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        <AnimatePresence mode="popLayout">
          {shown.map((item, i) => (
            <motion.button
              key={item.id}
              type="button"
              initial={reduce ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setOpenIndex(i)}
              aria-label={`View ${item.title}, ${item.location}`}
              className={`group sheen relative mb-4 block w-full break-inside-avoid overflow-hidden bg-ink text-left ${SPAN[item.span]}`}
            >
              <div className="absolute inset-0 transition-transform duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]">
                <SceneImage {...item.scene} className="size-full" />
              </div>

              <span
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.15)_42%,transparent_70%)] opacity-70 transition-opacity duration-700 group-hover:opacity-95"
              />

              <span className="absolute inset-x-0 bottom-0 z-10 p-6">
                <span className="eyebrow block text-brand-light opacity-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100">
                  {item.category}
                </span>
                <span className="mt-2 block font-display text-[1.375rem] font-light leading-tight text-white">
                  {item.title}
                </span>
                <span className="mt-1.5 block text-[0.8125rem] text-white/60">{item.location}</span>
              </span>

              <span className="absolute right-4 top-4 z-10 grid size-10 place-items-center border border-white/25 bg-black/25 text-white opacity-0 backdrop-blur-sm transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100">
                <Maximize2 className="size-4" strokeWidth={1.4} />
              </span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <Lightbox
        items={shown}
        index={openIndex}
        onClose={close}
        onStep={step}
        reduce={!!reduce}
      />
    </>
  );
}

/* -------------------------------------------------------------- lightbox */

function Lightbox({
  items,
  index,
  onClose,
  onStep,
  reduce,
}: {
  items: GalleryItem[];
  index: number | null;
  onClose: () => void;
  onStep: (dir: 1 | -1) => void;
  reduce: boolean;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = index !== null;

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onStep(1);
      if (e.key === "ArrowLeft") onStep(-1);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, onStep]);

  const item = index !== null ? items[index] : null;

  return (
    <AnimatePresence>
      {open && item && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${item.title} — ${item.location}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[80] flex flex-col bg-ink/97 backdrop-blur-xl"
          onClick={onClose}
        >
          <div className="flex shrink-0 items-center justify-between px-6 py-5 md:px-10">
            <span className="eyebrow text-white/65" data-tnum>
              {(index ?? 0) + 1} / {items.length}
            </span>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close gallery"
              className="grid size-11 place-items-center border border-white/20 text-white transition-colors duration-500 hover:border-brand hover:text-brand-light"
            >
              <X className="size-5" strokeWidth={1.3} />
            </button>
          </div>

          <div
            className="flex min-h-0 flex-1 items-center gap-4 px-4 pb-4 md:gap-8 md:px-10"
            onClick={(e) => e.stopPropagation()}
          >
            <LightboxArrow dir={-1} onClick={() => onStep(-1)} />

            <motion.figure
              key={item.id}
              initial={reduce ? false : { opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="relative min-h-0 flex-1 overflow-hidden border border-white/10">
                <SceneImage {...item.scene} className="size-full" alt={item.title} />
              </div>
              <figcaption className="flex flex-col gap-2 pt-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <span className="eyebrow text-brand">{item.category}</span>
                  <h3 className="display-md mt-2 text-white">{item.title}</h3>
                  <p className="mt-1.5 text-[0.875rem] text-white/55">{item.location}</p>
                </div>
                <p className="max-w-md text-[0.875rem] leading-relaxed text-white/60">{item.detail}</p>
              </figcaption>
            </motion.figure>

            <LightboxArrow dir={1} onClick={() => onStep(1)} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function LightboxArrow({ dir, onClick }: { dir: 1 | -1; onClick: () => void }) {
  const Icon = dir === 1 ? ChevronRight : ChevronLeft;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === 1 ? "Next image" : "Previous image"}
      className="grid size-12 shrink-0 place-items-center border border-white/15 text-white/70 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-brand hover:text-brand-light md:size-14"
    >
      <Icon className="size-5" strokeWidth={1.2} />
    </button>
  );
}
