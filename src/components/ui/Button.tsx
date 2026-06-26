import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-[transform,background-color,box-shadow,color] duration-200 active:translate-y-px disabled:opacity-60 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2";

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-7 text-base",
};

const variants: Record<Variant, string> = {
  // Amber on navy text - strong contrast (WCAG AA). The single locked accent.
  primary:
    "bg-[var(--color-amber-brand)] text-navy-950 shadow-[0_8px_24px_-8px_rgb(244_180_0_/_0.6)] hover:bg-[var(--color-amber-deep)] hover:-translate-y-0.5",
  // Navy fill, white text.
  secondary:
    "bg-navy-600 text-white hover:bg-navy-700 hover:-translate-y-0.5 dark:bg-sky-brand dark:text-navy-950 dark:hover:brightness-110",
  // Bordered, theme-aware text - readable in both modes.
  ghost:
    "border border-hairline bg-elevated text-ink hover:border-[var(--color-sky-brand)] hover:text-[var(--color-sky-brand)]",
};

type CommonProps = { variant?: Variant; size?: Size; className?: string; children: ReactNode };

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: CommonProps & ComponentProps<"button">) {
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  children,
  href,
  ...props
}: CommonProps & ComponentProps<typeof Link>) {
  return (
    <Link href={href} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </Link>
  );
}
