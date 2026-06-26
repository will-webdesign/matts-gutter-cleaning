import { Phone, MapPin, Clock, EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";
import {
  business,
  telHref,
  fullAddress,
  googleMapsEmbedSrc,
  googleMapsDirectionsHref,
  openingHoursDisplay,
} from "@/lib/business";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { QuoteForm } from "./QuoteForm";

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-20 bg-elevated py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Get in touch"
          title="Ready for clear, free-flowing gutters?"
          intro="Call for a quick chat, or send a few details and we'll get straight back to you."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* Details + map */}
          <div className="flex flex-col gap-5">
            <Reveal>
              <a
                href={telHref()}
                className="flex items-center gap-4 rounded-[var(--radius-card)] bg-gradient-to-r from-navy-600 to-navy-700 p-6 text-white shadow-[var(--shadow-lift)] transition-transform hover:-translate-y-0.5 dark:from-navy-700 dark:to-navy-800"
              >
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[var(--color-amber-brand)] text-navy-950">
                  <Phone size={26} weight="fill" />
                </span>
                <span>
                  <span className="block text-sm text-navy-100">Call now, Mon to Sun</span>
                  <span className="block text-2xl font-extrabold tracking-tight">{business.phone}</span>
                </span>
              </a>
            </Reveal>

            <div className="grid gap-5 sm:grid-cols-2">
              <Reveal delay={0.05}>
                <div className="h-full rounded-2xl border border-hairline bg-surface p-5">
                  <MapPin size={24} weight="duotone" className="text-[var(--color-sky-brand)]" />
                  <h3 className="mt-3 text-sm font-bold text-ink">Where we are</h3>
                  <address className="mt-1 text-sm not-italic leading-relaxed text-muted">
                    {business.address.street}<br />
                    {business.address.locality}<br />
                    {business.address.region} {business.address.postcode}
                  </address>
                  <a href={googleMapsDirectionsHref()} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-semibold text-[var(--color-sky-brand)] hover:underline">
                    Get directions
                  </a>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="h-full rounded-2xl border border-hairline bg-surface p-5">
                  <Clock size={24} weight="duotone" className="text-[var(--color-sky-brand)]" />
                  <h3 className="mt-3 text-sm font-bold text-ink">Opening hours</h3>
                  <ul className="mt-1 space-y-1 text-sm text-muted">
                    {openingHoursDisplay.map((h) => (
                      <li key={h.label} className="flex justify-between gap-3">
                        <span>{h.label}</span>
                        <span className="font-medium text-ink">{h.value}</span>
                      </li>
                    ))}
                  </ul>
                  <a href={`mailto:${business.email}`} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-sky-brand)] hover:underline">
                    <EnvelopeSimple size={16} weight="bold" /> Email us
                  </a>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.1} className="overflow-hidden rounded-[var(--radius-card)] border border-hairline shadow-[var(--shadow-soft)]">
              <iframe
                title={`Map showing ${business.name}`}
                src={googleMapsEmbedSrc()}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="aspect-[16/9] w-full"
              />
            </Reveal>
          </div>

          {/* Quote form */}
          <Reveal delay={0.05}>
            <QuoteForm />
          </Reveal>
        </div>
      </div>
      <p className="sr-only">{fullAddress()}</p>
    </section>
  );
}
