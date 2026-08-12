"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, BadgePoundSterling, Clock, Ruler, ShieldCheck } from "lucide-react";
import { useCalmMotion } from "@/lib/useCalmMotion";

const HEADLINE = ["Made to Measure.", "Made for Your Home."];

/*
 * `short` is what a phone shows. The label above the value is dropped at that
 * width, and "3 years" on its own means nothing without it — so the small
 * screen gets a self-contained phrase instead.
 */
const BADGES = [
  { icon: ShieldCheck, label: "Shutter guarantee", value: "3 years", short: "3-year guarantee" },
  { icon: Clock, label: "Your quotation", value: "Within 24 hours", short: "Quote in 24 hours" },
  { icon: Ruler, label: "Every window", value: "Made to measure", short: "Made to measure" },
  { icon: BadgePoundSterling, label: "Fitting", value: "Free, by us", short: "Free fitting" },
];

/** Play the reveal once per browsing session, not on every navigation. */
const SEEN_KEY = "hbs:intro-played";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const calm = useCalmMotion();
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
        style={calm ? undefined : { y: sceneY, scale: sceneScale }}
        className="absolute inset-0 -z-20"
        initial={false}
      >
        <motion.div
          className="size-full"
          initial={reduce ? false : { filter: "brightness(0.5) saturate(0.7)" }}
          animate={{ filter: "brightness(1.02) saturate(1.04)" }}
          transition={{ duration: 3.4, delay: reduce ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <img
            src="/horizon.jpg"
            alt="Horizon Blinds & Shutters — plantation shutters in a bright, modern interior"
            className="size-full object-cover object-center"
          />
        </motion.div>
      </motion.div>

      {/* Dark gradient overlay — legibility pool at the bottom-left */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(8,8,8,0.9)_0%,rgba(8,8,8,0.72)_38%,rgba(8,8,8,0.42)_56%,rgba(8,8,8,0.18)_70%,rgba(8,8,8,0)_84%)] md:landscape:bg-[radial-gradient(125%_105%_at_12%_88%,rgba(8,8,8,0.9)_0%,rgba(8,8,8,0.72)_26%,rgba(8,8,8,0.42)_48%,rgba(8,8,8,0.12)_72%,rgba(8,8,8,0)_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-24 bg-[linear-gradient(to_bottom,rgba(6,6,6,0.55),transparent)] md:h-40 md:bg-[linear-gradient(to_bottom,rgba(6,6,6,0.42),transparent)]"
      />

      {/* ---------------------------------------------------------- content */}
      <motion.div
        style={calm ? undefined : { y: contentY, opacity: contentOpacity }}
        className="shell relative z-10 pb-6 pt-28 md:pb-20 md:pt-36"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: revealed ? 1 : 0 }}
          transition={{ duration: 1, delay: contentDelay }}
          className="eyebrow flex items-center gap-3 !text-[0.625rem] !tracking-[0.14em] text-brand-light md:!text-[0.6875rem] md:!tracking-[0.22em]"
        >
          {/* The rule is what pushes this onto a second line at 390px. */}
          <span aria-hidden className="hidden h-px w-10 bg-current opacity-70 sm:block" />
          Blinds, Shutters &amp; Curtains · South Essex
        </motion.div>

        <h1
          className="display-hero mt-3 text-white md:mt-8 max-sm:!text-[2.875rem]"
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
                  <span className="bg-gradient-to-r from-brand-light via-brand to-brand-deep bg-clip-text text-transparent">
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
          className="mt-4 max-w-xl text-[1.0625rem] font-light leading-[1.66] text-white/78 md:mt-9 md:text-[1.1875rem] md:leading-[1.72]"
        >
          Beautifully crafted blinds, shutters and curtains, measured in your home and fitted by
          the same people who quoted for them. Family run, across South Essex.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 18 }}
          transition={{ duration: 1.1, delay: contentDelay + 0.46, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center md:mt-11 md:gap-4"
        >
          <Link href="/contact#survey" className="btn-base btn-brand !px-9 !py-[1.15rem] max-sm:!py-4">
            Book a Free Home Visit
          </Link>
          <Link href="/gallery" className="btn-base btn-outline !px-9 !py-[1.15rem] text-white max-sm:!py-4">
            Browse Gallery
          </Link>
        </motion.div>

        {/* ------------------------------------------------------- badges */}
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: revealed ? 1 : 0 }}
          transition={{ duration: 1.2, delay: contentDelay + 0.66 }}
          className="mt-5 grid max-w-4xl grid-cols-2 gap-x-5 gap-y-3 border-t border-white/12 pt-4 md:mt-14 md:gap-x-8 md:gap-y-6 md:pt-8 lg:grid-cols-4"
        >
          {BADGES.map(({ icon: Icon, label, value, short }) => (
            <li key={label} className="flex items-start gap-3">
              <span className="mt-0.5 shrink-0 text-brand-light">
                <Icon className="size-[18px]" strokeWidth={1.4} />
              </span>
              <span className="block">
                {/* On a phone the value says it all, so the small-caps label
                    stays for screen readers but gives up its line. */}
                <span className="sr-only text-[0.65rem] uppercase tracking-[0.2em] text-white/65 md:not-sr-only md:block">
                  {label}
                </span>
                <span className="block text-[0.875rem] text-white/85 md:mt-1">
                  <span className="md:hidden">{short}</span>
                  <span className="hidden md:inline">{value}</span>
                </span>
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
        style={calm ? undefined : { opacity: contentOpacity }}
        className="absolute bottom-8 right-6 z-10 hidden flex-col items-center gap-3 text-white/65 transition-colors duration-500 hover:text-brand-light md:flex xl:right-16"
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
                className={`absolute inset-y-0 w-px bg-gradient-to-b from-transparent via-brand/45 to-transparent ${
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
            <div className="flex flex-col items-center gap-3">
              <svg viewBox="0 0 64 64" className="h-20 w-auto" role="img" aria-label="Horizon Blinds & Shutters">
                <defs>
                  <linearGradient id="hz-intro-fan" x1="0" y1="1" x2="1" y2="0">
                    <stop offset="0%" stopColor="#2F9BD8" />
                    <stop offset="55%" stopColor="#6EC7F0" />
                    <stop offset="100%" stopColor="#B9E4F7" />
                  </linearGradient>
                </defs>
                <g transform="translate(32 30)">
                  <circle r="24" fill="none" stroke="url(#hz-intro-fan)" strokeWidth="1.2" />
                  {Array.from({ length: 11 }, (_, i) => -84 + i * 16.8).map((deg) => (
                    <path
                      key={deg}
                      d="M -3 -3.5 L -1.4 -20 L 1.4 -20 L 3 -3.5 Z"
                      transform={`rotate(${deg})`}
                      fill="url(#hz-intro-fan)"
                      opacity={Math.abs(deg) < 9 ? 1 : 0.78}
                    />
                  ))}
                  <circle cy="-1" r="3.8" fill="url(#hz-intro-fan)" />
                  <rect x="-17.5" y="2.2" width="35" height="1.6" rx="0.8" fill="url(#hz-intro-fan)" opacity="0.85" />
                </g>
              </svg>
              <div className="text-center">
                <div className="font-display text-[2rem] font-light leading-none tracking-[-0.02em] text-brand-light">
                  Horizon
                </div>
                <div className="mt-1 text-[0.5rem] font-semibold uppercase tracking-[0.3em] text-white/55">
                  Blinds &amp; Shutters
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}
