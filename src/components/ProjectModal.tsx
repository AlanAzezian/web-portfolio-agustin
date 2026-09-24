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
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl flex flex-col md:flex-row relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-full md:w-3/5 h-[40vh] md:h-[80vh] relative">
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 60vw"
          />
        </div>
        
        <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col justify-center">
          <p className="text-sm text-gray-500 uppercase tracking-widest mb-4">{project.category}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">{project.title}</h2>
          
          <div className="space-y-4 mb-12">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider text-xs">Client</p>
              <p className="text-lg font-medium">{project.client || "Independent"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider text-xs">Year</p>
              <p className="text-lg font-medium">{project.year || "2024"}</p>
            </div>
          </div>
          
          <a 
            href={project.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors self-start"
          >
            Ver en Behance <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}
