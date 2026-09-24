"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { projects } from "@/data/projects";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export default function HeroTrack() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });

  const smoothProgress = useSpring(scrollYProgress, {
    damping: 20,
    stiffness: 100,
    mass: 0.5
  });

  const x = useTransform(smoothProgress, [0, 1], ["0%", "-50%"]);

  return (
    <div ref={containerRef} className="h-[200vh] bg-white relative">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center bg-white">
        <motion.div 
          style={{ x }} 
          className="flex gap-8 px-12 items-center min-w-max"
        >
          {projects.map((project, i) => (
            <div 
              key={project.id} 
              className={`relative w-[60vw] md:w-[40vw] lg:w-[30vw] aspect-[4/5] overflow-hidden bg-gray-100 shrink-0 ${i % 2 === 1 ? 'mt-24' : ''}`}
            >
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 60vw, 30vw"
                priority={i < 4}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
