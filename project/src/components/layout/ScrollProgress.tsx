"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** A hairline of brand across the top of the viewport. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const width = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      data-no-print
      style={{ scaleX: width }}
      className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-gradient-to-r from-brand-deep via-brand to-brand-light"
    />
  );
}
