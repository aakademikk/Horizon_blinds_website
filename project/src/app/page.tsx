import Hero from "@/components/sections/Hero";
import TrustStrip from "@/components/sections/TrustStrip";
import WhyChoose from "@/components/sections/WhyChoose";
import ProductCategories from "@/components/sections/ProductCategories";
import ProductExplorer from "@/components/interactive/ProductExplorer";
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
      <WhyChoose />
      <ProductCategories />
      <ProductExplorer />
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
