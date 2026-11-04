"use client";

/* eslint-disable @next/next/no-img-element */
import { useMemo, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { projects as fallbackProjects, type Project } from "@/data/projects";
import { supabase } from "@/lib/supabase";

const FILTER_TAGS = ["ACADÉMICOS", "PROYECTOS", "SERVICIOS"] as const;
type FilterTag = (typeof FILTER_TAGS)[number];

const TAG_TO_QUERY: Record<FilterTag, string> = {
  ACADÉMICOS: "ACADEMICOS",
  PROYECTOS: "PROYECTOS",
  SERVICIOS: "SERVICIOS",
};

const QUERY_TO_TAG: Record<string, FilterTag> = {
  ACADEMICOS: "ACADÉMICOS",
  ACADÉMICOS: "ACADÉMICOS",
  PROYECTOS: "PROYECTOS",
  SERVICIOS: "SERVICIOS",
};

export default function ProjectGrid() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [projectsList, setProjectsList] = useState<Project[]>(fallbackProjects);

  const catParam = searchParams.get("cat")?.toUpperCase() ?? null;
  const selectedTag: FilterTag | null =
    catParam && QUERY_TO_TAG[catParam] ? QUERY_TO_TAG[catParam] : null;

  useEffect(() => {
    let active = true;

    async function loadProjects() {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("order_index", { ascending: true });

        if (!active || error || !data || data.length === 0) return;

        const mapped: Project[] = data.map((row: Record<string, unknown>) => {
          const id = String(row.id || "");
          const coverImage = String(
            row.cover_image ||
              row.coverImage ||
              "/projects/centro-de-trasbordo/01-render-exterior.webp"
          );
          const rawImages = Array.isArray(row.images)
            ? (row.images as string[])
            : [];
          const images = rawImages.length > 0 ? rawImages : [coverImage];
          const tags = Array.isArray(row.tags)
            ? (row.tags as string[])
            : ["ACADÉMICOS", "PROYECTOS", "SERVICIOS"];

          return {
            id,
            title: String(row.title || id),
            coverImage,
            images,
            tags,
          };
        });

        setProjectsList(mapped);
      } catch {
        // Fallback silencioso a datos locales
      }
    }

    loadProjects();
    return () => {
      active = false;
    };
  }, []);

  const handleSelectTag = (tag: FilterTag) => {
    const nextTag = selectedTag === tag ? null : tag;
    if (!nextTag) {
      router.push(pathname, { scroll: false });
    } else {
      router.push(`${pathname}?cat=${TAG_TO_QUERY[nextTag]}`, { scroll: false });
    }

    if (typeof window !== "undefined" && window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 0.9 });
    }
  };

  // Proyectos filtrados según la etiqueta seleccionada
  const filteredProjects = useMemo(() => {
    if (!selectedTag) return projectsList;
    return projectsList.filter(
      (p) => !p.tags || p.tags.length === 0 || p.tags.includes(selectedTag)
    );
  }, [selectedTag, projectsList]);

  return (
    <div className="w-full px-6 md:px-12 lg:px-16 max-w-none pt-1 md:pt-2 pb-24 md:pb-28 min-h-[calc(100vh-5rem)] flex flex-col justify-between bg-[#FFFFFF] text-[#1C1C1A]">
      {/* Contenedor con columnas de mampostería continuas */}
      <div className="columns-1 sm:columns-2 lg:columns-4 gap-6 md:gap-8 [column-fill:_balance]">
        {filteredProjects.map((project) => (
          <div key={project.id} className="break-inside-avoid mb-8 group">
            {/* Tarjeta de Proyecto */}
            <Link
              className="block focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-acento"
              href={`/proyectos/${project.id}`}
            >
              {/* Contenedor de la Imagen con su proporción natural */}
              <div className="w-full overflow-hidden bg-neutral-100 border border-[#1C1C1A]/10">
                <img
                  src={project.coverImage || project.images[0]}
                  alt={project.title}
                  className="w-full h-auto object-contain block transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>

              {/* Título y metadatos debajo de la imagen */}
              <h3 className="mt-3 text-base md:text-[17px] font-roboto font-normal text-[#1C1C1A] group-hover:text-[#099AD7] transition-colors leading-snug">
                {project.title}
              </h3>
            </Link>
          </div>
        ))}
      </div>

      {/* Barra Inferior de Filtros alineada geométricamente con las 3 divisorias de la grilla de 4 columnas */}
      <footer
        role="navigation"
        aria-label="Filtros de proyectos"
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#E5E2DC] bg-[#FFFFFF]/90 backdrop-blur-md w-full px-6 md:px-12 lg:px-16"
      >
        <div className="flex justify-center items-center gap-6 lg:grid lg:grid-cols-4 lg:gap-[13.5px] relative py-4">
          {FILTER_TAGS.map((tag, idx) => {
            const isSelected = selectedTag === tag;
            const colStartClass =
              idx === 0
                ? "lg:col-start-2"
                : idx === 1
                  ? "lg:col-start-3"
                  : "lg:col-start-4";

            return (
              <div
                key={tag}
                className={`${colStartClass} flex justify-start items-center`}
              >
                <button
                  type="button"
                  onClick={() => handleSelectTag(tag)}
                  className={`lg:-ml-[6.75px] lg:-translate-x-1/2 relative inline-flex flex-col items-center justify-center text-[13px] uppercase tracking-wider font-roboto py-0.5 cursor-pointer transition-colors duration-200 whitespace-nowrap focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-acento ${
                    isSelected
                      ? "font-semibold font-[600] text-[#099AD7]"
                      : "font-medium font-[500] text-[#1C1C1A] hover:text-[#099AD7]"
                  }`}
                >
                  <span>{tag}</span>
                  {/* Reserva de ancho en peso 600 para mantener el eje de centrado fijo */}
                  <span
                    aria-hidden="true"
                    className="invisible text-[13px] font-semibold font-[600] h-0 overflow-hidden select-none pointer-events-none"
                  >
                    {tag}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </footer>
    </div>
  );
}
