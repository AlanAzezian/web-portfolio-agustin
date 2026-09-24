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

    // Use window listener or container listener depending on the prompt.
    // The user's code uses window but limits scroll by maxScroll of container.
    // Since it's a full-screen hero, either is fine. I'll stick to container listener for scoping, or window as user provided. Let's use window.
    
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      const maxScroll = container.scrollWidth - container.clientWidth;
      
      scrollPos.current = Math.min(Math.max(scrollPos.current + e.deltaY * 1.5, 0), maxScroll);

      gsap.to(container, {
        scrollLeft: scrollPos.current,
        duration: 0.6,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div 
      ref={scrollContainerRef}
      className="flex flex-nowrap overflow-x-hidden overflow-y-hidden gap-10 px-12 items-center h-[75vh] no-scrollbar select-none"
    >
      {projects.map((project, i) => (
        <div 
          key={project.id} 
          className={`relative w-[60vw] md:w-[40vw] lg:w-[30vw] aspect-[4/5] overflow-hidden shrink-0 transform-gpu ${i % 2 === 1 ? 'mt-16' : 'mb-16'}`}
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
