"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function EditorialOverlay() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorLabel, setCursorLabel] = useState("");
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      const cursorElement = target.closest('[data-cursor]');
      
      if (cursorElement) {
        setIsHovering(true);
        setCursorLabel(cursorElement.getAttribute('data-cursor') || "");
      } else {
        setIsHovering(false);
        setCursorLabel("");
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Líneas de regla verticales (Márgenes laterales) */}
      
      

      {/* Cursor Custom */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 rounded-full bg-white mix-blend-difference flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2"
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
          scale: isHovering ? (cursorLabel ? 3 : 1.5) : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
          mass: 0.5
        }}
      >
        {isHovering && cursorLabel && (
          <span className="text-[4px] font-mono text-black tracking-widest uppercase">
            {cursorLabel}
          </span>
        )}
      </motion.div>
    </div>
  );
}



