"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import { Plus, X, ArrowUpRight } from "lucide-react";
import { servicesData } from "@/data/services";
import { getWhatsAppLink } from "@/lib/whatsapp";

export default function ServicesView() {
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleToggle = (id: string) => {
    const isOpening = activeServiceId !== id;
    setActiveServiceId(isOpening ? id : null);

    if (isOpening) {
      setTimeout(() => {
        const el = itemRefs.current[id];
        if (!el) return;

        if (typeof window !== "undefined" && window.__lenis) {
          const rect = el.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const targetOffset =
            rect.height < viewportHeight * 0.75
              ? -(viewportHeight - rect.height) / 2
              : -100;
          window.__lenis.scrollTo(el, {
            offset: targetOffset,
            duration: 0.75,
          });
        } else {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 220);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-16 pt-24 pb-16 md:pt-28 md:pb-24 min-h-screen bg-[#F8F7F4] text-[#1C1C1A]">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="mb-8 md:mb-10">
          <span className="font-roboto text-[11px] uppercase tracking-widest text-acento block mb-2">
            Catálogo de Servicios
          </span>
          <h1 className="text-xl md:text-2xl font-roboto font-normal text-foreground max-w-xl leading-snug tracking-tight">
            Soluciones arquitectónicas pensadas para construir y perdurar.
          </h1>
        </div>

        <div className="flex flex-col mb-20 md:mb-24 border-t border-foreground/15">
          {servicesData.map((service) => {
            const isOpen = activeServiceId === service.id;
            return (
              <div
                key={service.id}
                ref={(el) => {
                  itemRefs.current[service.id] = el;
                }}
                className="border-b border-foreground/15 scroll-mt-24"
              >
                <button
                  type="button"
                  onClick={() => handleToggle(service.id)}
                  aria-expanded={isOpen}
                  className="w-full py-6 md:py-8 flex items-center justify-between gap-4 focus:outline-none group text-left cursor-pointer"
                >
                  <div className="flex items-baseline gap-4 md:gap-10">
                    <span className="font-roboto font-light text-base md:text-lg text-foreground/40 w-7 md:w-8 shrink-0 tabular-nums">
                      {service.orderNumber}
                    </span>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-sans font-light text-foreground group-hover:text-acento transition-colors">
                      {service.title}
                    </h2>
                  </div>
                  <div className="text-acento transition-transform duration-300 flex items-center justify-center shrink-0">
                    {isOpen ? (
                      <X size={22} strokeWidth={1.5} />
                    ) : (
                      <Plus size={22} strokeWidth={1.5} />
                    )}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pb-8 md:pb-10 pl-0 sm:pl-11 md:pl-18">
                        <p className="text-foreground/80 font-sans leading-relaxed text-base md:text-lg max-w-3xl mb-6">
                          {service.description}
                        </p>

                        {service.subservices && service.subservices.length > 0 && (
                          <div className="mb-6">
                            <span className="font-roboto text-xs uppercase tracking-widest text-foreground/45 block mb-3">
                              Especialidades & Alcance
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {service.subservices.map((sub) => (
                                <span
                                  key={sub.id}
                                  className="text-xs tracking-wider uppercase text-foreground/80 bg-foreground/[0.04] px-3 py-1.5 border border-foreground/10 font-roboto"
                                >
                                  {sub.title}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="mt-5 pt-5 border-t border-foreground/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div>
                            <span className="font-roboto text-[11px] uppercase tracking-widest text-acento block mb-1">
                              DETALLE TÉCNICO & METODOLOGÍA
                            </span>
                            <p className="text-xs text-foreground/60 font-sans">
                              Consultá entregables, flujo de trabajo paso a paso y cotización directa.
                            </p>
                          </div>
                          <Link
                            href={`/servicios/${service.id}`}
                            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-acento text-background font-roboto text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors self-start sm:self-auto group"
                          >
                            <span>Solicitar cotización</span>
                            <ArrowUpRight
                              size={16}
                              strokeWidth={1.75}
                              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Bloque Minimalista: Trabajemos juntos */}
        <div className="pt-8 border-t border-[#1C1C1A]/15 flex flex-col items-start">
          <h2 className="text-2xl md:text-3xl font-medium text-[#1C1C1A] tracking-tight mb-4">
            Trabajemos juntos
          </h2>
          <a
            href={getWhatsAppLink(
              "Hola Agustín, me gustaría iniciar un proyecto contigo. ¿Podemos coordinar?"
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 border border-[#099AD7] bg-[#099AD7] text-[#F8F7F4] font-roboto text-xs uppercase tracking-widest hover:bg-transparent hover:text-[#099AD7] transition-colors group"
          >
            <span>Contactar por WhatsApp</span>
            <ArrowUpRight
              size={15}
              strokeWidth={1.75}
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </div>
      </motion.div>
    </div>
  );
}
