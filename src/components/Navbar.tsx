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

const STATES = [
  { mid: "", tail: "", pause: 5500 },
  { mid: "gustín ", tail: "abrizio", pause: 2750 },
  { mid: "", tail: "", pause: 5500 },
  { mid: "gustín ", tail: "", pause: 2750 },
  { mid: " ", tail: "abrizio", pause: 2750 },
];

function getCommonPrefix(a: string, b: string) {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) {
    i++;
  }
  return a.substring(0, i);
}

function AnimatedLogo() {
  const [currentMid, setCurrentMid] = useState("");
  const [currentTail, setCurrentTail] = useState("");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(prefersReduced);
    if (prefersReduced) {
      setCurrentMid("gustín ");
      setCurrentTail("abrizio");
      return;
    }

    let isUnmounted = false;
    let timer: NodeJS.Timeout;
    
    // Internal mutable state to track current string during async loop
    let mid = "";
    let tail = "";
    let stateIdx = 0;
    
    const tick = async () => {
      while (!isUnmounted) {
        if (document.hidden) {
          // Poll every 500ms when hidden
          await new Promise(r => { timer = setTimeout(r, 500) });
          continue;
        }

        const targetMid = STATES[stateIdx].mid;
        const targetTail = STATES[stateIdx].tail;
        const pauseTime = STATES[stateIdx].pause;

        // 1. Delete tail
        const prefixTail = getCommonPrefix(tail, targetTail);
        while (tail.length > prefixTail.length && !isUnmounted) {
          tail = tail.slice(0, -1);
          setCurrentTail(tail);
          await new Promise(r => { timer = setTimeout(r, 140) });
        }

        // 2. Delete mid
        const prefixMid = getCommonPrefix(mid, targetMid);
        while (mid.length > prefixMid.length && !isUnmounted) {
          mid = mid.slice(0, -1);
          setCurrentMid(mid);
          await new Promise(r => { timer = setTimeout(r, 140) });
        }

        // 3. Type mid
        while (mid.length < targetMid.length && !isUnmounted) {
          mid = targetMid.substring(0, mid.length + 1);
          setCurrentMid(mid);
          await new Promise(r => { timer = setTimeout(r, 140) });
        }

        // 4. Type tail
        while (tail.length < targetTail.length && !isUnmounted) {
          tail = targetTail.substring(0, tail.length + 1);
          setCurrentTail(tail);
          await new Promise(r => { timer = setTimeout(r, 140) });
        }

        if (isUnmounted) break;

        // Wait for pause time
        await new Promise(r => { timer = setTimeout(r, pauseTime) });
        
        stateIdx = (stateIdx + 1) % STATES.length;
      }
    };

    tick();

    return () => {
      isUnmounted = true;
      clearTimeout(timer);
    };
  }, []);

  return (
    <Link href="/" aria-label="Agustín Fabrizio" className="font-redaction italic text-xl flex relative items-center whitespace-pre">
      <span className="invisible select-none pointer-events-none" aria-hidden="true">Agustín Fabrizio</span>
      <div className="absolute left-0 top-0 flex text-[#1C1C1A]">
        <span>A{currentMid}F{currentTail}</span>
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

