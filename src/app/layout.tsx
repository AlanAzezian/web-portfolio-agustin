import type { Metadata } from "next";
import { Roboto, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import EditorialOverlay from "@/components/EditorialOverlay";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
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
    <html lang="es" className={`${roboto.variable} ${jetbrains.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,200..900;1,200..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-roboto antialiased bg-background text-foreground min-h-screen">
        <EditorialOverlay />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
