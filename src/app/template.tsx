"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isProjectDetail =
    pathname.startsWith("/proyectos/") && pathname !== "/proyectos";

  if (isProjectDetail) {
    return <div className="bg-white">{children}</div>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="pt-20"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
