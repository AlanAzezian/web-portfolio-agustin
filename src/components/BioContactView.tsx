"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface WorkExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  scope: string;
}

interface CompetitionItem {
  id: string;
  year: string;
  badge?: string;
  title: string;
  description: string;
  image: string;
  imageCaption: string;
}

interface SkillCard {
  title: string;
  items: string[];
}

const BIO_SECTIONS = [
  { id: "sobre-mi", label: "[ 01 / SOBRE MÍ ]" },
  { id: "experiencia", label: "[ 02 / EXPERIENCIA ]" },
  { id: "habilidades", label: "[ 03 / HABILIDADES ]" },
] as const;

type BioSectionId = (typeof BIO_SECTIONS)[number]["id"];

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

const WORK_EXPERIENCE_ITEMS: WorkExperienceItem[] = [
  {
    id: "work-01",
    role: "Asistente de Arquitectura",
    company: "ENGAPA (Uruguay) | KUAARA (Argentina)",
    period: "Dic. 2023 – Jul. 2025",
    scope:
      "Desarrollo de documentación técnica BIM para proyectos de hormigón premoldeado, planimetrías para fabricación de piezas de GRC, coordinación intersectorial y relevamiento en obra.",
  },
  {
    id: "work-02",
    role: "Renderista y Delineante",
    company: "Práctica Freelance",
    period: "2021 – Presente",
    scope:
      "Modelado 3D, composición de imágenes realistas, planimetría comercial y asesoramiento en diseño de interiores y exteriores.",
  },
  {
    id: "work-03",
    role: "Diseñador Técnico y Presupuestos",
    company: "Fabrizio Amoblamientos",
    period: "2021 – Presente (Empresa familiar)",
    scope:
      "Diseño de equipamiento y mobiliario a medida, seguimiento de fabricación y relevamiento métrico en obra.",
  },
];

const COMPETITION_ITEMS: CompetitionItem[] = [
  {
    id: "comp-01",
    year: "2026",
    badge: "LA BIENAL XX",
    title: "Maqueta Casa Chacra — BAAG | La Bienal XX (2026)",
    description:
      "Colaborador en producción y montaje de maqueta expositiva en la XX Bienal Internacional de Arquitectura de Buenos Aires.",
    image: "/projects/centro-de-trasbordo/01-render-exterior.webp",
    imageCaption: "Maqueta Casa Chacra — BAAG | XX Bienal Internacional de Arquitectura de Buenos Aires",
  },
  {
    id: "comp-02",
    year: "2026",
    badge: "CLAVE 0178",
    title: "Concurso Provincial Crematorio Parque CEyS (2026)",
    description: "Colaborador | Clave 0178 (Nueve de Julio, Buenos Aires).",
    image: "/projects/centro-de-trasbordo/03-render-patio-vidriado.webp",
    imageCaption: "Concurso Provincial Crematorio Parque CEyS — Nueve de Julio, Buenos Aires",
  },
  {
    id: "comp-03",
    year: "2023",
    badge: "2° PUESTO",
    title: "Nuevo Acceso al Parque Natural Laguna de Gómez (2023 — 2° Puesto)",
    description: "Concurso de ideas municipal (Junín, Buenos Aires).",
    image: "/projects/acceso-pnlq.png",
    imageCaption: "2° Puesto — Nuevo Acceso al Parque Natural Laguna de Gómez (Junín, Buenos Aires)",
  },
  {
    id: "comp-04",
    year: "2023",
    badge: "1° PUESTO",
    title: "Concurso de Viviendas Colectivas en SteelHouse (2023 — 1° Puesto)",
    description:
      "Concurso interno en Construcciones II (Cátedra Castellano / Patrocinio Tubos Argentinos).",
    image: "/projects/50-viviendas.jpg",
    imageCaption: "1° Puesto — Concurso de Viviendas Colectivas en SteelHouse (FADU, UBA)",
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
];

export default function BioContactView() {
  const [activeSection, setActiveSection] = useState<BioSectionId>("sobre-mi");
  const [profileImgError, setProfileImgError] = useState(false);

  const handleScrollToSection = (sectionId: BioSectionId) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (!el) return;

    if (typeof window !== "undefined" && window.__lenis) {
      window.__lenis.scrollTo(el, {
        offset: -128,
        duration: 0.85,
      });
    } else {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // ScrollSpy dinámico con IntersectionObserver
  useEffect(() => {
    const elements = BIO_SECTIONS.map((s) => document.getElementById(s.id)).filter(
      Boolean
    ) as HTMLElement[];

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
        rootMargin: "-20% 0px -65% 0px",
        threshold: 0,
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full bg-[#F8F7F4] text-[#1C1C1A] font-roboto pt-20">
      {/* Barra de sub-filtros Sticky con ScrollSpy */}
      <div className="sticky top-16 md:top-20 z-30 w-full bg-[#F8F7F4]/90 backdrop-blur-sm py-4 border-b border-[#E5E2DC]/50">
        <div className="max-w-6xl mx-auto px-6 md:px-16 flex justify-center items-center gap-6 md:gap-10 overflow-x-auto no-scrollbar">
          {BIO_SECTIONS.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => handleScrollToSection(sec.id)}
                className={`relative inline-flex flex-col items-center justify-center uppercase tracking-wider font-roboto px-1 transition-all duration-200 cursor-pointer whitespace-nowrap focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-acento ${
                  isActive
                    ? "text-[13px] md:text-[14px] font-semibold font-[600] text-[#099AD7] scale-105"
                    : "text-[11px] md:text-[12px] font-medium font-[500] text-[#1C1C1A] hover:text-[#099AD7] scale-100"
                }`}
              >
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =====================================================================
          BLOQUE 01: SOBRE MÍ (Foto de perfil a la izquierda + Texto CV + Educación)
      ===================================================================== */}
      <section
        id="sobre-mi"
        className="scroll-mt-32 max-w-6xl mx-auto px-6 md:px-16 py-10 md:py-16 border-b border-[#1C1C1A]/15"
      >
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-8 md:mb-12">
            <h2 className="font-roboto text-base md:text-xl font-medium tracking-wider text-[#099AD7] uppercase">
              01 / SOBRE MÍ
            </h2>
          </div>

          {/* Layout de 2 columnas en desktop: Izquierda Retrato / Derecha Texto CV y Educación */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14 items-start">
            {/* Columna Izquierda: Fotografía de Perfil de Agustín con marco editorial */}
            <div className="lg:col-span-5 w-full">
              <div className="border border-[#1C1C1A]/15 bg-[#F8F7F4] p-3">
                <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#1C1C1A]/[0.04] flex items-center justify-center">
                  {!profileImgError ? (
                    <Image
                      src="/agustin-perfil.webp"
                      alt="Agustín Fabrizio — Retrato"
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover"
                      onError={() => setProfileImgError(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center select-none border border-dashed border-[#1C1C1A]/15">
                      <span className="font-roboto font-light text-4xl tracking-tight text-[#1C1C1A]/25 mb-3">
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

                <div className="mt-3 pt-2.5 border-t border-[#1C1C1A]/10 flex items-center justify-between">
                  <span className="font-roboto text-xs font-medium text-[#1C1C1A]">
                    Agustín Fabrizio
                  </span>
                  <span className="font-roboto text-[11px] uppercase tracking-wider text-acento">
                    FADU, UBA
                  </span>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Declaración de CV + Bloque de Educación */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-10">
              <div>
                <span className="font-roboto text-xs uppercase tracking-widest text-[#1C1C1A]/50 block mb-2.5">
                  PRESENTACIÓN PROFESIONAL
                </span>
                <h1 className="text-xl md:text-[26px] font-roboto font-light leading-snug tracking-tight text-[#1C1C1A] mb-7">
                  Agustín Fabrizio — Arquitectura & Visualización Contemporánea.
                </h1>

                <blockquote className="text-lg sm:text-xl md:text-[22px] font-roboto font-light leading-relaxed text-[#1C1C1A] border-l-2 border-acento pl-5 md:pl-7 py-1">
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
              </div>

              {/* Bloque Educación (FADU UBA + Certificado BIM Modeler Miller & Co) */}
              <div className="border-t border-[#1C1C1A]/15 pt-6">
                <span className="font-roboto text-xs uppercase tracking-widest text-[#099AD7] font-medium block mb-4">
                  EDUCACIÓN & CERTIFICACIONES
                </span>

                <div className="flex flex-col divide-y divide-[#1C1C1A]/10 border-t border-b border-[#1C1C1A]/10">
                  {EDUCATION_ITEMS.map((edu) => (
                    <div
                      key={edu.id}
                      className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <h3 className="font-roboto font-medium text-base text-[#1C1C1A]">
                          {edu.institution}
                        </h3>
                        <p className="font-roboto text-sm text-[#1C1C1A]/65 mt-0.5">
                          {edu.detail}
                        </p>
                      </div>

                      {edu.certificateUrl && (
                        <a
                          href={edu.certificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-[#1C1C1A]/20 hover:border-[#099AD7] text-xs font-roboto uppercase tracking-widest text-[#1C1C1A] hover:text-[#099AD7] transition-colors self-start sm:self-auto shrink-0 group"
                        >
                          <span>Ver Certificado</span>
                          <ArrowUpRight
                            size={14}
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
          BLOQUE 02: EXPERIENCIA (A. Trayectoria Laboral + B. Concursos y Distinciones)
      ===================================================================== */}
      <section
        id="experiencia"
        className="scroll-mt-32 max-w-6xl mx-auto px-6 md:px-16 py-12 md:py-20 border-b border-[#1C1C1A]/15"
      >
        <div className="flex items-center justify-between flex-wrap gap-4 mb-10 md:mb-14">
          <h2 className="font-roboto text-base md:text-xl font-medium tracking-wider text-[#099AD7] uppercase">
            02 / EXPERIENCIA
          </h2>
          <Link
            href="/proyectos"
            className="inline-flex items-center gap-2 font-roboto text-xs uppercase tracking-widest text-[#1C1C1A] hover:text-acento transition-colors"
          >
            <span>Ver archivo de obras</span>
            <ArrowUpRight size={15} strokeWidth={1.75} className="text-acento" />
          </Link>
        </div>

        {/* SUBDIVISIÓN A: Trayectoria Laboral (Estudios y Práctica Profesional) */}
        <div className="mb-16 md:mb-20">
          <div className="flex items-center gap-3 mb-6">
            <span className="font-roboto text-xs uppercase tracking-widest text-[#099AD7] font-semibold">
              A. TRAYECTORIA LABORAL
            </span>
            <span className="w-8 h-[1px] bg-[#1C1C1A]/15" />
            <span className="font-roboto text-xs uppercase tracking-widest text-[#1C1C1A]/50">
              ESTUDIOS & PRÁCTICA PROFESIONAL
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {WORK_EXPERIENCE_ITEMS.map((job) => (
              <article
                key={job.id}
                className="border border-[#1C1C1A]/15 bg-[#F8F7F4] p-6 sm:p-7 flex flex-col justify-between"
              >
                <div>
                  <span className="font-roboto text-xs uppercase tracking-widest text-[#099AD7] font-medium block mb-2">
                    {job.period}
                  </span>
                  <h3 className="text-xl font-roboto font-medium text-[#1C1C1A] tracking-tight leading-snug mb-1">
                    {job.role}
                  </h3>
                  <p className="font-roboto text-xs uppercase tracking-wider text-[#1C1C1A]/60 pb-4 mb-4 border-b border-[#1C1C1A]/10">
                    {job.company}
                  </p>
                  <p className="font-roboto text-sm text-[#1C1C1A]/80 leading-relaxed">
                    {job.scope}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* SUBDIVISIÓN B: Concursos, Montajes y Distinciones */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <span className="font-roboto text-xs uppercase tracking-widest text-[#099AD7] font-semibold">
              B. CONCURSOS, MONTAJES & DISTINCIONES
            </span>
            <span className="w-8 h-[1px] bg-[#1C1C1A]/15" />
            <span className="font-roboto text-xs uppercase tracking-widest text-[#1C1C1A]/50">
              PREMIOS & PARTICIPACIONES
            </span>
          </div>

          <div className="flex flex-col divide-y divide-[#1C1C1A]/15 border-t border-[#1C1C1A]/15">
            {COMPETITION_ITEMS.map((item) => (
              <article
                key={item.id}
                className="py-10 md:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-start"
              >
                {/* Columna de Metadatos y Descripción */}
                <div className="lg:col-span-7 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className="font-roboto text-xs uppercase tracking-widest text-[#099AD7] font-medium">
                        {item.year}
                      </span>
                      {item.badge && (
                        <>
                          <span className="text-[#1C1C1A]/30">•</span>
                          <span className="font-roboto text-[11px] uppercase tracking-widest px-2.5 py-0.5 bg-[#099AD7]/10 text-[#099AD7] font-medium">
                            {item.badge}
                          </span>
                        </>
                      )}
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-roboto font-light text-[#1C1C1A] tracking-tight mb-3">
                      {item.title}
                    </h3>

                    <p className="text-base font-roboto text-[#1C1C1A]/80 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Tarjeta Fotográfica Representativa */}
                <div className="lg:col-span-5 w-full">
                  <div className="border border-[#1C1C1A]/15 bg-[#F8F7F4] p-2.5">
                    <div className="relative w-full overflow-hidden bg-[#1C1C1A]/5">
                      <Image
                        src={item.image}
                        alt={item.imageCaption}
                        width={1200}
                        height={800}
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="w-full h-auto object-contain block"
                      />
                    </div>
                    <p className="mt-2.5 font-roboto text-[11px] uppercase tracking-wider text-[#1C1C1A]/60 leading-snug">
                      {item.imageCaption}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          BLOQUE 03: HABILIDADES (CV Oficial de Agustín)
      ===================================================================== */}
      <section
        id="habilidades"
        className="scroll-mt-32 max-w-6xl mx-auto px-6 md:px-16 py-12 md:py-20 border-b border-[#1C1C1A]/15"
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
              className="border border-[#1C1C1A]/15 p-6 sm:p-8 bg-[#F8F7F4] flex flex-col"
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
          PIE DE CONTACTO DIRECTO (Cierre de la Landing Vertical)
      ===================================================================== */}
      <section className="max-w-6xl mx-auto px-6 md:px-16 py-12 md:py-20">
        <div className="p-8 sm:p-12 md:p-16 bg-[#1C1C1A] text-[#F8F7F4] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <span className="font-roboto text-xs uppercase tracking-widest text-acento block mb-3">
              CONTACTO DIRECTO
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-roboto font-light tracking-tight leading-none mb-4">
              ¿Conversamos sobre un próximo proyecto o colaboración?
            </h2>
            <p className="font-roboto text-sm sm:text-base text-[#F8F7F4]/70 leading-relaxed">
              Disponible para encargos de visualización arquitectónica, modelado BIM y asistencia proyectual para estudios.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row w-full lg:w-auto gap-4 shrink-0">
            <a
              href="https://wa.me/5491100000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-acento text-[#F8F7F4] font-roboto text-xs uppercase tracking-widest hover:bg-[#F8F7F4] hover:text-[#1C1C1A] transition-colors"
            >
              <span>WhatsApp</span>
              <ArrowUpRight size={15} strokeWidth={1.75} />
            </a>
            <a
              href="mailto:hola@agustinfabrizio.com"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 border border-[#F8F7F4]/25 text-[#F8F7F4] font-roboto text-xs uppercase tracking-widest hover:bg-[#F8F7F4] hover:text-[#1C1C1A] transition-colors"
            >
              <span>hola@agustinfabrizio.com</span>
              <ArrowUpRight size={15} strokeWidth={1.75} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
