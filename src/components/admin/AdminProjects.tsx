"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Trash2,
  Plus,
  X,
  Upload,
  Image as ImageIcon,
  Pencil,
} from "lucide-react";

export interface SupabaseProject {
  id: string;
  title: string;
  cover_image: string;
  images: string[];
  order_index: number;
  created_at?: string;
}

interface GalleryPreviewItem {
  file: File;
  previewUrl: string;
}

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

  // Modal / Form state (Create & Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<SupabaseProject | null>(
    null
  );
  const [formTitle, setFormTitle] = useState("");

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  // Existing gallery URLs (when editing) + newly added local files
  const [existingGalleryUrls, setExistingGalleryUrls] = useState<string[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryPreviewItem[]>([]);

  // Saving & status states
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const fetchProjects = useCallback(async () => {
    setLoadingList(true);
    setListError(null);
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("order_index", { ascending: true });

      if (error) {
        setListError(error.message);
      } else {
        setProjects((data as SupabaseProject[]) || []);
      }
    } catch (err) {
      setListError(
        err instanceof Error ? err.message : "Error al cargar los proyectos."
      );
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function loadInitialProjects() {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("order_index", { ascending: true });

        if (!active) return;
        if (error) {
          setListError(error.message);
        } else {
          setProjects((data as SupabaseProject[]) || []);
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
  }, []);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (coverPreview && coverPreview.startsWith("blob:")) {
        URL.revokeObjectURL(coverPreview);
      }
      galleryItems.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, [coverPreview, galleryItems]);

  const resetForm = () => {
    setEditingProject(null);
    setFormTitle("");
    if (coverPreview && coverPreview.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreview);
    }
    setCoverFile(null);
    setCoverPreview(null);
    setExistingGalleryUrls([]);
    galleryItems.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setGalleryItems([]);
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
    setCoverPreview(project.cover_image || null);
    setExistingGalleryUrls(
      Array.isArray(project.images) ? [...project.images] : []
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

    const newItems: GalleryPreviewItem[] = Array.from(files).map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setGalleryItems((prev) => [...prev, ...newItems]);
    if (galleryInputRef.current) {
      galleryInputRef.current.value = "";
    }
    if (formError) setFormError(null);
  };

  const handleRemoveExistingGalleryUrl = (index: number) => {
    setExistingGalleryUrls((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleRemoveNewGalleryItem = (index: number) => {
    setGalleryItems((prev) => {
      const target = prev[index];
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((_, idx) => idx !== index);
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

      // 2. Galería: subir nuevas imágenes agregadas y combinarlas con las existentes que quedaron
      const uploadedGalleryUrls: string[] = [];

      if (galleryItems.length > 0) {
        setStatusMessage("Subiendo imágenes de galería...");
        const baseOffset = existingGalleryUrls.length;

        for (let i = 0; i < galleryItems.length; i++) {
          const item = galleryItems[i];
          const fileName = `${String(baseOffset + i + 1).padStart(
            2,
            "0"
          )}-${sanitizeFileName(item.file.name)}`;
          const path = `projects/${projectSlug}/${fileName}`;

          const { error: galleryError } = await supabase.storage
            .from("portfolio")
            .upload(path, item.file, { upsert: true });

          if (galleryError) {
            throw new Error(
              `Error al subir imagen ${i + 1}: ${galleryError.message}`
            );
          }

          const publicUrl = supabase.storage
            .from("portfolio")
            .getPublicUrl(path).data.publicUrl;

          uploadedGalleryUrls.push(publicUrl);
        }
      }

      const finalGalleryUrls = [...existingGalleryUrls, ...uploadedGalleryUrls];

      // 3. Guardar o actualizar registro en base de datos
      setStatusMessage(
        isEditing ? "Actualizando proyecto..." : "Guardando proyecto..."
      );

      if (isEditing && editingProject) {
        const { error: updateError } = await supabase
          .from("projects")
          .update({
            title: cleanTitle,
            cover_image: finalCoverUrl,
            images: finalGalleryUrls,
          })
          .eq("id", editingProject.id);

        if (updateError) {
          throw new Error(
            `Error al actualizar el proyecto: ${updateError.message}`
          );
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

        const { error: insertError } = await supabase.from("projects").insert([
          {
            id: projectSlug,
            title: cleanTitle,
            cover_image: finalCoverUrl,
            images: finalGalleryUrls,
            order_index: nextOrderIndex,
          },
        ]);

        if (insertError) {
          throw new Error(
            `Error al guardar en base de datos: ${insertError.message}`
          );
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

  const totalGalleryCount = existingGalleryUrls.length + galleryItems.length;

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
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2 max-h-56 overflow-y-auto pr-1">
                    {/* Imágenes actuales del proyecto */}
                    {existingGalleryUrls.map((url, idx) => (
                      <div
                        key={`existing-${url}-${idx}`}
                        className="relative aspect-[4/3] border border-neutral-200 bg-neutral-50 group overflow-hidden"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={`Galería ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1 left-1 bg-[#FFFFFF]/90 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-[#1C1C1A] border border-neutral-200">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingGalleryUrl(idx)}
                          disabled={submitting}
                          aria-label={`Quitar imagen ${idx + 1}`}
                          className="absolute top-1 right-1 bg-[#FFFFFF]/95 hover:bg-[#A84A4A] text-[#1C1C1A] hover:text-white border border-neutral-300 hover:border-[#A84A4A] p-1 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}

                    {/* Nuevas imágenes seleccionadas para subir */}
                    {galleryItems.map((item, idx) => {
                      const displayIndex = existingGalleryUrls.length + idx + 1;
                      return (
                        <div
                          key={`new-${item.file.name}-${idx}`}
                          className="relative aspect-[4/3] border border-[#099AD7]/40 bg-neutral-50 group overflow-hidden"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.previewUrl}
                            alt={`Nueva imagen ${displayIndex}`}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-1 left-1 bg-[#099AD7] px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-white">
                            {String(displayIndex).padStart(2, "0")}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveNewGalleryItem(idx)}
                            disabled={submitting}
                            aria-label={`Quitar imagen ${displayIndex}`}
                            className="absolute top-1 right-1 bg-[#FFFFFF]/95 hover:bg-[#A84A4A] text-[#1C1C1A] hover:text-white border border-neutral-300 hover:border-[#A84A4A] p-1 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
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
