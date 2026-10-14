"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/data/projects";

export default function ProjectGrid() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Obtener lista única de tags a partir de los proyectos disponibles
  const allTags = useMemo(() => {
    return Array.from(new Set(projects.flatMap((p) => p.tags || [])));
  }, []);

  // Proyectos filtrados según la etiqueta seleccionada
  const filteredProjects = useMemo(() => {
    if (!selectedTag) return projects;
    return projects.filter((p) => p.tags?.includes(selectedTag));
  }, [selectedTag]);

  return (
    <div className="w-full px-8 md:px-16 max-w-none pt-4 md:pt-6 pb-24 md:pb-32 min-h-screen">
      {/* Selector de tags / filtros preparado en la parte superior (compactado respecto al Navbar) */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-4 md:gap-6">
          <button
            type="button"
            onClick={() => setSelectedTag(null)}
            className={`text-xs uppercase tracking-wider font-unica transition-colors duration-200 cursor-pointer ${
              selectedTag === null
                ? "text-[#099AD7] font-bold"
                : "text-[#686661] font-normal hover:text-[#099AD7]"
            }`}
          >
            Todos ({projects.length})
          </button>
          {allTags.map((tag) => {
            const count = projects.filter((p) => p.tags?.includes(tag)).length;
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag((curr) => (curr === tag ? null : tag))}
                className={`text-xs uppercase tracking-wider font-unica transition-colors duration-200 cursor-pointer ${
                  isSelected
                    ? "text-[#099AD7] font-bold"
                    : "text-[#686661] font-normal hover:text-[#099AD7]"
                }`}
              >
                {tag} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Retícula de 4 columnas con métricas exactas Adamo-Faiden: gap de 13.5px y mt de 23px */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[13.5px] mt-[23px]">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, i) => (
            <Link href={`/proyectos/${project.id}`} key={project.id} className="group block w-full">
              <motion.div
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05, duration: 0.4, ease: "easeOut" }}
                className="flex flex-col w-full"
              >
                {/* Portadas a ancho completo de celda, aspect 3:2 y max-h 310px */}
                <div className="w-full aspect-[3/2] max-h-[310px] overflow-hidden bg-[#F8F7F4]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="w-full h-full max-h-[310px] object-cover transition-transform duration-500 group-hover:scale-[1.02] block"
                  />
                </div>

                {/* Título debajo con métricas Adamo-Faiden: font-unica, 21.12px, line-height 25.344px, color base #999999, hover #099AD7, mt-2.5 */}
                <h2 className="mt-2.5 font-unica text-[18px] md:text-[21.12px] leading-[22px] md:leading-[25.344px] tracking-tight text-[#999999] group-hover:text-[#099AD7] transition-colors duration-200">
                  {project.title}
                </h2>
              </motion.div>
            </Link>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
