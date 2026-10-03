import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import { readingPreferencesScript } from "@/lib/readingPreferences";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "Immaculate Conception Parish",
    template: "%s | Immaculate Conception Parish",
  },
  description:
    "Community, faith, and service. Discover the life of Immaculate Conception Parish.",
};

export default function EnglishLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: el script de abajo puede agregar
    // data-text / data-contrast a <html> antes de que React hidrate.
    <html
      lang="en"
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
