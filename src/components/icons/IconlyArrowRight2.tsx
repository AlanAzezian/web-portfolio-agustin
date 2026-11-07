import React from "react";

export const IconlyArrowRight2 = ({
  size = 24,
  color = "#FFFFFF",
  className = "",
}: {
  size?: number;
  color?: string;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    xmlns="http://www.w3.org/2000/svg"
    style={{ mixBlendMode: "difference" }}
    className={`fill-white fill-[#FFFFFF] mix-blend-difference ${className}`.trim()}
  >
    <polygon points="6,4.5 19.5,12 6,19.5" fill={color} className="fill-white fill-[#FFFFFF]" />
  </svg>
);

export default IconlyArrowRight2;
