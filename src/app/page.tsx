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
    <main className="h-[100dvh] w-full overflow-hidden bg-background relative">
      <HomeSlider />
    </main>
  );
}
