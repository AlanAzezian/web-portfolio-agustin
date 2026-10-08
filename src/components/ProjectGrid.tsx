"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { projects } from "@/data/projects";

export default function ProjectGrid() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-32 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
        {projects.map((project, i) => (
          <Link href={`/proyectos/${project.id}`} key={project.id} className="w-full block">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }}
              className="relative w-full overflow-hidden cursor-pointer group flex flex-col items-center bg-[#F8F7F4]"
            >
              <img
                src={project.coverImage}
                alt={project.title}
                className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-[1.03] block"
              />

              <motion.div 
                className="absolute inset-0 bg-[#F8F7F4]/90 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-8 z-20 text-center"
              >
                <h3 className="font-sans font-light text-2xl md:text-3xl leading-tight text-[#1C1C1A] tracking-tight">
                  {project.title}
                </h3>
                <span className="mt-4 text-[#099AD7] font-mono text-xs uppercase tracking-widest flex items-center gap-2">
                  Ver proyecto <span>→</span>
                </span>
              </motion.div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
