import { MapPin } from "@phosphor-icons/react/dist/ssr";
import { areasCovered, business } from "@/lib/business";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

// Keyless Google Maps embed centred on the Sheffield service area.
const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
  "Oughtibridge, Sheffield",
)}&z=11&output=embed`;

export function Areas() {
  return (
    <section id="areas" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          title="Covering Sheffield &amp; surrounding villages"
          intro="Based in Oughtibridge and working right across the north and west of Sheffield."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal className="overflow-hidden rounded-[var(--radius-card)] border border-hairline shadow-[var(--shadow-soft)]">
            <iframe
              title={`Map of areas covered by ${business.name}`}
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="aspect-[16/11] w-full grayscale-[15%]"
            />
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col justify-center">
            <ul className="grid grid-cols-2 gap-3">
              {areasCovered.map((a) => (
                <li
                  key={a}
                  className="flex items-center gap-2.5 rounded-2xl border border-hairline bg-elevated px-4 py-3.5 text-sm font-semibold text-ink shadow-[var(--shadow-soft)]"
                >
                  <MapPin size={18} weight="fill" className="text-[var(--color-sky-brand)]" />
                  {a}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-muted">
              Not on the list? It&apos;s worth asking - we often travel a little further for nearby
              postcodes.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Single marquee on the page - a light, ambient strip of areas served. */}
      <div className="marquee-mask mt-14 overflow-hidden" aria-hidden>
        <div className="marquee-track flex w-max gap-8 whitespace-nowrap">
          {[...areasCovered, ...areasCovered].map((a, i) => (
            <span
              key={`${a}-${i}`}
              className="text-2xl font-extrabold tracking-tight text-navy-200 sm:text-3xl dark:text-navy-700"
            >
              {a}
              <span className="mx-4 text-[var(--color-amber-brand)]">&bull;</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
