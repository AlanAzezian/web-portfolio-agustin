"use client";

import { useEffect } from "react";
import HomeSlider from "@/components/HomeSlider";

export default function Home() {
  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <main 
      className="w-full bg-background"
      style={{
        height: "100dvh",
        display: "grid",
        gridTemplateRows: "80px minmax(0, 1fr) 56px",
        overflow: "hidden"
      }}
    >
      <div /> {/* Row 1: Header space */}
      <HomeSlider />
    </main>
  );
}
