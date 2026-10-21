"use client";

import { useEffect, useRef } from "react";
import { IconlyArrowRight2 } from "./icons/IconlyArrowRight2";

export default function EditorialOverlay() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const arrowLeftRef = useRef<HTMLDivElement>(null);
  const arrowRightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;

    const cursorEl = cursorRef.current;
    const dotEl = dotRef.current;
    const leftEl = arrowLeftRef.current;
    const rightEl = arrowRightRef.current;
    if (!cursorEl || !dotEl || !leftEl || !rightEl) return;

    let mouseX = -100;
    let mouseY = -100;
    let rafId: number | null = null;
    let isVisible = false;
    let currentMode: "dot" | "interactive" | "arrow-left" | "arrow-right" = "dot";

    const applyMode = (mode: typeof currentMode) => {
      if (mode === currentMode) return;
      currentMode = mode;

      if (mode === "arrow-left") {
        dotEl.style.display = "none";
        rightEl.style.display = "none";
        leftEl.style.display = "flex";
      } else if (mode === "arrow-right") {
        dotEl.style.display = "none";
        leftEl.style.display = "none";
        rightEl.style.display = "flex";
      } else {
        leftEl.style.display = "none";
        rightEl.style.display = "none";
        dotEl.style.display = "block";
        dotEl.style.transform =
          mode === "interactive" ? "scale(1.3)" : "scale(1)";
      }
    };

    const updatePosition = () => {
      rafId = null;
      cursorEl.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    };

    const handlePointerMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        cursorEl.style.opacity = "1";
      }

      if (rafId === null) {
        rafId = requestAnimationFrame(updatePosition);
      }

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorAttrEl = target.closest("[data-cursor]");
      if (cursorAttrEl) {
        const attr = cursorAttrEl.getAttribute("data-cursor");
        if (attr === "arrow-left" || attr === "arrow-right") {
          applyMode(attr);
          return;
        }
      }

      const interactiveEl = target.closest(
        "a, button, [role='button'], input, textarea, select"
      );
      applyMode(interactiveEl ? "interactive" : "dot");
    };

    const handleMouseLeave = () => {
      isVisible = false;
      cursorEl.style.opacity = "0";
    };

    const handleMouseEnter = () => {
      isVisible = true;
      cursorEl.style.opacity = "1";
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[99999] pointer-events-none overflow-hidden hidden [@media(pointer:fine)]:block">
      <div
        ref={cursorRef}
        style={{
          transform: "translate3d(-100px, -100px, 0) translate(-50%, -50%)",
          opacity: 0,
        }}
        className="fixed top-0 left-0 z-[99999] flex items-center justify-center pointer-events-none will-change-transform transition-opacity duration-150"
      >
        <div
          ref={dotRef}
          className="w-3.5 h-3.5 rounded-full bg-[#1C1C1A] transition-transform duration-150 ease-out will-change-transform"
        />
        <div
          ref={arrowLeftRef}
          style={{ display: "none" }}
          className="rotate-180 items-center justify-center"
        >
          <IconlyArrowRight2 size={26} color="#1C1C1A" />
        </div>
        <div
          ref={arrowRightRef}
          style={{ display: "none" }}
          className="items-center justify-center"
        >
          <IconlyArrowRight2 size={26} color="#1C1C1A" />
        </div>
      </div>
    </div>
  );
}
