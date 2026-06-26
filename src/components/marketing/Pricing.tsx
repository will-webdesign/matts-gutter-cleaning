import { CheckCircle, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { propertyTypes, pricingNote } from "@/lib/pricing";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";

// Two-storey pricing guide (excludes the "other" catch-all used by the booking flow).
const guide = propertyTypes.filter((p) => p.key !== "other");

function priceLabel(from: number | null, to: number | null) {
  if (from === null || to === null) return "On request";
  return from === to ? `£${from}` : `£${from}-£${to}`;
}

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-20 bg-elevated py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            title="Honest, upfront pricing"
            intro="Clear prices for two-storey homes. Downpipe clearing is always included - no surprises on the day."
          />
          <Reveal>
            <ButtonLink href="/book" variant="secondary" size="lg" className="shrink-0">
              Get an instant estimate
              <ArrowRight size={18} weight="bold" />
            </ButtonLink>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guide.map((p, i) => (
            <Reveal key={p.key} delay={(i % 3) * 0.05}>
              <div className="flex h-full flex-col justify-between rounded-[var(--radius-card)] border border-hairline bg-surface p-6 transition-shadow hover:shadow-[var(--shadow-soft)]">
                <div>
                  <h3 className="text-base font-bold text-ink">{p.label}</h3>
                  <p className="mt-1 text-sm text-muted">{p.blurb}</p>
                </div>
                <div className="mt-6 flex items-end justify-between">
                  <span className="text-3xl font-extrabold tracking-tight text-navy-600 dark:text-sky-soft">
                    {priceLabel(p.from, p.to)}
                  </span>
                  <CheckCircle size={24} weight="fill" className="text-[var(--color-amber-brand)]" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-8 max-w-3xl rounded-2xl border border-hairline bg-surface p-5 text-sm leading-relaxed text-muted">
            <span className="font-semibold text-ink">Good to know. </span>
            {pricingNote}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
