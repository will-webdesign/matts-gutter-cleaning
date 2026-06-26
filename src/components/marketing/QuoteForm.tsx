"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, CircleNotch, PaperPlaneTilt } from "@phosphor-icons/react";
import { quoteSchema, type QuoteInput } from "@/lib/validation";

const inputCls =
  "mt-2 w-full rounded-xl border border-hairline bg-surface px-4 py-3 text-ink placeholder:text-[var(--ink-muted)] focus-visible:outline-2 focus-visible:outline-[var(--color-sky-brand)]";
const labelCls = "block text-sm font-semibold text-ink";
const errCls = "mt-1.5 text-sm text-red-600 dark:text-red-400";

export function QuoteForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<QuoteInput>({ resolver: zodResolver(quoteSchema) });

  async function onSubmit(data: QuoteInput) {
    setServerError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      setDone(true);
    } catch {
      setServerError("Something went wrong sending your message. Please call us instead.");
    }
  }

  if (done) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-[var(--radius-card)] border border-hairline bg-elevated p-10 text-center shadow-[var(--shadow-soft)]">
        <CheckCircle size={56} weight="fill" className="text-[var(--color-amber-brand)]" />
        <h3 className="mt-4 text-xl font-bold text-ink">Thanks, message received</h3>
        <p className="mt-2 max-w-sm text-muted">
          We&apos;ll be in touch shortly with your free quote. For anything urgent, give us a call.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="rounded-[var(--radius-card)] border border-hairline bg-elevated p-6 shadow-[var(--shadow-soft)] sm:p-8"
    >
      <h3 className="text-xl font-bold text-ink">Request a free quote</h3>
      <p className="mt-1 text-sm text-muted">No obligation. We aim to reply the same day.</p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelCls}>Name</label>
          <input id="name" autoComplete="name" className={inputCls} placeholder="Jane Hartley" {...register("name")} />
          {errors.name && <p className={errCls}>{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="phone" className={labelCls}>Phone</label>
          <input id="phone" autoComplete="tel" inputMode="tel" className={inputCls} placeholder="07700 900123" {...register("phone")} />
          {errors.phone && <p className={errCls}>{errors.phone.message}</p>}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="email" className={labelCls}>Email</label>
          <input id="email" type="email" autoComplete="email" className={inputCls} placeholder="jane@example.com" {...register("email")} />
          {errors.email && <p className={errCls}>{errors.email.message}</p>}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="postcode" className={labelCls}>Postcode</label>
          <input id="postcode" autoComplete="postal-code" className={inputCls} placeholder="S35 0ET" {...register("postcode")} />
          {errors.postcode && <p className={errCls}>{errors.postcode.message}</p>}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="message" className={labelCls}>How can we help?</label>
          <textarea
            id="message"
            rows={4}
            className={inputCls}
            placeholder="Semi-detached, gutters and downpipes please. Any availability next week?"
            {...register("message")}
          />
          {errors.message && <p className={errCls}>{errors.message.message}</p>}
        </div>
      </div>

      {serverError && (
        <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-[var(--color-amber-brand)] px-7 font-semibold text-navy-950 transition-[transform,background-color] hover:bg-[var(--color-amber-deep)] active:translate-y-px disabled:opacity-70"
      >
        {isSubmitting ? (
          <>
            <CircleNotch size={20} weight="bold" className="animate-spin" /> Sending…
          </>
        ) : (
          <>
            <PaperPlaneTilt size={20} weight="fill" /> Send my quote request
          </>
        )}
      </button>
    </form>
  );
}
