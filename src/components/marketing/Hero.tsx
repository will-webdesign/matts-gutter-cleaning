"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Phone, ShieldCheck, Star, MapPin } from "@phosphor-icons/react";
import { business, telHref } from "@/lib/business";
import { ButtonLink } from "@/components/ui/Button";
import { Stars } from "@/components/ui/Stars";

export function Hero() {
  const reduce = useReducedMotion();
  const fade = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section className="hero-aura relative isolate overflow-hidden">
      <div className="mx-auto grid min-h-[100dvh] max-w-7xl items-center gap-12 px-4 pb-16 pt-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pt-24">
        {/* Left: message */}
        <div className="relative z-10 max-w-2xl">
          <motion.div {...fade(0)} className="inline-flex items-center gap-2.5 rounded-full border border-hairline bg-elevated px-4 py-2 shadow-[var(--shadow-soft)]">
            <Stars size={16} />
            <span className="text-sm font-semibold text-ink">5.0</span>
            <span className="text-sm text-muted">from 121 Google Reviews</span>
          </motion.div>

          <motion.h1
            {...fade(0.08)}
            className="mt-6 text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl"
          >
            Sheffield&apos;s{" "}
            <span className="relative whitespace-nowrap text-[var(--color-sky-brand)]">
              highest-rated
            </span>{" "}
            gutter cleaning service
          </motion.h1>

          <motion.p {...fade(0.16)} className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            Professional gutter, downpipe, fascia and roofline cleaning across Sheffield. Fully
            insured, with before and after photos every time.
          </motion.p>

          <motion.div {...fade(0.24)} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href="/book" size="lg" className="w-full sm:w-auto">
              Book Online
            </ButtonLink>
            <a
              href={telHref()}
              className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-navy-600 px-7 text-base font-semibold text-white transition-transform hover:-translate-y-0.5 active:translate-y-px sm:w-auto dark:bg-navy-700"
            >
              <Phone size={20} weight="fill" />
              Call {business.phone}
            </a>
          </motion.div>

          <motion.ul {...fade(0.32)} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
            <li className="inline-flex items-center gap-2">
              <ShieldCheck size={18} weight="fill" className="text-[var(--color-sky-brand)]" />
              Fully insured
            </li>
            <li className="inline-flex items-center gap-2">
              <Star size={18} weight="fill" className="text-[var(--color-amber-brand)]" />
              121 five-star reviews
            </li>
            <li className="inline-flex items-center gap-2">
              <MapPin size={18} weight="fill" className="text-[var(--color-sky-brand)]" />
              Oughtibridge &amp; all Sheffield
            </li>
          </motion.ul>
        </div>

        {/* Right: hero visual */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 mx-auto w-full max-w-lg lg:max-w-none"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] border border-hairline shadow-[var(--shadow-lift)]">
            {/*
              TODO: replace with a real photo of a freshly cleaned roofline / gutters.
              Drop the file in /public/hero.jpg and set src="/hero.jpg".
            */}
            <Image
              src="https://picsum.photos/seed/clean-roof-gutters/1000/1250"
              alt="Freshly cleaned gutters and roofline on a Sheffield home"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/45 via-transparent to-transparent" />
          </div>

          {/* Floating rating card */}
          <div className="absolute -bottom-5 -left-4 w-max rounded-2xl border border-hairline bg-elevated p-4 shadow-[var(--shadow-lift)] sm:-left-6">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-[var(--color-amber-brand)] text-navy-950">
                <Star size={22} weight="fill" />
              </div>
              <div>
                <p className="text-lg font-bold leading-none text-ink">5.0 rating</p>
                <p className="text-sm text-muted">121 Google reviews</p>
              </div>
            </div>
          </div>

          {/* Floating insured card */}
          <div className="absolute -right-3 top-6 hidden rounded-2xl border border-hairline bg-elevated px-4 py-3 shadow-[var(--shadow-lift)] sm:block">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <ShieldCheck size={20} weight="fill" className="text-[var(--color-sky-brand)]" />
              Fully insured
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
