"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import type { ServiceItem } from "@/data/services";

interface ServiceDetailViewProps {
  service: ServiceItem;
}

export default function ServiceDetailView({ service }: ServiceDetailViewProps) {
  const whatsappText = encodeURIComponent(
    `Hola Agustín, me gustaría solicitar una cotización por el servicio de ${service.title}.`
  );
  const mailtoSubject = encodeURIComponent(`Cotización: ${service.title}`);

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-16 py-28 md:py-36 min-h-screen bg-[#F8F7F4] text-[#1C1C1A]">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
      >
        {/* Navegación de regreso */}
        <div className="mb-10 md:mb-14">
          <Link
            href="/servicios"
            className="inline-flex items-center gap-2 font-roboto text-xs uppercase tracking-widest text-foreground/60 hover:text-acento transition-colors"
          >
            <ArrowLeft size={15} strokeWidth={1.5} />
            <span>Volver a Servicios</span>
          </Link>
        </div>

        {/* Cabecera Editorial del Servicio */}
        <header className="pb-12 md:pb-16 border-b border-foreground/15">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-roboto text-xs uppercase tracking-widest text-acento">
              SERVICIO {service.orderNumber}
            </span>
            <span className="w-6 h-[1px] bg-acento" />
            <span className="font-roboto text-xs uppercase tracking-widest text-foreground/50">
              FICHA TÉCNICA & COTIZACIÓN
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-sans font-light text-foreground leading-[0.95] tracking-tighter max-w-4xl mb-8">
            {service.title}
          </h1>

          <p className="text-lg md:text-2xl font-sans font-light text-foreground/90 max-w-3xl leading-relaxed mb-6">
            {service.description}
          </p>

          <p className="text-base md:text-lg font-sans text-foreground/70 max-w-3xl leading-relaxed">
            {service.extendedDescription}
          </p>
        </header>

        {/* Bloque Técnico: Alcance + Especificaciones */}
        <section className="py-12 md:py-20 border-b border-foreground/15 grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12">
          <div className="lg:col-span-5">
            <span className="font-roboto text-xs uppercase tracking-widest text-acento block mb-3">
              01 / Especialidades
            </span>
            <h2 className="text-2xl md:text-3xl font-sans font-light tracking-tight text-foreground mb-6">
              Alcance del Servicio
            </h2>
            <div className="flex flex-col gap-3">
              {service.subservices.map((sub, idx) => (
                <div
                  key={sub.id}
                  className="flex items-baseline gap-4 py-3 border-b border-foreground/10"
                >
                  <span className="font-roboto text-xs text-acento tabular-nums">
                    0{idx + 1}
                  </span>
                  <span className="font-sans text-base text-foreground">
                    {sub.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 lg:pl-8 lg:border-l border-foreground/10">
            <span className="font-roboto text-xs uppercase tracking-widest text-acento block mb-3">
              02 / Estándar Técnico
            </span>
            <h2 className="text-2xl md:text-3xl font-sans font-light tracking-tight text-foreground mb-6">
              Especificaciones & Herramientas
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {service.technicalSpecs.map((spec, idx) => (
                <li
                  key={idx}
                  className="p-5 bg-foreground/[0.03] border border-foreground/10 flex items-start gap-3"
                >
                  <Check
                    size={16}
                    strokeWidth={2}
                    className="text-acento shrink-0 mt-0.5"
                  />
                  <span className="font-sans text-sm md:text-base text-foreground/85 leading-snug">
                    {spec}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Bloque de Entregables */}
        <section className="py-12 md:py-20 border-b border-foreground/15">
          <div className="mb-10 md:mb-12">
            <span className="font-roboto text-xs uppercase tracking-widest text-acento block mb-3">
              03 / Paquete de Entrega
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans font-light tracking-tight text-foreground">
              Entregables Técnicos Incluidos
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {service.deliverables.map((item, idx) => (
              <div
                key={idx}
                className="p-6 md:p-8 border border-foreground/15 bg-[#F8F7F4] hover:border-acento transition-colors flex flex-col justify-between gap-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-roboto text-xs uppercase tracking-widest text-acento">
                    ENTREGABLE 0{idx + 1}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-sans font-light text-foreground mb-2 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm md:text-base font-sans text-foreground/70 leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Metodología Paso a Paso dedicada a este servicio */}
        <section className="py-12 md:py-20">
          <div className="mb-10 md:mb-14">
            <span className="font-roboto text-xs uppercase tracking-widest text-acento block mb-3">
              04 / Proceso de Trabajo
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-roboto font-light uppercase tracking-wider text-foreground">
              {service.methodologyTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border border-foreground/15">
            {service.methodologySteps.map((item, i) => (
              <div
                key={i}
                className="bg-transparent p-7 md:p-8 flex flex-col justify-between min-h-[260px] md:min-h-[300px] group hover:bg-foreground hover:text-background transition-colors border-b md:border-b-0 md:border-r last:border-b-0 md:last:border-r-0 border-foreground/15"
              >
                <span className="font-roboto text-xs uppercase tracking-widest text-acento group-hover:text-background/60 block mb-8">
                  [ {item.stepNumber} ]
                </span>
                <div>
                  <h3 className="text-2xl md:text-3xl font-sans font-light text-foreground group-hover:text-background mb-3 leading-tight tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-foreground/75 group-hover:text-background/80 font-sans text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bloque de Contacto Directo (WhatsApp / Email) */}
        <section className="mt-8 p-8 sm:p-12 md:p-20 bg-foreground text-background flex flex-col items-start md:items-center md:text-center">
          <span className="font-roboto text-xs uppercase tracking-widest text-acento block mb-4">
            COTIZACIÓN DIRECTA — {service.title.toUpperCase()}
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-sans font-light mb-6 tracking-tighter leading-none max-w-3xl">
            Coordinemos alcances, plazos y presupuesto para tu proyecto.
          </h2>
          <p className="text-background/70 font-sans text-base md:text-lg max-w-2xl mb-10 leading-relaxed">
            Enviá la planimetría o referencias iniciales por WhatsApp o correo electrónico para recibir una propuesta técnica a medida.
          </p>

          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4 sm:gap-6">
            <a
              href={`https://wa.me/5491100000000?text=${whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-acento text-background font-roboto text-xs sm:text-sm uppercase tracking-widest hover:bg-background hover:text-foreground transition-colors"
            >
              <span>Contactar por WhatsApp</span>
              <ArrowUpRight size={16} strokeWidth={1.75} />
            </a>
            <a
              href={`mailto:hola@agustinfabrizio.com?subject=${mailtoSubject}`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-background font-roboto text-xs sm:text-sm uppercase tracking-widest hover:bg-background hover:text-foreground transition-colors border border-background/25"
            >
              <span>Enviar Email Directo</span>
              <ArrowUpRight size={16} strokeWidth={1.75} />
            </a>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
