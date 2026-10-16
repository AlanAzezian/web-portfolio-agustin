"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { Plus, X, ArrowUpRight } from "lucide-react";
import { servicesData } from "@/data/services";

export default function ServicesView() {
  const [activeServiceId, setActiveServiceId] = useState<string | null>(servicesData[0].id);
  const [lastActiveId, setLastActiveId] = useState<string>(servicesData[0].id);

  const handleToggle = (id: string) => {
    if (activeServiceId === id) {
      setActiveServiceId(null);
    } else {
      setActiveServiceId(id);
      setLastActiveId(id);
    }
  };

  const activeService =
    servicesData.find((s) => s.id === (activeServiceId ?? lastActiveId)) ??
    servicesData[0];

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-12 py-32 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl md:text-7xl font-sans font-light text-foreground mb-24 max-w-4xl leading-[0.9] tracking-tighter">
          Soluciones arquitectónicas pensadas para construir y perdurar.
        </h1>

        <div className="flex flex-col mb-32 pt-12 border-t border-foreground/10">
          {servicesData.map((service) => {
            const isOpen = activeServiceId === service.id;
            return (
              <div key={service.id} className="border-b border-foreground/10">
                <button
                  type="button"
                  onClick={() => handleToggle(service.id)}
                  aria-expanded={isOpen}
                  className="w-full py-8 flex items-center justify-between focus:outline-none group text-left cursor-pointer"
                >
                  <div className="flex items-baseline space-x-6 md:space-x-12">
                    <span className="font-sans font-light text-xl text-foreground/40 w-8">
                      {service.orderNumber}
                    </span>
                    <h3 className="text-2xl md:text-4xl font-sans font-light text-foreground group-hover:text-foreground/70 transition-colors">
                      {service.title}
                    </h3>
                  </div>
                  <div className="text-acento transition-transform duration-300 flex items-center justify-center">
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
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pb-12 pl-14 md:pl-20">
                        <p className="text-foreground/80 font-sans leading-relaxed text-lg max-w-3xl mb-8">
                          {service.description}
                        </p>

                        {service.subservices && service.subservices.length > 0 && (
                          <div className="mb-8">
                            <span className="font-mono text-xs uppercase tracking-widest text-foreground/40 block mb-3">
                              Especialidades & Alcance
                            </span>
                            <div className="flex flex-wrap gap-2 md:gap-2.5">
                              {service.subservices.map((sub) => (
                                <span
                                  key={sub.id}
                                  className="text-xs tracking-wider uppercase text-neutral-600 bg-neutral-100/70 px-3 py-1.5 rounded-full border border-neutral-200/60 font-mono"
                                >
                                  {sub.title}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="mt-4 pt-4 border-t border-foreground/5">
                          <span className="font-mono text-xs uppercase tracking-widest text-acento block mb-2">
                            COMENCEMOS UN PROYECTO
                          </span>
                          <Link
                            href="/bio"
                            className="font-sans font-light text-xl text-foreground hover:text-acento transition-colors inline-flex items-center gap-2 group"
                          >
                            <span>Solicitar cotización</span>
                            <ArrowUpRight
                              size={18}
                              strokeWidth={1.5}
                              className="text-acento transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
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

        <div className="pt-12">
          <h2 className="text-2xl md:text-3xl font-mono uppercase tracking-widest text-foreground mb-16">
            {activeService.methodologyTitle}
          </h2>
          <motion.div
            key={activeService.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-0"
          >
            {activeService.methodologySteps.map((item, i) => (
              <div 
                key={i}
                className="bg-transparent p-8 flex flex-col justify-between min-h-[320px] group hover:bg-foreground hover:text-background transition-colors border-t md:border-t-0 md:border-l first:border-l-0 border-foreground/10"
              >
                <span className="font-mono text-xs uppercase tracking-widest text-acento group-hover:text-background/60 block mb-8">
                  [ {item.stepNumber} ]
                </span>
                <div>
                  <h4 className="text-3xl font-sans font-light text-foreground group-hover:text-background mb-4 leading-none tracking-tight">
                    {item.title}
                  </h4>
                  <p className="text-foreground/80 group-hover:text-background/80 font-sans text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Final CTA Block */}
        <div className="mt-32 p-12 md:p-24 text-center bg-foreground text-background flex flex-col items-center">
          <span className="font-mono text-xs uppercase tracking-widest text-background/60 block mb-6">
            ¿Tenés un proyecto en mente?
          </span>
          <h2 className="text-5xl md:text-7xl font-sans font-light mb-12 tracking-tighter leading-none">
            Hagámoslo realidad.
          </h2>
          <div className="flex gap-6">
            <a
              href="mailto:hola@agustinfabrizio.com"
              className="px-8 py-4 text-background font-mono text-sm uppercase tracking-widest hover:bg-background hover:text-foreground transition-colors border border-background/20"
            >
              Enviar Email
            </a>
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-acento text-background font-mono text-sm uppercase tracking-widest hover:bg-background hover:text-foreground transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
