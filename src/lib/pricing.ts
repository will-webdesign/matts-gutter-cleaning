/**
 * Pricing guide (two-storey properties). Prices include downpipe clearing.
 * Used by the marketing Pricing section AND the booking system's automatic
 * price estimator. Keep property-type keys in sync with `propertyTypes`.
 */

export type PropertyTypeKey =
  | "terraced"
  | "terraced-offshot"
  | "end-terrace"
  | "semi-2"
  | "semi-3"
  | "detached"
  | "other";

export const propertyTypes: {
  key: PropertyTypeKey;
  label: string;
  /** null min/max means "quote on inspection". */
  from: number | null;
  to: number | null;
  blurb: string;
}[] = [
  { key: "terraced", label: "Terraced", from: 50, to: 65, blurb: "Standard two-storey terrace." },
  {
    key: "terraced-offshot",
    label: "Terraced with kitchen offshot",
    from: 60,
    to: 70,
    blurb: "Terrace with a rear kitchen extension.",
  },
  {
    key: "end-terrace",
    label: "End Terrace (3 sides)",
    from: 60,
    to: 70,
    blurb: "End of terrace, three accessible sides.",
  },
  { key: "semi-2", label: "Semi Detached (2 sides)", from: 60, to: 65, blurb: "Semi with two accessible sides." },
  { key: "semi-3", label: "Semi Detached (3 sides)", from: 70, to: 70, blurb: "Semi with three accessible sides." },
  {
    key: "detached",
    label: "Detached",
    from: 60,
    to: 250,
    blurb: "Priced on size and access - confirmed after a quick review.",
  },
  {
    key: "other",
    label: "Other / not sure",
    from: null,
    to: null,
    blurb: "Bungalow, three-storey, commercial or anything unusual.",
  },
];

export const pricingNote =
  "Prices include downpipe clearing. Additional costs may apply for three-storey homes, conservatories, porches or extensions.";

/** Booking-flow service options (a service can add to the base price). */
export type ServiceKey =
  | "gutter"
  | "gutter-fascia"
  | "gutter-soffit"
  | "inspection"
  | "annual";

export const services: { key: ServiceKey; label: string; addOn: number; note: string }[] = [
  { key: "gutter", label: "Gutter Cleaning", addOn: 0, note: "Full clear of gutters + downpipes." },
  { key: "gutter-fascia", label: "Gutter Cleaning + Fascias", addOn: 25, note: "Gutters plus fascia wipe-down." },
  { key: "gutter-soffit", label: "Gutter Cleaning + Soffits", addOn: 25, note: "Gutters plus soffit cleaning." },
  { key: "inspection", label: "Gutter Inspection", addOn: -10, note: "Camera inspection + written report." },
  { key: "annual", label: "Annual Maintenance", addOn: 0, note: "Recurring yearly clean with reminders." },
];

export function getPropertyType(key: string) {
  return propertyTypes.find((p) => p.key === key) ?? null;
}

export function getService(key: string) {
  return services.find((s) => s.key === key) ?? null;
}

/**
 * Produce an estimate for the booking flow.
 * Returns either a confirmed range or a "quote on review" flag for
 * detached / other property types.
 */
export function estimatePrice(
  propertyKey: string,
  serviceKey: string,
): { needsQuote: boolean; from: number | null; to: number | null; label: string } {
  const prop = getPropertyType(propertyKey);
  const service = getService(serviceKey);

  if (!prop || prop.from === null || prop.to === null || prop.key === "detached" || prop.key === "other") {
    return {
      needsQuote: true,
      from: null,
      to: null,
      label: "We'll confirm the exact quote after reviewing your property.",
    };
  }

  const addOn = service?.addOn ?? 0;
  const from = Math.max(prop.from + addOn, 30);
  const to = Math.max(prop.to + addOn, 35);
  return {
    needsQuote: false,
    from,
    to,
    label: from === to ? `£${from}` : `£${from}-£${to}`,
  };
}
