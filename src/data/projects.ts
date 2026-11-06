export interface Project {
  id: string;
  title: string;
  coverImage: string;
  images: string[];
  tags?: string[];
  category?: string;
  showInMainGrid?: boolean;
  aspectRatio?: string;
  height?: number;
}

export const DEFAULT_PROJECT_FILTERS = [
  "ACADÉMICOS",
  "PROYECTOS",
  "SERVICIOS",
] as const;

export const PROJECT_META_PREFIX = "__META__:";

export interface ProjectEmbeddedMetadata {
  category?: string;
  tags?: string[];
  show_in_main_grid?: boolean;
}

export function normalizeFilterLabel(label: string): string {
  return label.trim().toUpperCase();
}

export function normalizeFilterSlug(label: string): string {
  return label
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_");
}

export function parseProjectImagesAndMeta(raw: Record<string, unknown>): {
  cleanImages: string[];
  category: string;
  tags: string[];
  showInMainGrid: boolean;
} {
  const rawImages = Array.isArray(raw.images)
    ? (raw.images as unknown[]).filter(
        (item): item is string => typeof item === "string" && item.trim() !== ""
      )
    : [];

  let embeddedMeta: ProjectEmbeddedMetadata = {};
  const cleanImages: string[] = [];

  for (const entry of rawImages) {
    if (entry.startsWith(PROJECT_META_PREFIX)) {
      try {
        const parsed = JSON.parse(
          entry.slice(PROJECT_META_PREFIX.length)
        ) as ProjectEmbeddedMetadata;
        if (parsed && typeof parsed === "object") {
          embeddedMeta = { ...embeddedMeta, ...parsed };
        }
      } catch {
        // Ignorar entrada de metadatos corrupta
      }
    } else {
      cleanImages.push(entry);
    }
  }

  // Prioridad: columna directa en DB -> metadato embebido -> valor por defecto
  const directCategory =
    typeof raw.category === "string" && raw.category.trim()
      ? normalizeFilterLabel(raw.category)
      : undefined;
  const directTags = Array.isArray(raw.tags)
    ? (raw.tags as unknown[])
        .filter((t): t is string => typeof t === "string" && t.trim() !== "")
        .map(normalizeFilterLabel)
    : undefined;

  const metaCategory =
    typeof embeddedMeta.category === "string" && embeddedMeta.category.trim()
      ? normalizeFilterLabel(embeddedMeta.category)
      : undefined;
  const metaTags = Array.isArray(embeddedMeta.tags)
    ? embeddedMeta.tags
        .filter((t): t is string => typeof t === "string" && t.trim() !== "")
        .map(normalizeFilterLabel)
    : undefined;

  const category =
    directCategory ||
    metaCategory ||
    directTags?.[0] ||
    metaTags?.[0] ||
    "PROYECTOS";

  const tags =
    directTags && directTags.length > 0
      ? directTags
      : metaTags && metaTags.length > 0
        ? metaTags
        : [category];

  const showInMainGrid =
    typeof raw.show_in_main_grid === "boolean"
      ? raw.show_in_main_grid
      : typeof raw.showInMainGrid === "boolean"
        ? raw.showInMainGrid
        : typeof embeddedMeta.show_in_main_grid === "boolean"
          ? embeddedMeta.show_in_main_grid
          : true;

  return {
    cleanImages,
    category,
    tags,
    showInMainGrid,
  };
}

export function encodeProjectImagesWithMeta(
  cleanImages: string[],
  meta: { category: string; tags?: string[]; show_in_main_grid: boolean }
): string[] {
  const sanitized = cleanImages.filter(
    (img) => typeof img === "string" && img.trim() !== "" && !img.startsWith(PROJECT_META_PREFIX)
  );
  const normalizedCategory = normalizeFilterLabel(meta.category || "PROYECTOS");
  const normalizedTags =
    meta.tags && meta.tags.length > 0
      ? meta.tags.map(normalizeFilterLabel)
      : [normalizedCategory];

  const metaString = `${PROJECT_META_PREFIX}${JSON.stringify({
    category: normalizedCategory,
    tags: normalizedTags,
    show_in_main_grid: Boolean(meta.show_in_main_grid),
  })}`;

  return [...sanitized, metaString];
}

export const DEFAULT_BLUR_DATA_URL =
  "data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAAAQAgCdASoQAAkAA4BaJZQC7AERH+xsKNwwAP7nIaT4TX0+MHu+tw9XzVuQY8s0u7M2jQGwe0VTPcQ9bYwAAA==";

export const blurDataMap: Record<string, string> = {};

export const projects: Project[] = [];
