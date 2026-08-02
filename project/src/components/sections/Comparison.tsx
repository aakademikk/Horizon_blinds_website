"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import Reveal from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Type";
import { compareMetrics } from "@/lib/content";

const COLUMNS = [
  { id: "curtains", label: "Curtains", note: "Soft, but blunt" },
  { id: "blinds", label: "Blinds", note: "Practical and versatile" },
  { id: "shutters", label: "Plantation Shutters", note: "The long game" },
] as const;

export default function Comparison() {
  const [active, setActive] = useState(compareMetrics[0].id);
  const reduce = useReducedMotion();
  const current = compareMetrics.find((m) => m.id === active)!;

  return (
    <section className="section-y bg-section">
      <div className="shell">
        <Reveal>
          <SectionHeading
            eyebrow="Why Shutters"
            title={
              <>
                We sell all three.
                <br />
                This is still how they compare.
              </>
            }
            lede="Curtains and blinds have their place, and we fit plenty of both. But on the measures most people care about, a properly made shutter is difficult to argue with."
          />
        </Reveal>

        {/* The table needs its own scroll on narrow screens — and a visible
            scrollbar, so people know it is there. */}
        <p className="mt-16 text-[0.75rem] text-muted md:hidden" aria-hidden>
          Scroll the table sideways to compare →
        </p>
        {/* `relative` matters: an overflow container only clips descendants whose
            containing block is inside it, and the score bars are absolutely
            positioned. Without it they escape and widen the whole document. */}
        <div
          className="relative mt-4 overflow-x-auto md:mt-16"
          tabIndex={0}
          role="group"
          aria-label="Comparison table, scrollable"
        >
          <table className="w-full min-w-[720px] border-collapse">
            <caption className="sr-only">
              Curtains, blinds and plantation shutters compared across six measures, scored out of
              five.
            </caption>
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="w-[26%] py-6 text-left align-bottom">
                  <span className="eyebrow text-faint">Measure</span>
                </th>
                {COLUMNS.map((c) => (
                  <th key={c.id} scope="col" className="w-[24.6%] py-6 text-left align-bottom">
                    <span
                      className={`block font-display text-[1.25rem] font-light md:text-[1.5rem] ${
                        c.id === "shutters" ? "text-gold-deep" : "text-ink"
                      }`}
                    >
                      {c.label}
                    </span>
                    <span className="mt-1 block text-[0.75rem] text-muted">{c.note}</span>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {compareMetrics.map((m) => (
                <tr
                  key={m.id}
                  onMouseEnter={() => setActive(m.id)}
                  onFocus={() => setActive(m.id)}
                  className={`border-b border-line transition-colors duration-500 ${
                    active === m.id ? "bg-paper" : ""
                  }`}
                >
                  <th scope="row" className="py-7 pr-6 text-left align-middle">
                    <button
                      type="button"
                      onClick={() => setActive(m.id)}
                      aria-expanded={active === m.id}
                      className="text-left text-[0.9375rem] font-normal text-ink transition-colors duration-400 hover:text-gold-deep"
                    >
                      {m.label}
                    </button>
                  </th>

                  {COLUMNS.map((c) => {
                    const score = m.scores[c.id];
                    return (
                      <td key={c.id} className="py-7 pr-6 align-middle">
                        <span className="sr-only">
                          {score} out of 5 for {c.label}
                        </span>
                        <span aria-hidden className="flex items-center gap-3">
                          <span className="relative h-[3px] w-full max-w-[130px] overflow-hidden bg-line">
                            <motion.span
                              className={`absolute inset-y-0 left-0 block origin-left ${
                                c.id === "shutters"
                                  ? "bg-gradient-to-r from-gold-deep to-gold-light"
                                  : "bg-charcoal/45"
                              }`}
                              style={{ width: "100%" }}
                              initial={reduce ? false : { scaleX: 0 }}
                              whileInView={{ scaleX: score / 5 }}
                              viewport={{ once: true, amount: 0.6 }}
                              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                            />
                          </span>
                          <span
                            className={`shrink-0 text-[0.8125rem] ${
                              c.id === "shutters" ? "text-gold-deep" : "text-muted"
                            }`}
                            data-tnum
                          >
                            {score.toFixed(1)}
                          </span>
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Explanation for the row under the cursor */}
        <motion.p
          key={current.id}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-9 max-w-3xl text-[0.9375rem] leading-[1.8] text-muted"
        >
          <span className="text-ink">{current.label}.</span> {current.detail}
        </motion.p>
      </div>
    </section>
  );
}
