import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMessages } from "@/lib/i18n";
import { isSectionSlug, PublicSectionPage, sectionSlugs } from "@/components/PublicSectionPage";

export const dynamic = "force-dynamic";
export function generateStaticParams() { return sectionSlugs.map((section) => ({ section })); }
export async function generateMetadata({ params }: { params: Promise<{ section: string }> }): Promise<Metadata> {
  const { section } = await params;
  if (!isSectionSlug(section)) return {};
  const t = getMessages("en");
  return { title: ({ historia: t.history, videos: t.videos, noticias: t.news, proyectos: t.projects, mapa: t.map })[section] };
}
export default async function Page({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!isSectionSlug(section)) notFound();
  return <PublicSectionPage locale="en" slug={section} />;
}
