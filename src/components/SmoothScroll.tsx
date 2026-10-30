"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

declare global {
  interface Window {
    __lenis?: Lenis | null;
  }
}

export default function SmoothScroll() {
  const pathname = usePathname();
  const isProjectDetail =
    pathname.startsWith("/proyectos/") && pathname !== "/proyectos";

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (isProjectDetail || prefersReducedMotion) {
      window.__lenis = null;
      return;
    }

    const lenis = new Lenis({
      autoRaf: false,
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.1,
      syncTouch: false,
    });

    window.__lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
      if (window.__lenis === lenis) {
        window.__lenis = null;
      }
    };
  }, [isProjectDetail]);

  return null;
}
