import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SceneImage from "@/components/scene/SceneImage";
import Reveal, { RevealChild, RevealGroup } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Type";
import { blinds, shutters, type Product } from "@/lib/products";
import { presetFor } from "@/lib/presets";
import { gbp } from "@/lib/products";

export default function ProductCategories() {
  return (
    <section id="products" className="section-y bg-section">
      <div className="shell">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <SectionHeading
              eyebrow="The Collection"
              title={
                <>
                  Six shutter styles.
                  <br />
                  Six ways to dress a blind.
                </>
              }
              lede="Every one made to the millimetre for one particular window in your home."
            />
          </Reveal>
          <Reveal delay={0.15}>
            <Link
              href="/shutters"
              className="group inline-flex shrink-0 items-center gap-2.5 text-[0.8125rem] tracking-[0.02em] text-ink"
            >
              <span className="link-underline">View the full collection</span>
              <ArrowUpRight
                className="size-4 text-gold-deep transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                strokeWidth={1.4}
              />
            </Link>
          </Reveal>
        </div>

        {/* ------------------------------------------------------- shutters */}
        <div className="mt-16">
          <Reveal>
            <h3 className="eyebrow text-faint">Plantation Shutters</h3>
          </Reveal>
          <RevealGroup className="mt-8 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {shutters.map((p) => (
              <RevealChild key={p.id}>
                <ProductCard product={p} href={`/shutters#${p.slug}`} />
              </RevealChild>
            ))}
          </RevealGroup>
        </div>

        {/* --------------------------------------------------------- blinds */}
        <div className="mt-24">
          <Reveal>
            <h3 className="eyebrow text-faint">Made-to-Measure Blinds</h3>
          </Reveal>
          <RevealGroup className="mt-8 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {blinds.map((p) => (
              <RevealChild key={p.id}>
                <ProductCard product={p} href={`/blinds#${p.slug.replace("-blinds", "")}`} />
              </RevealChild>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}

export function ProductCard({ product, href }: { product: Product; href: string }) {
  const preset = presetFor(product.id);

  return (
    <Link href={href} className="group block focus-visible:outline-offset-8">
      <div className="sheen relative aspect-[4/3.2] overflow-hidden bg-ink">
        <div className="size-full transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.055]">
          <SceneImage {...preset} className="size-full" />
        </div>

        {/* Gold hairline that draws itself along the base on hover */}
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-gold-light via-gold to-transparent transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
        />

        <span className="absolute right-4 top-4 grid size-10 place-items-center border border-white/25 bg-black/20 text-white opacity-0 backdrop-blur-sm transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100">
          <ArrowUpRight className="size-4" strokeWidth={1.4} />
        </span>
      </div>

      <div className="pt-6">
        <div className="flex items-baseline justify-between gap-4">
          <h4 className="display-md !text-[1.4375rem] text-ink transition-colors duration-500 group-hover:text-gold-deep">
            {product.name}
          </h4>
          <span className="shrink-0 text-[0.75rem] text-faint" data-tnum>
            from {gbp(Math.round((product.rate * 1.4) / 10) * 10)}
          </span>
        </div>
        <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-muted">{product.strapline}</p>
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
          {product.bestFor.map((b) => (
            <li key={b} className="text-[0.6875rem] uppercase tracking-[0.14em] text-faint">
              {b}
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
}
