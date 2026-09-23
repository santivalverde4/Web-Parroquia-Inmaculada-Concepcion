"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";

export function LanguageSwitch({ locale }: { locale: Locale }) {
  const path = usePathname();
  const otherPath = locale === "es" ? `/en${path === "/" ? "" : path}` : path.replace(/^\/en(?=\/|$)/, "") || "/";
  return <Link href={otherPath} hrefLang={locale === "es" ? "en" : "es"} className="font-semibold text-accent" aria-label={locale === "es" ? "Cambiar a inglés" : "Switch to Spanish"}>{locale === "es" ? "EN" : "ES"}</Link>;
}
