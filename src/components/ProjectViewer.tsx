"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface ProjectViewerProps {
  title: string;
  images: string[];
}

export default function ProjectViewer({ title, images }: ProjectViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const router = useRouter();

  const total = images.length;

  const nextSlide = useCallback(() => {
    if (total === 0) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total === 0) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Navegación por teclado (← / →, Barra Espaciadora y Escape para volver a /proyectos)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        router.push("/proyectos");
      } else if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide, router]);

  // Precarga de todas las imágenes de la galería para corte seco instantáneo y nítido
  useEffect(() => {
    images.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, [images]);

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
  const currentSrc = images[currentIndex];

  return (
    <main
      className="fixed inset-0 z-20 bg-white text-[#1C1C1A] select-none overflow-hidden flex items-center justify-center"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Botón superior derecho: Proyectos */}
      <Link
        href="/proyectos"
        className="fixed top-6 md:top-8 right-6 md:right-12 z-50 font-roboto font-medium font-[500] text-xs md:text-sm tracking-tight text-[#1C1C1A] hover:text-acento transition-colors duration-200 flex items-center gap-1.5 pointer-events-auto focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-acento"
      >
        <ArrowLeft size={14} strokeWidth={1.5} /> Proyectos
      </Link>

      {/* Visor central de imagen/plano con corte seco directo, sin blur ni fade */}
      <div className="relative w-full h-full flex items-center justify-center px-4 md:px-16 py-10 md:py-14">
        <div className="relative w-full h-[80vh] md:h-[82vh] max-h-[82vh] pointer-events-none">
          <Image
            key={currentSrc}
            src={currentSrc}
            alt={`${title} - Imagen ${currentIndex + 1}`}
            fill
            sizes="100vw"
            priority
            unoptimized={false}
            className="object-contain pointer-events-none select-none shadow-none"
          />
        </div>

        {/* Áreas interactivas con flechas Iconly (izquierda / derecha) */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Imagen anterior"
          data-cursor="arrow-left"
          className="absolute inset-y-0 left-0 w-1/2 h-full z-10 bg-transparent border-0 outline-none focus:outline-none focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-acento"
        />
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Imagen siguiente"
          data-cursor="arrow-right"
          className="absolute inset-y-0 right-0 w-1/2 h-full z-10 bg-transparent border-0 outline-none focus:outline-none focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-acento"
        />
      </div>

      {/* Metadatos fijos inferiores */}
      <div className="fixed bottom-6 left-8 md:bottom-8 md:left-16 z-30 pointer-events-auto">
        <span className="font-roboto font-medium font-[500] text-xs md:text-sm text-[#1C1C1A] tracking-normal select-none">
          {title}
        </span>
      </div>

      <div className="fixed bottom-6 right-8 md:bottom-8 md:right-16 z-30 pointer-events-auto">
        <span className="font-roboto tabular-nums tracking-wider text-[13px] text-[#1C1C1A] select-none font-normal">
          {formattedCurrent} / {formattedTotal}
        </span>
      </div>
    </main>
  );
}
