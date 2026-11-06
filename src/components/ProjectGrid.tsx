"use client";

/* eslint-disable @next/next/no-img-element */
import { useMemo, useEffect, useLayoutEffect, useState, useRef } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  DEFAULT_PROJECT_FILTERS,
  normalizeFilterLabel,
  normalizeFilterSlug,
  parseProjectImagesAndMeta,
  type Project,
} from "@/data/projects";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { supabase } from "@/lib/supabase";

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
const distributeProjects = (items: Project[], columnCount = 4) => {
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

    // 3. Sumar la altura estimada de la tarjeta a esa columna
    const height = project.height || estimateItemHeight(project);
    colHeights[shortestColIndex] += height;
  });

  return columns;
};

export default function ProjectGrid() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const gridContainerRef = useRef<HTMLDivElement>(null);

  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [filterTags, setFilterTags] = useState<string[]>([
    ...DEFAULT_PROJECT_FILTERS,
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadProjectsAndFilters() {
      try {
        const [projectsRes, filtersRes] = await Promise.all([
          supabase
            .from("projects")
            .select("*")
            .order("order_index", { ascending: true }),
          supabase
            .from("bio")
            .select("manifesto")
            .eq("id", "project_filters")
            .maybeSingle(),
        ]);

        if (!active) return;

        let configuredFilters: string[] = [...DEFAULT_PROJECT_FILTERS];
        if (!filtersRes.error && filtersRes.data?.manifesto) {
          try {
            const parsed = JSON.parse(String(filtersRes.data.manifesto));
            if (Array.isArray(parsed) && parsed.length > 0) {
              const cleaned = parsed
                .filter(
                  (t): t is string => typeof t === "string" && t.trim() !== ""
                )
                .map(normalizeFilterLabel);
              if (cleaned.length > 0) {
                configuredFilters = Array.from(new Set(cleaned));
              }
            }
          } catch {
            // Fallback a filtros predeterminados
          }
        }

        if (
          projectsRes.error ||
          !projectsRes.data ||
          projectsRes.data.length === 0
        ) {
          setFilterTags(configuredFilters);
          setProjectsList([]);
          return;
        }

        const extraTagsFromProjects = new Set<string>(configuredFilters);

        const mapped: Project[] = projectsRes.data
          .map((row: Record<string, unknown>) => {
            const id = String(row.id || "");
            const { cleanImages, category, tags, showInMainGrid } =
              parseProjectImagesAndMeta(row);
            const coverImage = String(
              row.cover_image || row.coverImage || cleanImages[0] || ""
            );
            const images =
              cleanImages.length > 0
                ? cleanImages
                : coverImage
                  ? [coverImage]
                  : [];

            if (category) {
              extraTagsFromProjects.add(normalizeFilterLabel(category));
            }
            tags.forEach((t) => {
              if (t) extraTagsFromProjects.add(normalizeFilterLabel(t));
            });

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
              category,
              showInMainGrid,
              aspectRatio,
              height,
            };
          })
          .filter((p) => Boolean(p.id && p.coverImage));

        setFilterTags(Array.from(extraTagsFromProjects));
        setProjectsList(mapped);
      } catch {
        if (active) setProjectsList([]);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadProjectsAndFilters();
    return () => {
      active = false;
    };
  }, []);

  const catParam = searchParams.get("cat");
  const selectedTag = useMemo(() => {
    if (!catParam) return null;
    const targetSlug = normalizeFilterSlug(catParam);
    const matched = filterTags.find(
      (tag) =>
        normalizeFilterSlug(tag) === targetSlug ||
        normalizeFilterLabel(tag) === normalizeFilterLabel(catParam)
    );
    return matched || normalizeFilterLabel(catParam);
  }, [catParam, filterTags]);

  const handleSelectTag = (tag: string) => {
    const nextTag = selectedTag === tag ? null : tag;
    if (!nextTag) {
      router.push(pathname, { scroll: false });
    } else {
      router.push(
        `${pathname}?cat=${encodeURIComponent(normalizeFilterSlug(nextTag))}`,
        { scroll: false }
      );
    }

    if (typeof window !== "undefined" && window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 0.9 });
    }
  };

  // Precarga en segundo plano de la primera imagen de la galería al hacer hover en una tarjeta
  const handleCardMouseEnter = (project: Project) => {
    if (typeof window === "undefined") return;
    const firstSlide = project.images?.[0] || project.coverImage;
    if (firstSlide) {
      const preloadImg = new window.Image();
      preloadImg.src = firstSlide;
    }
  };

  // Proyectos filtrados respetando show_in_main_grid cuando no hay filtro seleccionado
  const filteredProjects = useMemo(() => {
    if (!selectedTag) {
      return projectsList.filter((p) => p.showInMainGrid !== false);
    }
    const targetSlug = normalizeFilterSlug(selectedTag);
    return projectsList.filter((p) => {
      const catMatch =
        p.category && normalizeFilterSlug(p.category) === targetSlug;
      const tagMatch =
        Array.isArray(p.tags) &&
        p.tags.some((t) => normalizeFilterSlug(t) === targetSlug);
      return Boolean(catMatch || tagMatch);
    });
  }, [selectedTag, projectsList]);

  const desktopCols = useMemo(
    () => distributeProjects(filteredProjects, 4),
    [filteredProjects]
  );

  // Animación de entrada horizontal sobre el 100% de las tarjetas renderizadas
  useLayoutEffect(() => {
    if (isLoading || filteredProjects.length === 0 || !gridContainerRef.current)
      return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".project-card");
      if (cards.length === 0) return;

      if (prefersReducedMotion) {
        gsap.set(cards, { opacity: 1, x: 0 });
        return;
      }

      gsap.fromTo(
        cards,
        { opacity: 0, x: -24 },
        {
          opacity: 1,
          x: 0,
          duration: 0.45,
          stagger: 0.04,
          ease: "power2.out",
          clearProps: "all",
          onComplete: () => {
            ScrollTrigger.refresh();
          },
        }
      );
    }, gridContainerRef);

    return () => ctx.revert();
  }, [isLoading, selectedTag, filteredProjects]);

  if (isLoading && projectsList.length === 0) {
    return <div className="w-full min-h-[calc(100vh-5rem)] bg-[#FFFFFF]" />;
  }

  return (
    <div className="w-full px-6 md:px-12 lg:px-16 max-w-none pt-1 md:pt-2 pb-24 md:pb-28 min-h-[calc(100vh-5rem)] flex flex-col justify-between bg-[#FFFFFF] text-[#1C1C1A]">
      {/* Grilla Masonry inteligente que asigna cada proyecto a la columna más corta */}
      <div
        ref={gridContainerRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[13.5px] items-start"
      >
        {desktopCols.map((colProjects, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-6 md:gap-8">
            {colProjects.map((project) => (
              <div
                key={project.id}
                data-project-id={project.id}
                onMouseEnter={() => handleCardMouseEnter(project)}
                className="project-card project-card-reveal group w-full"
              >
                <Link
                  className="block focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-acento"
                  href={`/proyectos/${project.id}`}
                >
                  <div className="w-full overflow-hidden bg-neutral-100 border border-[#1C1C1A]/10">
                    <img
                      src={project.coverImage || project.images?.[0]}
                      alt={project.title}
                      className="w-full h-auto object-contain block"
                      loading="lazy"
                      onLoad={() => {
                        requestAnimationFrame(() => {
                          ScrollTrigger.refresh();
                        });
                      }}
                    />
                  </div>
                  <h3 className="mt-3 text-base md:text-[17px] font-roboto font-medium text-[#1C1C1A] group-hover:text-[#099AD7] hover:text-[#099AD7] transition-colors duration-200 leading-snug tracking-tight">
                    {project.title}
                  </h3>
                </Link>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Barra Inferior de Filtros con separación generosa */}
      <footer
        role="navigation"
        aria-label="Filtros de proyectos"
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#E5E2DC] bg-[#FFFFFF]/90 backdrop-blur-md w-full"
      >
        <div className="w-full flex flex-wrap justify-center items-center gap-8 md:gap-12 lg:gap-14 py-4 px-6">
          {filterTags.map((tag) => {
            const isSelected = selectedTag === tag;

            return (
              <button
                key={tag}
                type="button"
                onClick={() => handleSelectTag(tag)}
                className={`relative inline-flex flex-col items-center justify-center uppercase tracking-wider font-roboto py-0.5 cursor-pointer transition-all duration-200 whitespace-nowrap focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-acento ${
                  isSelected
                    ? "text-[14px] md:text-[15px] font-semibold font-[600] text-[#099AD7]"
                    : "text-[12px] md:text-[12.5px] font-medium font-[500] text-[#1C1C1A] hover:text-[#099AD7]"
                }`}
              >
                <span>{tag}</span>
              </button>
            );
          })}
        </div>
      </footer>
    </div>
  );
}
