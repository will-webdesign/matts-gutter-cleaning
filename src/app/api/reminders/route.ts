import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { toISODate } from "@/lib/availability";
import { sendAnnualReminder, sendBookingConfirmed } from "@/lib/email";
import { toEmailData } from "@/lib/bookings";

/**
 * Processes due reminders. Call from a daily cron (e.g. Vercel Cron, Cloudflare
 * Cron Trigger, or `curl`) with an Authorization: Bearer <CRON_SECRET> header,
 * or while logged in as admin.
 *
 *   1. Annual "book again" reminders (12 months after a completed job).
 *   2. Day-before appointment reminders for confirmed bookings.
 */
async function authorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (secret && auth === `Bearer ${secret}`) return true;
  return isAuthenticated();
}

export async function GET(request: Request) {
  if (!(await authorized(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = toISODate(new Date());
  const tomorrow = toISODate(new Date(Date.now() + 86_400_000));

  // 1. Annual reminders due today or earlier.
  const dueAnnual = await prisma.annualReminder.findMany({
    where: { sent: false, dueDate: { lte: today } },
  });
  for (const r of dueAnnual) {
    const res = await sendAnnualReminder({ name: r.name, email: r.email });
    if (res.ok) {
      await prisma.annualReminder.update({ where: { id: r.id }, data: { sent: true } });
    }
  }

  // 2. Day-before reminders for confirmed jobs happening tomorrow.
  const upcoming = await prisma.booking.findMany({
    where: { status: "confirmed", date: tomorrow, reminderSentAt: null },
  });
  for (const b of upcoming) {
    const res = await sendBookingConfirmed(toEmailData(b));
    if (res.ok) {
      await prisma.booking.update({ where: { id: b.id }, data: { reminderSentAt: new Date() } });
    }
  }

  return NextResponse.json({
    ok: true,
    annualSent: dueAnnual.length,
    dayBeforeSent: upcoming.length,
  });
}
