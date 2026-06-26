"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { X, CaretLeft, CaretRight, ArrowsLeftRight } from "@phosphor-icons/react";
import { gallery } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Gallery() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (dir: 1 | -1) => setOpen((i) => (i === null ? i : (i + dir + gallery.length) % gallery.length)),
    [],
  );

  useEffect(() => {
    if (open === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, step]);

  return (
    <section id="gallery" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          title="Before &amp; after"
          intro="Real jobs across Sheffield. Tap any photo to see the full before-and-after."
        />

        {/* Masonry via CSS columns */}
        <div className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
          {gallery.map((g, i) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setOpen(i)}
              className="group relative block w-full overflow-hidden rounded-[var(--radius-card)] border border-hairline shadow-[var(--shadow-soft)] focus-visible:outline-2 focus-visible:outline-[var(--color-sky-brand)]"
              aria-label={`View before and after: ${g.caption}`}
            >
              <Image
                src={g.after}
                alt={`After: ${g.caption}`}
                width={800}
                height={600}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-navy-950/75 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                <ArrowsLeftRight size={14} weight="bold" />
                Before / After
              </span>
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/85 to-transparent p-4 pt-10 text-left text-sm font-medium text-white">
                {g.caption}
              </span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/85 p-4 backdrop-blur-md"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label="Before and after photo"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <X size={22} weight="bold" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); step(-1); }}
              aria-label="Previous"
              className="absolute left-3 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-6"
            >
              <CaretLeft size={22} weight="bold" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); step(1); }}
              aria-label="Next"
              className="absolute right-3 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6"
            >
              <CaretRight size={22} weight="bold" />
            </button>

            <motion.figure
              key={gallery[open].id}
              className="w-full max-w-4xl"
              initial={reduce ? false : { scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid grid-cols-2 gap-3">
                {(["before", "after"] as const).map((kind) => (
                  <div key={kind} className="relative overflow-hidden rounded-2xl">
                    <Image
                      src={gallery[open][kind]}
                      alt={`${kind}: ${gallery[open].caption}`}
                      width={800}
                      height={600}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute left-2 top-2 rounded-full bg-navy-950/75 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                      {kind}
                    </span>
                  </div>
                ))}
              </div>
              <figcaption className="mt-4 text-center text-sm font-medium text-white">
                {gallery[open].caption} &middot; {open + 1} / {gallery.length}
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
