"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Minus, ArrowUpRight } from "lucide-react";
import { ScrollTrigger } from "@/lib/gsap";
import { servicesData } from "@/data/services";
import { getWhatsAppLink } from "@/lib/whatsapp";

export default function ServicesView() {
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setActiveServiceId((prev) => (prev === id ? null : id));
  };

  const handleAnimationComplete = () => {
    if (typeof window === "undefined") return;
    window.__lenis?.resize();
    ScrollTrigger.refresh();
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-5rem)] bg-[#FFFFFF] text-[#1C1C1A] font-roboto px-6 md:px-8 pt-1 pb-32 md:pt-2">
      {/* Contenedor Centrado del Acordeón */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-4xl mx-auto"
      >
        <div className="flex flex-col border-t border-[#1C1C1A]/15">
          {servicesData.map((service) => {
            const isOpen = activeServiceId === service.id;
            return (
              <div
                key={service.id}
                className="border-b border-[#1C1C1A]/15 bg-[#FFFFFF]"
              >
                <button
                  type="button"
                  onClick={() => handleToggle(service.id)}
                  aria-expanded={isOpen}
                  className="w-full py-4 md:py-5 flex items-center justify-between gap-4 focus:outline-none group text-left cursor-pointer shrink-0"
                >
                  <div className="flex items-baseline gap-4 md:gap-8">
                    <span className="font-roboto font-medium text-xs md:text-sm text-[#1C1C1A]/50 w-6 md:w-7 shrink-0 tabular-nums tracking-wider">
                      {service.orderNumber}
                    </span>
                    <h2 className="font-roboto font-medium text-lg md:text-xl text-[#1C1C1A] group-hover:text-[#099AD7] transition-colors">
                      {service.title}
                    </h2>
                  </div>
                  <div className="text-[#099AD7] transition-transform duration-300 flex items-center justify-center shrink-0">
                    {isOpen ? (
                      <Minus size={18} strokeWidth={1.5} />
                    ) : (
                      <Plus size={18} strokeWidth={1.5} />
                    )}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      onAnimationComplete={handleAnimationComplete}
                      className="overflow-hidden will-change-[height,opacity]"
                    >
                      {/* Panel Desplegado del Servicio */}
                      <div className="pt-2 pb-6 md:pb-8">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-center">
                          {/* Columna Izquierda: Centrada verticalmente con la imagen */}
                          <div className="md:col-span-7 flex flex-col justify-center gap-5">
                            <p className="font-roboto font-normal text-sm md:text-base text-[#1C1C1A]/80 leading-relaxed max-w-lg">
                              {service.description}
                            </p>

                            <div>
                              <Link
                                href={`/servicios/${service.id}`}
                                className="inline-flex items-center gap-2 font-roboto font-medium text-xs uppercase tracking-widest text-[#099AD7] hover:text-[#1C1C1A] transition-colors"
                              >
                                <span>MÁS INFORMACIÓN</span>
                                <ArrowUpRight size={14} />
                              </Link>
                            </div>
                          </div>

                          {/* Columna Derecha: Imagen con marco editorial técnico */}
                          <div className="md:col-span-5 flex justify-end">
                            <div className="w-full max-w-[420px] aspect-[3/2] border border-[#1C1C1A]/15 bg-white p-1.5 shadow-xs relative overflow-hidden select-none pointer-events-none">
                              <div className="relative w-full h-full overflow-hidden">
                                <Image
                                  src={
                                    service.coverImage ||
                                    "/projects/centro-de-trasbordo/01-render-exterior.webp"
                                  }
                                  alt={service.title}
                                  fill
                                  sizes="(max-width: 768px) 100vw, 420px"
                                  className="object-cover"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Bloque de Contacto Independiente y Estático abajo a la izquierda */}
      <div className="mt-12 pt-8 border-t border-[#1C1C1A]/15 md:mt-0 md:pt-0 md:border-t-0 md:fixed md:bottom-12 md:left-8 lg:left-16 z-30 flex flex-col items-start text-left pointer-events-auto">
        <h3 className="font-roboto font-medium text-[#1C1C1A] text-lg md:text-xl tracking-tight mb-3">
          Trabajemos juntos
        </h3>
        <a
          href={getWhatsAppLink(
            "Hola Agustín, me gustaría iniciar un proyecto contigo. ¿Podemos coordinar?"
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#099AD7] hover:bg-[#0887bd] text-white px-5 py-2.5 text-xs font-roboto uppercase tracking-widest transition-colors duration-200"
        >
          <span>CONTACTAR POR WHATSAPP</span>
          <ArrowUpRight size={14} strokeWidth={1.5} />
        </a>
      </div>
    </div>
  );
}
