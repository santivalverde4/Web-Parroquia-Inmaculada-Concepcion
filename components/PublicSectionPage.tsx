import { PublicShell } from "@/components/PublicShell";
import { SectionLayout } from "@/components/SectionLayout";
import { ButtonLink, EmptyState, Eyebrow, ImageSlot } from "@/components/ui";
import { getMessages, type Locale } from "@/lib/i18n";
import { getSection, getProjects } from "@/lib/services/content";
import { getYouTubeVideos } from "@/lib/services/youtube";
import { getFacebookPosts } from "@/lib/services/facebook";
import { getGoogleMapsLink } from "@/lib/services/maps";
import { env } from "@/lib/env";

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
 * Cada seccion vive en su propio componente mas abajo; este archivo solo
 * decide cual mostrar.
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

/* ------------------------------------------------------------------ */
/* Historia                                                            */
/* ------------------------------------------------------------------ */

async function HistoriaSection({ locale }: { locale: Locale }) {
  const t = getMessages(locale);
  const section = await getSection("historia", locale);

  return (
    <SectionLayout locale={locale} title={section.title} intro={t.historyIntro}>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <article className="rounded-panel border border-line bg-white p-7 shadow-card sm:p-10">
          <p className="whitespace-pre-wrap text-lg leading-9 text-ink">
            {section.content}
          </p>
        </article>

        <aside className="rounded-panel bg-surface p-7 sm:p-8">
          <Eyebrow>{t.gallery}</Eyebrow>
          {section.photos.length > 0 ? (
            <div className="mt-5 grid gap-5">
              {section.photos.map((photo) => (
                <figure key={photo.id}>
                  <ImageSlot
                    src={photo.url}
                    alt={photo.caption || ""}
                    ratio="aspect-[3/2]"
                    className="rounded-card"
                    sizes="(max-width: 1024px) 100vw, 320px"
                  />
                  {photo.caption && (
                    <figcaption className="mt-2.5 text-sm leading-6 text-muted">
                      {photo.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          ) : (
            <p className="mt-4 leading-7 text-muted">{t.noPhotos}</p>
          )}
        </aside>
      </div>
    </SectionLayout>
  );
}

/* ------------------------------------------------------------------ */
/* Videos                                                              */
/* ------------------------------------------------------------------ */

async function VideosSection({ locale }: { locale: Locale }) {
  const t = getMessages(locale);
  const videos = (await getYouTubeVideos()).filter((video) => video.id);

  if (videos.length === 0) {
    return (
      <SectionLayout locale={locale} title={t.videos} intro={t.videosIntro}>
        <EmptyState
          text={
            locale === "es"
              ? "Los videos aparecerán aquí cuando se configure el canal de la parroquia."
              : "Videos will appear here when the parish channel is connected."
          }
        />
      </SectionLayout>
    );
  }

  return (
    <SectionLayout locale={locale} title={t.videos} intro={t.videosIntro}>
      <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <li key={video.id}>
            <a
              href={`https://www.youtube.com/watch?v=${encodeURIComponent(video.id)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-white shadow-card transition-shadow hover:shadow-lift"
            >
              <ImageSlot
                src={video.thumbnail}
                ratio="aspect-video"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="flex flex-1 flex-col p-6">
                <h2 className="font-display text-lg font-bold leading-snug text-ink">
                  {video.title}
                </h2>
                <p className="mt-2 line-clamp-3 text-sm leading-7 text-muted">
                  {video.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 group-hover:text-brand-700">
                  {locale === "es" ? "Ver en YouTube" : "Watch on YouTube"}
                  <span aria-hidden="true">&rarr;</span>
                </span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </SectionLayout>
  );
}

/* ------------------------------------------------------------------ */
/* Noticias                                                            */
/* ------------------------------------------------------------------ */

async function NoticiasSection({ locale }: { locale: Locale }) {
  const t = getMessages(locale);
  const posts = (await getFacebookPosts()).filter(
    (post) => post.id !== "sample",
  );
  const dateFormat = new Intl.DateTimeFormat(
    locale === "es" ? "es-CR" : "en-US",
    { dateStyle: "long" },
  );

  if (posts.length === 0) {
    return (
      <SectionLayout locale={locale} title={t.news} intro={t.newsIntro}>
        <EmptyState
          text={
            locale === "es"
              ? "Pronto compartiremos noticias y actividades de la parroquia."
              : "We will share parish news and events here soon."
          }
        />
      </SectionLayout>
    );
  }

  return (
    <SectionLayout locale={locale} title={t.news} intro={t.newsIntro}>
      <ul className="grid gap-5 md:grid-cols-2">
        {posts.map((post) => (
          <li key={post.id}>
            <article className="flex h-full flex-col rounded-card border border-line bg-white p-7 shadow-card">
              <time
                className="text-sm font-semibold text-brand-600"
                dateTime={post.createdAt}
              >
                {dateFormat.format(new Date(post.createdAt))}
              </time>
              <p className="mt-3.5 whitespace-pre-wrap leading-8 text-ink">
                {post.message}
              </p>
              {post.url && (
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
                >
                  {locale === "es" ? "Ver publicación" : "View post"}
                  <span aria-hidden="true">&rarr;</span>
                </a>
              )}
            </article>
          </li>
        ))}
      </ul>
    </SectionLayout>
  );
}

/* ------------------------------------------------------------------ */
/* Proyectos                                                           */
/* ------------------------------------------------------------------ */

async function ProyectosSection({ locale }: { locale: Locale }) {
  const t = getMessages(locale);
  const projects = await getProjects(locale);

  if (projects.length === 0) {
    return (
      <SectionLayout locale={locale} title={t.projects} intro={t.projectsIntro}>
        <EmptyState
          text={
            locale === "es"
              ? "Pronto compartiremos los proyectos de nuestra comunidad."
              : "We will share our community projects here soon."
          }
        />
      </SectionLayout>
    );
  }

  return (
    <SectionLayout locale={locale} title={t.projects} intro={t.projectsIntro}>
      <ul className="grid gap-5 md:grid-cols-2">
        {projects.map((project) => (
          <li key={project.id}>
            <article className="flex h-full flex-col overflow-hidden rounded-card border border-line bg-white shadow-card">
              <ImageSlot
                src={project.imageUrl}
                ratio="aspect-video"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="flex flex-1 flex-col p-7">
                <span
                  className={`self-start rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                    project.status === "ACTUAL"
                      ? "bg-brand-50 text-brand-700"
                      : "bg-gold-100 text-gold-700"
                  }`}
                >
                  {project.status === "ACTUAL" ? t.current : t.future}
                </span>
                <h2 className="mt-4 font-display text-2xl font-bold text-ink">
                  {project.title}
                </h2>
                <p className="mt-3 whitespace-pre-wrap leading-8 text-muted">
                  {project.description}
                </p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </SectionLayout>
  );
}

/* ------------------------------------------------------------------ */
/* Mapa                                                                */
/* ------------------------------------------------------------------ */

async function MapaSection({ locale }: { locale: Locale }) {
  const t = getMessages(locale);
  const hasLocation = Boolean(env.parishMapQuery);
  const showStaticMap = hasLocation && Boolean(env.googleMapsApiKey);
  const mapLink = getGoogleMapsLink();

  return (
    <SectionLayout locale={locale} title={t.map} intro={t.mapIntro}>
      <div className="grid overflow-hidden rounded-panel border border-line bg-white shadow-card lg:grid-cols-[1.25fr_0.75fr]">
        <ImageSlot
          src={showStaticMap ? "/api/map" : null}
          alt={t.map}
          ratio="aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[420px]"
          sizes="(max-width: 1024px) 100vw, 60vw"
        />

        <div className="flex flex-col justify-center p-8 sm:p-10">
          <Eyebrow>
            {locale === "es" ? "Planee su visita" : "Plan your visit"}
          </Eyebrow>
          <h2 className="mt-3 font-display text-2xl font-bold text-ink sm:text-3xl">
            {t.siteName}
          </h2>
          <p className="mt-4 leading-8 text-muted">
            {hasLocation
              ? env.parishMapQuery
              : locale === "es"
                ? "La dirección y el mapa se confirmarán con la oficina parroquial."
                : "Please confirm the address and map with the parish office."}
          </p>
          {mapLink && (
            <ButtonLink href={mapLink} external className="mt-7 self-start">
              {t.viewOnMaps}
            </ButtonLink>
          )}
        </div>
      </div>
    </SectionLayout>
  );
}
