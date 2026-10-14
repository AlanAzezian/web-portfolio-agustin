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
    <div className="w-full px-6 md:px-12 lg:px-16 max-w-none py-28 md:py-32 min-h-screen">
      {/* Selector de tags / filtros preparado en la parte superior */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-10">
          <button
            type="button"
            onClick={() => setSelectedTag(null)}
            className={`text-xs uppercase tracking-widest font-mono transition-colors duration-200 cursor-pointer ${
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
                className={`text-xs uppercase tracking-widest font-mono transition-colors duration-200 cursor-pointer ${
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

      {/* Retícula de 4 columnas a ancho completo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
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
                {/* Contenedor de la portada respetando la proporción natural */}
                <div className="w-full overflow-hidden bg-[#F8F7F4]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-[1.02] block"
                  />
                </div>

                {/* Título debajo de la imagen con hover al celeste acento */}
                <h2 className="mt-3.5 text-sm md:text-base font-normal tracking-tight text-[#1C1C1A] group-hover:text-[#099AD7] transition-colors duration-200">
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
