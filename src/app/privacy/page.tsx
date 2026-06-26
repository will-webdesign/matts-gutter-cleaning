import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/LegalPage";
import { business } from "@/lib/business";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${business.name} collects, uses and protects your personal information.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="June 2026">
      <p>
        {business.name} (&quot;we&quot;, &quot;us&quot;) is committed to protecting your privacy.
        This policy explains what information we collect when you use our website or book our
        services, and how we use it.
      </p>

      <h2>Information we collect</h2>
      <p>
        When you request a quote or make a booking, we collect your name, email address, phone
        number, property address and any notes you provide. This is the information we need to
        contact you and carry out the work.
      </p>

      <h2>How we use your information</h2>
      <ul>
        <li>To respond to quote requests and arrange appointments.</li>
        <li>To send booking confirmations, reminders and before-and-after photos.</li>
        <li>To send an annual reminder when your gutters are due for cleaning again.</li>
        <li>To keep records of work carried out for insurance and accounting.</li>
      </ul>

      <h2>Sharing your information</h2>
      <p>
        We do not sell your data. We only share it with trusted services that help us run the
        business (for example our email provider) and only as far as needed to provide our service.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask us to access, correct or delete your personal information at any time. To do so,
        contact us on {business.phone} or at {business.email}.
      </p>

      <h2>Contact</h2>
      <p>
        {business.name}, {business.address.street}, {business.address.locality},{" "}
        {business.address.region} {business.address.postcode}.
      </p>
    </LegalPage>
  );
}
