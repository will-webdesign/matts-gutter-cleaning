"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  CheckCircle,
  CaretRight,
  CaretLeft,
  CircleNotch,
  MapPin,
  Phone,
} from "@phosphor-icons/react";
import { services, propertyTypes, estimatePrice } from "@/lib/pricing";
import { bookingSchema } from "@/lib/validation";
import { business, telHref } from "@/lib/business";

type DaySlot = { time: string; available: boolean };
type Day = { date: string; available: boolean; reason?: string; slots: DaySlot[] };

type FormState = {
  service: string;
  propertyType: string;
  address: string;
  postcode: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
};

const empty: FormState = {
  service: "",
  propertyType: "",
  address: "",
  postcode: "",
  date: "",
  time: "",
  name: "",
  email: "",
  phone: "",
  notes: "",
};

const steps = ["Service", "Property", "Location", "Date & time", "Your details", "Confirm"];

function formatDay(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function BookingFlow() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(empty);
  const [days, setDays] = useState<Day[]>([]);
  const [loadingDays, setLoadingDays] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedId, setConfirmedId] = useState<string | null>(null);

  const set = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }));

  // Live price estimate.
  const estimate = useMemo(() => {
    if (!form.service || !form.propertyType) return null;
    return estimatePrice(form.propertyType, form.service);
  }, [form.service, form.propertyType]);

  // Fetch availability when reaching the date step.
  useEffect(() => {
    if (step !== 3 || days.length) return;
    // Kick off the availability fetch once the user reaches the date step.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoadingDays(true);
    fetch("/api/availability")
      .then((r) => r.json())
      .then((d: { days: Day[] }) => setDays(d.days.filter((x) => x.available)))
      .catch(() => setError("Couldn't load availability. Please call us to book."))
      .finally(() => setLoadingDays(false));
  }, [step, days.length]);

  const selectedDay = days.find((d) => d.date === form.date);

  function canAdvance(): boolean {
    switch (step) {
      case 0:
        return !!form.service;
      case 1:
        return !!form.propertyType;
      case 2:
        return form.address.trim().length >= 4 && form.postcode.trim().length >= 4;
      case 3:
        return !!form.date && !!form.time;
      case 4: {
        const r = bookingSchema.safeParse(form);
        return r.success;
      }
      default:
        return true;
    }
  }

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, notes: form.notes || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.code === "SLOT_TAKEN") {
          setError("That slot was just taken. Please pick another time.");
          setDays([]);
          setForm((f) => ({ ...f, date: "", time: "" }));
          setStep(3);
          return;
        }
        throw new Error(data.error || "Booking failed");
      }
      setConfirmedId(data.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please call us.");
    } finally {
      setSubmitting(false);
    }
  }

  // ---- Confirmation screen ----
  if (confirmedId) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <motion.div
          initial={reduce ? false : { scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 140, damping: 16 }}
          className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[var(--color-amber-brand)] text-navy-950"
        >
          <CheckCircle size={44} weight="fill" />
        </motion.div>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-ink">Booking requested</h1>
        <p className="mt-3 text-muted">
          Thanks {form.name.split(" ")[0]}. We&apos;ve emailed a summary to{" "}
          <span className="font-semibold text-ink">{form.email}</span> and Matt has been notified.
          We&apos;ll confirm your slot shortly.
        </p>
        <div className="mt-6 rounded-2xl border border-hairline bg-elevated p-5 text-left text-sm">
          <Row label="Reference" value={confirmedId.slice(-8).toUpperCase()} />
          <Row label="Date" value={`${formatDay(form.date)} at ${form.time}`} />
          <Row
            label="Estimate"
            value={estimate?.needsQuote ? "Quote to follow" : estimate?.label ?? " - "}
          />
        </div>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center rounded-full bg-navy-600 px-6 font-semibold text-white"
          >
            Back to home
          </Link>
          <a href={telHref()} className="inline-flex h-12 items-center gap-2 rounded-full border border-hairline bg-elevated px-6 font-semibold text-ink">
            <Phone size={18} weight="fill" /> {business.phone}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-medium text-muted">
          <span>
            Step {step + 1} of {steps.length}
          </span>
          <span>{steps[step]}</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--bg-elevated)] ring-1 ring-[var(--hairline)]">
          <motion.div
            className="h-full rounded-full bg-[var(--color-amber-brand)]"
            initial={false}
            animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={reduce ? false : { opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduce ? undefined : { opacity: 0, x: -24 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {step === 0 && (
            <Fieldset title="What do you need?" hint="Pick the service that fits best.">
              <div className="grid gap-3 sm:grid-cols-2">
                {services.map((s) => (
                  <Choice
                    key={s.key}
                    selected={form.service === s.key}
                    title={s.label}
                    subtitle={s.note}
                    onClick={() => set({ service: s.key })}
                  />
                ))}
              </div>
            </Fieldset>
          )}

          {step === 1 && (
            <Fieldset title="What type of property?" hint="This gives you an instant estimate.">
              <div className="grid gap-3 sm:grid-cols-2">
                {propertyTypes.map((p) => (
                  <Choice
                    key={p.key}
                    selected={form.propertyType === p.key}
                    title={p.label}
                    subtitle={p.blurb}
                    onClick={() => set({ propertyType: p.key })}
                  />
                ))}
              </div>
            </Fieldset>
          )}

          {step === 2 && (
            <Fieldset title="Where is the property?" hint="So we know exactly where we're coming.">
              <div className="grid gap-4">
                <Field label="Address">
                  <input
                    className={inputCls}
                    placeholder="12 Acorn Drive"
                    value={form.address}
                    onChange={(e) => set({ address: e.target.value })}
                    autoComplete="street-address"
                  />
                </Field>
                <Field label="Postcode">
                  <input
                    className={inputCls}
                    placeholder="S35 0ET"
                    value={form.postcode}
                    onChange={(e) => set({ postcode: e.target.value.toUpperCase() })}
                    autoComplete="postal-code"
                  />
                </Field>
                {form.postcode.trim().length >= 4 && (
                  <div className="overflow-hidden rounded-2xl border border-hairline">
                    <iframe
                      title="Property location"
                      src={`https://www.google.com/maps?q=${encodeURIComponent(`${form.address} ${form.postcode}`)}&z=15&output=embed`}
                      loading="lazy"
                      className="aspect-[16/9] w-full"
                    />
                  </div>
                )}
                <p className="flex items-center gap-2 text-sm text-muted">
                  <MapPin size={16} weight="fill" className="text-[var(--color-sky-brand)]" />
                  Confirm the pin looks right above.
                </p>
              </div>
            </Fieldset>
          )}

          {step === 3 && (
            <Fieldset title="Choose a date and time" hint="Showing our next available slots.">
              {loadingDays ? (
                <div className="grid gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-16 animate-pulse rounded-2xl bg-[var(--bg-elevated)]" />
                  ))}
                </div>
              ) : days.length === 0 ? (
                <div className="rounded-2xl border border-hairline bg-elevated p-6 text-center text-muted">
                  No online slots right now.{" "}
                  <a href={telHref()} className="font-semibold text-[var(--color-sky-brand)]">
                    Call {business.phone}
                  </a>{" "}
                  and we&apos;ll fit you in.
                </div>
              ) : (
                <>
                  <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {days.map((d) => (
                      <button
                        key={d.date}
                        type="button"
                        onClick={() => set({ date: d.date, time: "" })}
                        className={`shrink-0 rounded-2xl border px-4 py-3 text-center transition-colors ${
                          form.date === d.date
                            ? "border-[var(--color-amber-brand)] bg-[var(--color-amber-brand)]/10"
                            : "border-hairline bg-elevated hover:border-[var(--color-sky-brand)]"
                        }`}
                      >
                        <span className="block text-sm font-bold text-ink">{formatDay(d.date)}</span>
                        <span className="block text-xs text-muted">
                          {d.slots.filter((s) => s.available).length} slots
                        </span>
                      </button>
                    ))}
                  </div>

                  {selectedDay && (
                    <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {selectedDay.slots.map((s) => (
                        <button
                          key={s.time}
                          type="button"
                          disabled={!s.available}
                          onClick={() => set({ time: s.time })}
                          className={`rounded-xl border py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-35 ${
                            form.time === s.time
                              ? "border-[var(--color-amber-brand)] bg-[var(--color-amber-brand)] text-navy-950"
                              : "border-hairline bg-elevated text-ink hover:border-[var(--color-sky-brand)]"
                          }`}
                        >
                          {s.time}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </Fieldset>
          )}

          {step === 4 && (
            <Fieldset title="Your details" hint="So we can confirm and send your photos.">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name">
                  <input className={inputCls} value={form.name} onChange={(e) => set({ name: e.target.value })} autoComplete="name" placeholder="Jane Hartley" />
                </Field>
                <Field label="Phone">
                  <input className={inputCls} value={form.phone} onChange={(e) => set({ phone: e.target.value })} autoComplete="tel" inputMode="tel" placeholder="07700 900123" />
                </Field>
                <Field label="Email" className="sm:col-span-2">
                  <input className={inputCls} type="email" value={form.email} onChange={(e) => set({ email: e.target.value })} autoComplete="email" placeholder="jane@example.com" />
                </Field>
                <Field label="Notes (optional)" className="sm:col-span-2">
                  <textarea
                    className={inputCls}
                    rows={3}
                    value={form.notes}
                    onChange={(e) => set({ notes: e.target.value })}
                    placeholder="Conservatory at the back, side gate code 1234, any access notes…"
                  />
                </Field>
              </div>
            </Fieldset>
          )}

          {step === 5 && (
            <Fieldset title="Review your booking" hint="Check everything looks right, then confirm.">
              <div className="rounded-2xl border border-hairline bg-elevated p-5">
                <Row label="Service" value={services.find((s) => s.key === form.service)?.label ?? " - "} />
                <Row label="Property" value={propertyTypes.find((p) => p.key === form.propertyType)?.label ?? " - "} />
                <Row label="Address" value={`${form.address}, ${form.postcode}`} />
                <Row label="Date & time" value={`${formatDay(form.date)} at ${form.time}`} />
                <Row label="Name" value={form.name} />
                <Row label="Contact" value={`${form.phone} · ${form.email}`} />
                {form.notes && <Row label="Notes" value={form.notes} />}
                <div className="mt-3 flex items-center justify-between border-t border-hairline pt-3">
                  <span className="text-sm font-semibold text-ink">Estimated price</span>
                  <span className="text-lg font-extrabold text-navy-600 dark:text-sky-soft">
                    {estimate?.needsQuote ? "Quote to follow" : estimate?.label}
                  </span>
                </div>
                {estimate?.needsQuote && (
                  <p className="mt-2 text-xs text-muted">{estimate.label}</p>
                )}
              </div>
            </Fieldset>
          )}
        </motion.div>
      </AnimatePresence>

      {error && (
        <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      )}

      {/* Sticky price + nav */}
      <div className="mt-8 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="inline-flex h-12 items-center gap-1.5 rounded-full px-4 font-semibold text-muted transition-colors hover:text-ink disabled:invisible"
        >
          <CaretLeft size={18} weight="bold" /> Back
        </button>

        <div className="flex items-center gap-4">
          {estimate && !estimate.needsQuote && (
            <span className="hidden text-sm text-muted sm:block">
              Est. <span className="font-bold text-ink">{estimate.label}</span>
            </span>
          )}
          {step < steps.length - 1 ? (
            <button
              type="button"
              onClick={() => canAdvance() && setStep((s) => s + 1)}
              disabled={!canAdvance()}
              className="inline-flex h-12 items-center gap-1.5 rounded-full bg-[var(--color-amber-brand)] px-6 font-semibold text-navy-950 transition-[transform,opacity] hover:bg-[var(--color-amber-deep)] active:translate-y-px disabled:opacity-40"
            >
              Continue <CaretRight size={18} weight="bold" />
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={submitting}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-[var(--color-amber-brand)] px-7 font-semibold text-navy-950 transition-[transform,opacity] hover:bg-[var(--color-amber-deep)] active:translate-y-px disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <CircleNotch size={18} weight="bold" className="animate-spin" /> Booking…
                </>
              ) : (
                <>
                  Confirm booking <CheckCircle size={18} weight="fill" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-hairline bg-surface px-4 py-3 text-ink placeholder:text-[var(--ink-muted)] focus-visible:outline-2 focus-visible:outline-[var(--color-sky-brand)]";

function Fieldset({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{title}</h1>
      {hint && <p className="mt-1 text-muted">{hint}</p>}
      <div className="mt-6">{children}</div>
    </div>
  );
}

function Field({ label, className = "", children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-semibold text-ink">{label}</span>
      {children}
    </label>
  );
}

function Choice({
  selected,
  title,
  subtitle,
  onClick,
}: {
  selected: boolean;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-colors ${
        selected
          ? "border-[var(--color-amber-brand)] bg-[var(--color-amber-brand)]/10"
          : "border-hairline bg-elevated hover:border-[var(--color-sky-brand)]"
      }`}
    >
      <span
        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${
          selected ? "border-[var(--color-amber-brand)] bg-[var(--color-amber-brand)]" : "border-[var(--hairline)]"
        }`}
      >
        {selected && <CheckCircle size={16} weight="fill" className="text-navy-950" />}
      </span>
      <span>
        <span className="block font-bold text-ink">{title}</span>
        <span className="mt-0.5 block text-sm text-muted">{subtitle}</span>
      </span>
    </button>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-1.5 text-sm">
      <span className="text-muted">{label}</span>
      <span className="text-right font-semibold text-ink">{value}</span>
    </div>
  );
}
