import { CalendarClock, MessageSquareQuote, Ruler, ShieldOff } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Type";
import EnquiryForm from "@/components/forms/EnquiryForm";
import RoomScene from "@/components/scene/RoomScene";

const PROMISES = [
  {
    icon: CalendarClock,
    title: "Free consultation",
    body: "An hour at your kitchen table with the full sample range. Evenings and Saturdays included.",
  },
  {
    icon: MessageSquareQuote,
    title: "Expert advice",
    body: "Honest guidance on what suits your windows — including when the cheaper option is the right one.",
  },
  {
    icon: ShieldOff,
    title: "No obligation",
    body: "An itemised written quotation the same evening. Take as long as you like. We will not chase you.",
  },
  {
    icon: Ruler,
    title: "Professional measuring",
    body: "Laser-measured to the millimetre, every bay angle templated on site. This is the step that matters.",
  },
];

export default function SurveySection() {
  return (
    <section id="survey" className="relative isolate overflow-hidden bg-paper">
      <div className="shell section-y">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1fr] lg:gap-20">
          {/* --------------------------------------------------- the promise */}
          <div>
            <Reveal>
              <SectionHeading
                eyebrow="Free Home Survey"
                title={
                  <>
                    Let us come
                    <br />
                    and look properly.
                  </>
                }
                lede="Almost nobody chooses shutters from a screen. Seeing a 76mm louvre held against your own wall, in your own light, settles it in about ninety seconds."
              />
            </Reveal>

            <Reveal delay={0.12}>
              <ul className="mt-12 space-y-9">
                {PROMISES.map(({ icon: Icon, title, body }) => (
                  <li key={title} className="flex gap-5">
                    <span className="mt-0.5 grid size-11 shrink-0 place-items-center border border-line bg-section text-gold-deep">
                      <Icon className="size-[19px]" strokeWidth={1.15} />
                    </span>
                    <div>
                      <h3 className="text-[1.0625rem] text-ink">{title}</h3>
                      <p className="mt-1.5 text-[0.875rem] leading-[1.75] text-muted">{body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.2}>
              <figure className="sheen mt-12 hidden aspect-[16/10] overflow-hidden lg:block">
                <RoomScene
                  room="bedroom"
                  kind="shutter"
                  finishId="white"
                  louvreId="76"
                  tilt={30}
                  time="evening"
                  className="size-full"
                  title="A bedroom at dusk with plantation shutters nearly closed"
                />
              </figure>
            </Reveal>
          </div>

          {/* ---------------------------------------------------------- form */}
          <Reveal direction="left" delay={0.1}>
            <div className="border border-line bg-section p-8 shadow-[0_40px_100px_-60px_rgba(35,27,12,0.45)] md:p-12">
              <h3 className="display-md text-ink">Book your free survey</h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
                Tell us a little about the windows and we will call to arrange a time.
              </p>
              <div className="mt-9">
                <EnquiryForm />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
