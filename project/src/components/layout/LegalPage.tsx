import Link from "next/link";
import { Eyebrow } from "@/components/ui/Type";
import Reveal from "@/components/ui/Reveal";

export default function LegalPage({
  eyebrow,
  title,
  updated,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  intro: string;
  sections: { heading: string; body: string[] }[];
}) {
  return (
    <>
      <div className="border-b border-line bg-paper pb-16 pt-40 texture-paper">
        <div className="shell-narrow">
          <nav aria-label="Breadcrumb" className="mb-9">
            <ol className="flex items-center gap-2 text-[0.75rem] text-muted">
              <li>
                <Link href="/" className="link-underline hover:text-ink">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-ink">
                {title}
              </li>
            </ol>
          </nav>

          <Eyebrow className="mb-6">{eyebrow}</Eyebrow>
          <h1 className="display-xl text-ink">{title}</h1>
          <p className="lede mt-7">{intro}</p>
          <p className="mt-8 text-[0.75rem] uppercase tracking-[0.16em] text-faint">
            Last updated {updated}
          </p>
        </div>
      </div>

      <article className="section-y bg-section">
        <div className="shell-narrow">
          {/* Contents */}
          <nav aria-label="On this page" className="mb-16 border-y border-line py-7">
            <h2 className="eyebrow mb-5 text-faint">On this page</h2>
            <ol className="grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
              {sections.map((s, i) => (
                <li key={s.heading} className="flex gap-3 text-[0.875rem]">
                  <span className="text-gold-deep" data-tnum>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <a href={`#${slug(s.heading)}`} className="link-underline text-muted hover:text-ink">
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="space-y-14">
            {sections.map((s, i) => (
              <Reveal key={s.heading} as="section" delay={0.03 * i}>
                <div id={slug(s.heading)} className="scroll-mt-28">
                  <h2 className="display-md text-ink">{s.heading}</h2>
                  <div className="mt-5 space-y-5">
                    {s.body.map((p, j) => (
                      <p key={j} className="text-[0.9375rem] leading-[1.85] text-muted">
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </article>
    </>
  );
}

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
