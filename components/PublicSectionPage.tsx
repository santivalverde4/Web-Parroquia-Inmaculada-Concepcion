import { PublicShell } from "@/components/PublicShell";
import { HistoriaSection } from "@/components/HistoriaSection";
import { VideosSection } from "@/components/VideosSection";
import { NoticiasSection } from "@/components/NoticiasSection";
import { ProyectosSection } from "@/components/ProyectosSection";
import { MapaSection } from "@/components/MapaSection";
import type { Locale } from "@/lib/i18n";

export const sectionSlugs = [
  "historia",
  "videos",
  "noticias",
  "proyectos",
  "mapa",
] as const;

export type SectionSlug = (typeof sectionSlugs)[number];

export function isSectionSlug(value: string): value is SectionSlug {
  return sectionSlugs.includes(value as SectionSlug);
}

/**
 * Renderiza cualquiera de las cinco paginas internas.
 *
 * Cada seccion vive en su propio componente (components/*Section.tsx);
 * este archivo solo decide cual mostrar.
 */
export async function PublicSectionPage({
  locale,
  slug,
}: {
  locale: Locale;
  slug: SectionSlug;
}) {
  return (
    <PublicShell locale={locale}>
      {slug === "historia" && <HistoriaSection locale={locale} />}
      {slug === "videos" && <VideosSection locale={locale} />}
      {slug === "noticias" && <NoticiasSection locale={locale} />}
      {slug === "proyectos" && <ProyectosSection locale={locale} />}
      {slug === "mapa" && <MapaSection locale={locale} />}
    </PublicShell>
  );
}
