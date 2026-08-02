"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { CalendarCheck, Hammer, Home, Ruler, Sofa, Wrench } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Type";
import { CtaLink } from "@/components/ui/Cta";
import { processSteps } from "@/lib/content";

const ICONS = [CalendarCheck, Home, Ruler, Hammer, Wrench, Sofa];

export default function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.55"],
  });
  const raw = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const progress = useSpring(raw, { stiffness: 90, damping: 26, restDelta: 0.001 });

  return (
    <section id="process" className="section-y bg-paper texture-paper">
      <div className="shell">
        <Reveal>
          <SectionHeading
            eyebrow="How It Works"
            align="center"
            title="Six steps, and only one of them is yours."
            lede="From the first phone call to the day you stop noticing them because they simply belong there."
          />
        </Reveal>

        <div ref={ref} className="relative mt-20">
          {/* The rule that fills as you read down the section */}
          <div aria-hidden className="absolute inset-x-0 top-[27px] hidden h-px bg-line lg:block">
            <motion.div
              className="h-full origin-left bg-gradient-to-r from-gold-deep via-gold to-gold-light"
              style={reduce ? { scaleX: 1 } : { scaleX: progress }}
            />
          </div>

          <ol className="grid gap-y-14 lg:grid-cols-6 lg:gap-x-6">
            {processSteps.map((step, i) => {
              const Icon = ICONS[i];
              return (
                <motion.li
                  key={step.n}
                  initial={reduce ? false : { opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.85, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  className="relative flex gap-5 lg:block"
                >
                  <span className="relative z-10 grid size-14 shrink-0 place-items-center rounded-full border border-line bg-paper text-gold-deep transition-colors duration-500 lg:size-[54px]">
                    <Icon className="size-[22px]" strokeWidth={1.15} />
                  </span>

                  <div className="lg:mt-7">
                    <span className="eyebrow text-faint" data-tnum>
                      {step.n}
                    </span>
                    <h3 className="display-md mt-2.5 !text-[1.25rem] text-ink">{step.title}</h3>
                    <p className="mt-1.5 text-[0.6875rem] uppercase tracking-[0.16em] text-gold-deep">
                      {step.duration}
                    </p>
                    <p className="mt-3.5 text-[0.875rem] leading-[1.75] text-muted lg:pr-2">
                      {step.body}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>

        <Reveal delay={0.1} className="mt-16 flex justify-center">
          <CtaLink href="/contact#survey" variant="ink" size="lg">
            Start at Step One
          </CtaLink>
        </Reveal>
      </div>
    </section>
  );
}
