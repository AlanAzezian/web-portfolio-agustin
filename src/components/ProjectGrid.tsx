"use client";

/* eslint-disable @next/next/no-img-element */
import { useMemo, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type { Project } from "@/data/projects";
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

// Función auxiliar para estimar la altura de una tarjeta según su aspect-ratio
const estimateItemHeight = (project: Project): number => {
  const isVertical =
    project.aspectRatio === "vertical" ||
    project.aspectRatio === "4/5" ||
    project.aspectRatio === "3/4";
  const isWide =
    project.aspectRatio === "wide" || project.aspectRatio === "16/9";

  if (isVertical) return 460;
  if (isWide) return 240;
  return 320; // proporción estándar 3:2 / 4:3
};

// Distribuir proyectos buscando siempre la columna con menor altura acumulada
const distributeProjects = (
  items: Project[],
  columnCount = 4,
  measuredHeights: Record<string, number> = {}
) => {
  const columns: Project[][] = Array.from({ length: columnCount }, () => []);
  const colHeights = new Array<number>(columnCount).fill(0);

  items.forEach((project) => {
    // 1. Encontrar cuál es la columna más corta en este instante
    let shortestColIndex = 0;
    let minHeight = colHeights[0];

    for (let i = 1; i < columnCount; i++) {
      if (colHeights[i] < minHeight) {
        minHeight = colHeights[i];
        shortestColIndex = i;
      }
    }

    // 2. Colocar el proyecto en la columna más vacía
    columns[shortestColIndex].push(project);

    // 3. Sumar la altura de la tarjeta a esa columna
    const height =
      measuredHeights[project.id] ||
      project.height ||
      estimateItemHeight(project);
    colHeights[shortestColIndex] += height;
  });

  return columns;
};

export default function ProjectGrid() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [measuredHeights, setMeasuredHeights] = useState<Record<string, number>>(
    {}
  );

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

        if (!active) return;

        if (error || !data || data.length === 0) {
          setProjectsList([]);
          return;
        }

        const mapped: Project[] = data
          .map((row: Record<string, unknown>) => {
            const id = String(row.id || "");
            const rawImages = Array.isArray(row.images)
              ? (row.images as string[]).filter(Boolean)
              : [];
            const coverImage = String(
              row.cover_image || row.coverImage || rawImages[0] || ""
            );
            const images =
              rawImages.length > 0
                ? rawImages
                : coverImage
                  ? [coverImage]
                  : [];
            const tags = Array.isArray(row.tags)
              ? (row.tags as string[])
              : ["ACADÉMICOS", "PROYECTOS", "SERVICIOS"];
            const aspectRatio =
              typeof row.aspect_ratio === "string"
                ? row.aspect_ratio
                : typeof row.aspectRatio === "string"
                  ? row.aspectRatio
                  : undefined;
            const height =
              typeof row.height === "number" ? row.height : undefined;

            return {
              id,
              title: String(row.title || id),
              coverImage,
              images,
              tags,
              aspectRatio,
              height,
            };
          })
          .filter((p) => Boolean(p.id && p.coverImage));

        setProjectsList(mapped);
      } catch {
        if (active) setProjectsList([]);
      } finally {
        if (active) setIsLoading(false);
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

  const desktopCols = useMemo(
    () => distributeProjects(filteredProjects, 4, measuredHeights),
    [filteredProjects, measuredHeights]
  );

  if (isLoading && projectsList.length === 0) {
    return <div className="w-full min-h-[calc(100vh-5rem)] bg-[#FFFFFF]" />;
  }

  return (
    <div className="w-full px-6 md:px-12 lg:px-16 max-w-none pt-1 md:pt-2 pb-24 md:pb-28 min-h-[calc(100vh-5rem)] flex flex-col justify-between bg-[#FFFFFF] text-[#1C1C1A]">
      {/* Grilla Masonry inteligente que asigna cada proyecto a la columna más corta */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[13.5px] items-start">
        {desktopCols.map((colProjects, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-6 md:gap-8">
            {colProjects.map((project) => (
              <div key={project.id} className="group w-full">
                <Link
                  className="block focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-acento"
                  href={`/proyectos/${project.id}`}
                >
                  <div className="w-full overflow-hidden bg-neutral-100 border border-[#1C1C1A]/10">
                    <img
                      src={project.coverImage || project.images?.[0]}
                      alt={project.title}
                      className="w-full h-auto object-contain block transition-transform duration-500 group-hover:scale-[1.02]"
                      loading="lazy"
                      onLoad={(e) => {
                        const { naturalWidth, naturalHeight } = e.currentTarget;
                        if (naturalWidth > 0 && naturalHeight > 0) {
                          const computedHeight =
                            Math.round((naturalHeight / naturalWidth) * 400) +
                            60;
                          setMeasuredHeights((prev) =>
                            prev[project.id] === computedHeight
                              ? prev
                              : { ...prev, [project.id]: computedHeight }
                          );
                        }
                      }}
                    />
                  </div>
                  <h3 className="mt-3 text-base md:text-[17px] font-roboto font-medium text-[#1C1C1A] group-hover:text-[#099AD7] transition-colors duration-200 leading-snug tracking-tight">
                    {project.title}
                  </h3>
                </Link>
              </div>
            ))}
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
