"use client";

import React, { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  WORK_ACCORDION_ITEMS,
  PARTICIPATION_ITEMS,
  SKILL_CARDS,
  type WorkAccordionItem,
  type ParticipationItem,
  type SkillCard,
} from "@/data/bio";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";
import { Save, Check, Plus, Trash2, Upload } from "lucide-react";

export interface SupabaseBioRow {
  id: string;
  manifesto: string;
  avatar_url: string;
  whatsapp: string;
  email: string;
  behance: string;
  linkedin: string;
  work_experience: WorkAccordionItem[];
  participations: ParticipationItem[];
  skills: SkillCard[];
  updated_at?: string;
}

const DEFAULT_MANIFESTO =
  "Disfruto del proceso creativo compartido, de escuchar, ser escuchado y construir ideas en conjunto. Me interesa proyectar una arquitectura conectada con lo cotidiano, enfocada en resolver necesidades reales, sin dejar de aprovechar los espacios lúdicos como instancias para explorar otras formas de habitar y pensar el diseño. Me considero metódico y técnico en el uso de herramientas digitales, lo que me permite integrar con fluidez el diseño, la representación y la producción. Me motiva aprender constantemente, tanto desde lo teórico como desde lo práctico, incorporando recursos que optimicen y agilicen mis procesos proyectuales.";

function buildInitialBioSeed(): SupabaseBioRow {
  return {
    id: "main",
    manifesto: DEFAULT_MANIFESTO,
    avatar_url: "/agustin-perfil.webp",
    whatsapp: WHATSAPP_NUMBER,
    email: "hola@agustinfabrizio.com",
    behance: "https://www.behance.net/agustinfabrizio",
    linkedin: "https://www.linkedin.com/",
    work_experience: WORK_ACCORDION_ITEMS,
    participations: PARTICIPATION_ITEMS,
    skills: SKILL_CARDS,
  };
}

export default function AdminBio() {
  const [bio, setBio] = useState<SupabaseBioRow>(buildInitialBioSeed);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);

  const [newTaskInputs, setNewTaskInputs] = useState<Record<string, string>>({});
  const [newSkillInputs, setNewSkillInputs] = useState<Record<number, string>>({});
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;

    async function initBio() {
      try {
        const { data, error: fetchError } = await supabase
          .from("bio")
          .select("*")
          .eq("id", "main")
          .maybeSingle();

        if (!active) return;

        if (fetchError) {
          setError(fetchError.message);
          setLoading(false);
          return;
        }

        if (!data) {
          const seed = buildInitialBioSeed();
          const { data: inserted, error: seedError } = await supabase
            .from("bio")
            .upsert([seed], { onConflict: "id" })
            .select("*")
            .single();

          if (!active) return;

          if (seedError) {
            setError(`Error al inicializar Bio: ${seedError.message}`);
            setBio(seed);
          } else if (inserted) {
            setBio({
              ...seed,
              ...(inserted as SupabaseBioRow),
              work_experience: Array.isArray(inserted.work_experience)
                ? inserted.work_experience
                : seed.work_experience,
              participations: Array.isArray(inserted.participations)
                ? inserted.participations
                : seed.participations,
              skills: Array.isArray(inserted.skills)
                ? inserted.skills
                : seed.skills,
            });
            setFeedbackSuccess(
              "Registro bio (id = 'main') inicializado en Supabase."
            );
          }
        } else {
          const seed = buildInitialBioSeed();
          setBio({
            ...seed,
            ...(data as SupabaseBioRow),
            work_experience: Array.isArray(data.work_experience)
              ? data.work_experience
              : seed.work_experience,
            participations: Array.isArray(data.participations)
              ? data.participations
              : seed.participations,
            skills: Array.isArray(data.skills) ? data.skills : seed.skills,
          });
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Error al cargar datos de Bio & Contacto."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    initBio();
    return () => {
      active = false;
    };
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || uploadingAvatar) return;

    setUploadingAvatar(true);
    setError(null);
    setFeedbackSuccess(null);

    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "webp";
      const path = `bio/avatar-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("portfolio")
        .upload(path, file, { upsert: true });

      if (uploadError) {
        throw new Error(`Error al subir foto de perfil: ${uploadError.message}`);
      }

      const publicUrl = supabase.storage.from("portfolio").getPublicUrl(path)
        .data.publicUrl;

      setBio((prev) => ({ ...prev, avatar_url: publicUrl }));
      setFeedbackSuccess(
        "Foto de perfil subida a Supabase Storage. Recuerda hacer clic en Guardar cambios."
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al subir el avatar."
      );
    } finally {
      setUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = "";
    }
  };

  // --- Experiencia Laboral handlers ---
  const handleWorkFieldChange = (
    workId: string,
    field: "role" | "company" | "period",
    value: string
  ) => {
    setBio((prev) => ({
      ...prev,
      work_experience: prev.work_experience.map((w) =>
        w.id === workId ? { ...w, [field]: value } : w
      ),
    }));
  };

  const handleWorkTaskChange = (
    workId: string,
    taskIdx: number,
    value: string
  ) => {
    setBio((prev) => ({
      ...prev,
      work_experience: prev.work_experience.map((w) => {
        if (w.id !== workId) return w;
        const tasks = w.tasks.map((t, idx) => (idx === taskIdx ? value : t));
        return { ...w, tasks };
      }),
    }));
  };

  const handleWorkTaskDelete = (workId: string, taskIdx: number) => {
    setBio((prev) => ({
      ...prev,
      work_experience: prev.work_experience.map((w) => {
        if (w.id !== workId) return w;
        return { ...w, tasks: w.tasks.filter((_, idx) => idx !== taskIdx) };
      }),
    }));
  };

  const handleWorkTaskAdd = (workId: string) => {
    const text = (newTaskInputs[workId] || "").trim();
    if (!text) return;
    setBio((prev) => ({
      ...prev,
      work_experience: prev.work_experience.map((w) =>
        w.id === workId ? { ...w, tasks: [...w.tasks, text] } : w
      ),
    }));
    setNewTaskInputs((prev) => ({ ...prev, [workId]: "" }));
  };

  const handleAddWorkExperience = () => {
    const nextNum = String(bio.work_experience.length + 1).padStart(2, "0");
    const newItem: WorkAccordionItem = {
      id: `work-${Date.now()}`,
      orderNumber: nextNum,
      role: "Nuevo Rol",
      company: "Estudio / Empresa",
      period: "2026 - Presente",
      tasks: ["Descripción técnica de tareas realizadas."],
    };
    setBio((prev) => ({
      ...prev,
      work_experience: [...prev.work_experience, newItem],
    }));
  };

  const handleDeleteWorkExperience = (workId: string) => {
    setBio((prev) => ({
      ...prev,
      work_experience: prev.work_experience
        .filter((w) => w.id !== workId)
        .map((w, i) => ({
          ...w,
          orderNumber: String(i + 1).padStart(2, "0"),
        })),
    }));
  };

  // --- Habilidades handlers ---
  const handleSkillTitleChange = (cardIdx: number, title: string) => {
    setBio((prev) => ({
      ...prev,
      skills: prev.skills.map((card, idx) =>
        idx === cardIdx ? { ...card, title } : card
      ),
    }));
  };

  const handleSkillItemDelete = (cardIdx: number, itemIdx: number) => {
    setBio((prev) => ({
      ...prev,
      skills: prev.skills.map((card, idx) =>
        idx === cardIdx
          ? { ...card, items: card.items.filter((_, i) => i !== itemIdx) }
          : card
      ),
    }));
  };

  const handleSkillItemAdd = (cardIdx: number) => {
    const val = (newSkillInputs[cardIdx] || "").trim();
    if (!val) return;
    setBio((prev) => ({
      ...prev,
      skills: prev.skills.map((card, idx) =>
        idx === cardIdx ? { ...card, items: [...card.items, val] } : card
      ),
    }));
    setNewSkillInputs((prev) => ({ ...prev, [cardIdx]: "" }));
  };

  // --- Participaciones handlers ---
  const handleParticipationChange = (
    partId: string,
    field: "year" | "category" | "title" | "description",
    value: string
  ) => {
    setBio((prev) => ({
      ...prev,
      participations: prev.participations.map((p) =>
        p.id === partId ? { ...p, [field]: value } : p
      ),
    }));
  };

  const handleSaveBio = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (saving) return;

    setSaving(true);
    setError(null);
    setFeedbackSuccess(null);

    try {
      const payload = {
        id: "main",
        manifesto: bio.manifesto.trim(),
        avatar_url: bio.avatar_url.trim(),
        whatsapp: bio.whatsapp.trim(),
        email: bio.email.trim(),
        behance: bio.behance.trim(),
        linkedin: bio.linkedin.trim(),
        work_experience: bio.work_experience,
        participations: bio.participations,
        skills: bio.skills,
        updated_at: new Date().toISOString(),
      };

      const { error: upsertError } = await supabase
        .from("bio")
        .upsert([payload], { onConflict: "id" });

      if (upsertError) {
        setError(`Error al guardar Bio & Contacto: ${upsertError.message}`);
      } else {
        setFeedbackSuccess(
          "Datos de Bio & Contacto guardados exitosamente en Supabase (id = 'main')."
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error inesperado al guardar Bio & Contacto."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 border border-neutral-200 bg-[#FFFFFF] flex items-center justify-center">
        <span className="text-xs uppercase tracking-wider text-[#686661]">
          Cargando perfil y datos de contacto desde Supabase...
        </span>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSaveBio}
      className="w-full font-roboto text-[#1C1C1A] flex flex-col gap-8"
      noValidate
    >
      {/* Cabecera del Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-[#686661] block">
            PERFIL PROFESIONAL, EXPERIENCIA & CANALES DIRECTOS
          </span>
          <h2 className="text-lg font-medium tracking-tight text-[#1C1C1A] mt-0.5">
            Bio & Contacto (Registro: main)
          </h2>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 bg-[#099AD7] text-white text-xs uppercase tracking-wider font-medium px-6 h-10 rounded-none hover:bg-[#0886BC] active:bg-[#0776A6] transition-colors duration-200 disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{saving ? "GUARDANDO CAMBIOS..." : "GUARDAR CAMBIOS"}</span>
        </button>
      </div>

      {/* Mensajes de estado */}
      {feedbackSuccess && (
        <div
          role="status"
          className="border border-[#099AD7]/40 bg-[#099AD7]/5 px-4 py-3 flex items-center justify-between"
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
          className="border border-[#A84A4A]/40 bg-[#A84A4A]/5 px-4 py-3 flex items-center justify-between"
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

      {/* SECCIÓN 01: MANIFIESTO, RETRATO Y CANALES DE CONTACTO */}
      <section className="border border-neutral-200 bg-[#FFFFFF] p-6">
        <div className="pb-4 mb-6 border-b border-neutral-200 flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-[#099AD7] font-semibold">
            01 / SOBRE MÍ & CANALES DE CONTACTO
          </span>
          <span className="text-[11px] uppercase tracking-wider text-[#686661]">
            TABLA: public.bio
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Avatar + URLs de Contacto */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <div className="w-24 h-24 border border-neutral-300 bg-neutral-50 shrink-0 overflow-hidden">
                {bio.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={bio.avatar_url}
                    alt="Avatar de Agustín Fabrizio"
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>

              <div className="flex-1 flex flex-col gap-2">
                <label
                  htmlFor="bio-avatar-url"
                  className="text-[11px] uppercase tracking-wider text-[#1C1C1A] font-medium"
                >
                  Retrato / Avatar URL
                </label>
                <input
                  id="bio-avatar-url"
                  type="text"
                  value={bio.avatar_url}
                  onChange={(e) =>
                    setBio((prev) => ({ ...prev, avatar_url: e.target.value }))
                  }
                  className="w-full h-9 px-3 bg-[#FFFFFF] text-[#1C1C1A] text-xs border border-neutral-300 rounded-none focus:outline-none focus:border-[#099AD7]"
                />
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="inline-flex items-center justify-center gap-1.5 h-8 px-3 border border-neutral-300 hover:border-[#099AD7] text-[11px] uppercase tracking-wider text-[#1C1C1A] hover:text-[#099AD7] transition-colors w-fit"
                >
                  <Upload className="w-3 h-3" />
                  <span>
                    {uploadingAvatar ? "Subiendo..." : "Subir nueva foto"}
                  </span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="bio-whatsapp"
                  className="text-[11px] uppercase tracking-wider text-[#1C1C1A] font-medium"
                >
                  WhatsApp (Número)
                </label>
                <input
                  id="bio-whatsapp"
                  type="text"
                  value={bio.whatsapp}
                  onChange={(e) =>
                    setBio((prev) => ({ ...prev, whatsapp: e.target.value }))
                  }
                  placeholder="5492364714924"
                  className="w-full h-9 px-3 bg-[#FFFFFF] text-[#1C1C1A] text-xs border border-neutral-300 rounded-none focus:outline-none focus:border-[#099AD7]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="bio-email"
                  className="text-[11px] uppercase tracking-wider text-[#1C1C1A] font-medium"
                >
                  Email
                </label>
                <input
                  id="bio-email"
                  type="email"
                  value={bio.email}
                  onChange={(e) =>
                    setBio((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="hola@agustinfabrizio.com"
                  className="w-full h-9 px-3 bg-[#FFFFFF] text-[#1C1C1A] text-xs border border-neutral-300 rounded-none focus:outline-none focus:border-[#099AD7]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="bio-behance"
                  className="text-[11px] uppercase tracking-wider text-[#1C1C1A] font-medium"
                >
                  Behance URL
                </label>
                <input
                  id="bio-behance"
                  type="url"
                  value={bio.behance}
                  onChange={(e) =>
                    setBio((prev) => ({ ...prev, behance: e.target.value }))
                  }
                  className="w-full h-9 px-3 bg-[#FFFFFF] text-[#1C1C1A] text-xs border border-neutral-300 rounded-none focus:outline-none focus:border-[#099AD7]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="bio-linkedin"
                  className="text-[11px] uppercase tracking-wider text-[#1C1C1A] font-medium"
                >
                  LinkedIn URL
                </label>
                <input
                  id="bio-linkedin"
                  type="url"
                  value={bio.linkedin}
                  onChange={(e) =>
                    setBio((prev) => ({ ...prev, linkedin: e.target.value }))
                  }
                  className="w-full h-9 px-3 bg-[#FFFFFF] text-[#1C1C1A] text-xs border border-neutral-300 rounded-none focus:outline-none focus:border-[#099AD7]"
                />
              </div>
            </div>
          </div>

          {/* Manifiesto Profesional */}
          <div className="lg:col-span-7 flex flex-col gap-2">
            <label
              htmlFor="bio-manifesto"
              className="text-[11px] uppercase tracking-wider text-[#1C1C1A] font-medium"
            >
              Manifiesto / Declaración Bio
            </label>
            <textarea
              id="bio-manifesto"
              rows={8}
              value={bio.manifesto}
              onChange={(e) =>
                setBio((prev) => ({ ...prev, manifesto: e.target.value }))
              }
              className="w-full p-3.5 bg-[#FFFFFF] text-[#1C1C1A] text-sm border border-neutral-300 rounded-none focus:outline-none focus:border-[#099AD7] leading-relaxed resize-y"
            />
          </div>
        </div>
      </section>

      {/* SECCIÓN 02: EXPERIENCIA LABORAL */}
      <section className="border border-neutral-200 bg-[#FFFFFF] p-6">
        <div className="pb-4 mb-6 border-b border-neutral-200 flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-[#099AD7] font-semibold">
            02 / EXPERIENCIA LABORAL ({bio.work_experience.length})
          </span>
          <button
            type="button"
            onClick={handleAddWorkExperience}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#099AD7] text-[#099AD7] hover:bg-[#099AD7] hover:text-white text-xs uppercase tracking-wider font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Agregar Puesto</span>
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {bio.work_experience.map((work) => (
            <div
              key={work.id}
              className="border border-neutral-200 p-4 bg-[#FFFFFF] flex flex-col gap-4"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                <span className="text-xs font-semibold text-[#099AD7] tabular-nums">
                  PUESTO #{work.orderNumber}
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteWorkExperience(work.id)}
                  className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-[#A84A4A] hover:underline"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Eliminar puesto</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase tracking-wider text-[#686661]">
                    Rol / Cargo
                  </label>
                  <input
                    type="text"
                    value={work.role}
                    onChange={(e) =>
                      handleWorkFieldChange(work.id, "role", e.target.value)
                    }
                    className="h-9 px-3 border border-neutral-300 text-xs focus:outline-none focus:border-[#099AD7]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase tracking-wider text-[#686661]">
                    Estudio / Empresa
                  </label>
                  <input
                    type="text"
                    value={work.company}
                    onChange={(e) =>
                      handleWorkFieldChange(work.id, "company", e.target.value)
                    }
                    className="h-9 px-3 border border-neutral-300 text-xs focus:outline-none focus:border-[#099AD7]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase tracking-wider text-[#686661]">
                    Período
                  </label>
                  <input
                    type="text"
                    value={work.period}
                    onChange={(e) =>
                      handleWorkFieldChange(work.id, "period", e.target.value)
                    }
                    className="h-9 px-3 border border-neutral-300 text-xs focus:outline-none focus:border-[#099AD7]"
                  />
                </div>
              </div>

              {/* Tareas del puesto */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-wider text-[#686661]">
                  Responsabilidades & Alcance Técnico
                </span>
                {work.tasks.map((task, tIdx) => (
                  <div key={tIdx} className="flex items-center gap-2">
                    <span className="w-5 text-[11px] text-[#099AD7] font-medium tabular-nums">
                      {tIdx + 1}.
                    </span>
                    <input
                      type="text"
                      value={task}
                      onChange={(e) =>
                        handleWorkTaskChange(work.id, tIdx, e.target.value)
                      }
                      className="flex-1 h-8 px-2.5 border border-neutral-300 text-xs focus:outline-none focus:border-[#099AD7]"
                    />
                    <button
                      type="button"
                      onClick={() => handleWorkTaskDelete(work.id, tIdx)}
                      aria-label="Eliminar tarea"
                      className="h-8 px-2 border border-neutral-200 text-[#A84A4A] hover:bg-[#A84A4A] hover:text-white transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newTaskInputs[work.id] || ""}
                    onChange={(e) =>
                      setNewTaskInputs((prev) => ({
                        ...prev,
                        [work.id]: e.target.value,
                      }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleWorkTaskAdd(work.id);
                      }
                    }}
                    placeholder="Agregar responsabilidad técnica..."
                    className="flex-1 h-8 px-2.5 border border-neutral-300 text-xs placeholder:text-[#9A9892] focus:outline-none focus:border-[#099AD7]"
                  />
                  <button
                    type="button"
                    onClick={() => handleWorkTaskAdd(work.id)}
                    className="h-8 px-3 border border-[#099AD7] text-[#099AD7] hover:bg-[#099AD7] hover:text-white text-[11px] uppercase tracking-wider font-medium transition-colors"
                  >
                    + Agregar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN 03: PARTICIPACIONES Y CONCURSOS */}
      <section className="border border-neutral-200 bg-[#FFFFFF] p-6">
        <div className="pb-4 mb-6 border-b border-neutral-200 flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-[#099AD7] font-semibold">
            03 / PARTICIPACIONES & CONCURSOS ({bio.participations.length})
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bio.participations.map((part) => (
            <div
              key={part.id}
              className="border border-neutral-200 p-4 flex flex-col gap-3"
            >
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase tracking-wider text-[#686661]">
                    Año
                  </label>
                  <input
                    type="text"
                    value={part.year}
                    onChange={(e) =>
                      handleParticipationChange(part.id, "year", e.target.value)
                    }
                    className="h-8 px-2.5 border border-neutral-300 text-xs focus:outline-none focus:border-[#099AD7]"
                  />
                </div>
                <div className="col-span-2 flex flex-col gap-1">
                  <label className="text-[10px] uppercase tracking-wider text-[#686661]">
                    Categoría / Premio
                  </label>
                  <input
                    type="text"
                    value={part.category}
                    onChange={(e) =>
                      handleParticipationChange(
                        part.id,
                        "category",
                        e.target.value
                      )
                    }
                    className="h-8 px-2.5 border border-neutral-300 text-xs focus:outline-none focus:border-[#099AD7]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-wider text-[#686661]">
                  Título
                </label>
                <input
                  type="text"
                  value={part.title}
                  onChange={(e) =>
                    handleParticipationChange(part.id, "title", e.target.value)
                  }
                  className="h-8 px-2.5 border border-neutral-300 text-xs focus:outline-none focus:border-[#099AD7]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-wider text-[#686661]">
                  Descripción
                </label>
                <textarea
                  rows={2}
                  value={part.description}
                  onChange={(e) =>
                    handleParticipationChange(
                      part.id,
                      "description",
                      e.target.value
                    )
                  }
                  className="p-2.5 border border-neutral-300 text-xs focus:outline-none focus:border-[#099AD7] resize-y"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN 04: HABILIDADES Y SOFTWARE */}
      <section className="border border-neutral-200 bg-[#FFFFFF] p-6">
        <div className="pb-4 mb-6 border-b border-neutral-200 flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-[#099AD7] font-semibold">
            04 / HABILIDADES & SOFTWARE ({bio.skills.length} CATEGORÍAS)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {bio.skills.map((card, cardIdx) => (
            <div
              key={cardIdx}
              className="border border-neutral-200 p-4 flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex flex-col gap-1 pb-3 border-b border-neutral-100">
                  <label className="text-[10px] uppercase tracking-wider text-[#686661]">
                    Categoría
                  </label>
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) =>
                      handleSkillTitleChange(cardIdx, e.target.value)
                    }
                    className="h-8 px-2.5 border border-neutral-300 text-xs font-semibold text-[#099AD7] focus:outline-none focus:border-[#099AD7]"
                  />
                </div>

                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {card.items.map((item, itemIdx) => (
                    <li
                      key={`${item}-${itemIdx}`}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-neutral-200 bg-neutral-50 text-xs text-[#1C1C1A]"
                    >
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => handleSkillItemDelete(cardIdx, itemIdx)}
                        aria-label={`Quitar ${item}`}
                        className="text-[#686661] hover:text-[#A84A4A]"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-1.5 pt-2 border-t border-neutral-100">
                <input
                  type="text"
                  value={newSkillInputs[cardIdx] || ""}
                  onChange={(e) =>
                    setNewSkillInputs((prev) => ({
                      ...prev,
                      [cardIdx]: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSkillItemAdd(cardIdx);
                    }
                  }}
                  placeholder="Nuevo ítem..."
                  className="flex-1 h-8 px-2.5 border border-neutral-300 text-xs focus:outline-none focus:border-[#099AD7]"
                />
                <button
                  type="button"
                  onClick={() => handleSkillItemAdd(cardIdx)}
                  className="h-8 px-2.5 border border-[#099AD7] text-[#099AD7] hover:bg-[#099AD7] hover:text-white text-xs font-medium transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pie con botón Guardar */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 bg-[#099AD7] text-white text-xs uppercase tracking-wider font-medium px-8 h-11 rounded-none hover:bg-[#0886BC] active:bg-[#0776A6] transition-colors duration-200 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "GUARDANDO CAMBIOS..." : "GUARDAR CAMBIOS"}</span>
        </button>
      </div>
    </form>
  );
}
