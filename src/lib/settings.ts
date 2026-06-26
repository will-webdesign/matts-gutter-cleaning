import { prisma } from "./prisma";

/**
 * Availability configuration. Stored as a single JSON row in the Setting table
 * so Matt can edit it from the admin dashboard. `getAvailabilityConfig` always
 * returns sensible defaults if nothing is saved yet.
 */
export type AvailabilityConfig = {
  // 0 = Sunday ... 6 = Saturday. Days Matt works.
  workingDays: number[];
  // Slot start times offered to customers (HH:mm).
  slots: string[];
  // Cap on jobs accepted per day (prevents over-booking).
  maxJobsPerDay: number;
  // When true, no new online bookings are accepted (holiday mode).
  holidayMode: boolean;
  // Minimum notice in days before the earliest bookable date.
  leadTimeDays: number;
};

export const DEFAULT_AVAILABILITY: AvailabilityConfig = {
  workingDays: [1, 2, 3, 4, 5, 6], // Mon-Sat (Sunday off for online booking by default)
  slots: ["09:00", "10:30", "12:00", "13:30", "15:00", "16:30"],
  maxJobsPerDay: 5,
  holidayMode: false,
  leadTimeDays: 1,
};

const KEY = "availability";

export async function getAvailabilityConfig(): Promise<AvailabilityConfig> {
  try {
    const row = await prisma.setting.findUnique({ where: { key: KEY } });
    if (!row) return DEFAULT_AVAILABILITY;
    return { ...DEFAULT_AVAILABILITY, ...JSON.parse(row.value) };
  } catch {
    return DEFAULT_AVAILABILITY;
  }
}

export async function saveAvailabilityConfig(config: AvailabilityConfig) {
  await prisma.setting.upsert({
    where: { key: KEY },
    create: { key: KEY, value: JSON.stringify(config) },
    update: { value: JSON.stringify(config) },
  });
}
