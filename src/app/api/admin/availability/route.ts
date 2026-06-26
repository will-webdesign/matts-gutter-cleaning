import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { getAvailabilityConfig, saveAvailabilityConfig } from "@/lib/settings";

const configSchema = z.object({
  workingDays: z.array(z.number().min(0).max(6)),
  slots: z.array(z.string().regex(/^\d{2}:\d{2}$/)),
  maxJobsPerDay: z.number().min(1).max(20),
  holidayMode: z.boolean(),
  leadTimeDays: z.number().min(0).max(30),
});

// GET -> current config + blocked dates
export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const config = await getAvailabilityConfig();
  const blocked = await prisma.blockedDate.findMany({ orderBy: { date: "asc" } });
  return NextResponse.json({ config, blocked });
}

// PUT -> save config
export async function PUT(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = configSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid config" }, { status: 422 });
  await saveAvailabilityConfig(parsed.data);
  return NextResponse.json({ ok: true });
}

// POST -> block a date  { date, reason? }
export async function POST(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const schema = z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), reason: z.string().max(120).optional() });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid date" }, { status: 422 });
  const blocked = await prisma.blockedDate.upsert({
    where: { date: parsed.data.date },
    create: { date: parsed.data.date, reason: parsed.data.reason },
    update: { reason: parsed.data.reason },
  });
  return NextResponse.json({ ok: true, blocked });
}

// DELETE ?date=ISO -> unblock a date
export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const date = new URL(request.url).searchParams.get("date");
  if (!date) return NextResponse.json({ error: "date required" }, { status: 400 });
  await prisma.blockedDate.delete({ where: { date } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
