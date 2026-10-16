"use client";

import { useEffect, useRef, useState } from "react";
import { IconlyArrowRight2 } from "./icons/IconlyArrowRight2";

export default function EditorialOverlay() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [cursorType, setCursorType] = useState<string | null>(null);
  const [isInteractive, setIsInteractive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const targetPos = { x: -100, y: -100 };
    const currentPos = { x: -100, y: -100 };
    let initialized = false;
    let rafId: number;

    const renderLoop = () => {
      if (initialized && cursorRef.current) {
        currentPos.x += (targetPos.x - currentPos.x) * 0.22;
        currentPos.y += (targetPos.y - currentPos.y) * 0.22;
        cursorRef.current.style.transform = `translate3d(${currentPos.x}px, ${currentPos.y}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(renderLoop);
    };

    rafId = requestAnimationFrame(renderLoop);

    const updatePointer = (e: PointerEvent) => {
      targetPos.x = e.clientX;
      targetPos.y = e.clientY;

      if (!initialized) {
        currentPos.x = e.clientX;
        currentPos.y = e.clientY;
        initialized = true;
        if (cursorRef.current) {
          cursorRef.current.style.transform = `translate3d(${currentPos.x}px, ${currentPos.y}px, 0) translate(-50%, -50%)`;
        }
      }

      setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorElement = target.closest("[data-cursor]");
      if (cursorElement) {
        setCursorType(cursorElement.getAttribute("data-cursor"));
        setIsInteractive(false);
        return;
      }

      setCursorType(null);
      const interactiveElement = target.closest(
        "a, button, [role='button'], input, textarea, select"
      );
      setIsInteractive(!!interactiveElement);
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
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", updatePointer);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[99999] pointer-events-none overflow-hidden">
      <div
        ref={cursorRef}
        style={{ transform: "translate3d(-100px, -100px, 0) translate(-50%, -50%)" }}
        className={`fixed top-0 left-0 z-[99999] flex items-center justify-center pointer-events-none will-change-transform ${
          isVisible ? "opacity-100" : "opacity-0"
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
          <div
            className={`w-3.5 h-3.5 rounded-full bg-[#1C1C1A] transition-transform duration-150 ease-out ${
              isInteractive ? "scale-[1.3]" : "scale-100"
            }`}
          />
        )}
      </div>
    </div>
  );
}
