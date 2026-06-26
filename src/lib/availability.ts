import { prisma } from "./prisma";
import { getAvailabilityConfig } from "./settings";

/** Local YYYY-MM-DD for a Date. */
export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Day-of-week (0=Sun..6=Sat) from a YYYY-MM-DD string, parsed as local. */
function dowFromISO(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).getDay();
}

export type DayAvailability = {
  date: string;
  available: boolean;
  reason?: string;
  slots: { time: string; available: boolean }[];
};

/**
 * Returns the available time slots for a single date, accounting for:
 *  - holiday mode
 *  - working days
 *  - blocked dates
 *  - max jobs per day
 *  - slots already taken by active (non-cancelled) bookings
 */
export async function getDayAvailability(date: string): Promise<DayAvailability> {
  const config = await getAvailabilityConfig();
  const emptySlots = config.slots.map((time) => ({ time, available: false }));

  if (config.holidayMode) {
    return { date, available: false, reason: "We're currently on holiday - please call to arrange.", slots: emptySlots };
  }
  if (!config.workingDays.includes(dowFromISO(date))) {
    return { date, available: false, reason: "Not a working day", slots: emptySlots };
  }

  const blocked = await prisma.blockedDate.findUnique({ where: { date } });
  if (blocked) {
    return { date, available: false, reason: blocked.reason || "Unavailable", slots: emptySlots };
  }

  const active = await prisma.booking.findMany({
    where: { date, status: { in: ["pending", "confirmed", "completed"] } },
    select: { time: true },
  });
  const takenTimes = new Set(active.map((b) => b.time));
  const atCapacity = active.length >= config.maxJobsPerDay;

  const slots = config.slots.map((time) => ({
    time,
    available: !atCapacity && !takenTimes.has(time),
  }));

  return {
    date,
    available: slots.some((s) => s.available),
    reason: atCapacity ? "Fully booked" : undefined,
    slots,
  };
}

/** Availability for a range of days starting from `start` (inclusive). */
export async function getRangeAvailability(start: Date, days: number): Promise<DayAvailability[]> {
  const out: DayAvailability[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    out.push(await getDayAvailability(toISODate(d)));
  }
  return out;
}

/** True if a specific date+time can still be booked (used to prevent double-booking). */
export async function isSlotBookable(date: string, time: string): Promise<boolean> {
  const day = await getDayAvailability(date);
  return day.slots.some((s) => s.time === time && s.available);
}

/** The earliest date a customer may book, respecting the lead time. */
export async function earliestBookableDate(): Promise<string> {
  const config = await getAvailabilityConfig();
  const d = new Date();
  d.setDate(d.getDate() + config.leadTimeDays);
  return toISODate(d);
}
