"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";

/**
 * Lenis smooth scrolling, wired to GSAP's ticker so scroll-driven animation
 * stays on the same clock. Disabled entirely for visitors who have asked for
 * reduced motion.
 */
export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Touch devices keep their native momentum scrolling: it is better than
    // anything Lenis can emulate, and skipping it drops a whole RAF loop plus
    // a ScrollTrigger update on every frame.
    const coarse = window.matchMedia("(pointer: coarse)");
    if (reduce.matches || coarse.matches) return;

    let lenis: Lenis | null = null;
    let cancelled = false;

    // GSAP is only needed once smooth scroll is actually running.
    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      lenis = new Lenis({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        wheelMultiplier: 0.95,
        touchMultiplier: 1.6,
        // Native momentum on touch devices beats anything we can emulate.
        syncTouch: false,
      });

      lenis.on("scroll", ScrollTrigger.update);

      const tick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      // Anchor links need to go through Lenis to stay smooth.
      const onClick = (e: MouseEvent) => {
        const anchor = (e.target as HTMLElement)?.closest?.('a[href^="#"]');
        if (!anchor) return;
        const id = anchor.getAttribute("href");
        if (!id || id === "#") return;
        const el = document.querySelector(id);
        if (!el) return;
        e.preventDefault();
        lenis?.scrollTo(el as HTMLElement, { offset: -90, duration: 1.3 });
      };
      document.addEventListener("click", onClick);

      return () => {
        document.removeEventListener("click", onClick);
        gsap.ticker.remove(tick);
      };
    })();

    return () => {
      cancelled = true;
      lenis?.destroy();
    };
  }, []);

  // Always land at the top on navigation.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
