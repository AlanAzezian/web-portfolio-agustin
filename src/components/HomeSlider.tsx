"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/data/projects";
import { supabase } from "@/lib/supabase";

export default function HomeSlider() {
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.__lenis?.scrollTo(0, { immediate: true });
      window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function loadProjects() {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("order_index", { ascending: true });

        if (!active) return;

        if (error || !data || data.length === 0) {
          setProjectsList([]);
          return;
        }

        const mapped: Project[] = data
          .map((row: Record<string, unknown>) => {
            const id = String(row.id || "");
            const rawImages = Array.isArray(row.images)
              ? (row.images as string[]).filter(Boolean)
              : [];
            const coverImage = String(
              row.cover_image || row.coverImage || rawImages[0] || ""
            );
            return {
              id,
              title: String(row.title || id),
              coverImage,
              images:
                rawImages.length > 0
                  ? rawImages
                  : coverImage
                    ? [coverImage]
                    : [],
            };
          })
          .filter((p) => Boolean(p.id && p.coverImage));

        setProjectsList(mapped);
        setActiveIndex(0);
      } catch {
        if (active) setProjectsList([]);
      } finally {
        if (active) {
          setIsLoading(false);
          if (typeof window !== "undefined") {
            requestAnimationFrame(() => {
              window.__lenis?.resize();
            });
          }
        }
      }
    }

    loadProjects();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (isPaused || projectsList.length === 0) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % projectsList.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, projectsList.length]);

  const currentProject = projectsList[activeIndex] ?? projectsList[0] ?? null;

  return (
    <div className="w-full flex flex-col bg-[#FFFFFF]">
      {/* Primer pliegue exacto: ocupa la altura de pantalla visible restando el navbar */}
      <section className="relative w-full h-[calc(100dvh-5rem)] flex items-center justify-center px-6 md:px-12 select-none overflow-hidden bg-[#FFFFFF]">
        {!isLoading && currentProject?.coverImage && (
          <div
            role="button"
            tabIndex={0}
            aria-label={`Ver proyecto ${currentProject.title}`}
            className="relative w-full h-full flex items-center justify-center max-w-7xl mx-auto cursor-pointer focus:outline-none"
            onClick={() => router.push(`/proyectos/${currentProject.id}`)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                router.push(`/proyectos/${currentProject.id}`);
              }
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentProject.id + "-" + activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="relative w-full h-full flex items-center justify-center"
              >
                <img
                  src={currentProject.coverImage || currentProject.images?.[0]}
                  alt={currentProject.title}
                  className="max-h-[calc(100dvh-8rem)] max-w-full w-auto h-auto object-contain block mx-auto"
                  style={{ maxHeight: "calc(100dvh - 8rem)" }}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </section>

      <footer className="w-full bg-[#FFFFFF] border-t border-[#1C1C1A]/10 px-6 md:px-12 lg:px-16 py-6 md:py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 font-roboto text-xs tracking-widest text-[#1C1C1A] uppercase">
          {/* Enlaces a Redes y Contacto */}
          <div className="flex items-center gap-6 md:gap-8">
            <a
              href="https://www.behance.net/agustinfabrizio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#099AD7] transition-colors"
            >
              BEHANCE
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#099AD7] transition-colors"
            >
              INSTAGRAM
            </a>
            <a
              href="https://wa.me/5492364714924"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#099AD7] transition-colors"
            >
              WHATSAPP
            </a>
            <a
              href="mailto:hola@agustinfabrizio.com"
              className="hover:text-[#099AD7] transition-colors"
            >
              MAIL
            </a>
          </div>

          {/* Crédito / Copyright sutil */}
          <div className="text-[11px] text-[#1C1C1A]/50 tracking-wider">
            AGUSTÍN FABRIZIO © {new Date().getFullYear()}
          </div>
        </div>
      </footer>
    </div>
  );
}
