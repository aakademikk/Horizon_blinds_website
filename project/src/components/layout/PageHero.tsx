import Link from "next/link";
import { ChevronRight } from "lucide-react";
import RoomScene from "@/components/scene/RoomScene";
import { RevealLines } from "@/components/ui/Reveal";
import Reveal from "@/components/ui/Reveal";
import type { ScenePreset } from "@/lib/presets";

/**
 * Every inner page opens the same way: a full-bleed scene, a breadcrumb, and a
 * display heading that rises line by line. It keeps the site feeling like one
 * publication rather than a set of templates.
 */
export default function PageHero({
  eyebrow,
  titleLines,
  lede,
  scene,
  breadcrumb,
  children,
}: {
  eyebrow: string;
  titleLines: string[];
  lede?: string;
  scene: ScenePreset;
  breadcrumb: { label: string; href?: string }[];
  children?: React.ReactNode;
}) {
  return (
    <section className="relative isolate flex min-h-[76svh] items-end overflow-hidden bg-ink pt-32">
      <div className="absolute inset-0 -z-20">
        <RoomScene {...scene} className="size-full" />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(10,10,10,0.9)_0%,rgba(10,10,10,0.55)_38%,rgba(10,10,10,0.15)_72%,rgba(10,10,10,0.45)_100%)]"
      />

      <div className="shell relative z-10 pb-16 md:pb-24">
        <Reveal duration={0.8}>
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-[0.75rem] text-white/65">
              <li>
                <Link href="/" className="link-underline transition-colors hover:text-white">
                  Home
                </Link>
              </li>
              {breadcrumb.map((b) => (
                <li key={b.label} className="flex items-center gap-2">
                  <ChevronRight className="size-3" strokeWidth={1.5} aria-hidden />
                  {b.href ? (
                    <Link href={b.href} className="link-underline transition-colors hover:text-white">
                      {b.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-white/75">
                      {b.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </Reveal>

        <Reveal duration={0.9} delay={0.08}>
          <p className="eyebrow mt-9 flex items-center gap-3 text-gold-light">
            <span aria-hidden className="h-px w-10 bg-current opacity-70" />
            {eyebrow}
          </p>
        </Reveal>

        <RevealLines
          as="h1"
          className="display-xl mt-7 max-w-4xl text-white"
          lines={titleLines}
          delay={0.12}
        />

        {lede && (
          <Reveal delay={0.3}>
            <p className="mt-8 max-w-2xl text-[1.0625rem] font-light leading-[1.72] text-white/70">
              {lede}
            </p>
          </Reveal>
        )}

        {children && (
          <Reveal delay={0.4}>
            <div className="mt-11">{children}</div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
