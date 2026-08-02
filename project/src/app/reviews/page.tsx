import PageHero from "@/components/layout/PageHero";
import Testimonials from "@/components/sections/Testimonials";
import Projects from "@/components/sections/Projects";
import FinalCta from "@/components/sections/FinalCta";
import Reveal, { RevealChild, RevealGroup } from "@/components/ui/Reveal";
import { SectionHeading, Stars } from "@/components/ui/Type";
import CountUp from "@/components/ui/CountUp";
import { reviewPlatforms, reviews } from "@/lib/content";
import { site } from "@/lib/site";
import { JsonLd, breadcrumbSchema, pageMeta, reviewSchema } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Reviews",
  description: `Rated ${site.rating.value} from ${site.rating.count} reviews across Google, Checkatrade, Trustpilot and Facebook. Read what Essex homeowners say about Fab Shutters & Blinds.`,
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
        titleLines={[`${site.rating.count} reviews.`, "Not one of them", "written by us."]}
        lede="We have been trading in Essex since 2009 and almost all of our work now comes by recommendation. These are the people who made that happen."
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

      {/* ------------------------------------------------------- scoreboard */}
      <section className="border-b border-line bg-section">
        <div className="shell py-16">
          <RevealGroup className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {reviewPlatforms.map((p) => (
              <RevealChild key={p.name} className="text-center">
                <p className="eyebrow text-faint">{p.name}</p>
                <p className="mt-4 display-lg !text-[3rem] text-ink" data-tnum>
                  <CountUp value={p.score} decimals={1} />
                  {"suffix" in p && p.suffix ? (
                    <span className="text-[1.25rem] text-muted">{p.suffix}</span>
                  ) : null}
                </p>
                <div className="mt-3 flex justify-center">
                  <Stars
                    size={13}
                    rating={"suffix" in p && p.suffix ? p.score / 2 : p.score}
                    label={`${p.score} on ${p.name}`}
                  />
                </div>
                <p className="mt-3 text-[0.8125rem] text-muted" data-tnum>
                  {p.count} reviews
                </p>
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

          <RevealGroup className="columns-1 gap-8 lg:columns-2 [&>*]:mb-8 [&>*]:break-inside-avoid">
            {reviews.map((r) => (
              <RevealChild key={r.id}>
                <figure className="border border-line bg-section p-8 transition-colors duration-700 hover:border-gold/45 md:p-10">
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
                      className="grid size-11 shrink-0 place-items-center rounded-full border border-gold/40 font-display text-[0.875rem] text-gold-deep"
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
