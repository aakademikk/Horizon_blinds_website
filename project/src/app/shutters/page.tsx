import PageHero from "@/components/layout/PageHero";
import ProductDetail from "@/components/sections/ProductDetail";
import Comparison from "@/components/sections/Comparison";
import Process from "@/components/sections/Process";
import FaqSection from "@/components/sections/FaqSection";
import FinalCta from "@/components/sections/FinalCta";
import { CtaLink } from "@/components/ui/Cta";
import { shutters } from "@/lib/products";
import { faqs } from "@/lib/content";
import { JsonLd, breadcrumbSchema, faqSchema, pageMeta, productSchemas } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Plantation Shutters",
  description:
    "Six styles of made-to-measure plantation shutter, hand-finished and professionally installed across Essex. Full height, tier on tier, café style, tracked, bay window and solid panel.",
  path: "/shutters",
  keywords: [
    "plantation shutters Essex",
    "full height shutters",
    "tier on tier shutters",
    "bay window shutters Essex",
    "café style shutters",
  ],
});

export default function ShuttersPage() {
  const relevant = faqs.filter((f) => f.group === "Products" || f.group === "Practical");

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Shutters", path: "/shutters" },
          ]),
          faqSchema(relevant),
          ...productSchemas(shutters.map((p) => p.id)),
        ]}
      />

      <PageHero
        eyebrow="The Collection"
        titleLines={["Plantation shutters,", "made for one window", "and one window only."]}
        lede="Six styles, four louvre widths, forty-two finishes. Every panel manufactured to the measurements of your aperture — never cut down from stock and adjusted on site."
        breadcrumb={[{ label: "Shutters" }]}
        scene={{
          room: "living",
          kind: "shutter",
          finishId: "silk-white",
          louvreId: "76",
          tilt: 48,
          time: "morning",
        }}
      >
        <div className="flex flex-wrap gap-4">
          <CtaLink href="/contact#survey" variant="gold">
            Book Free Home Survey
          </CtaLink>
          <CtaLink href="/design-studio" variant="outline" className="text-white">
            Design Yours
          </CtaLink>
        </div>
      </PageHero>

      {shutters.map((product, i) => (
        <ProductDetail key={product.id} product={product} index={i} anchor={product.slug} />
      ))}

      <Comparison />
      <Process />
      <FaqSection />
      <FinalCta />
    </>
  );
}
