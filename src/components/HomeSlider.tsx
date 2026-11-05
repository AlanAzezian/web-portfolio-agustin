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
        if (active) setIsLoading(false);
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

      {/* Bloque inferior: único destino al scrollear hacia abajo */}
      <footer className="w-full bg-[#FFFFFF] border-t border-[#1C1C1A]/10 px-6 md:px-12 lg:px-16 py-6">
        <div className="w-full flex flex-wrap items-center justify-between gap-6">
          <a
            href="https://www.behance.net/agustinfabrizio"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 font-roboto text-xs uppercase tracking-wider text-[#1C1C1A] hover:text-[#099AD7] transition-colors"
            aria-label="BEHANCE"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 8h5a2.5 2.5 0 0 1 0 5H3V8z" />
              <path d="M3 13h5.5a2.5 2.5 0 0 1 0 5H3v-5z" />
              <path d="M14 13h7a3.5 3.5 0 0 0-7 0v1a3.5 3.5 0 0 0 7 0" />
              <line x1="15" y1="8" x2="20" y2="8" />
            </svg>
            <span>BEHANCE</span>
          </a>

          <a
            href="https://instagram.com/agustinfabrizio"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 font-roboto text-xs uppercase tracking-wider text-[#1C1C1A] hover:text-[#099AD7] transition-colors"
            aria-label="INSTAGRAM"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            <span>INSTAGRAM</span>
          </a>

          <a
            href="https://wa.me/5492364714924"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 font-roboto text-xs uppercase tracking-wider text-[#1C1C1A] hover:text-[#099AD7] transition-colors"
            aria-label="WHATSAPP"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            <span>WHATSAPP</span>
          </a>

          <a
            href="mailto:hola@agustinfabrizio.com"
            className="flex items-center gap-2 font-roboto text-xs uppercase tracking-wider text-[#1C1C1A] hover:text-[#099AD7] transition-colors"
            aria-label="MAIL"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <span>MAIL</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
