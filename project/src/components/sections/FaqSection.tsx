import Link from "next/link";
import Accordion from "@/components/ui/Accordion";
import Reveal from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Type";
import { faqs } from "@/lib/content";
import { site } from "@/lib/site";

export default function FaqSection({ limit }: { limit?: number }) {
  const items = limit ? faqs.slice(0, limit) : faqs;

  return (
    <section id="faq" className="section-y bg-section">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <SectionHeading
                eyebrow="Questions"
                title={
                  <>
                    The things
                    <br />
                    people ask us.
                  </>
                }
                lede="If yours is not here, call and ask. We would rather talk it through than have you guess."
              />
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-9 flex flex-col gap-3">
                <a href={site.phoneHref} className="btn-base btn-ink self-start">
                  {site.phone}
                </a>
                <Link href="/contact" className="link-underline mt-2 self-start text-[0.875rem] text-muted">
                  Or send us a message
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <Accordion items={items} defaultOpen={0} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
