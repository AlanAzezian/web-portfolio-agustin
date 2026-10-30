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
    <div className="max-w-4xl lg:max-w-5xl mx-auto px-6 md:px-8 pt-2 pb-16 md:pt-4 md:pb-20 min-h-screen bg-[#FFFFFF] text-[#1C1C1A] font-roboto">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Navegación de regreso */}
        <div className="mb-8 md:mb-12">
          <Link
            href="/servicios"
            className="inline-flex items-center gap-2 font-roboto font-medium text-xs uppercase tracking-widest text-[#1C1C1A]/65 hover:text-[#099AD7] transition-colors"
          >
            <ArrowLeft size={15} strokeWidth={1.75} />
            <span>Volver a Servicios</span>
          </Link>
        </div>

        {/* Cabecera Editorial del Servicio */}
        <header className="pb-10 md:pb-14 border-b border-[#1C1C1A]/15">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-roboto font-medium text-xs uppercase tracking-wider text-[#099AD7] tabular-nums">
              SERVICIO {service.orderNumber}
            </span>
            <span className="w-6 h-[1px] bg-[#099AD7]" />
            <span className="font-roboto font-medium text-xs uppercase tracking-wider text-[#1C1C1A]/55">
              FICHA TÉCNICA & COTIZACIÓN
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-roboto font-medium text-[#1C1C1A] leading-tight tracking-tight max-w-4xl mb-6">
            {service.title}
          </h1>

          <p className="text-base md:text-lg font-roboto font-normal text-[#1C1C1A]/85 max-w-3xl leading-relaxed mb-4">
            {service.description}
          </p>

          <p className="text-sm md:text-base font-roboto font-normal text-[#1C1C1A]/75 max-w-3xl leading-relaxed">
            {service.extendedDescription}
          </p>
        </header>

        {/* Bloque Técnico: Alcance + Especificaciones */}
        <section className="py-10 md:py-14 border-b border-[#1C1C1A]/15 grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12">
          <div className="lg:col-span-5">
            <span className="font-roboto font-medium text-xs uppercase tracking-wider text-[#099AD7] tabular-nums block mb-2">
              01 / Especialidades
            </span>
            <h2 className="text-lg md:text-xl font-roboto font-medium tracking-tight text-[#1C1C1A] mb-5">
              Alcance del Servicio
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

          <div className="lg:col-span-7 lg:pl-8 lg:border-l border-[#1C1C1A]/10">
            <span className="font-roboto font-medium text-xs uppercase tracking-wider text-[#099AD7] tabular-nums block mb-2">
              02 / Estándar Técnico
            </span>
            <h2 className="text-lg md:text-xl font-roboto font-medium tracking-tight text-[#1C1C1A] mb-5">
              Especificaciones & Herramientas
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

        {/* Bloque de Entregables */}
        <section className="py-10 md:py-14 border-b border-[#1C1C1A]/15">
          <div className="mb-8">
            <span className="font-roboto font-medium text-xs uppercase tracking-wider text-[#099AD7] tabular-nums block mb-2">
              03 / Paquete de Entrega
            </span>
            <h2 className="text-lg md:text-xl font-roboto font-medium tracking-tight text-[#1C1C1A]">
              Entregables Técnicos Incluidos
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {service.deliverables.map((item, idx) => (
              <div
                key={idx}
                className="p-6 border border-[#1C1C1A]/15 bg-[#FFFFFF] hover:border-[#099AD7] transition-colors flex flex-col justify-between gap-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-roboto font-medium text-xs uppercase tracking-wider text-[#099AD7] tabular-nums">
                    ENTREGABLE 0{idx + 1}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-roboto font-medium text-[#1C1C1A] mb-2 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm md:text-base font-roboto font-normal text-[#1C1C1A]/85 leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Metodología Paso a Paso dedicada a este servicio */}
        <section className="py-10 md:py-14">
          <div className="mb-8">
            <span className="font-roboto font-medium text-xs uppercase tracking-wider text-[#099AD7] tabular-nums block mb-2">
              04 / Proceso de Trabajo
            </span>
            <h2 className="text-lg md:text-xl font-roboto font-medium uppercase tracking-wider text-[#1C1C1A]">
              {service.methodologyTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border border-[#1C1C1A]/15">
            {service.methodologySteps.map((item, i) => (
              <div
                key={i}
                className="bg-transparent p-6 flex flex-col justify-between min-h-[220px] md:min-h-[250px] group hover:bg-[#1C1C1A] hover:text-[#FFFFFF] transition-colors border-b md:border-b-0 md:border-r last:border-b-0 md:last:border-r-0 border-[#1C1C1A]/15"
              >
                <span className="font-roboto font-medium text-xs uppercase tracking-wider tabular-nums text-[#099AD7] group-hover:text-[#FFFFFF]/65 block mb-6">
                  [ {item.stepNumber} ]
                </span>
                <div>
                  <h3 className="text-lg md:text-xl font-roboto font-medium text-[#1C1C1A] group-hover:text-[#FFFFFF] mb-2 leading-tight tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-[#1C1C1A]/85 group-hover:text-[#FFFFFF]/85 font-roboto font-normal text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bloque Minimalista: Trabajemos juntos */}
        <section className="pt-10 border-t border-[#1C1C1A]/15 flex flex-col items-start text-left">
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
        </section>
      </motion.div>
    </div>
  );
}
