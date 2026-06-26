import { servicesContent } from "@/lib/content";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Services() {
  return (
    <section id="services" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="What we do"
          title="Everything to keep your gutters flowing"
          intro="One trusted local team for the whole roofline - from a quick downpipe clear to full annual maintenance."
        />

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {servicesContent.map((s, i) => (
            <Reveal key={s.title} delay={(i % 4) * 0.06}>
              <article className="group h-full rounded-[var(--radius-card)] border border-hairline bg-elevated p-6 shadow-[var(--shadow-soft)] transition-transform duration-300 hover:-translate-y-1">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-navy-50 text-navy-600 transition-colors group-hover:bg-navy-600 group-hover:text-white dark:bg-navy-900 dark:text-sky-soft">
                  <Icon name={s.icon} size={26} weight="duotone" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
