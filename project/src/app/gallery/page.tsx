import PageHero from "@/components/layout/PageHero";
import GalleryGrid from "@/components/sections/GalleryGrid";
import BeforeAfter from "@/components/interactive/BeforeAfter";
import Projects from "@/components/sections/Projects";
import FinalCta from "@/components/sections/FinalCta";
import { SectionHeading } from "@/components/ui/Type";
import Reveal from "@/components/ui/Reveal";
import { JsonLd, breadcrumbSchema, pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Gallery",
  description:
    "Shutter and blind installations across Essex — modern, traditional, bay windows, bedrooms, bathrooms, kitchens and commercial.",
  path: "/gallery",
});

export default function GalleryPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Gallery", path: "/gallery" },
        ])}
      />

      <PageHero
        eyebrow="Inspiration"
        titleLines={["Rooms we have", "changed the light in."]}
        lede="Every scene here is drawn from a real specification — the same room, product, finish, louvre width and time of day we fitted it for."
        breadcrumb={[{ label: "Gallery" }]}
        scene={{
          room: "bedroom",
          kind: "shutter",
          finishId: "pure-white",
          louvreId: "89",
          tilt: 62,
          time: "morning",
        }}
      />

      <section className="section-y bg-section">
        <div className="shell">
          <Reveal>
            <SectionHeading
              eyebrow="Browse"
              title="Filter by room, style or setting."
              lede="Click any image to open it full size, then use the arrow keys to move through the set."
              className="mb-12"
            />
          </Reveal>
          <GalleryGrid />
        </div>
      </section>

      <BeforeAfter />
      <Projects />
      <FinalCta />
    </>
  );
}
