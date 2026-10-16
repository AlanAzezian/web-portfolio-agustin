"use client";

import { useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { projects, blurDataMap, DEFAULT_BLUR_DATA_URL } from "@/data/projects";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { NAV_ACTIVE_DOT } from "@/components/Navbar";

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

  const catParam = searchParams.get("cat")?.toUpperCase() ?? null;
  const selectedTag: FilterTag | null =
    catParam && QUERY_TO_TAG[catParam] ? QUERY_TO_TAG[catParam] : null;

  const filterBarRef = useRef<HTMLDivElement>(null);
  const filterBtnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const filterDotRef = useRef<HTMLSpanElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const revealedImagesRef = useRef<Set<string>>(new Set());

  const handleSelectTag = (tag: FilterTag) => {
    const nextTag = selectedTag === tag ? null : tag;
    if (!nextTag) {
      router.push(pathname, { scroll: false });
    } else {
      router.push(`${pathname}?cat=${TAG_TO_QUERY[nextTag]}`, { scroll: false });
    }
  };

  // Proyectos filtrados según la etiqueta seleccionada
  const filteredProjects = useMemo(() => {
    if (!selectedTag) return projects;
    return projects.filter((p) => p.tags?.includes(selectedTag));
  }, [selectedTag]);

  // Animación de estado activo en los filtros con GSAP
  useEffect(() => {
    if (!filterBarRef.current) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      FILTER_TAGS.forEach((tag, idx) => {
        const el = filterBtnRefs.current[idx];
        if (!el) return;
        const isSelected = selectedTag === tag;

        if (!NAV_ACTIVE_DOT) {
          gsap.to(el, {
            scale: isSelected ? 1.25 : 1,
            duration: prefersReducedMotion ? 0 : isSelected ? 0.45 : 0.25,
            ease: isSelected ? "back.out(1.6)" : "power2.out",
            overwrite: "auto",
          });
        } else {
          gsap.set(el, { scale: 1 });
          if (isSelected && filterDotRef.current && filterBarRef.current) {
            const barRect = filterBarRef.current.getBoundingClientRect();
            const btnRect = el.getBoundingClientRect();
            const targetX = btnRect.left - barRect.left + btnRect.width / 2 - 3;
            gsap.to(filterDotRef.current, {
              x: targetX,
              opacity: 1,
              duration: prefersReducedMotion ? 0 : 0.4,
              ease: "power3.out",
              overwrite: "auto",
            });
          } else if (!selectedTag && filterDotRef.current) {
            gsap.to(filterDotRef.current, {
              opacity: 0,
              duration: 0.2,
              overwrite: "auto",
            });
          }
        }
      });
    }, filterBarRef);

    return () => ctx.revert();
  }, [selectedTag]);

  // Reveal de tarjetas con ScrollTrigger.batch y clip-path en primera aparición
  useEffect(() => {
    if (!gridRef.current) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".project-card-reveal");
      if (cards.length === 0) return;

      if (prefersReducedMotion) {
        gsap.set(cards, { opacity: 1, y: 0 });
        cards.forEach((card) => {
          const mask = card.querySelector<HTMLElement>(".project-image-mask");
          if (mask) {
            gsap.set(mask, { clipPath: "inset(0% 0% 0% 0%)" });
          }
        });
        return;
      }

      gsap.set(cards, { opacity: 0, y: 16 });

      cards.forEach((card) => {
        const projectId = card.dataset.projectId;
        const mask = card.querySelector<HTMLElement>(".project-image-mask");
        if (mask) {
          if (projectId && !revealedImagesRef.current.has(projectId)) {
            gsap.set(mask, { clipPath: "inset(100% 0% 0% 0%)" });
          } else {
            gsap.set(mask, { clipPath: "inset(0% 0% 0% 0%)" });
          }
        }
      });

      ScrollTrigger.batch(cards, {
        start: "top 92%",
        once: true,
        onEnter: (batch) => {
          const elements = batch as HTMLElement[];
          gsap.to(elements, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
            overwrite: "auto",
          });

          const firstTimeMasks: HTMLElement[] = [];
          elements.forEach((el) => {
            const projectId = el.dataset.projectId;
            const mask = el.querySelector<HTMLElement>(".project-image-mask");
            if (mask && projectId && !revealedImagesRef.current.has(projectId)) {
              revealedImagesRef.current.add(projectId);
              firstTimeMasks.push(mask);
            }
          });

          if (firstTimeMasks.length > 0) {
            gsap.to(firstTimeMasks, {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 0.7,
              stagger: 0.08,
              ease: "power3.out",
              overwrite: "auto",
            });
          }
        },
      });

      ScrollTrigger.refresh();
    }, gridRef);

    return () => ctx.revert();
  }, [filteredProjects]);

  return (
    <div className="w-full px-8 md:px-16 max-w-none pt-4 md:pt-6 pb-24 md:pb-32 min-h-screen">
      {/* Selector de 3 filtros centrado horizontalmente, sin contadores numéricos */}
      <div
        ref={filterBarRef}
        className="relative flex justify-center items-center gap-8 md:gap-12 mx-auto w-full h-6"
      >
        {FILTER_TAGS.map((tag, idx) => {
          const isSelected = selectedTag === tag;
          return (
            <button
              key={tag}
              ref={(el) => {
                filterBtnRefs.current[idx] = el;
              }}
              type="button"
              onClick={() => handleSelectTag(tag)}
              className={`relative inline-flex flex-col items-center justify-center origin-center uppercase tracking-wider font-roboto text-[12px] px-1 transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-acento ${
                isSelected
                  ? "font-semibold font-[600] text-acento"
                  : "font-medium font-[500] text-[#1C1C1A] hover:text-acento"
              }`}
            >
              <span>{tag}</span>
              <span
                aria-hidden="true"
                className="invisible font-semibold font-[600] h-0 overflow-hidden select-none pointer-events-none"
              >
                {tag}
              </span>
            </button>
          );
        })}
        {NAV_ACTIVE_DOT && (
          <span
            ref={filterDotRef}
            aria-hidden="true"
            className="absolute -bottom-2 left-0 w-1.5 h-1.5 rounded-full bg-acento opacity-0 pointer-events-none"
          />
        )}
      </div>

      {/* Retícula de 4 columnas con métricas exactas Adamo-Faiden: gap de 13.5px y mt de 23px */}
      <div
        ref={gridRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[13.5px] mt-[23px]"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div key={project.id} layout className="w-full">
              <Link
                href={`/proyectos/${project.id}`}
                data-project-id={project.id}
                className="project-card-reveal group flex flex-col w-full focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-acento"
              >
                {/* Portadas a ancho completo de celda, aspect 3:2 y max-h 310px */}
                <div className="project-image-mask relative w-full aspect-[3/2] max-h-[310px] overflow-hidden bg-[#F8F7F4]">
                  <Image
                    src={project.coverImage}
                    alt={project.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    placeholder="blur"
                    blurDataURL={
                      blurDataMap[project.coverImage] ?? DEFAULT_BLUR_DATA_URL
                    }
                    className="object-cover block"
                  />
                </div>

                {/* Título debajo con Roboto Medium (500), color base #1C1C1A, hover #099AD7, mt-2.5 */}
                <h2 className="mt-2.5 font-roboto font-medium font-[500] text-base md:text-lg tracking-tight text-[#1C1C1A] group-hover:text-acento transition-colors duration-200">
                  {project.title}
                </h2>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
