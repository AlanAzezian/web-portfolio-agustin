"use client";

import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isProjectDetail =
    pathname.startsWith("/proyectos/") && pathname !== "/proyectos";
  const isAdminRoute = pathname.startsWith("/admin");

  const isProjectsPage =
    pathname === "/" ||
    pathname === "/proyectos" ||
    pathname.startsWith("/proyectos?");

  if (isProjectDetail || isAdminRoute || isProjectsPage) {
    return <div className="bg-[#FFFFFF] m-0 p-0 !pt-0 !mt-0">{children}</div>;
  }

  return <div className="pt-14 bg-[#FFFFFF]">{children}</div>;
}
