"use client";

import { useEffect, useRef, useState } from "react";
import { IconlyArrowRight2 } from "./icons/IconlyArrowRight2";

export default function EditorialOverlay() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [cursorType, setCursorType] = useState<string | null>(null);
  const [useNativeCursor, setUseNativeCursor] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updatePointer = (e: PointerEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
      setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorElement = target.closest("[data-cursor]");
      if (cursorElement) {
        setCursorType(cursorElement.getAttribute("data-cursor"));
        setUseNativeCursor(false);
        return;
      }

      setCursorType(null);
      const nativeRegion = target.closest(
        "nav, a, button:not([data-cursor]), [role='button']:not([data-cursor]), input, textarea, select"
      );
      setUseNativeCursor(!!nativeRegion);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("pointermove", updatePointer, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("pointermove", updatePointer);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
      <div
        ref={cursorRef}
        style={{ transform: "translate3d(-100px, -100px, 0) translate(-50%, -50%)" }}
        className={`fixed top-0 left-0 flex items-center justify-center pointer-events-none will-change-transform ${
          !isVisible || useNativeCursor ? "opacity-0" : "opacity-100"
        }`}
      >
        {cursorType === "arrow-left" ? (
          <div className="rotate-180 flex items-center justify-center">
            <IconlyArrowRight2 size={26} color="#1C1C1A" />
          </div>
        ) : cursorType === "arrow-right" ? (
          <div className="flex items-center justify-center">
            <IconlyArrowRight2 size={26} color="#1C1C1A" />
          </div>
        ) : (
          <div className="w-3.5 h-3.5 rounded-full bg-[#1C1C1A]" />
        )}
      </div>
    </div>
  );
}
