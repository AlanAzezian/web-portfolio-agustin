import React from "react";

export const IconlyArrowRight2 = ({
  size = 24,
  color = "#000000",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.75 5L15.75 12L8.75 19"
      stroke={color}
      strokeWidth="1.2"
      strokeLinecap="square"
    />
  </svg>
);
