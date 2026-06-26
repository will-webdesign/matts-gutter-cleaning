import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Phone, Star } from "@phosphor-icons/react/dist/ssr";
import { business, telHref } from "@/lib/business";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { BookingFlow } from "@/components/booking/BookingFlow";

export const metadata: Metadata = {
  title: "Book online",
  description:
    "Book your gutter clean online in two minutes. Choose your service, property type, date and time - with an instant price estimate.",
  alternates: { canonical: "/book" },
};

export default function BookPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <header className="sticky top-0 z-40 border-b border-hairline bg-[var(--bg)]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-3xl items-center justify-between px-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
            <ArrowLeft size={18} weight="bold" /> Back to site
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1.5 text-sm font-semibold text-ink sm:inline-flex">
              <Star size={15} weight="fill" className="text-[var(--color-amber-brand)]" /> 5.0 · 121 reviews
            </span>
            <a
              href={telHref()}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-navy-600 px-4 text-sm font-semibold text-white"
            >
              <Phone size={16} weight="fill" /> <span className="hidden sm:inline">{business.phone}</span>
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <BookingFlow />
      </main>
    </div>
  );
}
