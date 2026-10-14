"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IconlyArrowRight2 } from "./icons/IconlyArrowRight2";

export default function EditorialOverlay() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [cursorType, setCursorType] = useState<string | null>(null);
  const [isInteractive, setIsInteractive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      const target = e.target as HTMLElement;
      const cursorElement = target.closest("[data-cursor]");

      if (cursorElement) {
        setCursorType(cursorElement.getAttribute("data-cursor"));
      } else {
        setCursorType(null);
      }

      const interactiveElement = target.closest("a, button, [role='button'], input, textarea");
      setIsInteractive(!!interactiveElement && !cursorElement);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", updateMousePosition);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      <motion.div
        className="fixed top-0 left-0 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
        }}
        transition={{
          type: "spring",
          stiffness: 700,
          damping: 35,
          mass: 0.25,
        }}
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
          <motion.div
            className="w-3.5 h-3.5 rounded-full bg-[#1C1C1A]"
            animate={{
              scale: isInteractive ? 1.8 : 1,
            }}
            transition={{ duration: 0.15 }}
          />
        )}
      </motion.div>
    </div>
  );
}
