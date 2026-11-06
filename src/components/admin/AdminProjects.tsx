"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  DEFAULT_PROJECT_FILTERS,
  encodeProjectImagesWithMeta,
  normalizeFilterLabel,
  parseProjectImagesAndMeta,
} from "@/data/projects";
import SortableImageGallery, {
  type SortableGalleryItem,
} from "@/components/admin/SortableImageGallery";
import {
  Trash2,
  Plus,
  X,
  Upload,
  Image as ImageIcon,
  Pencil,
  Tag,
  Eye,
  EyeOff,
} from "lucide-react";

export interface SupabaseProject {
  id: string;
  title: string;
  cover_image: string;
  images: string[];
  order_index: number;
  category?: string;
  tags?: string[];
  show_in_main_grid?: boolean;
  created_at?: string;
}

type ProjectGalleryEntry = SortableGalleryItem;

function generateSlug(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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
  return `${base || "image"}-${Date.now()}${ext}`;
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<SupabaseProject[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  // Gestor de Filtros / Etiquetas dinámicas
  const [availableFilters, setAvailableFilters] = useState<string[]>([
    ...DEFAULT_PROJECT_FILTERS,
  ]);
  const [newFilterInput, setNewFilterInput] = useState("");
  const [savingFilters, setSavingFilters] = useState(false);

  // Modal / Form state (Create & Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<SupabaseProject | null>(
    null
  );
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState<string>("PROYECTOS");
  const [formShowInMainGrid, setFormShowInMainGrid] = useState<boolean>(true);
  const [modalNewCategoryInput, setModalNewCategoryInput] = useState("");

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  // Unified gallery entries (existing remote URLs + newly added local files) for Drag & Drop
  const [galleryEntries, setGalleryEntries] = useState<ProjectGalleryEntry[]>(
    []
  );

  // Saving & status states
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const persistFilterList = useCallback(async (nextList: string[]) => {
    setSavingFilters(true);
    try {
      await supabase.from("bio").upsert(
        [
          {
            id: "project_filters",
            manifesto: JSON.stringify(nextList),
            avatar_url: "",
            whatsapp: "",
            email: "",
            behance: "",
            linkedin: "",
            work_experience: [],
            participations: [],
            skills: [],
            updated_at: new Date().toISOString(),
          },
        ],
        { onConflict: "id" }
      );
    } catch {
      // Silencioso si falla red
    } finally {
      setSavingFilters(false);
    }
  }, []);

  const loadDataFromSupabase = useCallback(async () => {
    const [projectsRes, filtersRes] = await Promise.all([
      supabase
        .from("projects")
        .select("*")
        .order("order_index", { ascending: true }),
      supabase
        .from("bio")
        .select("manifesto")
        .eq("id", "project_filters")
        .maybeSingle(),
    ]);

    let configuredFilters: string[] = [...DEFAULT_PROJECT_FILTERS];
    if (!filtersRes.error && filtersRes.data?.manifesto) {
      try {
        const parsed = JSON.parse(String(filtersRes.data.manifesto));
        if (Array.isArray(parsed) && parsed.length > 0) {
          const cleaned = parsed
            .filter(
              (t): t is string => typeof t === "string" && t.trim() !== ""
            )
            .map(normalizeFilterLabel);
          if (cleaned.length > 0) {
            configuredFilters = Array.from(new Set(cleaned));
          }
        }
      } catch {
        // Fallback a filtros predeterminados
      }
    }

    if (projectsRes.error) {
      return {
        error: projectsRes.error.message,
        filters: configuredFilters,
        projects: [] as SupabaseProject[],
      };
    }

    const rawRows = (projectsRes.data as Record<string, unknown>[]) || [];
    const filterSet = new Set<string>(configuredFilters);

    const normalizedProjects: SupabaseProject[] = rawRows.map((row) => {
      const { cleanImages, category, tags, showInMainGrid } =
        parseProjectImagesAndMeta(row);
      if (category) filterSet.add(normalizeFilterLabel(category));
      tags.forEach((t) => {
        if (t) filterSet.add(normalizeFilterLabel(t));
      });

      return {
        id: String(row.id || ""),
        title: String(row.title || ""),
        cover_image: String(row.cover_image || ""),
        images: cleanImages,
        order_index: Number(row.order_index ?? 1),
        category,
        tags,
        show_in_main_grid: showInMainGrid,
        created_at:
          typeof row.created_at === "string" ? row.created_at : undefined,
      };
    });

    return {
      error: null,
      filters: Array.from(filterSet),
      projects: normalizedProjects,
    };
  }, []);

  const fetchProjects = useCallback(async () => {
    setLoadingList(true);
    setListError(null);
    try {
      const res = await loadDataFromSupabase();
      if (res.error) {
        setListError(res.error);
        setAvailableFilters(res.filters);
      } else {
        setAvailableFilters(res.filters);
        setProjects(res.projects);
      }
    } catch (err) {
      setListError(
        err instanceof Error ? err.message : "Error al cargar los proyectos."
      );
    } finally {
      setLoadingList(false);
    }
  }, [loadDataFromSupabase]);

  useEffect(() => {
    let active = true;

    async function loadInitialProjects() {
      try {
        const res = await loadDataFromSupabase();
        if (!active) return;
        if (res.error) {
          setListError(res.error);
          setAvailableFilters(res.filters);
        } else {
          setAvailableFilters(res.filters);
          setProjects(res.projects);
        }
      } catch (err) {
        if (active) {
          setListError(
            err instanceof Error
              ? err.message
              : "Error al cargar los proyectos."
          );
        }
      } finally {
        if (active) setLoadingList(false);
      }
    }

    loadInitialProjects();
    return () => {
      active = false;
    };
  }, [loadDataFromSupabase]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (coverPreview && coverPreview.startsWith("blob:")) {
        URL.revokeObjectURL(coverPreview);
      }
      galleryEntries.forEach((entry) => {
        if (entry.isNew && entry.src.startsWith("blob:")) {
          URL.revokeObjectURL(entry.src);
        }
      });
    };
  }, [coverPreview, galleryEntries]);

  const handleAddGlobalFilter = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = normalizeFilterLabel(newFilterInput);
    if (!clean) return;

    if (availableFilters.includes(clean)) {
      setNewFilterInput("");
      return;
    }

    const updated = [...availableFilters, clean];
    setAvailableFilters(updated);
    setNewFilterInput("");
    await persistFilterList(updated);
    setFeedbackSuccess(`Etiqueta "${clean}" agregada al catálogo de filtros.`);
  };

  const handleRemoveGlobalFilter = async (tagToRemove: string) => {
    if (availableFilters.length <= 1) return;
    const updated = availableFilters.filter((t) => t !== tagToRemove);
    setAvailableFilters(updated);
    if (formCategory === tagToRemove) {
      setFormCategory(updated[0] || "PROYECTOS");
    }
    await persistFilterList(updated);
    setFeedbackSuccess(`Etiqueta "${tagToRemove}" eliminada de los filtros.`);
  };

  const handleQuickAddCategoryInModal = async () => {
    const clean = normalizeFilterLabel(modalNewCategoryInput);
    if (!clean) return;

    if (!availableFilters.includes(clean)) {
      const updated = [...availableFilters, clean];
      setAvailableFilters(updated);
      await persistFilterList(updated);
    }
    setFormCategory(clean);
    setModalNewCategoryInput("");
    if (formError) setFormError(null);
  };

  const resetForm = () => {
    setEditingProject(null);
    setFormTitle("");
    setFormCategory(
      availableFilters.includes("PROYECTOS")
        ? "PROYECTOS"
        : availableFilters[0] || "PROYECTOS"
    );
    setFormShowInMainGrid(true);
    setModalNewCategoryInput("");
    if (coverPreview && coverPreview.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreview);
    }
    setCoverFile(null);
    setCoverPreview(null);
    galleryEntries.forEach((entry) => {
      if (entry.isNew && entry.src.startsWith("blob:")) {
        URL.revokeObjectURL(entry.src);
      }
    });
    setGalleryEntries([]);
    setFormError(null);
    setStatusMessage(null);
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setFeedbackSuccess(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (project: SupabaseProject) => {
    resetForm();
    setFeedbackSuccess(null);
    setEditingProject(project);
    setFormTitle(project.title);
    setFormCategory(
      project.category
        ? normalizeFilterLabel(project.category)
        : availableFilters[0] || "PROYECTOS"
    );
    setFormShowInMainGrid(project.show_in_main_grid !== false);
    setCoverPreview(project.cover_image || null);
    setGalleryEntries(
      Array.isArray(project.images)
        ? project.images.map((url, idx) => ({
            id: `existing-${idx}-${url}`,
            src: url,
            isNew: false,
          }))
        : []
    );
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (submitting) return;
    resetForm();
    setIsModalOpen(false);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormTitle(e.target.value);
    if (formError) setFormError(null);
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (coverPreview && coverPreview.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreview);
    }
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
    if (formError) setFormError(null);
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const timestamp = Date.now();
    const newEntries: ProjectGalleryEntry[] = Array.from(files).map(
      (file, idx) => ({
        id: `new-${timestamp}-${idx}-${file.name}`,
        src: URL.createObjectURL(file),
        isNew: true,
        file,
      })
    );

    setGalleryEntries((prev) => [...prev, ...newEntries]);
    if (galleryInputRef.current) {
      galleryInputRef.current.value = "";
    }
    if (formError) setFormError(null);
  };

  const handleReorderGallery = (reordered: ProjectGalleryEntry[]) => {
    setGalleryEntries(reordered);
  };

  const handleRemoveGalleryEntry = (id: string) => {
    setGalleryEntries((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target && target.isNew && target.src.startsWith("blob:")) {
        URL.revokeObjectURL(target.src);
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const handleDeleteProject = async (id: string) => {
    if (deletingId) return;
    setDeletingId(id);
    setListError(null);
    setFeedbackSuccess(null);

    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) {
        setListError(`No se pudo eliminar el proyecto: ${error.message}`);
      } else {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        setFeedbackSuccess("Proyecto eliminado correctamente.");
      }
    } catch (err) {
      setListError(
        err instanceof Error ? err.message : "Error al eliminar el proyecto."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    const cleanTitle = formTitle.trim();
    if (!cleanTitle) {
      setFormError("Ingresa el título del proyecto.");
      return;
    }

    const cleanCategory = normalizeFilterLabel(formCategory);
    if (!cleanCategory) {
      setFormError("Selecciona el Tipo / Categoría del proyecto.");
      return;
    }

    const isEditing = Boolean(editingProject);
    const projectSlug = isEditing
      ? editingProject!.id
      : generateSlug(cleanTitle) || `proyecto-${projects.length + 1}`;

    if (!isEditing && !coverFile) {
      setFormError("Selecciona una imagen de portada (Cover).");
      return;
    }

    setSubmitting(true);
    setFormError(null);
    setFeedbackSuccess(null);
    setStatusMessage("Procesando imágenes...");

    try {
      // Asegurar que la categoría seleccionada exista en el listado global de filtros
      if (!availableFilters.includes(cleanCategory)) {
        const nextFilters = [...availableFilters, cleanCategory];
        setAvailableFilters(nextFilters);
        await persistFilterList(nextFilters);
      }

      // 1. Portada: subir nueva si fue reemplazada, o mantener la actual en edición
      let finalCoverUrl = editingProject?.cover_image || "";

      if (coverFile) {
        setStatusMessage("Subiendo imagen de portada...");
        const coverFileName = `cover-${sanitizeFileName(coverFile.name)}`;
        const coverPath = `projects/${projectSlug}/${coverFileName}`;

        const { error: coverUploadError } = await supabase.storage
          .from("portfolio")
          .upload(coverPath, coverFile, { upsert: true });

        if (coverUploadError) {
          throw new Error(
            `Error al subir la portada: ${coverUploadError.message}`
          );
        }

        finalCoverUrl = supabase.storage
          .from("portfolio")
          .getPublicUrl(coverPath).data.publicUrl;
      }

      // 2. Galería: respetar el orden exacto del Drag & Drop subiendo archivos nuevos y conservando URLs existentes
      const finalCleanGalleryUrls: string[] = [];
      const hasNewFilesToUpload = galleryEntries.some(
        (entry) => entry.isNew && entry.file
      );

      if (hasNewFilesToUpload) {
        setStatusMessage("Subiendo imágenes de galería...");
      }

      for (let i = 0; i < galleryEntries.length; i++) {
        const entry = galleryEntries[i];
        if (entry.isNew && entry.file) {
          const fileName = `${String(i + 1).padStart(
            2,
            "0"
          )}-${sanitizeFileName(entry.file.name)}`;
          const path = `projects/${projectSlug}/${fileName}`;

          const { error: galleryError } = await supabase.storage
            .from("portfolio")
            .upload(path, entry.file, { upsert: true });

          if (galleryError) {
            throw new Error(
              `Error al subir imagen ${i + 1}: ${galleryError.message}`
            );
          }

          const publicUrl = supabase.storage
            .from("portfolio")
            .getPublicUrl(path).data.publicUrl;

          finalCleanGalleryUrls.push(publicUrl);
        } else if (entry.src) {
          finalCleanGalleryUrls.push(entry.src);
        }
      }

      // Codificar metadatos (categoría, tags y visibilidad en grilla principal) de forma retrocompatible
      const encodedImagesPayload = encodeProjectImagesWithMeta(
        finalCleanGalleryUrls,
        {
          category: cleanCategory,
          tags: [cleanCategory],
          show_in_main_grid: formShowInMainGrid,
        }
      );

      // 3. Guardar o actualizar registro en base de datos
      setStatusMessage(
        isEditing ? "Actualizando proyecto..." : "Guardando proyecto..."
      );

      if (isEditing && editingProject) {
        // Intentar primero con columnas explícitas; si el esquema de Supabase aún no las tiene, hacer fallback transparente
        const { error: fullUpdateErr } = await supabase
          .from("projects")
          .update({
            title: cleanTitle,
            cover_image: finalCoverUrl,
            images: encodedImagesPayload,
            category: cleanCategory,
            tags: [cleanCategory],
            show_in_main_grid: formShowInMainGrid,
          })
          .eq("id", editingProject.id);

        if (fullUpdateErr) {
          const { error: fallbackUpdateErr } = await supabase
            .from("projects")
            .update({
              title: cleanTitle,
              cover_image: finalCoverUrl,
              images: encodedImagesPayload,
            })
            .eq("id", editingProject.id);

          if (fallbackUpdateErr) {
            throw new Error(
              `Error al actualizar el proyecto: ${fallbackUpdateErr.message}`
            );
          }
        }

        await fetchProjects();
        resetForm();
        setIsModalOpen(false);
        setFeedbackSuccess("Proyecto actualizado correctamente.");
      } else {
        const safeMaxOrder = projects.reduce((max, p, idx) => {
          const val = Number(p.order_index);
          const cleanVal =
            Number.isFinite(val) && val > 0 && val < 1000000 ? val : idx + 1;
          return Math.max(max, cleanVal);
        }, 0);
        const nextOrderIndex = Math.max(projects.length + 1, safeMaxOrder + 1);

        const { error: fullInsertErr } = await supabase
          .from("projects")
          .insert([
            {
              id: projectSlug,
              title: cleanTitle,
              cover_image: finalCoverUrl,
              images: encodedImagesPayload,
              order_index: nextOrderIndex,
              category: cleanCategory,
              tags: [cleanCategory],
              show_in_main_grid: formShowInMainGrid,
            },
          ]);

        if (fullInsertErr) {
          const { error: fallbackInsertErr } = await supabase
            .from("projects")
            .insert([
              {
                id: projectSlug,
                title: cleanTitle,
                cover_image: finalCoverUrl,
                images: encodedImagesPayload,
                order_index: nextOrderIndex,
              },
            ]);

          if (fallbackInsertErr) {
            throw new Error(
              `Error al guardar en base de datos: ${fallbackInsertErr.message}`
            );
          }
        }

        await fetchProjects();
        resetForm();
        setIsModalOpen(false);
        setFeedbackSuccess("Proyecto publicado y sincronizado correctamente.");
      }
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Ocurrió un error al guardar el proyecto."
      );
    } finally {
      setSubmitting(false);
      setStatusMessage(null);
    }
  };

  const totalGalleryCount = galleryEntries.length;

  return (
    <div className="w-full font-roboto text-[#1C1C1A]">
      {/* Barra superior del módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-[#686661] block">
            CATÁLOGO DE OBRAS & VISUALIZACIONES
          </span>
          <h2 className="text-lg font-medium tracking-tight text-[#1C1C1A] mt-0.5">
            Proyectos Registrados ({projects.length})
          </h2>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 bg-[#099AD7] text-white text-xs uppercase tracking-wider font-medium px-5 h-10 rounded-none hover:bg-[#0886BC] active:bg-[#0776A6] transition-colors duration-200 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#099AD7]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ NUEVO PROYECTO</span>
        </button>
      </div>

      {/* Gestor de Filtros / Etiquetas en el Admin */}
      <section className="mt-6 border border-neutral-200 bg-[#FFFFFF] p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#099AD7] font-semibold flex items-center gap-1.5">
              <Tag className="w-3 h-3" />
              GESTOR DE FILTROS / ETIQUETAS DE PROYECTOS
            </span>
            <p className="text-xs text-[#686661] mt-1">
              Administra las categorías visibles en la barra inferior de{" "}
              <code className="text-[#1C1C1A]">/proyectos</code> y en el
              selector de cada obra.
            </p>
          </div>

          <form
            onSubmit={handleAddGlobalFilter}
            className="flex items-center gap-2 w-full md:w-auto"
          >
            <input
              type="text"
              value={newFilterInput}
              onChange={(e) => setNewFilterInput(e.target.value)}
              disabled={savingFilters}
              placeholder="Nueva etiqueta (ej. Concursos)"
              aria-label="Nueva etiqueta de filtro"
              className="h-9 px-3 bg-[#FFFFFF] text-[#1C1C1A] placeholder:text-[#9A9892] text-xs border border-neutral-300 rounded-none focus:outline-none focus:border-[#099AD7] flex-1 md:w-56"
            />
            <button
              type="submit"
              disabled={savingFilters || !newFilterInput.trim()}
              className="h-9 px-4 bg-[#1C1C1A] hover:bg-[#099AD7] text-white text-[11px] uppercase tracking-wider font-medium rounded-none transition-colors disabled:opacity-50 shrink-0"
            >
              + Agregar
            </button>
          </form>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-4">
          {availableFilters.map((filterTag) => (
            <span
              key={filterTag}
              className="inline-flex items-center gap-2 bg-neutral-50 border border-neutral-300 px-3 py-1 text-[11px] uppercase tracking-wider text-[#1C1C1A] font-medium"
            >
              <span>{filterTag}</span>
              {availableFilters.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveGlobalFilter(filterTag)}
                  disabled={savingFilters}
                  title={`Eliminar filtro ${filterTag}`}
                  aria-label={`Eliminar filtro ${filterTag}`}
                  className="text-[#686661] hover:text-[#A84A4A] transition-colors disabled:opacity-50"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
        </div>
      </section>

      {/* Mensajes de estado general */}
      {feedbackSuccess && (
        <div
          role="status"
          className="mt-6 border border-[#099AD7]/40 bg-[#099AD7]/5 px-4 py-3 flex items-center justify-between"
        >
          <span className="text-xs text-[#1C1C1A] tracking-wide">
            {feedbackSuccess}
          </span>
          <button
            type="button"
            onClick={() => setFeedbackSuccess(null)}
            className="text-xs uppercase tracking-wider text-[#686661] hover:text-[#1C1C1A]"
          >
            CERRAR
          </button>
        </div>
      )}

      {listError && (
        <div
          role="alert"
          className="mt-6 border border-[#A84A4A]/40 bg-[#A84A4A]/5 px-4 py-3 flex items-center justify-between"
        >
          <span className="text-xs text-[#A84A4A] tracking-wide">
            {listError}
          </span>
          <button
            type="button"
            onClick={fetchProjects}
            className="text-xs uppercase tracking-wider text-[#A84A4A] hover:underline"
          >
            REINTENTAR
          </button>
        </div>
      )}

      {/* Listado / Grilla de proyectos */}
      <div className="mt-8">
        {loadingList ? (
          <div className="py-16 border border-neutral-200 bg-[#FFFFFF] flex items-center justify-center">
            <span className="text-xs uppercase tracking-wider text-[#686661]">
              Cargando proyectos desde Supabase...
            </span>
          </div>
        ) : projects.length === 0 ? (
          <div className="py-16 border border-neutral-200 bg-[#FFFFFF] flex flex-col items-center justify-center gap-3 text-center px-4">
            <span className="text-xs uppercase tracking-wider text-[#686661]">
              SIN PROYECTOS CARGADOS EN LA BASE DE DATOS
            </span>
            <p className="text-xs text-[#686661] max-w-md">
              Haz clic en &ldquo;+ NUEVO PROYECTO&rdquo; para subir la portada,
              renders y planos técnicos al portfolio.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => {
              const secondaryCount = Array.isArray(project.images)
                ? project.images.length
                : 0;
              const isDeleting = deletingId === project.id;
              const isVisibleInAll = project.show_in_main_grid !== false;
              const categoryLabel = project.category || "PROYECTOS";

              return (
                <article
                  key={project.id}
                  className="border border-neutral-200 bg-[#FFFFFF] flex flex-col justify-between group"
                >
                  <div>
                    {/* Miniatura de portada */}
                    <div className="relative w-full aspect-[16/10] bg-neutral-100 border-b border-neutral-200 overflow-hidden">
                      {project.cover_image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={project.cover_image}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#9A9892]">
                          <ImageIcon className="w-6 h-6 stroke-[1.25]" />
                        </div>
                      )}
                      <span className="absolute top-2.5 left-2.5 bg-[#FFFFFF]/90 px-2 py-0.5 text-[10px] uppercase tracking-wider text-[#1C1C1A] border border-neutral-200 font-medium">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                        <span className="bg-[#FFFFFF]/95 px-2 py-0.5 text-[10px] uppercase tracking-wider text-[#099AD7] border border-neutral-200 font-medium">
                          {categoryLabel}
                        </span>
                        <span
                          title={
                            isVisibleInAll
                              ? "Visible en la grilla general (Todos)"
                              : "Oculto en la grilla general (solo visible en su filtro o por link directo)"
                          }
                          className={`px-2 py-0.5 text-[10px] uppercase tracking-wider border font-medium inline-flex items-center gap-1 ${
                            isVisibleInAll
                              ? "bg-[#FFFFFF]/95 text-[#1C1C1A] border-neutral-200"
                              : "bg-[#1C1C1A]/90 text-white border-[#1C1C1A]"
                          }`}
                        >
                          {isVisibleInAll ? (
                            <>
                              <Eye className="w-2.5 h-2.5 text-[#099AD7]" />
                              <span>Grilla</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-2.5 h-2.5 text-neutral-300" />
                              <span>Oculto en Todos</span>
                            </>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Título limpio sin ID técnico */}
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-[#1C1C1A] line-clamp-2 leading-snug">
                        {project.title}
                      </h3>
                    </div>
                  </div>

                  {/* Pie de tarjeta con contador y botones Editar / Eliminar */}
                  <div className="px-4 py-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] uppercase tracking-wider text-[#686661]">
                      {secondaryCount}{" "}
                      {secondaryCount === 1
                        ? "imagen secundaria"
                        : "imágenes secundarias"}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(project)}
                        disabled={isDeleting}
                        title="Editar proyecto"
                        aria-label={`Editar proyecto ${project.title}`}
                        className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#099AD7] hover:bg-[#099AD7]/10 border border-transparent hover:border-[#099AD7]/30 px-2.5 py-1 transition-colors duration-200 disabled:opacity-50"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteProject(project.id)}
                        disabled={isDeleting}
                        title="Eliminar proyecto"
                        aria-label={`Eliminar proyecto ${project.title}`}
                        className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#A84A4A] hover:text-white hover:bg-[#A84A4A] border border-transparent hover:border-[#A84A4A] px-2.5 py-1 transition-colors duration-200 disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{isDeleting ? "Borrando..." : "Eliminar"}</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de Creación / Edición de Proyecto */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-project-title"
          className="fixed inset-0 z-50 bg-[#1C1C1A]/40 flex items-center justify-center p-4 md:p-8 overflow-y-auto"
        >
          <div className="w-full max-w-2xl bg-[#FFFFFF] border border-neutral-300 shadow-none my-auto">
            {/* Cabecera del Modal */}
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#099AD7] font-semibold block">
                  {editingProject ? "EDICIÓN DE PROYECTO" : "NUEVO REGISTRO"}
                </span>
                <h3
                  id="modal-project-title"
                  className="text-base font-medium text-[#1C1C1A]"
                >
                  {editingProject
                    ? "Editar Proyecto del Portfolio"
                    : "Cargar Proyecto en Portfolio"}
                </h3>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                disabled={submitting}
                aria-label="Cerrar modal"
                className="p-1.5 text-[#686661] hover:text-[#1C1C1A] transition-colors disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Formulario */}
            <form
              onSubmit={handleSubmit}
              className="p-6 flex flex-col gap-5"
              noValidate
            >
              {/* Campo Título */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="project-title"
                  className="text-[11px] uppercase tracking-wider text-[#1C1C1A] font-medium"
                >
                  Título del proyecto
                </label>
                <input
                  id="project-title"
                  type="text"
                  value={formTitle}
                  onChange={handleTitleChange}
                  disabled={submitting}
                  placeholder="Ej. Centro de Trasbordo — Triángulo de Bernal, Quilmes"
                  required
                  className="w-full h-10 px-3 bg-[#FFFFFF] text-[#1C1C1A] placeholder:text-[#9A9892] text-sm border border-neutral-300 rounded-none focus:outline-none focus:border-[#099AD7] transition-colors"
                />
              </div>

              {/* Selector Obligatorio: Tipo / Categoría de Proyecto + Creación rápida de etiqueta */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 pt-1">
                <div className="sm:col-span-6 flex flex-col gap-1.5">
                  <label
                    htmlFor="project-category"
                    className="text-[11px] uppercase tracking-wider text-[#1C1C1A] font-medium"
                  >
                    Tipo / Categoría de Proyecto *
                  </label>
                  <select
                    id="project-category"
                    value={formCategory}
                    onChange={(e) => {
                      setFormCategory(e.target.value);
                      if (formError) setFormError(null);
                    }}
                    disabled={submitting}
                    required
                    className="w-full h-10 px-3 bg-[#FFFFFF] text-[#1C1C1A] text-xs uppercase tracking-wider font-medium border border-neutral-300 rounded-none focus:outline-none focus:border-[#099AD7] transition-colors"
                  >
                    {availableFilters.map((filterOption) => (
                      <option key={filterOption} value={filterOption}>
                        {filterOption}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-6 flex flex-col gap-1.5">
                  <label
                    htmlFor="project-new-category"
                    className="text-[11px] uppercase tracking-wider text-[#686661] font-medium"
                  >
                    ¿Nueva etiqueta / categoría?
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="project-new-category"
                      type="text"
                      value={modalNewCategoryInput}
                      onChange={(e) => setModalNewCategoryInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleQuickAddCategoryInModal();
                        }
                      }}
                      disabled={submitting}
                      placeholder="Ej. Edificios Públicos"
                      className="w-full h-10 px-3 bg-[#FFFFFF] text-[#1C1C1A] placeholder:text-[#9A9892] text-xs border border-neutral-300 rounded-none focus:outline-none focus:border-[#099AD7]"
                    />
                    <button
                      type="button"
                      onClick={handleQuickAddCategoryInModal}
                      disabled={submitting || !modalNewCategoryInput.trim()}
                      className="h-10 px-3 bg-neutral-900 hover:bg-[#099AD7] text-white text-[11px] uppercase tracking-wider font-medium rounded-none transition-colors disabled:opacity-40 shrink-0"
                    >
                      Usar
                    </button>
                  </div>
                </div>
              </div>

              {/* Switch / Toggle de Visibilidad en Grilla General ("Todos") */}
              <div className="border border-neutral-200 bg-neutral-50/70 p-3.5 flex items-center justify-between gap-4">
                <div className="flex flex-col gap-0.5">
                  <label
                    htmlFor="project-show-main-grid"
                    className="text-xs uppercase tracking-wider text-[#1C1C1A] font-medium cursor-pointer"
                  >
                    Mostrar en grilla general (&ldquo;Todos&rdquo;)
                  </label>
                  <span className="text-[11px] text-[#686661] leading-snug">
                    Si se desactiva, el proyecto no aparecerá en la vista
                    general de proyectos, pero sí al filtrar por{" "}
                    <strong className="font-medium text-[#1C1C1A]">
                      {formCategory}
                    </strong>{" "}
                    o mediante enlace directo.
                  </span>
                </div>

                <button
                  id="project-show-main-grid"
                  type="button"
                  role="switch"
                  aria-checked={formShowInMainGrid}
                  onClick={() => setFormShowInMainGrid((prev) => !prev)}
                  disabled={submitting}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center border transition-colors duration-200 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#099AD7] ${
                    formShowInMainGrid
                      ? "bg-[#099AD7] border-[#099AD7]"
                      : "bg-neutral-300 border-neutral-400"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 bg-white transition-transform duration-200 ${
                      formShowInMainGrid ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              {/* Campo Imagen de Portada (Cover) */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="project-cover"
                  className="text-[11px] uppercase tracking-wider text-[#1C1C1A] font-medium"
                >
                  Imagen de portada
                </label>

                <input
                  ref={coverInputRef}
                  id="project-cover"
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                  disabled={submitting}
                  className="hidden"
                />

                {coverPreview ? (
                  <div className="relative w-full h-44 border border-neutral-300 bg-neutral-50 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={coverPreview}
                      alt="Vista previa de portada"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 right-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => coverInputRef.current?.click()}
                        disabled={submitting}
                        className="bg-[#FFFFFF]/95 text-[#1C1C1A] hover:text-[#099AD7] border border-neutral-300 px-3 py-1 text-[11px] uppercase tracking-wider font-medium"
                      >
                        Cambiar portada
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    disabled={submitting}
                    className="w-full h-28 border border-dashed border-neutral-300 hover:border-[#099AD7] bg-[#FFFFFF] flex flex-col items-center justify-center gap-1.5 transition-colors"
                  >
                    <Upload className="w-4 h-4 text-[#099AD7]" />
                    <span className="text-xs uppercase tracking-wider text-[#1C1C1A] font-medium">
                      Seleccionar imagen de portada
                    </span>
                    <span className="text-[11px] text-[#686661]">
                      Formatos recomendados: WEBP, JPG o PNG
                    </span>
                  </button>
                )}
              </div>

              {/* Campo Galería de Imágenes (Renders y Planos) */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="project-gallery"
                    className="text-[11px] uppercase tracking-wider text-[#1C1C1A] font-medium"
                  >
                    Galería de imágenes (Renders y Planos)
                  </label>
                  <span className="text-[11px] text-[#686661]">
                    {totalGalleryCount}{" "}
                    {totalGalleryCount === 1 ? "imagen" : "imágenes"}
                  </span>
                </div>

                <input
                  ref={galleryInputRef}
                  id="project-gallery"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryChange}
                  disabled={submitting}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  disabled={submitting}
                  className="w-full py-3 px-4 border border-dashed border-neutral-300 hover:border-[#099AD7] bg-[#FFFFFF] flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-[#099AD7]" />
                  <span className="text-xs uppercase tracking-wider text-[#1C1C1A] font-medium">
                    Agregar imágenes a la galería
                  </span>
                </button>

                {totalGalleryCount > 0 && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] uppercase tracking-wider text-[#686661]">
                      Arrastra las miniaturas para cambiar el orden en que se mostrarán en el visor
                    </span>
                    <SortableImageGallery
                      items={galleryEntries}
                      onReorder={handleReorderGallery}
                      onRemove={(id) => handleRemoveGalleryEntry(id)}
                      disabled={submitting}
                      columnsClassName="grid-cols-3 sm:grid-cols-4"
                      aspectClassName="aspect-[4/3]"
                    />
                  </div>
                )}
              </div>

              {/* Indicadores de error o progreso */}
              {formError && (
                <p role="alert" className="text-xs text-[#A84A4A] tracking-wide">
                  {formError}
                </p>
              )}

              {statusMessage && (
                <div className="border border-[#099AD7]/40 bg-[#099AD7]/5 px-3.5 py-2.5 flex items-center gap-2.5">
                  <span className="w-2 h-2 bg-[#099AD7] animate-pulse" />
                  <span className="text-xs uppercase tracking-wider text-[#099AD7] font-medium">
                    {statusMessage}
                  </span>
                </div>
              )}

              {/* Acciones del Modal */}
              <div className="pt-3 border-t border-neutral-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={submitting}
                  className="h-10 px-4 text-xs uppercase tracking-wider text-[#686661] hover:text-[#1C1C1A] border border-neutral-300 rounded-none transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="h-10 px-6 bg-[#099AD7] text-white text-xs uppercase tracking-wider font-medium rounded-none hover:bg-[#0886BC] active:bg-[#0776A6] transition-colors disabled:opacity-50"
                >
                  {submitting
                    ? "PROCESANDO..."
                    : editingProject
                      ? "GUARDAR CAMBIOS"
                      : "GUARDAR PROYECTO"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
