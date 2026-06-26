"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarBlank,
  CheckCircle,
  XCircle,
  Clock,
  CurrencyGbp,
  Users,
  ArrowsClockwise,
  SignOut,
  DownloadSimple,
  MagnifyingGlass,
  Bell,
  ArrowClockwise,
  Trash,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";
import { services, propertyTypes } from "@/lib/pricing";

export type AdminBooking = {
  id: string;
  createdAt: string;
  service: string;
  propertyType: string;
  address: string;
  postcode: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  notes: string | null;
  status: string;
  priceFrom: number | null;
  priceTo: number | null;
  needsQuote: boolean;
};

type Stats = {
  today: number;
  upcoming: number;
  pending: number;
  monthlyRevenue: number;
  totalCustomers: number;
  repeatCustomers: number;
  remindersWaiting: number;
};

const serviceLabel = (k: string) => services.find((s) => s.key === k)?.label ?? k;
const propertyLabel = (k: string) => propertyTypes.find((p) => p.key === k)?.label ?? k;

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300",
  confirmed: "bg-sky-100 text-sky-800 dark:bg-sky-400/15 dark:text-sky-300",
  completed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300",
  cancelled: "bg-zinc-200 text-zinc-600 dark:bg-zinc-700/40 dark:text-zinc-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-400/15 dark:text-red-300",
};

const tabs = ["Today", "This week", "All bookings", "Calendar"] as const;
type Tab = (typeof tabs)[number];

function fmtDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}
function priceText(b: AdminBooking) {
  if (b.needsQuote || b.priceFrom == null) return "Quote";
  return b.priceFrom === b.priceTo ? `£${b.priceFrom}` : `£${b.priceFrom}-${b.priceTo}`;
}

export function AdminDashboard({
  bookings: initial,
  stats,
  today,
}: {
  bookings: AdminBooking[];
  stats: Stats;
  today: string;
}) {
  const router = useRouter();
  const [bookings, setBookings] = useState(initial);
  const [tab, setTab] = useState<Tab>("Today");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [busyId, setBusyId] = useState<string | null>(null);

  const weekEnd = useMemo(() => {
    const [y, m, d] = today.split("-").map(Number);
    const end = new Date(y, m - 1, d + 7);
    return end.toISOString().slice(0, 10);
  }, [today]);

  const filtered = useMemo(() => {
    let list = bookings;
    if (tab === "Today") list = list.filter((b) => b.date === today);
    else if (tab === "This week") list = list.filter((b) => b.date >= today && b.date <= weekEnd);
    if (statusFilter !== "all") list = list.filter((b) => b.status === statusFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.email.toLowerCase().includes(q) ||
          b.phone.includes(q) ||
          b.postcode.toLowerCase().includes(q),
      );
    }
    return list;
  }, [bookings, tab, statusFilter, query, today, weekEnd]);

  async function act(id: string, action: string, extra?: Record<string, unknown>) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...extra }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Action failed");
        return;
      }
      if (data.booking) {
        setBookings((bs) => bs.map((b) => (b.id === id ? { ...b, ...data.booking } : b)));
      }
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this booking permanently?")) return;
    setBusyId(id);
    try {
      await fetch(`/api/admin/bookings/${id}`, { method: "DELETE" });
      setBookings((bs) => bs.filter((b) => b.id !== id));
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function reschedule(b: AdminBooking) {
    const date = prompt("New date (YYYY-MM-DD):", b.date);
    if (!date) return;
    const time = prompt("New time (HH:MM):", b.time);
    if (!time) return;
    await act(b.id, "reschedule", { date, time });
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-[100dvh]">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-hairline bg-[var(--bg)]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-ink">Dashboard</h1>
            <p className="text-xs text-muted">Matt&apos;s Gutter Cleaning</p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/api/admin/export"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-hairline bg-elevated px-4 text-sm font-semibold text-ink hover:text-[var(--color-sky-brand)]"
            >
              <DownloadSimple size={18} weight="bold" /> <span className="hidden sm:inline">Export CSV</span>
            </a>
            <button
              onClick={logout}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-navy-600 px-4 text-sm font-semibold text-white"
            >
              <SignOut size={18} weight="bold" /> <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
          <Stat icon={<CalendarBlank size={20} weight="duotone" />} label="Today's jobs" value={stats.today} />
          <Stat icon={<Clock size={20} weight="duotone" />} label="Upcoming" value={stats.upcoming} />
          <Stat icon={<Bell size={20} weight="duotone" />} label="Pending" value={stats.pending} />
          <Stat icon={<CurrencyGbp size={20} weight="duotone" />} label="Revenue (mo)" value={`£${stats.monthlyRevenue}`} />
          <Stat icon={<Users size={20} weight="duotone" />} label="Customers" value={stats.totalCustomers} />
          <Stat icon={<ArrowsClockwise size={20} weight="duotone" />} label="Repeat" value={stats.repeatCustomers} />
          <Stat icon={<Bell size={20} weight="duotone" />} label="Reminders due" value={stats.remindersWaiting} />
        </div>

        {/* Controls */}
        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-1 overflow-x-auto rounded-full border border-hairline bg-elevated p-1">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  tab === t ? "bg-navy-600 text-white" : "text-muted hover:text-ink"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          {tab !== "Calendar" && (
            <div className="flex flex-1 gap-2 lg:max-w-md">
              <div className="relative flex-1">
                <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search name, email, phone, postcode"
                  className="h-10 w-full rounded-full border border-hairline bg-elevated pl-10 pr-4 text-sm text-ink placeholder:text-[var(--ink-muted)] focus-visible:outline-2 focus-visible:outline-[var(--color-sky-brand)]"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 rounded-full border border-hairline bg-elevated px-3 text-sm font-semibold text-ink"
              >
                <option value="all">All status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="mt-6">
          {tab === "Calendar" ? (
            <CalendarView bookings={bookings} today={today} />
          ) : filtered.length === 0 ? (
            <div className="rounded-[var(--radius-card)] border border-dashed border-hairline bg-elevated p-12 text-center">
              <CalendarBlank size={40} weight="duotone" className="mx-auto text-muted" />
              <p className="mt-3 font-semibold text-ink">No bookings here</p>
              <p className="text-sm text-muted">
                {tab === "Today" ? "Nothing scheduled for today." : "Try a different filter or tab."}
              </p>
            </div>
          ) : (
            <ul className="grid gap-3">
              {filtered.map((b) => (
                <li
                  key={b.id}
                  className="rounded-2xl border border-hairline bg-elevated p-4 shadow-[var(--shadow-soft)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-ink">{b.name}</span>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyles[b.status] ?? ""}`}>
                          {b.status}
                        </span>
                        <span className="text-sm font-semibold text-navy-600 dark:text-sky-soft">{priceText(b)}</span>
                      </div>
                      <p className="mt-1 text-sm text-muted">
                        {fmtDate(b.date)} at {b.time} · {serviceLabel(b.service)} · {propertyLabel(b.propertyType)}
                      </p>
                      <p className="mt-0.5 text-sm text-muted">
                        {b.address}, {b.postcode} · <a href={`tel:${b.phone}`} className="font-medium text-ink">{b.phone}</a> ·{" "}
                        <a href={`mailto:${b.email}`} className="text-[var(--color-sky-brand)]">{b.email}</a>
                      </p>
                      {b.notes && <p className="mt-2 rounded-lg bg-surface px-3 py-2 text-sm text-muted">{b.notes}</p>}
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 border-t border-hairline pt-3">
                    {b.status === "pending" && (
                      <Action onClick={() => act(b.id, "confirm")} busy={busyId === b.id} tone="confirm" icon={<CheckCircle size={16} weight="bold" />}>
                        Accept
                      </Action>
                    )}
                    {["pending", "confirmed"].includes(b.status) && (
                      <Action onClick={() => act(b.id, "complete")} busy={busyId === b.id} tone="complete" icon={<CheckCircle size={16} weight="bold" />}>
                        Mark complete
                      </Action>
                    )}
                    {["pending", "confirmed"].includes(b.status) && (
                      <Action onClick={() => reschedule(b)} busy={busyId === b.id} tone="neutral" icon={<ArrowClockwise size={16} weight="bold" />}>
                        Reschedule
                      </Action>
                    )}
                    {b.status === "pending" && (
                      <Action onClick={() => act(b.id, "reject")} busy={busyId === b.id} tone="danger" icon={<XCircle size={16} weight="bold" />}>
                        Reject
                      </Action>
                    )}
                    {b.status === "confirmed" && (
                      <Action onClick={() => act(b.id, "cancel")} busy={busyId === b.id} tone="danger" icon={<XCircle size={16} weight="bold" />}>
                        Cancel
                      </Action>
                    )}
                    <Action onClick={() => remove(b.id)} busy={busyId === b.id} tone="neutral" icon={<Trash size={16} weight="bold" />}>
                      Delete
                    </Action>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-hairline bg-elevated p-4 shadow-[var(--shadow-soft)]">
      <span className="text-navy-600 dark:text-sky-soft">{icon}</span>
      <p className="mt-2 text-2xl font-extrabold tracking-tight text-ink">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}

function Action({
  children,
  onClick,
  busy,
  tone,
  icon,
}: {
  children: React.ReactNode;
  onClick: () => void;
  busy: boolean;
  tone: "confirm" | "complete" | "danger" | "neutral";
  icon: React.ReactNode;
}) {
  const tones: Record<string, string> = {
    confirm: "bg-sky-600 text-white hover:bg-sky-700",
    complete: "bg-emerald-600 text-white hover:bg-emerald-700",
    danger: "border border-red-200 text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/40",
    neutral: "border border-hairline text-ink hover:bg-surface",
  };
  return (
    <button
      onClick={onClick}
      disabled={busy}
      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors disabled:opacity-50 ${tones[tone]}`}
    >
      {icon}
      {children}
    </button>
  );
}

function CalendarView({ bookings, today }: { bookings: AdminBooking[]; today: string }) {
  const [y0, m0] = today.split("-").map(Number);
  const [cursor, setCursor] = useState({ year: y0, month: m0 - 1 }); // month 0-indexed

  const { weeks, monthLabel } = useMemo(() => {
    const first = new Date(cursor.year, cursor.month, 1);
    const startDow = (first.getDay() + 6) % 7; // Monday-first
    const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate();
    const cells: (string | null)[] = [];
    for (let i = 0; i < startDow; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(`${cursor.year}-${String(cursor.month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
    }
    while (cells.length % 7 !== 0) cells.push(null);
    const w: (string | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) w.push(cells.slice(i, i + 7));
    return {
      weeks: w,
      monthLabel: first.toLocaleDateString("en-GB", { month: "long", year: "numeric" }),
    };
  }, [cursor]);

  const byDate = useMemo(() => {
    const map = new Map<string, AdminBooking[]>();
    for (const b of bookings) {
      if (["cancelled", "rejected"].includes(b.status)) continue;
      const arr = map.get(b.date) ?? [];
      arr.push(b);
      map.set(b.date, arr);
    }
    return map;
  }, [bookings]);

  const shift = (delta: number) => {
    setCursor((c) => {
      const m = c.month + delta;
      return { year: c.year + Math.floor(m / 12), month: ((m % 12) + 12) % 12 };
    });
  };

  return (
    <div className="rounded-[var(--radius-card)] border border-hairline bg-elevated p-4 shadow-[var(--shadow-soft)] sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-ink">{monthLabel}</h2>
        <div className="flex gap-2">
          <button onClick={() => shift(-1)} aria-label="Previous month" className="grid h-9 w-9 place-items-center rounded-full border border-hairline text-ink hover:bg-surface">
            <CaretLeft size={18} weight="bold" />
          </button>
          <button onClick={() => shift(1)} aria-label="Next month" className="grid h-9 w-9 place-items-center rounded-full border border-hairline text-ink hover:bg-surface">
            <CaretRight size={18} weight="bold" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d} className="py-2">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {weeks.flat().map((date, i) => {
          const jobs = date ? byDate.get(date) ?? [] : [];
          const isToday = date === today;
          return (
            <div
              key={i}
              className={`min-h-20 rounded-lg border p-1.5 text-left ${
                date ? "border-hairline bg-surface" : "border-transparent"
              } ${isToday ? "ring-2 ring-[var(--color-amber-brand)]" : ""}`}
            >
              {date && (
                <>
                  <span className={`text-xs font-semibold ${isToday ? "text-[var(--color-amber-deep)]" : "text-muted"}`}>
                    {Number(date.slice(-2))}
                  </span>
                  <div className="mt-1 space-y-1">
                    {jobs.slice(0, 3).map((b) => (
                      <div
                        key={b.id}
                        title={`${b.time} ${b.name}`}
                        className="truncate rounded bg-navy-600/10 px-1 py-0.5 text-[10px] font-medium text-navy-700 dark:bg-sky-400/15 dark:text-sky-200"
                      >
                        {b.time} {b.name.split(" ")[0]}
                      </div>
                    ))}
                    {jobs.length > 3 && <div className="text-[10px] text-muted">+{jobs.length - 3} more</div>}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
