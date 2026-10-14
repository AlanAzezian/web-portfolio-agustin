"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { projects } from "@/data/projects";

export default function ProjectGrid() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-32 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
        {projects.map((project, i) => (
          <Link href={`/proyectos/${project.id}`} key={project.id} className="group block w-full">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: "easeOut" }}
              className="flex flex-col w-full"
            >
              {/* Contenedor de la portada del proyecto sin overlays */}
              <div className="w-full overflow-hidden bg-[#F8F7F4]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-[1.02] block"
                />
              </div>

              {/* Título debajo de la imagen */}
              <h2 className="mt-3.5 text-sm md:text-base font-normal tracking-tight text-[#1C1C1A] group-hover:text-[#099AD7] transition-colors duration-200">
                {project.title}
              </h2>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
