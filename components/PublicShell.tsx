import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import type { Locale } from "@/lib/i18n";

export function PublicShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <div className="flex min-h-screen flex-col"><a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-3">{locale === "es" ? "Saltar al contenido" : "Skip to content"}</a><Navbar locale={locale} />{children}<Footer locale={locale} /></div>;
}
