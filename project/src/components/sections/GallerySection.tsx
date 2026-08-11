import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import GalleryGrid from "./GalleryGrid";
import Reveal from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Type";

export default function GallerySection() {
  return (
    <section id="gallery" className="section-y bg-brand">
      <div className="shell">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <SectionHeading
              eyebrow="Inspiration"
              tone="light"
              title={
                <>
                  Rooms we have
                  <br />
                  changed the light in.
                </>
              }
              lede="Every scene here is drawn from a real specification we have fitted — the same room, product, finish and louvre size."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              href="/gallery"
              className="group inline-flex shrink-0 items-center gap-2.5 text-[0.8125rem] text-white"
            >
              <span className="link-underline">Open the full gallery</span>
              <ArrowUpRight
                className="size-4 text-brand transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                strokeWidth={1.4}
              />
            </Link>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="mt-14">
          <GalleryGrid limit={6} showFilters={false} />
        </Reveal>
      </div>
    </section>
  );
}
