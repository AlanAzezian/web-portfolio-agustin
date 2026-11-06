"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import AdminProjects from "@/components/admin/AdminProjects";
import AdminServices from "@/components/admin/AdminServices";
import AdminBio from "@/components/admin/AdminBio";

type AdminTab = "projects" | "services" | "bio";

export default function AdminPage() {
  const [checkingSession, setCheckingSession] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("projects");

  useEffect(() => {
    let active = true;

    async function checkSession() {
      try {
        const res = await fetch("/api/admin/login", {
          method: "GET",
          cache: "no-store",
        });
        if (!active) return;
        if (res.ok) {
          const data = await res.json();
          setIsAuthenticated(Boolean(data?.authenticated));
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        if (active) setIsAuthenticated(false);
      } finally {
        if (active) setCheckingSession(false);
      }
    }

    checkSession();
    return () => {
      active = false;
    };
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!password.trim() || loading) return;

    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data?.success) {
        setPassword("");
        setError(null);
        setIsAuthenticated(true);
      } else {
        setError(data?.message || "Contraseña incorrecta");
      }
    } catch {
      setError("No se pudo verificar la contraseña. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);

    try {
      await fetch("/api/admin/login", {
        method: "DELETE",
      });
    } finally {
      setIsAuthenticated(false);
      setPassword("");
      setError(null);
      setLoggingOut(false);
    }
  };

  if (checkingSession) {
    return (
      <main className="min-h-screen w-full bg-[#FFFFFF] text-[#1C1C1A] font-roboto flex items-center justify-center">
        <span className="text-xs uppercase tracking-wider text-[#686661]">
          Cargando...
        </span>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen w-full bg-[#FFFFFF] text-[#1C1C1A] font-roboto flex flex-col justify-between px-6 py-12 select-none">
        {/* Header / Logo superior */}
        <header className="w-full max-w-sm mx-auto flex flex-col items-center pt-4">
          <Link
            href="/"
            aria-label="Agustín Fabrizio"
            className="group inline-flex flex-col items-center gap-1.5 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#099AD7]"
          >
            <span className="text-3xl font-medium tracking-tight text-[#1C1C1A] flex items-baseline">
              <span>AF</span>
              <span className="w-[10px] h-[2px] bg-[#099AD7] inline-block self-end mb-[4px] ml-[2px]" />
            </span>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#686661] font-normal">
              Agustín Fabrizio
            </span>
          </Link>
        </header>

        {/* Bloque central de acceso */}
        <section className="w-full max-w-[340px] mx-auto my-auto py-10">
          <div className="mb-6">
            <h1 className="uppercase tracking-wider text-xs text-[#686661] font-medium">
              ACCESO ADMINISTRACIÓN
            </h1>
            <div className="w-full h-[1px] bg-neutral-300/80 mt-3" />
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4" noValidate>
            <div className="flex flex-col gap-2">
              <label htmlFor="admin-password" className="sr-only">
                Contraseña
              </label>
              <input
                id="admin-password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Contraseña"
                autoComplete="current-password"
                autoFocus
                required
                className="w-full h-11 px-3.5 bg-[#FFFFFF] text-[#1C1C1A] placeholder:text-[#9A9892] text-sm border border-neutral-300 rounded-none focus:outline-none focus:border-[#099AD7] transition-colors duration-200"
              />
            </div>

            {error && (
              <p
                role="alert"
                className="text-xs text-[#A84A4A] tracking-wide font-normal"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !password.trim()}
              className="w-full h-11 bg-[#099AD7] text-white text-xs uppercase tracking-wider font-medium rounded-none hover:bg-[#0886BC] active:bg-[#0776A6] disabled:opacity-50 disabled:pointer-events-none transition-colors duration-200 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#099AD7]"
            >
              {loading ? "VERIFICANDO..." : "INGRESAR"}
            </button>
          </form>

          <div className="mt-8 pt-4 border-t border-neutral-200/80 flex justify-start">
            <Link
              href="/"
              className="text-xs text-[#686661] hover:text-[#1C1C1A] transition-colors duration-200 tracking-wide focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#099AD7]"
            >
              ← Volver al sitio
            </Link>
          </div>
        </section>

        {/* Espaciador inferior para mantener centrado óptico */}
        <footer className="w-full max-w-sm mx-auto h-8" aria-hidden="true" />
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-0 mt-0 w-full bg-[#FFFFFF] text-[#1C1C1A] font-roboto flex flex-col">
      {/* Cabecera técnica al ras del borde superior */}
      <header className="w-full flex justify-between items-center py-3.5 px-6 md:px-12 border-b border-neutral-200 bg-white">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            aria-label="Agustín Fabrizio"
            className="text-xl font-medium tracking-tight text-[#1C1C1A] flex items-baseline focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#099AD7]"
          >
            <span>AF</span>
            <span className="w-[7px] h-[2px] bg-[#099AD7] inline-block self-end mb-[3px] ml-[2px]" />
          </Link>
          <span className="h-4 w-[1px] bg-neutral-300" aria-hidden="true" />
          <span className="text-sm font-medium tracking-wider uppercase text-[#1C1C1A]">
            Agustín Fabrizio — PANEL DE CONTROL
          </span>
        </div>

        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="hidden sm:inline-block text-xs text-[#686661] hover:text-[#1C1C1A] transition-colors duration-200 tracking-wide"
          >
            ← Volver al sitio
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="text-xs uppercase tracking-wider text-[#686661] hover:text-[#099AD7] border border-neutral-300 hover:border-[#099AD7] px-3.5 py-1.5 rounded-none transition-colors duration-200 disabled:opacity-50"
          >
            {loggingOut ? "Saliendo..." : "Cerrar sesión"}
          </button>
        </div>
      </header>

      {/* Selector de Pestañas (Tabs de navegación tipo cota técnica) */}
      <nav
        aria-label="Secciones del panel de control"
        className="w-full border-b border-neutral-200 bg-[#FFFFFF] px-6 md:px-12"
      >
        <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-6 md:gap-10 py-2.5">
          <button
            type="button"
            onClick={() => setActiveTab("projects")}
            className={`text-xs uppercase tracking-wider no-underline transition-colors duration-200 focus:outline-none ${
              activeTab === "projects"
                ? "text-[#099AD7] font-semibold"
                : "text-[#1C1C1A] font-medium hover:text-[#099AD7]"
            }`}
          >
            [ 01 / PROYECTOS ]
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("services")}
            className={`text-xs uppercase tracking-wider no-underline transition-colors duration-200 focus:outline-none ${
              activeTab === "services"
                ? "text-[#099AD7] font-semibold"
                : "text-[#1C1C1A] font-medium hover:text-[#099AD7]"
            }`}
          >
            [ 02 / SERVICIOS ]
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("bio")}
            className={`text-xs uppercase tracking-wider no-underline transition-colors duration-200 focus:outline-none ${
              activeTab === "bio"
                ? "text-[#099AD7] font-semibold"
                : "text-[#1C1C1A] font-medium hover:text-[#099AD7]"
            }`}
          >
            [ 03 / BIO & CONTACTO ]
          </button>
        </div>
      </nav>

      {/* Contenido principal del Dashboard */}
      <section className="w-full max-w-6xl mx-auto px-6 md:px-12 py-6 flex-1">
        {activeTab === "projects" && <AdminProjects />}
        {activeTab === "services" && <AdminServices />}
        {activeTab === "bio" && <AdminBio />}
      </section>
    </main>
  );
}
