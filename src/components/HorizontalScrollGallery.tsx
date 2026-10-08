"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function HorizontalScrollGallery({ images, title }: { images: string[], title: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div 
      ref={scrollRef}
      className="w-full h-full flex overflow-x-auto overflow-y-hidden gap-8 md:gap-12 px-6 md:px-12 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] items-center"
    >
      {images.map((src, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          className="h-[75vh] md:h-[80vh] flex-shrink-0 snap-center relative flex items-center justify-center"
        >
          <Image
            src={src}
            alt={`${title} - Imagen ${i + 1}`}
            width={1920}
            height={1080}
            className="h-full w-auto object-contain"
            quality={90}
            priority={i < 2}
          />
        </motion.div>
      ))}
    </div>
  );
}
