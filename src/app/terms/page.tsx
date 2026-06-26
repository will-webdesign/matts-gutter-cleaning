import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/LegalPage";
import { business } from "@/lib/business";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms that apply when you book ${business.name}.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="June 2026">
      <p>
        These terms apply when you book or use the services of {business.name}. By making a booking
        you agree to them.
      </p>

      <h2>Quotes and pricing</h2>
      <p>
        Prices shown are a guide for standard two-storey homes and include downpipe clearing.
        Additional charges may apply for three-storey homes, conservatories, porches, extensions or
        difficult access. We will confirm the final price before starting work.
      </p>

      <h2>Bookings</h2>
      <p>
        A booking made online is a request. We will confirm the date and time by email. If a slot
        becomes unavailable we will contact you to arrange an alternative.
      </p>

      <h2>Access</h2>
      <p>
        Please ensure we have safe access to all sides of the property. If we cannot safely reach an
        area, we will let you know and adjust the work accordingly.
      </p>

      <h2>Cancellations</h2>
      <p>
        You can cancel or reschedule by contacting us on {business.phone}. We appreciate as much
        notice as possible so we can offer the slot to someone else.
      </p>

      <h2>Insurance</h2>
      <p>
        {business.name} is fully insured. Proof of insurance is available on request.
      </p>

      <h2>Contact</h2>
      <p>
        {business.name}, {business.address.street}, {business.address.locality},{" "}
        {business.address.region} {business.address.postcode}. {business.phone}.
      </p>
    </LegalPage>
  );
}
