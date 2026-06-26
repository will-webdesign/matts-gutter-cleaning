import { prisma } from "./prisma";
import { estimatePrice } from "./pricing";
import { isSlotBookable } from "./availability";
import type { BookingInput } from "./validation";
import {
  sendBookingCreatedToCustomer,
  sendBookingCreatedToOwner,
  type BookingEmailData,
} from "./email";
import type { Booking } from "@/generated/prisma/client";

export function toEmailData(b: Booking): BookingEmailData {
  return {
    id: b.id,
    name: b.name,
    email: b.email,
    phone: b.phone,
    service: b.service,
    propertyType: b.propertyType,
    address: b.address,
    postcode: b.postcode,
    date: b.date,
    time: b.time,
    notes: b.notes,
    priceFrom: b.priceFrom,
    priceTo: b.priceTo,
    needsQuote: b.needsQuote,
  };
}

export class SlotTakenError extends Error {
  constructor() {
    super("That slot has just been taken. Please choose another time.");
    this.name = "SlotTakenError";
  }
}

/**
 * Creates a booking after re-checking slot availability (prevents double
 * booking), upserts the customer record, stores the price estimate, and fires
 * the customer + owner notification emails.
 */
export async function createBooking(input: BookingInput) {
  if (!(await isSlotBookable(input.date, input.time))) {
    throw new SlotTakenError();
  }

  const estimate = estimatePrice(input.propertyType, input.service);

  const customer = await prisma.customer.upsert({
    where: { email: input.email.toLowerCase() },
    create: { name: input.name, email: input.email.toLowerCase(), phone: input.phone },
    update: { name: input.name, phone: input.phone },
  });

  const booking = await prisma.booking.create({
    data: {
      service: input.service,
      propertyType: input.propertyType,
      address: input.address,
      postcode: input.postcode.toUpperCase(),
      date: input.date,
      time: input.time,
      name: input.name,
      email: input.email.toLowerCase(),
      phone: input.phone,
      notes: input.notes || null,
      priceFrom: estimate.from,
      priceTo: estimate.to,
      needsQuote: estimate.needsQuote,
      status: "pending",
      customerId: customer.id,
    },
  });

  // Fire-and-await emails (best effort - failures are logged, not fatal).
  const data = toEmailData(booking);
  await Promise.allSettled([
    sendBookingCreatedToCustomer(data),
    sendBookingCreatedToOwner(data),
  ]);

  return booking;
}
