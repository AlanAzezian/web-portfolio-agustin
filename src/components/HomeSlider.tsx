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

  if (isLoading || !currentProject?.coverImage) {
    return <div className="w-full h-[calc(100dvh-5rem)] bg-[#FFFFFF]" />;
  }

  return (
    <div className="w-full flex flex-col bg-[#FFFFFF]">
      {/* Primer pliegue exacto: ocupa la altura de pantalla visible restando el navbar */}
      <section className="relative w-full h-[calc(100dvh-5rem)] flex items-center justify-center px-6 md:px-12 select-none overflow-hidden">
        {/* Caja de contención rígida y centrada */}
        <div
          role="button"
          tabIndex={0}
          aria-label={`Ver proyecto ${currentProject.title}`}
          className="relative w-full h-full flex items-center justify-center max-w-7xl mx-auto cursor-pointer group focus:outline-none"
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
                className="max-h-[calc(100dvh-8rem)] max-w-full w-auto h-auto object-contain block mx-auto transition-transform duration-700 ease-out group-hover:scale-[1.01]"
                style={{ maxHeight: "calc(100dvh - 8rem)" }}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Bloque inferior: único destino al scrollear hacia abajo */}
      <footer className="w-full py-8 md:py-12 bg-white border-t border-[#1C1C1A]/10 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6 text-xs tracking-wider">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 text-[#1C1C1A]">
          <a
            href="https://instagram.com/agustinfabrizio"
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-2 font-roboto text-xs uppercase tracking-wider text-[#686661] hover:text-acento transition-colors"
            aria-label="Instagram"
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:scale-110"
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
            <span>Instagram</span>
          </a>

          <a
            href="https://www.behance.net/agustinfabrizio"
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-2 font-roboto text-xs uppercase tracking-wider text-[#686661] hover:text-acento transition-colors"
            aria-label="Behance"
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:scale-110"
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
            <span>Behance</span>
          </a>

          <a
            href="https://wa.me/"
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-2 font-roboto text-xs uppercase tracking-wider text-[#686661] hover:text-acento transition-colors"
            aria-label="WhatsApp"
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            <span>WhatsApp</span>
          </a>

          <a
            href="mailto:hola@agustinfabrizio.com"
            className="group flex items-center gap-2 font-roboto text-xs uppercase tracking-wider text-[#686661] hover:text-acento transition-colors"
            aria-label="Email"
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:scale-110"
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
            <span>Email</span>
          </a>
        </div>

        <p className="font-roboto text-[11px] uppercase tracking-widest text-[#686661]/70">
          Agustín Fabrizio © {new Date().getFullYear()} — Arquitectura & Visualización
        </p>
      </footer>
    </div>
  );
}
