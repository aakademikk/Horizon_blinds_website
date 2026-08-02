import { Check } from "lucide-react";
import RoomScene from "@/components/scene/RoomScene";
import Reveal from "@/components/ui/Reveal";
import { CtaLink } from "@/components/ui/Cta";
import { Eyebrow } from "@/components/ui/Type";
import { gbp, type Product } from "@/lib/products";
import { presetFor } from "@/lib/presets";

const SCORE_LABELS: { key: keyof Product["scores"]; label: string }[] = [
  { key: "privacy", label: "Privacy" },
  { key: "light", label: "Light control" },
  { key: "insulation", label: "Insulation" },
  { key: "durability", label: "Durability" },
  { key: "maintenance", label: "Easy upkeep" },
];

/** Alternating editorial rows — image left, then image right, all the way down. */
export default function ProductDetail({
  product,
  index,
  anchor,
}: {
  product: Product;
  index: number;
  anchor: string;
}) {
  const flip = index % 2 === 1;

  return (
    <article
      id={anchor}
      className={`scroll-mt-28 border-b border-line ${index % 2 === 1 ? "bg-paper" : "bg-section"}`}
    >
      <div className="shell section-y">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal
            direction={flip ? "right" : "left"}
            className={flip ? "lg:order-2" : ""}
            duration={1.1}
          >
            <figure className="sheen relative aspect-[4/3.2] overflow-hidden bg-ink shadow-[0_40px_90px_-55px_rgba(35,27,12,0.5)]">
              <RoomScene
                {...presetFor(product.id)}
                className="size-full"
                title={`${product.name} — ${product.strapline}`}
              />
            </figure>
          </Reveal>

          <div className={flip ? "lg:order-1" : ""}>
            <Reveal>
              <Eyebrow className="mb-6">
                {product.family === "shutters" ? "Plantation Shutters" : "Made-to-Measure Blinds"}
              </Eyebrow>
              <h2 className="display-lg text-ink">{product.name}</h2>
              <p className="mt-4 font-display text-[1.375rem] font-light italic text-gold-deep">
                {product.strapline}
              </p>
              <p className="mt-7 text-[1rem] leading-[1.85] text-muted">{product.description}</p>
            </Reveal>

            <Reveal delay={0.12}>
              <ul className="mt-9 grid gap-3 sm:grid-cols-2">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[0.875rem] text-body">
                    <Check className="mt-0.5 size-4 shrink-0 text-gold-deep" strokeWidth={1.5} />
                    {f}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.18}>
              <dl className="mt-10 grid gap-x-8 gap-y-4 border-t border-line pt-8 sm:grid-cols-2">
                {SCORE_LABELS.map(({ key, label }) => (
                  <div key={key} className="flex items-center gap-4">
                    <dt className="w-28 shrink-0 text-[0.75rem] uppercase tracking-[0.12em] text-faint">
                      {label}
                    </dt>
                    <dd className="flex flex-1 items-center gap-3">
                      <span className="sr-only">{product.scores[key]} out of 5</span>
                      <span aria-hidden className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <span
                            key={n}
                            className={`h-[3px] w-5 ${
                              n <= product.scores[key] ? "bg-gold" : "bg-line"
                            }`}
                          />
                        ))}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-10 flex flex-wrap items-center gap-6">
                <CtaLink href="/contact#survey" variant="ink">
                  Book Free Survey
                </CtaLink>
                <p className="text-[0.8125rem] text-muted" data-tnum>
                  From {gbp(Math.round((product.rate * 1.4) / 10) * 10)} per window, supplied and
                  fitted
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </article>
  );
}
