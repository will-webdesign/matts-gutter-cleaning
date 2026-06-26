import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

/**
 * Consistent section heading. `eyebrow` is optional and used sparingly
 * (no more than a few across the whole page).
 */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  center = false,
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  center?: boolean;
  className?: string;
}) {
  return (
    <div className={`${center ? "mx-auto text-center" : ""} max-w-2xl ${className}`}>
      {eyebrow && (
        <Reveal>
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-sky-brand)]">
            {eyebrow}
          </p>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl lg:text-[2.75rem]">
          {title}
        </h2>
      </Reveal>
      {intro && (
        <Reveal delay={0.1}>
          <p className={`mt-4 text-lg leading-relaxed text-muted ${center ? "mx-auto" : ""} max-w-[60ch]`}>
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  );
}
