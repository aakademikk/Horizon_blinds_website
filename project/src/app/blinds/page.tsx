import PageHero from "@/components/layout/PageHero";
import ProductDetail from "@/components/sections/ProductDetail";
import LightAndPrivacy from "@/components/interactive/LightAndPrivacy";
import FaqSection from "@/components/sections/FaqSection";
import FinalCta from "@/components/sections/FinalCta";
import { CtaLink } from "@/components/ui/Cta";
import { blinds } from "@/lib/products";
import { faqs } from "@/lib/content";
import { JsonLd, breadcrumbSchema, faqSchema, pageMeta, productSchemas } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Made-to-Measure Blinds",
  description:
    "Wooden, venetian, roman, roller, perfect fit and electric blinds — measured, made and fitted across Essex by our own team.",
  path: "/blinds",
  keywords: [
    "made to measure blinds Essex",
    "wooden blinds Brentwood",
    "roman blinds Chelmsford",
    "electric blinds Essex",
    "perfect fit blinds",
  ],
});

export default function BlindsPage() {
  const relevant = faqs.filter((f) => f.group === "Products" || f.group === "Pricing");

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blinds", path: "/blinds" },
          ]),
          faqSchema(relevant),
          ...productSchemas(blinds.map((p) => p.id)),
        ]}
      />

      <PageHero
        eyebrow="The Collection"
        titleLines={["Blinds that earn", "their place at", "the window."]}
        lede="Sometimes a shutter is not the answer. Six blind families, from tactile hardwood to whisper-quiet motorised rollers — all made to measure, all fitted by us."
        breadcrumb={[{ label: "Blinds" }]}
        scene={{
          room: "office",
          kind: "wooden",
          finishId: "natural-wood",
          louvreId: "63",
          tilt: 46,
          time: "afternoon",
        }}
      >
        <div className="flex flex-wrap gap-4">
          <CtaLink href="/contact#survey" variant="gold">
            Book Free Home Survey
          </CtaLink>
          <CtaLink href="/design-studio" variant="outline" className="text-white">
            Estimate a Price
          </CtaLink>
        </div>
      </PageHero>

      {blinds.map((product, i) => (
        <ProductDetail
          key={product.id}
          product={product}
          index={i}
          anchor={product.slug.replace("-blinds", "")}
        />
      ))}

      <LightAndPrivacy />
      <FaqSection />
      <FinalCta />
    </>
  );
}
