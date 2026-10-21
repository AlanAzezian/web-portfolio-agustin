"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface ExperienceItem {
  id: string;
  period: string;
  role: string;
  organization: string;
  description: string;
  highlights: string[];
  image: string;
  imageCaption: string;
}

interface SkillCategory {
  code: string;
  category: string;
  summary: string;
  tools: {
    name: string;
    focus: string;
    level: string;
  }[];
}

const BIO_SECTIONS = [
  { id: "sobre-mi", label: "[ 01 / SOBRE MÍ ]" },
  { id: "experiencia", label: "[ 02 / EXPERIENCIA ]" },
  { id: "habilidades", label: "[ 03 / HABILIDADES ]" },
] as const;

type BioSectionId = (typeof BIO_SECTIONS)[number]["id"];

const EXPERIENCE_ITEMS: ExperienceItem[] = [
  {
    id: "exp-01",
    period: "2023 — PRESENTE",
    role: "Visualización Arquitectónica & Consultoría BIM Freelance",
    organization: "Colaboración con Estudios de Arquitectura",
    description:
      "Asistencia técnica y visual para estudios de arquitectura y desarrolladoras en etapas de anteproyecto, licitación y comunicación comercial. Producción de imágenes fotorrealistas y modelado tridimensional coordinado.",
    highlights: [
      "Visualización exterior e interior con flujo físico de luz",
      "Coordinación volumétrica y documentación ejecutiva BIM",
      "Gráfica arquitectónica para entregas y paneles de concurso",
    ],
    image: "/projects/centro-de-trasbordo/01-render-exterior.webp",
    imageCaption: "Visualización urbana e inserción peatonal — Centro de Trasbordo Quilmes",
  },
  {
    id: "exp-02",
    period: "2024",
    role: "Proyecto de Infraestructura & Equipamiento Urbano",
    organization: "Taller de Arquitectura — FADU, UBA",
    description:
      "Desarrollo integral del Centro de Trasbordo en el Triángulo de Bernal, Quilmes. Abordaje de infraestructura pública de gran escala, resolución de cubiertas metálicas de grandes luces y articulación intermodal con el tejido urbano.",
    highlights: [
      "Diseño estructural y espacial de nave principal y dársenas",
      "Resolución de patios vidriados, circulaciones verticales y programa mixto",
      "Legajo técnico integral: plantas, vistas y cortes constructivos",
    ],
    image: "/projects/centro-de-trasbordo/02-render-hall-escalera.webp",
    imageCaption: "Espacialidad interior, estructura metálica y control lumínico cenital",
  },
  {
    id: "exp-03",
    period: "2022 — 2024",
    role: "Participaciones en Concursos, Obras & Maquetas",
    organization: "Equipos de Proyecto & Práctica Académica",
    description:
      "Participación activa en equipos de diseño para concursos de espacio público, vivienda colectiva e intervenciones urbanas, integrando exploración en maquetas físicas, axonométricas explotadas y planimetría de alta precisión.",
    highlights: [
      "1er Premio — Concurso Nacional de Espacio Público (2024)",
      "Publicación en Revista Summa+ Edición 190 (2023)",
      "Mención — Bienal de Arquitectura Joven (2022)",
    ],
    image: "/projects/centro-de-trasbordo/03-render-patio-vidriado.webp",
    imageCaption: "Relación interior-exterior y estudio de envolventes acristaladas",
  },
];

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    code: "01",
    category: "Modelado BIM & Documentación Ejecutiva",
    summary:
      "Construcción de modelos paramétricos centralizados, extracción de planimetría técnica automatizada, cómputo de superficies y coordinación constructiva.",
    tools: [
      {
        name: "Autodesk Revit",
        focus: "Modelado paramétrico, familias y legajos ejecutivos",
        level: "Avanzado",
      },
      {
        name: "Graphisoft Archicad",
        focus: "Documentación BIM, cortes constructivos y esquemas 3D",
        level: "Avanzado",
      },
      {
        name: "AutoCAD",
        focus: "Detallado técnico 2D, estandarización de capas y planos municipales",
        level: "Avanzado",
      },
    ],
  },
  {
    code: "02",
    category: "Modelado 3D & Exploración Morfológica",
    summary:
      "Desarrollo de geometrías complejas, estudios de asoleamiento, volumetrías conceptuales y preparación de mallas optimizadas para motores de render.",
    tools: [
      {
        name: "Rhinoceros 3D",
        focus: "Modelado NURBS de precisión, curvaturas y morfología",
        level: "Avanzado",
      },
      {
        name: "3ds Max",
        focus: "Modelado poligonal de alta densidad, ensamblaje de escenas y cámaras",
        level: "Avanzado",
      },
    ],
  },
  {
    code: "03",
    category: "Motores de Render & Simulación Lumínica",
    summary:
      "Creación de atmósferas hiperrealistas mediante motores unbiased/híbridos, sombreadores físicamente correctos (PBR) y visualización en tiempo real.",
    tools: [
      {
        name: "Corona Renderer",
        focus: "Iluminación fotográfica, LightMix y materialidad hiperrealista",
        level: "Especialista",
      },
      {
        name: "V-Ray",
        focus: "Renderizado de producción para exteriores e interiores complejos",
        level: "Avanzado",
      },
      {
        name: "Enscape / Twinmotion",
        focus: "Recorridos virtuales en tiempo real e iteración rápida de diseño",
        level: "Avanzado",
      },
    ],
  },
  {
    code: "04",
    category: "Postproducción & Gráfica Editorial",
    summary:
      "Dirección de arte digital, corrección de color en 16/32 bits, fotomontaje urbano y maquetación de paneles de concurso y memorias descriptivas.",
    tools: [
      {
        name: "Adobe Photoshop",
        focus: "Composición por canales (Render Elements), ambientación y color grading",
        level: "Especialista",
      },
      {
        name: "Adobe Illustrator",
        focus: "Diagramas conceptuales, axonométricas vectoriales y postproducción de planos",
        level: "Avanzado",
      },
      {
        name: "Adobe InDesign",
        focus: "Diseño editorial de portfolios, pliegos técnicos y láminas de entrega",
        level: "Avanzado",
      },
    ],
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
        offset: -116,
        duration: 0.85,
      });
    } else {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Detectar sección activa durante el scroll natural
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
        rootMargin: "-25% 0px -60% 0px",
        threshold: 0,
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full bg-[#F8F7F4] text-[#1C1C1A] font-roboto pt-20">
      {/* Barra superior sticky de filtros / anclas de sub-secciones */}
      <div className="sticky top-20 z-40 w-full bg-[#F8F7F4]/95 backdrop-blur-xs border-b border-[#1C1C1A]/10">
        <div className="max-w-6xl mx-auto px-6 md:px-16 h-12 flex items-center justify-center sm:justify-start gap-4 sm:gap-8 overflow-x-auto no-scrollbar">
          {BIO_SECTIONS.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => handleScrollToSection(sec.id)}
                className={`font-roboto text-[11px] sm:text-xs uppercase tracking-widest whitespace-nowrap py-1 transition-colors cursor-pointer focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-acento ${
                  isActive
                    ? "text-acento font-semibold font-[600]"
                    : "text-[#1C1C1A]/65 hover:text-acento font-medium font-[500]"
                }`}
              >
                {sec.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* =====================================================================
          BLOQUE 01: SOBRE MÍ (Foto de perfil a la izquierda + Texto CV derecha)
      ===================================================================== */}
      <section
        id="sobre-mi"
        className="scroll-mt-24 max-w-6xl mx-auto px-6 md:px-16 py-12 md:py-20 border-b border-[#1C1C1A]/15"
      >
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-8 md:mb-12">
            <span className="font-roboto text-xs uppercase tracking-widest text-acento font-medium">
              01 / SOBRE MÍ
            </span>
            <span className="w-8 h-[1px] bg-acento" />
            <span className="font-roboto text-xs uppercase tracking-widest text-[#1C1C1A]/50">
              PERFIL & ENFOQUE PROYECTUAL
            </span>
          </div>

          {/* Layout de 2 columnas en desktop: Izquierda Retrato / Derecha Texto CV */}
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

            {/* Columna Derecha: Declaración de CV con conceptos clave resaltados en #099AD7 */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-8">
              <div>
                <span className="font-roboto text-xs uppercase tracking-widest text-[#1C1C1A]/50 block mb-3">
                  PRESENTACIÓN PROFESIONAL
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-roboto font-light leading-[1.05] tracking-tight text-[#1C1C1A] mb-8">
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

              {/* Ficha Editorial Compacta */}
              <div className="border-t border-[#1C1C1A]/15 pt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                <div>
                  <span className="font-roboto text-[11px] uppercase tracking-widest text-[#1C1C1A]/45 block mb-1">
                    Formación
                  </span>
                  <span className="font-roboto font-medium text-[#1C1C1A]">
                    Arquitectura — FADU, UBA
                  </span>
                </div>
                <div>
                  <span className="font-roboto text-[11px] uppercase tracking-widest text-[#1C1C1A]/45 block mb-1">
                    Enfoque
                  </span>
                  <span className="font-roboto font-medium text-[#1C1C1A]">
                    Proyecto, BIM & Visualización
                  </span>
                </div>
                <div>
                  <span className="font-roboto text-[11px] uppercase tracking-widest text-[#1C1C1A]/45 block mb-1">
                    Ubicación
                  </span>
                  <span className="font-roboto font-medium text-[#1C1C1A]">
                    Buenos Aires, Argentina
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* =====================================================================
          BLOQUE 02: EXPERIENCIA LABORAL & PARTICIPACIONES (Con fotografías)
      ===================================================================== */}
      <section
        id="experiencia"
        className="scroll-mt-24 max-w-6xl mx-auto px-6 md:px-16 py-12 md:py-20 border-b border-[#1C1C1A]/15"
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="font-roboto text-xs uppercase tracking-widest text-acento font-medium">
            02 / EXPERIENCIA
          </span>
          <span className="w-8 h-[1px] bg-acento" />
          <span className="font-roboto text-xs uppercase tracking-widest text-[#1C1C1A]/50">
            OBRAS, MAQUETAS & COLABORACIONES
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-5xl font-roboto font-light tracking-tight text-[#1C1C1A] leading-tight">
            Experiencia Laboral & Participaciones
          </h2>
          <Link
            href="/proyectos"
            className="inline-flex items-center gap-2 font-roboto text-xs uppercase tracking-widest text-[#1C1C1A] hover:text-acento transition-colors self-start md:self-auto"
          >
            <span>Ver archivo de obras</span>
            <ArrowUpRight size={15} strokeWidth={1.75} className="text-acento" />
          </Link>
        </div>

        <div className="flex flex-col divide-y divide-[#1C1C1A]/15 border-t border-[#1C1C1A]/15">
          {EXPERIENCE_ITEMS.map((item) => (
            <article
              key={item.id}
              className="py-10 md:py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-start"
            >
              {/* Columna de Metadatos y Descripción */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="font-roboto text-xs uppercase tracking-widest text-acento font-medium">
                      {item.period}
                    </span>
                    <span className="text-[#1C1C1A]/30">•</span>
                    <span className="font-roboto text-xs uppercase tracking-wider text-[#1C1C1A]/60">
                      {item.organization}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-roboto font-light text-[#1C1C1A] tracking-tight mb-4">
                    {item.role}
                  </h3>

                  <p className="text-base font-roboto text-[#1C1C1A]/80 leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <ul className="flex flex-col gap-2 border-t border-[#1C1C1A]/10 pt-4">
                  {item.highlights.map((highlight, hIdx) => (
                    <li
                      key={hIdx}
                      className="flex items-start gap-3 text-sm font-roboto text-[#1C1C1A]/75"
                    >
                      <span className="w-1.5 h-1.5 bg-acento mt-2 shrink-0" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
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
      </section>

      {/* =====================================================================
          BLOQUE 03: HABILIDADES & CONOCIMIENTOS (Stack Técnico & Software)
      ===================================================================== */}
      <section
        id="habilidades"
        className="scroll-mt-24 max-w-6xl mx-auto px-6 md:px-16 py-12 md:py-20 border-b border-[#1C1C1A]/15"
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="font-roboto text-xs uppercase tracking-widest text-acento font-medium">
            03 / HABILIDADES
          </span>
          <span className="w-8 h-[1px] bg-acento" />
          <span className="font-roboto text-xs uppercase tracking-widest text-[#1C1C1A]/50">
            DOMINIO DIGITAL & SOFTWARE
          </span>
        </div>

        <div className="mb-12 md:mb-16 max-w-3xl">
          <h2 className="text-3xl sm:text-5xl font-roboto font-light tracking-tight text-[#1C1C1A] leading-tight mb-4">
            Habilidades & Conocimientos
          </h2>
          <p className="text-base md:text-lg font-roboto text-[#1C1C1A]/75 leading-relaxed">
            Dominio integral del ecosistema digital de arquitectura contemporánea, integrando flujos interoperables desde el modelado paramétrico BIM hasta el renderizado fotorrealista y la edición gráfica final.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {SKILL_CATEGORIES.map((group) => (
            <div
              key={group.code}
              className="border border-[#1C1C1A]/15 p-6 sm:p-8 bg-[#F8F7F4] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-roboto text-xs uppercase tracking-widest text-acento font-medium">
                    ÁREA {group.code}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-roboto font-normal text-[#1C1C1A] tracking-tight mb-3">
                  {group.category}
                </h3>

                <p className="text-sm font-roboto text-[#1C1C1A]/70 leading-relaxed mb-6">
                  {group.summary}
                </p>
              </div>

              <div className="flex flex-col divide-y divide-[#1C1C1A]/10 border-t border-[#1C1C1A]/10">
                {group.tools.map((tool) => (
                  <div
                    key={tool.name}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1"
                  >
                    <div>
                      <span className="font-roboto font-medium text-sm text-[#1C1C1A] block">
                        {tool.name}
                      </span>
                      <span className="font-roboto text-xs text-[#1C1C1A]/65 block">
                        {tool.focus}
                      </span>
                    </div>
                    <span className="font-roboto text-[11px] uppercase tracking-widest text-acento shrink-0 mt-1 sm:mt-0">
                      {tool.level}
                    </span>
                  </div>
                ))}
              </div>
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
