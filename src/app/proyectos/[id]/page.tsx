import { projects } from "@/data/projects";
import { notFound } from "next/navigation";
import ProjectViewer from "@/components/ProjectViewer";

export function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id,
  }));
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  return <ProjectViewer title={project.title} images={project.images} />;
}
