"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { navigation, site } from "@/lib/site";
import Wordmark from "./Wordmark";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [openDrop, setOpenDrop] = useState<string | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 64);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close everything on navigation.
  useEffect(() => {
    setOpenMenu(false);
    setOpenDrop(null);
  }, [pathname]);

  // Trap the page behind the mobile sheet.
  useEffect(() => {
    document.body.style.overflow = openMenu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [openMenu]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpenMenu(false);
      setOpenDrop(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Transparent over the hero; solid once the visitor starts reading.
  const solid = scrolled || openMenu;
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[100] focus:bg-ink focus:px-5 focus:py-3 focus:text-xs focus:uppercase focus:tracking-[0.18em] focus:text-white"
      >
        Skip to content
      </a>

      <header
        data-no-print
        className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-brand transition-all duration-[850ms] ease-[cubic-bezier(0.16,1,0.3,1)] md:bg-brand/95 md:backdrop-blur-xl md:supports-[backdrop-filter]:bg-brand/85"
      >
        <div className="shell">
          <div
            className={[
              "flex items-center justify-between transition-all duration-[850ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
              solid ? "h-[88px]" : "h-[126px]",
            ].join(" ")}
          >
            <Link
              href="/"
              aria-label={`${site.name} — home`}
              className="shrink-0 transition-opacity duration-500 hover:opacity-70"
            >
              <Wordmark tone="light" className="h-14 w-auto md:h-16" />
            </Link>

            {/* ------------------------------------------------- desktop nav */}
            <nav
              aria-label="Primary"
              className="hidden items-center gap-8 xl:flex"
              onMouseLeave={() => setOpenDrop(null)}
            >
              {navigation.map((item) => (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setOpenDrop(item.children ? item.label : null)}
                >
                  <Link
                    href={item.href}
                    data-active={isActive(item.href)}
                    aria-expanded={item.children ? openDrop === item.label : undefined}
                    className={[
                      "nav-link text-[0.875rem] tracking-[0.04em] text-white/80 transition-colors duration-500 hover:text-white",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>

                  <AnimatePresence>
                    {item.children && openDrop === item.label && (
                      <motion.div
                        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
                        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute left-1/2 top-full z-10 w-[19rem] -translate-x-1/2 pt-5"
                      >
                        <div className="border border-white/12 bg-brand p-2 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.7)]">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="group block px-4 py-3 transition-colors duration-400 hover:bg-white/[0.06]"
                            >
                              <span className="block text-[0.8125rem] font-medium text-white transition-colors duration-400 group-hover:text-brand-light">
                                {child.label}
                              </span>
                              {child.note && (
                                <span className="mt-0.5 block text-[0.75rem] leading-relaxed text-white/55">
                                  {child.note}
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* ---------------------------------------------------- actions */}
            <div className="flex items-center gap-3 md:gap-5">
              <a
                href={site.phoneHref}
                className={[
                  "group hidden items-center gap-2.5 text-[0.875rem] tracking-[0.02em] text-white/85 transition-colors duration-500 hover:text-brand-light sm:flex",
                ].join(" ")}
              >
                <Phone className="size-[15px] transition-transform duration-500 group-hover:-rotate-12" strokeWidth={1.5} />
                <span className="link-underline font-medium" data-tnum>
                  {site.phone}
                </span>
              </a>

              <Link
                href="/contact#survey"
                className="btn-base btn-outline hidden !px-6 !py-3.5 !text-[0.6875rem] text-white lg:inline-flex"
              >
                Book a Home Visit
              </Link>

              <button
                type="button"
                onClick={() => setOpenMenu((v) => !v)}
                aria-expanded={openMenu}
                aria-controls="mobile-menu"
                aria-label={openMenu ? "Close menu" : "Open menu"}
                className={[
                  "grid size-11 place-items-center border border-white/25 text-white transition-colors duration-500 hover:border-brand hover:text-brand-light xl:hidden",
                ].join(" ")}
              >
                {openMenu ? <X className="size-5" strokeWidth={1.4} /> : <Menu className="size-5" strokeWidth={1.4} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ----------------------------------------------------- mobile sheet */}
      <AnimatePresence>
        {openMenu && (
          <motion.div
            id="mobile-menu"
            data-no-print
            initial={reduce ? { opacity: 0 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 overflow-y-auto bg-brand pt-[88px] xl:hidden"
          >
            <nav aria-label="Mobile" className="shell py-10">
              <ul className="divide-y divide-white/10 border-y border-white/10">
                {navigation.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={reduce ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.05 + i * 0.045, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={item.href}
                      className="flex items-baseline justify-between py-5"
                      onClick={() => setOpenMenu(false)}
                    >
                      <span className="display-md text-white">{item.label}</span>
                      <span className="eyebrow text-white/45">{String(i + 1).padStart(2, "0")}</span>
                    </Link>
                    {item.children && (
                      <div className="flex flex-wrap gap-x-5 gap-y-2 pb-5">
                        {item.children.map((c) => (
                          <Link
                            key={c.href}
                            href={c.href}
                            onClick={() => setOpenMenu(false)}
                            className="link-underline text-[0.8125rem] text-white/60"
                          >
                            {c.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </motion.li>
                ))}
              </ul>

              <div className="mt-10 flex flex-col gap-4">
                <Link href="/contact#survey" className="btn-base btn-brand w-full" onClick={() => setOpenMenu(false)}>
                  Book a Free Home Visit
                </Link>
                <a href={site.phoneHref} className="btn-base btn-outline w-full text-white">
                  <Phone className="size-4" strokeWidth={1.5} />
                  {site.phone}
                </a>
              </div>

              <p className="mt-10 text-[0.8125rem] leading-relaxed text-white/55">
                {site.address.street}, {site.address.locality}, {site.address.region}{" "}
                {site.address.postcode}
              </p>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
