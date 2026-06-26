"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Phone, List, X } from "@phosphor-icons/react";
import { business, telHref } from "@/lib/business";
import { ButtonLink } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const links = [
  { href: "/#services", label: "Services" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#areas", label: "Areas" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#contact", label: "Contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    // Passive listener for a cheap class toggle only - no per-frame React state churn.
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-hairline bg-[var(--bg)]/85 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 font-extrabold tracking-tight text-ink">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-navy-600 text-white shadow-[var(--shadow-soft)]">
            {/* Simple geometric monogram - swap for Matt's real logo at /public/logo.svg */}
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
              <path d="M3 8h18M6 8v9a2 2 0 0 0 2 2M18 8v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M9 19c1.5 1.5 4.5 1.5 6 0" stroke="var(--color-amber-brand)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <span className="text-[15px] leading-tight">
            Matt&apos;s <span className="text-[var(--color-sky-brand)]">Gutter Cleaning</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="rounded-full px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-[var(--bg-elevated)] hover:text-ink"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={telHref()}
            className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-ink transition-colors hover:text-[var(--color-sky-brand)] md:inline-flex"
          >
            <Phone size={16} weight="fill" />
            {business.phone}
          </a>
          <ThemeToggle className="hidden sm:inline-flex" />
          <ButtonLink href="/book" size="md" className="hidden sm:inline-flex">
            Book Online
          </ButtonLink>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center rounded-full border border-hairline bg-elevated text-ink lg:hidden"
          >
            {open ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-hairline bg-[var(--bg)]/95 backdrop-blur-xl lg:hidden">
          <ul className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-base font-medium text-ink hover:bg-[var(--bg-elevated)]"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="mt-2 flex items-center gap-3">
              <ButtonLink href="/book" size="lg" className="flex-1" onClick={() => setOpen(false)}>
                Book Online
              </ButtonLink>
              <a
                href={telHref()}
                className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-navy-600 text-white"
                aria-label={`Call ${business.phone}`}
              >
                <Phone size={22} weight="fill" />
              </a>
              <ThemeToggle />
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
