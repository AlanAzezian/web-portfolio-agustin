"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import type { ServiceItem } from "@/data/services";
import { getWhatsAppLink, SERVICE_WHATSAPP_MESSAGES } from "@/lib/whatsapp";

interface ServiceDetailViewProps {
  service: ServiceItem;
}

export default function ServiceDetailView({ service }: ServiceDetailViewProps) {
  const whatsappMessage =
    SERVICE_WHATSAPP_MESSAGES[service.id] ??
    `Hola Agustín, me gustaría solicitar una cotización por el servicio de ${service.title}.`;

  return (
    <div className="max-w-4xl lg:max-w-5xl mx-auto px-6 md:px-8 pt-2 pb-16 md:pt-4 md:pb-20 min-h-[calc(100vh-5rem)] flex flex-col justify-between bg-[#FFFFFF] text-[#1C1C1A] font-roboto">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
      >
        {/* Navegación de regreso */}
        <div className="mb-8 md:mb-10">
          <Link
            href="/servicios"
            className="inline-flex items-center gap-2 font-roboto font-medium text-xs uppercase tracking-widest text-[#1C1C1A]/65 hover:text-[#099AD7] transition-colors"
          >
            <ArrowLeft size={15} strokeWidth={1.75} />
            <span>Servicios</span>
          </Link>
        </div>

        {/* Cabecera Directa y Sobria */}
        <header className="pb-8 md:pb-10 border-b border-[#1C1C1A]/15">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-roboto font-medium uppercase text-[#1C1C1A] leading-tight tracking-tight max-w-4xl mb-4">
            {service.title}
          </h1>

          <p className="text-sm md:text-base font-roboto font-normal text-[#1C1C1A]/85 max-w-3xl leading-relaxed">
            {service.description}
          </p>
        </header>

        {/* Dos Bloques Claros: 01 / Alcance del Servicio y 02 / Especificaciones y Herramientas */}
        <section className="py-10 md:py-12 grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12">
          {/* Bloque 01 */}
          <div className="lg:col-span-5">
            <h2 className="font-roboto font-medium text-sm md:text-base uppercase tracking-wider text-[#099AD7] tabular-nums mb-5">
              01 / ALCANCE DEL SERVICIO
            </h2>
            <div className="flex flex-col gap-2">
              {service.subservices.map((sub, idx) => (
                <div
                  key={sub.id}
                  className="flex items-baseline gap-4 py-3 border-b border-[#1C1C1A]/10"
                >
                  <span className="font-roboto font-medium text-xs text-[#099AD7] tabular-nums tracking-wider">
                    0{idx + 1}
                  </span>
                  <span className="font-roboto font-normal text-sm md:text-base text-[#1C1C1A]/85">
                    {sub.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bloque 02 */}
          <div className="lg:col-span-7 lg:pl-8 lg:border-l border-[#1C1C1A]/10">
            <h2 className="font-roboto font-medium text-sm md:text-base uppercase tracking-wider text-[#099AD7] tabular-nums mb-5">
              02 / ESPECIFICACIONES Y HERRAMIENTAS
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {service.technicalSpecs.map((spec, idx) => (
                <li
                  key={idx}
                  className="p-4 bg-[#1C1C1A]/[0.02] border border-[#1C1C1A]/10 flex items-start gap-3"
                >
                  <Check
                    size={16}
                    strokeWidth={2}
                    className="text-[#099AD7] shrink-0 mt-0.5"
                  />
                  <span className="font-roboto font-normal text-sm md:text-base text-[#1C1C1A]/85 leading-relaxed">
                    {spec}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </motion.div>

      {/* Bloque Minimalista al Pie: Trabajemos juntos */}
      <footer className="pt-8 border-t border-[#1C1C1A]/15 flex flex-col items-start text-left shrink-0">
        <h2 className="font-roboto text-lg md:text-xl font-medium text-[#1C1C1A] tracking-tight">
          Trabajemos juntos
        </h2>
        <a
          href={getWhatsAppLink(whatsappMessage)}
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
