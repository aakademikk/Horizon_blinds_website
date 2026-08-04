import Hero from "@/components/sections/Hero";
import TrustStrip from "@/components/sections/TrustStrip";
import ProductExplorer from "@/components/interactive/ProductExplorer";
import WhyChoose from "@/components/sections/WhyChoose";
import ProductCategories from "@/components/sections/ProductCategories";
import LightAndPrivacy from "@/components/interactive/LightAndPrivacy";
import GallerySection from "@/components/sections/GallerySection";
import BeforeAfter from "@/components/interactive/BeforeAfter";
import Process from "@/components/sections/Process";
import Comparison from "@/components/sections/Comparison";
import Testimonials from "@/components/sections/Testimonials";
import Projects from "@/components/sections/Projects";
import SurveySection from "@/components/sections/SurveySection";
import FaqSection from "@/components/sections/FaqSection";
import ContactSection from "@/components/sections/ContactSection";
import FinalCta from "@/components/sections/FinalCta";
import { JsonLd, faqSchema, reviewSchema } from "@/lib/seo";
import { faqs } from "@/lib/content";

export default function HomePage() {
  return (
    <>
      <JsonLd data={[faqSchema(faqs.slice(0, 8)), reviewSchema()]} />

      <Hero />
      <TrustStrip />

      {/*
        The explorer sits third on purpose. It is the thing that separates this
        site from a brochure, and it teaches the range while the visitor plays —
        so it earns its place above the catalogue rather than below it.
      */}
      <ProductExplorer />

      <WhyChoose />
      <ProductCategories limit={3} />
      <LightAndPrivacy />
      <GallerySection />
      <BeforeAfter />
      <Process />
      <Comparison />
      <Testimonials />
      <Projects limit={3} />
      <SurveySection />
      <FaqSection limit={8} />
      <ContactSection />
      <FinalCta />
    </>
  );
}
