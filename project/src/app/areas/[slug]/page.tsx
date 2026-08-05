import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, MapPin, ShieldCheck } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import { ProductCard } from "@/components/sections/ProductCategories";
import Testimonials from "@/components/sections/Testimonials";
import Process from "@/components/sections/Process";
import SurveySection from "@/components/sections/SurveySection";
import FaqSection from "@/components/sections/FaqSection";
import FinalCta from "@/components/sections/FinalCta";
import Reveal, { RevealChild, RevealGroup } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Type";
import { areas, site } from "@/lib/site";
import { products } from "@/lib/products";
import {
  JsonLd,
  abs,
  breadcrumbSchema,
  faqSchema,
  localBusinessSchema,
  pageMeta,
} from "@/lib/seo";
import { faqs } from "@/lib/content";

export function generateStaticParams() {
  return areas.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const area = areas.find((a) => a.slug === slug);
  if (!area) return {};

  return pageMeta({
    title: `Shutters & Blinds in ${area.name}`,
    description: `Made-to-measure plantation shutters and blinds in ${area.name}, Essex. Free home survey, our own fitters and a five-year guarantee. Covering ${area.postcodes.join(", ")}.`,
    path: `/areas/${area.slug}`,
    keywords: [
      `shutters ${area.name}`,
      `blinds ${area.name}`,
      `plantation shutters ${area.name} Essex`,
      `window blinds ${area.postcodes[0]}`,
    ],
  });
}

export default async function AreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const area = areas.find((a) => a.slug === slug);
  if (!area) notFound();

  const featured = area.popular
    .map((name) =>
      products.find(
        (p) => p.name.toLowerCase().includes(name.toLowerCase().replace(" shutters", "").replace(" blinds", "")),
      ),
    )
    .filter((p): p is NonNullable<typeof p> => !!p)
    .slice(0, 3);

  const others = areas.filter((a) => a.slug !== area.slug);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Areas", path: "/#contact" },
            { name: area.name, path: `/areas/${area.slug}` },
          ]),
          {
            ...localBusinessSchema(),
            "@id": `${abs(`/areas/${area.slug}`)}#business`,
            name: `${site.name} — ${area.name}`,
            areaServed: {
              "@type": "City",
              name: area.name,
              containedInPlace: { "@type": "AdministrativeArea", name: "Essex" },
            },
          },
          faqSchema(faqs.filter((f) => f.group === "Getting started" || f.group === "Pricing")),
        ]}
      />

      <PageHero
        eyebrow={`${area.name} · Essex`}
        titleLines={["Shutters and blinds", `in ${area.name}.`]}
        lede={area.intro}
        breadcrumb={[{ label: area.name }]}
        scene={{
          room: "living",
          kind: "shutter",
          finishId: "silk-white",
          louvreId: "76",
          tilt: 46,
          time: "morning",
        }}
      >
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-[0.8125rem] text-white/65">
          <span className="flex items-center gap-2">
            <MapPin className="size-4 text-brand" strokeWidth={1.4} />
            <span data-tnum>{area.postcodes.join(" · ")}</span>
          </span>
          <span className="flex items-center gap-2.5">
            <ShieldCheck className="size-4 text-brand" strokeWidth={1.4} />
            <span>
              <span data-tnum>{site.guarantee.shutters}</span>-year shutter guarantee · free fitting
            </span>
          </span>
        </div>
      </PageHero>

      {/* --------------------------------------------------------- context */}
      <section className="section-y bg-section">
        <div className="shell">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-5">
              <Reveal>
                <SectionHeading
                  eyebrow="Local knowledge"
                  title={`What ${area.name} windows ask for`}
                />
              </Reveal>
            </div>
            <div className="lg:col-span-7">
              <Reveal delay={0.1}>
                <p className="text-[1.0625rem] leading-[1.85] text-muted">{area.character}</p>
                <div className="mt-10 grid gap-8 sm:grid-cols-2">
                  <div>
                    <h3 className="eyebrow text-faint">Neighbourhoods covered</h3>
                    <ul className="mt-4 space-y-2 text-[0.9375rem] text-body">
                      {area.landmarks.map((l) => (
                        <li key={l} className="flex items-center gap-2.5">
                          <span aria-hidden className="size-1 rotate-45 bg-brand" />
                          {l}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="eyebrow text-faint">Most requested here</h3>
                    <ul className="mt-4 space-y-2 text-[0.9375rem] text-body">
                      {area.popular.map((p) => (
                        <li key={p} className="flex items-center gap-2.5">
                          <span aria-hidden className="size-1 rotate-45 bg-brand" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* --------------------------------------------------- products */}
          {featured.length > 0 && (
            <RevealGroup className="mt-24 grid gap-x-8 gap-y-14 border-t border-line pt-16 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((p) => (
                <RevealChild key={p.id}>
                  <ProductCard
                    product={p}
                    href={`/${p.family}#${p.slug.replace("-blinds", "")}`}
                  />
                </RevealChild>
              ))}
            </RevealGroup>
          )}
        </div>
      </section>

      <Testimonials />
      <Process />
      <SurveySection />

      {/* ---------------------------------------------------- other areas */}
      <section className="section-y bg-section">
        <div className="shell">
          <Reveal>
            <SectionHeading
              eyebrow="Nearby"
              align="center"
              title="We are probably working on your street this week."
              className="mb-14"
            />
          </Reveal>
          <RevealGroup className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
            {others.map((a) => (
              <RevealChild key={a.slug}>
                <Link
                  href={`/areas/${a.slug}`}
                  className="group flex h-full flex-col justify-between gap-6 bg-section p-8 transition-colors duration-600 hover:bg-paper"
                >
                  <span className="display-md !text-[1.25rem] text-ink transition-colors duration-500 group-hover:text-brand-deep">
                    {a.name}
                  </span>
                  <span className="flex items-center justify-between gap-3 text-[0.75rem] text-faint">
                    <span data-tnum>{a.postcodes.join(" · ")}</span>
                    <ArrowUpRight
                      className="size-4 shrink-0 text-brand-deep transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      strokeWidth={1.4}
                    />
                  </span>
                </Link>
              </RevealChild>
            ))}
          </RevealGroup>
        </div>
      </section>

      <FaqSection limit={6} />
      <FinalCta />
    </>
  );
}
