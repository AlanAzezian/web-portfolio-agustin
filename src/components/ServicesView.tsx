"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import { Plus, Minus, ArrowUpRight } from "lucide-react";
import { ScrollTrigger } from "@/lib/gsap";
import { servicesData } from "@/data/services";
import { getWhatsAppLink } from "@/lib/whatsapp";

export default function ServicesView() {
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const lastClickedServiceRef = useRef<string | null>(null);

  const handleToggle = (id: string) => {
    const isOpening = activeServiceId !== id;
    lastClickedServiceRef.current = isOpening ? id : null;
    setActiveServiceId(isOpening ? id : null);
  };

  const handleAccordionAnimationComplete = (id: string) => {
    if (typeof window === "undefined") return;

    window.__lenis?.resize();
    ScrollTrigger.refresh();

    if (lastClickedServiceRef.current === id && activeServiceId === id) {
      const targetElement = itemRefs.current[id];
      if (window.__lenis && targetElement) {
        window.__lenis.scrollTo(targetElement, { offset: -90, duration: 0.7 });
      }
      lastClickedServiceRef.current = null;
    }
  };

  return (
    <div className="w-full max-w-4xl lg:max-w-5xl mx-auto px-6 md:px-8 pt-1 pb-12 md:pt-2 md:pb-16 min-h-[calc(100vh-5rem)] flex flex-col justify-between bg-[#FFFFFF] text-[#1C1C1A] font-roboto">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="w-full"
      >
        <div className="flex flex-col border-t border-[#1C1C1A]/15">
          {servicesData.map((service) => {
            const isOpen = activeServiceId === service.id;
            return (
              <div
                key={service.id}
                ref={(el) => {
                  itemRefs.current[service.id] = el;
                }}
                className="border-b border-[#1C1C1A]/15 bg-[#FFFFFF] scroll-mt-24"
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
                      <Minus size={18} strokeWidth={1.75} />
                    ) : (
                      <Plus size={18} strokeWidth={1.75} />
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
                      onAnimationComplete={() =>
                        handleAccordionAnimationComplete(service.id)
                      }
                      className="overflow-hidden"
                    >
                      <div className="pb-7 md:pb-8 pl-0 sm:pl-10 md:pl-15">
                        <p className="font-roboto font-normal text-[#1C1C1A]/85 leading-relaxed text-sm md:text-base max-w-3xl mb-5">
                          {service.description}
                        </p>

                        {service.subservices && service.subservices.length > 0 && (
                          <div className="mb-6">
                            <span className="font-roboto font-medium text-xs uppercase tracking-wider text-[#1C1C1A]/55 block mb-3">
                              Especialidades & Alcance
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {service.subservices.map((sub) => (
                                <span
                                  key={sub.id}
                                  className="font-roboto font-medium text-xs tracking-wider uppercase text-[#1C1C1A]/85 bg-[#FFFFFF] px-3 py-1.5 border border-[#1C1C1A]/15"
                                >
                                  {sub.title}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="mt-5 pt-5 border-t border-[#1C1C1A]/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div>
                            <span className="font-roboto font-medium text-[11px] uppercase tracking-wider text-[#099AD7] block mb-1">
                              DETALLE TÉCNICO & METODOLOGÍA
                            </span>
                            <p className="font-roboto font-normal text-xs md:text-sm text-[#1C1C1A]/70 leading-relaxed">
                              Consultá entregables, flujo de trabajo paso a paso y cotización directa.
                            </p>
                          </div>
                          <Link
                            href={`/servicios/${service.id}`}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 md:px-5 md:py-3 bg-[#099AD7] text-white font-roboto font-medium text-xs uppercase tracking-widest hover:bg-[#1C1C1A] hover:text-white transition-colors self-start sm:self-auto group"
                          >
                            <span>Solicitar cotización</span>
                            <ArrowUpRight
                              size={15}
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
      </motion.div>

      {/* Bloque Minimalista Fijo al Pie Abajo a la Izquierda: Trabajemos juntos */}
      <footer className="w-full mt-12 pt-8 border-t border-[#1C1C1A]/15 flex flex-col items-start text-left shrink-0">
        <h2 className="font-roboto text-lg md:text-xl font-medium text-[#1C1C1A] tracking-tight">
          Trabajemos juntos
        </h2>
        <a
          href={getWhatsAppLink(
            "Hola Agustín, me gustaría iniciar un proyecto contigo. ¿Podemos coordinar?"
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 md:px-5 md:py-3 border border-[#099AD7] bg-[#099AD7] text-white font-roboto font-medium text-xs uppercase tracking-widest hover:bg-transparent hover:text-[#099AD7] transition-colors group"
        >
          <span>Contactar por WhatsApp</span>
          <ArrowUpRight
            size={15}
            strokeWidth={1.75}
            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      </footer>
    </div>
  );
}
