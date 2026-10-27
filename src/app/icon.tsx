import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FFFFFF",
          color: "#1C1C1A",
          fontFamily: "Roboto, sans-serif",
          fontSize: 18,
          fontWeight: 500,
          letterSpacing: "-0.04em",
        }}
      >
        AF
      </div>
    ),
    {
      ...size,
    }
  );
}
