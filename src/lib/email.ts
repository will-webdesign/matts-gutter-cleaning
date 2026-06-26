import { Resend } from "resend";
import { business } from "./business";
import { getService, getPropertyType } from "./pricing";

/**
 * Email layer built on Resend. If RESEND_API_KEY is not configured, emails are
 * logged to the server console instead of sent - so the whole booking flow works
 * end-to-end in local development with zero setup.
 *
 * Required env for live sending:
 *   RESEND_API_KEY - from https://resend.com
 *   EMAIL_FROM - a verified sender, e.g. "Matt's Gutter Cleaning <bookings@yourdomain.co.uk>"
 */

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.EMAIL_FROM || `${business.name} <onboarding@resend.dev>`;
const resend = apiKey ? new Resend(apiKey) : null;

type Mail = { to: string; subject: string; html: string };

async function send({ to, subject, html }: Mail) {
  if (!resend) {
    // Graceful no-op in dev / when unconfigured.
    console.info(`[email] (not sent - RESEND_API_KEY missing) to=${to} subject="${subject}"`);
    return { ok: true, simulated: true };
  }
  try {
    await resend.emails.send({ from, to, subject, html });
    return { ok: true, simulated: false };
  } catch (err) {
    console.error("[email] send failed:", err);
    return { ok: false, simulated: false };
  }
}

export type BookingEmailData = {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  propertyType: string;
  address: string;
  postcode: string;
  date: string;
  time: string;
  notes?: string | null;
  priceFrom?: number | null;
  priceTo?: number | null;
  needsQuote?: boolean;
};

function priceText(b: BookingEmailData) {
  if (b.needsQuote || b.priceFrom == null) {
    return "We'll confirm the exact quote after reviewing your property.";
  }
  return b.priceFrom === b.priceTo ? `£${b.priceFrom}` : `£${b.priceFrom}-£${b.priceTo}`;
}

function shell(title: string, bodyHtml: string) {
  return `<!doctype html><html><body style="margin:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#1a202c">
    <div style="max-width:560px;margin:0 auto;padding:24px">
      <div style="background:#0f4c81;color:#fff;border-radius:16px 16px 0 0;padding:24px">
        <strong style="font-size:18px">${business.name}</strong>
      </div>
      <div style="background:#fff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 16px 16px;padding:24px">
        <h1 style="margin:0 0 12px;font-size:20px;color:#0f4c81">${title}</h1>
        ${bodyHtml}
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0" />
        <p style="font-size:13px;color:#51607a;margin:0">
          ${business.name} · ${business.phone}<br/>
          ${business.address.street}, ${business.address.locality}, ${business.address.region} ${business.address.postcode}
        </p>
      </div>
    </div>
  </body></html>`;
}

function detailsTable(b: BookingEmailData) {
  const service = getService(b.service)?.label ?? b.service;
  const property = getPropertyType(b.propertyType)?.label ?? b.propertyType;
  const row = (k: string, v: string) =>
    `<tr><td style="padding:6px 0;color:#51607a;width:130px">${k}</td><td style="padding:6px 0;font-weight:600">${v}</td></tr>`;
  return `<table style="width:100%;border-collapse:collapse;font-size:14px">
    ${row("Service", service)}
    ${row("Property", property)}
    ${row("Date", b.date)}
    ${row("Time", b.time)}
    ${row("Address", `${b.address}, ${b.postcode}`)}
    ${row("Estimate", priceText(b))}
    ${b.notes ? row("Notes", b.notes) : ""}
  </table>`;
}

const cta = (href: string, label: string) =>
  `<a href="${href}" style="display:inline-block;background:#f4b400;color:#051a2c;font-weight:700;text-decoration:none;padding:12px 22px;border-radius:999px;margin-top:8px">${label}</a>`;

export function sendBookingCreatedToCustomer(b: BookingEmailData) {
  return send({
    to: b.email,
    subject: `We've received your booking - ${business.name}`,
    html: shell(
      `Thanks ${b.name.split(" ")[0]}, your booking request is in`,
      `<p style="font-size:15px;line-height:1.6">We'll review it and confirm shortly. Here are your details:</p>
       ${detailsTable(b)}
       <p style="font-size:14px;color:#51607a">Need to change anything? Just reply to this email or call ${business.phone}.</p>`,
    ),
  });
}

export function sendBookingCreatedToOwner(b: BookingEmailData) {
  return send({
    to: business.ownerEmail,
    subject: `New booking: ${b.name} - ${b.date} ${b.time}`,
    html: shell(
      "New online booking",
      `${detailsTable(b)}
       <p style="font-size:14px"><strong>Customer:</strong> ${b.name} · ${b.phone} · ${b.email}</p>
       ${cta(`${business.url}/admin`, "Open admin dashboard")}`,
    ),
  });
}

export function sendBookingConfirmed(b: BookingEmailData) {
  return send({
    to: b.email,
    subject: `Booking confirmed for ${b.date} - ${business.name}`,
    html: shell(
      "Your gutter clean is confirmed",
      `<p style="font-size:15px;line-height:1.6">Great news - we've confirmed your appointment.</p>
       ${detailsTable(b)}
       <p style="font-size:14px;color:#51607a">We'll send before-and-after photos once the job is done.</p>`,
    ),
  });
}

export function sendBookingCancelled(b: BookingEmailData) {
  return send({
    to: b.email,
    subject: `Booking cancelled - ${business.name}`,
    html: shell(
      "Your booking has been cancelled",
      `<p style="font-size:15px;line-height:1.6">Your appointment for ${b.date} at ${b.time} has been cancelled. If this was a mistake, please call ${business.phone} and we'll sort it out.</p>
       ${cta(`${business.url}/book`, "Book a new slot")}`,
    ),
  });
}

export function sendBookingRescheduled(b: BookingEmailData) {
  return send({
    to: b.email,
    subject: `Your appointment has moved - ${business.name}`,
    html: shell(
      "Your appointment has been rescheduled",
      `<p style="font-size:15px;line-height:1.6">Your appointment is now:</p>
       ${detailsTable(b)}
       <p style="font-size:14px;color:#51607a">If that doesn't suit, call ${business.phone}.</p>`,
    ),
  });
}

export function sendAnnualReminder(b: { name: string; email: string }) {
  return send({
    to: b.email,
    subject: `Time for your annual gutter clean? - ${business.name}`,
    html: shell(
      "It's been a year - keep your gutters clear",
      `<p style="font-size:15px;line-height:1.6">Hi ${b.name.split(" ")[0]}, it's roughly twelve months since we last cleaned your gutters. A quick annual clean now keeps them flowing and protects your home through the wetter months.</p>
       ${cta(`${business.url}/book`, "Book your annual clean")}`,
    ),
  });
}

export function sendQuoteRequestToOwner(data: {
  name: string;
  email: string;
  phone: string;
  postcode: string;
  message?: string;
}) {
  return send({
    to: business.ownerEmail,
    subject: `New quote request from ${data.name}`,
    html: shell(
      "New quote request",
      `<table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:6px 0;color:#51607a;width:120px">Name</td><td style="font-weight:600">${data.name}</td></tr>
        <tr><td style="padding:6px 0;color:#51607a">Phone</td><td style="font-weight:600">${data.phone}</td></tr>
        <tr><td style="padding:6px 0;color:#51607a">Email</td><td style="font-weight:600">${data.email}</td></tr>
        <tr><td style="padding:6px 0;color:#51607a">Postcode</td><td style="font-weight:600">${data.postcode}</td></tr>
      </table>
      ${data.message ? `<p style="font-size:14px;line-height:1.6;margin-top:12px"><strong>Message:</strong><br/>${data.message}</p>` : ""}`,
    ),
  });
}
