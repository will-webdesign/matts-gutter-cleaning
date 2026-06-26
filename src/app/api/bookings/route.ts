import { NextResponse } from "next/server";
import { bookingSchema } from "@/lib/validation";
import { createBooking, SlotTakenError } from "@/lib/bookings";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check your details", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  try {
    const booking = await createBooking(parsed.data);
    return NextResponse.json({ ok: true, id: booking.id }, { status: 201 });
  } catch (err) {
    if (err instanceof SlotTakenError) {
      return NextResponse.json({ error: err.message, code: "SLOT_TAKEN" }, { status: 409 });
    }
    console.error("[bookings] create failed:", err);
    return NextResponse.json({ error: "Could not create your booking" }, { status: 500 });
  }
}
