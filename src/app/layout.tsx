import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import EditorialOverlay from "@/components/EditorialOverlay";
import SmoothScroll from "@/components/SmoothScroll";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "600", "700", "900"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://agustinfabrizio.com"),
  title: {
    default: "Agustín Fabrizio — Arquitectura & Visualización",
    template: "%s | Agustín Fabrizio",
  },
  description:
    "Portfolio de Agustín Fabrizio — Arquitecto (FADU, UBA). Proyecto arquitectónico contemporáneo, modelado BIM y visualización hiperrealista.",
  keywords: [
    "Agustín Fabrizio",
    "Arquitectura",
    "Visualización Arquitectónica",
    "Renders 3D",
    "BIM",
    "FADU UBA",
    "Portfolio Arquitectura",
  ],
  authors: [{ name: "Agustín Fabrizio" }],
  creator: "Agustín Fabrizio",
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Agustín Fabrizio",
    title: "Agustín Fabrizio — Arquitectura & Visualización",
    description:
      "Portfolio de Agustín Fabrizio — Proyecto arquitectónico contemporáneo, modelado BIM y visualización hiperrealista.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Agustín Fabrizio — Arquitectura & Visualización",
    description:
      "Portfolio de Agustín Fabrizio — Proyecto arquitectónico contemporáneo, modelado BIM y visualización hiperrealista.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={roboto.variable}>
      <body className="font-roboto antialiased bg-[#FFFFFF] text-[#1C1C1A] min-h-screen">
        <SmoothScroll />
        <EditorialOverlay />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
