import { Warning } from "@phosphor-icons/react/dist/ssr";
import { damageRisks } from "@/lib/content";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";

export function WhyClean() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-deep dark:bg-amber-brand/15">
              <Warning size={18} weight="fill" className="text-[var(--color-amber-deep)]" />
              Why it matters
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
              Blocked gutters cause expensive damage
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              When water can&apos;t drain away it overflows, soaks in and works its way into the
              fabric of your home. Left unchecked it leads to:
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {damageRisks.map((r, i) => (
            <Reveal key={r.title} delay={(i % 5) * 0.05}>
              <div className="h-full rounded-2xl border border-hairline bg-elevated p-5 text-center shadow-[var(--shadow-soft)]">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-navy-50 text-navy-600 dark:bg-navy-900 dark:text-sky-soft">
                  <Icon name={r.icon} size={24} weight="duotone" />
                </div>
                <h3 className="mt-4 text-sm font-bold text-ink">{r.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">{r.description}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mx-auto mt-12 max-w-3xl rounded-[var(--radius-card)] bg-gradient-to-r from-navy-600 to-navy-700 p-8 text-center text-white shadow-[var(--shadow-lift)] sm:p-10 dark:from-navy-700 dark:to-navy-800">
            <p className="text-xl font-bold leading-snug sm:text-2xl">
              Annual gutter cleaning costs a fraction of repairing water damage.
            </p>
            <p className="mt-3 text-navy-100">
              A single clean now protects walls, timber and ceilings worth thousands.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
