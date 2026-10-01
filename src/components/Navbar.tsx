"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import React, { useEffect, useRef, useState } from "react";

const links = [
  { name: "Inicio", path: "/" },
  { name: "Proyectos", path: "/proyectos" },
  { name: "Servicios", path: "/servicios" },
  { name: "Bio & Contacto", path: "/bio" },
];

const sequence = [
  { gustin: false, abrizio: false, pause: 5500 }, // 1. AF
  { gustin: true,  abrizio: true,  pause: 2500 }, // 2. Agustín Fabrizio
  { gustin: false, abrizio: false, pause: 5500 }, // 3. AF
  { gustin: true,  abrizio: false, pause: 2500 }, // 4. Agustín F
  { gustin: false, abrizio: true,  pause: 2500 }, // 5. A Fabrizio
];

function AnimatedLogo() {
  const [step, setStep] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const isInitial = useRef(true);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(prefersReduced);
    if (prefersReduced) return;

    let timer: NodeJS.Timeout;
    let startTime = Date.now();
    let remaining = sequence[step].pause + (isInitial.current ? 0 : 2000);
    isInitial.current = false;

    const tick = () => {
      setStep((s) => (s + 1) % sequence.length);
    };

    const startTimer = (timeToWait: number) => {
      timer = setTimeout(tick, timeToWait);
      startTime = Date.now();
      remaining = timeToWait;
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearTimeout(timer);
        remaining = Math.max(0, remaining - (Date.now() - startTime));
      } else {
        startTimer(remaining);
      }
    };

    startTimer(remaining);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [step]);

  const { gustin, abrizio } = reducedMotion 
    ? { gustin: true, abrizio: true } 
    : sequence[step];

  return (
    <Link href="/" aria-label="Agustín Fabrizio" className="font-redaction italic text-xl flex relative items-center">
      <span className="invisible select-none pointer-events-none">Agustín Fabrizio</span>
      <div className="absolute left-0 top-0 flex whitespace-pre text-[#1C1C1A]" aria-hidden="true">
        <span>A</span>
        <motion.div
          initial={false}
          animate={{ width: gustin ? "auto" : 0, opacity: gustin ? 1 : 0 }}
          transition={{ duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
          className="overflow-hidden flex"
        >
          <span>gustín</span>
        </motion.div>
        
        <motion.div
          initial={false}
          animate={{ width: (gustin || abrizio) ? "auto" : 0, opacity: (gustin || abrizio) ? 1 : 0 }}
          transition={{ duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
          className="overflow-hidden flex"
        >
          <span> </span>
        </motion.div>

        <span>F</span>
        <motion.div
          initial={false}
          animate={{ width: abrizio ? "auto" : 0, opacity: abrizio ? 1 : 0 }}
          transition={{ duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
          className="overflow-hidden flex"
        >
          <span>abrizio</span>
        </motion.div>
      </div>
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F8F7F4]/80 backdrop-blur-md">
      <div className="w-full flex items-center justify-between h-20 px-8 md:px-16">
        <AnimatedLogo />
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`relative text-sm font-medium transition-colors ${
                pathname === link.path ? "text-[#1C1C1A]" : "text-[#686661] hover:text-[#1C1C1A]"
              }`}
            >
              {link.name}
              {pathname === link.path && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#1C1C1A]"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

