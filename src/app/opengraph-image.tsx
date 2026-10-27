import { ImageResponse } from "next/og";

export const alt = "Agustín Fabrizio — Arquitectura & Visualización";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px 96px",
          backgroundColor: "#FFFFFF",
          color: "#1C1C1A",
          fontFamily: "Roboto, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: " baseline",
            fontSize: 36,
            fontWeight: 500,
            letterSpacing: "-0.03em",
          }}
        >
          <span>AF</span>
          <span
            style={{
              width: 14,
              height: 3,
              backgroundColor: "#099AD7",
              marginLeft: 4,
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div
            style={{
              fontSize: 84,
              fontWeight: 500,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              color: "#1C1C1A",
            }}
          >
            Agustín Fabrizio
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 400,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#099AD7",
            }}
          >
            Arquitectura & Visualización
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
