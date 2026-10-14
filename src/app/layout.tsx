import type { Metadata } from "next";
import { Roboto, Unica_One, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import EditorialOverlay from "@/components/EditorialOverlay";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

const unica = Unica_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-unica",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
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
    <html lang="es" className={`${roboto.variable} ${unica.variable} ${jetbrains.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground min-h-screen">
        <EditorialOverlay />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
