import PageHero from "@/components/layout/PageHero";
import SurveySection from "@/components/sections/SurveySection";
import ContactSection from "@/components/sections/ContactSection";
import FaqSection from "@/components/sections/FaqSection";
import QuoteEstimator from "@/components/interactive/QuoteEstimator";
import Reveal from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Type";
import { CtaLink } from "@/components/ui/Cta";
import { site } from "@/lib/site";
import { JsonLd, breadcrumbSchema, pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Contact & Free Home Survey",
  description: `Book a free, no-obligation home survey with ${site.name}. Call ${site.phone} or send the form — evenings and Saturdays available across Essex.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />

      <PageHero
        eyebrow="Free Home Survey"
        titleLines={["Let us come", "and look properly."]}
        lede="An hour at your kitchen table with the full sample range. Honest advice, an itemised quotation the same evening, and no follow-up unless you ask for one."
        breadcrumb={[{ label: "Contact" }]}
        scene={{
          room: "kitchen",
          kind: "shutter",
          finishId: "cream",
          louvreId: "63",
          tilt: 44,
          time: "morning",
        }}
      >
        <div className="flex flex-wrap items-center gap-6">
          <CtaLink href={site.phoneHref} variant="brand">
            {site.phone}
          </CtaLink>
          <a
            href={`mailto:${site.email}`}
            className="link-underline text-[0.9375rem] text-white/75 transition-colors hover:text-brand-light"
          >
            {site.email}
          </a>
        </div>
      </PageHero>

      <SurveySection />

      {/* -------------------------------------------------------- estimator */}
      <section id="estimate" className="section-y scroll-mt-24 bg-section">
        <div className="shell">
          <Reveal>
            <SectionHeading
              eyebrow="Before You Call"
              align="center"
              title="Get a sense of the numbers."
              lede="Set the window, the product and the finish, and see roughly where it lands. Indicative only — a survey produces the real figure."
              className="mb-14"
            />
          </Reveal>
          <QuoteEstimator />
        </div>
      </section>

      <ContactSection />
      <FaqSection />
    </>
  );
}
