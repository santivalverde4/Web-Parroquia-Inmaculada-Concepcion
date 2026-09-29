import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EdgeBlur } from "@/components/EdgeBlur";
import type { Locale } from "@/lib/i18n";

/** Marco comun de todas las paginas publicas. */
export function PublicShell({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-brand-600 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
      >
        {locale === "es" ? "Saltar al contenido" : "Skip to content"}
      </a>
      <Navbar locale={locale} />
      <EdgeBlur />
      {children}
      <Footer locale={locale} />
    </div>
  );
}
