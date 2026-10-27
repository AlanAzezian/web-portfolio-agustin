"use client";

import { useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { projects } from "@/data/projects";
import { gsap, ScrollTrigger } from "@/lib/gsap";

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

  const filterBarRef = useRef<HTMLElement>(null);
  const filterBtnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);
  const revealedImagesRef = useRef<Set<string>>(new Set());

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
    if (!selectedTag) return projects;
    return projects.filter((p) => p.tags?.includes(selectedTag));
  }, [selectedTag]);

  // Animación elástica con GSAP en la barra inferior de 3 extremos
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

        gsap.to(el, {
          scale: isSelected ? 1.2 : 1,
          duration: prefersReducedMotion ? 0 : isSelected ? 0.45 : 0.25,
          ease: isSelected ? "back.out(1.6)" : "power2.out",
          overwrite: "auto",
        });
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
            duration: 0.45,
            stagger: 0.06,
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
              duration: 0.6,
              stagger: 0.06,
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
    <div className="w-full px-6 md:px-12 lg:px-16 max-w-none pt-1 md:pt-2 pb-24 md:pb-28 min-h-[calc(100vh-5rem)] flex flex-col justify-between bg-[#FFFFFF] text-[#1C1C1A]">
      {/* Retícula de 4 columnas que arranca inmediatamente debajo del header */}
      <div
        ref={gridRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[13.5px] items-start"
      >
        {filteredProjects.map((project) => (
          <div key={project.id} className="w-full">
            <Link
              href={`/proyectos/${project.id}`}
              data-project-id={project.id}
              className="project-card-reveal group flex flex-col w-full focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-acento"
            >
              {/* Portada con aspect ratio intrínseco flexible */}
              <div className="project-image-mask relative w-full overflow-hidden bg-[#FFFFFF]">
                <Image
                  src={project.coverImage}
                  alt={project.title}
                  width={1600}
                  height={1067}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="w-full h-auto object-contain block"
                />
              </div>

              {/* Título debajo con Roboto Medium (500), color base #1C1C1A, hover #099AD7 */}
              <h2 className="mt-2.5 font-roboto font-medium font-[500] text-base md:text-lg tracking-tight text-[#1C1C1A] group-hover:text-acento transition-colors duration-200">
                {project.title}
              </h2>
            </Link>
          </div>
        ))}
      </div>

      {/* Barra Inferior de Filtros en 3 extremos (Izquierda, Centro, Derecha) estilo Oficina Correa */}
      <footer
        ref={filterBarRef}
        role="navigation"
        aria-label="Filtros de proyectos"
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#E5E2DC] bg-[#FFFFFF]/90 backdrop-blur-md w-full flex justify-between items-center px-6 md:px-12 lg:px-16 py-4"
      >
        {FILTER_TAGS.map((tag, idx) => {
          const isSelected = selectedTag === tag;
          const originClass =
            idx === 0
              ? "origin-left items-start"
              : idx === 1
                ? "origin-center items-center"
                : "origin-right items-end";

          return (
            <button
              key={tag}
              ref={(el) => {
                filterBtnRefs.current[idx] = el;
              }}
              type="button"
              onClick={() => handleSelectTag(tag)}
              className={`relative inline-flex flex-col justify-center ${originClass} uppercase tracking-wider font-roboto px-1 transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-acento ${
                isSelected
                  ? "text-[16px] font-semibold font-[600] text-[#099AD7]"
                  : "text-[13px] font-medium font-[500] text-[#1C1C1A] hover:text-[#099AD7]"
              }`}
            >
              <span>{tag}</span>
              {/* Reserva de ancho en el tamaño activo (16px semibold) para no mover vecinos */}
              <span
                aria-hidden="true"
                className="invisible text-[16px] font-semibold font-[600] h-0 overflow-hidden select-none pointer-events-none"
              >
                {tag}
              </span>
            </button>
          );
        })}
      </footer>
    </div>
  );
}
