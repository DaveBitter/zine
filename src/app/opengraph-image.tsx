import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "Zine — design a printable, fold-and-cut photo booklet in your browser";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(160deg, #1c1c20, #121215)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Dashed "fold line" motif, echoing the app's own guide sheets */}
        <div
          style={{
            display: "flex",
            width: "100%",
            borderTop: "3px dashed #4b6bd6",
            opacity: 0.55,
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              fontSize: 108,
              fontWeight: 700,
              color: "#f2f2f2",
              letterSpacing: -2,
            }}
          >
            Zine
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 34,
              lineHeight: 1.35,
              color: "#b7b7bc",
              maxWidth: 880,
            }}
          >
            Design a printable, fold-and-cut photo booklet — entirely in your browser.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", height: 0, width: 260, borderTop: "3px solid #ff7a3d" }} />
          <div style={{ display: "flex", fontSize: 26, color: "#8b8b90" }}>zine.davebitter.com</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
