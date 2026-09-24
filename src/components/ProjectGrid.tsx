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
              className={`relative aspect-[3/4] cursor-pointer overflow-hidden group ${
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
              <motion.div 
                className="absolute inset-0 bg-[#F8F7F4]/90 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 text-center"
              >
                <span className="text-xs text-[#8C5E48] uppercase tracking-widest mb-3">{project.category}</span>
                <h3 className="text-2xl font-light text-[#1C1C1A]">{project.title}</h3>
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
