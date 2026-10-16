"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { projects } from "@/data/projects";

export default function HomeSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % projects.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div className="w-full flex flex-col bg-[#F8F7F4]">
      {/* 1. PRIMER PLIEGUE (Centrado armónico en el 100vh con proximidad al encabezado) */}
      <section className="w-full h-[calc(100vh-5rem)] flex flex-col items-center justify-center -mt-4 md:-mt-8 px-4 md:px-12 select-none relative">
        {/* Cuadro de la imagen: ancho máximo 1120px, relación 3:2, centrado armónico y elevado */}
        <div
          role="button"
          className="relative w-[90vw] max-w-[1120px] max-h-[calc(100vh-12rem)] aspect-[3/2] overflow-hidden cursor-pointer group flex-none shadow-none"
          onClick={() => router.push(`/proyectos/${projects[activeIndex].id}`)}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={projects[activeIndex].coverImage}
                alt={projects[activeIndex].title}
                fill
                sizes="(max-width: 768px) 90vw, 1120px"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                style={{ objectPosition: "50% 50%" }}
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* 2. SEGUNDO BLOQUE: Redes sociales y créditos descubierto al scrollear */}
      <footer className="w-full py-16 md:py-20 flex flex-col items-center justify-center gap-8 border-t border-[#1C1C1A]/10 bg-[#F8F7F4]">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 text-[#1C1C1A]">
          <a
            href="https://instagram.com/agustinfabrizio"
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-2 font-unica text-xs uppercase tracking-wider text-[#686661] hover:text-[#099AD7] transition-colors"
            aria-label="Instagram"
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            <span>Instagram</span>
          </a>

          <a
            href="https://www.behance.net/agustinfabrizio"
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-2 font-unica text-xs uppercase tracking-wider text-[#686661] hover:text-[#099AD7] transition-colors"
            aria-label="Behance"
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 8h5a2.5 2.5 0 0 1 0 5H3V8z" />
              <path d="M3 13h5.5a2.5 2.5 0 0 1 0 5H3v-5z" />
              <path d="M14 13h7a3.5 3.5 0 0 0-7 0v1a3.5 3.5 0 0 0 7 0" />
              <line x1="15" y1="8" x2="20" y2="8" />
            </svg>
            <span>Behance</span>
          </a>

          <a
            href="https://wa.me/"
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-2 font-unica text-xs uppercase tracking-wider text-[#686661] hover:text-[#099AD7] transition-colors"
            aria-label="WhatsApp"
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            <span>WhatsApp</span>
          </a>

          <a
            href="mailto:hola@agustinfabrizio.com"
            className="group flex items-center gap-2 font-unica text-xs uppercase tracking-wider text-[#686661] hover:text-[#099AD7] transition-colors"
            aria-label="Email"
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <span>Email</span>
          </a>
        </div>

        <p className="font-unica text-[11px] uppercase tracking-widest text-[#686661]/70">
          Agustín Fabrizio © {new Date().getFullYear()} — Arquitectura & Visualización
        </p>
      </footer>
    </div>
  );
}
