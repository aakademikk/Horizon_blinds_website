import { ArrowUpRight, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import SceneImage from "@/components/scene/SceneImage";
import Reveal, { RevealChild, RevealGroup } from "@/components/ui/Reveal";
import { SectionHeading, Stars } from "@/components/ui/Type";
import { projects } from "@/lib/content";
import { presetFor } from "@/lib/presets";

export default function Projects({ limit }: { limit?: number }) {
  const shown = limit ? projects.slice(0, limit) : projects;

  return (
    <section id="projects" className="section-y bg-paper texture-paper">
      <div className="shell">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <SectionHeading
              eyebrow="Recent Installations"
              title="Six windows we were pleased with."
              lede="Real jobs, real houses, real timescales — and what the owners said afterwards."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              href="/gallery"
              className="group inline-flex shrink-0 items-center gap-2.5 text-[0.8125rem] text-ink"
            >
              <span className="link-underline">See the full gallery</span>
              <ArrowUpRight
                className="size-4 text-brand-deep transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                strokeWidth={1.4}
              />
            </Link>
          </Reveal>
        </div>

        <RevealGroup className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {shown.map((p) => {
            const base = presetFor(p.scene.product);
            return (
              <RevealChild key={p.id}>
                <article className="card-luxe group flex h-full flex-col overflow-hidden">
                  <div className="sheen relative aspect-[4/3] overflow-hidden bg-ink">
                    <div className="size-full transition-transform duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]">
                      <SceneImage
                        room={p.scene.room}
                        kind={base.kind}
                        variant={p.scene.product === "solid-panels" ? "solid-panels" : undefined}
                        finishId={p.scene.finish}
                        louvreId={p.scene.louvre}
                        tilt={p.scene.tilt}
                        time={p.scene.time}
                        className="size-full"
                      />
                    </div>
                    <span className="absolute left-4 top-4 border border-white/25 bg-black/30 px-3 py-1.5 text-[0.625rem] uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                      {p.duration}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-7">
                    <h3 className="display-md !text-[1.375rem] text-ink transition-colors duration-500 group-hover:text-brand-deep">
                      {p.title}
                    </h3>

                    <dl className="mt-4 space-y-2 text-[0.8125rem] text-muted">
                      <div className="flex items-start gap-2.5">
                        <dt className="sr-only">Property</dt>
                        <span aria-hidden className="mt-[0.45em] size-1 shrink-0 rotate-45 bg-brand" />
                        <dd>{p.property}</dd>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <dt className="sr-only">Location</dt>
                        <MapPin className="mt-0.5 size-3.5 shrink-0 text-brand-deep" strokeWidth={1.4} />
                        <dd>{p.location}</dd>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <dt className="sr-only">Completion time</dt>
                        <Clock className="mt-0.5 size-3.5 shrink-0 text-brand-deep" strokeWidth={1.4} />
                        <dd>{p.duration}</dd>
                      </div>
                    </dl>

                    <ul className="mt-5 flex flex-wrap gap-1.5">
                      {p.installed.map((item) => (
                        <li
                          key={item}
                          className="border border-line px-2.5 py-1 text-[0.6875rem] tracking-[0.04em] text-muted"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>

                    <blockquote className="mt-auto border-t border-line pt-6">
                      <Stars size={11} rating={5} label="5 out of 5" />
                      <p className="mt-3 font-display text-[1.0625rem] font-light leading-snug text-ink">
                        “{p.quote}”
                      </p>
                      <footer className="mt-2 text-[0.75rem] text-faint">— {p.attribution}</footer>
                    </blockquote>
                  </div>
                </article>
              </RevealChild>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
