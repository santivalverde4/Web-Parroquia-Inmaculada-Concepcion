"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signOut, auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "admin") redirect("/admin/login");
}

function field(formData: FormData, key: string, max = 20000) {
  const value = String(formData.get(key) ?? "").trim();
  if (!value || value.length > max) throw new Error(`Invalid ${key}`);
  return value;
}

function optionalUrl(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  if (!value) return null;
  const url = new URL(value);
  if (!["http:", "https:"].includes(url.protocol)) throw new Error(`Invalid ${key}`);
  return url.toString();
}

export async function saveSectionAction(formData: FormData) {
  await requireAdmin();
  const key = field(formData, "key", 30);
  const locale = field(formData, "locale", 2);
  if (!["info-general", "historia"].includes(key) || !["es", "en"].includes(locale)) throw new Error("Invalid section");
  const title = field(formData, "title", 200);
  const content = field(formData, "content");
  const base = key === "historia"
    ? { title: "Nuestra historia", content: "La historia de nuestra parroquia se compartirá aquí." }
    : { title: "Información general", content: "Bienvenidos a la Parroquia de la Inmaculada Concepción." };
  const section = await prisma.section.upsert({
    where: { key },
    create: { key, ...(locale === "es" ? { title, content } : base) },
    update: locale === "es" ? { title, content } : {},
  });
  if (locale === "en") await prisma.sectionTranslation.upsert({
    where: { sectionId_locale: { sectionId: section.id, locale } },
    create: { sectionId: section.id, locale, title, content },
    update: { title, content },
  });
  revalidatePath(key === "historia" ? "/historia" : "/");
  revalidatePath(key === "historia" ? "/en/historia" : "/en");
  revalidatePath("/admin/dashboard");
  redirect("/admin/dashboard?saved=section");
}

export async function saveProjectAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  const title = field(formData, "title", 200);
  const description = field(formData, "description");
  const titleEn = String(formData.get("titleEn") ?? "").trim();
  const descriptionEn = String(formData.get("descriptionEn") ?? "").trim();
  if (titleEn.length > 200 || descriptionEn.length > 20000 || Boolean(titleEn) !== Boolean(descriptionEn)) throw new Error("Invalid English translation");
  const status = field(formData, "status", 10);
  if (status !== "ACTUAL" && status !== "FUTURO") throw new Error("Invalid status");
  const imageUrl = optionalUrl(formData, "imageUrl");
  const project = id ? await prisma.project.update({ where: { id }, data: { title, description, status, imageUrl } }) : await prisma.project.create({ data: { title, description, status, imageUrl } });
  if (titleEn && descriptionEn) await prisma.projectTranslation.upsert({
    where: { projectId_locale: { projectId: project.id, locale: "en" } },
    create: { projectId: project.id, locale: "en", title: titleEn, description: descriptionEn },
    update: { title: titleEn, description: descriptionEn },
  });
  if (!titleEn && !descriptionEn) await prisma.projectTranslation.deleteMany({ where: { projectId: project.id, locale: "en" } });
  revalidatePath("/proyectos");
  revalidatePath("/en/proyectos");
  revalidatePath("/admin/dashboard");
  redirect("/admin/dashboard?saved=project");
}

export async function addPhotoAction(formData: FormData) {
  await requireAdmin();
  const url = optionalUrl(formData, "url");
  if (!url) throw new Error("Photo URL required");
  const caption = String(formData.get("caption") ?? "").trim().slice(0, 300) || null;
  const section = await prisma.section.upsert({ where: { key: "historia" }, create: { key: "historia", title: "Nuestra historia", content: "La historia de nuestra parroquia se compartirá aquí." }, update: {} });
  await prisma.photo.create({ data: { url, caption, sectionId: section.id } });
  revalidatePath("/historia");
  revalidatePath("/en/historia");
  revalidatePath("/admin/dashboard");
  redirect("/admin/dashboard?saved=photo");
}

export async function removePhotoAction(formData: FormData) {
  await requireAdmin();
  const id = field(formData, "id", 50);
  await prisma.photo.deleteMany({ where: { id } });
  revalidatePath("/historia");
  revalidatePath("/en/historia");
  revalidatePath("/admin/dashboard");
  redirect("/admin/dashboard?saved=photo");
}

export async function deleteProjectAction(formData: FormData) {
  await requireAdmin();
  const id = field(formData, "id", 50);
  await prisma.project.deleteMany({ where: { id } });
  revalidatePath("/proyectos");
  revalidatePath("/en/proyectos");
  revalidatePath("/admin/dashboard");
  redirect("/admin/dashboard?saved=project");
}

export async function signOutAction() {
  await requireAdmin();
  await signOut({ redirectTo: "/admin/login" });
}
