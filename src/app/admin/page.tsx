"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { projects } from "@/data/projects";
import { servicesData } from "@/data/services";

export default function AdminPage() {
  const [checkingSession, setCheckingSession] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

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
    <main className="min-h-screen w-full bg-[#FFFFFF] text-[#1C1C1A] font-roboto flex flex-col">
      {/* Cabecera del panel administrativo */}
      <header className="w-full border-b border-neutral-200 bg-[#FFFFFF] px-6 md:px-16 h-20 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            aria-label="Agustín Fabrizio"
            className="text-2xl font-medium tracking-tight text-[#1C1C1A] flex items-baseline focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#099AD7]"
          >
            <span>AF</span>
            <span className="w-[8px] h-[2px] bg-[#099AD7] inline-block self-end mb-[3px] ml-[2px]" />
          </Link>
          <span className="h-4 w-[1px] bg-neutral-300" aria-hidden="true" />
          <span className="uppercase tracking-wider text-xs text-[#686661] font-medium">
            PANEL DE ADMINISTRACIÓN
          </span>
        </div>

        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-xs text-[#686661] hover:text-[#1C1C1A] transition-colors duration-200 tracking-wide"
          >
            ← Volver al sitio
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="text-xs uppercase tracking-wider text-[#686661] hover:text-[#099AD7] border border-neutral-300 hover:border-[#099AD7] px-3.5 py-2 rounded-none transition-colors duration-200 disabled:opacity-50"
          >
            {loggingOut ? "Saliendo..." : "Cerrar sesión"}
          </button>
        </div>
      </header>

      {/* Contenido principal del Dashboard */}
      <section className="w-full max-w-5xl mx-auto px-6 md:px-16 py-12 flex-1">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-wider text-[#686661] mb-2">
            GESTIÓN DE CONTENIDO
          </p>
          <h1 className="text-2xl font-medium tracking-tight text-[#1C1C1A]">
            Agustín Fabrizio — Portfolio
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-neutral-200 p-6 bg-[#FFFFFF] flex flex-col justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#686661]">
                MÓDULO 01
              </span>
              <h2 className="text-base font-medium text-[#1C1C1A] mt-1">
                Proyectos
              </h2>
              <p className="text-xs text-[#686661] mt-2 leading-relaxed">
                Obras, láminas técnicas y visualizaciones publicadas en el catálogo.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-100 flex items-baseline justify-between">
              <span className="text-xs text-[#686661]">Registrados</span>
              <span className="text-lg font-medium text-[#099AD7]">
                {projects.length}
              </span>
            </div>
          </div>

          <div className="border border-neutral-200 p-6 bg-[#FFFFFF] flex flex-col justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#686661]">
                MÓDULO 02
              </span>
              <h2 className="text-base font-medium text-[#1C1C1A] mt-1">
                Servicios
              </h2>
              <p className="text-xs text-[#686661] mt-2 leading-relaxed">
                Líneas de servicio, entregables y especificaciones técnicas.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-100 flex items-baseline justify-between">
              <span className="text-xs text-[#686661]">Activos</span>
              <span className="text-lg font-medium text-[#099AD7]">
                {servicesData.length}
              </span>
            </div>
          </div>

          <div className="border border-neutral-200 p-6 bg-[#FFFFFF] flex flex-col justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#686661]">
                MÓDULO 03
              </span>
              <h2 className="text-base font-medium text-[#1C1C1A] mt-1">
                Bio & Contacto
              </h2>
              <p className="text-xs text-[#686661] mt-2 leading-relaxed">
                Perfil profesional, experiencia académica y canales de contacto.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-100 flex items-baseline justify-between">
              <span className="text-xs text-[#686661]">Estado</span>
              <span className="text-xs uppercase tracking-wider font-medium text-[#099AD7]">
                Sincronizado
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
