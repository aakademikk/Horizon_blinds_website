"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { MessageCircle, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";

/**
 * A small contact medallion that drifts in once the visitor is past the hero
 * and retires before they reach the footer, so it never fights the CTA.
 *
 * This slot used to hold a review score. With no verified figures to show it
 * carries the two things Horizon actually want people to do instead — message
 * or ring — which is also how their own site behaves.
 *
 * It stays away from pages built around controls and forms, where a fixed
 * corner element would sit on top of the very things people came to use.
 */
const OFF_LIMITS = ["/design-studio", "/contact"];
const DISMISS_KEY = "hbs:contact-dismissed";

export default function FloatingContact() {
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
          <div className="relative flex items-center gap-4 border border-line bg-section/95 py-3.5 pl-4 pr-11 shadow-[0_18px_50px_-20px_rgba(11,39,57,0.35)] backdrop-blur-md transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-brand/50">
            <span
              aria-hidden
              className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-brand-light"
            >
              <MessageCircle className="size-5" strokeWidth={1.5} />
            </span>

            <span className="block">
              <span className="block text-[0.8125rem] text-ink">Questions about a window?</span>
              <span className="mt-1.5 flex items-center gap-3 text-[0.6875rem] tracking-[0.06em]">
                <a
                  href={site.whatsappHref}
                  target="_blank"
                  rel="noopener"
                  className="link-underline text-brand-deep"
                >
                  WhatsApp us
                </a>
                <span aria-hidden className="text-line">
                  |
                </span>
                <a
                  href={site.phoneHref}
                  className="flex items-center gap-1.5 text-muted transition-colors duration-400 hover:text-ink"
                >
                  <Phone className="size-3" strokeWidth={1.6} aria-hidden />
                  <span data-tnum>{site.phone}</span>
                </a>
              </span>
            </span>

            <button
              type="button"
              onClick={dismiss}
              aria-label="Hide the contact badge"
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
