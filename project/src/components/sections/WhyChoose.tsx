"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import * as Icons from "lucide-react";
import SceneImage from "@/components/scene/SceneImage";
import Reveal, { RevealGroup, RevealChild, RevealLines } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Type";
import { pillars } from "@/lib/content";
import { useCalmMotion } from "@/lib/useCalmMotion";
import { CtaLink } from "@/components/ui/Cta";

export default function WhyChoose() {
  const ref = useRef<HTMLDivElement>(null);
  const calm = useCalmMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section id="why" className="section-y bg-paper texture-paper">
      <div className="shell">
        {/* --------------------------------------------- editorial opening */}
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow className="mb-7">Why Horizon</Eyebrow>
            </Reveal>
            <RevealLines
              className="display-xl text-ink"
              lines={["Made properly.", "Fitted beautifully.", "Built to outlast", "the decorating."]}
            />
            <Reveal delay={0.2}>
              <p className="lede mt-9 max-w-lg">
                We have been measuring Essex windows since 2009. In that time we have learned that
                the difference between a good shutter and a forgettable one is almost never the
                material — it is the hour spent on the template, and the fitter who refuses to leave
                a shadow gap.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <CtaLink href="/about" variant="ink">
                  Our Story
                </CtaLink>
                <CtaLink href="/contact#survey" variant="outline">
                  Book a Survey
                </CtaLink>
              </div>
            </Reveal>
          </div>

          {/* Large image — the editorial anchor for the section */}
          <div ref={ref} className="lg:col-span-7">
            <Reveal direction="left" duration={1.2}>
              <figure className="sheen relative aspect-[4/3.1] overflow-hidden bg-ink">
                <motion.div style={calm ? undefined : { y }} className="absolute inset-[-9%]">
                  <SceneImage
                    room="living"
                    kind="shutter"
                    finishId="natural-wood"
                    louvreId="76"
                    tilt={40}
                    time="morning"
                    className="size-full"
                    alt="Natural oak plantation shutters in a living room, louvres tilted to soften the morning sun"
                  />
                </motion.div>
                <figcaption className="absolute bottom-0 left-0 right-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.72),transparent)] p-7 pt-16">
                  <p className="eyebrow text-brand-light">Full height · 76mm · Natural oak</p>
                  <p className="mt-2 text-[0.9375rem] text-white/80">
                    Hand-oiled basswood, Canvey Island
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>

        {/* ------------------------------------------------------- pillars */}
        <RevealGroup className="mt-24 grid gap-x-12 gap-y-14 border-t border-line pt-16 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p) => {
            const Icon = (Icons[p.icon as keyof typeof Icons] ??
              Icons.Sparkles) as React.ComponentType<{ className?: string; strokeWidth?: number }>;

            return (
              <RevealChild key={p.title} className="group">
                <span className="mb-6 flex size-14 items-center justify-center border border-line bg-section transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:border-brand group-hover:shadow-[0_12px_30px_-14px_rgba(47,155,216,0.55)]">
                  <Icon className="size-6 text-brand-deep" strokeWidth={1.1} />
                </span>
                <h3 className="display-md !text-[1.375rem] text-ink">{p.title}</h3>
                <p className="mt-4 text-[0.9375rem] leading-[1.8] text-muted">{p.body}</p>
              </RevealChild>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
