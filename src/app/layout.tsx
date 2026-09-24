import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Agustin Fabrizio | Portfolio",
  description: "Desarrollador Fullstack y Disenador UI/UX",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} antialiased bg-[#F8F7F4] text-[#1C1C1A] min-h-screen`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
