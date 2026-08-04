"use client";

import { motion, useReducedMotion } from "framer-motion";
import CountUp from "@/components/ui/CountUp";
import { Stars } from "@/components/ui/Type";
import { reviewPlatforms } from "@/lib/content";

const CLAIMS = ["Thousands of happy customers", "Award winning", "Essex's trusted installer"];

export default function TrustStrip() {
  const reduce = useReducedMotion();

  return (
    <section aria-label="Customer ratings" className="border-b border-white/10 bg-ink">
      <div className="shell py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-16">
          {/* --------------------------------------------------- platforms */}
          <ul className="grid grid-cols-2 gap-x-8 gap-y-9 md:grid-cols-4">
            {reviewPlatforms.map((p, i) => (
              <motion.li
                key={p.name}
                initial={reduce ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-2.5"
              >
                <span className="eyebrow text-white/50">{p.name}</span>
                <span className="flex items-baseline gap-2">
                  <span className="display-md !text-[2rem] text-white" data-tnum>
                    <CountUp value={p.score} decimals={1} />
                  </span>
                  {"suffix" in p && p.suffix && (
                    <span className="text-[0.875rem] text-white/60">{p.suffix}</span>
                  )}
                </span>
                <Stars
                  size={12}
                  rating={"suffix" in p && p.suffix ? p.score / 2 : p.score}
                  label={`${p.score} on ${p.name}`}
                />
                <span className="text-[0.75rem] text-white/60" data-tnum>
                  {p.count} reviews
                </span>
              </motion.li>
            ))}
          </ul>

          {/* ------------------------------------------------------ claims */}
          <ul className="flex flex-col gap-3 border-t border-white/10 pt-8 lg:border-l lg:border-t-0 lg:pl-16 lg:pt-0">
            {CLAIMS.map((c, i) => (
              <motion.li
                key={c}
                initial={reduce ? false : { opacity: 0, x: 14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3 whitespace-nowrap text-[0.8125rem] tracking-[0.02em] text-white/80"
              >
                <span aria-hidden className="size-1 rotate-45 bg-gold" />
                {c}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
