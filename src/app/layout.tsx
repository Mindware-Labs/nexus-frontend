import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { preload } from "react-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

/* Tipografía oficial: Switzer (diseño.md §2), servida desde /public/fonts
   vía @font-face en globals.css y primera en --font-sans. Geist se carga
   aquí SOLO como fallback documentado — no la apliques directamente en
   componentes. */
/* preload: false — al ser solo fallback, no compiten con Switzer por el
   ancho de banda crítico del primer pintado. */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  preload: false,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  title: "Mindware Nexus — Chatbots con IA que convierten visitantes en clientes",
  description:
    "Mindware Nexus es la plataforma SaaS de chatbots con IA que captura, califica y entrega leads listos para vender. Instálalo en tu web en minutos.",
  openGraph: {
    title: "Mindware Nexus — Chatbots con IA que convierten",
    description:
      "Captura y califica leads automáticamente con un chatbot entrenado en tu negocio.",
    type: "website",
    locale: "es_ES",
  },
};

export const viewport: Viewport = {
  themeColor: "#3D1A4E",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /* Preload de los pesos críticos (texto y titulares) para evitar FOUT */
  preload("/fonts/switzer-regular.woff2", {
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  });
  preload("/fonts/switzer-bold.woff2", {
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  });

  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
