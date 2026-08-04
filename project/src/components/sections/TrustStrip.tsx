"use client";

import { motion, useReducedMotion } from "framer-motion";
import CountUp from "@/components/ui/CountUp";
import { Stars } from "@/components/ui/Type";
import { reviewPlatforms } from "@/lib/content";

const CLAIMS = ["Thousands of happy customers", "Award winning", "Essex's trusted installer"];

/**
 * Deliberately a *strip*. On a phone this used to stack into nearly a full
 * screen of scores, which turned the dark opening run into a tunnel — so the
 * small-screen layout drops the star rows, shrinks the figures and lets the
 * four platforms sit on one line.
 */
export default function TrustStrip() {
  const reduce = useReducedMotion();

  return (
    <section aria-label="Customer ratings" className="border-b border-white/10 bg-ink">
      <div className="shell py-7 md:py-16">
        <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-16">
          {/* --------------------------------------------------- platforms */}
          <ul className="grid grid-cols-4 gap-x-3 gap-y-9 md:gap-x-8">
            {reviewPlatforms.map((p, i) => (
              <motion.li
                key={p.name}
                initial={reduce ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.7, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-1.5 md:gap-2.5"
              >
                <span className="eyebrow !text-[0.5625rem] !tracking-[0.12em] text-white/50 md:!text-[0.6875rem] md:!tracking-[0.22em]">
                  {p.name}
                </span>
                <span className="flex items-baseline gap-1">
                  <span
                    className="font-display text-[1.375rem] font-light leading-none text-white md:text-[2rem]"
                    data-tnum
                  >
                    <CountUp value={p.score} decimals={1} />
                  </span>
                  {"suffix" in p && p.suffix && (
                    <span className="text-[0.6875rem] text-white/60 md:text-[0.875rem]">
                      {p.suffix}
                    </span>
                  )}
                </span>

                {/* Stars and counts are detail the strip does not need on a phone */}
                <span className="hidden md:block">
                  <Stars
                    size={12}
                    rating={"suffix" in p && p.suffix ? p.score / 2 : p.score}
                    label={`${p.score} on ${p.name}`}
                  />
                </span>
                <span className="text-[0.625rem] text-white/60 md:text-[0.75rem]" data-tnum>
                  {p.count} reviews
                </span>
              </motion.li>
            ))}
          </ul>

          {/* ------------------------------------------------------ claims */}
          <ul className="flex flex-wrap gap-x-5 gap-y-2 border-t border-white/10 pt-6 lg:flex-col lg:gap-3 lg:border-l lg:border-t-0 lg:pl-16 lg:pt-0">
            {CLAIMS.map((c, i) => (
              <motion.li
                key={c}
                initial={reduce ? false : { opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-2 whitespace-nowrap text-[0.75rem] tracking-[0.02em] text-white/80 md:gap-3 md:text-[0.8125rem]"
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
