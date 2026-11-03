"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import type { ServiceItem, Subservice } from "@/data/services";
import { supabase } from "@/lib/supabase";
import { getWhatsAppLink, SERVICE_WHATSAPP_MESSAGES } from "@/lib/whatsapp";

interface ServiceDetailViewProps {
  service: ServiceItem;
}

function normalizeSubservices(raw: unknown): Subservice[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item, idx) => {
    if (typeof item === "string") {
      return { id: `sub-${idx + 1}`, title: item };
    }
    if (item && typeof item === "object") {
      const obj = item as Record<string, unknown>;
      return {
        id: typeof obj.id === "string" && obj.id ? obj.id : `sub-${idx + 1}`,
        title: typeof obj.title === "string" ? obj.title : "",
      };
    }
    return { id: `sub-${idx + 1}`, title: "" };
  });
}

export default function ServiceDetailView({
  service: initialService,
}: ServiceDetailViewProps) {
  const [service, setService] = useState<ServiceItem>(initialService);

  useEffect(() => {
    let active = true;

    async function loadServiceFromSupabase() {
      try {
        const { data, error } = await supabase
          .from("services")
          .select("*")
          .eq("id", initialService.id)
          .maybeSingle();

        if (!active || error || !data) return;

        const row = data as Record<string, unknown>;
        const dbSubservices = normalizeSubservices(row.subservices);
        const dbSpecs = Array.isArray(row.methodology_steps)
          ? (row.methodology_steps as string[]).filter(Boolean)
          : [];

        setService({
          ...initialService,
          orderNumber: String(row.order_number || initialService.orderNumber),
          title: String(row.title || initialService.title),
          description: String(row.description || initialService.description),
          subservices:
            dbSubservices.length > 0
              ? dbSubservices
              : initialService.subservices,
          technicalSpecs:
            dbSpecs.length > 0 ? dbSpecs : initialService.technicalSpecs,
        });
      } catch {
        // Fallback silencioso a initialService
      }
    }

    loadServiceFromSupabase();
    return () => {
      active = false;
    };
  }, [initialService]);

  const whatsappMessage =
    SERVICE_WHATSAPP_MESSAGES[service.id] ??
    `Hola Agustín, me gustaría solicitar una cotización por el servicio de ${service.title}.`;

  return (
    <div className="relative w-full min-h-[calc(100vh-5rem)] bg-[#FFFFFF] text-[#1C1C1A] font-roboto pt-2 pb-16 md:pt-4 md:pb-36">
      {/* Contenedor Central Controlado: Cabecera y Ficha Técnica */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
        className="w-full max-w-4xl lg:max-w-5xl mx-auto px-6 md:px-8"
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
        <section className="py-10 md:py-12 border-b border-[#1C1C1A]/15 grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 items-start">
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
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              {service.technicalSpecs.map((spec, idx) => (
                <li
                  key={idx}
                  className="p-4 bg-[#1C1C1A]/[0.02] border border-[#1C1C1A]/10 flex items-start gap-3 h-full"
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

      {/* Bloque de Contacto Independiente y Estático abajo a la izquierda */}
      <footer className="max-w-4xl lg:max-w-5xl mx-auto px-6 mt-10 md:max-w-none md:mx-0 md:px-0 md:mt-0 md:fixed md:bottom-12 md:left-8 lg:left-16 z-30 flex flex-col items-start text-left pointer-events-auto">
        <h2 className="font-roboto font-medium text-[#1C1C1A] text-lg md:text-xl tracking-tight mb-3">
          Trabajemos juntos
        </h2>
        <a
          href={getWhatsAppLink(whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#099AD7] hover:bg-[#0887bd] text-white px-5 py-2.5 text-xs font-roboto font-medium uppercase tracking-widest transition-colors duration-200 group"
        >
          <span>CONTACTAR POR WHATSAPP</span>
          <ArrowUpRight
            size={14}
            strokeWidth={1.5}
            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      </footer>
    </div>
  );
}
