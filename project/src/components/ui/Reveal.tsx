"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ElementType, ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

const OFFSET: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 26 },
  down: { x: 0, y: -26 },
  left: { x: 32, y: 0 },
  right: { x: -32, y: 0 },
  none: { x: 0, y: 0 },
};

/**
 * The single reveal primitive used across the site. Calm by design: a short
 * drift and a fade, nothing that overshoots. When the visitor asks for reduced
 * motion the content is simply present.
 */
export default function Reveal({
  children,
  as = "div",
  direction = "up",
  delay = 0,
  duration = 0.9,
  className,
  amount = 0.25,
  once = true,
}: {
  children: ReactNode;
  as?: ElementType;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
  amount?: number;
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;
  const offset = OFFSET[direction];

  if (reduce) {
    const Tag = as as ElementType;
    return (
      <Tag className={className} data-reveal>
        {children}
      </Tag>
    );
  }

  const variants: Variants = {
    hidden: { opacity: 0, x: offset.x, y: offset.y },
    shown: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration, delay, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <MotionTag
      className={className}
      data-reveal
      initial="hidden"
      whileInView="shown"
      viewport={{ once, amount }}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}

/** Staggered container — pair with `RevealChild`. */
export function RevealGroup({
  children,
  className,
  stagger = 0.09,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  as?: ElementType;
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  if (reduce) {
    const Tag = as as ElementType;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.15 }}
      variants={{
        hidden: {},
        shown: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {children}
    </MotionTag>
  );
}

export function RevealChild({
  children,
  className,
  as = "div",
  distance = 24,
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  distance?: number;
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  if (reduce) {
    const Tag = as as ElementType;
    return (
      <Tag className={className} data-reveal>
        {children}
      </Tag>
    );
  }

  return (
    <MotionTag
      className={className}
      data-reveal
      variants={{
        hidden: { opacity: 0, y: distance },
        shown: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } },
      }}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Line-by-line reveal for display headings. Each line is masked and rises
 * into place — the one flourish reserved for the largest type on a page.
 */
export function RevealLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  as: Tag = "h2",
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  as?: ElementType;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <Tag className={className} data-reveal>
        {lines.map((line, i) => (
          <span key={i} className={`block ${lineClassName ?? ""}`}>
            {line}
          </span>
        ))}
      </Tag>
    );
  }

  return (
    <Tag className={className}>
      {/*
        The observer has to watch the *mask*, not the line inside it. Each line
        starts translated fully below its `overflow: hidden` parent, so its own
        intersection ratio is permanently zero — a `whileInView` on the line
        itself can never satisfy an `amount` threshold and the heading stays
        parked outside its mask forever.
      */}
      <motion.span
        className="block"
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.2 }}
      >
        {lines.map((line, i) => (
          <span key={i} className="block overflow-hidden pb-[0.08em]">
            <motion.span
              className={`block ${lineClassName ?? ""}`}
              data-reveal
              variants={{ hidden: { y: "108%" }, shown: { y: 0 } }}
              transition={{ duration: 1.05, delay: delay + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
