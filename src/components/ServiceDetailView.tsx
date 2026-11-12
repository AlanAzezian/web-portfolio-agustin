"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, Check, Plus, X } from "lucide-react";
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
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const detailsRef = useRef<HTMLDivElement>(null);

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

  const handlePrevImage = useCallback(() => {
    setActiveImageIdx((prev) =>
      prev <= 0 ? galleryImages.length - 1 : prev - 1
    );
  }, [galleryImages.length]);

  const handleNextImage = useCallback(() => {
    setActiveImageIdx((prev) =>
      prev >= galleryImages.length - 1 ? 0 : prev + 1
    );
  }, [galleryImages.length]);

  // Soporte de navegación por teclado (← / →)
  useEffect(() => {
    if (galleryImages.length <= 1) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNextImage();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [galleryImages.length, handleNextImage, handlePrevImage]);

  const handleToggleDetails = () => {
    setIsDetailsOpen((prev) => {
      const next = !prev;
      if (next) {
        setTimeout(() => {
          if (detailsRef.current) {
            if (typeof window !== "undefined" && window.__lenis) {
              window.__lenis.resize();
              window.__lenis.scrollTo(detailsRef.current, {
                duration: 1.0,
                offset: -40,
                easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
              });
            } else if (typeof window !== "undefined") {
              detailsRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }
          }
        }, 80);
      }
      return next;
    });
  };

  const whatsappMessage =
    SERVICE_WHATSAPP_MESSAGES[service.id] ??
    `Hola Agustín, me gustaría solicitar una cotización por el servicio de ${service.title}.`;

  return (
    <div className="relative w-full min-h-screen bg-[#FFFFFF] text-[#1C1C1A] font-roboto pt-16 md:pt-20 pb-16 md:pb-36">
      {/* Contenedor Central Controlado: Cabecera, Galería Superior y Ficha Técnica Inferior */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
        className="w-full max-w-4xl lg:max-w-5xl mx-auto px-6 md:px-8"
      >
        {/* Navegación de regreso */}
        <div className="mb-2 md:mb-3">
          <Link
            href="/servicios"
            className="inline-flex items-center gap-2 font-roboto font-medium text-xs uppercase tracking-widest text-[#1C1C1A]/65 hover:text-[#099AD7] transition-colors"
          >
            <ArrowLeft size={14} strokeWidth={1.75} />
            <span>Servicios</span>
          </Link>
        </div>

        {/* Cabecera Directa y Sobria */}
        <header className="mb-4 md:mb-5">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-roboto font-medium uppercase text-[#1C1C1A] leading-tight tracking-tight max-w-4xl mb-1.5">
            {service.title}
          </h1>

          <p className="text-xs md:text-sm font-roboto font-normal text-[#1C1C1A]/85 max-w-3xl leading-relaxed">
            {service.detailDescription || service.description}
          </p>
        </header>

        {/* Galería Técnica Editorial Centrada Arriba */}
        <section
          aria-label={`Galería de ${service.title}`}
          className="flex flex-col items-center justify-center"
        >
          {/* Marco Contenedor Principal calibrado para encuadre en 100dvh sin scroll */}
          <div className="relative w-full max-w-4xl mx-auto h-[52vh] md:h-[56vh] max-h-[540px] border border-[#1C1C1A]/15 bg-white p-2 md:p-3">
            <div className="relative w-full h-full overflow-hidden bg-neutral-50/70 flex items-center justify-center select-none">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImage}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full h-full pointer-events-none"
                >
                  <Image
                    src={currentImage}
                    alt={`${service.title} — vista ${safeImageIdx + 1}`}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 896px"
                    className="object-contain p-2 md:p-3 pointer-events-none select-none"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Áreas interactivas invisibles que dividen la imagen a la mitad con cursor custom flecha */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    aria-label="Imagen anterior"
                    data-cursor="arrow-left"
                    style={{ mixBlendMode: "difference" }}
                    className="absolute inset-y-0 left-0 w-1/2 h-full z-10 bg-transparent border-0 outline-none focus:outline-none focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-acento flex items-center justify-start pl-4 md:pl-10 cursor-pointer mix-blend-difference"
                  >
                    <span className="[@media(pointer:fine)]:sr-only rotate-180 inline-flex items-center justify-center fill-white fill-[#FFFFFF]">
                      <IconlyArrowRight2 size={22} color="#FFFFFF" />
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNextImage}
                    aria-label="Imagen siguiente"
                    data-cursor="arrow-right"
                    style={{ mixBlendMode: "difference" }}
                    className="absolute inset-y-0 right-0 w-1/2 h-full z-10 bg-transparent border-0 outline-none focus:outline-none focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-acento flex items-center justify-end pr-4 md:pr-10 cursor-pointer mix-blend-difference"
                  >
                    <span className="[@media(pointer:fine)]:sr-only inline-flex items-center justify-center fill-white fill-[#FFFFFF]">
                      <IconlyArrowRight2 size={22} color="#FFFFFF" />
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Botón + limpio sin líneas ni bordes */}
        <div className="mt-4 md:mt-5 flex justify-center">
          <button
            type="button"
            onClick={handleToggleDetails}
            aria-expanded={isDetailsOpen}
            aria-label={
              isDetailsOpen
                ? "Colapsar alcance del servicio y especificaciones"
                : "Desplegar alcance del servicio y especificaciones"
            }
            className="p-1.5 text-[#1C1C1A] hover:text-[#099AD7] transition-colors cursor-pointer focus:outline-none"
          >
            <motion.div
              animate={{ rotate: isDetailsOpen ? 45 : 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-center"
            >
              <Plus size={18} strokeWidth={1.5} />
            </motion.div>
          </button>
        </div>

        {/* Dos Bloques Técnicos Desplegables en 2 Columnas */}
        <AnimatePresence>
          {isDetailsOpen && (
            <motion.div
              ref={detailsRef}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              onAnimationComplete={() => {
                if (typeof window !== "undefined") {
                  window.__lenis?.resize();
                }
              }}
              className="overflow-hidden will-change-[height,opacity]"
            >
              <section className="pt-8 pb-12 md:pb-16 grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 items-start border-b border-[#1C1C1A]/15">
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
          )}
        </AnimatePresence>
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
