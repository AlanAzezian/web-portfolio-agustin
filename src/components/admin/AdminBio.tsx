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
import RichTextEditor from "@/components/admin/RichTextEditor";
import {
  Save,
  Check,
  Plus,
  Trash2,
  Upload,
  ArrowUp,
  ArrowDown,
  X,
  Image as ImageIcon,
  Link2,
} from "lucide-react";

interface ProjectOption {
  id: string;
  title: string;
}

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

function sanitizeFileName(name: string): string {
  const parts = name.split(".");
  const ext = parts.length > 1 ? "." + parts.pop()!.toLowerCase() : "";
  const base = parts
    .join(".")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${base || "foto"}-${Date.now()}${ext}`;
}

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
  const [uploadingPartId, setUploadingPartId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);

  const [newTaskInputs, setNewTaskInputs] = useState<Record<string, string>>({});
  const [newSkillInputs, setNewSkillInputs] = useState<Record<number, string>>({});
  const [projectOptions, setProjectOptions] = useState<ProjectOption[]>([]);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;

    async function initBio() {
      try {
        const [{ data, error: fetchError }, projectsRes] = await Promise.all([
          supabase.from("bio").select("*").eq("id", "main").maybeSingle(),
          supabase
            .from("projects")
            .select("id, title")
            .order("order_index", { ascending: true }),
        ]);

        if (!active) return;

        if (!projectsRes.error && Array.isArray(projectsRes.data)) {
          setProjectOptions(
            projectsRes.data
              .map((row: Record<string, unknown>) => ({
                id: String(row.id || ""),
                title: String(row.title || row.id || ""),
              }))
              .filter((p) => Boolean(p.id))
          );
        }

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
            work_experience:
              Array.isArray(data.work_experience) &&
              data.work_experience.length > 0
                ? data.work_experience
                : seed.work_experience,
            participations:
              Array.isArray(data.participations) &&
              data.participations.length > 0
                ? data.participations
                : seed.participations,
            skills:
              Array.isArray(data.skills) && data.skills.length > 0
                ? data.skills
                : seed.skills,
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

  // --- Participaciones y Concursos handlers ---
  const handleAddParticipation = () => {
    const newPart: ParticipationItem = {
      id: `comp-${Date.now()}`,
      year: String(new Date().getFullYear()),
      category: "CONCURSO DE ARQUITECTURA",
      title: "Nueva Participación / Concurso",
      description: "Descripción del rol, equipo y distinción obtenida.",
      image: "/projects/centro-de-trasbordo/01-render-exterior.webp",
      imageCaption: "Vista general del proyecto",
      gallery: [],
    };
    setBio((prev) => ({
      ...prev,
      participations: [newPart, ...prev.participations],
    }));
  };

  const handleDeleteParticipation = (partId: string) => {
    setBio((prev) => ({
      ...prev,
      participations: prev.participations.filter((p) => p.id !== partId),
    }));
  };

  const handleMoveParticipation = (index: number, direction: -1 | 1) => {
    setBio((prev) => {
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= prev.participations.length) {
        return prev;
      }
      const next = [...prev.participations];
      const [moved] = next.splice(index, 1);
      next.splice(targetIndex, 0, moved);
      return { ...prev, participations: next };
    });
  };

  const handleParticipationChange = (
    partId: string,
    field:
      | "year"
      | "category"
      | "title"
      | "description"
      | "image"
      | "imageCaption"
      | "link",
    value: string
  ) => {
    setBio((prev) => ({
      ...prev,
      participations: prev.participations.map((p) => {
        if (p.id !== partId) return p;
        const updated = { ...p, [field]: value };
        if (field === "title" && (!p.imageCaption || p.imageCaption === p.title)) {
          updated.imageCaption = value;
        }
        return updated;
      }),
    }));
  };

  const handleParticipationProjectLinkChange = (
    partId: string,
    selectedProjectId: string
  ) => {
    const cleanId = selectedProjectId.trim();
    setBio((prev) => ({
      ...prev,
      participations: prev.participations.map((p) => {
        if (p.id !== partId) return p;
        return {
          ...p,
          projectId: cleanId || undefined,
          link: cleanId ? `/proyectos/${cleanId}` : undefined,
        };
      }),
    }));
  };

  const handleParticipationCoverUpload = async (
    partId: string,
    file: File | undefined
  ) => {
    if (!file || uploadingPartId) return;
    setUploadingPartId(partId);
    setError(null);
    setFeedbackSuccess(null);

    try {
      const fileName = `cover-${sanitizeFileName(file.name)}`;
      const path = `bio/participations/${partId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("portfolio")
        .upload(path, file, { upsert: true });

      if (uploadError) {
        throw new Error(
          `Error al subir portada de participación: ${uploadError.message}`
        );
      }

      const publicUrl = supabase.storage.from("portfolio").getPublicUrl(path)
        .data.publicUrl;

      setBio((prev) => ({
        ...prev,
        participations: prev.participations.map((p) =>
          p.id === partId ? { ...p, image: publicUrl } : p
        ),
      }));

      setFeedbackSuccess(
        "Portada de participación subida al bucket portfolio. Presiona GUARDAR CAMBIOS para confirmar."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al subir portada de la participación."
      );
    } finally {
      setUploadingPartId(null);
    }
  };

  const handleParticipationGalleryUpload = async (
    partId: string,
    files: FileList | null
  ) => {
    if (!files || files.length === 0 || uploadingPartId) return;
    setUploadingPartId(partId);
    setError(null);
    setFeedbackSuccess(null);

    try {
      const uploadedItems: { src: string; caption: string }[] = [];
      const currentPart = bio.participations.find((p) => p.id === partId);
      const baseCaption = currentPart?.title || "Registro fotográfico";

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = `gallery-${i + 1}-${sanitizeFileName(file.name)}`;
        const path = `bio/participations/${partId}/${fileName}`;

        const { error: uploadErr } = await supabase.storage
          .from("portfolio")
          .upload(path, file, { upsert: true });

        if (uploadErr) {
          throw new Error(
            `Error al subir foto ${i + 1} de la galería: ${uploadErr.message}`
          );
        }

        const publicUrl = supabase.storage.from("portfolio").getPublicUrl(path)
          .data.publicUrl;

        uploadedItems.push({
          src: publicUrl,
          caption: baseCaption,
        });
      }

      setBio((prev) => ({
        ...prev,
        participations: prev.participations.map((p) => {
          if (p.id !== partId) return p;
          const existingGallery = Array.isArray(p.gallery) ? p.gallery : [];
          return {
            ...p,
            gallery: [...existingGallery, ...uploadedItems],
          };
        }),
      }));

      setFeedbackSuccess(
        `${uploadedItems.length} foto(s) agregadas a la galería de la participación. Presiona GUARDAR CAMBIOS para confirmar.`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al subir fotos de la galería."
      );
    } finally {
      setUploadingPartId(null);
    }
  };

  const handleRemoveGalleryPhoto = (partId: string, photoIdx: number) => {
    setBio((prev) => ({
      ...prev,
      participations: prev.participations.map((p) => {
        if (p.id !== partId) return p;
        const existingGallery = Array.isArray(p.gallery) ? p.gallery : [];
        return {
          ...p,
          gallery: existingGallery.filter((_, idx) => idx !== photoIdx),
        };
      }),
    }));
  };

  const handleGalleryCaptionChange = (
    partId: string,
    photoIdx: number,
    caption: string
  ) => {
    setBio((prev) => ({
      ...prev,
      participations: prev.participations.map((p) => {
        if (p.id !== partId) return p;
        const existingGallery = Array.isArray(p.gallery) ? p.gallery : [];
        return {
          ...p,
          gallery: existingGallery.map((item, idx) =>
            idx === photoIdx ? { ...item, caption } : item
          ),
        };
      }),
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
          "Datos de Bio, Experiencia y Participaciones guardados exitosamente en Supabase (id = 'main')."
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
            PERFIL PROFESIONAL, EXPERIENCIA, CONCURSOS & CANALES DIRECTOS
          </span>
          <h2 className="text-lg font-medium tracking-tight text-[#1C1C1A] mt-0.5">
            Bio & Contacto
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Avatar + URLs de Contacto */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="flex items-center gap-4">
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
                <span className="text-[11px] uppercase tracking-wider text-[#1C1C1A] font-medium">
                  Retrato de perfil
                </span>
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
                  className="inline-flex items-center justify-center gap-1.5 h-9 px-3.5 border border-[#099AD7] text-[#099AD7] hover:bg-[#099AD7] hover:text-white text-xs uppercase tracking-wider font-medium transition-colors w-fit"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>
                    {uploadingAvatar ? "Subiendo..." : "Reemplazar imagen"}
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

          {/* Manifiesto Profesional con Editor Enriquecido Tiptap */}
          <div className="lg:col-span-7 flex flex-col gap-2">
            <label
              htmlFor="bio-manifesto"
              className="text-[11px] uppercase tracking-wider text-[#1C1C1A] font-medium"
            >
              Manifiesto / Declaración Bio
            </label>
            <RichTextEditor
              value={bio.manifesto}
              onChange={(html) =>
                setBio((prev) => ({ ...prev, manifesto: html }))
              }
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

      {/* SECCIÓN 03: CONCURSOS & PARTICIPACIONES (CRUD + SUBIDA DE PORTADA Y GALERÍA) */}
      <section className="border border-neutral-200 bg-[#FFFFFF] p-6">
        <div className="pb-4 mb-6 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#099AD7] font-semibold block">
              03 / CONCURSOS & PARTICIPACIONES ({bio.participations.length})
            </span>
            <p className="text-[11px] text-[#686661] mt-0.5">
              Administra premios, exposiciones, imagen principal y galería fotográfica para el visor de Bio.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddParticipation}
            className="inline-flex items-center justify-center gap-1.5 px-4 h-9 bg-[#099AD7] text-white hover:bg-[#0886BC] text-xs uppercase tracking-wider font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ AGREGAR PARTICIPACIÓN</span>
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {bio.participations.map((part, partIdx) => {
            const isUploadingThis = uploadingPartId === part.id;
            const galleryList = Array.isArray(part.gallery) ? part.gallery : [];

            return (
              <div
                key={part.id}
                className="border border-neutral-200 p-5 bg-[#FFFFFF] flex flex-col gap-5"
              >
                {/* Barra superior del ítem con orden y eliminar */}
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-[#099AD7]/10 text-[#099AD7] text-xs font-semibold tabular-nums">
                      #{String(partIdx + 1).padStart(2, "0")}
                    </span>
                    <span className="text-xs font-medium text-[#1C1C1A] truncate max-w-md">
                      {part.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleMoveParticipation(partIdx, -1)}
                      disabled={partIdx === 0}
                      title="Subir posición"
                      className="p-1.5 border border-neutral-200 text-[#686661] hover:text-[#1C1C1A] disabled:opacity-30"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveParticipation(partIdx, 1)}
                      disabled={partIdx === bio.participations.length - 1}
                      title="Bajar posición"
                      className="p-1.5 border border-neutral-200 text-[#686661] hover:text-[#1C1C1A] disabled:opacity-30"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteParticipation(part.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 border border-neutral-200 text-[11px] uppercase tracking-wider text-[#A84A4A] hover:bg-[#A84A4A] hover:text-white hover:border-[#A84A4A] transition-colors ml-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Eliminar</span>
                    </button>
                  </div>
                </div>

                {/* Grilla de metadatos e imágenes */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Columna izquierda: Año, Categoría, Título, Descripción */}
                  <div className="lg:col-span-6 flex flex-col gap-3">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase tracking-wider text-[#686661] font-medium">
                          Año
                        </label>
                        <input
                          type="text"
                          value={part.year}
                          onChange={(e) =>
                            handleParticipationChange(
                              part.id,
                              "year",
                              e.target.value
                            )
                          }
                          placeholder="2026"
                          className="h-9 px-3 border border-neutral-300 text-xs focus:outline-none focus:border-[#099AD7]"
                        />
                      </div>

                      <div className="col-span-2 flex flex-col gap-1">
                        <label className="text-[10px] uppercase tracking-wider text-[#686661] font-medium">
                          Categoría / Distinción
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
                          placeholder="Ej. MONTAJE EXPOSITIVO (LA BIENAL XX)"
                          className="h-9 px-3 border border-neutral-300 text-xs focus:outline-none focus:border-[#099AD7]"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase tracking-wider text-[#686661] font-medium">
                        Título de la Participación / Obra
                      </label>
                      <input
                        type="text"
                        value={part.title}
                        onChange={(e) =>
                          handleParticipationChange(
                            part.id,
                            "title",
                            e.target.value
                          )
                        }
                        placeholder="Ej. Maqueta Casa Chacra — BAAG | La Bienal XX"
                        className="h-9 px-3 border border-neutral-300 text-xs focus:outline-none focus:border-[#099AD7]"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase tracking-wider text-[#686661] font-medium">
                        Descripción (Detalles y Rol)
                      </label>
                      <textarea
                        rows={3}
                        value={part.description}
                        onChange={(e) =>
                          handleParticipationChange(
                            part.id,
                            "description",
                            e.target.value
                          )
                        }
                        className="p-2.5 border border-neutral-300 text-xs focus:outline-none focus:border-[#099AD7] leading-relaxed resize-y"
                      />
                    </div>

                    {/* Selector opcional de vinculación a proyecto existente */}
                    <div className="flex flex-col gap-1 pt-1">
                      <label
                        htmlFor={`part-project-link-${part.id}`}
                        className="text-[10px] uppercase tracking-wider text-[#1C1C1A] font-medium flex items-center gap-1.5"
                      >
                        <Link2 className="w-3 h-3 text-[#099AD7]" />
                        <span>Vincular a un proyecto existente (opcional)</span>
                      </label>
                      <select
                        id={`part-project-link-${part.id}`}
                        value={
                          part.projectId ||
                          (part.link && part.link.startsWith("/proyectos/")
                            ? part.link.replace("/proyectos/", "")
                            : "")
                        }
                        onChange={(e) =>
                          handleParticipationProjectLinkChange(
                            part.id,
                            e.target.value
                          )
                        }
                        className="h-9 px-3 bg-[#FFFFFF] text-[#1C1C1A] border border-neutral-300 text-xs rounded-none focus:outline-none focus:border-[#099AD7]"
                      >
                        <option value="">
                          -- Ninguno (Galería independiente in situ) --
                        </option>
                        {projectOptions.map((proj) => (
                          <option key={proj.id} value={proj.id}>
                            {proj.title} ({proj.id})
                          </option>
                        ))}
                        {part.projectId &&
                          !projectOptions.some(
                            (p) => p.id === part.projectId
                          ) && (
                            <option value={part.projectId}>
                              {part.projectId} (actual)
                            </option>
                          )}
                      </select>
                      <span className="text-[10px] text-[#686661]">
                        Si seleccionas un proyecto, al hacer clic en esta participación desde Bio navegará a su visor en /proyectos/[id].
                      </span>
                    </div>
                  </div>

                  {/* Columna derecha: Imagen Principal / Portada + Galería Multi-upload */}
                  <div className="lg:col-span-6 flex flex-col gap-4 lg:border-l lg:border-neutral-200 lg:pl-6">
                    {/* 1. Imagen Principal / Portada */}
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] uppercase tracking-wider text-[#1C1C1A] font-medium">
                        Imagen Principal / Portada
                      </span>

                      <div className="flex items-center gap-4">
                        <div className="w-36 relative aspect-[3/2] border border-neutral-300 bg-neutral-50 overflow-hidden shrink-0">
                          {part.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={part.image}
                              alt={part.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#9A9892]">
                              <ImageIcon className="w-5 h-5" />
                            </div>
                          )}
                        </div>

                        <label className="inline-flex items-center justify-center gap-1.5 h-9 px-3.5 border border-[#099AD7] text-[#099AD7] hover:bg-[#099AD7] hover:text-white text-xs uppercase tracking-wider font-medium transition-colors cursor-pointer">
                          <Upload className="w-3.5 h-3.5" />
                          <span>
                            {isUploadingThis
                              ? "Subiendo..."
                              : "Reemplazar imagen"}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={isUploadingThis}
                            onChange={(e) =>
                              handleParticipationCoverUpload(
                                part.id,
                                e.target.files?.[0]
                              )
                            }
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    {/* 2. Galería de Fotos (Multi-upload para el visor fullscreen de Bio) */}
                    <div className="flex flex-col gap-2 pt-3 border-t border-neutral-100">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-wider text-[#1C1C1A] font-medium">
                          Galería de Fotos ({galleryList.length})
                        </span>

                        <label className="inline-flex items-center gap-1.5 px-3 py-1 border border-[#099AD7] text-[#099AD7] hover:bg-[#099AD7] hover:text-white text-[10px] uppercase tracking-wider font-medium transition-colors cursor-pointer">
                          <Plus className="w-3 h-3" />
                          <span>
                            {isUploadingThis
                              ? "Subiendo fotos..."
                              : "Subir fotos a galería"}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            disabled={isUploadingThis}
                            onChange={(e) =>
                              handleParticipationGalleryUpload(
                                part.id,
                                e.target.files
                              )
                            }
                            className="hidden"
                          />
                        </label>
                      </div>

                      {galleryList.length === 0 ? (
                        <p className="text-[11px] text-[#686661] py-2">
                          Sin fotos secundarias en la galería exclusiva. Puedes subir múltiples imágenes para habilitar el visor fullscreen en Bio.
                        </p>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 max-h-56 overflow-y-auto pr-1">
                          {galleryList.map((gItem, gIdx) => (
                            <div
                              key={`${gItem.src}-${gIdx}`}
                              className="border border-neutral-200 bg-neutral-50 p-1.5 flex flex-col gap-1.5"
                            >
                              <div className="relative aspect-[3/2] w-full overflow-hidden bg-white">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={gItem.src}
                                  alt={gItem.caption}
                                  className="w-full h-full object-cover"
                                />
                                <span className="absolute bottom-1 left-1 bg-[#FFFFFF]/90 px-1.5 py-0.5 text-[9px] font-medium text-[#1C1C1A]">
                                  {String(gIdx + 1).padStart(2, "0")}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveGalleryPhoto(part.id, gIdx)
                                  }
                                  aria-label="Quitar foto de galería"
                                  className="absolute top-1 right-1 bg-[#FFFFFF]/95 hover:bg-[#A84A4A] text-[#1C1C1A] hover:text-white border border-neutral-300 p-0.5 transition-colors"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                              <input
                                type="text"
                                value={gItem.caption}
                                onChange={(e) =>
                                  handleGalleryCaptionChange(
                                    part.id,
                                    gIdx,
                                    e.target.value
                                  )
                                }
                                placeholder="Epígrafe..."
                                className="w-full h-6 px-1.5 bg-[#FFFFFF] border border-neutral-200 text-[10px] text-[#1C1C1A] focus:outline-none focus:border-[#099AD7]"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
