"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import { useId, useState } from "react";

export type AccordionItem = { q: string; a: string; group?: string };

export default function Accordion({
  items,
  className,
  defaultOpen = null,
}: {
  items: AccordionItem[];
  className?: string;
  defaultOpen?: number | null;
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const reduce = useReducedMotion();
  const baseId = useId().replace(/[:]/g, "");

  return (
    <div className={["divide-y divide-line border-y border-line", className].filter(Boolean).join(" ")}>
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `${baseId}-panel-${i}`;
        const btnId = `${baseId}-btn-${i}`;

        return (
          <div key={item.q}>
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-start justify-between gap-8 py-7 text-left transition-colors duration-500 hover:text-gold-deep md:py-8"
              >
                <span className="display-md max-w-[52ch] !text-[clamp(1.125rem,1.7vw,1.5rem)] leading-snug">
                  {item.q}
                </span>
                <span
                  aria-hidden
                  className="mt-1 grid size-9 shrink-0 place-items-center rounded-full border border-line transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-gold group-hover:bg-gold/8"
                >
                  <Plus
                    className={`size-4 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isOpen ? "rotate-[135deg]" : ""
                    }`}
                    strokeWidth={1.25}
                  />
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduce ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-[68ch] pb-9 pr-12 text-[0.9375rem] leading-[1.85] text-muted">
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
