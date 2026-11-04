"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  servicesData,
  parseMethodologyMetadata,
  type Subservice,
} from "@/data/services";
import {
  Plus,
  Trash2,
  Check,
  Save,
  Upload,
  X,
  Image as ImageIcon,
} from "lucide-react";

export interface SupabaseServiceRow {
  id: string;
  order_number: string;
  title: string;
  description: string;
  detail_description: string;
  cover_image?: string | null;
  subservices: Subservice[];
  methodology_title?: string | null;
  methodology_steps: string[];
  order_index: number;
}

function generateSlug(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildInitialSeedRows(): SupabaseServiceRow[] {
  return servicesData.map((srv, idx) => ({
    id: srv.id,
    order_number: srv.orderNumber,
    title: srv.title,
    description: srv.description,
    detail_description: srv.detailDescription || srv.description,
    cover_image: srv.coverImage,
    subservices: srv.subservices,
    methodology_title: JSON.stringify({
      cover_image: srv.coverImage,
      detail_description: srv.detailDescription || srv.description,
    }),
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

function normalizeSpecs(raw: unknown, fallback: string[] = []): string[] {
  if (!Array.isArray(raw)) return fallback;
  return raw
    .map((item) => (typeof item === "string" ? item : String(item ?? "")))
    .filter((s) => s.trim() !== "");
}

function mapRawRowToServiceRow(
  r: Record<string, unknown>,
  idx: number
): SupabaseServiceRow {
  const id = String(r.id || "");
  const localMatch = servicesData.find((s) => s.id === id);
  const meta = parseMethodologyMetadata(r.methodology_title);

  const description = String(r.description || localMatch?.description || "");
  const detailDescription = String(
    r.detail_description ||
      r.long_description ||
      meta.detailDescription ||
      localMatch?.detailDescription ||
      description
  );
  const coverImage = String(
    (typeof r.cover_image === "string" && r.cover_image.trim()) ||
      meta.coverImage ||
      localMatch?.coverImage ||
      "/projects/centro-de-trasbordo/01-render-exterior.webp"
  );

  return {
    id,
    order_number: String(
      r.order_number ||
        localMatch?.orderNumber ||
        String(idx + 1).padStart(2, "0")
    ),
    title: String(r.title || localMatch?.title || ""),
    description,
    detail_description: detailDescription,
    cover_image: coverImage,
    subservices: normalizeSubservices(
      r.subservices ?? r.scope_items ?? localMatch?.subservices ?? []
    ),
    methodology_title:
      typeof r.methodology_title === "string" ? r.methodology_title : null,
    methodology_steps: normalizeSpecs(
      r.specifications ?? r.tools ?? r.methodology_steps,
      localMatch?.technicalSpecs || []
    ),
    order_index: Number(r.order_index ?? idx + 1),
  };
}

async function upsertServicesSafe(rows: SupabaseServiceRow[]) {
  const fullPayload = rows.map((r, idx) => {
    const coverUrl =
      r.cover_image || "/projects/centro-de-trasbordo/01-render-exterior.webp";
    const cleanDesc = r.description.trim();
    const cleanDetailDesc = r.detail_description.trim() || cleanDesc;
    const cleanSubservices = r.subservices
      .map((s) => ({ ...s, title: s.title.trim() }))
      .filter((s) => s.title !== "");
    const cleanSpecs = (r.methodology_steps || [])
      .map((s) => s.trim())
      .filter((s) => s !== "");

    return {
      id: r.id,
      order_number: r.order_number,
      title: r.title.trim(),
      description: cleanDesc,
      detail_description: cleanDetailDesc,
      cover_image: coverUrl,
      subservices: cleanSubservices,
      specifications: cleanSpecs,
      methodology_title: JSON.stringify({
        cover_image: coverUrl,
        detail_description: cleanDetailDesc,
      }),
      methodology_steps: cleanSpecs,
      order_index: r.order_index ?? idx + 1,
    };
  });

  const { data, error } = await supabase
    .from("services")
    .upsert(fullPayload, { onConflict: "id" })
    .select("*");

  if (error) {
    // Fallback compatible con el esquema base de public.services en Supabase
    // respaldando cover_image y detail_description en methodology_title y specifications en methodology_steps
    const fallbackPayload = fullPayload.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ cover_image, detail_description, specifications, ...rest }) => rest
    );
    return await supabase
      .from("services")
      .upsert(fallbackPayload, { onConflict: "id" })
      .select("*");
  }

  return { data, error };
}

export default function AdminServices() {
  const [services, setServices] = useState<SupabaseServiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savingAll, setSavingAll] = useState(false);
  const [uploadingCoverId, setUploadingCoverId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);
  const [newSubInputs, setNewSubInputs] = useState<Record<string, string>>({});
  const [newSpecInputs, setNewSpecInputs] = useState<Record<string, string>>(
    {}
  );

  // Modal de Creación de Nuevo Servicio
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newOrderNumber, setNewOrderNumber] = useState("06");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDetailDescription, setNewDetailDescription] = useState("");
  const [newSubservices, setNewSubservices] = useState<Subservice[]>([]);
  const [newModalSubInput, setNewModalSubInput] = useState("");
  const [newSpecs, setNewSpecs] = useState<string[]>([]);
  const [newModalSpecInput, setNewModalSpecInput] = useState("");
  const [newCoverFile, setNewCoverFile] = useState<File | null>(null);
  const [newCoverPreview, setNewCoverPreview] = useState<string | null>(null);
  const [creatingService, setCreatingService] = useState(false);

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
          const { data: inserted, error: seedError } =
            await upsertServicesSafe(seedRows);

          if (!active) return;

          if (seedError) {
            setError(`Error al inicializar servicios: ${seedError.message}`);
            setServices(seedRows);
          } else {
            const rawList = (inserted as Record<string, unknown>[]) || [];
            const normalized: SupabaseServiceRow[] = (
              rawList.length > 0
                ? rawList
                : (seedRows as unknown as Record<string, unknown>[])
            ).map(mapRawRowToServiceRow);
            setServices(normalized);
            setFeedbackSuccess(
              "Tabla services inicializada automáticamente con los servicios del catálogo."
            );
          }
        } else {
          const normalized: SupabaseServiceRow[] = (
            data as Record<string, unknown>[]
          ).map(mapRawRowToServiceRow);
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

  useEffect(() => {
    return () => {
      if (newCoverPreview) URL.revokeObjectURL(newCoverPreview);
    };
  }, [newCoverPreview]);

  const handleFieldChange = (
    serviceId: string,
    field:
      | "title"
      | "description"
      | "detail_description"
      | "order_number"
      | "cover_image",
    value: string
  ) => {
    setServices((prev) =>
      prev.map((srv) =>
        srv.id === serviceId ? { ...srv, [field]: value } : srv
      )
    );
  };

  const handleCoverUploadForService = async (
    serviceId: string,
    file: File | undefined
  ) => {
    if (!file || uploadingCoverId) return;
    setUploadingCoverId(serviceId);
    setError(null);
    setFeedbackSuccess(null);

    try {
      const path = `services/${serviceId}/cover.webp`;
      const { error: uploadError } = await supabase.storage
        .from("portfolio")
        .upload(path, file, { upsert: true });

      if (uploadError) {
        throw new Error(`Error al subir imagen: ${uploadError.message}`);
      }

      const publicUrl = `${
        supabase.storage.from("portfolio").getPublicUrl(path).data.publicUrl
      }?t=${Date.now()}`;

      const updatedList = services.map((srv) =>
        srv.id === serviceId
          ? {
              ...srv,
              cover_image: publicUrl,
            }
          : srv
      );
      setServices(updatedList);

      const targetRow = updatedList.find((s) => s.id === serviceId);
      if (targetRow) {
        const { error: saveErr } = await upsertServicesSafe([targetRow]);
        if (saveErr) {
          throw new Error(
            `Imagen subida pero falló al guardar: ${saveErr.message}`
          );
        }
      }

      setFeedbackSuccess(
        "Imagen representativa subida y sincronizada en el servicio."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo subir la imagen del servicio."
      );
    } finally {
      setUploadingCoverId(null);
    }
  };

  // --- Handlers para 01 / ALCANCE DEL SERVICIO (subservices / scope_items) ---
  const handleSubserviceEdit = (
    serviceId: string,
    subIndex: number,
    newTitleVal: string
  ) => {
    setServices((prev) =>
      prev.map((srv) => {
        if (srv.id !== serviceId) return srv;
        const updated = srv.subservices.map((sub, idx) =>
          idx === subIndex ? { ...sub, title: newTitleVal } : sub
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

    const slugId = generateSlug(rawText) || `sub-${Date.now()}`;

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

  // --- Handlers para 02 / ESPECIFICACIONES Y HERRAMIENTAS (specifications / tools / methodology_steps) ---
  const handleSpecEdit = (
    serviceId: string,
    specIndex: number,
    newVal: string
  ) => {
    setServices((prev) =>
      prev.map((srv) => {
        if (srv.id !== serviceId) return srv;
        const updated = (srv.methodology_steps || []).map((item, idx) =>
          idx === specIndex ? newVal : item
        );
        return { ...srv, methodology_steps: updated };
      })
    );
  };

  const handleSpecDelete = (serviceId: string, specIndex: number) => {
    setServices((prev) =>
      prev.map((srv) => {
        if (srv.id !== serviceId) return srv;
        const updated = (srv.methodology_steps || []).filter(
          (_, idx) => idx !== specIndex
        );
        return { ...srv, methodology_steps: updated };
      })
    );
  };

  const handleSpecAdd = (serviceId: string) => {
    const rawText = (newSpecInputs[serviceId] || "").trim();
    if (!rawText) return;

    setServices((prev) =>
      prev.map((srv) => {
        if (srv.id !== serviceId) return srv;
        return {
          ...srv,
          methodology_steps: [...(srv.methodology_steps || []), rawText],
        };
      })
    );

    setNewSpecInputs((prev) => ({ ...prev, [serviceId]: "" }));
  };

  const handleSaveService = async (service: SupabaseServiceRow) => {
    if (savingId || savingAll) return;
    setSavingId(service.id);
    setError(null);
    setFeedbackSuccess(null);

    try {
      const { error: upsertError } = await upsertServicesSafe([service]);

      if (upsertError) {
        setError(
          `No se pudo guardar "${service.title}": ${upsertError.message}`
        );
      } else {
        setFeedbackSuccess(
          `Servicio [${service.order_number} / ${service.title}] guardado correctamente.`
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
      const { error: upsertError } = await upsertServicesSafe(services);

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

  const handleDeleteService = async (id: string) => {
    if (deletingId) return;
    setDeletingId(id);
    setError(null);
    setFeedbackSuccess(null);

    try {
      const { error: delError } = await supabase
        .from("services")
        .delete()
        .eq("id", id);

      if (delError) {
        setError(`No se pudo eliminar el servicio: ${delError.message}`);
      } else {
        setServices((prev) => prev.filter((s) => s.id !== id));
        setConfirmDeleteId(null);
        setFeedbackSuccess("Servicio eliminado correctamente.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al eliminar el servicio."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // --- Nuevo Servicio Modal Handlers ---
  const openNewServiceModal = () => {
    const nextNum = String(services.length + 1).padStart(2, "0");
    setNewOrderNumber(nextNum);
    setNewTitle("");
    setNewDescription("");
    setNewDetailDescription("");
    setNewSubservices([]);
    setNewModalSubInput("");
    setNewSpecs([]);
    setNewModalSpecInput("");
    if (newCoverPreview) URL.revokeObjectURL(newCoverPreview);
    setNewCoverFile(null);
    setNewCoverPreview(null);
    setError(null);
    setFeedbackSuccess(null);
    setIsNewModalOpen(true);
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (creatingService) return;

    const cleanTitle = newTitle.trim();
    const cleanSlug = generateSlug(cleanTitle);

    if (!cleanTitle || !cleanSlug) {
      setError("El título del nuevo servicio es obligatorio.");
      return;
    }

    setCreatingService(true);
    setError(null);

    try {
      let coverPublicUrl =
        "/projects/centro-de-trasbordo/01-render-exterior.webp";

      if (newCoverFile) {
        const path = `services/${cleanSlug}/cover.webp`;
        const { error: uploadErr } = await supabase.storage
          .from("portfolio")
          .upload(path, newCoverFile, { upsert: true });

        if (uploadErr) {
          throw new Error(
            `Error al subir la imagen del servicio: ${uploadErr.message}`
          );
        }

        coverPublicUrl = `${
          supabase.storage.from("portfolio").getPublicUrl(path).data.publicUrl
        }?t=${Date.now()}`;
      }

      const nextOrderIndex =
        services.length > 0
          ? Math.max(...services.map((s) => s.order_index || 0)) + 1
          : 1;

      const cleanDesc = newDescription.trim();
      const cleanDetailDesc = newDetailDescription.trim() || cleanDesc;

      const newRow: SupabaseServiceRow = {
        id: cleanSlug,
        order_number:
          newOrderNumber.trim() ||
          String(services.length + 1).padStart(2, "0"),
        title: cleanTitle,
        description: cleanDesc,
        detail_description: cleanDetailDesc,
        cover_image: coverPublicUrl,
        subservices: newSubservices.filter((s) => s.title.trim() !== ""),
        methodology_title: JSON.stringify({
          cover_image: coverPublicUrl,
          detail_description: cleanDetailDesc,
        }),
        methodology_steps: newSpecs.filter((s) => s.trim() !== ""),
        order_index: nextOrderIndex,
      };

      const { error: insertErr } = await upsertServicesSafe([newRow]);

      if (insertErr) {
        throw new Error(`Error al crear el servicio: ${insertErr.message}`);
      }

      setServices((prev) => [...prev, newRow]);
      setIsNewModalOpen(false);
      setFeedbackSuccess(`Nuevo servicio "${cleanTitle}" creado con éxito.`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ocurrió un error al crear el servicio."
      );
    } finally {
      setCreatingService(false);
    }
  };

  return (
    <div className="w-full font-roboto text-[#1C1C1A]">
      {/* Cabecera del Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1C1C1A]/15">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-[#686661] block">
            ESPECIFICACIONES, IMAGEN REPRESENTATIVA & ALCANCE TÉCNICO
          </span>
          <h2 className="text-lg font-medium tracking-tight text-[#1C1C1A] mt-0.5">
            {services.length} servicios actualmente activos
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={openNewServiceModal}
            className="inline-flex items-center justify-center gap-2 bg-[#099AD7] text-white text-xs uppercase tracking-wider font-medium px-5 h-10 rounded-none hover:bg-[#0886BC] active:bg-[#0776A6] transition-colors duration-200"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ NUEVO SERVICIO</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={savingAll || loading}
            className="inline-flex items-center justify-center gap-2 border border-[#1C1C1A] bg-[#FFFFFF] text-[#1C1C1A] hover:border-[#099AD7] hover:text-[#099AD7] text-xs uppercase tracking-wider font-medium px-5 h-10 rounded-none transition-colors duration-200 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>
              {savingAll ? "GUARDANDO..." : "GUARDAR TODOS LOS CAMBIOS"}
            </span>
          </button>
        </div>
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

      {/* Listado Editable de Servicios en Dos Niveles Horizontales */}
      {loading ? (
        <div className="mt-8 py-16 border border-[#1C1C1A]/15 bg-white flex items-center justify-center">
          <span className="text-xs uppercase tracking-wider text-[#686661]">
            Cargando servicios desde Supabase...
          </span>
        </div>
      ) : (
        <div className="mt-8">
          {services.map((service) => {
            const isSavingThis = savingId === service.id;
            const isUploadingCover = uploadingCoverId === service.id;
            const isConfirmingDelete = confirmDeleteId === service.id;
            const isDeletingThis = deletingId === service.id;
            const coverSrc =
              service.cover_image ||
              "/projects/centro-de-trasbordo/01-render-exterior.webp";

            return (
              <article
                key={service.id}
                className="bg-white border border-[#1C1C1A]/15 p-6 mb-8 rounded-none"
              >
                {/* A. Cabecera Superior de la Tarjeta */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-[#1C1C1A]/10">
                  <span className="text-xs font-medium uppercase tracking-wider text-[#099AD7] tabular-nums">
                    [ {service.order_number} / {service.title} ]
                  </span>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {isConfirmingDelete ? (
                      <div className="flex items-center gap-2 border border-[#A84A4A] bg-[#A84A4A]/5 px-2.5 py-1">
                        <span className="text-[11px] uppercase tracking-wider text-[#A84A4A] font-medium">
                          ¿Confirmar baja?
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteService(service.id)}
                          disabled={isDeletingThis}
                          className="bg-[#A84A4A] text-white text-[10px] uppercase tracking-wider px-2.5 py-1 font-medium"
                        >
                          {isDeletingThis ? "Borrando..." : "Sí, eliminar"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          disabled={isDeletingThis}
                          className="text-[10px] uppercase tracking-wider text-[#686661] hover:text-[#1C1C1A] px-1.5 py-1"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(service.id)}
                        className="inline-flex items-center gap-1.5 h-9 px-3.5 border border-[#1C1C1A]/15 text-[#A84A4A]/85 hover:bg-[#A84A4A] hover:text-white hover:border-[#A84A4A] text-xs uppercase tracking-wider rounded-none transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>ELIMINAR</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleSaveService(service)}
                      disabled={isSavingThis || savingAll}
                      className="inline-flex items-center justify-center gap-2 bg-[#099AD7] text-white text-xs uppercase tracking-wider font-medium px-4 h-9 rounded-none hover:bg-[#0886BC] transition-colors disabled:opacity-50"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>
                        {isSavingThis ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* B. Bloque Superior: Nivel Acordeón (/servicios) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-6 border-b border-[#1C1C1A]/10">
                  {/* Columna Izquierda (6 cols): Título del Servicio + Imagen Representativa del Acordeón */}
                  <div className="md:col-span-6 flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor={`srv-title-${service.id}`}
                        className="text-[11px] font-medium uppercase tracking-wider text-[#1C1C1A]/60"
                      >
                        TÍTULO DEL SERVICIO
                      </label>
                      <input
                        id={`srv-title-${service.id}`}
                        type="text"
                        value={service.title}
                        onChange={(e) =>
                          handleFieldChange(service.id, "title", e.target.value)
                        }
                        className="w-full h-10 px-3 bg-white text-[#1C1C1A] text-sm border border-[#1C1C1A]/20 rounded-none focus:outline-none focus:border-[#099AD7] transition-colors"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-[11px] font-medium uppercase tracking-wider text-[#1C1C1A]/60">
                        IMAGEN REPRESENTATIVA DEL ACORDEÓN
                      </span>

                      <div className="flex items-center gap-4">
                        <div className="w-40 relative aspect-[3/2] border border-[#1C1C1A]/15 bg-neutral-50 overflow-hidden shrink-0">
                          {coverSrc ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={coverSrc}
                              alt={service.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#9A9892]">
                              <ImageIcon className="w-5 h-5" />
                            </div>
                          )}
                        </div>

                        <label className="inline-flex items-center justify-center gap-1.5 h-9 px-3.5 border border-[#099AD7] text-[#099AD7] hover:bg-[#099AD7] hover:text-white text-xs uppercase tracking-wider font-medium rounded-none transition-colors cursor-pointer">
                          <Upload className="w-3.5 h-3.5" />
                          <span>
                            {isUploadingCover
                              ? "Subiendo..."
                              : "Reemplazar imagen"}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={isUploadingCover}
                            onChange={(e) =>
                              handleCoverUploadForService(
                                service.id,
                                e.target.files?.[0]
                              )
                            }
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Columna Derecha (6 cols): Descripción del Acordeón (Catálogo General) */}
                  <div className="md:col-span-6 flex flex-col justify-start gap-2">
                    <label
                      htmlFor={`srv-desc-${service.id}`}
                      className="text-[11px] font-medium uppercase tracking-wider text-[#1C1C1A]/60"
                    >
                      DESCRIPCIÓN DEL ACORDEÓN (CATÁLOGO GENERAL)
                    </label>
                    <textarea
                      id={`srv-desc-${service.id}`}
                      rows={5}
                      value={service.description}
                      onChange={(e) =>
                        handleFieldChange(
                          service.id,
                          "description",
                          e.target.value
                        )
                      }
                      className="w-full p-3 bg-white text-[#1C1C1A] text-sm border border-[#1C1C1A]/20 rounded-none focus:outline-none focus:border-[#099AD7] transition-colors leading-relaxed resize-y"
                    />
                  </div>
                </div>

                {/* C. Bloque Inferior: Nivel Detalle Interior (/servicios/[id]) */}
                <div className="pt-6 flex flex-col gap-4">
                  {/* Descripción Extendida de Detalle (Ancho Completo) */}
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor={`srv-detail-desc-${service.id}`}
                      className="text-[11px] font-medium uppercase tracking-wider text-[#1C1C1A]/60"
                    >
                      DESCRIPCIÓN EXTENDIDA (FICHA INTERNA DEL SERVICIO)
                    </label>
                    <textarea
                      id={`srv-detail-desc-${service.id}`}
                      rows={3}
                      value={service.detail_description}
                      onChange={(e) =>
                        handleFieldChange(
                          service.id,
                          "detail_description",
                          e.target.value
                        )
                      }
                      placeholder="Bajada introductoria que encabeza la vista de detalle /servicios/[id]..."
                      className="w-full p-3 bg-white text-[#1C1C1A] text-sm border border-[#1C1C1A]/20 rounded-none focus:outline-none focus:border-[#099AD7] transition-colors leading-relaxed resize-y"
                    />
                  </div>

                  {/* Cuadrícula de 2 Columnas Inferior: 01 Alcance y 02 Especificaciones */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    {/* Columna 01 / ALCANCE DEL SERVICIO */}
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs uppercase tracking-wider font-medium text-[#099AD7]">
                          01 / ALCANCE DEL SERVICIO
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-[#1C1C1A]/50 tabular-nums">
                          {service.subservices.length}{" "}
                          {service.subservices.length === 1 ? "ÍTEM" : "ÍTEMS"}
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
                              aria-label={`Ítem de alcance ${subIdx + 1}`}
                              className="flex-1 h-9 px-3 bg-white text-[#1C1C1A] text-xs border border-[#1C1C1A]/20 rounded-none focus:outline-none focus:border-[#099AD7] transition-colors"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                handleSubserviceDelete(service.id, subIdx)
                              }
                              title="Eliminar ítem"
                              aria-label={`Eliminar ítem ${sub.title}`}
                              className="h-9 px-2.5 border border-[#1C1C1A]/15 text-[#A84A4A] hover:bg-[#A84A4A] hover:text-white hover:border-[#A84A4A] rounded-none transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 flex items-center gap-2">
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
                          placeholder="Nuevo ítem del alcance..."
                          className="flex-1 h-9 px-3 bg-white text-[#1C1C1A] placeholder:text-[#9A9892] text-xs border border-[#1C1C1A]/20 rounded-none focus:outline-none focus:border-[#099AD7] transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => handleSubserviceAdd(service.id)}
                          className="inline-flex items-center gap-1.5 h-9 px-3.5 border border-[#099AD7] text-[#099AD7] hover:bg-[#099AD7] hover:text-white text-xs uppercase tracking-wider font-medium rounded-none transition-colors shrink-0"
                        >
                          <span>+ AGREGAR ÍTEM</span>
                        </button>
                      </div>
                    </div>

                    {/* Columna 02 / ESPECIFICACIONES Y HERRAMIENTAS */}
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs uppercase tracking-wider font-medium text-[#099AD7]">
                          02 / ESPECIFICACIONES Y HERRAMIENTAS
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-[#1C1C1A]/50 tabular-nums">
                          {(service.methodology_steps || []).length}{" "}
                          {(service.methodology_steps || []).length === 1
                            ? "ÍTEM"
                            : "ÍTEMS"}
                        </span>
                      </div>

                      <div className="flex flex-col gap-2">
                        {(service.methodology_steps || []).map(
                          (spec, specIdx) => (
                            <div
                              key={specIdx}
                              className="flex items-center gap-2"
                            >
                              <span className="w-7 flex items-center justify-start text-[#099AD7] shrink-0">
                                <Check className="w-3.5 h-3.5 stroke-[2]" />
                              </span>
                              <input
                                type="text"
                                value={spec}
                                onChange={(e) =>
                                  handleSpecEdit(
                                    service.id,
                                    specIdx,
                                    e.target.value
                                  )
                                }
                                aria-label={`Especificación o herramienta ${
                                  specIdx + 1
                                }`}
                                className="flex-1 h-9 px-3 bg-white text-[#1C1C1A] text-xs border border-[#1C1C1A]/20 rounded-none focus:outline-none focus:border-[#099AD7] transition-colors"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  handleSpecDelete(service.id, specIdx)
                                }
                                title="Eliminar especificación"
                                aria-label={`Eliminar especificación ${spec}`}
                                className="h-9 px-2.5 border border-[#1C1C1A]/15 text-[#A84A4A] hover:bg-[#A84A4A] hover:text-white hover:border-[#A84A4A] rounded-none transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )
                        )}
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <input
                          type="text"
                          value={newSpecInputs[service.id] || ""}
                          onChange={(e) =>
                            setNewSpecInputs((prev) => ({
                              ...prev,
                              [service.id]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleSpecAdd(service.id);
                            }
                          }}
                          placeholder="Nuevo software o estándar técnico..."
                          className="flex-1 h-9 px-3 bg-white text-[#1C1C1A] placeholder:text-[#9A9892] text-xs border border-[#1C1C1A]/20 rounded-none focus:outline-none focus:border-[#099AD7] transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => handleSpecAdd(service.id)}
                          className="inline-flex items-center gap-1.5 h-9 px-3.5 border border-[#099AD7] text-[#099AD7] hover:bg-[#099AD7] hover:text-white text-xs uppercase tracking-wider font-medium rounded-none transition-colors shrink-0"
                        >
                          <span>+ AGREGAR ÍTEM</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Modal de Creación de Nuevo Servicio */}
      {isNewModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-new-service-title"
          className="fixed inset-0 z-50 bg-[#1C1C1A]/40 flex items-center justify-center p-4 md:p-8 overflow-y-auto"
        >
          <div className="w-full max-w-2xl bg-[#FFFFFF] border border-neutral-300 shadow-none my-auto">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#099AD7] font-semibold block">
                  ALTA DE SERVICIO
                </span>
                <h3
                  id="modal-new-service-title"
                  className="text-base font-medium text-[#1C1C1A]"
                >
                  Crear Nuevo Servicio en Catálogo
                </h3>
              </div>

              <button
                type="button"
                onClick={() => !creatingService && setIsNewModalOpen(false)}
                disabled={creatingService}
                aria-label="Cerrar modal"
                className="p-1.5 text-[#686661] hover:text-[#1C1C1A]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleCreateService}
              className="p-6 flex flex-col gap-4"
              noValidate
            >
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#1C1C1A]/60 font-medium">
                    N° Orden
                  </label>
                  <input
                    type="text"
                    value={newOrderNumber}
                    onChange={(e) => setNewOrderNumber(e.target.value)}
                    placeholder="06"
                    className="h-10 px-3 border border-neutral-300 text-sm focus:outline-none focus:border-[#099AD7]"
                  />
                </div>

                <div className="sm:col-span-3 flex flex-col gap-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#1C1C1A]/60 font-medium">
                    Título del Servicio
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ej. Cómputo y Presupuesto de Obra"
                    required
                    className="h-10 px-3 border border-neutral-300 text-sm focus:outline-none focus:border-[#099AD7]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] uppercase tracking-wider text-[#1C1C1A]/60 font-medium">
                  Descripción del Acordeón (Catálogo General)
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Párrafo corto que se despliega en el acordeón de /servicios..."
                  className="p-3 border border-neutral-300 text-sm focus:outline-none focus:border-[#099AD7] resize-y"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] uppercase tracking-wider text-[#1C1C1A]/60 font-medium">
                  Descripción Extendida (Ficha Interna del Servicio)
                </label>
                <textarea
                  rows={3}
                  value={newDetailDescription}
                  onChange={(e) => setNewDetailDescription(e.target.value)}
                  placeholder="Bajada introductoria para la vista de detalle /servicios/[id]..."
                  className="p-3 border border-neutral-300 text-sm focus:outline-none focus:border-[#099AD7] resize-y"
                />
              </div>

              {/* Imagen Representativa */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] uppercase tracking-wider text-[#1C1C1A]/60 font-medium">
                  Imagen Representativa del Acordeón
                </label>
                {newCoverPreview ? (
                  <div className="relative w-full h-36 border border-neutral-300 bg-neutral-50 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={newCoverPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        URL.revokeObjectURL(newCoverPreview);
                        setNewCoverFile(null);
                        setNewCoverPreview(null);
                      }}
                      className="absolute top-2 right-2 bg-[#FFFFFF]/90 border border-neutral-300 px-2.5 py-1 text-[10px] uppercase tracking-wider"
                    >
                      Reemplazar imagen
                    </button>
                  </div>
                ) : (
                  <label className="w-full h-24 border border-dashed border-neutral-300 hover:border-[#099AD7] flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-[#099AD7]" />
                    <span className="text-xs uppercase tracking-wider text-[#1C1C1A] font-medium">
                      Seleccionar imagen representativa
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        if (newCoverPreview) URL.revokeObjectURL(newCoverPreview);
                        setNewCoverFile(f);
                        setNewCoverPreview(URL.createObjectURL(f));
                      }}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* 01 / Alcance del Servicio */}
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-wider text-[#099AD7] font-medium">
                  01 / ALCANCE DEL SERVICIO ({newSubservices.length})
                </label>
                {newSubservices.map((sub, idx) => (
                  <div key={sub.id} className="flex items-center gap-2">
                    <span className="w-6 text-xs text-[#099AD7] font-medium">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-xs text-[#1C1C1A] border border-neutral-200 px-2.5 py-1.5">
                      {sub.title}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setNewSubservices((prev) =>
                          prev.filter((_, i) => i !== idx)
                        )
                      }
                      className="text-xs text-[#A84A4A] px-2"
                    >
                      ×
                    </button>
                  </div>
                ))}

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newModalSubInput}
                    onChange={(e) => setNewModalSubInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const val = newModalSubInput.trim();
                        if (!val) return;
                        setNewSubservices((prev) => [
                          ...prev,
                          {
                            id: `${generateSlug(val)}-${Date.now()}`,
                            title: val,
                          },
                        ]);
                        setNewModalSubInput("");
                      }
                    }}
                    placeholder="Agregar ítem del alcance..."
                    className="flex-1 h-9 px-3 border border-neutral-300 text-xs focus:outline-none focus:border-[#099AD7]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const val = newModalSubInput.trim();
                      if (!val) return;
                      setNewSubservices((prev) => [
                        ...prev,
                        {
                          id: `${generateSlug(val)}-${Date.now()}`,
                          title: val,
                        },
                      ]);
                      setNewModalSubInput("");
                    }}
                    className="h-9 px-3.5 border border-[#099AD7] text-[#099AD7] hover:bg-[#099AD7] hover:text-white text-xs uppercase tracking-wider font-medium"
                  >
                    + AGREGAR ÍTEM
                  </button>
                </div>
              </div>

              {/* 02 / Especificaciones y Herramientas */}
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-wider text-[#099AD7] font-medium">
                  02 / ESPECIFICACIONES Y HERRAMIENTAS ({newSpecs.length})
                </label>
                {newSpecs.map((spec, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-6 flex items-center text-[#099AD7]">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    <span className="flex-1 text-xs text-[#1C1C1A] border border-neutral-200 px-2.5 py-1.5">
                      {spec}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setNewSpecs((prev) => prev.filter((_, i) => i !== idx))
                      }
                      className="text-xs text-[#A84A4A] px-2"
                    >
                      ×
                    </button>
                  </div>
                ))}

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newModalSpecInput}
                    onChange={(e) => setNewModalSpecInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const val = newModalSpecInput.trim();
                        if (!val) return;
                        setNewSpecs((prev) => [...prev, val]);
                        setNewModalSpecInput("");
                      }
                    }}
                    placeholder="Agregar software o estándar técnico..."
                    className="flex-1 h-9 px-3 border border-neutral-300 text-xs focus:outline-none focus:border-[#099AD7]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const val = newModalSpecInput.trim();
                      if (!val) return;
                      setNewSpecs((prev) => [...prev, val]);
                      setNewModalSpecInput("");
                    }}
                    className="h-9 px-3.5 border border-[#099AD7] text-[#099AD7] hover:bg-[#099AD7] hover:text-white text-xs uppercase tracking-wider font-medium"
                  >
                    + AGREGAR ÍTEM
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  disabled={creatingService}
                  className="h-10 px-4 text-xs uppercase tracking-wider text-[#686661] border border-neutral-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creatingService}
                  className="h-10 px-6 bg-[#099AD7] text-white text-xs uppercase tracking-wider font-medium hover:bg-[#0886BC] disabled:opacity-50"
                >
                  {creatingService ? "CREANDO..." : "CREAR SERVICIO"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
