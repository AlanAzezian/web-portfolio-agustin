"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
        router.push("/admin");
        router.refresh();
      } else {
        setError(data?.message || "Contraseña incorrecta");
      }
    } catch {
      setError("No se pudo verificar la contraseña. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#F8F7F4] text-[#1C1C1A] font-roboto flex flex-col justify-between px-6 py-12 select-none">
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
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
