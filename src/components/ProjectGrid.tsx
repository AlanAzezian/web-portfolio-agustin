"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { projects } from "@/data/projects";

export default function ProjectGrid() {
  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-12 py-32 min-h-screen flex flex-col items-center justify-center">
      {projects.map((project, i) => (
        <Link href={`/proyectos/${project.id}`} key={project.id} className="w-full block">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }}
            className="relative w-full overflow-hidden cursor-pointer group bg-[#F8F7F4]"
          >
            <Image
              src={project.coverImage}
              alt={project.title}
              width={1920}
              height={1080}
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
            />

            <motion.div 
              className="absolute inset-0 bg-[#F8F7F4]/90 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-8 z-20 text-center"
            >
              <h3 className="font-sans font-light text-3xl md:text-5xl leading-tight text-[#1C1C1A] tracking-tight max-w-2xl">
                {project.title}
              </h3>
              <span className="mt-8 text-[#099AD7] font-mono text-sm uppercase tracking-widest flex items-center gap-2">
                Ver proyecto <span className="text-lg">→</span>
              </span>
            </motion.div>
          </motion.div>
        </Link>
      ))}
    </div>
  );
}
