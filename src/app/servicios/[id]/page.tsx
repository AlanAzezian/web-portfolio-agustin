import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { servicesData } from "@/data/services";
import ServiceDetailView from "@/components/ServiceDetailView";

export function generateStaticParams() {
  return servicesData.map((service) => ({
    id: service.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const service = servicesData.find((s) => s.id === id);

  if (!service) {
    return {
      title: "Servicio no encontrado",
    };
  }

  return {
    title: `${service.title} — Servicios`,
    description: service.description,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = servicesData.find((s) => s.id === id);

  if (!service) {
    notFound();
  }

  return (
    <main>
      <ServiceDetailView service={service} />
    </main>
  );
}
