"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/data/projects";

const FILTER_TAGS = ["ACADÉMICOS", "PROYECTOS", "SERVICIOS"] as const;

export default function ProjectGrid() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Proyectos filtrados según la etiqueta seleccionada
  const filteredProjects = useMemo(() => {
    if (!selectedTag) return projects;
    return projects.filter((p) => p.tags?.includes(selectedTag));
  }, [selectedTag]);

  return (
    <div className="w-full px-8 md:px-16 max-w-none pt-4 md:pt-6 pb-24 md:pb-32 min-h-screen">
      {/* Selector de 3 filtros centrado horizontalmente, sin contadores numéricos */}
      <div className="flex justify-center items-center gap-6 md:gap-10 mx-auto w-full h-6">
        {FILTER_TAGS.map((tag) => {
          const isSelected = selectedTag === tag;
          return (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag((curr) => (curr === tag ? null : tag))}
              className={`uppercase tracking-wider font-roboto transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "text-[15px] font-semibold font-[600] text-[#099AD7]"
                  : "text-[12px] font-medium font-[500] text-[#1C1C1A] hover:text-[#099AD7]"
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>

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

                {/* Título debajo con Roboto Medium (500), color base #1C1C1A, hover #099AD7, mt-2.5 */}
                <h2 className="mt-2.5 font-roboto font-medium font-[500] text-base md:text-lg tracking-tight text-[#1C1C1A] group-hover:text-[#099AD7] transition-colors duration-200">
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
