"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Mail } from "lucide-react";
import { parseProjectImagesAndMeta, type Project } from "@/data/projects";
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
            const { cleanImages, showInMainGrid } =
              parseProjectImagesAndMeta(row);
            const coverImage = String(
              row.cover_image || row.coverImage || cleanImages[0] || ""
            );
            return {
              id,
              title: String(row.title || id),
              coverImage,
              showInMainGrid,
              images:
                cleanImages.length > 0
                  ? cleanImages
                  : coverImage
                    ? [coverImage]
                    : [],
            };
          })
          .filter((p) => Boolean(p.id && p.coverImage && p.showInMainGrid !== false));

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

      <footer className="w-full bg-[#FFFFFF] py-8 md:py-10 border-t border-[#1C1C1A]/10 px-6 md:px-12 flex flex-col items-center justify-center gap-4 select-none">
        {/* Fila Superior: Redes Sociales con Iconos Centrados */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 font-roboto text-[11px] md:text-xs tracking-wider text-[#1C1C1A] uppercase">
          <a
            href="https://instagram.com/agustinfabrizio"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:text-[#099AD7] transition-colors"
          >
            <svg
              width={14}
              height={14}
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
            href="https://www.behance.net/agustinfabrizio"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:text-[#099AD7] transition-colors"
          >
            <span className="font-bold text-[12px] leading-none">Bē</span>
            <span>BEHANCE</span>
          </a>

          <a
            href="https://wa.me/5492364714924"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:text-[#099AD7] transition-colors"
          >
            <MessageCircle className="stroke-[1.5]" size={14} />
            <span>WHATSAPP</span>
          </a>

          <a
            href="mailto:hola@agustinfabrizio.com"
            className="inline-flex items-center gap-2 hover:text-[#099AD7] transition-colors"
          >
            <Mail className="stroke-[1.5]" size={14} />
            <span>EMAIL</span>
          </a>
        </div>

        {/* Fila Inferior: Crédito Institucional Centrado */}
        <div className="font-roboto text-[10px] md:text-[11px] text-[#1C1C1A]/40 tracking-widest uppercase text-center mt-1">
          AGUSTÍN FABRIZIO © 2026 — ARQUITECTURA &amp; VISUALIZACIÓN
        </div>
      </footer>
    </div>
  );
}
