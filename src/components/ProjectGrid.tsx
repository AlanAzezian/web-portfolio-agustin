"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects, Project } from "@/data/projects";
import ProjectModal from "./ProjectModal";

export default function ProjectGrid() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <>
      <div className="max-w-6xl mx-auto px-6 py-32 min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
              className={`relative aspect-[3/4] cursor-pointer overflow-hidden group border-rule border-foreground bg-background ${
                i % 3 === 1 ? "md:mt-12" : i % 3 === 2 ? "md:mt-24" : ""
              }`}
              onClick={() => setSelectedProject(project)}
            >
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              
              {/* Card Number Corner */}
              <div className="absolute top-0 right-0 bg-background border-b-hairline border-l-hairline border-foreground px-3 py-1 font-mono text-xs z-10">
                N°{String(i + 1).padStart(2, '0')}
              </div>

              <motion.div 
                className="absolute inset-0 bg-background/95 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 z-20"
              >
                <div className="flex flex-col gap-2 mt-8 font-mono text-xs uppercase text-foreground/80">
                  <span className="border-b-hairline border-foreground/20 pb-1 flex justify-between">
                    <span>Categoría</span> <span>{project.category}</span>
                  </span>
                  <span className="border-b-hairline border-foreground/20 pb-1 flex justify-between">
                    <span>Año</span> <span>{project.year || "2026"}</span>
                  </span>
                  <span className="border-b-hairline border-foreground/20 pb-1 flex justify-between">
                    <span>Área</span> <span>{project.area || "N/A"} m²</span>
                  </span>
                </div>
                
                <h3 className="font-editorial text-5xl leading-[0.9] text-foreground -ml-1 overflow-hidden tracking-tighter">
                  {project.title}
                </h3>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
