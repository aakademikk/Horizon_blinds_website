import PageHero from "@/components/layout/PageHero";
import Process from "@/components/sections/Process";
import ContactSection from "@/components/sections/ContactSection";
import FinalCta from "@/components/sections/FinalCta";
import SceneImage from "@/components/scene/SceneImage";
import Reveal, { RevealChild, RevealGroup, RevealLines } from "@/components/ui/Reveal";
import { Eyebrow, SectionHeading } from "@/components/ui/Type";
import CountUp from "@/components/ui/CountUp";
import { pillars } from "@/lib/content";
import { site } from "@/lib/site";
import { JsonLd, breadcrumbSchema, pageMeta } from "@/lib/seo";
import * as Icons from "lucide-react";

export const metadata = pageMeta({
  title: "About Us",
  description: `${site.name} is a family-run business measuring, making and fitting window coverings across South Essex. No hard sell, free fitting, and a three-year guarantee on shutters.`,
  path: "/about",
});

/*
 * Only figures we can point at a source for. "Windows dressed" and an average
 * review score were in the original build as sample data; they are not stated
 * anywhere Horizon publishes, so they are not stated here either.
 */
const NUMBERS = [
  { value: site.yearsTrading, suffix: "+", label: "Years in the trade", note: "The owner's own experience" },
  { value: site.guarantee.shutters, suffix: " yr", label: "Shutter guarantee", note: `${site.guarantee.blinds} year on blinds` },
  { value: 24, suffix: "h", label: "To your quotation", note: "By email after the visit" },
  { value: 0, suffix: "", label: "Hard sell", note: "Never, on any visit" },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />

      <PageHero
        eyebrow="Our Story"
        titleLines={["A small firm", "that has never", "wanted to be big."]}
        lede="Fifteen years, one county, and a stubborn view that the hour spent templating a bay is the hour that decides everything."
        breadcrumb={[{ label: "About" }]}
        scene={{
          room: "living",
          kind: "shutter",
          finishId: "natural-wood",
          louvreId: "76",
          tilt: 38,
          time: "morning",
        }}
      />

      {/* ------------------------------------------------------------ story */}
      <section className="section-y bg-section">
        <div className="shell">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-5">
              <Reveal>
                <Eyebrow className="mb-7">Family run</Eyebrow>
              </Reveal>
              <RevealLines
                className="display-xl text-ink"
                lines={["We measure.", "We make.", "We fit.", "That is the", "whole business."]}
              />
            </div>

            <div className="lg:col-span-7">
              <Reveal delay={0.1}>
                <div className="space-y-7 text-[1.0625rem] leading-[1.85] text-muted">
                  <p>
                    {site.name} is a family business run from Canvey Island, built on more than a
                    decade in the window trade and on a conviction that most coverings in Essex are
                    sold by people who will never have to come back and look at them.
                  </p>
                  <p>
                    The shape of it is simple. We come to your home with the samples, measure
                    whichever windows you are thinking about, and go through the options in front of
                    the actual light in the actual room. The quotation follows by email within
                    twenty-four hours. There is no hard sell on the visit and none afterwards.
                  </p>
                  <p>
                    We have deliberately stayed local to South Essex. It means we can be at a house
                    in Rayleigh by ten and back on Canvey for a two o&rsquo;clock appointment, and it
                    means we know what a 1930s Essex bay is going to do before we put a laser on it.
                    That local knowledge is worth more than a national brochure.
                  </p>
                  <p className="border-l-2 border-brand pl-6 font-display text-[1.375rem] font-light italic leading-relaxed text-ink">
                    “The difference between a good shutter and a forgettable one is almost never the
                    material. It is the hour spent on the template.”
                  </p>
                </div>
              </Reveal>
            </div>
          </div>

          {/* ---------------------------------------------------- numbers */}
          <RevealGroup className="mt-24 grid gap-x-10 gap-y-12 border-t border-line pt-16 sm:grid-cols-2 lg:grid-cols-4">
            {NUMBERS.map((n) => (
              <RevealChild key={n.label}>
                <p className="display-lg !text-[3.25rem] text-ink" data-tnum>
                  <CountUp value={n.value} suffix={n.suffix} />
                </p>
                <p className="mt-3 text-[0.9375rem] text-ink">{n.label}</p>
                <p className="mt-1 text-[0.8125rem] text-muted">{n.note}</p>
              </RevealChild>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* -------------------------------------------------------- workshop */}
      <section className="bg-ink">
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[420px] overflow-hidden">
            <SceneImage
              room="office"
              kind="wooden"
              finishId="natural-wood"
              louvreId="63"
              tilt={50}
              time="afternoon"
              className="absolute inset-0 size-full"
              alt="Hardwood blinds in the workshop office"
            />
          </div>
          <div className="flex items-center px-6 py-20 md:px-16 lg:py-28">
            <div className="max-w-lg">
              <Reveal>
                <SectionHeading
                  eyebrow="What We Stand On"
                  tone="light"
                  title="Six things we will not compromise on."
                />
              </Reveal>
              <RevealGroup className="mt-12 space-y-8">
                {pillars.map((p) => {
                  const Icon = (Icons[p.icon as keyof typeof Icons] ??
                    Icons.Sparkles) as React.ComponentType<{
                    className?: string;
                    strokeWidth?: number;
                  }>;
                  return (
                    <RevealChild key={p.title} className="flex gap-5">
                      <span className="mt-1 shrink-0 text-brand">
                        <Icon className="size-5" strokeWidth={1.2} />
                      </span>
                      <div>
                        <h3 className="text-[1.0625rem] text-white">{p.title}</h3>
                        <p className="mt-2 text-[0.875rem] leading-[1.75] text-white/55">
                          {p.body}
                        </p>
                      </div>
                    </RevealChild>
                  );
                })}
              </RevealGroup>
            </div>
          </div>
        </div>
      </section>

      <Process />
      <ContactSection />
      <FinalCta />
    </>
  );
}
