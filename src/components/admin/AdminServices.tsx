"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { servicesData, type Subservice } from "@/data/services";
import { Plus, Trash2, Check, Save } from "lucide-react";

export interface SupabaseServiceRow {
  id: string;
  order_number: string;
  title: string;
  description: string;
  subservices: Subservice[];
  methodology_title?: string | null;
  methodology_steps?: string[] | null;
  order_index: number;
}

function buildInitialSeedRows(): SupabaseServiceRow[] {
  return servicesData.map((srv, idx) => ({
    id: srv.id,
    order_number: srv.orderNumber,
    title: srv.title,
    description: srv.description,
    subservices: srv.subservices,
    methodology_title: "02 / ESPECIFICACIONES Y HERRAMIENTAS",
    methodology_steps: srv.technicalSpecs,
    order_index: idx + 1,
  }));
}

function normalizeSubservices(raw: unknown): Subservice[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item, idx) => {
    if (typeof item === "string") {
      return { id: `sub-${idx + 1}`, title: item };
    }
    if (item && typeof item === "object") {
      const obj = item as Record<string, unknown>;
      return {
        id: typeof obj.id === "string" && obj.id ? obj.id : `sub-${idx + 1}`,
        title: typeof obj.title === "string" ? obj.title : "",
      };
    }
    return { id: `sub-${idx + 1}`, title: "" };
  });
}

export default function AdminServices() {
  const [services, setServices] = useState<SupabaseServiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savingAll, setSavingAll] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);
  const [newSubInputs, setNewSubInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    let active = true;

    async function initServices() {
      try {
        const { data, error: fetchError } = await supabase
          .from("services")
          .select("*")
          .order("order_index", { ascending: true });

        if (!active) return;

        if (fetchError) {
          setError(fetchError.message);
          setServices(buildInitialSeedRows());
          setLoading(false);
          return;
        }

        if (!data || data.length === 0) {
          const seedRows = buildInitialSeedRows();
          const { data: inserted, error: seedError } = await supabase
            .from("services")
            .upsert(seedRows, { onConflict: "id" })
            .select("*")
            .order("order_index", { ascending: true });

          if (!active) return;

          if (seedError) {
            setError(`Error al inicializar servicios: ${seedError.message}`);
            setServices(seedRows);
          } else {
            const normalized = ((inserted as SupabaseServiceRow[]) || seedRows).map(
              (r) => ({
                ...r,
                subservices: normalizeSubservices(r.subservices),
              })
            );
            setServices(normalized);
            setFeedbackSuccess(
              "Tabla services inicializada automáticamente con los servicios del catálogo."
            );
          }
        } else {
          const normalized = (data as SupabaseServiceRow[]).map((r) => ({
            ...r,
            subservices: normalizeSubservices(r.subservices),
          }));
          setServices(normalized);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Error al conectar con la tabla services."
          );
          setServices(buildInitialSeedRows());
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    initServices();
    return () => {
      active = false;
    };
  }, []);

  const handleFieldChange = (
    serviceId: string,
    field: "title" | "description" | "order_number",
    value: string
  ) => {
    setServices((prev) =>
      prev.map((srv) =>
        srv.id === serviceId ? { ...srv, [field]: value } : srv
      )
    );
  };

  const handleSubserviceEdit = (
    serviceId: string,
    subIndex: number,
    newTitle: string
  ) => {
    setServices((prev) =>
      prev.map((srv) => {
        if (srv.id !== serviceId) return srv;
        const updated = srv.subservices.map((sub, idx) =>
          idx === subIndex ? { ...sub, title: newTitle } : sub
        );
        return { ...srv, subservices: updated };
      })
    );
  };

  const handleSubserviceDelete = (serviceId: string, subIndex: number) => {
    setServices((prev) =>
      prev.map((srv) => {
        if (srv.id !== serviceId) return srv;
        const updated = srv.subservices.filter((_, idx) => idx !== subIndex);
        return { ...srv, subservices: updated };
      })
    );
  };

  const handleSubserviceAdd = (serviceId: string) => {
    const rawText = (newSubInputs[serviceId] || "").trim();
    if (!rawText) return;

    const slugId =
      rawText
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || `sub-${Date.now()}`;

    setServices((prev) =>
      prev.map((srv) => {
        if (srv.id !== serviceId) return srv;
        return {
          ...srv,
          subservices: [
            ...srv.subservices,
            { id: `${slugId}-${Date.now()}`, title: rawText },
          ],
        };
      })
    );

    setNewSubInputs((prev) => ({ ...prev, [serviceId]: "" }));
  };

  const handleSaveService = async (service: SupabaseServiceRow) => {
    if (savingId || savingAll) return;
    setSavingId(service.id);
    setError(null);
    setFeedbackSuccess(null);

    try {
      const payload: SupabaseServiceRow = {
        id: service.id,
        order_number: service.order_number,
        title: service.title.trim(),
        description: service.description.trim(),
        subservices: service.subservices.filter((s) => s.title.trim() !== ""),
        methodology_title: service.methodology_title || "02 / ESPECIFICACIONES Y HERRAMIENTAS",
        methodology_steps: service.methodology_steps || [],
        order_index: service.order_index,
      };

      const { error: upsertError } = await supabase
        .from("services")
        .upsert([payload], { onConflict: "id" });

      if (upsertError) {
        setError(`No se pudo guardar "${service.title}": ${upsertError.message}`);
      } else {
        setFeedbackSuccess(
          `Servicio [${service.order_number}] "${service.title}" guardado en Supabase.`
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al guardar el servicio."
      );
    } finally {
      setSavingId(null);
    }
  };

  const handleSaveAll = async () => {
    if (savingAll || savingId) return;
    setSavingAll(true);
    setError(null);
    setFeedbackSuccess(null);

    try {
      const payload = services.map((service, idx) => ({
        id: service.id,
        order_number: service.order_number,
        title: service.title.trim(),
        description: service.description.trim(),
        subservices: service.subservices.filter((s) => s.title.trim() !== ""),
        methodology_title:
          service.methodology_title || "02 / ESPECIFICACIONES Y HERRAMIENTAS",
        methodology_steps: service.methodology_steps || [],
        order_index: service.order_index ?? idx + 1,
      }));

      const { error: upsertError } = await supabase
        .from("services")
        .upsert(payload, { onConflict: "id" });

      if (upsertError) {
        setError(`Error al guardar los servicios: ${upsertError.message}`);
      } else {
        setFeedbackSuccess(
          "Todos los servicios fueron actualizados correctamente en Supabase."
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al guardar todos los servicios."
      );
    } finally {
      setSavingAll(false);
    }
  };

  return (
    <div className="w-full font-roboto text-[#1C1C1A]">
      {/* Cabecera del Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-[#686661] block">
            ESPECIFICACIONES & ALCANCE TÉCNICO
          </span>
          <h2 className="text-lg font-medium tracking-tight text-[#1C1C1A] mt-0.5">
            Líneas de Servicio ({services.length})
          </h2>
        </div>

        <button
          type="button"
          onClick={handleSaveAll}
          disabled={savingAll || loading}
          className="inline-flex items-center justify-center gap-2 bg-[#099AD7] text-white text-xs uppercase tracking-wider font-medium px-5 h-10 rounded-none hover:bg-[#0886BC] active:bg-[#0776A6] transition-colors duration-200 disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          <span>
            {savingAll ? "GUARDANDO CAMBIOS..." : "GUARDAR TODOS LOS CAMBIOS"}
          </span>
        </button>
      </div>

      {/* Feedback de éxito / error */}
      {feedbackSuccess && (
        <div
          role="status"
          className="mt-6 border border-[#099AD7]/40 bg-[#099AD7]/5 px-4 py-3 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#099AD7]" />
            <span className="text-xs text-[#1C1C1A] tracking-wide">
              {feedbackSuccess}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackSuccess(null)}
            className="text-xs uppercase tracking-wider text-[#686661] hover:text-[#1C1C1A]"
          >
            CERRAR
          </button>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="mt-6 border border-[#A84A4A]/40 bg-[#A84A4A]/5 px-4 py-3 flex items-center justify-between"
        >
          <span className="text-xs text-[#A84A4A] tracking-wide">{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-xs uppercase tracking-wider text-[#A84A4A] hover:underline"
          >
            OCULTAR
          </button>
        </div>
      )}

      {/* Listado Editable de Servicios */}
      {loading ? (
        <div className="mt-8 py-16 border border-neutral-200 bg-[#FFFFFF] flex items-center justify-center">
          <span className="text-xs uppercase tracking-wider text-[#686661]">
            Cargando servicios desde Supabase...
          </span>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-8">
          {services.map((service) => {
            const isSavingThis = savingId === service.id;

            return (
              <article
                key={service.id}
                className="border border-neutral-200 bg-[#FFFFFF] p-6"
              >
                {/* Encabezado de la tarjeta de servicio */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-200">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 bg-[#099AD7]/10 text-[#099AD7] text-xs font-semibold tabular-nums tracking-wider">
                      {service.order_number}
                    </span>
                    <span className="text-[11px] uppercase tracking-wider text-[#686661] font-mono">
                      ID: {service.id}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSaveService(service)}
                    disabled={isSavingThis || savingAll}
                    className="inline-flex items-center justify-center gap-2 bg-[#099AD7] text-white text-xs uppercase tracking-wider font-medium px-4 h-9 rounded-none hover:bg-[#0886BC] transition-colors disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>
                      {isSavingThis ? "Guardando..." : "Guardar cambios"}
                    </span>
                  </button>
                </div>

                {/* Campos principales: Título y Descripción */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5">
                  <div className="lg:col-span-5 flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor={`srv-title-${service.id}`}
                        className="text-[11px] uppercase tracking-wider text-[#1C1C1A] font-medium"
                      >
                        Título del servicio
                      </label>
                      <input
                        id={`srv-title-${service.id}`}
                        type="text"
                        value={service.title}
                        onChange={(e) =>
                          handleFieldChange(service.id, "title", e.target.value)
                        }
                        className="w-full h-10 px-3 bg-[#FFFFFF] text-[#1C1C1A] text-sm border border-neutral-300 rounded-none focus:outline-none focus:border-[#099AD7] transition-colors"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor={`srv-desc-${service.id}`}
                        className="text-[11px] uppercase tracking-wider text-[#1C1C1A] font-medium"
                      >
                        Descripción principal
                      </label>
                      <textarea
                        id={`srv-desc-${service.id}`}
                        rows={4}
                        value={service.description}
                        onChange={(e) =>
                          handleFieldChange(
                            service.id,
                            "description",
                            e.target.value
                          )
                        }
                        className="w-full p-3 bg-[#FFFFFF] text-[#1C1C1A] text-sm border border-neutral-300 rounded-none focus:outline-none focus:border-[#099AD7] transition-colors leading-relaxed resize-y"
                      />
                    </div>
                  </div>

                  {/* Lista de Subservicios (viñetas técnicas editables) */}
                  <div className="lg:col-span-7 flex flex-col justify-between lg:border-l lg:border-neutral-200 lg:pl-6">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] uppercase tracking-wider text-[#1C1C1A] font-medium">
                          Lista de Subservicios ({service.subservices.length})
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-[#686661]">
                          VIÑETAS TÉCNICAS
                        </span>
                      </div>

                      <div className="flex flex-col gap-2">
                        {service.subservices.map((sub, subIdx) => (
                          <div
                            key={sub.id || subIdx}
                            className="flex items-center gap-2"
                          >
                            <span className="w-7 text-xs font-medium text-[#099AD7] tabular-nums shrink-0">
                              {String(subIdx + 1).padStart(2, "0")}
                            </span>
                            <input
                              type="text"
                              value={sub.title}
                              onChange={(e) =>
                                handleSubserviceEdit(
                                  service.id,
                                  subIdx,
                                  e.target.value
                                )
                              }
                              aria-label={`Subservicio ${subIdx + 1}`}
                              className="flex-1 h-9 px-3 bg-[#FFFFFF] text-[#1C1C1A] text-xs border border-neutral-300 rounded-none focus:outline-none focus:border-[#099AD7] transition-colors"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                handleSubserviceDelete(service.id, subIdx)
                              }
                              title="Eliminar subservicio"
                              aria-label={`Eliminar subservicio ${sub.title}`}
                              className="h-9 px-2.5 border border-neutral-200 text-[#A84A4A] hover:bg-[#A84A4A] hover:text-white hover:border-[#A84A4A] transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Input para agregar nuevo subservicio */}
                    <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center gap-2">
                      <input
                        type="text"
                        value={newSubInputs[service.id] || ""}
                        onChange={(e) =>
                          setNewSubInputs((prev) => ({
                            ...prev,
                            [service.id]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleSubserviceAdd(service.id);
                          }
                        }}
                        placeholder="Agregar nuevo subservicio técnico..."
                        className="flex-1 h-9 px-3 bg-[#FFFFFF] text-[#1C1C1A] placeholder:text-[#9A9892] text-xs border border-neutral-300 rounded-none focus:outline-none focus:border-[#099AD7] transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => handleSubserviceAdd(service.id)}
                        className="inline-flex items-center gap-1.5 h-9 px-3.5 border border-[#099AD7] text-[#099AD7] hover:bg-[#099AD7] hover:text-white text-xs uppercase tracking-wider font-medium transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Agregar</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
