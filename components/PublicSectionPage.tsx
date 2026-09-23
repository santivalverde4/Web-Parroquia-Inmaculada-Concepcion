import Image from "next/image";
import Link from "next/link";
import { PublicShell } from "@/components/PublicShell";
import { SectionLayout } from "@/components/SectionLayout";
import { getMessages, localizedPath, type Locale } from "@/lib/i18n";
import { getSection, getProjects } from "@/lib/services/content";
import { getYouTubeVideos } from "@/lib/services/youtube";
import { getFacebookPosts } from "@/lib/services/facebook";
import { getGoogleMapsLink } from "@/lib/services/maps";
import { env } from "@/lib/env";

export const sectionSlugs = ["historia", "videos", "noticias", "proyectos", "mapa"] as const;
export type SectionSlug = (typeof sectionSlugs)[number];
export function isSectionSlug(value: string): value is SectionSlug {
  return sectionSlugs.includes(value as SectionSlug);
}

export async function PublicSectionPage({ locale, slug }: { locale: Locale; slug: SectionSlug }) {
  const t = getMessages(locale);
  if (slug === "historia") {
    const section = await getSection("historia", locale);
    return <PublicShell locale={locale}><SectionLayout locale={locale} title={section.title} intro={t.historyIntro}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
        <div className="rounded-2xl border border-line bg-white p-7 sm:p-10"><p className="whitespace-pre-wrap text-lg leading-9 text-ink">{section.content}</p></div>
        <aside className="rounded-2xl bg-accent-soft p-7 sm:p-9"><p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-accent">{t.gallery}</p>{section.photos.length ? <div className="grid gap-4">{section.photos.map((photo) => <figure key={photo.id}><Image src={photo.url} alt={photo.caption || t.siteName} width={600} height={400} unoptimized className="w-full rounded-xl object-cover" />{photo.caption && <figcaption className="mt-2 text-sm text-muted">{photo.caption}</figcaption>}</figure>)}</div> : <p className="leading-7 text-muted">{t.noPhotos}</p>}</aside>
      </div>
    </SectionLayout></PublicShell>;
  }
  if (slug === "videos") {
    const videos = (await getYouTubeVideos()).filter((video) => video.id);
    return <PublicShell locale={locale}><SectionLayout locale={locale} title={t.videos} intro={t.videosIntro}>
      {videos.length ? <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{videos.map((video) => <a key={video.id} href={`https://www.youtube.com/watch?v=${encodeURIComponent(video.id)}`} target="_blank" rel="noopener noreferrer" className="overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-lg">{video.thumbnail && <Image src={video.thumbnail} alt="" width={480} height={270} unoptimized className="aspect-video w-full object-cover" />}<div className="p-6"><h2 className="text-xl font-semibold text-ink">{video.title}</h2><p className="mt-2 line-clamp-3 leading-7 text-muted">{video.description}</p><span className="mt-5 inline-block text-sm font-semibold text-accent">{locale === "es" ? "Ver en YouTube" : "Watch on YouTube"}</span></div></a>)}</div> : <EmptyState text={locale === "es" ? "Los videos aparecerán aquí cuando se configure el canal de la parroquia." : "Videos will appear here when the parish channel is connected."} />}
    </SectionLayout></PublicShell>;
  }
  if (slug === "noticias") {
    const posts = (await getFacebookPosts()).filter((post) => post.id !== "sample");
    return <PublicShell locale={locale}><SectionLayout locale={locale} title={t.news} intro={t.newsIntro}>
      {posts.length ? <div className="grid gap-5 md:grid-cols-2">{posts.map((post) => <article key={post.id} className="rounded-2xl border border-line bg-white p-7"><time className="text-sm font-medium text-accent" dateTime={post.createdAt}>{new Intl.DateTimeFormat(locale === "es" ? "es-CR" : "en-US", { dateStyle: "long" }).format(new Date(post.createdAt))}</time><p className="mt-4 whitespace-pre-wrap leading-8 text-ink">{post.message}</p>{post.url && <a href={post.url} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block text-sm font-semibold text-accent hover:underline">{locale === "es" ? "Ver publicación" : "View post"}</a>}</article>)}</div> : <EmptyState text={locale === "es" ? "Pronto compartiremos noticias y actividades de la parroquia." : "We will share parish news and events here soon."} />}
    </SectionLayout></PublicShell>;
  }
  if (slug === "proyectos") {
    const projects = await getProjects(locale);
    return <PublicShell locale={locale}><SectionLayout locale={locale} title={t.projects} intro={t.projectsIntro}>
      {projects.length ? <div className="grid gap-5 md:grid-cols-2">{projects.map((project) => <article key={project.id} className="overflow-hidden rounded-2xl border border-line bg-white">{project.imageUrl && <Image src={project.imageUrl} alt="" width={800} height={450} unoptimized className="aspect-video w-full object-cover" />}<div className="p-7"><span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">{project.status === "ACTUAL" ? t.current : t.future}</span><h2 className="mt-4 text-2xl font-semibold text-ink">{project.title}</h2><p className="mt-3 whitespace-pre-wrap leading-8 text-muted">{project.description}</p></div></article>)}</div> : <EmptyState text={locale === "es" ? "Pronto compartiremos los proyectos de nuestra comunidad." : "We will share our community projects here soon."} />}
    </SectionLayout></PublicShell>;
  }
  const hasLocation = Boolean(env.parishMapQuery);
  const mapLink = getGoogleMapsLink();
  return <PublicShell locale={locale}><SectionLayout locale={locale} title={t.map} intro={t.mapIntro}>
    <div className="grid overflow-hidden rounded-2xl border border-line bg-white lg:grid-cols-[1.3fr_.7fr]">
      <div className="flex min-h-80 items-center justify-center bg-[#e4e9e1]">{hasLocation && env.googleMapsApiKey ? <Image src="/api/map" alt={t.map} width={900} height={500} unoptimized className="h-full w-full object-cover" /> : <div className="text-center"><p className="text-sm text-muted">{t.siteName}</p></div>}</div>
      <div className="flex flex-col justify-center p-8 sm:p-10"><p className="text-xs font-bold uppercase tracking-[.2em] text-accent">{locale === "es" ? "Planee su visita" : "Plan your visit"}</p><h2 className="mt-3 font-serif text-3xl text-ink">{t.siteName}</h2><p className="mt-5 leading-8 text-muted">{hasLocation ? env.parishMapQuery : locale === "es" ? "La dirección y el mapa se confirmarán con la oficina parroquial." : "Please confirm the address and map with the parish office."}</p>{mapLink && <a href={mapLink} target="_blank" rel="noopener noreferrer" className="mt-7 self-start rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white hover:opacity-90">{t.viewOnMaps}</a>}</div>
    </div>
    <Link href={localizedPath(locale)} className="mt-8 inline-block text-sm font-semibold text-accent hover:underline">{locale === "es" ? "Volver al inicio" : "Back to home"}</Link>
  </SectionLayout></PublicShell>;
}

function EmptyState({ text }: { text: string }) {
  return <div className="rounded-2xl border border-dashed border-line bg-white px-8 py-16 text-center"><p className="mx-auto max-w-md leading-8 text-muted">{text}</p></div>;
}
