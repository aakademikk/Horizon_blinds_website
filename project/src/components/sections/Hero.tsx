"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, BadgePoundSterling, Ruler, ShieldCheck } from "lucide-react";
import SceneImage from "@/components/scene/SceneImage";
import { Stars } from "@/components/ui/Type";
import Wordmark from "@/components/layout/Wordmark";
import { site } from "@/lib/site";

const HEADLINE = ["Beautiful Windows.", "Beautiful Homes."];

const BADGES = [
  { icon: null, label: "Google Reviews", value: `${site.rating.value} from ${site.rating.count}` },
  { icon: ShieldCheck, label: "Established", value: `${site.yearsTrading}+ years in Essex` },
  { icon: Ruler, label: "Every window", value: "Made to measure" },
  { icon: BadgePoundSterling, label: "Spread the cost", value: "Finance available" },
];

/** Play the reveal once per browsing session, not on every navigation. */
const SEEN_KEY = "fsb:intro-played";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<"closed" | "opening" | "done">("closed");

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const sceneY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.1]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "42%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  useEffect(() => {
    if (reduce || (typeof window !== "undefined" && sessionStorage.getItem(SEEN_KEY))) {
      setPhase("done");
      return;
    }
    const open = window.setTimeout(() => setPhase("opening"), 560);
    const done = window.setTimeout(() => {
      setPhase("done");
      sessionStorage.setItem(SEEN_KEY, "1");
    }, 2600);
    return () => {
      window.clearTimeout(open);
      window.clearTimeout(done);
    };
  }, [reduce]);

  const revealed = phase !== "closed";
  // Content waits for the panels to be well clear of the type.
  const contentDelay = reduce ? 0 : phase === "done" ? 0 : 1.15;

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink"
      aria-label="Introduction"
    >
      {/* ------------------------------------------------------------ scene */}
      <motion.div
        style={reduce ? undefined : { y: sceneY, scale: sceneScale }}
        className="absolute inset-0 -z-20"
        initial={false}
      >
        <motion.div
          className="size-full"
          initial={reduce ? false : { filter: "brightness(0.4) saturate(0.6)" }}
          animate={{ filter: "brightness(1.04) saturate(1.06)" }}
          transition={{ duration: 3.4, delay: reduce ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/*
            Panned rather than scaled: the window lands right of centre and the
            headline gets quiet wall to sit on, with no loss of framing.
          */}
          <SceneImage
            room="living"
            kind="shutter"
            finishId="silk-white"
            louvreId="76"
            tilt={52}
            time="morning"
            pan={-210}
            priority
            className="size-full"
            alt="A bright living room with full-height plantation shutters, louvres half open to the morning sun"
          />
        </motion.div>
      </motion.div>

      {/*
        Legibility, without flattening the picture: a soft pool of shadow anchored
        to the bottom-left where the type lives, leaving the sunlit right-hand
        side of the room to breathe.
      */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(8,8,8,0.95)_0%,rgba(8,8,8,0.84)_34%,rgba(8,8,8,0.62)_66%,rgba(8,8,8,0.45)_100%)] md:bg-[radial-gradient(125%_105%_at_12%_88%,rgba(8,8,8,0.94)_0%,rgba(8,8,8,0.8)_26%,rgba(8,8,8,0.5)_48%,rgba(8,8,8,0.16)_72%,rgba(8,8,8,0)_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-40 bg-[linear-gradient(to_bottom,rgba(6,6,6,0.55),transparent)]"
      />

      {/* ---------------------------------------------------------- content */}
      <motion.div
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
        className="shell relative z-10 pb-12 pt-28 md:pb-20 md:pt-36"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: revealed ? 1 : 0 }}
          transition={{ duration: 1, delay: contentDelay }}
          className="eyebrow flex items-center gap-3 text-gold-light"
        >
          <span aria-hidden className="h-px w-10 bg-current opacity-70" />
          Plantation Shutters &amp; Fine Blinds · Essex
        </motion.div>

        <h1
          className="display-hero mt-6 text-white md:mt-8"
          style={{ textShadow: "0 2px 40px rgba(0,0,0,0.45)" }}
        >
          {HEADLINE.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.06em]">
              <motion.span
                className="block"
                initial={reduce ? false : { y: "110%" }}
                animate={{ y: revealed ? 0 : "110%" }}
                transition={{
                  duration: 1.35,
                  delay: contentDelay + i * 0.13,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {i === 1 ? (
                  <span className="bg-gradient-to-r from-white via-[#F4E7C4] to-gold-light bg-clip-text text-transparent">
                    {line}
                  </span>
                ) : (
                  line
                )}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 18 }}
          transition={{ duration: 1.1, delay: contentDelay + 0.34, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7 max-w-xl text-[1.0625rem] font-light leading-[1.72] text-white/72 md:mt-9 md:text-[1.1875rem]"
        >
          Handcrafted plantation shutters and premium blinds, expertly measured and professionally
          installed across Essex.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 18 }}
          transition={{ duration: 1.1, delay: contentDelay + 0.46, ease: [0.16, 1, 0.3, 1] }}
          className="mt-9 flex flex-col gap-3.5 sm:flex-row sm:items-center md:mt-11 md:gap-4"
        >
          <Link href="/contact#survey" className="btn-base btn-gold !px-9 !py-[1.15rem]">
            Book Free Home Survey
          </Link>
          <Link href="/gallery" className="btn-base btn-outline !px-9 !py-[1.15rem] text-white">
            Browse Gallery
          </Link>
        </motion.div>

        {/* ------------------------------------------------------- badges */}
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: revealed ? 1 : 0 }}
          transition={{ duration: 1.2, delay: contentDelay + 0.66 }}
          className="mt-10 grid max-w-4xl grid-cols-2 gap-x-6 gap-y-5 border-t border-white/12 pt-7 md:mt-14 md:grid-cols-4 md:gap-x-8 md:gap-y-6 md:pt-8"
        >
          {BADGES.map(({ icon: Icon, label, value }) => (
            <li key={label} className="flex items-start gap-3">
              <span className="mt-0.5 shrink-0 text-gold">
                {Icon ? (
                  <Icon className="size-[18px]" strokeWidth={1.4} />
                ) : (
                  <Stars size={12} rating={site.rating.value} label="Rated 4.9 out of 5 on Google" />
                )}
              </span>
              <span className="block">
                <span className="block text-[0.65rem] uppercase tracking-[0.2em] text-white/65">
                  {label}
                </span>
                <span className="mt-1 block text-[0.875rem] text-white/85">{value}</span>
              </span>
            </li>
          ))}
        </motion.ul>
      </motion.div>

      {/* -------------------------------------------------------- scroll cue */}
      <motion.a
        href="#why"
        aria-label="Scroll to content"
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ duration: 1, delay: contentDelay + 0.9 }}
        style={reduce ? undefined : { opacity: contentOpacity }}
        className="absolute bottom-8 right-6 z-10 hidden flex-col items-center gap-3 text-white/65 transition-colors duration-500 hover:text-gold-light md:flex xl:right-16"
      >
        <span className="text-[0.625rem] uppercase tracking-[0.28em] [writing-mode:vertical-rl]">
          Scroll
        </span>
        <ArrowDown className="size-4 animate-[drift-in_2.4s_ease-in-out_infinite_alternate]" strokeWidth={1.3} />
      </motion.a>

      {/* --------------------------------------------------- opening panels */}
      {phase !== "done" && (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-[60]">
          {([-1, 1] as const).map((dir) => (
            <motion.div
              key={dir}
              initial={{ x: 0 }}
              animate={{ x: phase === "opening" ? `${dir * 100}%` : 0 }}
              transition={{ duration: 1.9, ease: [0.76, 0, 0.24, 1] }}
              className="absolute top-0 h-full w-1/2 bg-ink"
              style={dir === -1 ? { left: 0 } : { right: 0 }}
            >
              {/* Louvre lines, so the panels read as shutters rather than a curtain */}
              <div
                className="size-full opacity-[0.055]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, #fff 0 1px, transparent 1px 34px)",
                }}
              />
              <span
                className={`absolute inset-y-0 w-px bg-gradient-to-b from-transparent via-gold/45 to-transparent ${
                  dir === -1 ? "right-0" : "left-0"
                }`}
              />
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "closed" ? 1 : 0 }}
            transition={{ duration: phase === "closed" ? 0.85 : 0.45 }}
            className="absolute inset-0 grid place-items-center"
          >
            <Wordmark tone="light" className="h-12 w-auto opacity-90" />
          </motion.div>
        </div>
      )}
    </section>
  );
}
