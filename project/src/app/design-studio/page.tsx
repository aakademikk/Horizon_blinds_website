import PageHero from "@/components/layout/PageHero";
import ProductExplorer from "@/components/interactive/ProductExplorer";
import LightAndPrivacy from "@/components/interactive/LightAndPrivacy";
import ProductFinder from "@/components/interactive/ProductFinder";
import SavingsCalculator from "@/components/interactive/SavingsCalculator";
import QuoteEstimator from "@/components/interactive/QuoteEstimator";
import BeforeAfter from "@/components/interactive/BeforeAfter";
import FinalCta from "@/components/sections/FinalCta";
import Reveal from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Type";
import { JsonLd, breadcrumbSchema, pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Design Studio",
  description:
    "Configure shutters and blinds room by room, test light and privacy through the day, find the right product in five questions and estimate the investment — all before anybody visits.",
  path: "/design-studio",
  keywords: ["shutter visualiser", "blinds price estimator", "window covering configurator"],
});

const TOOLS = [
  { href: "#explorer", label: "Room Visualiser" },
  { href: "#light", label: "Light & Privacy" },
  { href: "#finder", label: "Product Finder" },
  { href: "#savings", label: "Savings Calculator" },
  { href: "#estimator", label: "Live Estimate" },
];

export default function DesignStudioPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Design Studio", path: "/design-studio" },
        ])}
      />

      <PageHero
        eyebrow="Design Studio"
        titleLines={["Try it on", "before we", "come round."]}
        lede="Five tools that answer the questions people usually spend a survey asking. Nothing here is a quotation — but it will get you a long way towards knowing what you want."
        breadcrumb={[{ label: "Design Studio" }]}
        scene={{
          room: "living",
          kind: "shutter",
          finishId: "anthracite",
          louvreId: "89",
          tilt: 56,
          time: "evening",
        }}
      >
        <ul className="flex flex-wrap gap-x-6 gap-y-3">
          {TOOLS.map((t) => (
            <li key={t.href}>
              <a
                href={t.href}
                className="link-underline text-[0.8125rem] text-white/70 transition-colors hover:text-brand-light"
              >
                {t.label}
              </a>
            </li>
          ))}
        </ul>
      </PageHero>

      <ProductExplorer />
      <LightAndPrivacy />

      {/* ---------------------------------------------------------- finder */}
      <section id="finder" className="section-y scroll-mt-24 bg-section">
        <div className="shell">
          <Reveal>
            <SectionHeading
              eyebrow="Product Finder"
              align="center"
              title="Five questions. Three recommendations."
              lede="Answer honestly rather than aspirationally — the shortlist is better for it."
              className="mb-14"
            />
          </Reveal>
          <ProductFinder />
        </div>
      </section>

      {/* --------------------------------------------------------- savings */}
      <section id="savings" className="section-y scroll-mt-24 bg-paper texture-paper">
        <div className="shell">
          <Reveal>
            <SectionHeading
              eyebrow="Savings Calculator"
              title={
                <>
                  What a closed panel
                  <br />
                  is actually worth.
                </>
              }
              lede="A shutter creates a still pocket of air against the glass. Over a decade, that adds up — here is a rough sense of how much."
              className="mb-14"
            />
          </Reveal>
          <SavingsCalculator />
        </div>
      </section>

      <BeforeAfter />

      {/* ------------------------------------------------------- estimator */}
      <section id="estimator" className="section-y scroll-mt-24 bg-paper texture-paper">
        <div className="shell">
          <Reveal>
            <SectionHeading
              eyebrow="Live Estimate"
              align="center"
              title="Estimated investment, updated as you go."
              lede="Set the window type, the measurements and the specification. Every figure is a considered range, never a quotation."
              className="mb-14"
            />
          </Reveal>
          <QuoteEstimator />
        </div>
      </section>

      <FinalCta />
    </>
  );
}
