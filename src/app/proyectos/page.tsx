import { redirect } from "next/navigation";

export const metadata = {
  title: "Proyectos | Agustín Fabrizio",
};

export default async function Proyectos({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const cat = typeof params.cat === "string" ? params.cat : undefined;
  redirect(cat ? `/?cat=${encodeURIComponent(cat)}` : "/");
}
