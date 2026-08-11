"use client";

import { motion, useReducedMotion } from "framer-motion";
import { claims, promises } from "@/lib/content";

/**
 * Deliberately a *strip*. On a phone this used to stack into nearly a full
 * screen, which turned the dark opening run into a tunnel — so the
 * small-screen layout drops the supporting notes and lets the four promises
 * sit on two tight rows.
 */
export default function TrustStrip() {
  const reduce = useReducedMotion();

  return (
    <section aria-label="What we promise" className="border-b border-white/10 bg-brand">
      <div className="shell py-7 md:py-16">
        <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-16">
          <ul className="grid grid-cols-2 gap-x-5 gap-y-7 sm:grid-cols-4 md:gap-x-8">
            {promises.map((p, i) => (
              <motion.li
                key={p.label}
                initial={reduce ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.7, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-1.5 md:gap-2.5"
              >
                <span className="eyebrow !text-[0.5625rem] !tracking-[0.12em] text-white/55 md:!text-[0.6875rem] md:!tracking-[0.22em]">
                  {p.label}
                </span>
                <span
                  className="font-display text-[1.375rem] font-light leading-none text-white md:text-[1.75rem]"
                  data-tnum
                >
                  {p.value}
                </span>
                {/* The note is detail the strip does not need on a phone */}
                <span className="hidden text-[0.75rem] leading-relaxed text-white/65 md:block">
                  {p.note}
                </span>
              </motion.li>
            ))}
          </ul>

          <ul className="flex flex-wrap gap-x-5 gap-y-2 border-t border-white/10 pt-6 lg:flex-col lg:gap-3 lg:border-l lg:border-t-0 lg:pl-16 lg:pt-0">
            {claims.map((c, i) => (
              <motion.li
                key={c}
                initial={reduce ? false : { opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-2 whitespace-nowrap text-[0.75rem] tracking-[0.02em] text-white/80 md:gap-3 md:text-[0.8125rem]"
              >
                <span aria-hidden className="size-1 rotate-45 bg-brand" />
                {c}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
