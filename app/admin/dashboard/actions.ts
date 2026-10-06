"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TIME_PATTERN, type MassDay } from "@/lib/parishInfo";
import { saveSetting, settingKeys } from "@/lib/services/settings";
import { SCHEDULE_ROWS, TIMES_PER_ROW, type AdminTab } from "./_tabs";

/**
 * Acciones del panel.
 *
 * Cada una revisa los datos, guarda y vuelve a la misma pestana con un
 * mensaje (?ok=... o ?error=...). Los textos de esos mensajes viven en
 * _messages.ts, para que aqui solo haya codigos.
 */

/* ------------------------------------------------------------------ */
/* Utilidades                                                          */
/* ------------------------------------------------------------------ */

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "admin") redirect("/admin/login");
}

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

/** Vuelve a la pestana con un aviso de exito y refresca todo el sitio. */
function done(tab: AdminTab, ok: string): never {
  revalidatePath("/", "layout");
  revalidatePath("/en", "layout");
  redirect(`/admin/dashboard?tab=${tab}&ok=${ok}`);
}

function fail(tab: AdminTab, error: string): never {
  redirect(`/admin/dashboard?tab=${tab}&error=${error}`);
}

/** Ejecuta una escritura; si la base de datos falla, avisa sin romper. */
async function write(tab: AdminTab, operation: () => Promise<unknown>) {
  try {
    await operation();
  } catch (error) {
    console.error("Admin write failed", error);
    fail(tab, "db");
  }
}

function isHttpUrl(text: string) {
  try {
    const url = new URL(text);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ */
/* Textos: portada e historia                                          */
/* ------------------------------------------------------------------ */

const sectionTabs = { "info-general": "inicio", historia: "historia" } as const;
type EditableSection = keyof typeof sectionTabs;

function sectionFrom(formData: FormData): EditableSection | null {
  const key = value(formData, "key");
  return key === "info-general" || key === "historia" ? key : null;
}

export async function saveSectionAction(formData: FormData) {
  await requireAdmin();
  const key = sectionFrom(formData);
  if (!key) fail("inicio", "unknown");
  const tab = sectionTabs[key];

  const title = value(formData, "titleEs");
  const content = value(formData, "contentEs");
  const titleEn = value(formData, "titleEn");
  const contentEn = value(formData, "contentEn");
  if (!title || !content) fail(tab, "section-required");
  if (Boolean(titleEn) !== Boolean(contentEn)) fail(tab, "english-incomplete");

  await write(tab, async () => {
    const section = await prisma.section.upsert({
      where: { key },
      create: { key, title, content },
      update: { title, content },
    });
    if (titleEn && contentEn) {
      await prisma.sectionTranslation.upsert({
        where: { sectionId_locale: { sectionId: section.id, locale: "en" } },
        create: {
          sectionId: section.id,
          locale: "en",
          title: titleEn,
          content: contentEn,
        },
        update: { title: titleEn, content: contentEn },
      });
    } else {
      await prisma.sectionTranslation.deleteMany({
        where: { sectionId: section.id, locale: "en" },
      });
    }
  });
  done(tab, "saved");
}

/**
 * Vuelve al texto original de la pagina. No borra la seccion (las fotos
 * de Historia cuelgan de ella): solo vacia el texto y quita la traduccion.
 */
export async function resetSectionAction(formData: FormData) {
  await requireAdmin();
  const key = sectionFrom(formData);
  if (!key) fail("inicio", "unknown");
  const tab = sectionTabs[key];

  await write(tab, async () => {
    const section = await prisma.section.findUnique({ where: { key } });
    if (!section) return;
    await prisma.section.update({
      where: { key },
      data: { title: "", content: "" },
    });
    await prisma.sectionTranslation.deleteMany({
      where: { sectionId: section.id },
    });
  });
  done(tab, "restored");
}

/* ------------------------------------------------------------------ */
/* Fotos de Historia                                                   */
/* ------------------------------------------------------------------ */

export async function addPhotoAction(formData: FormData) {
  await requireAdmin();
  const url = value(formData, "url");
  const caption = value(formData, "caption").slice(0, 200) || null;
  if (!isHttpUrl(url)) fail("historia", "photo-url");

  await write("historia", async () => {
    // La seccion puede no existir si nunca se edito el texto: se crea
    // vacia, y la pagina sigue mostrando el texto original.
    const section = await prisma.section.upsert({
      where: { key: "historia" },
      create: { key: "historia", title: "", content: "" },
      update: {},
    });
    await prisma.photo.create({
      data: { url, caption, sectionId: section.id },
    });
  });
  done("historia", "photo-added");
}

export async function removePhotoAction(formData: FormData) {
  await requireAdmin();
  const id = value(formData, "id");
  await write("historia", () => prisma.photo.deleteMany({ where: { id } }));
  done("historia", "photo-removed");
}

/* ------------------------------------------------------------------ */
/* Horarios, servicios y oficina                                       */
/* ------------------------------------------------------------------ */

export async function saveScheduleAction(formData: FormData) {
  await requireAdmin();

  const massSchedule: MassDay[] = [];
  for (let row = 0; row < SCHEDULE_ROWS; row++) {
    const dayEs = value(formData, `dayEs${row}`);
    const dayEn = value(formData, `dayEn${row}`);
    const times = Array.from({ length: TIMES_PER_ROW }, (_, i) =>
      value(formData, `time${row}_${i}`),
    ).filter(Boolean);

    if (!dayEs && times.length === 0) continue; // fila sin usar
    if (!dayEs) fail("horarios", "schedule-day");
    if (times.length === 0) fail("horarios", "schedule-times");
    if (times.some((time) => !TIME_PATTERN.test(time)))
      fail("horarios", "schedule-format");

    massSchedule.push({
      day: { es: dayEs, en: dayEn },
      // Ordenadas y sin repetir, aunque se hayan escrito en desorden.
      times: [...new Set(times)].sort(),
    });
  }

  // Un servicio por linea; el ingles se empareja por posicion.
  const lines = (key: string) =>
    value(formData, key)
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  const servicesEs = lines("servicesEs");
  const servicesEnRaw = lines("servicesEn");
  // Si las listas no tienen la misma cantidad, emparejarlas por posicion
  // mezclaria nombres: en ese caso se descarta el ingles y se avisa.
  const englishMatches = servicesEnRaw.length === servicesEs.length;
  const services = servicesEs.map((es, index) => ({
    es,
    en: englishMatches ? servicesEnRaw[index] : "",
  }));

  const officeHours = {
    es: value(formData, "officeEs"),
    en: value(formData, "officeEn"),
  };

  await write("horarios", async () => {
    await saveSetting(settingKeys.massSchedule, massSchedule);
    await saveSetting(settingKeys.services, services);
    await saveSetting(settingKeys.officeHours, officeHours);
  });
  done(
    "horarios",
    englishMatches || servicesEnRaw.length === 0 ? "saved" : "saved-no-english",
  );
}

/* ------------------------------------------------------------------ */
/* Contacto                                                            */
/* ------------------------------------------------------------------ */

export async function saveContactAction(formData: FormData) {
  await requireAdmin();
  const contact = {
    phone: value(formData, "phone"),
    whatsapp: value(formData, "whatsapp"),
    email: value(formData, "email"),
    address: {
      es: value(formData, "addressEs"),
      en: value(formData, "addressEn"),
    },
  };
  if (contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email))
    fail("contacto", "email");
  const digits = (text: string) => text.replace(/\D/g, "");
  if (contact.phone && digits(contact.phone).length < 8)
    fail("contacto", "phone");
  if (contact.whatsapp && digits(contact.whatsapp).length < 8)
    fail("contacto", "whatsapp");

  await write("contacto", () => saveSetting(settingKeys.contact, contact));
  done("contacto", "saved");
}

/* ------------------------------------------------------------------ */
/* Proyectos                                                           */
/* ------------------------------------------------------------------ */

export async function saveProjectAction(formData: FormData) {
  await requireAdmin();
  const id = value(formData, "id");
  const title = value(formData, "title");
  const description = value(formData, "description");
  const titleEn = value(formData, "titleEn");
  const descriptionEn = value(formData, "descriptionEn");
  const status = value(formData, "status") === "FUTURO" ? "FUTURO" : "ACTUAL";
  const imageUrl = value(formData, "imageUrl") || null;

  if (!title || !description) fail("proyectos", "project-required");
  if (Boolean(titleEn) !== Boolean(descriptionEn))
    fail("proyectos", "english-incomplete");
  if (imageUrl && !isHttpUrl(imageUrl)) fail("proyectos", "photo-url");

  await write("proyectos", async () => {
    const data = { title, description, status, imageUrl } as const;
    const project = id
      ? await prisma.project.update({ where: { id }, data })
      : await prisma.project.create({ data });
    if (titleEn && descriptionEn) {
      await prisma.projectTranslation.upsert({
        where: { projectId_locale: { projectId: project.id, locale: "en" } },
        create: {
          projectId: project.id,
          locale: "en",
          title: titleEn,
          description: descriptionEn,
        },
        update: { title: titleEn, description: descriptionEn },
      });
    } else {
      await prisma.projectTranslation.deleteMany({
        where: { projectId: project.id, locale: "en" },
      });
    }
  });
  done("proyectos", id ? "project-saved" : "project-created");
}

export async function deleteProjectAction(formData: FormData) {
  await requireAdmin();
  const id = value(formData, "id");
  await write("proyectos", () => prisma.project.deleteMany({ where: { id } }));
  done("proyectos", "project-deleted");
}

/* ------------------------------------------------------------------ */
/* Sesion                                                              */
/* ------------------------------------------------------------------ */

export async function signOutAction() {
  await requireAdmin();
  await signOut({ redirectTo: "/admin/login" });
}
