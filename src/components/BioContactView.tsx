"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Plus, Minus } from "lucide-react";
import { getWhatsAppLink } from "@/lib/whatsapp";

interface WorkAccordionItem {
  id: string;
  orderNumber: string;
  role: string;
  company: string;
  period: string;
  tasks: string[];
}

interface CompetitionItem {
  id: string;
  year: string;
  category: string;
  title: string;
  description: string;
}

interface SkillCard {
  title: string;
  items: string[];
}

const EDUCATION_ITEMS = [
  {
    id: "edu-fadu",
    institution: "Facultad de Arquitectura, Diseño y Urbanismo, UBA",
    detail: "2020 - En curso (86%)",
    certificateUrl: null,
  },
  {
    id: "edu-bim",
    institution: "Curso BIM Modeler",
    detail: "2025 - Miller & Co (online)",
    certificateUrl: "https://www.homeofbimcampus.com/certificates/eocr0f5enb",
  },
];

const WORK_ACCORDION_ITEMS: WorkAccordionItem[] = [
  {
    id: "work-01",
    orderNumber: "01",
    role: "Asistente de Arquitectura",
    company: "ENGAPA (Uru.) | KUAARA (Arg.)",
    period: "2023 - 2025",
    tasks: [
      "Desarrollo de documentación técnica BIM para proyectos de hormigón premoldeado.",
      "Elaboración de planimetrías de taller para fabricación y montaje de piezas de GRC.",
      "Coordinación técnica intersectorial entre ingeniería, fábrica y arquitectura.",
      "Relevamiento dimensional y seguimiento técnico en obra.",
    ],
  },
  {
    id: "work-02",
    orderNumber: "02",
    role: "Renderista y Delineante",
    company: "Práctica Freelance",
    period: "2021 - Presente",
    tasks: [
      "Modelado 3D de alta precisión y desarrollo de volumetrías arquitectónicas.",
      "Composición de imágenes fotorrealistas exteriores e interiores (D5, Lumion, V-Ray).",
      "Producción de planimetría comercial y gráfica editorial para estudios.",
      "Asesoramiento en diseño espacial, materialidad e iluminación.",
    ],
  },
  {
    id: "work-03",
    orderNumber: "03",
    role: "Diseñador Técnico y Presupuestos",
    company: "Fabrizio Amoblamientos",
    period: "2021 - Presente",
    tasks: [
      "Diseño técnico de equipamiento y mobiliario a medida para obras residenciales y comerciales.",
      "Cómputo de materiales, optimización de cortes y elaboración de presupuestos.",
      "Seguimiento de fabricación en taller y coordinación de montaje.",
      "Relevamiento métrico integral en obra y trato directo con clientes.",
    ],
  },
];

const COMPETITION_ITEMS: CompetitionItem[] = [
  {
    id: "comp-01",
    year: "2026",
    category: "MONTAJE EXPOSITIVO (LA BIENAL XX)",
    title: "Maqueta Casa Chacra — BAAG | La Bienal XX",
    description:
      "Colaborador en producción y montaje de maqueta expositiva para el estudio BAAG en la XX Bienal Internacional de Arquitectura de Buenos Aires.",
  },
  {
    id: "comp-02",
    year: "2026",
    category: "CONCURSO PROVINCIAL (CLAVE 0178)",
    title: "Concurso Provincial Crematorio Parque CEyS",
    description:
      "Colaborador en equipo de proyecto | Clave 0178 — Nueve de Julio, Provincia de Buenos Aires.",
  },
  {
    id: "comp-03",
    year: "2023",
    category: "CONCURSO DE IDEAS (2° PREMIO)",
    title: "Nuevo Acceso al Parque Natural Laguna de Gómez",
    description:
      "Distinción: 2° Puesto. Concurso de ideas municipal — Junín, Provincia de Buenos Aires.",
  },
  {
    id: "comp-04",
    year: "2023",
    category: "CONCURSO DE VIVIENDA (1° PREMIO)",
    title: "Concurso de Viviendas Colectivas en SteelHouse",
    description:
      "Distinción: 1° Puesto. Concurso interno en Construcciones II (Cátedra Castellano / Patrocinio Tubos Argentinos, FADU-UBA).",
  },
];

const SKILL_CARDS: SkillCard[] = [
  {
    title: "CAD",
    items: ["SketchUp", "Revit", "AutoCAD"],
  },
  {
    title: "RENDERING",
    items: ["D5 Render", "Lumion", "V-Ray"],
  },
  {
    title: "ADOBE",
    items: ["Illustrator", "Photoshop", "InDesign", "Lightroom"],
  },
  {
    title: "OFFICE",
    items: ["Excel", "Word", "PowerPoint"],
  },
  {
    title: "IDIOMAS",
    items: ["Español (Nativo)", "Inglés (B2)"],
  },
  {
    title: "IA",
    items: ["Google Antigravity"],
  },
];

export default function BioContactView() {
  const [profileImgError, setProfileImgError] = useState(false);
  const [openWorkId, setOpenWorkId] = useState<string | null>(null);

  const toggleWorkItem = (id: string) => {
    setOpenWorkId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full bg-[#FFFFFF] text-[#1C1C1A] font-roboto">
      {/* =====================================================================
          BLOQUE 01: SOBRE MÍ (Foto + Links a la izq, CV + Educación a la der)
      ===================================================================== */}
      <section
        id="sobre-mi"
        className="scroll-mt-24 max-w-6xl mx-auto px-6 md:px-16 pt-2 pb-10 md:pt-4 md:pb-12 border-b border-[#1C1C1A]/15"
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="flex items-center gap-3 mb-5 md:mb-7">
            <h1 className="font-roboto text-base md:text-xl font-medium tracking-wider text-[#099AD7] uppercase">
              01 / SOBRE MÍ
            </h1>
          </div>

          {/* Layout en 2 columnas: Izquierda Foto + Links de Contacto / Derecha Cita CV + Educación */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
            {/* Columna Izquierda: Foto de Agustín + Fila de Links y Contacto debajo */}
            <div className="lg:col-span-4 w-full flex flex-col gap-3">
              <div className="border border-[#1C1C1A]/15 bg-[#FFFFFF] p-2.5">
                <div className="relative w-full aspect-[4/5] max-h-[380px] overflow-hidden bg-[#FFFFFF] flex items-center justify-center">
                  {!profileImgError ? (
                    <Image
                      src="/agustin-perfil.webp"
                      alt="Agustín Fabrizio — Retrato"
                      fill
                      sizes="(max-width: 1024px) 100vw, 35vw"
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

            {/* Columna Derecha: Texto de CV directo + Educación y Certificación BIM */}
            <div className="lg:col-span-8 flex flex-col justify-between gap-7">
              <blockquote className="text-base sm:text-lg md:text-[19px] font-roboto font-light leading-relaxed text-[#1C1C1A] border-l-2 border-[#099AD7] pl-5 md:pl-6 py-0.5">
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
              <div className="border-t border-[#1C1C1A]/15 pt-5">
                <span className="font-roboto text-xs uppercase tracking-widest text-[#099AD7] font-medium block mb-3">
                  EDUCACIÓN & CERTIFICACIONES
                </span>

                <div className="flex flex-col divide-y divide-[#1C1C1A]/10 border-t border-b border-[#1C1C1A]/10">
                  {EDUCATION_ITEMS.map((edu) => (
                    <div
                      key={edu.id}
                      className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
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
          BLOQUE 02: EXPERIENCIA (Acordeón Laboral + Registro Editorial de Concursos)
      ===================================================================== */}
      <section
        id="experiencia"
        className="scroll-mt-28 max-w-6xl mx-auto px-6 md:px-16 py-12 md:py-20 border-b border-[#1C1C1A]/15"
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
        <div className="mb-16 md:mb-20">
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
                        <div className="pb-8 pt-2 sm:pl-10 max-w-3xl">
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

        {/* SUBDIVISIÓN 2: Concursos, montajes y distinciones (Registro Editorial Limpio) */}
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
            {COMPETITION_ITEMS.map((item) => (
              <article
                key={item.id}
                className="py-6 md:py-7 flex flex-col md:flex-row md:items-baseline justify-between gap-3 md:gap-8"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 shrink-0">
                  <span className="font-roboto text-xs text-[#099AD7] font-medium tabular-nums tracking-wider uppercase w-12 shrink-0">
                    {item.year}
                  </span>
                  <span className="font-roboto text-xs tracking-wider uppercase text-[#1C1C1A]/60">
                    {item.category}
                  </span>
                </div>

                <div className="md:max-w-xl lg:max-w-2xl w-full">
                  <h4 className="text-base md:text-lg font-roboto font-medium text-[#1C1C1A] tracking-tight mb-1">
                    {item.title}
                  </h4>
                  <p className="text-sm md:text-base font-roboto text-[#1C1C1A]/75 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          BLOQUE 03: HABILIDADES (6 tarjetas en grilla 3 columnas)
      ===================================================================== */}
      <section
        id="habilidades"
        className="scroll-mt-28 max-w-6xl mx-auto px-6 md:px-16 py-12 md:py-20 border-b border-[#1C1C1A]/15"
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
      <section className="max-w-6xl mx-auto px-6 md:px-16 py-12 md:py-20">
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
    </div>
  );
}
