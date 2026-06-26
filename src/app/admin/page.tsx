import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toISODate } from "@/lib/availability";
import { AdminDashboard, type AdminBooking } from "@/components/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (!(await isAuthenticated())) redirect("/admin/login");

  const [rows, customers, reminders] = await Promise.all([
    prisma.booking.findMany({ orderBy: [{ date: "asc" }, { time: "asc" }] }),
    prisma.customer.findMany({ include: { _count: { select: { bookings: true } } } }),
    prisma.annualReminder.findMany({ where: { sent: false } }),
  ]);

  const today = toISODate(new Date());
  const monthPrefix = today.slice(0, 7);

  const bookings: AdminBooking[] = rows.map((b) => ({
    id: b.id,
    createdAt: b.createdAt.toISOString(),
    service: b.service,
    propertyType: b.propertyType,
    address: b.address,
    postcode: b.postcode,
    date: b.date,
    time: b.time,
    name: b.name,
    email: b.email,
    phone: b.phone,
    notes: b.notes,
    status: b.status,
    priceFrom: b.priceFrom,
    priceTo: b.priceTo,
    needsQuote: b.needsQuote,
  }));

  const completed = bookings.filter((b) => b.status === "completed");
  const stats = {
    today: bookings.filter((b) => b.date === today && ["pending", "confirmed"].includes(b.status)).length,
    upcoming: bookings.filter((b) => b.date >= today && ["pending", "confirmed"].includes(b.status)).length,
    pending: bookings.filter((b) => b.status === "pending").length,
    monthlyRevenue: completed
      .filter((b) => b.date.startsWith(monthPrefix))
      .reduce((sum, b) => sum + (b.priceFrom ?? 0), 0),
    totalCustomers: customers.length,
    repeatCustomers: customers.filter((c) => c._count.bookings > 1).length,
    remindersWaiting: reminders.filter((r) => r.dueDate <= today).length,
  };

  return <AdminDashboard bookings={bookings} stats={stats} today={today} />;
}
