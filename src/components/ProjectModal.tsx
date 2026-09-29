"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Project } from "@/data/projects";
import { X, ExternalLink } from "lucide-react";
import { useEffect } from "react";

interface Props {
  project: Project;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: Props) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-foreground/90 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-background w-full max-w-6xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-0 right-0 z-10 w-12 h-12 bg-background flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="w-full md:w-1/2 h-[50vh] md:h-[80vh] relative">
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center relative">
          
          <div className="mb-12">
            <p className="text-xs font-mono text-foreground/60 uppercase tracking-widest mb-4">
              [ {project.category} ]
            </p>
            <h2 className="text-4xl md:text-6xl font-sans font-light leading-none text-foreground tracking-tighter">
              {project.title}
            </h2>
          </div>
          
          <div className="flex flex-col gap-4 font-mono text-sm uppercase text-foreground mb-16 py-6">
            <div className="flex justify-between items-center">
              <span className="text-foreground/50">Cliente</span>
              <span>{project.client || "Independiente"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-foreground/50">Año</span>
              <span>{project.year || "2024"}</span>
            </div>
          </div>
          
          <a 
            href={project.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-acento text-background uppercase font-mono tracking-widest text-sm hover:bg-foreground transition-colors self-start"
          >
            Ver en Behance <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}


