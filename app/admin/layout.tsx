import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = { title: "Administración | Parroquia de la Inmaculada Concepción", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
