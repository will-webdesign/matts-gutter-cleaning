import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

function csvCell(v: unknown): string {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// GET /api/admin/export -> CSV download of all bookings.
export async function GET() {
  if (!(await isAuthenticated())) {
    return new Response("Unauthorized", { status: 401 });
  }

  const bookings = await prisma.booking.findMany({ orderBy: [{ date: "asc" }, { time: "asc" }] });
  const header = [
    "id", "createdAt", "status", "date", "time", "service", "propertyType",
    "name", "email", "phone", "address", "postcode", "priceFrom", "priceTo", "needsQuote", "notes",
  ];
  const rows = bookings.map((b) =>
    [
      b.id, b.createdAt.toISOString(), b.status, b.date, b.time, b.service, b.propertyType,
      b.name, b.email, b.phone, b.address, b.postcode, b.priceFrom, b.priceTo, b.needsQuote, b.notes,
    ]
      .map(csvCell)
      .join(","),
  );
  const csv = [header.join(","), ...rows].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="bookings-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
