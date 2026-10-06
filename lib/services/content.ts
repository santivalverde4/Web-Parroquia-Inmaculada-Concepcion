import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n";
import { hasDatabase } from "@/lib/env";

/**
 * Textos editables desde el panel (tabla Section + SectionTranslation).
 *
 * El espanol vive en Section y el ingles en SectionTranslation. Si falta el
 * ingles se muestra el espanol, y si no hay nada guardado se usa el texto de
 * respaldo de cada pagina.
 */

const fallbackSections = {
  "info-general": {
    es: {
      title: "Información general",
      content:
        "Bienvenidos a la Parroquia de la Inmaculada Concepción. Consulte aquí nuestros horarios, servicios y medios de contacto.",
    },
    en: {
      title: "General information",
      content:
        "Welcome to the Immaculate Conception Parish. Find our schedule, services, and contact information here.",
    },
  },
  historia: {
    es: {
      title: "Nuestra historia",
      content:
        "La historia de nuestra parroquia y de quienes la han construido se compartirá aquí.",
    },
    en: {
      title: "Our history",
      content:
        "The story of our parish and the people who built it will be shared here.",
    },
  },
} as const;

export type SectionKey = keyof typeof fallbackSections;
export type SectionPhoto = { id: string; url: string; caption: string | null };

/**
 * Textos de relleno que la version anterior del panel guardaba al crear una
 * seccion. Si la base de datos tiene uno de estos, se trata como vacio.
 */
const legacyPlaceholders = new Set([
  "La historia de nuestra parroquia se compartirá aquí.",
  "Bienvenidos a la Parroquia de la Inmaculada Concepción.",
]);

/** Vacio o texto de relleno: la pagina usa su contenido de respaldo. */
const isBlank = (content: string) =>
  !content.trim() || legacyPlaceholders.has(content.trim());

/** Texto de respaldo de una seccion (el que se ve si no se ha editado). */
export function getFallbackSection(key: SectionKey, locale: Locale) {
  return fallbackSections[key][locale];
}

type StoredSection = {
  es: { title: string; content: string } | null;
  en: { title: string; content: string } | null;
  photos: SectionPhoto[];
};

/** Lo que hay guardado para una seccion, sin mezclar con respaldos. */
export async function getStoredSection(
  key: SectionKey,
): Promise<StoredSection> {
  const empty: StoredSection = { es: null, en: null, photos: [] };
  if (!hasDatabase) return empty;
  try {
    const section = await prisma.section.findUnique({
      where: { key },
      include: {
        translations: { where: { locale: "en" } },
        photos: { orderBy: { id: "asc" } },
      },
    });
    if (!section) return empty;
    const english = section.translations[0];
    return {
      es: isBlank(section.content)
        ? null
        : { title: section.title, content: section.content },
      en:
        english && !isBlank(english.content)
          ? { title: english.title, content: english.content }
          : null,
      photos: section.photos,
    };
  } catch (error) {
    console.error("Could not load parish content", error);
    return empty;
  }
}

/** Texto listo para mostrar: guardado si existe, si no el de respaldo. */
export async function getSection(key: SectionKey, locale: Locale) {
  const stored = await getStoredSection(key);
  const text =
    (locale === "en" ? stored.en : null) ??
    (locale === "es" || !stored.en ? stored.es : null) ??
    fallbackSections[key][locale];
  return { ...text, photos: stored.photos, isCustom: Boolean(stored.es) };
}

/* ------------------------------------------------------------------ */
/* Proyectos                                                           */
/* ------------------------------------------------------------------ */

export type PublicProject = {
  id: string;
  title: string;
  description: string;
  status: "ACTUAL" | "FUTURO";
  imageUrl: string | null;
};

/** Proyectos guardados. Lista vacia si no hay o si la base no responde. */
export async function getProjects(locale: Locale): Promise<PublicProject[]> {
  if (!hasDatabase) return [];
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: { translations: { where: { locale } } },
    });
    return projects.map((project) => ({
      id: project.id,
      title: project.translations[0]?.title ?? project.title,
      description: project.translations[0]?.description ?? project.description,
      status: project.status,
      imageUrl: project.imageUrl,
    }));
  } catch (error) {
    console.error("Could not load projects", error);
    return [];
  }
}
