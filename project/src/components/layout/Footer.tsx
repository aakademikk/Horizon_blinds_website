import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { areas, site } from "@/lib/site";
import { blinds, shutters } from "@/lib/products";
import Wordmark from "./Wordmark";
import Newsletter from "./Newsletter";

const company = [
  { label: "About Us", href: "/about" },
  { label: "Our Process", href: "/about#process" },
  { label: "Gallery", href: "/gallery" },
  { label: "Reviews", href: "/reviews" },
  { label: "Commercial", href: "/commercial" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-brand text-white/70">
      {/* Hairline of brand across the very top */}
      <div aria-hidden className="h-px bg-gradient-to-r from-transparent via-brand/55 to-transparent" />

      <div className="shell pb-12 pt-20 md:pt-28">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          {/* ------------------------------------------------------- brand */}
          <div className="lg:col-span-4">
            <Wordmark tone="light" className="h-10 w-auto" />
            <p className="mt-8 max-w-sm text-[0.9375rem] leading-[1.8] text-white/55">
              Made-to-measure blinds, shutters and curtains. Measured in your home, fitted by
              the same people who quoted for them, across South Essex.
            </p>

            <div className="mt-9 space-y-4 text-[0.875rem]">
              <a
                href={site.phoneHref}
                className="group flex items-center gap-3 text-white/80 transition-colors duration-500 hover:text-brand-light"
              >
                <Phone className="size-4 shrink-0 text-brand" strokeWidth={1.4} />
                <span className="link-underline" data-tnum>{site.phone}</span>
              </a>
              <a
                href={`mailto:${site.email}`}
                className="group flex items-center gap-3 text-white/80 transition-colors duration-500 hover:text-brand-light"
              >
                <Mail className="size-4 shrink-0 text-brand" strokeWidth={1.4} />
                <span className="link-underline break-all">{site.email}</span>
              </a>
              <p className="flex items-start gap-3 text-white/55">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={1.4} />
                <span>
                  {site.address.street}
                  <br />
                  {site.address.locality}, {site.address.region} {site.address.postcode}
                </span>
              </p>
            </div>

            <div className="mt-9 flex gap-3">
              {[
                { href: site.social.instagram, Icon: Instagram, label: "Instagram" },
                { href: site.social.facebook, Icon: Facebook, label: "Facebook" },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid size-11 place-items-center border border-white/12 text-white/60 transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-brand hover:text-brand-light"
                >
                  <Icon className="size-[17px]" strokeWidth={1.4} />
                </a>
              ))}
            </div>
          </div>

          {/* ------------------------------------------------------- links */}
          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-3">
            <FooterColumn title="Shutters">
              {shutters.map((p) => (
                <FooterLink key={p.id} href={`/shutters#${p.slug}`}>
                  {p.name.replace(" Shutters", "")}
                </FooterLink>
              ))}
            </FooterColumn>

            <FooterColumn title="Blinds">
              {blinds.map((p) => (
                <FooterLink key={p.id} href={`/blinds#${p.slug.replace("-blinds", "")}`}>
                  {p.name.replace(" Blinds", "")}
                </FooterLink>
              ))}
            </FooterColumn>

            <FooterColumn title="Company">
              {company.map((c) => (
                <FooterLink key={c.href} href={c.href}>
                  {c.label}
                </FooterLink>
              ))}
            </FooterColumn>
          </div>

          {/* --------------------------------------------------- newsletter */}
          <div className="lg:col-span-3">
            <FooterColumn title="Areas Covered">
              {areas.map((a) => (
                <FooterLink key={a.slug} href={`/areas/${a.slug}`}>
                  {a.name}
                </FooterLink>
              ))}
            </FooterColumn>

            <div className="mt-12">
              <h3 className="eyebrow text-brand">The Journal</h3>
              <p className="mt-5 text-[0.875rem] leading-relaxed text-white/55">
                Occasional letters on interiors, light and the craft behind a good shutter. No more
                than once a month.
              </p>
              <Newsletter />
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------- opening hours */}
        <div className="mt-16 grid gap-6 border-t border-white/10 pt-10 sm:grid-cols-3">
          {site.hours.map((h) => (
            <div key={h.days}>
              <p className="eyebrow text-white/60">{h.days}</p>
              <p className="mt-2 text-[0.9375rem] text-white/75" data-tnum>
                {h.time}
              </p>
            </div>
          ))}
        </div>

        {/* --------------------------------------------------------- legal */}
        <div className="mt-12 flex flex-col gap-5 border-t border-white/10 pt-8 text-[0.75rem] text-white/62 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.name}. Registered in England &amp; Wales. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-7 gap-y-2">
            <Link href="/privacy" className="link-underline transition-colors hover:text-white/70">
              Privacy
            </Link>
            <Link href="/terms" className="link-underline transition-colors hover:text-white/70">
              Terms
            </Link>
            <Link href="/sitemap.xml" className="link-underline transition-colors hover:text-white/70">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="eyebrow text-brand">{title}</h3>
      <ul className="mt-6 space-y-3.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="link-underline text-[0.875rem] text-white/55 transition-colors duration-500 hover:text-white"
      >
        {children}
      </Link>
    </li>
  );
}
