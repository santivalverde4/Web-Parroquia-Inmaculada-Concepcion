import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import { readingPreferencesScript } from "@/lib/readingPreferences";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "Parroquia de la Inmaculada Concepción",
    template: "%s | Parroquia de la Inmaculada Concepción",
  },
  description:
    "Comunidad, fe y servicio. Conozca la vida de la Parroquia de la Inmaculada Concepción.",
};

export default function SpanishLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: el script de abajo puede agregar
    // data-text / data-contrast a <html> antes de que React hidrate.
    <html
      lang="es"
      className={fontVariables}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        {/* Aplica las opciones de lectura guardadas antes de pintar. */}
        <script
          dangerouslySetInnerHTML={{ __html: readingPreferencesScript }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
