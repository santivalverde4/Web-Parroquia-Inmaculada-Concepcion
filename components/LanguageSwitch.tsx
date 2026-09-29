"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { locales, type Locale } from "@/lib/i18n";

/**
 * Selector de idioma.
 *
 * Calcula la ruta equivalente en el otro idioma a partir de la ruta actual,
 * asi el visitante se queda en la misma pagina al cambiar de idioma en vez
 * de volver al inicio.
 */
export function LanguageSwitch({ locale }: { locale: Locale }) {
  const path = usePathname();

  function hrefFor(target: Locale) {
    if (target === locale) return path;
    if (target === "en") return `/en${path === "/" ? "" : path}`;
    return path.replace(/^\/en(?=\/|$)/, "") || "/";
  }

  return (
    <div
      className="inline-flex items-center rounded-full border border-line bg-surface p-0.5"
      role="group"
      aria-label={locale === "es" ? "Idioma" : "Language"}
    >
      {locales.map((option) => {
        const isActive = option === locale;
        return (
          <Link
            key={option}
            href={hrefFor(option)}
            hrefLang={option}
            aria-current={isActive ? "true" : undefined}
            className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase transition-colors ${
              isActive
                ? "bg-white text-ink shadow-card"
                : "text-muted hover:text-ink"
            }`}
          >
            {option}
          </Link>
        );
      })}
    </div>
  );
}
