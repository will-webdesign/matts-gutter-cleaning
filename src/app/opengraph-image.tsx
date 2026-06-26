import { ImageResponse } from "next/og";
import { business } from "@/lib/business";

// Dynamically generated social share card (used for Open Graph + Twitter).
export const alt = `${business.name} - ${business.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0f4c81 0%, #0b3357 100%)",
          padding: 72,
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "#f4b400",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              color: "#051a2c",
              fontWeight: 800,
            }}
          >
            M
          </div>
          <div style={{ fontSize: 30, fontWeight: 700 }}>{business.name}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.05, maxWidth: 900 }}>
            Sheffield&apos;s highest-rated gutter cleaning service
          </div>
          <div style={{ fontSize: 30, color: "#aac7e6" }}>
            5.0 stars from 121 Google reviews · Fully insured · Free quotes
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 28 }}>
          <div style={{ color: "#f4b400", fontWeight: 700 }}>{"★★★★★"}</div>
          <div style={{ fontWeight: 700 }}>{business.phone}</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
