import { projects } from "@/data/projects";
import { notFound } from "next/navigation";
import HorizontalScrollGallery from "@/components/HorizontalScrollGallery";
import Link from "next/link";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);
  
  if (!project) {
    notFound();
  }

  return (
    <main className="h-screen max-h-screen overflow-hidden bg-[#F8F7F4] text-[#1C1C1A] flex flex-col justify-between py-6 px-8 md:px-16 pt-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end shrink-0 gap-6 mb-8">
        <h1 className="font-sans font-light text-3xl md:text-5xl tracking-tighter max-w-4xl">
          {project.title}
        </h1>
        <Link 
          href="/proyectos" 
          className="text-[#099AD7] hover:text-[#1C1C1A] transition-colors font-mono uppercase text-sm tracking-widest flex items-center gap-2 shrink-0"
        >
          <span>←</span> Volver a Proyectos
        </Link>
      </div>

      <div className="flex-1 w-full relative flex items-center justify-center min-h-0 pb-4">
        <div className="h-full w-full">
          <HorizontalScrollGallery images={project.images} title={project.title} />
        </div>
      </div>
    </main>
  );
}
