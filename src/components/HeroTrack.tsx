"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { projects } from "@/data/projects";

export default function HeroTrack() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div 
      ref={scrollContainerRef}
      className="flex flex-nowrap overflow-x-auto overflow-y-hidden gap-10 px-12 items-center h-[75vh] no-scrollbar scroll-smooth"
      style={{ scrollBehavior: 'auto' }}
    >
      {projects.map((project, i) => (
        <div 
          key={project.id} 
          className={`relative w-[60vw] md:w-[40vw] lg:w-[30vw] aspect-[4/5] overflow-hidden shrink-0 ${i % 2 === 1 ? 'mt-16' : 'mb-16'}`}
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
    </div>
  );
}
