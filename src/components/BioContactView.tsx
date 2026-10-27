"use client";

import React, { useState, useEffect } from "react";
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
        className="relative w-full aspect-[3/2] overflow-hidden bg-[#FFFFFF] group cursor-pointer"
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

            <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 bg-[#FFFFFF]/90 border border-[#1C1C1A]/15 text-[#1C1C1A] font-roboto text-[10px] tabular-nums tracking-wider">
              {String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </>
        )}
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-3">
        <p className="font-roboto text-xs text-[#1C1C1A]/75 leading-snug line-clamp-1">
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
  const [activeSection, setActiveSection] = useState<BioSectionId>("sobre-mi");
  const [profileImgError, setProfileImgError] = useState(false);
  const [openWorkId, setOpenWorkId] = useState<string | null>(null);
  const [openGalleryItemId, setOpenGalleryItemId] = useState<string | null>(
    null
  );
  const [modalParticipation, setModalParticipation] = useState<{
    item: ParticipationItem;
    initialIndex: number;
  } | null>(null);
  const [modalSlideIdx, setModalSlideIdx] = useState(0);

  const handleScrollToSection = (sectionId: BioSectionId) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const elements = BIO_SECTIONS.map((s) =>
      document.getElementById(s.id)
    ).filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id as BioSectionId);
          }
        });
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const toggleWorkItem = (id: string) => {
    setOpenWorkId((prev) => (prev === id ? null : id));
  };

  const toggleParticipationGallery = (id: string) => {
    setOpenGalleryItemId((prev) => (prev === id ? null : id));
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

            {/* Columna Derecha: Texto de CV a ancho completo + Educación y Certificación BIM */}
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
                    className="w-full py-5 md:py-6 flex items-center justify-between gap-4 text-left focus:outline-none group cursor-pointer"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6">
                      <span className="font-roboto text-xs text-[#1C1C1A]/40 tabular-nums shrink-0">
                        {item.orderNumber}
                      </span>
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className="text-lg md:text-2xl font-roboto font-light text-[#1C1C1A] group-hover:text-[#099AD7] transition-colors">
                          {item.role} — {item.company}
                        </span>
                        <span className="font-roboto text-xs uppercase tracking-widest text-[#099AD7]">
                          [{item.period}]
                        </span>
                      </div>
                    </div>

                    <div className="text-[#099AD7] flex items-center justify-center shrink-0">
                      {isOpen ? (
                        <Minus size={20} strokeWidth={1.5} />
                      ) : (
                        <Plus size={20} strokeWidth={1.5} />
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
                        <div className="pb-8 pt-2 sm:pl-10 max-w-4xl">
                          <span className="font-roboto text-[11px] uppercase tracking-widest text-[#1C1C1A]/45 block mb-3">
                            Responsabilidades & Alcance Técnico
                          </span>
                          <ul className="flex flex-col gap-3">
                            {item.tasks.map((task, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-3 font-roboto text-sm md:text-base text-[#1C1C1A]/85 leading-relaxed"
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

        {/* SUBDIVISIÓN 2: Concursos, montajes y distinciones (Lógica Dual: Proyecto existente vs Galería propia exclusiva) */}
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
              const isGalleryExpanded = openGalleryItemId === item.id;

              return (
                <article key={item.id} className="py-7 md:py-9">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-12 items-center">
                    {/* Columna de Metadatos, Título interactivo y Acción Dual */}
                    <div className="lg:col-span-7 xl:col-span-8 flex flex-col justify-center">
                      <div className="font-roboto text-xs tracking-wider uppercase mb-2 flex items-center gap-2">
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
                          onClick={() => toggleParticipationGallery(item.id)}
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

                      {/* Acción explícita según modalidad */}
                      {projectHref ? (
                        <Link
                          href={projectHref}
                          className="inline-flex items-center gap-1.5 font-roboto text-xs uppercase tracking-widest text-[#099AD7] hover:text-[#1C1C1A] transition-colors w-fit group"
                        >
                          <span>Ver proyecto completo</span>
                          <ArrowUpRight
                            size={14}
                            strokeWidth={1.75}
                            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          />
                        </Link>
                      ) : hasExclusiveGallery ? (
                        <div className="flex flex-wrap items-center gap-4">
                          <button
                            type="button"
                            onClick={() => toggleParticipationGallery(item.id)}
                            className="inline-flex items-center gap-1.5 font-roboto text-xs uppercase tracking-widest text-[#099AD7] hover:text-[#1C1C1A] transition-colors cursor-pointer"
                          >
                            <Images size={14} strokeWidth={1.75} />
                            <span>
                              {isGalleryExpanded
                                ? "Ocultar galería exclusiva"
                                : `Desplegar galería (${item.gallery!.length} fotos)`}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => openModalGallery(item, 0)}
                            className="inline-flex items-center gap-1.5 font-roboto text-xs uppercase tracking-widest text-[#1C1C1A]/65 hover:text-[#099AD7] transition-colors cursor-pointer"
                          >
                            <span>Abrir visor modal</span>
                            <ArrowUpRight size={13} strokeWidth={1.75} />
                          </button>
                        </div>
                      ) : null}
                    </div>

                    {/* Columna Derecha: Imagen con enlace a proyecto o Galería propia exclusiva */}
                    <div className="lg:col-span-5 xl:col-span-4 w-full">
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
                              sizes="(max-width: 1024px) 100vw, 35vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                          </div>
                          <div className="mt-2 flex items-center justify-between text-xs font-roboto text-[#1C1C1A]/75 group-hover:text-[#099AD7] transition-colors">
                            <span className="truncate">{item.imageCaption}</span>
                            <ArrowUpRight size={14} className="shrink-0" />
                          </div>
                        </Link>
                      ) : hasExclusiveGallery ? (
                        <ExclusiveBioGallery
                          images={item.gallery!}
                          onOpenLightbox={(idx) => openModalGallery(item, idx)}
                        />
                      ) : (
                        <div className="border border-[#1C1C1A]/15 bg-[#FFFFFF] p-2.5">
                          <div className="relative w-full aspect-[3/2] overflow-hidden bg-[#FFFFFF]">
                            <Image
                              src={item.image}
                              alt={item.imageCaption}
                              fill
                              sizes="(max-width: 1024px) 100vw, 35vw"
                              className="object-cover"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tira desplegable de miniaturas si la participación tiene galería propia */}
                  <AnimatePresence initial={false}>
                    {hasExclusiveGallery && isGalleryExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="pt-6 mt-6 border-t border-[#1C1C1A]/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {item.gallery!.map((img, gIdx) => (
                            <button
                              key={img.src}
                              type="button"
                              onClick={() => openModalGallery(item, gIdx)}
                              className="border border-[#1C1C1A]/15 bg-[#FFFFFF] p-2 text-left group hover:border-[#099AD7] transition-colors cursor-pointer"
                            >
                              <div className="relative w-full aspect-[3/2] overflow-hidden bg-[#FFFFFF]">
                                <Image
                                  src={img.src}
                                  alt={img.caption}
                                  fill
                                  sizes="(max-width: 768px) 100vw, 30vw"
                                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                                />
                              </div>
                              <p className="mt-2 font-roboto text-xs text-[#1C1C1A]/75 group-hover:text-[#099AD7] transition-colors line-clamp-1">
                                {img.caption}
                              </p>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
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
          BARRA INFERIOR DE ATAJOS RÁPIDOS (Estilo Oficina Correa)
      ===================================================================== */}
      <footer
        role="navigation"
        aria-label="Secciones de Bio"
        className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFFFFF] border-t border-[#E5E2DC] px-6 md:px-12 lg:px-16 h-14 flex items-center justify-center"
      >
        <div className="flex items-center justify-center gap-6 md:gap-10">
          {BIO_SECTIONS.map((sec, idx) => {
            const isActive = activeSection === sec.id;
            return (
              <React.Fragment key={sec.id}>
                <button
                  type="button"
                  onClick={() => handleScrollToSection(sec.id)}
                  className={`relative inline-flex flex-col items-center justify-center uppercase tracking-widest font-roboto text-[12px] md:text-[13px] px-1 transition-colors duration-200 cursor-pointer whitespace-nowrap focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-acento ${
                    isActive
                      ? "font-bold font-[700] text-[#099AD7]"
                      : "font-thin font-[100] text-[#1C1C1A] hover:text-[#099AD7]"
                  }`}
                >
                  <span>{sec.label}</span>
                  <span
                    aria-hidden="true"
                    className="invisible font-bold font-[700] h-0 overflow-hidden select-none pointer-events-none"
                  >
                    {sec.label}
                  </span>
                </button>
                {idx < BIO_SECTIONS.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="text-[#E5E2DC] font-roboto font-thin select-none text-xs"
                  >
                    |
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>
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
