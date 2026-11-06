import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-white m-0 p-0 top-0 !pt-0 !mt-0">
      {children}
    </div>
  );
}
