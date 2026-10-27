"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  Images,
  X,
} from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { getWhatsAppLink } from "@/lib/whatsapp";
import {
  BIO_SECTIONS,
  type BioSectionId,
  EDUCATION_ITEMS,
  WORK_ACCORDION_ITEMS,
  PARTICIPATION_ITEMS,
  type ParticipationItem,
  SKILL_CARDS,
} from "@/data/bio";

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
    <div className="w-full">
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
        className="relative w-full aspect-[16/10] overflow-hidden border border-[#1C1C1A]/15 bg-[#FFFFFF] group cursor-zoom-in"
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
              className="absolute left-2.5 top-1/2 -translate-y-1/2 border border-[#1C1C1A]/20 bg-[#FFFFFF]/95 p-1 text-[#1C1C1A] hover:border-[#099AD7] hover:text-[#099AD7] flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Foto siguiente"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 border border-[#1C1C1A]/20 bg-[#FFFFFF]/95 p-1 text-[#1C1C1A] hover:border-[#099AD7] hover:text-[#099AD7] flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronRight size={16} strokeWidth={1.75} />
            </button>

            <span className="absolute top-0 right-0 border-b border-l border-[#1C1C1A]/15 bg-[#FFFFFF] px-2 py-0.5 text-[10px] font-mono tabular-nums text-[#1C1C1A]/80 tracking-wider">
              {String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </>
        )}
      </div>

      <p className="text-[11px] font-mono text-[#1C1C1A]/50 mt-1.5 truncate">
        {current.caption}
      </p>
    </div>
  );
}

export default function BioContactView() {
  const [activeSection, setActiveSection] = useState<BioSectionId>("sobre-mi");
  const [profileImgError, setProfileImgError] = useState(false);
  const [openWorkId, setOpenWorkId] = useState<string | null>(null);
  const [modalParticipation, setModalParticipation] = useState<{
    item: ParticipationItem;
    initialIndex: number;
  } | null>(null);
  const [modalSlideIdx, setModalSlideIdx] = useState(0);

  const bottomNavRef = useRef<HTMLElement>(null);
  const navBtnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleScrollToSection = (sectionId: BioSectionId) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (!el) return;

    if (typeof window !== "undefined" && window.__lenis) {
      window.__lenis.scrollTo(`#${sectionId}`, {
        duration: 1.2,
        offset: -80,
      });
    } else {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // ScrollSpy sincronizado con GSAP ScrollTrigger e IntersectionObserver
  useEffect(() => {
    const triggers: ScrollTrigger[] = [];

    BIO_SECTIONS.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (!el) return;

      const st = ScrollTrigger.create({
        trigger: el,
        start: "top 40%",
        end: "bottom 40%",
        onEnter: () => setActiveSection(sec.id),
        onEnterBack: () => setActiveSection(sec.id),
      });
      triggers.push(st);
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, []);

  // Animación elástica GSAP en los 3 atajos inferiores (Izquierda, Centro, Derecha)
  useEffect(() => {
    if (!bottomNavRef.current) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      BIO_SECTIONS.forEach((sec, idx) => {
        const el = navBtnRefs.current[idx];
        if (!el) return;
        const isActive = activeSection === sec.id;

        gsap.to(el, {
          scale: isActive ? 1.2 : 1,
          duration: prefersReducedMotion ? 0 : isActive ? 0.45 : 0.25,
          ease: isActive ? "back.out(1.6)" : "power2.out",
          overwrite: "auto",
        });
      });
    }, bottomNavRef);

    return () => ctx.revert();
  }, [activeSection]);

  const toggleWorkItem = (id: string) => {
    setOpenWorkId((prev) => (prev === id ? null : id));
  };

  const openModalGallery = (item: ParticipationItem, index = 0) => {
    setModalParticipation({ item, initialIndex: index });
    setModalSlideIdx(index);
  };

  return (
    <div className="w-full bg-[#FFFFFF] text-[#1C1C1A] font-roboto pb-20">
      {/* =====================================================================
          BLOQUE 01: SOBRE MÍ (Layout Full-Width estilo Oficina Correa)
      ===================================================================== */}
      <section
        id="sobre-mi"
        className="scroll-mt-24 w-full px-6 md:px-12 lg:px-16 pt-1 pb-10 md:pt-2 md:pb-14 border-b border-[#1C1C1A]/15"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <h1 className="font-roboto text-base md:text-xl font-medium tracking-wider text-[#099AD7] uppercase">
              01 / SOBRE MÍ
            </h1>
          </div>

          {/* Distribución balanceada a ancho completo: Izquierda Retrato + Contacto / Derecha Bio + Educación */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 xl:gap-16 items-start">
            {/* Columna Izquierda: Foto de Agustín + Fila de Links y Contacto debajo */}
            <div className="lg:col-span-4 xl:col-span-3 w-full flex flex-col gap-3">
              <div className="border border-[#1C1C1A]/15 bg-[#FFFFFF] p-2.5">
                <div className="relative w-full aspect-[4/5] max-h-[420px] overflow-hidden bg-[#FFFFFF] flex items-center justify-center">
                  {!profileImgError ? (
                    <Image
                      src="/agustin-perfil.webp"
                      alt="Agustín Fabrizio — Retrato"
                      fill
                      sizes="(max-width: 1024px) 100vw, 28vw"
                      className="object-cover"
                      onError={() => setProfileImgError(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center select-none border border-dashed border-[#1C1C1A]/15 bg-[#FFFFFF]">
                      <span className="font-roboto font-light text-3xl tracking-tight text-[#1C1C1A]/25 mb-2">
                        AF
                      </span>
                      <span className="font-roboto text-[11px] uppercase tracking-widest text-[#1C1C1A]/45">
                        Retrato Editorial
                      </span>
                      <span className="font-roboto text-[10px] tracking-wider text-[#1C1C1A]/35 mt-1">
                        /public/agustin-perfil.webp
                      </span>
                    </div>
                  )}
                </div>

                {/* Fila de Links y Contacto directamente debajo de la foto */}
                <div className="mt-2.5 pt-2.5 border-t border-[#1C1C1A]/10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2">
                  <a
                    href="https://www.behance.net/agustinfabrizio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between px-2.5 py-1.5 border border-[#1C1C1A]/15 text-[11px] font-roboto uppercase tracking-wider text-[#1C1C1A] hover:border-[#099AD7] hover:text-[#099AD7] transition-colors"
                  >
                    <span>Behance</span>
                    <ArrowUpRight size={12} strokeWidth={1.75} />
                  </a>
                  <a
                    href="https://www.linkedin.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between px-2.5 py-1.5 border border-[#1C1C1A]/15 text-[11px] font-roboto uppercase tracking-wider text-[#1C1C1A] hover:border-[#099AD7] hover:text-[#099AD7] transition-colors"
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
                    className="inline-flex items-center justify-between px-2.5 py-1.5 border border-[#1C1C1A]/15 text-[11px] font-roboto uppercase tracking-wider text-[#1C1C1A] hover:border-[#099AD7] hover:text-[#099AD7] transition-colors"
                  >
                    <span>WhatsApp</span>
                    <ArrowUpRight size={12} strokeWidth={1.75} />
                  </a>
                  <a
                    href="mailto:hola@agustinfabrizio.com"
                    className="inline-flex items-center justify-between px-2.5 py-1.5 border border-[#1C1C1A]/15 text-[11px] font-roboto uppercase tracking-wider text-[#1C1C1A] hover:border-[#099AD7] hover:text-[#099AD7] transition-colors"
                  >
                    <span>Email</span>
                    <ArrowUpRight size={12} strokeWidth={1.75} />
                  </a>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Manifiesto textual a ancho completo + Educación y Certificación BIM */}
            <div className="lg:col-span-8 xl:col-span-9 flex flex-col justify-between gap-8 w-full">
              <blockquote className="w-full text-base sm:text-lg md:text-xl xl:text-[22px] font-roboto font-light leading-relaxed text-[#1C1C1A] border-l-2 border-[#099AD7] pl-5 md:pl-8 py-1">
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

              {/* Bloque Educación (FADU UBA + Certificado BIM Modeler Miller & Co) */}
              <div className="w-full border-t border-[#1C1C1A]/15 pt-6">
                <span className="font-roboto text-xs uppercase tracking-widest text-[#099AD7] font-medium block mb-3">
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
                        <p className="font-roboto text-xs md:text-sm text-[#1C1C1A]/65">
                          {edu.detail}
                        </p>
                      </div>

                      {edu.certificateUrl && (
                        <a
                          href={edu.certificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#1C1C1A]/20 hover:border-[#099AD7] text-xs font-roboto uppercase tracking-widest text-[#1C1C1A] hover:text-[#099AD7] transition-colors self-start sm:self-auto shrink-0 group"
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
        </motion.div>
      </section>

      {/* =====================================================================
          BLOQUE 02: EXPERIENCIA (Acordeón Laboral + Participaciones con Lógica Dual)
      ===================================================================== */}
      <section
        id="experiencia"
        className="scroll-mt-24 w-full px-6 md:px-12 lg:px-16 py-12 md:py-16 border-b border-[#1C1C1A]/15"
      >
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8 md:mb-12">
          <h2 className="font-roboto text-base md:text-xl font-medium tracking-wider text-[#099AD7] uppercase">
            02 / EXPERIENCIA
          </h2>
          <Link
            href="/proyectos"
            className="inline-flex items-center gap-2 font-roboto text-xs uppercase tracking-widest text-[#1C1C1A] hover:text-[#099AD7] transition-colors"
          >
            <span>Ver archivo de obras</span>
            <ArrowUpRight size={15} strokeWidth={1.75} className="text-[#099AD7]" />
          </Link>
        </div>

        {/* SUBDIVISIÓN 1: Trayectoria laboral en Acordeón Interactivo */}
        <div className="mb-14 md:mb-18">
          <div className="flex items-center gap-3 mb-5">
            <h3 className="font-roboto text-sm md:text-base uppercase tracking-widest text-[#099AD7] font-semibold">
              Trayectoria laboral
            </h3>
            <span className="w-8 h-[1px] bg-[#1C1C1A]/15" />
            <span className="font-roboto text-xs uppercase tracking-widest text-[#1C1C1A]/50">
              ESTUDIOS & PRÁCTICA PROFESIONAL
            </span>
          </div>

          <div className="flex flex-col border-t border-[#1C1C1A]/15">
            {WORK_ACCORDION_ITEMS.map((item) => {
              const isOpen = openWorkId === item.id;
              return (
                <div
                  key={item.id}
                  className="border-b border-[#1C1C1A]/15 bg-[#FFFFFF]"
                >
                  <button
                    type="button"
                    onClick={() => toggleWorkItem(item.id)}
                    aria-expanded={isOpen}
                    className="w-full py-4 md:py-5 grid grid-cols-12 items-baseline gap-2 md:gap-4 text-left focus:outline-none group cursor-pointer"
                  >
                    <span className="col-span-2 md:col-span-1 text-xs md:text-sm font-mono tabular-nums text-[#1C1C1A]/40">
                      {item.orderNumber}
                    </span>

                    <div className="col-span-9 md:col-span-10 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                        <span className="text-sm md:text-base font-medium text-[#1C1C1A] group-hover:text-[#099AD7] transition-colors">
                          {item.role}
                        </span>
                        <span className="text-xs md:text-sm text-[#1C1C1A]/50">
                          — {item.company}
                        </span>
                      </div>
                      <span className="text-xs font-mono tabular-nums text-[#099AD7] uppercase tracking-wider">
                        [{item.period}]
                      </span>
                    </div>

                    <div className="col-span-1 text-[#099AD7] flex items-center justify-end self-center">
                      {isOpen ? (
                        <Minus size={16} strokeWidth={1.75} />
                      ) : (
                        <Plus size={16} strokeWidth={1.75} />
                      )}
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-6 pb-6 pl-0 md:pl-[calc(8.333%)] border-t border-[#1C1C1A]/10">
                          {/* Columna Izquierda (Cols 1 a 7 - Núcleo Operativo) */}
                          <div className="md:col-span-7">
                            <span className="block text-[11px] font-mono tracking-widest text-[#1C1C1A]/40 uppercase mb-3">
                              RESPONSABILIDADES & ALCANCE TÉCNICO
                            </span>
                            <ul className="flex flex-col gap-2.5">
                              {item.tasks.map((task, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-3 text-xs md:text-sm text-[#1C1C1A]/80 font-light leading-relaxed"
                                >
                                  <span className="w-1.5 h-1.5 bg-[#099AD7] shrink-0 mt-1.5" />
                                  <span>{task}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Columna Derecha (Cols 8 a 12 - Ficha de Entorno) */}
                          <div className="md:col-span-5 border-t md:border-t-0 md:border-l border-[#1C1C1A]/10 pt-4 md:pt-0 md:pl-6 space-y-4">
                            {item.tools && item.tools.length > 0 && (
                              <div>
                                <span className="block text-[11px] font-mono tracking-widest text-[#1C1C1A]/40 uppercase mb-2">
                                  ENTORNO OPERATIVO & SOFTWARE
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {item.tools.map((tool) => (
                                    <span
                                      key={tool}
                                      className="border border-[#1C1C1A]/15 px-2 py-0.5 text-[11px] font-mono text-[#1C1C1A]/70 uppercase tracking-wider"
                                    >
                                      {tool}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {item.typology && (
                              <div>
                                <span className="block text-[11px] font-mono tracking-widest text-[#1C1C1A]/40 uppercase mb-1">
                                  TIPOLOGÍA DE INTERVENCIÓN
                                </span>
                                <p className="text-xs text-[#1C1C1A]/70 font-light leading-relaxed">
                                  {item.typology}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* SUBDIVISIÓN 2: Concursos, montajes y distinciones (Lógica Dual Unificada al Lightbox/Proyecto) */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <h3 className="font-roboto text-sm md:text-base uppercase tracking-widest text-[#099AD7] font-semibold">
              Concursos, montajes y distinciones
            </h3>
            <span className="w-8 h-[1px] bg-[#1C1C1A]/15" />
            <span className="font-roboto text-xs uppercase tracking-widest text-[#1C1C1A]/50">
              PREMIOS & PARTICIPACIONES
            </span>
          </div>

          <div className="flex flex-col divide-y divide-[#1C1C1A]/15 border-t border-b border-[#1C1C1A]/15">
            {PARTICIPATION_ITEMS.map((item) => {
              const projectHref =
                item.link ??
                (item.projectId ? `/proyectos/${item.projectId}` : null);
              const hasExclusiveGallery =
                !projectHref && item.gallery && item.gallery.length > 0;

              return (
                <article key={item.id} className="py-7 md:py-9">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-12 items-center">
                    {/* Columna de Texto (Cols 1 a 7) */}
                    <div className="lg:col-span-7 flex flex-col justify-center">
                      <div className="font-mono text-xs tracking-wider uppercase mb-2 flex items-center gap-2">
                        <span className="text-[#099AD7] font-medium tabular-nums">
                          {item.year}
                        </span>
                        <span className="text-[#1C1C1A]/35">—</span>
                        <span className="text-[#1C1C1A]/60">
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
                            size={16}
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
                            size={16}
                            strokeWidth={1.75}
                            className="text-[#099AD7] shrink-0"
                          />
                        </button>
                      ) : (
                        <h4 className="text-lg md:text-xl font-roboto font-medium text-[#1C1C1A] tracking-tight mb-2">
                          {item.title}
                        </h4>
                      )}

                      <p className="text-sm md:text-base font-roboto text-[#1C1C1A]/75 leading-relaxed max-w-3xl mb-4">
                        {item.description}
                      </p>

                      {/* Acción Única y Directa */}
                      {projectHref ? (
                        <Link
                          href={projectHref}
                          className="inline-flex items-center gap-1.5 text-[#099AD7] text-xs font-mono uppercase tracking-wider hover:underline w-fit"
                        >
                          <span>
                            VER PROYECTO COMPLETO [MEMORIA + PLANIMETRÍA] ↗
                          </span>
                        </Link>
                      ) : hasExclusiveGallery ? (
                        <button
                          type="button"
                          onClick={() => openModalGallery(item, 0)}
                          className="inline-flex items-center gap-1.5 text-[#099AD7] text-xs font-mono uppercase tracking-wider hover:underline cursor-pointer w-fit"
                        >
                          <Images size={13} strokeWidth={1.75} />
                          <span>
                            VER REGISTRO FOTOGRÁFICO COMPLETO (
                            {item.gallery!.length} TOMAS) ⤢
                          </span>
                        </button>
                      ) : null}
                    </div>

                    {/* Columna Derecha: Carrusel / Imagen (Cols 8 a 12) */}
                    <div className="lg:col-span-5 w-full">
                      {projectHref ? (
                        <Link href={projectHref} className="block group">
                          <div className="relative w-full aspect-[16/10] overflow-hidden border border-[#1C1C1A]/15 bg-[#FFFFFF] group-hover:border-[#099AD7] transition-colors">
                            <Image
                              src={item.image}
                              alt={item.imageCaption}
                              fill
                              sizes="(max-width: 1024px) 100vw, 42vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                          </div>
                          <p className="text-[11px] font-mono text-[#1C1C1A]/50 group-hover:text-[#099AD7] transition-colors mt-1.5 truncate">
                            {item.imageCaption}
                          </p>
                        </Link>
                      ) : hasExclusiveGallery ? (
                        <ExclusiveBioGallery
                          images={item.gallery!}
                          onOpenLightbox={(idx) => openModalGallery(item, idx)}
                        />
                      ) : (
                        <div>
                          <div className="relative w-full aspect-[16/10] overflow-hidden border border-[#1C1C1A]/15 bg-[#FFFFFF]">
                            <Image
                              src={item.image}
                              alt={item.imageCaption}
                              fill
                              sizes="(max-width: 1024px) 100vw, 42vw"
                              className="object-cover"
                            />
                          </div>
                          <p className="text-[11px] font-mono text-[#1C1C1A]/50 mt-1.5 truncate">
                            {item.imageCaption}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          BLOQUE 03: HABILIDADES (6 tarjetas en grilla 3 columnas a ancho completo)
      ===================================================================== */}
      <section
        id="habilidades"
        className="scroll-mt-24 w-full px-6 md:px-12 lg:px-16 py-12 md:py-16 border-b border-[#1C1C1A]/15"
      >
        <div className="flex items-center gap-3 mb-8 md:mb-10">
          <h2 className="font-roboto text-base md:text-xl font-medium tracking-wider text-[#099AD7] uppercase">
            03 / HABILIDADES
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {SKILL_CARDS.map((card) => (
            <div
              key={card.title}
              className="border border-[#1C1C1A]/15 p-6 sm:p-8 bg-[#FFFFFF] flex flex-col"
            >
              <h3 className="text-lg md:text-xl font-roboto font-bold tracking-tight text-[#099AD7] mb-5 pb-3 border-b border-[#1C1C1A]/10">
                {card.title}
              </h3>

              <ul className="flex flex-col gap-3">
                {card.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 font-roboto text-base text-[#1C1C1A]"
                  >
                    <span className="w-1.5 h-1.5 bg-[#099AD7] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================================
          PIE DE CONTACTO DIRECTO (Cierre Minimalista sobre Fondo Blanco)
      ===================================================================== */}
      <section className="w-full px-6 md:px-12 lg:px-16 py-12 md:py-16">
        <div className="flex flex-col items-start">
          <h2 className="text-2xl md:text-3xl font-medium text-[#1C1C1A] tracking-tight mb-4">
            Trabajemos juntos
          </h2>
          <a
            href={getWhatsAppLink(
              "Hola Agustín, vi tu portfolio y me gustaría ponerme en contacto contigo para una propuesta de trabajo/proyecto."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 border border-[#099AD7] bg-[#099AD7] text-white font-roboto text-xs uppercase tracking-widest hover:bg-transparent hover:text-[#099AD7] transition-colors group"
          >
            <span>Contactar por WhatsApp</span>
            <ArrowUpRight
              size={15}
              strokeWidth={1.75}
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </div>
      </section>

      {/* =====================================================================
          BARRA INFERIOR DE ATAJOS RÁPIDOS EN 3 EXTREMOS (Estilo Oficina Correa)
      ===================================================================== */}
      <footer
        ref={bottomNavRef}
        role="navigation"
        aria-label="Secciones de Bio"
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#E5E2DC] bg-[#FFFFFF]/90 backdrop-blur-md w-full flex justify-between items-center px-6 md:px-12 lg:px-16 py-4"
      >
        {BIO_SECTIONS.map((sec, idx) => {
          const isActive = activeSection === sec.id;
          const originClass =
            idx === 0
              ? "origin-left items-start"
              : idx === 1
                ? "origin-center items-center"
                : "origin-right items-end";

          return (
            <button
              key={sec.id}
              ref={(el) => {
                navBtnRefs.current[idx] = el;
              }}
              type="button"
              onClick={() => handleScrollToSection(sec.id)}
              className={`relative inline-flex flex-col justify-center ${originClass} uppercase tracking-wider font-roboto px-1 transition-colors duration-200 cursor-pointer whitespace-nowrap focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-acento ${
                isActive
                  ? "text-[16px] font-semibold font-[600] text-[#099AD7]"
                  : "text-[13px] font-medium font-[500] text-[#1C1C1A] hover:text-[#099AD7]"
              }`}
            >
              <span>{sec.label}</span>
              {/* Reserva de ancho en tamaño activo (16px semibold) para evitar desplazamientos */}
              <span
                aria-hidden="true"
                className="invisible text-[16px] font-semibold font-[600] h-0 overflow-hidden select-none pointer-events-none"
              >
                {sec.label}
              </span>
            </button>
          );
        })}
      </footer>

      {/* =====================================================================
          MODAL EXCLUSIVO PARA PARTICIPACIONES INDEPENDIENTES DE LA BIO
      ===================================================================== */}
      <AnimatePresence>
        {modalParticipation && modalParticipation.item.gallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-[#FFFFFF]/98 flex flex-col justify-between p-6 md:p-12"
            onClick={() => setModalParticipation(null)}
          >
            <div
              className="w-full flex items-center justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <span className="font-roboto text-xs uppercase tracking-widest text-[#099AD7] block">
                  {modalParticipation.item.year} — {modalParticipation.item.category}
                </span>
                <h3 className="font-roboto text-base md:text-lg font-medium text-[#1C1C1A]">
                  {modalParticipation.item.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setModalParticipation(null)}
                aria-label="Cerrar galería"
                className="p-2 border border-[#1C1C1A]/15 text-[#1C1C1A] hover:text-[#099AD7] hover:border-[#099AD7] transition-colors cursor-pointer"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            <div
              className="relative w-full max-w-5xl mx-auto h-[65vh] flex items-center justify-center my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                key={modalParticipation.item.gallery[modalSlideIdx].src}
                src={modalParticipation.item.gallery[modalSlideIdx].src}
                alt={modalParticipation.item.gallery[modalSlideIdx].caption}
                fill
                sizes="90vw"
                className="object-contain"
              />

              {modalParticipation.item.gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setModalSlideIdx(
                        (curr) =>
                          (curr - 1 + modalParticipation.item.gallery!.length) %
                          modalParticipation.item.gallery!.length
                      )
                    }
                    aria-label="Anterior"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#FFFFFF] border border-[#1C1C1A]/15 text-[#1C1C1A] hover:text-[#099AD7] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronLeft size={20} strokeWidth={1.75} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setModalSlideIdx(
                        (curr) =>
                          (curr + 1) % modalParticipation.item.gallery!.length
                      )
                    }
                    aria-label="Siguiente"
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#FFFFFF] border border-[#1C1C1A]/15 text-[#1C1C1A] hover:text-[#099AD7] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronRight size={20} strokeWidth={1.75} />
                  </button>
                </>
              )}
            </div>

            <div
              className="w-full flex items-center justify-between text-xs md:text-sm font-roboto text-[#1C1C1A]"
              onClick={(e) => e.stopPropagation()}
            >
              <span>
                {modalParticipation.item.gallery[modalSlideIdx].caption}
              </span>
              <span className="tabular-nums tracking-wider">
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
