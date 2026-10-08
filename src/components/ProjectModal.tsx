"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Project } from "@/data/projects";
import { X } from "lucide-react";
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
        className="bg-background w-full max-w-6xl h-full max-h-[90vh] overflow-y-auto flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-50 flex justify-end p-0 bg-background/80 backdrop-blur-sm">
          <button 
            onClick={onClose}
            className="w-12 h-12 bg-background flex items-center justify-center hover:bg-foreground hover:text-background transition-colors border-l border-b border-foreground/10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-8 md:px-16 pb-12 pt-4">
          <h2 className="text-3xl md:text-5xl font-sans font-light leading-none text-foreground tracking-tighter mb-12">
            {project.title}
          </h2>
          
          <div className="flex flex-col gap-12">
            {project.images.map((src, idx) => (
              <div key={idx} className="w-full relative">
                <Image
                  src={src}
                  alt={`${project.title} - Imagen ${idx + 1}`}
                  width={1920}
                  height={1080}
                  className="w-full h-auto object-cover"
                  sizes="(max-width: 768px) 100vw, 90vw"
                  quality={90}
                />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
