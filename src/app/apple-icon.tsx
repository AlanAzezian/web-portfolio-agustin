import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F8F7F4",
          color: "#1C1C1A",
          fontFamily: "Roboto, sans-serif",
          fontSize: 92,
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
