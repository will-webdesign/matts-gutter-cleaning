import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { business } from "@/lib/business";
import { localBusinessSchema } from "@/lib/schema";
import { ThemeScript } from "@/components/theme/ThemeScript";

// Plus Jakarta Sans: a friendly, trustworthy modern grotesk - deliberately not Inter.
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(business.url),
  title: {
    default: `${business.name} | ${business.tagline}`,
    template: `%s | ${business.name}`,
  },
  description:
    "Professional gutter cleaning, downpipe clearing, fascia and soffit cleaning across Sheffield. 5.0 stars from 121 Google reviews. Fully insured, before & after photos, free quotes.",
  keywords: [
    "gutter cleaning Sheffield",
    "gutter cleaning Oughtibridge",
    "gutter cleaning near me",
    "downpipe cleaning Sheffield",
    "fascia cleaning Sheffield",
    "gutter maintenance Sheffield",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: business.url,
    siteName: business.name,
    title: `${business.name} | ${business.tagline}`,
    description:
      "Sheffield's highest rated gutter cleaning service. 5.0 stars from 121 Google reviews. Fully insured with before & after photos.",
    // og:image is auto-injected from app/opengraph-image.tsx
  },
  twitter: {
    card: "summary_large_image",
    title: `${business.name} | ${business.tagline}`,
    description: "Sheffield's highest rated gutter cleaning. 5.0 stars from 121 Google reviews.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#051a2c" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className={`${jakarta.variable} h-full`} suppressHydrationWarning>
      <head>
        {/* Set theme before paint to avoid a flash of the wrong mode. */}
        <ThemeScript />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema()) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-surface text-ink font-sans">{children}</body>
    </html>
  );
}
