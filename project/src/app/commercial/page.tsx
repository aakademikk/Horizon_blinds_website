import PageHero from "@/components/layout/PageHero";
import FinalCta from "@/components/sections/FinalCta";
import SceneImage from "@/components/scene/SceneImage";
import Reveal, { RevealChild, RevealGroup } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Type";
import { CtaLink } from "@/components/ui/Cta";
import EnquiryForm from "@/components/forms/EnquiryForm";
import { JsonLd, breadcrumbSchema, pageMeta } from "@/lib/seo";
import {
  Building2,
  CalendarClock,
  FileCheck2,
  Flame,
  HardHat,
  Receipt,
} from "lucide-react";

export const metadata = pageMeta({
  title: "Commercial Blinds & Shutters",
  description:
    "Commercial window coverings across Essex — offices, schools, surgeries, restaurants and developments. Fire-retardant fabrics, contract pricing and out-of-hours installation.",
  path: "/commercial",
  keywords: [
    "commercial blinds Essex",
    "office blinds Chelmsford",
    "contract window blinds",
    "fire retardant blinds",
  ],
});

const SECTORS = [
  { name: "Offices & studios", note: "Glare control at the desk, and a frontage that looks considered." },
  { name: "Schools & nurseries", note: "Child-safe by default, blackout where the projector demands it." },
  { name: "Surgeries & clinics", note: "Wipe-clean, antimicrobial finishes and complete treatment-room privacy." },
  { name: "Restaurants & bars", note: "Café style shutters and tailored romans that flatter an interior." },
  { name: "Developments", note: "Show homes through to full handover, phased to the programme." },
  { name: "Retail", note: "Sun protection that stops stock fading in the window." },
];

const ASSURANCES = [
  { icon: FileCheck2, title: "Fire-retardant fabrics", body: "BS 5867 Part 2 Type B certified fabrics available across the roller and vertical ranges, with documentation supplied." },
  { icon: HardHat, title: "Insured and compliant", body: "£5m public liability, RAMS provided in advance, DBS-checked fitters for school and healthcare work." },
  { icon: CalendarClock, title: "Out of hours", body: "Evening, weekend and phased installation so you are not closing the floor during trading." },
  { icon: Receipt, title: "Contract pricing", body: "Volume rates, itemised schedules by floor or unit, and 30-day terms for established accounts." },
  { icon: Flame, title: "Solar performance", body: "Fabric openness factors specified against orientation and glazing, not guessed at." },
  { icon: Building2, title: "Single point of contact", body: "One surveyor from tender to handover. No account manager relay." },
];

export default function CommercialPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Commercial", path: "/commercial" },
        ])}
      />

      <PageHero
        eyebrow="Commercial"
        titleLines={["Specified properly.", "Fitted around", "your trading hours."]}
        lede="Offices, schools, surgeries, restaurants and developments across Essex. Certified fabrics, documented compliance and a surveyor who stays with the job from tender to handover."
        breadcrumb={[{ label: "Commercial" }]}
        scene={{
          room: "office",
          kind: "venetian",
          finishId: "grey",
          louvreId: "47",
          tilt: 54,
          time: "afternoon",
        }}
      >
        <CtaLink href="#commercial-enquiry" variant="brand">
          Request a Site Survey
        </CtaLink>
      </PageHero>

      {/* -------------------------------------------------------- sectors */}
      <section className="section-y bg-section">
        <div className="shell">
          <Reveal>
            <SectionHeading
              eyebrow="Where We Work"
              title="Six sectors we know well."
              lede="Each asks something different of a window covering — and the wrong specification shows up within a year."
            />
          </Reveal>

          <RevealGroup className="mt-14 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {SECTORS.map((s, i) => (
              <RevealChild key={s.name} className="bg-section p-9 transition-colors duration-600 hover:bg-paper">
                <span className="eyebrow text-brand-deep" data-tnum>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="display-md mt-4 !text-[1.375rem] text-ink">{s.name}</h3>
                <p className="mt-3 text-[0.875rem] leading-[1.75] text-muted">{s.note}</p>
              </RevealChild>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ----------------------------------------------------- assurances */}
      <section className="relative isolate overflow-hidden bg-ink">
        <div className="absolute inset-0 -z-20 opacity-40">
          <SceneImage
            room="office"
            kind="roller"
            finishId="grey"
            louvreId="63"
            tilt={40}
            time="evening"
            className="size-full"
          />
        </div>
        <div aria-hidden className="absolute inset-0 -z-10 bg-ink/85" />

        <div className="shell section-y relative">
          <Reveal>
            <SectionHeading
              eyebrow="The Paperwork"
              tone="light"
              align="center"
              title="Everything a facilities manager asks for, before they ask."
            />
          </Reveal>

          <RevealGroup className="mt-16 grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {ASSURANCES.map(({ icon: Icon, title, body }) => (
              <RevealChild key={title}>
                <span className="mb-5 flex size-12 items-center justify-center border border-white/15 text-brand">
                  <Icon className="size-5" strokeWidth={1.15} />
                </span>
                <h3 className="text-[1.0625rem] text-white">{title}</h3>
                <p className="mt-3 text-[0.875rem] leading-[1.75] text-white/55">{body}</p>
              </RevealChild>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* -------------------------------------------------------- enquiry */}
      <section id="commercial-enquiry" className="section-y scroll-mt-24 bg-paper texture-paper">
        <div className="shell">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1fr] lg:gap-20">
            <Reveal>
              <SectionHeading
                eyebrow="Get In Touch"
                title={
                  <>
                    Send us a drawing,
                    <br />
                    or just a floor count.
                  </>
                }
                lede="We will come and measure, specify the fabrics against your orientation, and price it properly. Tenders and schedules of works welcome."
              />
              <p className="mt-9 text-[0.875rem] leading-relaxed text-muted">
                For projects above forty windows, or anything on a programme, call us directly and
                ask for the contracts desk.
              </p>
            </Reveal>

            <Reveal direction="left" delay={0.1}>
              <div className="border border-line bg-section p-8 md:p-12">
                <h3 className="display-md text-ink">Commercial enquiry</h3>
                <p className="mt-3 text-[0.9375rem] text-muted">
                  Choose “Commercial premises” as the room and tell us the rest in the message.
                </p>
                <div className="mt-9">
                  <EnquiryForm />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
