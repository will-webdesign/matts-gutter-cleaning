import { processSteps } from "@/lib/content";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Process() {
  return (
    <section className="bg-elevated py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          center
          title="How it works"
          intro="From first call to worry-free gutters in four simple steps."
        />

        <div className="relative mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Connecting line on desktop */}
          <div
            className="absolute left-0 right-0 top-9 hidden h-px bg-gradient-to-r from-transparent via-navy-200 to-transparent lg:block dark:via-navy-700"
            aria-hidden
          />
          {processSteps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08} className="relative text-center">
              <div className="relative mx-auto grid h-18 w-18 place-items-center">
                <div className="grid h-18 w-18 place-items-center rounded-2xl border border-hairline bg-surface text-navy-600 shadow-[var(--shadow-soft)] dark:text-sky-soft">
                  <Icon name={s.icon} size={30} weight="duotone" />
                </div>
                <span className="absolute -right-1 -top-2 grid h-7 w-7 place-items-center rounded-full bg-[var(--color-amber-brand)] text-sm font-bold text-navy-950">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-bold text-ink">{s.title}</h3>
              <p className="mx-auto mt-2 max-w-[24ch] text-sm leading-relaxed text-muted">{s.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
