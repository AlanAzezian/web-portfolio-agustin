"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, Check, X } from "lucide-react";
import {
  parseMethodologyMetadata,
  type ServiceItem,
  type Subservice,
} from "@/data/services";
import { supabase } from "@/lib/supabase";
import { getWhatsAppLink, SERVICE_WHATSAPP_MESSAGES } from "@/lib/whatsapp";
import { IconlyArrowRight2 } from "@/components/icons/IconlyArrowRight2";

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
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

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
        const rawSubservices = row.subservices ?? row.scope_items;
        const dbSubservices = normalizeSubservices(rawSubservices);
        const rawSpecs =
          row.specifications ?? row.tools ?? row.methodology_steps;
        const dbSpecs = Array.isArray(rawSpecs)
          ? (rawSpecs as string[]).filter(Boolean)
          : [];
        const meta = parseMethodologyMetadata(row.methodology_title);
        const desc = String(row.description || initialService.description);
        const detailDesc = String(
          row.detail_description ||
            row.long_description ||
            meta.detailDescription ||
            initialService.detailDescription ||
            desc
        );
        const coverImage = String(
          (typeof row.cover_image === "string" && row.cover_image.trim()) ||
            meta.coverImage ||
            initialService.coverImage ||
            "/projects/centro-de-trasbordo/01-render-exterior.webp"
        );
        const rawImages = Array.isArray(row.images)
          ? (row.images as string[]).filter(Boolean)
          : meta.images && meta.images.length > 0
            ? meta.images
            : initialService.images || [];
        const mergedImages =
          rawImages.length > 0
            ? Array.from(new Set([coverImage, ...rawImages]))
            : [coverImage];

        setService({
          ...initialService,
          orderNumber: String(row.order_number || initialService.orderNumber),
          title: String(row.title || initialService.title),
          description: desc,
          detailDescription: detailDesc,
          coverImage,
          images: mergedImages,
          subservices: Array.isArray(rawSubservices)
            ? dbSubservices
            : initialService.subservices,
          technicalSpecs: Array.isArray(rawSpecs)
            ? dbSpecs
            : initialService.technicalSpecs,
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

  const galleryImages =
    service.images && service.images.length > 0
      ? service.images
      : [
          service.coverImage ||
            "/projects/centro-de-trasbordo/01-render-exterior.webp",
        ];

  const safeImageIdx =
    activeImageIdx < galleryImages.length ? activeImageIdx : 0;
  const currentImage = galleryImages[safeImageIdx];

  const handlePrevImage = () => {
    setActiveImageIdx((prev) =>
      prev <= 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setActiveImageIdx((prev) =>
      prev >= galleryImages.length - 1 ? 0 : prev + 1
    );
  };

  const whatsappMessage =
    SERVICE_WHATSAPP_MESSAGES[service.id] ??
    `Hola Agustín, me gustaría solicitar una cotización por el servicio de ${service.title}.`;

  return (
    <div className="relative w-full min-h-[calc(100vh-5rem)] bg-[#FFFFFF] text-[#1C1C1A] font-roboto pt-2 pb-16 md:pt-4 md:pb-36">
      {/* Contenedor Central Controlado: Cabecera, Galería Superior y Ficha Técnica Inferior */}
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
            {service.detailDescription || service.description}
          </p>
        </header>

        {/* Galería Técnica Editorial Centrada Arriba (Inmediatamente debajo del título del servicio) */}
        <section
          aria-label={`Galería de ${service.title}`}
          className="py-10 md:py-12 border-b border-[#1C1C1A]/15 flex flex-col items-center justify-center"
        >
          {/* Marco Contenedor Principal Proporcionado (aspect-[16/10]) con object-contain */}
          <div className="relative w-full max-w-4xl mx-auto aspect-[16/10] border border-[#1C1C1A]/15 bg-white p-2">
            <div
              onClick={() => setExpandedImage(currentImage)}
              className="relative w-full h-full overflow-hidden bg-neutral-50/70 flex items-center justify-center cursor-pointer group"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImage}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={currentImage}
                    alt={`${service.title} — vista ${safeImageIdx + 1}`}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 896px"
                    className="object-contain p-2 md:p-4 transition-transform duration-500 group-hover:scale-[1.01]"
                  />
                </motion.div>
              </AnimatePresence>

              {galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevImage();
                    }}
                    aria-label="Imagen anterior"
                    className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-10 md:h-10 flex items-center justify-center bg-[#FFFFFF]/90 hover:bg-[#FFFFFF] border border-[#1C1C1A]/15 hover:border-[#099AD7] text-[#1C1C1A] hover:text-[#099AD7] transition-colors cursor-pointer focus:outline-none"
                  >
                    <IconlyArrowRight2
                      size={15}
                      color="currentColor"
                      className="rotate-180"
                    />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }}
                    aria-label="Imagen siguiente"
                    className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-10 md:h-10 flex items-center justify-center bg-[#FFFFFF]/90 hover:bg-[#FFFFFF] border border-[#1C1C1A]/15 hover:border-[#099AD7] text-[#1C1C1A] hover:text-[#099AD7] transition-colors cursor-pointer focus:outline-none"
                  >
                    <IconlyArrowRight2 size={15} color="currentColor" />
                  </button>

                  <div className="absolute bottom-3 right-3 z-20 bg-[#FFFFFF]/90 border border-[#1C1C1A]/10 px-2.5 py-1 pointer-events-none">
                    <span className="font-roboto text-[11px] tabular-nums tracking-wider text-[#1C1C1A]/75">
                      {String(safeImageIdx + 1).padStart(2, "0")} /{" "}
                      {String(galleryImages.length).padStart(2, "0")}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Carrusel de Miniaturas Inferior Proporcionadas */}
          {galleryImages.length > 1 && (
            <div className="mt-4 w-full max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-3">
              {galleryImages.map((imgSrc, idx) => {
                const isSelected = idx === safeImageIdx;
                return (
                  <button
                    key={`${imgSrc}-${idx}`}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    aria-label={`Ver imagen ${idx + 1}`}
                    className={`relative w-24 sm:w-28 md:w-32 aspect-[16/10] overflow-hidden border transition-all duration-200 cursor-pointer p-1 bg-white ${
                      isSelected
                        ? "border-[#099AD7] opacity-100"
                        : "border-[#1C1C1A]/15 opacity-60 hover:opacity-100 hover:border-[#1C1C1A]/35"
                    }`}
                  >
                    <div className="relative w-full h-full bg-neutral-50">
                      <Image
                        src={imgSrc}
                        alt={`${service.title} miniatura ${idx + 1}`}
                        fill
                        sizes="128px"
                        className="object-contain p-0.5"
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* Dos Bloques Técnicos Abajo en 2 Columnas: 01 / Alcance del Servicio (Izquierda) y 02 / Especificaciones y Herramientas (Derecha) */}
        <section className="py-10 md:py-12 border-b border-[#1C1C1A]/15 grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 items-start">
          {/* Columna Izquierda: Bloque 01 */}
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

          {/* Columna Derecha: Bloque 02 */}
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

      {/* Lightbox Modal de Imagen Expandida */}
      <AnimatePresence>
        {expandedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setExpandedImage(null)}
            role="dialog"
            aria-modal="true"
            aria-label={service.title}
            className="fixed inset-0 z-50 bg-[#FFFFFF]/98 flex items-center justify-center p-4 md:p-8 select-none overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setExpandedImage(null)}
              aria-label="Cerrar imagen"
              className="fixed top-6 right-6 md:top-8 md:right-10 z-50 text-[#1C1C1A] hover:text-[#099AD7] transition-colors cursor-pointer focus:outline-none"
            >
              <X size={20} strokeWidth={1.5} />
            </button>

            <div
              onClick={(e) => e.stopPropagation()}
              className="relative flex items-center justify-center max-h-[85vh] max-w-full"
            >
              <Image
                src={expandedImage}
                alt={service.title}
                width={1200}
                height={1200}
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
