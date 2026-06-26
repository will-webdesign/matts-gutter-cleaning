import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { isSlotBookable } from "@/lib/availability";
import { toEmailData } from "@/lib/bookings";
import {
  sendBookingConfirmed,
  sendBookingCancelled,
  sendBookingRescheduled,
} from "@/lib/email";

const actionSchema = z.object({
  action: z.enum(["confirm", "cancel", "reject", "complete", "reschedule", "note"]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  notes: z.string().max(1000).optional(),
});

/** Add 12 months to a YYYY-MM-DD string. */
function plusOneYear(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y + 1, m - 1, d);
  return dt.toISOString().slice(0, 10);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const parsed = actionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid action" }, { status: 422 });
  }

  const existing = await prisma.booking.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { action, date, time, notes } = parsed.data;

  switch (action) {
    case "confirm": {
      const b = await prisma.booking.update({ where: { id }, data: { status: "confirmed" } });
      await sendBookingConfirmed(toEmailData(b));
      return NextResponse.json({ ok: true, booking: b });
    }
    case "cancel":
    case "reject": {
      const b = await prisma.booking.update({
        where: { id },
        data: { status: action === "cancel" ? "cancelled" : "rejected" },
      });
      await sendBookingCancelled(toEmailData(b));
      return NextResponse.json({ ok: true, booking: b });
    }
    case "complete": {
      const b = await prisma.booking.update({ where: { id }, data: { status: "completed" } });
      // Schedule the 12-month annual reminder (the headline selling point).
      await prisma.annualReminder.create({
        data: { bookingId: b.id, email: b.email, name: b.name, dueDate: plusOneYear(b.date) },
      });
      return NextResponse.json({ ok: true, booking: b });
    }
    case "reschedule": {
      if (!date || !time) {
        return NextResponse.json({ error: "New date and time required" }, { status: 422 });
      }
      // Don't allow rescheduling onto a taken slot (unless it's the same slot).
      if ((date !== existing.date || time !== existing.time) && !(await isSlotBookable(date, time))) {
        return NextResponse.json({ error: "That slot is unavailable", code: "SLOT_TAKEN" }, { status: 409 });
      }
      const b = await prisma.booking.update({ where: { id }, data: { date, time } });
      await sendBookingRescheduled(toEmailData(b));
      return NextResponse.json({ ok: true, booking: b });
    }
    case "note": {
      const b = await prisma.booking.update({ where: { id }, data: { notes: notes ?? "" } });
      return NextResponse.json({ ok: true, booking: b });
    }
    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await prisma.booking.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
