"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface ProjectViewerProps {
  title: string;
  images: string[];
}

export default function ProjectViewer({ title, images }: ProjectViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const total = images.length;

  const nextSlide = useCallback(() => {
    if (total === 0) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total === 0) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Navegación por teclado (← / → y Barra Espaciadora)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Precarga de diapositiva contigua (siguiente y anterior) para transición instantánea
  useEffect(() => {
    if (total > 1) {
      const nextIdx = (currentIndex + 1) % total;
      const prevIdx = (currentIndex - 1 + total) % total;
      const imgNext = new Image();
      imgNext.src = images[nextIdx];
      const imgPrev = new Image();
      imgPrev.src = images[prevIdx];
    }
  }, [currentIndex, images, total]);

  // Soporte táctil / swipe móvil
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 45) {
      nextSlide();
    } else if (diff < -45) {
      prevSlide();
    }
    setTouchStartX(null);
  };

  const formattedCurrent = String(currentIndex + 1).padStart(2, "0");
  const formattedTotal = String(total).padStart(2, "0");

  return (
    <main
      className="fixed inset-0 z-20 bg-white text-[#1C1C1A] select-none overflow-hidden flex items-center justify-center"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Visor central de imagen/plano perfectamente centrado sin Navbar */}
      <div className="relative w-full h-full flex items-center justify-center px-4 md:px-16 py-10 md:py-14">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`${title} - Imagen ${currentIndex + 1}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="h-[80vh] md:h-[82vh] w-auto max-w-full max-h-[82vh] object-contain block pointer-events-none shadow-none"
          />
        </AnimatePresence>

        {/* Áreas interactivas transparentes de clic (izquierda / derecha estilo Adamo-Faiden) */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Imagen anterior"
          data-cursor="PREV"
          className="absolute inset-y-0 left-0 w-1/2 h-full z-10 cursor-w-resize md:cursor-pointer bg-transparent border-0 outline-none focus:outline-none"
        />
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Siguiente imagen"
          data-cursor="NEXT"
          className="absolute inset-y-0 right-0 w-1/2 h-full z-10 cursor-e-resize md:cursor-pointer bg-transparent border-0 outline-none focus:outline-none"
        />
      </div>

      {/* Metadatos fijos inferiores */}
      {/* Esquina inferior izquierda: Título del proyecto */}
      <div className="fixed bottom-6 left-8 md:bottom-8 md:left-16 z-30 pointer-events-auto">
        <Link
          href="/proyectos"
          className="font-sans text-xs md:text-sm font-normal text-[#1C1C1A] hover:text-[#099AD7] transition-colors tracking-tight"
          title="Volver a Proyectos"
        >
          {title}
        </Link>
      </div>

      {/* Esquina inferior derecha: Contador numérico editorial estilo plano */}
      <div className="fixed bottom-6 right-8 md:bottom-8 md:right-16 z-30 pointer-events-auto">
        <span className="font-unica text-xs md:text-sm text-[#1C1C1A] tracking-wider tabular-nums">
          {formattedCurrent} / {formattedTotal}
        </span>
      </div>
    </main>
  );
}
