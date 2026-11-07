import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  servicesData,
  parseMethodologyMetadata,
  type ServiceItem,
  type Subservice,
} from "@/data/services";
import { supabase } from "@/lib/supabase";
import ServiceDetailView from "@/components/ServiceDetailView";

export const dynamicParams = true;

export function generateStaticParams() {
  return servicesData.map((service) => ({
    id: service.id,
  }));
}

function normalizeSubservices(raw: unknown): Subservice[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item, idx) => {
    if (typeof item === "string") {
      return { id: `sub-${idx + 1}`, title: item };
    }
    if (item && typeof item === "object") {
      const obj = item as Record<string, unknown>;
      return {
        id: typeof obj.id === "string" && obj.id ? obj.id : `sub-${idx + 1}`,
        title: typeof obj.title === "string" ? obj.title : "",
      };
    }
    return { id: `sub-${idx + 1}`, title: "" };
  });
}

async function resolveService(id: string): Promise<ServiceItem | null> {
  const localMatch = servicesData.find((s) => s.id === id) ?? null;

  try {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (!error && data) {
      const row = data as Record<string, unknown>;
      const rawSubservices = row.subservices ?? row.scope_items;
      const dbSubservices = normalizeSubservices(rawSubservices);
      const rawSpecs =
        row.specifications ?? row.tools ?? row.methodology_steps;
      const dbSpecs = Array.isArray(rawSpecs)
        ? (rawSpecs as string[]).filter(Boolean)
        : [];
      const meta = parseMethodologyMetadata(row.methodology_title);
      const desc = String(row.description || localMatch?.description || "");
      const detailDesc = String(
        row.detail_description ||
          row.long_description ||
          meta.detailDescription ||
          localMatch?.detailDescription ||
          desc
      );

      const coverImage = String(
        (typeof row.cover_image === "string" && row.cover_image.trim()) ||
          meta.coverImage ||
          localMatch?.coverImage ||
          "/projects/centro-de-trasbordo/01-render-exterior.webp"
      );
      const rawImages = Array.isArray(row.images)
        ? (row.images as string[]).filter(Boolean)
        : meta.images && meta.images.length > 0
          ? meta.images
          : localMatch?.images || [];
      const images =
        rawImages.length > 0
          ? Array.from(new Set([coverImage, ...rawImages]))
          : [coverImage];

      return {
        id: String(row.id || id),
        orderNumber: String(row.order_number || localMatch?.orderNumber || "01"),
        title: String(row.title || localMatch?.title || id),
        description: desc,
        detailDescription: detailDesc,
        coverImage,
        images,
        subservices: Array.isArray(rawSubservices)
          ? dbSubservices
          : localMatch?.subservices || [],
        technicalSpecs: Array.isArray(rawSpecs)
          ? dbSpecs
          : localMatch?.technicalSpecs || [],
      };
    }
  } catch {
    // Fallback silencioso a datos locales
  }

  return localMatch;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const service = await resolveService(id);

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
  const service = await resolveService(id);

  if (!service) {
    notFound();
  }

  return (
    <main>
      <ServiceDetailView service={service} />
    </main>
  );
}
