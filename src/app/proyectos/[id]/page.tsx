import { projects } from "@/data/projects";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import ProjectViewer from "@/components/ProjectViewer";

export const dynamicParams = true;

export function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id,
  }));
}

async function resolveProject(
  id: string
): Promise<{ id: string; title: string; images: string[] } | null> {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (!error && data) {
      const row = data as Record<string, unknown>;
      const title = String(row.title || id);
      const cover = String(row.cover_image || row.coverImage || "");
      const rawImages = Array.isArray(row.images)
        ? (row.images as string[]).filter(Boolean)
        : [];
      const images = rawImages.length > 0 ? rawImages : cover ? [cover] : [];

      if (images.length > 0) {
        return { id, title, images };
      }
    }
  } catch {
    // Fallback silencioso a datos locales
  }

  const localProject = projects.find((p) => p.id === id);
  if (!localProject) return null;

  return {
    id: localProject.id,
    title: localProject.title,
    images: localProject.images,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await resolveProject(id);

  if (!project) {
    notFound();
  }

  return (
    <ProjectViewer
      projectId={project.id}
      title={project.title}
      images={project.images}
    />
  );
}
