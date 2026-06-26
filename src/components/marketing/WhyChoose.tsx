import { whyChoose } from "@/lib/content";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { Stars } from "@/components/ui/Stars";

export function WhyChoose() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-[2rem] border border-hairline bg-navy-600 text-white shadow-[var(--shadow-lift)] dark:bg-navy-800">
          <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
            {/* Left: the pitch + proof */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <h2 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                Why people choose Matt
              </h2>
              <p className="mt-4 max-w-md text-navy-100">
                A friendly, reliable local business that treats your home like its own. No call
                centres, no hidden charges, just honest work.
              </p>
              <div className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-4 backdrop-blur">
                <Stars size={20} />
                <div>
                  <p className="text-2xl font-bold leading-none">5.0 / 5</p>
                  <p className="text-sm text-navy-100">121 Google reviews</p>
                </div>
              </div>
            </div>

            {/* Right: reasons grid */}
            <ul className="grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2">
              {whyChoose.map((w, i) => (
                <Reveal as="li" key={w.label} delay={(i % 2) * 0.05}>
                  <div className="flex items-center gap-3 border-b border-white/10 py-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--color-amber-brand)] text-navy-950">
                      <Icon name={w.icon} size={18} weight="fill" />
                    </span>
                    <span className="text-[15px] font-semibold">{w.label}</span>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
