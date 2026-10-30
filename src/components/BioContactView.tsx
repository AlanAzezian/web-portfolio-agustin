"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  Images,
} from "lucide-react";
import { ScrollTrigger } from "@/lib/gsap";
import { getWhatsAppLink } from "@/lib/whatsapp";
import {
  type BioSectionId,
  EDUCATION_ITEMS,
  WORK_ACCORDION_ITEMS,
  PARTICIPATION_ITEMS,
  type ParticipationItem,
  SKILL_CARDS,
} from "@/data/bio";

const BIO_ACCORDION_SECTIONS: {
  id: BioSectionId;
  orderNumber: string;
  title: string;
}[] = [
  { id: "sobre-mi", orderNumber: "01", title: "Sobre Mí" },
  { id: "experiencia", orderNumber: "02", title: "Experiencia" },
  { id: "habilidades", orderNumber: "03", title: "Habilidades" },
];

function ExclusiveBioGallery({
  images,
  onOpenLightbox,
}: {
  images: { src: string; caption: string }[];
  onOpenLightbox?: (index: number) => void;
}) {
  const [idx, setIdx] = useState(0);
  const total = images.length;

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIdx((curr) => (curr - 1 + total) % total);
  };
  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIdx((curr) => (curr + 1) % total);
  };

  const current = images[idx];

  return (
    <div className="w-full border border-[#1C1C1A]/15 bg-[#FFFFFF] p-2.5">
      <div
        role={onOpenLightbox ? "button" : undefined}
        tabIndex={onOpenLightbox ? 0 : undefined}
        onClick={() => onOpenLightbox?.(idx)}
        onKeyDown={(e) => {
          if (onOpenLightbox && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            onOpenLightbox(idx);
          }
        }}
        className="relative w-full aspect-[3/2] overflow-hidden bg-[#FFFFFF] group cursor-zoom-in"
      >
        <Image
          key={current.src}
          src={current.src}
          alt={current.caption}
          fill
          sizes="(max-width: 1024px) 100vw, 42vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Foto anterior"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#FFFFFF]/90 text-[#1C1C1A] hover:text-[#099AD7] flex items-center justify-center border border-[#1C1C1A]/15 transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Foto siguiente"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#FFFFFF]/90 text-[#1C1C1A] hover:text-[#099AD7] flex items-center justify-center border border-[#1C1C1A]/15 transition-colors cursor-pointer"
            >
              <ChevronRight size={16} strokeWidth={1.75} />
            </button>

            <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 bg-[#FFFFFF]/90 border border-[#1C1C1A]/15 text-[#1C1C1A] font-roboto font-medium text-[10px] tabular-nums tracking-wider">
              {String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </>
        )}
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-3">
        <p className="font-roboto font-normal text-xs text-[#1C1C1A]/85 leading-snug line-clamp-1">
          {current.caption}
        </p>
        {total > 1 && (
          <div className="flex items-center gap-1.5 shrink-0">
            {images.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => setIdx(dotIdx)}
                aria-label={`Ir a imagen ${dotIdx + 1}`}
                className={`w-2 h-2 transition-colors cursor-pointer ${
                  dotIdx === idx ? "bg-[#099AD7]" : "bg-[#1C1C1A]/20"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function BioContactView() {
  // Acordeón con exclusión mutua: "sobre-mi" inicia abierto por defecto
  const [activeSection, setActiveSection] = useState<string | null>("sobre-mi");
  const [profileImgError, setProfileImgError] = useState(false);
  const [openWorkId, setOpenWorkId] = useState<string | null>(null);
  const [modalParticipation, setModalParticipation] = useState<{
    item: ParticipationItem;
    initialIndex: number;
  } | null>(null);
  const [modalSlideIdx, setModalSlideIdx] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const lastClickedSectionRef = useRef<BioSectionId | null>(null);

  const handleToggleSection = (sectionId: BioSectionId) => {
    const isOpening = activeSection !== sectionId;
    lastClickedSectionRef.current = isOpening ? sectionId : null;
    setActiveSection(isOpening ? sectionId : null);
  };

  const handleSectionAnimationComplete = (sectionId: BioSectionId) => {
    if (typeof window === "undefined") return;

    window.__lenis?.resize();
    ScrollTrigger.refresh();

    if (
      lastClickedSectionRef.current === sectionId &&
      activeSection === sectionId
    ) {
      if (window.__lenis) {
        if (sectionId === "experiencia") {
          window.__lenis.scrollTo("#experiencia", {
            offset: -90,
            duration: 0.6,
          });
        } else if (sectionId === "habilidades") {
          // Al cerrarse Sobre Mí y Experiencia, alineamos al tope del contenedor
          // para que se vean los rótulos colapsados 01 y 02 junto con 03 / Habilidades completo
          window.__lenis.scrollTo("#sobre-mi", {
            offset: -80,
            duration: 0.6,
          });
        } else if (sectionId === "sobre-mi") {
          window.__lenis.scrollTo("#sobre-mi", {
            offset: -80,
            duration: 0.6,
          });
        }
      } else {
        const targetEl =
          sectionId === "experiencia"
            ? sectionRefs.current["experiencia"]
            : sectionRefs.current["sobre-mi"];
        targetEl?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      lastClickedSectionRef.current = null;
    }
  };

  const toggleWorkItem = (id: string) => {
    setOpenWorkId((prev) => (prev === id ? null : id));
  };

  const openModalGallery = (item: ParticipationItem, index = 0) => {
    setModalParticipation({ item, initialIndex: index });
    setModalSlideIdx(index);
  };

  const modalTotal = modalParticipation?.item.gallery?.length ?? 0;

  const nextModalSlide = useCallback(() => {
    if (modalTotal === 0) return;
    setModalSlideIdx((prev) => (prev + 1) % modalTotal);
  }, [modalTotal]);

  const prevModalSlide = useCallback(() => {
    if (modalTotal === 0) return;
    setModalSlideIdx((prev) => (prev - 1 + modalTotal) % modalTotal);
  }, [modalTotal]);

  // Navegación por teclado (← / →, Barra Espaciadora y Escape) + bloqueo de scroll de fondo
  useEffect(() => {
    if (!modalParticipation) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (typeof window !== "undefined" && window.__lenis) {
      window.__lenis.stop();
    }

    modalParticipation.item.gallery?.forEach((imgObj) => {
      const img = new window.Image();
      img.src = imgObj.src;
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setModalParticipation(null);
      } else if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        nextModalSlide();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevModalSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
      if (typeof window !== "undefined" && window.__lenis) {
        window.__lenis.start();
      }
    };
  }, [modalParticipation, nextModalSlide, prevModalSlide]);

  const handleModalTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleModalTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 45) {
      nextModalSlide();
    } else if (diff < -45) {
      prevModalSlide();
    }
    setTouchStartX(null);
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
          {BIO_ACCORDION_SECTIONS.map((section) => {
            const isOpen = activeSection === section.id;

            return (
              <div
                key={section.id}
                id={section.id}
                ref={(el) => {
                  sectionRefs.current[section.id] = el;
                }}
                className="border-b border-[#1C1C1A]/15 bg-[#FFFFFF] scroll-mt-24"
              >
                <button
                  type="button"
                  onClick={() => handleToggleSection(section.id)}
                  aria-expanded={isOpen}
                  className="w-full py-4 md:py-5 flex items-center justify-between gap-4 focus:outline-none group text-left cursor-pointer shrink-0"
                >
                  <div className="flex items-baseline gap-4 md:gap-8">
                    <span className="font-roboto font-medium text-xs md:text-sm text-[#1C1C1A]/50 w-6 md:w-7 shrink-0 tabular-nums tracking-wider">
                      {section.orderNumber}
                    </span>
                    <h2 className="font-roboto font-medium text-lg md:text-xl text-[#1C1C1A] group-hover:text-[#099AD7] transition-colors">
                      {section.title}
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
                        handleSectionAnimationComplete(section.id)
                      }
                      className="overflow-hidden"
                    >
                      <div className="pb-8 pt-2 pl-0 sm:pl-10 md:pl-15 max-w-4xl mx-auto w-full">
                        {/* =====================================================
                            01 / SOBRE MÍ
                        ===================================================== */}
                        {section.id === "sobre-mi" && (
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-start">
                            {/* Columna Izquierda: Retrato + Contacto */}
                            <div className="md:col-span-5 lg:col-span-4 w-full flex flex-col gap-3">
                              <div className="border border-[#1C1C1A]/15 bg-[#FFFFFF] p-2.5">
                                <div className="relative w-full aspect-[4/5] max-h-[380px] overflow-hidden bg-[#FFFFFF] flex items-center justify-center">
                                  {!profileImgError ? (
                                    <Image
                                      src="/agustin-perfil.webp"
                                      alt="Agustín Fabrizio — Retrato"
                                      fill
                                      sizes="(max-width: 768px) 100vw, 320px"
                                      className="object-cover"
                                      onError={() => setProfileImgError(true)}
                                    />
                                  ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center select-none border border-dashed border-[#1C1C1A]/15 bg-[#FFFFFF]">
                                      <span className="font-roboto font-medium text-2xl tracking-tight text-[#1C1C1A]/35 mb-2">
                                        AF
                                      </span>
                                      <span className="font-roboto font-medium text-[11px] uppercase tracking-wider text-[#1C1C1A]/55">
                                        Retrato Editorial
                                      </span>
                                      <span className="font-roboto font-normal text-[10px] tracking-wider text-[#1C1C1A]/45 mt-1">
                                        /public/agustin-perfil.webp
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {/* Fila de Links y Contacto directamente debajo de la foto */}
                                <div className="mt-2.5 pt-2.5 border-t border-[#1C1C1A]/10 grid grid-cols-2 gap-2">
                                  <a
                                    href="https://www.behance.net/agustinfabrizio"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-between px-2.5 py-1.5 border border-[#1C1C1A]/15 text-[11px] font-roboto font-medium uppercase tracking-wider text-[#1C1C1A] hover:border-[#099AD7] hover:text-[#099AD7] transition-colors"
                                  >
                                    <span>Behance</span>
                                    <ArrowUpRight size={12} strokeWidth={1.75} />
                                  </a>
                                  <a
                                    href="https://www.linkedin.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-between px-2.5 py-1.5 border border-[#1C1C1A]/15 text-[11px] font-roboto font-medium uppercase tracking-wider text-[#1C1C1A] hover:border-[#099AD7] hover:text-[#099AD7] transition-colors"
                                  >
                                    <span>LinkedIn</span>
                                    <ArrowUpRight size={12} strokeWidth={1.75} />
                                  </a>
                                  <a
                                    href={getWhatsAppLink(
                                      "Hola Agustín, vi tu portfolio y me gustaría ponerme en contacto contigo."
                                    )}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-between px-2.5 py-1.5 border border-[#1C1C1A]/15 text-[11px] font-roboto font-medium uppercase tracking-wider text-[#1C1C1A] hover:border-[#099AD7] hover:text-[#099AD7] transition-colors"
                                  >
                                    <span>WhatsApp</span>
                                    <ArrowUpRight size={12} strokeWidth={1.75} />
                                  </a>
                                  <a
                                    href="mailto:hola@agustinfabrizio.com"
                                    className="inline-flex items-center justify-between px-2.5 py-1.5 border border-[#1C1C1A]/15 text-[11px] font-roboto font-medium uppercase tracking-wider text-[#1C1C1A] hover:border-[#099AD7] hover:text-[#099AD7] transition-colors"
                                  >
                                    <span>Email</span>
                                    <ArrowUpRight size={12} strokeWidth={1.75} />
                                  </a>
                                </div>
                              </div>
                            </div>

                            {/* Columna Derecha: Manifiesto textual + Educación y Certificación BIM */}
                            <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-between gap-7 w-full">
                              <blockquote className="w-full text-sm md:text-base font-roboto font-normal leading-relaxed text-[#1C1C1A]/85 border-l-2 border-[#099AD7] pl-5 md:pl-6 py-1">
                                &ldquo;Disfruto del proceso creativo compartido, de escuchar, ser escuchado y{" "}
                                <strong className="font-medium text-[#099AD7]">
                                  construir ideas en conjunto
                                </strong>
                                . Me interesa proyectar una arquitectura conectada con{" "}
                                <strong className="font-medium text-[#099AD7]">
                                  lo cotidiano
                                </strong>
                                , enfocada en resolver necesidades reales, sin dejar de aprovechar los espacios lúdicos como instancias para{" "}
                                <strong className="font-medium text-[#099AD7]">
                                  explorar otras formas
                                </strong>{" "}
                                de habitar y pensar el diseño. Me considero metódico y técnico en el uso de{" "}
                                <strong className="font-medium text-[#099AD7]">
                                  herramientas digitales
                                </strong>
                                , lo que me permite integrar con fluidez el diseño, la representación y la producción. Me motiva{" "}
                                <strong className="font-medium text-[#099AD7]">
                                  aprender
                                </strong>{" "}
                                constantemente, tanto desde lo teórico como desde lo práctico, incorporando recursos que optimicen y agilicen mis procesos proyectuales.&rdquo;
                              </blockquote>

                              {/* Bloque Educación */}
                              <div className="w-full border-t border-[#1C1C1A]/15 pt-5">
                                <span className="font-roboto font-medium text-xs uppercase tracking-wider text-[#099AD7] block mb-3">
                                  EDUCACIÓN & CERTIFICACIONES
                                </span>

                                <div className="flex flex-col divide-y divide-[#1C1C1A]/10 border-t border-b border-[#1C1C1A]/10">
                                  {EDUCATION_ITEMS.map((edu) => (
                                    <div
                                      key={edu.id}
                                      className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                                    >
                                      <div>
                                        <h3 className="font-roboto font-medium text-sm md:text-base text-[#1C1C1A]">
                                          {edu.institution}
                                        </h3>
                                        <p className="font-roboto font-normal text-xs md:text-sm text-[#1C1C1A]/80 leading-relaxed">
                                          {edu.detail}
                                        </p>
                                      </div>

                                      {edu.certificateUrl && (
                                        <a
                                          href={edu.certificateUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#1C1C1A]/20 hover:border-[#099AD7] text-xs font-roboto font-medium uppercase tracking-wider text-[#1C1C1A] hover:text-[#099AD7] transition-colors self-start sm:self-auto shrink-0 group"
                                        >
                                          <span>Ver Certificado</span>
                                          <ArrowUpRight
                                            size={13}
                                            strokeWidth={1.75}
                                            className="text-[#099AD7] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                          />
                                        </a>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* =====================================================
                            02 / EXPERIENCIA (Trayectoria Laboral + Concursos)
                        ===================================================== */}
                        {section.id === "experiencia" && (
                          <div className="flex flex-col gap-10">
                            {/* SUBDIVISIÓN 1: Trayectoria laboral */}
                            <div>
                              <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                                <div className="flex items-center gap-3">
                                  <h3 className="font-roboto font-medium text-xs md:text-sm uppercase tracking-wider text-[#099AD7]">
                                    Trayectoria laboral
                                  </h3>
                                  <span className="w-6 h-[1px] bg-[#1C1C1A]/15" />
                                  <span className="font-roboto font-medium text-[11px] uppercase tracking-wider text-[#1C1C1A]/55">
                                    ESTUDIOS & PRÁCTICA PROFESIONAL
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-col border-t border-[#1C1C1A]/15">
                                {WORK_ACCORDION_ITEMS.map((item) => {
                                  const isWorkOpen = openWorkId === item.id;
                                  return (
                                    <div
                                      key={item.id}
                                      className="border-b border-[#1C1C1A]/15 bg-[#FFFFFF]"
                                    >
                                      <button
                                        type="button"
                                        onClick={() => toggleWorkItem(item.id)}
                                        aria-expanded={isWorkOpen}
                                        className="w-full py-3.5 md:py-4 flex items-center justify-between gap-4 text-left focus:outline-none group cursor-pointer"
                                      >
                                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-5">
                                          <span className="font-roboto font-medium text-xs text-[#1C1C1A]/50 tabular-nums tracking-wider shrink-0">
                                            {item.orderNumber}
                                          </span>
                                          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                                            <span className="font-roboto font-medium text-base md:text-lg text-[#1C1C1A] group-hover:text-[#099AD7] transition-colors">
                                              {item.role} — {item.company}
                                            </span>
                                            <span className="font-roboto font-medium text-xs uppercase tracking-wider text-[#099AD7] tabular-nums">
                                              [{item.period}]
                                            </span>
                                          </div>
                                        </div>

                                        <div className="text-[#099AD7] flex items-center justify-center shrink-0">
                                          {isWorkOpen ? (
                                            <Minus size={16} strokeWidth={1.75} />
                                          ) : (
                                            <Plus size={16} strokeWidth={1.75} />
                                          )}
                                        </div>
                                      </button>

                                      <AnimatePresence initial={false}>
                                        {isWorkOpen && (
                                          <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{
                                              duration: 0.35,
                                              ease: [0.16, 1, 0.3, 1],
                                            }}
                                            onAnimationComplete={() => {
                                              if (typeof window !== "undefined") {
                                                window.__lenis?.resize();
                                                ScrollTrigger.refresh();
                                              }
                                            }}
                                            className="overflow-hidden"
                                          >
                                            <div className="pb-6 pt-1 sm:pl-9 max-w-3xl">
                                              <span className="font-roboto font-medium text-[11px] uppercase tracking-wider text-[#1C1C1A]/55 block mb-2.5">
                                                Responsabilidades & Alcance Técnico
                                              </span>
                                              <ul className="flex flex-col gap-2.5">
                                                {item.tasks.map((task, idx) => (
                                                  <li
                                                    key={idx}
                                                    className="flex items-start gap-3 font-roboto font-normal text-sm md:text-base text-[#1C1C1A]/85 leading-relaxed"
                                                  >
                                                    <span className="w-1.5 h-1.5 bg-[#099AD7] mt-2 shrink-0" />
                                                    <span>{task}</span>
                                                  </li>
                                                ))}
                                              </ul>
                                            </div>
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* SUBDIVISIÓN 2: Concursos, montajes y distinciones */}
                            <div>
                              <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                                <div className="flex items-center gap-3">
                                  <h3 className="font-roboto font-medium text-xs md:text-sm uppercase tracking-wider text-[#099AD7]">
                                    Concursos, montajes y distinciones
                                  </h3>
                                  <span className="w-6 h-[1px] bg-[#1C1C1A]/15" />
                                  <span className="font-roboto font-medium text-[11px] uppercase tracking-wider text-[#1C1C1A]/55">
                                    PREMIOS & PARTICIPACIONES
                                  </span>
                                </div>

                                <Link
                                  href="/proyectos"
                                  className="inline-flex items-center gap-1.5 font-roboto font-medium text-xs uppercase tracking-wider text-[#1C1C1A] hover:text-[#099AD7] transition-colors"
                                >
                                  <span>Ver archivo de obras</span>
                                  <ArrowUpRight
                                    size={14}
                                    strokeWidth={1.75}
                                    className="text-[#099AD7]"
                                  />
                                </Link>
                              </div>

                              <div className="flex flex-col divide-y divide-[#1C1C1A]/15 border-t border-b border-[#1C1C1A]/15">
                                {PARTICIPATION_ITEMS.map((item) => {
                                  const projectHref =
                                    item.link ??
                                    (item.projectId ? `/proyectos/${item.projectId}` : null);
                                  const hasExclusiveGallery =
                                    !projectHref && item.gallery && item.gallery.length > 0;

                                  return (
                                    <article key={item.id} className="py-6 md:py-7">
                                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
                                        {/* Columna de Metadatos y Acción */}
                                        <div className="md:col-span-7 flex flex-col justify-center">
                                          <div className="font-roboto font-medium text-xs tracking-wider uppercase mb-1.5 flex items-center gap-2">
                                            <span className="text-[#099AD7] tabular-nums">
                                              {item.year}
                                            </span>
                                            <span className="text-[#1C1C1A]/35">—</span>
                                            <span className="text-[#1C1C1A]/65">
                                              {item.category}
                                            </span>
                                          </div>

                                          {projectHref ? (
                                            <Link
                                              href={projectHref}
                                              className="group inline-flex items-baseline gap-2 text-lg md:text-xl font-roboto font-medium text-[#1C1C1A] hover:text-[#099AD7] tracking-tight mb-2 transition-colors w-fit"
                                            >
                                              <span>{item.title}</span>
                                              <ArrowUpRight
                                                size={15}
                                                strokeWidth={1.75}
                                                className="text-[#099AD7] shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                              />
                                            </Link>
                                          ) : hasExclusiveGallery ? (
                                            <button
                                              type="button"
                                              onClick={() => openModalGallery(item, 0)}
                                              className="group inline-flex items-baseline gap-2 text-left text-lg md:text-xl font-roboto font-medium text-[#1C1C1A] hover:text-[#099AD7] tracking-tight mb-2 transition-colors cursor-pointer w-fit"
                                            >
                                              <span>{item.title}</span>
                                              <Images
                                                size={15}
                                                strokeWidth={1.75}
                                                className="text-[#099AD7] shrink-0"
                                              />
                                            </button>
                                          ) : (
                                            <h4 className="text-lg md:text-xl font-roboto font-medium text-[#1C1C1A] tracking-tight mb-2">
                                              {item.title}
                                            </h4>
                                          )}

                                          <p className="text-sm md:text-base font-roboto font-normal text-[#1C1C1A]/85 leading-relaxed mb-3.5">
                                            {item.description}
                                          </p>

                                          {projectHref ? (
                                            <Link
                                              href={projectHref}
                                              className="inline-flex items-center gap-1.5 font-roboto font-medium text-xs uppercase tracking-wider text-[#099AD7] hover:text-[#1C1C1A] transition-colors w-fit group"
                                            >
                                              <span>Ver proyecto completo</span>
                                              <ArrowUpRight
                                                size={14}
                                                strokeWidth={1.75}
                                                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                              />
                                            </Link>
                                          ) : hasExclusiveGallery ? (
                                            <button
                                              type="button"
                                              onClick={() => openModalGallery(item, 0)}
                                              className="inline-flex items-center gap-1.5 font-roboto font-medium text-xs uppercase tracking-wider text-[#099AD7] hover:text-[#1C1C1A] transition-colors cursor-pointer w-fit"
                                            >
                                              <Images size={14} strokeWidth={1.75} />
                                              <span>
                                                Ver galería ({item.gallery!.length} fotos)
                                              </span>
                                            </button>
                                          ) : null}
                                        </div>

                                        {/* Columna Derecha: Imagen / Galería */}
                                        <div className="md:col-span-5 w-full">
                                          {projectHref ? (
                                            <Link
                                              href={projectHref}
                                              className="block border border-[#1C1C1A]/15 bg-[#FFFFFF] p-2.5 group hover:border-[#099AD7] transition-colors"
                                            >
                                              <div className="relative w-full aspect-[3/2] overflow-hidden bg-[#FFFFFF]">
                                                <Image
                                                  src={item.image}
                                                  alt={item.imageCaption}
                                                  fill
                                                  sizes="(max-width: 768px) 100vw, 320px"
                                                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                                />
                                              </div>
                                              <div className="mt-2 flex items-center justify-between text-xs font-roboto font-normal text-[#1C1C1A]/85 group-hover:text-[#099AD7] transition-colors">
                                                <span className="truncate">
                                                  {item.imageCaption}
                                                </span>
                                                <ArrowUpRight size={14} className="shrink-0" />
                                              </div>
                                            </Link>
                                          ) : hasExclusiveGallery ? (
                                            <ExclusiveBioGallery
                                              images={item.gallery!}
                                              onOpenLightbox={(idx) =>
                                                openModalGallery(item, idx)
                                              }
                                            />
                                          ) : (
                                            <div className="border border-[#1C1C1A]/15 bg-[#FFFFFF] p-2.5">
                                              <div className="relative w-full aspect-[3/2] overflow-hidden bg-[#FFFFFF]">
                                                <Image
                                                  src={item.image}
                                                  alt={item.imageCaption}
                                                  fill
                                                  sizes="(max-width: 768px) 100vw, 320px"
                                                  className="object-cover"
                                                />
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </article>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* =====================================================
                            03 / HABILIDADES
                        ===================================================== */}
                        {section.id === "habilidades" && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                            {SKILL_CARDS.map((card) => (
                              <div
                                key={card.title}
                                className="border border-[#1C1C1A]/15 p-6 bg-[#FFFFFF] flex flex-col"
                              >
                                <h3 className="text-base md:text-lg font-roboto font-medium tracking-wider text-[#099AD7] mb-4 pb-2.5 border-b border-[#1C1C1A]/10">
                                  {card.title}
                                </h3>

                                <ul className="flex flex-col gap-2.5">
                                  {card.items.map((item) => (
                                    <li
                                      key={item}
                                      className="flex items-center gap-3 font-roboto font-normal text-sm md:text-base text-[#1C1C1A]/85 leading-relaxed"
                                    >
                                      <span className="w-1.5 h-1.5 bg-[#099AD7] shrink-0" />
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* =====================================================================
          PIE DE CONTACTO DIRECTO ABAJO A LA IZQUIERDA: Trabajemos juntos
      ===================================================================== */}
      <footer className="w-full mt-12 pt-8 border-t border-[#1C1C1A]/15 flex flex-col items-start text-left shrink-0">
        <h2 className="font-roboto text-lg md:text-xl font-medium text-[#1C1C1A] tracking-tight">
          Trabajemos juntos
        </h2>
        <a
          href={getWhatsAppLink(
            "Hola Agustín, vi tu portfolio y me gustaría ponerme en contacto contigo para una propuesta de trabajo/proyecto."
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

      {/* =====================================================================
          MODAL EXCLUSIVO PARA PARTICIPACIONES INDEPENDIENTES (LAYOUT PROJECTVIEWER)
      ===================================================================== */}
      <AnimatePresence>
        {modalParticipation && modalParticipation.item.gallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onTouchStart={handleModalTouchStart}
            onTouchEnd={handleModalTouchEnd}
            className="fixed inset-0 z-[60] bg-[#FFFFFF] text-[#1C1C1A] select-none overflow-hidden flex flex-col justify-between"
          >
            {/* Vértice Superior Derecho: Volver a Bio */}
            <button
              type="button"
              onClick={() => setModalParticipation(null)}
              className="fixed top-6 md:top-8 right-6 md:right-16 z-50 font-roboto font-medium font-[500] text-xs md:text-sm tracking-tight text-[#1C1C1A] hover:text-[#099AD7] transition-colors duration-200 flex items-center gap-1.5 cursor-pointer pointer-events-auto focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-acento"
            >
              <ArrowLeft size={14} strokeWidth={1.5} /> Volver
            </button>

            {/* Visor Central de Imagen con transición fade de 200ms y mitades clicables */}
            <div className="relative w-full h-full flex items-center justify-center px-4 md:px-16 py-10 md:py-14 my-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={modalParticipation.item.gallery[modalSlideIdx].src}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative w-full h-[78vh] md:h-[82vh] max-h-[82vh] flex items-center justify-center pointer-events-none"
                >
                  <Image
                    src={modalParticipation.item.gallery[modalSlideIdx].src}
                    alt={modalParticipation.item.gallery[modalSlideIdx].caption}
                    fill
                    sizes="100vw"
                    priority
                    className="h-[78vh] md:h-[82vh] w-auto max-w-full object-contain mx-auto pointer-events-none select-none shadow-none"
                  />
                </motion.div>
              </AnimatePresence>

              {modalParticipation.item.gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevModalSlide}
                    aria-label="Imagen anterior"
                    data-cursor="arrow-left"
                    className="absolute inset-y-0 left-0 w-1/2 h-full z-10 bg-transparent border-0 outline-none focus:outline-none focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-acento"
                  />
                  <button
                    type="button"
                    onClick={nextModalSlide}
                    aria-label="Imagen siguiente"
                    data-cursor="arrow-right"
                    className="absolute inset-y-0 right-0 w-1/2 h-full z-10 bg-transparent border-0 outline-none focus:outline-none focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-acento"
                  />
                </>
              )}
            </div>

            {/* Vértice Inferior Izquierdo: Título de la participación + Caption técnico */}
            <div className="fixed bottom-6 md:bottom-8 left-6 md:left-16 z-30 pointer-events-auto flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 pr-24">
              <span className="font-roboto text-sm md:text-base font-medium text-[#1C1C1A] select-none">
                {modalParticipation.item.title}
              </span>
              <span className="font-roboto text-xs font-normal text-[#1C1C1A]/65 select-none">
                {modalParticipation.item.gallery[modalSlideIdx].caption}
              </span>
            </div>

            {/* Vértice Inferior Derecho: Contador dinámico 01 / 03 */}
            <div className="fixed bottom-6 md:bottom-8 right-6 md:right-16 z-30 pointer-events-auto">
              <span className="font-roboto font-medium tabular-nums tracking-wider text-[13px] text-[#1C1C1A] select-none">
                {String(modalSlideIdx + 1).padStart(2, "0")} /{" "}
                {String(modalParticipation.item.gallery.length).padStart(2, "0")}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
