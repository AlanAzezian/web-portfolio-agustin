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
    <main className="min-h-screen bg-[#F8F7F4] text-[#1C1C1A] flex flex-col pt-24">
      <div className="px-6 md:px-12 py-8 flex flex-col md:flex-row justify-between items-start md:items-end shrink-0 gap-6">
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

      <div className="flex-1 w-full overflow-hidden relative flex items-center pb-12">
        <HorizontalScrollGallery images={project.images} title={project.title} />
      </div>
    </main>
  );
}
