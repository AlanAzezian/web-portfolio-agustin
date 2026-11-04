"use client";

import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isProjectDetail =
    pathname.startsWith("/proyectos/") && pathname !== "/proyectos";

  if (isProjectDetail) {
    return <div className="bg-[#FFFFFF]">{children}</div>;
  }

  return <div className="pt-20 bg-[#FFFFFF]">{children}</div>;
}
