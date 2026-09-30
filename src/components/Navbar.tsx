"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const links = [
  { name: "Inicio", path: "/" },
  { name: "Proyectos", path: "/proyectos" },
  { name: "Servicios", path: "/servicios" },
  { name: "Bio & Contacto", path: "/bio" },
];

function AnimatedLogo() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      
      if (prefersReducedMotion) {
        gsap.set(".logo-char", { display: "inline-block" });
        return;
      }

      const tl = gsap.timeline({ delay: 0.8 });
      tl.to(".logo-char", {
        display: "inline-block",
        duration: 0.01,
        stagger: 0.08,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <Link href="/" aria-label="Agustín Fabrizio" className="font-redaction italic text-xl flex relative items-center">
      <span className="invisible opacity-0 select-none pointer-events-none">Agustín Fabrizio</span>
      <div ref={containerRef} className="absolute left-0 top-0 flex whitespace-pre text-[#1C1C1A]" aria-hidden="true">
        <span>A</span>
        {'gustín '.split('').map((char, i) => (
          <span key={`p1-${i}`} className="logo-char hidden">{char}</span>
        ))}
        <span>F</span>
        {'abrizio'.split('').map((char, i) => (
          <span key={`p2-${i}`} className="logo-char hidden">{char}</span>
        ))}
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

