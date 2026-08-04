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
  description: `Fab Shutters & Blinds has been measuring, making and fitting window coverings across Essex since ${site.founded}. Our own fitters, our own workshop, our own guarantee.`,
  path: "/about",
});

const NUMBERS = [
  { value: 15, suffix: "+", label: "Years trading", note: `Since ${site.founded}` },
  { value: 6200, suffix: "", label: "Windows dressed", note: "And counting" },
  { value: 4.9, decimals: 1, suffix: "", label: "Average rating", note: "Across four platforms" },
  { value: 100, suffix: "%", label: "Own fitters", note: "Never subcontracted" },
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
                <Eyebrow className="mb-7">Since {site.founded}</Eyebrow>
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
                    Fab Shutters &amp; Blinds started in {site.founded} in a unit off the Ongar Road
                    with one van, one fitter and a conviction that most window coverings in Essex
                    were being sold by people who would never have to come back and look at them.
                  </p>
                  <p>
                    Fifteen years later the van has become several and the unit has become a proper
                    workshop, but the shape of the thing has not changed. The person who measures
                    your windows quotes them. The people who fit them are on our payroll. If a
                    louvre pin fails in year four, the number you call is the number you already
                    have.
                  </p>
                  <p>
                    We have deliberately not expanded beyond the county. It means we can be at a
                    house in Rayleigh by ten and back in Brentwood for a two o&rsquo;clock survey, and it
                    means our fitters know what a 1930s Essex bay is going to do before they put a
                    laser on it. That local knowledge is worth more than a national brochure.
                  </p>
                  <p className="border-l-2 border-gold pl-6 font-display text-[1.375rem] font-light italic leading-relaxed text-ink">
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
                  <CountUp value={n.value} decimals={n.decimals ?? 0} suffix={n.suffix} />
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
                      <span className="mt-1 shrink-0 text-gold">
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
