import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n";
import { hasDatabase } from "@/lib/env";

const fallbackSections = {
  "info-general": {
    es: { title: "Información general", content: "Bienvenidos a la Parroquia de la Inmaculada Concepción. Consulte aquí nuestros horarios, servicios y medios de contacto." },
    en: { title: "General information", content: "Welcome to the Immaculate Conception Parish. Find our schedule, services, and contact information here." },
  },
  historia: {
    es: { title: "Nuestra historia", content: "La historia de nuestra parroquia y de quienes la han construido se compartirá aquí." },
    en: { title: "Our history", content: "The story of our parish and the people who built it will be shared here." },
  },
} as const;

export type SectionKey = keyof typeof fallbackSections;

export async function getSection(key: SectionKey, locale: Locale) {
  const fallback = fallbackSections[key][locale];
  if (!hasDatabase) return { ...fallback, photos: [] as { id: string; url: string; caption: string | null }[] };
  try {
    const section = await prisma.section.findUnique({
      where: { key },
      include: { translations: { where: { locale } }, photos: true },
    });
    if (!section) return { ...fallback, photos: [] as { id: string; url: string; caption: string | null }[] };
    const translation = section.translations[0];
    return {
      title: translation?.title ?? section.title,
      content: translation?.content ?? section.content,
      photos: section.photos,
    };
  } catch (error) {
    console.error("Could not load parish content", error);
    return { ...fallback, photos: [] as { id: string; url: string; caption: string | null }[] };
  }
}

export async function getProjects(locale: Locale) {
  if (!hasDatabase) return [];
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" }, include: { translations: { where: { locale } } },
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

export async function updateSection(key: SectionKey, title: string, content: string) {
  await prisma.section.upsert({
    where: { key },
    update: { title, content },
    create: { key, title, content },
  });
  const path = key === "historia" ? "/historia" : "/";
  revalidatePath(path);
  revalidatePath(`/en${path === "/" ? "" : path}`);
}
