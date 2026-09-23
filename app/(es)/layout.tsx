import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: { default: "Parroquia de la Inmaculada Concepción", template: "%s | Parroquia de la Inmaculada Concepción" },
  description: "Comunidad, fe y servicio. Conozca la vida de la Parroquia de la Inmaculada Concepción.",
};

export default function SpanishLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
