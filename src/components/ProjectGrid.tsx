"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { projects, Project } from "@/data/projects";
import ProjectModal from "./ProjectModal";

export default function ProjectGrid() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const projectId = searchParams.get("proyecto");
    if (projectId) {
      const proj = projects.find(p => p.id === projectId);
      if (proj) setSelectedProject(proj);
    }
  }, [searchParams]);

  const handleClose = () => {
    setSelectedProject(null);
    if (searchParams.has("proyecto")) {
      router.replace("/proyectos", { scroll: false });
    }
  };

  const aspectRatios = ["aspect-[16/9]", "aspect-[3/4]", "aspect-[4/3]", "aspect-[2/3]", "aspect-[3/2]"];

  return (
    <>
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-32 min-h-screen">
        <div className="columns-1 md:columns-2 lg:columns-3 2xl:columns-4 gap-8">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (i % 8) * 0.1, duration: 0.5, ease: "easeOut" }}
              className={`relative w-full overflow-hidden cursor-pointer group bg-background break-inside-avoid mb-8 ${aspectRatios[i % aspectRatios.length]}`}
              onClick={() => setSelectedProject(project)}
            >
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1400px) 33vw, 25vw"
              />

              <motion.div 
                className="absolute inset-0 bg-background/95 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 z-20"
              >
                <div className="flex flex-col gap-2 mt-8 font-mono text-xs uppercase text-foreground/80">
                  <span className="pb-1 flex justify-between">
                    <span>CategorÃ­a</span> <span>{project.category}</span>
                  </span>
                  <span className="pb-1 flex justify-between">
                    <span>AÃ±o</span> <span>{project.year || "2026"}</span>
                  </span>
                  <span className="pb-1 flex justify-between">
                    <span>Ãrea</span> <span>{project.area || "N/A"} mÂ²</span>
                  </span>
                </div>
                
                <h3 className="font-sans font-light text-4xl lg:text-5xl leading-[0.9] text-foreground -ml-1 overflow-hidden tracking-tighter">
                  {project.title}
                </h3>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={handleClose} />
        )}
      </AnimatePresence>
    </>
  );
}



