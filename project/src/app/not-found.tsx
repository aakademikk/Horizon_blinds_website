import Link from "next/link";
import RoomScene from "@/components/scene/RoomScene";
import { CtaLink } from "@/components/ui/Cta";
import { navigation } from "@/lib/site";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-ink">
      <div className="absolute inset-0 -z-20">
        <RoomScene
          room="living"
          kind="shutter"
          finishId="anthracite"
          louvreId="76"
          tilt={8}
          time="night"
          className="size-full"
        />
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-ink/78" />

      <div className="shell relative z-10 py-32 text-center">
        <p className="eyebrow flex items-center justify-center gap-3 text-gold-light">
          <span aria-hidden className="h-px w-8 bg-current opacity-70" />
          Error 404
          <span aria-hidden className="h-px w-8 bg-current opacity-70" />
        </p>

        <h1 className="display-xl mx-auto mt-8 max-w-3xl text-white">
          The louvres are closed on this one.
        </h1>

        <p className="lede mx-auto mt-7 max-w-xl !text-white/60">
          We cannot find the page you were after. It may have moved, or the link may have been
          mistyped.
        </p>

        <div className="mt-11 flex flex-wrap justify-center gap-4">
          <CtaLink href="/" variant="gold">
            Back to Home
          </CtaLink>
          <CtaLink href="/contact#survey" variant="outline" className="text-white">
            Book Free Survey
          </CtaLink>
        </div>

        <nav aria-label="Site sections" className="mt-16">
          <ul className="flex flex-wrap justify-center gap-x-7 gap-y-3">
            {navigation.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className="link-underline text-[0.8125rem] text-white/65 transition-colors hover:text-white"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
