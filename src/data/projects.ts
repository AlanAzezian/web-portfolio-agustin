export interface Project {
  id: string;
  title: string;
  coverImage: string;
  images: string[];
  categories?: string[];
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
  categories?: string[];
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

function parseCategoryList(value: unknown): string[] | undefined {
  if (Array.isArray(value)) {
    const cleaned = value
      .filter((t): t is string => typeof t === "string" && t.trim() !== "")
      .map(normalizeFilterLabel);
    return cleaned.length > 0 ? Array.from(new Set(cleaned)) : undefined;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const trimmed = value.trim();
    if (trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          const cleaned = parsed
            .filter(
              (t): t is string => typeof t === "string" && t.trim() !== ""
            )
            .map(normalizeFilterLabel);
          if (cleaned.length > 0) return Array.from(new Set(cleaned));
        }
      } catch {
        // Fallback a string simple
      }
    }
    return [normalizeFilterLabel(trimmed)];
  }
  return undefined;
}

export function parseProjectImagesAndMeta(raw: Record<string, unknown>): {
  cleanImages: string[];
  categories: string[];
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

  const directCategories = parseCategoryList(raw.categories);
  const metaCategories = parseCategoryList(embeddedMeta.categories);
  const directTags = parseCategoryList(raw.tags);
  const metaTags = parseCategoryList(embeddedMeta.tags);
  const directCategory = parseCategoryList(raw.category);
  const metaCategory = parseCategoryList(embeddedMeta.category);

  const categories =
    directCategories ||
    metaCategories ||
    directTags ||
    metaTags ||
    directCategory ||
    metaCategory || ["PROYECTOS"];

  const category = categories[0] || "PROYECTOS";
  const tags = categories;

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
    categories,
    category,
    tags,
    showInMainGrid,
  };
}

export function encodeProjectImagesWithMeta(
  cleanImages: string[],
  meta: {
    categories?: string[];
    category?: string;
    tags?: string[];
    show_in_main_grid: boolean;
  }
): string[] {
  const sanitized = cleanImages.filter(
    (img) =>
      typeof img === "string" &&
      img.trim() !== "" &&
      !img.startsWith(PROJECT_META_PREFIX)
  );

  const rawList =
    meta.categories && meta.categories.length > 0
      ? meta.categories
      : meta.tags && meta.tags.length > 0
        ? meta.tags
        : meta.category
          ? [meta.category]
          : ["PROYECTOS"];

  const normalizedCategories = Array.from(
    new Set(
      rawList
        .filter((c) => typeof c === "string" && c.trim() !== "")
        .map(normalizeFilterLabel)
    )
  );
  if (normalizedCategories.length === 0) {
    normalizedCategories.push("PROYECTOS");
  }

  const normalizedCategory = normalizedCategories[0];

  const metaString = `${PROJECT_META_PREFIX}${JSON.stringify({
    categories: normalizedCategories,
    category: normalizedCategory,
    tags: normalizedCategories,
    show_in_main_grid: Boolean(meta.show_in_main_grid),
  })}`;

  return [...sanitized, metaString];
}

export const DEFAULT_BLUR_DATA_URL =
  "data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAAAQAgCdASoQAAkAA4BaJZQC7AERH+xsKNwwAP7nIaT4TX0+MHu+tw9XzVuQY8s0u7M2jQGwe0VTPcQ9bYwAAA==";

export const blurDataMap: Record<string, string> = {};

export const projects: Project[] = [];
