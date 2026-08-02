import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Social card. Satori has no SVG filters or CSS gradients on text, so this is
 * deliberately built from flat fills and rules — which suits the brand anyway.
 */
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#111111",
          padding: "68px 76px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Louvre motif down the right-hand side */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 420,
            height: 630,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 14,
            paddingLeft: 60,
            paddingRight: 60,
            background: "#161616",
          }}
        >
          {Array.from({ length: 13 }).map((_, i) => (
            <div
              key={i}
              style={{
                height: 16,
                borderRadius: 2,
                background: i % 6 === 3 ? "#E1C97A" : "#C9A646",
                opacity: i % 6 === 3 ? 0.95 : 0.32 + (i % 4) * 0.06,
              }}
            />
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 40,
              height: 1,
              background: "#C9A646",
            }}
          />
          <div
            style={{
              color: "#C9A646",
              fontSize: 19,
              letterSpacing: 6,
              textTransform: "uppercase",
            }}
          >
            {"Plantation Shutters & Fine Blinds"}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 720 }}>
          <div
            style={{
              color: "#FFFFFF",
              fontSize: 82,
              lineHeight: 1.02,
              letterSpacing: -2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Beautiful Windows.</span>
            <span style={{ color: "#E1C97A" }}>Beautiful Homes.</span>
          </div>
          <div
            style={{
              marginTop: 30,
              color: "rgba(255,255,255,0.62)",
              fontSize: 25,
              lineHeight: 1.5,
              maxWidth: 640,
            }}
          >
            Handcrafted shutters and premium blinds, measured and fitted across Essex.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.14)",
            paddingTop: 26,
            maxWidth: 720,
          }}
        >
          <div style={{ color: "#FFFFFF", fontSize: 26, letterSpacing: 1 }}>{site.name}</div>
          <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 21 }}>
            {`Rated ${site.rating.value} out of 5  ·  ${site.yearsTrading}+ years  ·  Essex`}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
