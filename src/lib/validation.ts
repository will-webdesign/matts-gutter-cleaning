import { z } from "zod";
import { propertyTypes, services } from "./pricing";

const propertyKeys = propertyTypes.map((p) => p.key) as [string, ...string[]];
const serviceKeys = services.map((s) => s.key) as [string, ...string[]];

// UK-ish phone: allows spaces, +44, leading 0. Kept lenient on purpose.
const phone = z
  .string()
  .trim()
  .min(7, "Please enter a valid phone number")
  .max(20)
  .regex(/^[0-9 +()-]+$/, "Please enter a valid phone number");

export const quoteSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email: z.string().trim().email("Please enter a valid email"),
  phone,
  postcode: z.string().trim().min(4, "Please enter your postcode").max(10),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});
export type QuoteInput = z.infer<typeof quoteSchema>;

export const bookingSchema = z.object({
  service: z.enum(serviceKeys),
  propertyType: z.enum(propertyKeys),
  address: z.string().trim().min(4, "Please enter your address").max(160),
  postcode: z.string().trim().min(4, "Please enter your postcode").max(10),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Please choose a date"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Please choose a time slot"),
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email: z.string().trim().email("Please enter a valid email"),
  phone,
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});
export type BookingInput = z.infer<typeof bookingSchema>;
