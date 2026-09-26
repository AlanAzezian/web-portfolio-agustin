"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { projects } from "@/data/projects";
import gsap from "gsap";

export default function HeroTrack() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollPos = useRef(0);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      const maxScroll = container.scrollWidth - container.clientWidth;
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      
      scrollPos.current = Math.min(Math.max(scrollPos.current + delta * 1.5, 0), maxScroll);

      gsap.to(container, {
        scrollLeft: scrollPos.current,
        duration: 0.8,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div 
      ref={scrollContainerRef}
      className="flex flex-nowrap overflow-x-hidden overflow-y-hidden gap-10 px-12 items-center h-screen w-full no-scrollbar select-none"
    >
      {projects.map((project, i) => (
        <div 
          key={project.id} 
          className={`relative w-[75vw] sm:w-[60vw] md:w-[40vw] lg:w-[35vw] xl:w-[30vw] aspect-[4/5] overflow-hidden shrink-0 transform-gpu ${i % 2 === 1 ? 'mt-16' : 'mb-16'}`}
        >
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 75vw, (max-width: 1024px) 40vw, 30vw"
            priority={i < 4}
          />
        </div>
      ))}
    </div>
  );
}
