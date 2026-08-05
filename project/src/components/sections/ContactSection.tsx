import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Type";
import CoverageMap from "./CoverageMap";
import { site } from "@/lib/site";

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${site.address.street}, ${site.address.locality}, ${site.address.postcode}`,
)}`;

export default function ContactSection() {
  return (
    <section id="contact" className="section-y bg-paper texture-paper">
      <div className="shell">
        <Reveal>
          <SectionHeading
            eyebrow="Where To Find Us"
            align="center"
            title="Essex, and a good way beyond it."
            lede="We are based on Canvey Island. Most of our week is spent in other people's living rooms across South Essex."
          />
        </Reveal>

        {/* ------------------------------------------------------- details */}
        <Reveal delay={0.1} className="mt-14">
          <div className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            <Detail icon={Phone} label="Telephone" value={site.phone} href={site.phoneHref} />
            <Detail icon={Mail} label="Email" value={site.email} href={`mailto:${site.email}`} />
            <Detail
              icon={MapPin}
              label="Workshop"
              value={`${site.address.locality}, ${site.address.region} ${site.address.postcode}`}
              href={mapsUrl}
              external
            />
            <Detail
              icon={Clock}
              label="Opening hours"
              value="Mon–Fri 8:30–17:30 · Sat 9:00–16:00"
            />
          </div>
        </Reveal>

        <Reveal delay={0.15} className="mt-16">
          <CoverageMap />
        </Reveal>
      </div>
    </section>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
  href,
  external,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  const body = (
    <>
      <span className="mb-4 block text-brand-deep">
        <Icon className="size-5" strokeWidth={1.2} />
      </span>
      <span className="eyebrow block text-faint">{label}</span>
      <span className="mt-2.5 block text-[0.9375rem] leading-relaxed text-ink" data-tnum>
        {value}
      </span>
    </>
  );

  const base = "block bg-section p-8 transition-colors duration-600 hover:bg-paper-deep";

  if (!href) return <div className={base}>{body}</div>;

  return (
    <a
      href={href}
      className={`${base} group`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {body}
    </a>
  );
}
