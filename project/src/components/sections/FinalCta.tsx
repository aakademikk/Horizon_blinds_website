"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import SceneImage from "@/components/scene/SceneImage";
import { CtaLink } from "@/components/ui/Cta";
import { RevealLines } from "@/components/ui/Reveal";
import { site } from "@/lib/site";
import { useCalmMotion } from "@/lib/useCalmMotion";

export default function FinalCta() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const calm = useCalmMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[86vh] items-center overflow-hidden bg-ink"
    >
      <motion.div style={calm ? undefined : { y }} className="absolute inset-[-14%] -z-20">
        <SceneImage
          room="living"
          kind="shutter"
          finishId="silk-white"
          louvreId="89"
          tilt={58}
          time="evening"
          className="size-full"
          alt="A living room at dusk with wide plantation shutters catching the last of the light"
        />
      </motion.div>

      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(105deg,rgba(8,8,8,0.9)_0%,rgba(8,8,8,0.72)_42%,rgba(8,8,8,0.32)_100%)]"
      />

      <div className="shell relative z-10 py-24">
        <div className="max-w-3xl">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="eyebrow flex items-center gap-3 text-gold-light"
          >
            <span aria-hidden className="h-px w-10 bg-current opacity-70" />
            The last word
          </motion.p>

          <RevealLines
            className="display-xl mt-8 text-white"
            lines={[
              "Transform your home",
              "with beautiful",
              "made-to-measure shutters.",
            ]}
          />

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mt-9 max-w-xl text-[1.0625rem] font-light leading-[1.75] text-white/65"
          >
            One free survey. One honest conversation. Then a house that feels finished — and stays
            that way for twenty years.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <CtaLink href="/contact#survey" variant="gold" size="lg">
              Book Free Home Survey
            </CtaLink>
            <a
              href={site.phoneHref}
              className="group inline-flex items-center gap-3 px-2 py-3 text-[0.9375rem] text-white/75 transition-colors duration-500 hover:text-gold-light"
            >
              <span className="text-[0.6875rem] uppercase tracking-[0.2em] text-white/62">
                or call
              </span>
              <span className="link-underline" data-tnum>
                {site.phone}
              </span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
