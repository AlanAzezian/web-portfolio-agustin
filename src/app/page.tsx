import ProjectGrid from "@/components/ProjectGrid";
import { Suspense } from "react";

export default function Home() {
  return (
    <main>
      <Suspense fallback={<div className="h-screen w-full bg-background" />}>
        <ProjectGrid />
      </Suspense>
    </main>
  );
}
