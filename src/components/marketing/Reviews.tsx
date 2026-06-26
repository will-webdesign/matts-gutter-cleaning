"use client";

import { useRef } from "react";
import { Quotes, CaretLeft, CaretRight } from "@phosphor-icons/react";
import { reviews } from "@/lib/content";
import { Stars } from "@/components/ui/Stars";

export function Reviews() {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollByCards(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const amount = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  }

  return (
    <section id="reviews" className="scroll-mt-20 bg-elevated py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-sky-brand)]">
              Reviews
            </p>
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
              Loved by Sheffield homeowners
            </h2>
            <div className="mt-4 flex items-center gap-3">
              <Stars size={20} />
              <span className="font-semibold text-ink">5.0</span>
              <span className="text-muted">from 121 Google reviews</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scrollByCards(-1)}
              aria-label="Previous reviews"
              className="grid h-12 w-12 place-items-center rounded-full border border-hairline bg-surface text-ink transition-colors hover:text-[var(--color-sky-brand)] active:scale-95"
            >
              <CaretLeft size={20} weight="bold" />
            </button>
            <button
              type="button"
              onClick={() => scrollByCards(1)}
              aria-label="Next reviews"
              className="grid h-12 w-12 place-items-center rounded-full border border-hairline bg-surface text-ink transition-colors hover:text-[var(--color-sky-brand)] active:scale-95"
            >
              <CaretRight size={20} weight="bold" />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="marquee-mask mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {reviews.map((r) => (
            <figure
              key={r.name}
              data-card
              className="flex w-[85vw] shrink-0 snap-start flex-col rounded-[var(--radius-card)] border border-hairline bg-surface p-7 shadow-[var(--shadow-soft)] sm:w-[360px]"
            >
              <Quotes size={32} weight="fill" className="text-[var(--color-amber-brand)]" />
              <blockquote className="mt-4 grow text-lg font-medium leading-relaxed text-ink">
                {r.quote}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-hairline pt-5">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-navy-600 text-sm font-bold text-white">
                  {r.name.charAt(0)}
                </span>
                <span>
                  <span className="block text-sm font-bold text-ink">{r.name}</span>
                  <span className="block text-sm text-muted">{r.location}</span>
                </span>
                <Stars size={14} className="ml-auto" />
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
