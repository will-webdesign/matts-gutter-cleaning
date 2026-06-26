import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { Nav } from "./Nav";
import { Footer } from "./Footer";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
            <ArrowLeft size={16} weight="bold" /> Back to home
          </Link>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-ink">{title}</h1>
          <p className="mt-2 text-sm text-muted">Last updated: {updated}</p>
          <div className="legal-prose mt-8 space-y-5 text-muted [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-2 [&_p]:leading-relaxed [&_a]:text-[var(--color-sky-brand)]">
            {children}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
