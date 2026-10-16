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
  title: "Agustin Fabrizio | Portfolio",
  description: "Portfolio de Agustín Fabrizio — Arquitecto",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={roboto.variable}>
      <body className="font-roboto antialiased bg-background text-foreground min-h-screen">
        <SmoothScroll />
        <EditorialOverlay />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
