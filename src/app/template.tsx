"use client";

import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isProjectDetail =
    pathname.startsWith("/proyectos/") && pathname !== "/proyectos";
  const isAdminRoute = pathname.startsWith("/admin");

  if (isProjectDetail || isAdminRoute) {
    return <div className="bg-[#FFFFFF] m-0 p-0 !pt-0 !mt-0">{children}</div>;
  }

  return <div className="pt-20 bg-[#FFFFFF]">{children}</div>;
}
