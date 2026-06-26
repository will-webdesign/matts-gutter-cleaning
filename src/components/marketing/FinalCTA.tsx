import { Phone } from "@phosphor-icons/react/dist/ssr";
import { business, telHref } from "@/lib/business";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Stars } from "@/components/ui/Stars";

export function FinalCTA() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="hero-aura relative isolate overflow-hidden rounded-[2rem] border border-hairline bg-elevated px-6 py-14 text-center shadow-[var(--shadow-lift)] sm:px-12 sm:py-20">
          <div className="relative z-10 mx-auto max-w-2xl">
            <div className="mb-5 flex items-center justify-center gap-2">
              <Stars size={18} />
              <span className="text-sm font-semibold text-muted">Rated 5.0 by 121 customers</span>
            </div>
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl">
              Book Sheffield&apos;s most-trusted gutter cleaner
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
              Pick a slot online in two minutes, or call for a friendly chat and a free quote.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink href="/book" size="lg" className="w-full sm:w-auto">
                Book Online
              </ButtonLink>
              <a
                href={telHref()}
                className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-navy-600 px-7 text-base font-semibold text-white transition-transform hover:-translate-y-0.5 active:translate-y-px sm:w-auto dark:bg-navy-700"
              >
                <Phone size={20} weight="fill" /> Call {business.phone}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
