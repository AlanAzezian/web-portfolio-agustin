"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { projects } from "@/data/projects";

export default function HomeSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % projects.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div className="w-full flex flex-col items-center pt-[104px] pb-8 bg-[#F8F7F4]">
      
      {/* Cuadro de la imagen: ancho máximo 1120px (o 90vw en pantallas menores), proporción fija 3:2 */}
      <div 
        className="relative w-[90vw] max-w-[1120px] aspect-[3/2] overflow-hidden cursor-pointer group flex-none"
        onClick={() => router.push(`/proyectos?proyecto=${projects[activeIndex].id}`)}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <AnimatePresence>
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={projects[activeIndex].homeImage || projects[activeIndex].imageUrl}
              alt={projects[activeIndex].title}
              fill
              sizes="(max-width: 768px) 90vw, 1120px"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              style={{ 
                objectPosition: projects[activeIndex].focalPoint || "50% 50%" 
              }}
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Social Links Row (en flujo normal) */}
      <div className="mt-6 flex justify-center gap-8 text-foreground/70">
        <a 
          href="https://instagram.com/agustinfabrizio" 
          target="_blank" 
          rel="noreferrer"
          className="hover:text-foreground transition-colors"
          aria-label="Instagram"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
        </a>
        <a 
          href="#" 
          className="hover:text-foreground transition-colors"
          aria-label="WhatsApp"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
        </a>
        <a 
          href="mailto:hola@agustinfabrizio.com" 
          className="hover:text-foreground transition-colors"
          aria-label="Email"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
        </a>
      </div>
    </div>
  );
}
