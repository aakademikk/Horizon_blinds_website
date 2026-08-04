"use client";

import { useEffect, useState } from "react";

/**
 * Whether to skip scroll-linked motion.
 *
 * Parallax means transforming a full-bleed image on every scroll frame. On a
 * desktop GPU that is free; on a phone it is the difference between smooth
 * scrolling and visible stutter, because the compositor has to repaint a large
 * layer against a scroll position it is already struggling to keep up with.
 *
 * True when the visitor asked for reduced motion, or when the primary input is
 * a touch screen.
 */
export function useCalmMotion() {
  const [calm, setCalm] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");
    const evaluate = () => setCalm(reduce.matches || coarse.matches);

    evaluate();
    reduce.addEventListener("change", evaluate);
    coarse.addEventListener("change", evaluate);
    return () => {
      reduce.removeEventListener("change", evaluate);
      coarse.removeEventListener("change", evaluate);
    };
  }, []);

  return calm;
}
