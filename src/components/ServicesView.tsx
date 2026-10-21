"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { Plus, X, ArrowUpRight } from "lucide-react";
import { servicesData } from "@/data/services";

export default function ServicesView() {
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setActiveServiceId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-16 py-28 md:py-36 min-h-screen bg-[#F8F7F4] text-[#1C1C1A]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="font-roboto text-xs uppercase tracking-widest text-acento block mb-4">
          Catálogo de Servicios
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-sans font-light text-foreground mb-16 md:mb-24 max-w-4xl leading-[0.95] tracking-tighter">
          Soluciones arquitectónicas pensadas para construir y perdurar.
        </h1>

        <div className="flex flex-col mb-24 md:mb-32 border-t border-foreground/15">
          {servicesData.map((service) => {
            const isOpen = activeServiceId === service.id;
            return (
              <div key={service.id} className="border-b border-foreground/15">
                <button
                  type="button"
                  onClick={() => handleToggle(service.id)}
                  aria-expanded={isOpen}
                  className="w-full py-7 md:py-10 flex items-center justify-between gap-4 focus:outline-none group text-left cursor-pointer"
                >
                  <div className="flex items-baseline gap-4 md:gap-12">
                    <span className="font-roboto font-light text-lg md:text-xl text-foreground/40 w-7 md:w-8 shrink-0">
                      {service.orderNumber}
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans font-light text-foreground group-hover:text-acento transition-colors">
                      {service.title}
                    </h2>
                  </div>
                  <div className="text-acento transition-transform duration-300 flex items-center justify-center shrink-0">
                    {isOpen ? (
                      <X size={24} strokeWidth={1.5} />
                    ) : (
                      <Plus size={24} strokeWidth={1.5} />
                    )}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pb-10 md:pb-12 pl-0 sm:pl-11 md:pl-20">
                        <p className="text-foreground/80 font-sans leading-relaxed text-base md:text-lg max-w-3xl mb-8">
                          {service.description}
                        </p>

                        {service.subservices && service.subservices.length > 0 && (
                          <div className="mb-8">
                            <span className="font-roboto text-xs uppercase tracking-widest text-foreground/45 block mb-3">
                              Especialidades & Alcance
                            </span>
                            <div className="flex flex-wrap gap-2 md:gap-2.5">
                              {service.subservices.map((sub) => (
                                <span
                                  key={sub.id}
                                  className="text-xs tracking-wider uppercase text-foreground/80 bg-foreground/[0.04] px-3.5 py-1.5 border border-foreground/10 font-roboto"
                                >
                                  {sub.title}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="mt-6 pt-6 border-t border-foreground/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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

        {/* Final CTA Block */}
        <div className="p-8 sm:p-12 md:p-20 text-center bg-foreground text-background flex flex-col items-center">
          <span className="font-roboto text-xs uppercase tracking-widest text-background/60 block mb-4">
            ¿Tenés un proyecto en mente?
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-sans font-light mb-10 tracking-tighter leading-none">
            Hagámoslo realidad.
          </h2>
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4 sm:gap-6">
            <a
              href="mailto:hola@agustinfabrizio.com"
              className="px-8 py-4 text-background font-roboto text-xs sm:text-sm uppercase tracking-widest hover:bg-background hover:text-foreground transition-colors border border-background/20 text-center"
            >
              Enviar Email
            </a>
            <a
              href="https://wa.me/5491100000000"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-acento text-background font-roboto text-xs sm:text-sm uppercase tracking-widest hover:bg-background hover:text-foreground transition-colors text-center"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
