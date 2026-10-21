"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { blurDataMap, DEFAULT_BLUR_DATA_URL } from "@/data/projects";

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
  return (
    <div className="w-full bg-[#F8F7F4] text-[#1C1C1A] font-roboto pt-20">
      {/* =====================================================================
          BLOQUE 01: SOBRE MÍ (Declaración de perfil, filosofía y enfoque)
      ===================================================================== */}
      <section className="max-w-6xl mx-auto px-6 md:px-16 py-12 md:py-20 border-b border-[#1C1C1A]/15">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="font-roboto text-xs uppercase tracking-widest text-acento font-medium">
              01 / SOBRE MÍ
            </span>
            <span className="w-8 h-[1px] bg-acento" />
            <span className="font-roboto text-xs uppercase tracking-widest text-[#1C1C1A]/50">
              PERFIL & ENFOQUE PROYECTUAL
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-roboto font-light leading-[0.95] tracking-tighter text-[#1C1C1A] mb-10 md:mb-14 max-w-4xl">
            Arquitectura pensada desde la precisión constructiva y la atmósfera espacial.
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 items-start">
            <div className="lg:col-span-7 flex flex-col gap-6">
              <p className="text-lg md:text-2xl font-roboto font-light leading-relaxed text-[#1C1C1A]">
                Soy <strong className="font-medium">Agustín Fabrizio</strong>, estudiante avanzado de Arquitectura próximo a graduarse en la{" "}
                <span className="text-acento font-normal">
                  Facultad de Arquitectura, Diseño y Urbanismo (FADU, UBA)
                </span>
                .
              </p>
              <p className="text-base md:text-lg font-roboto text-[#1C1C1A]/80 leading-relaxed">
                Mi enfoque proyectual articula la racionalidad tectónica y estructural con una búsqueda sensible sobre el comportamiento de la luz natural, las proporciones y la honestidad de los materiales. Entiendo cada proyecto como una síntesis entre la respuesta urbana, la claridad programática y el rigor del detalle técnico.
              </p>
              <p className="text-base md:text-lg font-roboto text-[#1C1C1A]/80 leading-relaxed">
                En paralelo a la práctica proyectual, me especializo en visualización arquitectónica hiperrealista y modelado BIM, acompañando a estudios y profesionales a traducir ideas complejas en documentación precisa e imágenes capaces de transmitir la experiencia del espacio antes de ser construido.
              </p>
            </div>

            {/* Ficha Editorial Lateral */}
            <div className="lg:col-span-5 border border-[#1C1C1A]/15 p-6 md:p-8 bg-[#F8F7F4] flex flex-col gap-6">
              <span className="font-roboto text-xs uppercase tracking-widest text-acento">
                FICHA DE PERFIL
              </span>

              <div className="flex flex-col divide-y divide-[#1C1C1A]/10 text-sm">
                <div className="py-3.5 flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="uppercase tracking-wider text-xs text-[#1C1C1A]/50">
                    Formación
                  </span>
                  <span className="font-medium text-[#1C1C1A] sm:text-right">
                    Arquitectura — FADU, UBA (Etapa Final)
                  </span>
                </div>
                <div className="py-3.5 flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="uppercase tracking-wider text-xs text-[#1C1C1A]/50">
                    Especialidad
                  </span>
                  <span className="font-medium text-[#1C1C1A] sm:text-right">
                    Proyecto, Visualización 3D & BIM
                  </span>
                </div>
                <div className="py-3.5 flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="uppercase tracking-wider text-xs text-[#1C1C1A]/50">
                    Ubicación
                  </span>
                  <span className="font-medium text-[#1C1C1A] sm:text-right">
                    Buenos Aires, Argentina
                  </span>
                </div>
                <div className="py-3.5 flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="uppercase tracking-wider text-xs text-[#1C1C1A]/50">
                    Disponibilidad
                  </span>
                  <span className="font-medium text-acento sm:text-right">
                    Proyectos & Colaboraciones con Estudios
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
      <section className="max-w-6xl mx-auto px-6 md:px-16 py-12 md:py-20 border-b border-[#1C1C1A]/15">
        <div className="flex items-center gap-3 mb-4">
          <span className="font-roboto text-xs uppercase tracking-widest text-acento font-medium">
            02 / TRAYECTORIA
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
          {EXPERIENCE_ITEMS.map((item, idx) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
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
                  <div className="relative w-full aspect-[3/2] overflow-hidden bg-[#1C1C1A]/5">
                    <Image
                      src={item.image}
                      alt={item.imageCaption}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      placeholder="blur"
                      blurDataURL={blurDataMap[item.image] ?? DEFAULT_BLUR_DATA_URL}
                      className="object-cover"
                    />
                  </div>
                  <p className="mt-2.5 font-roboto text-[11px] uppercase tracking-wider text-[#1C1C1A]/60 leading-snug">
                    {item.imageCaption}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* =====================================================================
          BLOQUE 03: HABILIDADES & CONOCIMIENTOS (Stack Técnico & Software)
      ===================================================================== */}
      <section className="max-w-6xl mx-auto px-6 md:px-16 py-12 md:py-20 border-b border-[#1C1C1A]/15">
        <div className="flex items-center gap-3 mb-4">
          <span className="font-roboto text-xs uppercase tracking-widest text-acento font-medium">
            03 / CAPACIDADES TÉCNICAS
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
