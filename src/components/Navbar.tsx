"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useSyncExternalStore } from "react";
import { gsap } from "@/lib/gsap";

const links = [
  { name: "INICIO", path: "/" },
  { name: "PROYECTOS", path: "/proyectos" },
  { name: "SERVICIOS", path: "/servicios" },
  { name: "BIO & CONTACTO", path: "/bio" },
];

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) {
    return () => {};
  }
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined" || !window.matchMedia) {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerSnapshot() {
  return false;
}

// Micro-variación determinista por índice (~70-90 ms) para tipeo orgánico
const TYPE_DELAYS = [0.075, 0.088, 0.072, 0.084, 0.078, 0.09, 0.074, 0.082];
const DELETE_DELAY = 0.04;

function AnimatedLogo() {
  const containerRef = useRef<HTMLAnchorElement>(null);
  const part1Ref = useRef<HTMLSpanElement>(null);
  const part2Ref = useRef<HTMLSpanElement>(null);
  const cursor1Ref = useRef<HTMLSpanElement>(null);
  const cursor2Ref = useRef<HTMLSpanElement>(null);

  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getServerSnapshot
  );

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const p1 = part1Ref.current;
      const p2 = part2Ref.current;
      const c1 = cursor1Ref.current;
      const c2 = cursor2Ref.current;
      if (!p1 || !p2 || !c1 || !c2) return;

      const setState = (text1: string, text2: string, activeCursor: 1 | 2) => {
        p1.textContent = text1;
        p2.textContent = text2;
        c1.style.display = activeCursor === 1 ? "inline-block" : "none";
        c2.style.display = activeCursor === 2 ? "inline-block" : "none";
      };

      // Estado inicial: AF con cursor al final
      setState("A", "F", 2);

      // Parpadeo continuo del cursor tipográfico cada 0.5s
      gsap.to([c1, c2], {
        opacity: 0,
        duration: 0.25,
        repeat: -1,
        yoyo: true,
        ease: "steps(1)",
      });

      const tl = gsap.timeline({ repeat: -1 });

      const addTypePart1 = (fromStr: string, targetAddition: string) => {
        for (let i = 1; i <= targetAddition.length; i++) {
          const nextText = fromStr + targetAddition.slice(0, i);
          const delay = TYPE_DELAYS[i % TYPE_DELAYS.length];
          tl.call(
            () => {
              p1.textContent = nextText;
              c1.style.display = "inline-block";
              c2.style.display = "none";
            },
            undefined,
            `+=${delay}`
          );
        }
      };

      const addTypePart2 = (fromStr: string, targetAddition: string) => {
        for (let i = 1; i <= targetAddition.length; i++) {
          const nextText = fromStr + targetAddition.slice(0, i);
          const delay = TYPE_DELAYS[(i + 3) % TYPE_DELAYS.length];
          tl.call(
            () => {
              p2.textContent = nextText;
              c1.style.display = "none";
              c2.style.display = "inline-block";
            },
            undefined,
            `+=${delay}`
          );
        }
      };

      const addDeletePart2 = (fullStr: string, keepCount: number) => {
        for (let i = fullStr.length - 1; i >= keepCount; i--) {
          const nextText = fullStr.slice(0, i);
          tl.call(
            () => {
              p2.textContent = nextText;
              c1.style.display = "none";
              c2.style.display = "inline-block";
            },
            undefined,
            `+=${DELETE_DELAY}`
          );
        }
      };

      const addDeletePart1 = (
        fullStr: string,
        keepCount: number,
        endCursorOn2 = false
      ) => {
        for (let i = fullStr.length - 1; i >= keepCount; i--) {
          const nextText = fullStr.slice(0, i);
          const isLast = i === keepCount && endCursorOn2;
          tl.call(
            () => {
              p1.textContent = nextText;
              c1.style.display = isLast ? "none" : "inline-block";
              c2.style.display = isLast ? "inline-block" : "none";
            },
            undefined,
            `+=${DELETE_DELAY}`
          );
        }
      };

      // 1. AF (hold 5.5 s)
      tl.to({}, { duration: 5.5 });

      // 2. Tipeo a "Agustín Fabrizio" (~2 s)
      addTypePart1("A", "gustín ");
      addTypePart2("F", "abrizio");

      // 3. Hold "Agustín Fabrizio" (3 s)
      tl.to({}, { duration: 3.0 });

      // 4. Borrado rápido a "AF"
      addDeletePart2("Fabrizio", 1);
      addDeletePart1("Agustín ", 1, true);

      // 5. AF (hold 5.5 s)
      tl.to({}, { duration: 5.5 });

      // 6. Tipeo a "Agustín F"
      addTypePart1("A", "gustín ");
      tl.call(() => {
        c1.style.display = "none";
        c2.style.display = "inline-block";
      });

      // 7. Hold "Agustín F" (3 s)
      tl.to({}, { duration: 3.0 });

      // 8. Borrado de "gustín" y tipeo de "abrizio" a "A Fabrizio"
      // Borramos "gustín " hasta dejar "A", luego insertamos el espacio antes de F y tipeamos "abrizio"
      addDeletePart1("Agustín ", 1, false);
      tl.call(
        () => {
          p1.textContent = "A ";
          c1.style.display = "none";
          c2.style.display = "inline-block";
        },
        undefined,
        `+=${TYPE_DELAYS[0]}`
      );
      addTypePart2("F", "abrizio");

      // 9. Hold "A Fabrizio" (3 s)
      tl.to({}, { duration: 3.0 });

      // 10. Vuelve a "AF"
      addDeletePart2("Fabrizio", 1);
      addDeletePart1("A ", 1, true);
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <Link
      ref={containerRef}
      href="/"
      aria-label="Agustín Fabrizio"
      className="font-roboto font-medium font-[500] tracking-tight text-3xl text-[#1C1C1A] flex relative items-center whitespace-pre focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-acento"
    >
      {/* Contenedor invisible que reserva el ancho máximo completo sin layout shift */}
      <span
        className="invisible select-none pointer-events-none pr-4"
        aria-hidden="true"
      >
        Agustín Fabrizio
      </span>

      <span
        aria-hidden="true"
        className="absolute left-0 top-0 flex items-baseline text-[#1C1C1A]"
      >
        {reducedMotion ? (
          <span>Agustín Fabrizio</span>
        ) : (
          <>
            <span ref={part1Ref}>A</span>
            <span
              ref={cursor1Ref}
              style={{ display: "none" }}
              className="w-[10px] h-[2px] bg-acento inline-block self-end mb-[4px] mx-[1px]"
            />
            <span ref={part2Ref}>F</span>
            <span
              ref={cursor2Ref}
              style={{ display: "inline-block" }}
              className="w-[10px] h-[2px] bg-acento inline-block self-end mb-[4px] ml-[2px]"
            />
          </>
        )}
      </span>
    </Link>
  );
}

export const NAV_ACTIVE_DOT = false;

export default function Navbar() {
  const pathname = usePathname();
  const isProjectDetail =
    pathname.startsWith("/proyectos/") && pathname !== "/proyectos";

  const navListRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const dotRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!navListRef.current) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      links.forEach((link, idx) => {
        const el = linkRefs.current[idx];
        if (!el) return;

        const isActive =
          link.path === "/"
            ? pathname === "/"
            : pathname.startsWith(link.path);

        if (!NAV_ACTIVE_DOT) {
          gsap.to(el, {
            scale: isActive ? 1.15 : 1,
            duration: prefersReducedMotion ? 0 : isActive ? 0.45 : 0.25,
            ease: isActive ? "back.out(1.6)" : "power2.out",
            overwrite: "auto",
          });
        } else {
          gsap.set(el, { scale: 1 });
          if (isActive && dotRef.current && navListRef.current) {
            const navRect = navListRef.current.getBoundingClientRect();
            const linkRect = el.getBoundingClientRect();
            const targetX = linkRect.left - navRect.left + linkRect.width / 2 - 3;
            gsap.to(dotRef.current, {
              x: targetX,
              opacity: 1,
              duration: prefersReducedMotion ? 0 : 0.4,
              ease: "power3.out",
              overwrite: "auto",
            });
          }
        }
      });
    }, navListRef);

    return () => ctx.revert();
  }, [pathname]);

  return (
    <nav
      aria-hidden={isProjectDetail}
      className={`fixed top-0 left-0 right-0 z-50 bg-[#FFFFFF] transition-colors duration-300 ${
        isProjectDetail ? "hidden" : ""
      }`}
    >
      <div className="w-full flex items-center justify-between h-20 px-8 md:px-16">
        <AnimatedLogo />
        <div
          ref={navListRef}
          className="relative hidden md:flex items-center gap-9 font-roboto"
        >
          {links.map((link, idx) => {
            const isActive =
              link.path === "/"
                ? pathname === "/"
                : pathname.startsWith(link.path);
            return (
              <Link
                key={link.path}
                href={link.path}
                ref={(el) => {
                  linkRefs.current[idx] = el;
                }}
                className={`relative inline-flex flex-col items-center justify-center origin-center font-roboto uppercase tracking-wider px-1 transition-colors duration-200 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-acento ${
                  isActive
                    ? "text-sm font-semibold font-[600] text-[#099AD7]"
                    : "text-[13px] font-medium font-[500] text-[#1C1C1A] hover:text-[#099AD7]"
                }`}
              >
                <span>{link.name}</span>
                {/* Reserva de ancho en peso 600 y text-sm para evitar desplazamiento de vecinos */}
                <span
                  aria-hidden="true"
                  className="invisible text-sm uppercase tracking-wider font-semibold font-[600] h-0 overflow-hidden select-none pointer-events-none"
                >
                  {link.name}
                </span>
              </Link>
            );
          })}
          {NAV_ACTIVE_DOT && (
            <span
              ref={dotRef}
              aria-hidden="true"
              className="absolute -bottom-2.5 left-0 w-1.5 h-1.5 rounded-full bg-acento opacity-0 pointer-events-none"
            />
          )}
        </div>
      </div>
    </nav>
  );
}
