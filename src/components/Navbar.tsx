"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, Variants } from "framer-motion";

import React, { useEffect, useRef, useState } from "react";

const links = [
  { name: "Inicio", path: "/" },
  { name: "Proyectos", path: "/proyectos" },
  { name: "Servicios", path: "/servicios" },
  { name: "Bio & Contacto", path: "/bio" },
];

const STATES = [
  { gustin: false, abrizio: false, pause: 5500 }, // AF
  { gustin: true,  abrizio: true,  pause: 2750 }, // Agustín Fabrizio
  { gustin: false, abrizio: false, pause: 5500 }, // AF
  { gustin: true,  abrizio: false, pause: 2750 }, // Agustín F
  { gustin: false, abrizio: true,  pause: 2750 }, // A Fabrizio
];

const containerVariants: Variants = {
  visible: {
    transition: { staggerChildren: 0.08 }
  },
  hidden: {
    transition: { staggerChildren: 0.04, staggerDirection: -1 }
  }
};

const charVariants: Variants = {
  visible: { 
    width: "auto", 
    opacity: 1, 
    transition: { duration: 0.4, ease: "easeOut" } 
  },
  hidden: { 
    width: 0, 
    opacity: 0, 
    transition: { duration: 0.4, ease: "easeIn" } 
  }
};

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
    let remaining = STATES[step].pause + (isInitial.current ? 0 : 1500); // approx transition time
    isInitial.current = false;

    const tick = () => {
      setStep((s) => (s + 1) % STATES.length);
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
    : STATES[step];

  return (
    <Link href="/" aria-label="Agustín Fabrizio" className="font-redaction italic text-xl flex relative items-center whitespace-pre">
      <span className="invisible select-none pointer-events-none" aria-hidden="true">Agustín Fabrizio</span>
      <div className="absolute left-0 top-0 flex text-[#1C1C1A]">
        <span>A</span>
        
        <motion.div
          variants={containerVariants}
          initial={false}
          animate={gustin ? "visible" : "hidden"}
          className="flex overflow-hidden"
        >
          {"gustín".split("").map((char, i) => (
            <motion.span key={i} variants={charVariants} className="inline-block">
              {char}
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial={false}
          animate={(gustin || abrizio) ? "visible" : "hidden"}
          className="flex overflow-hidden"
        >
          <motion.span variants={charVariants} className="inline-block">
            {" "}
          </motion.span>
        </motion.div>

        <span>F</span>

        <motion.div
          variants={containerVariants}
          initial={false}
          animate={abrizio ? "visible" : "hidden"}
          className="flex overflow-hidden"
        >
          {"abrizio".split("").map((char, i) => (
            <motion.span key={i} variants={charVariants} className="inline-block">
              {char}
            </motion.span>
          ))}
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

