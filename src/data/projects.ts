export interface Project {
  id: string;
  title: string;
  coverImage: string;
  images: string[];
  tags?: string[];
  aspectRatio?: string;
  height?: number;
}

export const DEFAULT_BLUR_DATA_URL =
  "data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAAAQAgCdASoQAAkAA4BaJZQC7AERH+xsKNwwAP7nIaT4TX0+MHu+tw9XzVuQY8s0u7M2jQGwe0VTPcQ9bYwAAA==";

export const blurDataMap: Record<string, string> = {};

export const projects: Project[] = [];
