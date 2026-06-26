import Link from "next/link";
import { Phone, MapPin, FacebookLogo, GoogleLogo } from "@phosphor-icons/react/dist/ssr";
import { business, telHref, openingHoursDisplay } from "@/lib/business";
import { areasCovered } from "@/lib/business";
import { Stars } from "@/components/ui/Stars";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-hairline bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 font-extrabold tracking-tight text-ink">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-navy-600 text-white">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                  <path d="M3 8h18M6 8v9a2 2 0 0 0 2 2M18 8v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M9 19c1.5 1.5 4.5 1.5 6 0" stroke="var(--color-amber-brand)" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              <span className="text-[15px]">Matt&apos;s Gutter Cleaning</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              Sheffield&apos;s highest-rated gutter cleaning service. Professional, fully insured and
              friendly, with before-and-after photos every time.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <Stars size={16} />
              <span className="text-sm font-semibold text-ink">5.0</span>
              <span className="text-sm text-muted">121 reviews</span>
            </div>
            <div className="mt-5 flex gap-3">
              <a href={business.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="grid h-10 w-10 place-items-center rounded-full border border-hairline bg-elevated text-ink hover:text-[var(--color-sky-brand)]">
                <FacebookLogo size={20} weight="fill" />
              </a>
              <a href={business.social.google} target="_blank" rel="noopener noreferrer" aria-label="Google Business profile" className="grid h-10 w-10 place-items-center rounded-full border border-hairline bg-elevated text-ink hover:text-[var(--color-sky-brand)]">
                <GoogleLogo size={20} weight="fill" />
              </a>
            </div>
          </div>

          {/* Services / nav */}
          <nav aria-label="Footer">
            <h3 className="text-sm font-bold text-ink">Explore</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted">
              <li><Link href="/#services" className="hover:text-ink">Services</Link></li>
              <li><Link href="/#pricing" className="hover:text-ink">Pricing</Link></li>
              <li><Link href="/#reviews" className="hover:text-ink">Reviews</Link></li>
              <li><Link href="/#gallery" className="hover:text-ink">Before &amp; after</Link></li>
              <li><Link href="/#faq" className="hover:text-ink">FAQ</Link></li>
              <li><Link href="/book" className="hover:text-ink">Book online</Link></li>
            </ul>
          </nav>

          {/* Areas */}
          <div>
            <h3 className="text-sm font-bold text-ink">Areas covered</h3>
            <ul className="mt-4 grid grid-cols-1 gap-2.5 text-sm text-muted">
              {areasCovered.slice(0, 8).map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold text-ink">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li>
                <a href={telHref()} className="inline-flex items-center gap-2 font-semibold text-ink hover:text-[var(--color-sky-brand)]">
                  <Phone size={16} weight="fill" /> {business.phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} weight="fill" className="mt-0.5 shrink-0 text-[var(--color-sky-brand)]" />
                <span>
                  {business.address.street}, {business.address.locality}, {business.address.region} {business.address.postcode}
                </span>
              </li>
              <li className="pt-1">
                {openingHoursDisplay.map((h) => (
                  <span key={h.label} className="block">{h.label}: {h.value}</span>
                ))}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-hairline pt-6 text-sm text-muted sm:flex-row">
          <p>&copy; {year} Matt&apos;s Gutter Cleaning. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-ink">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-ink">Terms</Link>
            <Link href="/admin" className="hover:text-ink">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
