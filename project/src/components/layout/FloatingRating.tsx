"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Stars } from "@/components/ui/Type";
import { site } from "@/lib/site";

/**
 * A small review medallion that drifts in once the visitor is past the hero
 * and retires before they reach the footer, so it never fights the CTA.
 *
 * It stays away from pages built around controls and forms, where a fixed
 * corner element would sit on top of the very things people came to use.
 */
const OFF_LIMITS = ["/design-studio", "/contact"];
const DISMISS_KEY = "fsb:rating-dismissed";

export default function FloatingRating() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const reduce = useReducedMotion();

  useEffect(() => {
    setDismissed(sessionStorage.getItem(DISMISS_KEY) === "1");
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const nearBottom = y + window.innerHeight > document.documentElement.scrollHeight - 900;
      setVisible(y > 900 && !nearBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function dismiss() {
    setDismissed(true);
    sessionStorage.setItem(DISMISS_KEY, "1");
  }

  const blocked = OFF_LIMITS.some((p) => pathname.startsWith(p));

  return (
    <AnimatePresence>
      {visible && !dismissed && !blocked && (
        <motion.div
          data-no-print
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 left-6 z-40 hidden lg:block"
        >
          <div className="group relative flex items-center gap-4 border border-line bg-section/95 py-3.5 pl-4 pr-11 shadow-[0_18px_50px_-20px_rgba(35,27,12,0.35)] backdrop-blur-md transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-gold/50">
            <Link href="/reviews" className="flex items-center gap-4">
              <span
                className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-[0.9375rem] font-medium text-gold-light"
                data-tnum
              >
                {site.rating.value}
              </span>
              <span className="block">
                <Stars
                  size={11}
                  rating={site.rating.value}
                  label={`Rated ${site.rating.value} out of 5`}
                />
                <span className="mt-1 block text-[0.6875rem] tracking-[0.06em] text-muted">
                  {site.rating.count} reviews · Essex
                </span>
              </span>
            </Link>

            <button
              type="button"
              onClick={dismiss}
              aria-label="Hide the review badge"
              className="absolute right-1.5 top-1.5 grid size-7 place-items-center text-faint transition-colors duration-400 hover:text-ink"
            >
              <X className="size-3.5" strokeWidth={1.6} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
