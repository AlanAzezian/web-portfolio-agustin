"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { IconlyArrowRight2 } from "./icons/IconlyArrowRight2";

export default function EditorialOverlay() {
  const dotCursorRef = useRef<HTMLDivElement>(null);
  const dotInnerRef = useRef<HTMLDivElement>(null);
  const arrowCursorRef = useRef<HTMLDivElement>(null);
  const arrowLeftRef = useRef<HTMLDivElement>(null);
  const arrowRightRef = useRef<HTMLDivElement>(null);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: -100, y: -100 });
  const syncModeRef = useRef<(() => void) | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;

    const dotCursorEl = dotCursorRef.current;
    const dotInnerEl = dotInnerRef.current;
    const arrowCursorEl = arrowCursorRef.current;
    const leftEl = arrowLeftRef.current;
    const rightEl = arrowRightRef.current;
    if (!dotCursorEl || !dotInnerEl || !arrowCursorEl || !leftEl || !rightEl)
      return;

    let rafId: number | null = null;
    let currentMode: "dot" | "interactive" | "arrow-left" | "arrow-right" =
      "dot";

    const applyMode = (mode: typeof currentMode) => {
      if (mode === currentMode) return;
      currentMode = mode;

      if (mode === "arrow-left") {
        dotCursorEl.style.opacity = "0";
        arrowCursorEl.style.opacity = "1";
        rightEl.style.display = "none";
        leftEl.style.display = "flex";
      } else if (mode === "arrow-right") {
        dotCursorEl.style.opacity = "0";
        arrowCursorEl.style.opacity = "1";
        leftEl.style.display = "none";
        rightEl.style.display = "flex";
      } else {
        arrowCursorEl.style.opacity = "0";
        leftEl.style.display = "none";
        rightEl.style.display = "none";
        dotCursorEl.style.opacity = "1";
        dotInnerEl.style.transform =
          mode === "interactive" ? "scale(1.3)" : "scale(1)";
      }
    };

    const resolveTargetMode = (target: Element | null) => {
      if (!target) {
        applyMode("dot");
        return;
      }

      const cursorAttrEl = target.closest("[data-cursor]");
      if (cursorAttrEl) {
        const attr = cursorAttrEl.getAttribute("data-cursor");
        if (attr === "arrow-left" || attr === "prev") {
          applyMode("arrow-left");
          return;
        }
        if (attr === "arrow-right" || attr === "next") {
          applyMode("arrow-right");
          return;
        }
      }

      const interactiveEl = target.closest(
        "a, button, [role='button'], input, textarea, select"
      );
      applyMode(interactiveEl ? "interactive" : "dot");
    };

    const updatePosition = () => {
      rafId = null;
      const { x, y } = mousePosRef.current;
      const transformValue = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      dotCursorEl.style.transform = transformValue;
      arrowCursorEl.style.transform = transformValue;
    };

    const handlePointerMove = (e: PointerEvent | MouseEvent) => {
      mousePosRef.current.x = e.clientX;
      mousePosRef.current.y = e.clientY;

      if (rafId === null) {
        rafId = requestAnimationFrame(updatePosition);
      }

      resolveTargetMode(e.target as Element | null);
    };

    const handlePointerOver = (e: PointerEvent | MouseEvent) => {
      mousePosRef.current.x = e.clientX;
      mousePosRef.current.y = e.clientY;
      if (rafId === null) {
        rafId = requestAnimationFrame(updatePosition);
      }
      resolveTargetMode(e.target as Element | null);
    };

    const syncFromPoint = () => {
      const { x, y } = mousePosRef.current;
      if (x < 0 || y < 0) return;
      const el = document.elementFromPoint(x, y);
      if (el) {
        resolveTargetMode(el);
      }
    };

    syncModeRef.current = syncFromPoint;

    const handleMouseLeave = () => {
      dotCursorEl.style.opacity = "0";
      arrowCursorEl.style.opacity = "0";
    };

    const handleMouseEnter = () => {
      if (currentMode === "arrow-left" || currentMode === "arrow-right") {
        arrowCursorEl.style.opacity = "1";
      } else {
        dotCursorEl.style.opacity = "1";
      }
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    window.addEventListener("mousemove", handlePointerMove, {
      passive: true,
    });
    window.addEventListener("pointerover", handlePointerOver, {
      passive: true,
    });
    window.addEventListener("pointerdown", handlePointerOver, {
      passive: true,
    });
    window.addEventListener("scroll", syncFromPoint, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      syncModeRef.current = null;
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("pointerover", handlePointerOver);
      window.removeEventListener("pointerdown", handlePointerOver);
      window.removeEventListener("scroll", syncFromPoint);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  // Re-evaluar inmediatamente el elemento bajo el cursor al cambiar de ruta o montar vistas
  useEffect(() => {
    if (typeof window === "undefined") return;
    const t1 = window.setTimeout(() => syncModeRef.current?.(), 0);
    const t2 = window.setTimeout(() => syncModeRef.current?.(), 80);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [pathname]);

  return (
    <>
      {/* Cursor Circular Global en Negro Estático (#1C1C1A), sin mix-blend-mode y montado con opacity: 1 inmediato */}
      <div
        ref={dotCursorRef}
        style={{
          transform: "translate3d(-100px, -100px, 0) translate(-50%, -50%)",
          opacity: 1,
        }}
        className="fixed top-0 left-0 z-[99999] hidden [@media(pointer:fine)]:flex items-center justify-center pointer-events-none will-change-transform"
      >
        <div
          ref={dotInnerRef}
          className="w-3.5 h-3.5 rounded-full bg-[#1C1C1A] transition-transform duration-150 ease-out will-change-transform"
        />
      </div>

      {/* Cursor de Flecha Triangular con mix-blend-mode: difference EXCLUSIVO para zonas [data-cursor="arrow-*"] del visor */}
      <div
        ref={arrowCursorRef}
        style={{
          transform: "translate3d(-100px, -100px, 0) translate(-50%, -50%)",
          opacity: 0,
          mixBlendMode: "difference",
        }}
        className="fixed top-0 left-0 z-[99999] hidden [@media(pointer:fine)]:flex items-center justify-center pointer-events-none mix-blend-difference"
      >
        <div
          ref={arrowLeftRef}
          style={{ display: "none" }}
          className="rotate-180 items-center justify-center"
        >
          <IconlyArrowRight2
            size={24}
            color="#FFFFFF"
            className="fill-white fill-[#FFFFFF]"
          />
        </div>
        <div
          ref={arrowRightRef}
          style={{ display: "none" }}
          className="items-center justify-center"
        >
          <IconlyArrowRight2
            size={24}
            color="#FFFFFF"
            className="fill-white fill-[#FFFFFF]"
          />
        </div>
      </div>
    </>
  );
}
