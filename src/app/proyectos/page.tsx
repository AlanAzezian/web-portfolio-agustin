import ProjectGrid from "@/components/ProjectGrid";
import { Suspense } from "react";

export const metadata = {
  title: "Proyectos | Agustín Fabrizio",
};

export default function Proyectos() {
  return (
    <main>
      <Suspense fallback={<div className="h-screen w-full bg-background" />}>
        <ProjectGrid />
      </Suspense>
    </main>
  );
}
