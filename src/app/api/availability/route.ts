import { NextResponse } from "next/server";
import { getRangeAvailability, getDayAvailability, toISODate, earliestBookableDate } from "@/lib/availability";

// GET /api/availability            -> next 35 days from the earliest bookable date
// GET /api/availability?date=ISO   -> slots for a single date
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }
    const day = await getDayAvailability(date);
    return NextResponse.json(day);
  }

  const earliest = await earliestBookableDate();
  const [y, m, d] = earliest.split("-").map(Number);
  const start = new Date(y, m - 1, d);
  const days = await getRangeAvailability(start, 35);
  return NextResponse.json({ earliest: toISODate(start), days });
}
