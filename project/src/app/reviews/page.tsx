import PageHero from "@/components/layout/PageHero";
import Testimonials from "@/components/sections/Testimonials";
import Projects from "@/components/sections/Projects";
import FinalCta from "@/components/sections/FinalCta";
import Reveal, { RevealChild, RevealGroup } from "@/components/ui/Reveal";
import { SectionHeading, Stars } from "@/components/ui/Type";
import { promises, reviews, reviewsAreReal } from "@/lib/content";
import { site } from "@/lib/site";
import { JsonLd, breadcrumbSchema, pageMeta, reviewSchema } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Reviews",
  description: `What South Essex homeowners say about ${site.name} — and what we promise before a single window is measured.`,
  path: "/reviews",
});

export default function ReviewsPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Reviews", path: "/reviews" },
          ]),
          reviewSchema(),
        ]}
      />

      <PageHero
        eyebrow="In Their Words"
        titleLines={["Recommended,", "window by window,", "across South Essex."]}
        lede="Almost all of our work comes by word of mouth. Here is what people say afterwards — and what we commit to beforehand."
        breadcrumb={[{ label: "Reviews" }]}
        scene={{
          room: "living",
          kind: "shutter",
          finishId: "white",
          louvreId: "63",
          tilt: 32,
          time: "evening",
        }}
      />

      {/* --------------------------------------------------------- promises */}
      <section className="border-b border-line bg-section">
        <div className="shell py-16">
          <RevealGroup className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {promises.map((p) => (
              <RevealChild key={p.label} className="text-center">
                <p className="eyebrow text-faint">{p.label}</p>
                <p className="mt-4 display-lg !text-[2.5rem] text-ink">{p.value}</p>
                <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted">{p.note}</p>
              </RevealChild>
            ))}
          </RevealGroup>
        </div>
      </section>

      <Testimonials />

      {/* ----------------------------------------------------- full reviews */}
      <section className="section-y bg-paper texture-paper">
        <div className="shell">
          <Reveal>
            <SectionHeading
              eyebrow="Every Word"
              title="Read them in full."
              lede="No edits, no trimming for the website."
              className="mb-14"
            />
          </Reveal>

          {!reviewsAreReal && (
            <p
              role="note"
              className="mb-12 border-l-2 border-brand bg-paper-deep px-6 py-5 text-[0.875rem] leading-relaxed text-body"
            >
              <strong className="font-medium">Placeholder content.</strong> The quotes below are
              sample copy showing how real reviews will sit in this layout. They are not
              testimonials from customers, and no review markup is published to search engines
              while this notice is showing.
            </p>
          )}

          <RevealGroup className="columns-1 gap-8 lg:columns-2 [&>*]:mb-8 [&>*]:break-inside-avoid">
            {reviews.map((r) => (
              <RevealChild key={r.id}>
                <figure className="border border-line bg-section p-8 transition-colors duration-700 hover:border-brand/45 md:p-10">
                  <div className="flex items-center justify-between gap-4">
                    <Stars size={13} rating={r.rating} label={`${r.rating} out of 5`} />
                    <span className="text-[0.6875rem] uppercase tracking-[0.16em] text-faint">
                      {r.source}
                    </span>
                  </div>

                  <blockquote className="mt-6">
                    <p className="display-md !text-[1.375rem] text-ink">“{r.headline}”</p>
                    <p className="mt-5 text-[0.9375rem] leading-[1.85] text-muted">{r.body}</p>
                  </blockquote>

                  <figcaption className="mt-7 flex items-center gap-4 border-t border-line pt-6">
                    <span
                      aria-hidden
                      className="grid size-11 shrink-0 place-items-center rounded-full border border-brand/40 font-display text-[0.875rem] text-brand-deep"
                    >
                      {r.initials}
                    </span>
                    <span>
                      <span className="block text-[0.9375rem] text-ink">{r.name}</span>
                      <span className="mt-0.5 block text-[0.75rem] text-muted">
                        {r.location} ·{" "}
                        <time dateTime={r.date}>
                          {new Date(r.date).toLocaleDateString("en-GB", {
                            month: "long",
                            year: "numeric",
                          })}
                        </time>
                      </span>
                      <span className="mt-1 block text-[0.75rem] text-faint">{r.product}</span>
                    </span>
                  </figcaption>
                </figure>
              </RevealChild>
            ))}
          </RevealGroup>
        </div>
      </section>

      <Projects />
      <FinalCta />
    </>
  );
}
