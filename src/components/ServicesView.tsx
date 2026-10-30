"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Minus, ArrowUpRight, X } from "lucide-react";
import { ScrollTrigger } from "@/lib/gsap";
import { servicesData } from "@/data/services";
import { getWhatsAppLink } from "@/lib/whatsapp";

export default function ServicesView() {
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);
  const [expandedImage, setExpandedImage] = useState<{
    src: string;
    title: string;
  } | null>(null);
  const [scale, setScale] = useState(1);

  const openModal = (src: string, title: string) => {
    setScale(1);
    setExpandedImage({ src, title });
  };

  const closeModal = () => {
    setExpandedImage(null);
    setScale(1);
  };

  const handleWheel = (e: React.WheelEvent) => {
    setScale((prev) => {
      const delta = e.deltaY * -0.0015;
      return Math.min(Math.max(1, prev + delta), 2.5);
    });
  };

  const handleToggle = (id: string) => {
    setActiveServiceId((prev) => (prev === id ? null : id));
  };

  const handleAnimationComplete = () => {
    if (typeof window === "undefined") return;
    window.__lenis?.resize();
    ScrollTrigger.refresh();
  };

  // Bloqueo de scroll con Lenis (stop/start) y cierre con tecla Escape
  useEffect(() => {
    if (!expandedImage) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (typeof window !== "undefined" && window.__lenis) {
      window.__lenis.stop();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setExpandedImage(null);
        setScale(1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
      if (typeof window !== "undefined" && window.__lenis) {
        window.__lenis.start();
      }
    };
  }, [expandedImage]);

  return (
    <div className="relative w-full min-h-[calc(100vh-5rem)] bg-[#FFFFFF] text-[#1C1C1A] font-roboto px-6 md:px-8 pt-1 pb-32 md:pt-2">
      {/* Contenedor Centrado del Acordeón */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-4xl mx-auto"
      >
        <div
          onMouseLeave={() => {
            if (!expandedImage) {
              setActiveServiceId(null);
            }
          }}
          className="flex flex-col border-t border-[#1C1C1A]/15"
        >
          {servicesData.map((service) => {
            const isOpen = activeServiceId === service.id;
            const imageSrc =
              service.coverImage ||
              "/projects/centro-de-trasbordo/01-render-exterior.webp";

            return (
              <div
                key={service.id}
                onMouseEnter={() => setActiveServiceId(service.id)}
                className="border-b border-[#1C1C1A]/15 bg-[#FFFFFF]"
              >
                <button
                  type="button"
                  onClick={() => handleToggle(service.id)}
                  onMouseEnter={() => setActiveServiceId(service.id)}
                  aria-expanded={isOpen}
                  className="w-full py-4 md:py-5 px-2 -mx-2 flex items-center justify-between gap-4 focus:outline-none group text-left cursor-pointer shrink-0 hover:bg-[#1C1C1A]/[0.02] transition-colors duration-300"
                >
                  <div className="flex items-baseline gap-4 md:gap-8">
                    <span className="font-roboto font-medium text-xs md:text-sm text-[#1C1C1A]/50 w-6 md:w-7 shrink-0 tabular-nums tracking-wider">
                      {service.orderNumber}
                    </span>
                    <h2 className="font-roboto font-medium text-lg md:text-xl text-[#1C1C1A] group-hover:text-[#099AD7] group-hover:translate-x-1.5 transition-all duration-300">
                      {service.title}
                    </h2>
                  </div>
                  <div className="text-[#099AD7] flex items-center justify-center shrink-0">
                    {isOpen ? (
                      <Minus size={18} strokeWidth={1.5} className="transition-transform duration-300" />
                    ) : (
                      <Plus
                        size={18}
                        strokeWidth={1.5}
                        className="group-hover:rotate-90 transition-transform duration-300"
                      />
                    )}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                        transition: {
                          height: { duration: 0.48, ease: [0.16, 1, 0.3, 1] },
                          opacity: {
                            duration: 0.38,
                            ease: [0.25, 1, 0.5, 1],
                            delay: 0.05,
                          },
                        },
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                        transition: {
                          height: { duration: 0.35, ease: [0.25, 1, 0.5, 1] },
                          opacity: { duration: 0.25, ease: [0.25, 1, 0.5, 1] },
                        },
                      }}
                      onAnimationComplete={handleAnimationComplete}
                      className="overflow-hidden will-change-[height,opacity]"
                    >
                      {/* Panel Desplegado del Servicio */}
                      <div className="pt-2 pb-6 md:pb-8">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">
                          {/* Columna Izquierda: Alineada al borde superior de la imagen y línea divisoria sutil en desktop */}
                          <div className="md:col-span-7 flex flex-col justify-start md:border-r md:border-[#1C1C1A]/10 md:pr-8">
                            <p className="font-roboto font-normal text-sm md:text-base text-[#1C1C1A]/80 leading-relaxed max-w-lg">
                              {service.description}
                            </p>

                            <div className="mt-6 md:mt-8">
                              <Link
                                href={`/servicios/${service.id}`}
                                className="inline-flex items-center gap-2 text-[13px] md:text-sm tracking-widest uppercase font-roboto font-medium text-[#099AD7] hover:text-[#1C1C1A] transition-colors group"
                              >
                                <span>MÁS INFORMACIÓN</span>
                                <ArrowUpRight
                                  size={15}
                                  strokeWidth={1.75}
                                  className="group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:scale-110 transition-transform duration-200"
                                />
                              </Link>
                            </div>
                          </div>

                          {/* Columna Derecha: Imagen con marco editorial técnico y clic directo para expandir */}
                          <div className="md:col-span-5 flex justify-end">
                            <button
                              type="button"
                              onClick={() => openModal(imageSrc, service.title)}
                              aria-label={`Expandir imagen de ${service.title}`}
                              className="w-full max-w-[420px] aspect-[3/2] border border-[#1C1C1A]/15 hover:border-[#099AD7] hover:shadow-sm bg-white p-1.5 shadow-xs transition-all duration-300 relative overflow-hidden select-none cursor-pointer text-left focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#099AD7]"
                            >
                              <div className="relative w-full h-full overflow-hidden bg-white">
                                <Image
                                  src={imageSrc}
                                  alt={service.title}
                                  fill
                                  sizes="(max-width: 768px) 100vw, 420px"
                                  className="object-cover"
                                />
                              </div>
                            </button>
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

      {/* Lightbox Modal a Pantalla Completa: Imagen Pura con Zoom por Rueda */}
      <AnimatePresence>
        {expandedImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={closeModal}
            onWheel={handleWheel}
            role="dialog"
            aria-modal="true"
            aria-label={expandedImage.title}
            className="fixed inset-0 z-50 bg-[#FFFFFF]/98 flex items-center justify-center p-4 md:p-8 select-none overflow-hidden"
          >
            {/* Botón de cierre minimalista ✕ en esquina superior derecha */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                closeModal();
              }}
              aria-label="Cerrar imagen"
              className="fixed top-6 right-6 md:top-8 md:right-10 z-50 text-[#1C1C1A] hover:text-[#099AD7] transition-colors cursor-pointer focus:outline-none"
            >
              <X size={20} strokeWidth={1.5} />
            </button>

            {/* Contenedor Central: Imagen pura con zoom interactivo por rueda */}
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                transform: `scale(${scale}) translate3d(0, 0, 0)`,
                transition: "transform 0.1s ease-out",
              }}
              className="relative flex items-center justify-center max-h-[85vh] max-w-full will-change-transform"
            >
              <Image
                src={expandedImage.src}
                alt={expandedImage.title}
                width={1600}
                height={1067}
                priority
                sizes="100vw"
                className="max-h-[85vh] w-auto max-w-full object-contain mx-auto pointer-events-none select-none"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
