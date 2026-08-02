"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, Keyboard } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";
import { ArrowLeft, ArrowRight, Pause, Play, Quote } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { SectionHeading, Stars } from "@/components/ui/Type";
import { CtaLink } from "@/components/ui/Cta";
import { reviews } from "@/lib/content";
import { site } from "@/lib/site";

import "swiper/css";
import "swiper/css/a11y";

export default function Testimonials() {
  const swiperRef = useRef<SwiperClass | null>(null);
  const [playing, setPlaying] = useState(true);
  const [index, setIndex] = useState(0);

  const toggle = () => {
    const s = swiperRef.current;
    if (!s) return;
    if (playing) s.autoplay?.stop();
    else s.autoplay?.start();
    setPlaying((p) => !p);
  };

  return (
    <section id="reviews" className="section-y bg-ink text-white">
      <div className="shell">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <SectionHeading
              eyebrow="In Their Words"
              tone="light"
              title={
                <>
                  {site.rating.count} reviews.
                  <br />
                  Not one of them written by us.
                </>
              }
            />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggle}
                aria-label={playing ? "Pause testimonials" : "Play testimonials"}
                className="grid size-12 place-items-center border border-white/15 text-white/60 transition-all duration-500 hover:border-gold hover:text-gold-light"
              >
                {playing ? <Pause className="size-4" strokeWidth={1.4} /> : <Play className="size-4" strokeWidth={1.4} />}
              </button>
              <button
                type="button"
                onClick={() => swiperRef.current?.slidePrev()}
                aria-label="Previous testimonial"
                className="grid size-12 place-items-center border border-white/15 text-white/60 transition-all duration-500 hover:border-gold hover:text-gold-light"
              >
                <ArrowLeft className="size-4" strokeWidth={1.4} />
              </button>
              <button
                type="button"
                onClick={() => swiperRef.current?.slideNext()}
                aria-label="Next testimonial"
                className="grid size-12 place-items-center border border-white/15 text-white/60 transition-all duration-500 hover:border-gold hover:text-gold-light"
              >
                <ArrowRight className="size-4" strokeWidth={1.4} />
              </button>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="mt-14">
          <Swiper
            modules={[Autoplay, A11y, Keyboard]}
            onSwiper={(s) => (swiperRef.current = s)}
            onSlideChange={(s) => setIndex(s.realIndex)}
            loop
            speed={900}
            spaceBetween={28}
            autoplay={{ delay: 7000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            keyboard={{ enabled: true }}
            a11y={{ enabled: true, containerRoleDescriptionMessage: "carousel", itemRoleDescriptionMessage: "slide" }}
            breakpoints={{ 0: { slidesPerView: 1 }, 900: { slidesPerView: 2 }, 1400: { slidesPerView: 2.4 } }}
          >
            {reviews.map((r) => (
              <SwiperSlide key={r.id} className="!h-auto">
                <figure className="flex h-full flex-col border border-white/10 bg-white/[0.025] p-8 transition-colors duration-700 hover:border-gold/35 md:p-10">
                  <Quote className="size-8 text-gold/50" strokeWidth={0.9} aria-hidden />

                  <blockquote className="mt-7 flex-1">
                    <p className="font-display text-[1.5rem] font-light leading-[1.35] text-white md:text-[1.75rem]">
                      “{r.headline}”
                    </p>
                    <p className="mt-6 text-[0.9375rem] leading-[1.85] text-white/55">{r.body}</p>
                  </blockquote>

                  <figcaption className="mt-9 flex items-center gap-4 border-t border-white/10 pt-7">
                    <span
                      aria-hidden
                      className="grid size-12 shrink-0 place-items-center rounded-full border border-gold/40 bg-gradient-to-br from-white/10 to-transparent font-display text-[0.9375rem] text-gold-light"
                    >
                      {r.initials}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.9375rem] text-white">{r.name}</span>
                      <span className="mt-0.5 block truncate text-[0.75rem] text-white/65">
                        {r.location} · {r.product}
                      </span>
                    </span>
                    <span className="flex shrink-0 flex-col items-end gap-1.5">
                      <Stars size={12} rating={r.rating} label={`${r.rating} out of 5`} />
                      <span className="text-[0.6875rem] uppercase tracking-[0.14em] text-white/60">
                        {r.source}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </SwiperSlide>
            ))}
          </Swiper>
        </Reveal>

        {/* Progress dots */}
        <div className="mt-10 flex items-center justify-between gap-8">
          <div className="flex gap-2" role="tablist" aria-label="Testimonial navigation">
            {reviews.map((r, i) => (
              <button
                key={r.id}
                type="button"
                role="tab"
                aria-selected={index === i}
                aria-label={`Review ${i + 1} of ${reviews.length}`}
                onClick={() => swiperRef.current?.slideToLoop(i)}
                className={`h-px transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  index === i ? "w-12 bg-gold" : "w-6 bg-white/20 hover:bg-white/45"
                }`}
              />
            ))}
          </div>

          <CtaLink href="/reviews" variant="outline" size="sm" className="text-white">
            Read All Reviews
          </CtaLink>
        </div>
      </div>
    </section>
  );
}
