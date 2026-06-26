/**
 * Single source of truth for all business information.
 * Update these values to re-brand or correct details - they flow into the
 * marketing site, structured data (schema.org), booking system and emails.
 */

export const business = {
  name: "Matt's Gutter Cleaning",
  legalName: "Matt's Gutter Cleaning",
  tagline: "Sheffield's Highest Rated Gutter Cleaning Service",
  // E.164 for tel: links, pretty for display.
  phone: "07984 659607",
  phoneE164: "+447984659607",
  email: "hello@mattsguttercleaning.co.uk", // TODO: replace with Matt's real inbox
  // Where Matt receives booking notifications (defaults to email above).
  ownerEmail: "matt@mattsguttercleaning.co.uk", // TODO: replace with Matt's real inbox
  address: {
    street: "5 Juniper Close",
    locality: "Oughtibridge",
    region: "Sheffield",
    postcode: "S35 0ET",
    country: "GB",
  },
  geo: {
    // Approximate Oughtibridge coordinates - refine with the exact location if needed.
    lat: 53.4361,
    lng: -1.5419,
  },
  rating: {
    value: 5.0,
    count: 121,
    platform: "Google",
  },
  // Used by the LocalBusiness schema and the contact section.
  hours: [
    { day: "Monday", open: "09:00", close: "19:00" },
    { day: "Tuesday", open: "09:00", close: "19:00" },
    { day: "Wednesday", open: "09:00", close: "19:00" },
    { day: "Thursday", open: "09:00", close: "19:00" },
    { day: "Friday", open: "09:00", close: "19:00" },
    { day: "Saturday", open: "09:00", close: "19:00" },
    { day: "Sunday", open: "10:00", close: "17:00" },
  ],
  // Canonical production URL - update before deploying so OG tags + sitemap are correct.
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://www.mattsguttercleaning.co.uk",
  social: {
    facebook: "https://www.facebook.com/", // TODO: add real profile
    google: "https://www.google.com/maps", // TODO: link to Google Business listing
  },
} as const;

export const areasCovered = [
  "Sheffield",
  "Oughtibridge",
  "Hillsborough",
  "Chapeltown",
  "Ecclesfield",
  "Stocksbridge",
  "Wadsley",
  "Grenoside",
  "Stannington",
  "High Green",
] as const;

/** Pretty opening-hours rows grouped for display in the UI. */
export const openingHoursDisplay = [
  { label: "Monday - Saturday", value: "9:00am - 7:00pm" },
  { label: "Sunday", value: "10:00am - 5:00pm" },
];

export function telHref() {
  return `tel:${business.phoneE164}`;
}

export function fullAddress() {
  const a = business.address;
  return `${a.street}, ${a.locality}, ${a.region} ${a.postcode}`;
}

export function googleMapsEmbedSrc() {
  // Keyless embed using the address query - works without an API key.
  const q = encodeURIComponent(`${business.name}, ${fullAddress()}`);
  return `https://www.google.com/maps?q=${q}&output=embed`;
}

export function googleMapsDirectionsHref() {
  const q = encodeURIComponent(fullAddress());
  return `https://www.google.com/maps/dir/?api=1&destination=${q}`;
}
