import { Star } from "@phosphor-icons/react/dist/ssr";

export function Stars({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-0.5 text-[var(--color-amber-brand)] ${className}`} aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} weight="fill" />
      ))}
    </span>
  );
}

export function RatingBadge({ compact = false }: { compact?: boolean }) {
  return (
    <div className="inline-flex items-center gap-2.5 rounded-full border border-hairline bg-elevated px-4 py-2 shadow-[var(--shadow-soft)]">
      <Stars size={compact ? 15 : 17} />
      <span className="text-sm font-semibold text-ink">5.0</span>
      <span className="text-sm text-muted">
        {compact ? "121 reviews" : "from 121 Google Reviews"}
      </span>
    </div>
  );
}
