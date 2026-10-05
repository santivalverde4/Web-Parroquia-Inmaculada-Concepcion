import Image from "next/image";
import { SectionLayout } from "@/components/SectionLayout";
import { PlayBadge, YouTubePlayer } from "@/components/YouTubePlayer";
import { BrandStripe, ButtonLink, Eyebrow } from "@/components/ui";
import { getMessages, type Locale } from "@/lib/i18n";
import {
  channelUrl,
  getYouTubeVideos,
  uploadsEmbedUrl,
} from "@/lib/services/youtube";

/**
 * Pagina de Videos:
 * 1. Video destacado (el mas reciente), reproducible en la misma pagina.
 * 2. Grilla con los seis anteriores, que abren en YouTube.
 * 3. Franja final hacia el canal.
 *
 * Si la API no responde, el destacado pasa a ser el reproductor de la
 * lista de subidas del canal y la grilla no se muestra.
 */
export async function VideosSection({ locale }: { locale: Locale }) {
  const t = getMessages(locale);
  const es = locale === "es";
  const [latest, ...previous] = await getYouTubeVideos(7);
  const dateFormat = new Intl.DateTimeFormat(es ? "es-CR" : "en-US", {
    dateStyle: "long",
  });
  // Una fecha invalida no debe tumbar la pagina: simplemente no se muestra.
  const formatDate = (iso: string) => {
    const date = new Date(iso);
    return Number.isNaN(date.getTime()) ? null : dateFormat.format(date);
  };
  const youtubeLabel = es ? "Ver en YouTube" : "Watch on YouTube";

  return (
    <SectionLayout locale={locale} title={t.videos} intro={t.videosIntro}>
      <div className="space-y-6 lg:space-y-8">
        {/* 1. Destacado ---------------------------------------------- */}
        <section className="surface-panel p-5 sm:p-8 lg:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-10">
            {latest ? (
              <YouTubePlayer
                id={latest.id}
                title={latest.title}
                poster={latest.poster}
                playLabel={es ? "Reproducir" : "Play"}
              />
            ) : (
              <div className="aspect-video overflow-hidden rounded-card bg-brand-950">
                <iframe
                  src={uploadsEmbedUrl}
                  title={es ? "Videos de la parroquia" : "Parish videos"}
                  loading="lazy"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            )}

            <div>
              <Eyebrow>
                {latest
                  ? es
                    ? "Video más reciente"
                    : "Latest video"
                  : es
                    ? "Nuestro canal"
                    : "Our channel"}
              </Eyebrow>
              <h2 className="mt-4 font-display text-2xl font-bold leading-tight tracking-tight text-balance text-ink sm:text-3xl">
                {latest
                  ? latest.title
                  : es
                    ? "Celebraciones y mensajes de la comunidad"
                    : "Celebrations and messages from our community"}
              </h2>
              {latest && formatDate(latest.publishedAt) && (
                <time
                  dateTime={latest.publishedAt}
                  className="mt-3 block text-sm font-semibold text-brand-600"
                >
                  {formatDate(latest.publishedAt)}
                </time>
              )}
              <p className="mt-4 line-clamp-4 whitespace-pre-line leading-7 text-muted">
                {latest?.description ||
                  (es
                    ? "Revive las misas, celebraciones y mensajes de nuestra parroquia. El reproductor muestra siempre lo último que publicamos."
                    : "Watch Masses, celebrations, and messages from our parish. The player always starts with our newest upload.")}
              </p>
              <ButtonLink
                href={
                  latest
                    ? `https://www.youtube.com/watch?v=${encodeURIComponent(latest.id)}`
                    : channelUrl
                }
                external
                variant="secondary"
                className="mt-6"
              >
                {latest
                  ? youtubeLabel
                  : es
                    ? "Visitar el canal"
                    : "Visit the channel"}
                <span aria-hidden="true">&rarr;</span>
              </ButtonLink>
            </div>
          </div>
        </section>

        {/* 2. Anteriores --------------------------------------------- */}
        {previous.length > 0 && (
          <section className="surface-panel p-5 sm:p-8 lg:p-10">
            <Eyebrow>{es ? "Videos anteriores" : "Previous videos"}</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
              {es
                ? "Vuelva a vivir cada celebración"
                : "Relive every celebration"}
            </h2>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {previous.map((video) => (
                <li key={video.id}>
                  <a
                    href={`https://www.youtube.com/watch?v=${encodeURIComponent(video.id)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group surface-card surface-card--interactive flex h-full flex-col overflow-hidden"
                  >
                    <span className="relative block aspect-video overflow-hidden bg-surface">
                      {video.thumbnail && (
                        <Image
                          src={video.thumbnail}
                          alt=""
                          fill
                          unoptimized
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      )}
                      <span className="absolute inset-0 grid place-items-center bg-brand-900/10 transition-colors group-hover:bg-brand-900/25">
                        <PlayBadge />
                      </span>
                    </span>
                    <span className="flex flex-1 flex-col p-5 sm:p-6">
                      {formatDate(video.publishedAt) && (
                        <time
                          dateTime={video.publishedAt}
                          className="text-xs font-bold uppercase tracking-[0.12em] text-brand-700"
                        >
                          {formatDate(video.publishedAt)}
                        </time>
                      )}
                      <span className="mt-2 line-clamp-2 font-display text-lg font-bold leading-snug text-ink">
                        {video.title}
                      </span>
                      <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-brand-600 group-hover:text-brand-700">
                        {youtubeLabel}
                        <span aria-hidden="true">&rarr;</span>
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 3. Canal -------------------------------------------------- */}
        <section className="surface-panel flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:p-10">
          <div>
            <BrandStripe className="mb-4" />
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              {es
                ? "Todos nuestros videos, en un solo lugar"
                : "All our videos in one place"}
            </h2>
            <p className="mt-2 max-w-xl leading-7 text-muted">
              {es
                ? "Suscríbase al canal de la parroquia para no perderse ninguna celebración."
                : "Subscribe to the parish channel so you never miss a celebration."}
            </p>
          </div>
          <ButtonLink
            href={channelUrl}
            external
            className="shrink-0 self-start lg:self-auto"
          >
            {es ? "Ir al canal de YouTube" : "Go to the YouTube channel"}
            <span aria-hidden="true">&rarr;</span>
          </ButtonLink>
        </section>
      </div>
    </SectionLayout>
  );
}
