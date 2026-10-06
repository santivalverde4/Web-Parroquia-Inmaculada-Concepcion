import Image from "next/image";
import { SectionLayout } from "@/components/SectionLayout";
import { BrandStripe, Eyebrow } from "@/components/ui";
import { getMessages, type Locale } from "@/lib/i18n";
import { getStoredSection } from "@/lib/services/content";
import {
  artPhoto,
  coverPhoto,
  galleryPhotos,
  historyFacts,
  historyStory,
  historyTimeline,
  historyTitle,
  sacredArt,
  type HistoryPhoto,
} from "@/lib/history";

/**
 * Pagina de Historia, en cuatro bloques:
 * 1. Relato y portada, con las cifras del templo debajo.
 * 2. Linea de tiempo.
 * 3. Arte sacro del nuevo templo.
 * 4. Galeria de la vida de la comunidad.
 *
 * Todas las fotos se muestran en su proporcion real (width/height del
 * archivo), sin recortes: asi nunca se amplian mas de la cuenta.
 */
export async function HistoriaSection({ locale }: { locale: Locale }) {
  const t = getMessages(locale);
  const es = locale === "es";

  // Lo editado en el panel tiene prioridad sobre el texto de lib/history.ts.
  // Si la version en ingles no se completo, se muestra la espanola (la misma
  // regla que el resto del sitio).
  const stored = await getStoredSection("historia");
  const custom = es ? stored.es : (stored.en ?? stored.es);
  const title = custom?.title || historyTitle[locale];
  const story = custom
    ? splitParagraphs(custom.content)
    : historyStory.map((paragraph) => paragraph[locale]);
  // Las fotos agregadas desde el panel van primero en la galeria.
  const photos: HistoryPhoto[] = [
    ...stored.photos.map((photo) => ({
      src: photo.url,
      width: 1600,
      height: 1200,
      alt: {
        es: photo.caption || "Fotografía de la parroquia",
        en: photo.caption || "Parish photo",
      },
      caption: photo.caption
        ? { es: photo.caption, en: photo.caption }
        : undefined,
    })),
    ...galleryPhotos,
  ];

  return (
    <SectionLayout locale={locale} title={title} intro={t.historyIntro}>
      <div className="space-y-6 lg:space-y-8">
        {/* 1. Relato ------------------------------------------------- */}
        <section className="surface-panel p-5 sm:p-8 lg:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-12">
            <div>
              <Eyebrow>{es ? "Nuestras raíces" : "Our roots"}</Eyebrow>
              <h2 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-balance text-ink sm:text-4xl">
                {es
                  ? "De barrio de La Unión a comunidad parroquial"
                  : "From a La Unión neighborhood to a parish community"}
              </h2>
              <div className="mt-6 space-y-5 text-base leading-8 text-muted">
                {story.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
            <Photo
              photo={coverPhoto}
              locale={locale}
              sizes="(max-width: 1024px) 100vw, 520px"
              priority
            />
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-3 lg:mt-10 lg:grid-cols-4 lg:gap-4">
            {historyFacts.map((fact) => (
              // dt va antes que dd en el HTML (asi lo pide <dl>), pero la
              // cifra se ve arriba gracias a flex-col-reverse.
              <div
                key={fact.value}
                className="surface-inset flex flex-col-reverse justify-end gap-1 p-5 sm:p-6"
              >
                <dt className="text-sm leading-6 text-muted">
                  {fact.label[locale]}
                </dt>
                <dd className="font-display text-3xl font-bold tracking-tight text-brand-700 sm:text-4xl">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* 2. Linea de tiempo ---------------------------------------- */}
        <section className="surface-panel p-5 sm:p-8 lg:p-10">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-14">
            {/* En escritorio el titulo acompana al lector mientras baja. */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <BrandStripe className="mb-5" />
              <Eyebrow>{es ? "Nuestro camino" : "Our journey"}</Eyebrow>
              <h2 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
                {es ? "Momentos que nos formaron" : "Moments that shaped us"}
              </h2>
              <p className="mt-4 leading-8 text-muted">
                {es
                  ? "Un recorrido por los hechos que marcaron la vida de la comunidad, desde sus orígenes hasta hoy."
                  : "A walk through the moments that shaped our community, from its origins to today."}
              </p>
            </div>

            {/* La linea es el borde izquierdo de la lista; cada punto se
                centra sobre ella (padding de la lista + medio punto + medio
                borde). */}
            <ol className="border-l-2 border-brand-100 pl-7 sm:pl-9">
              {historyTimeline.map((item, index) => {
                const isLast = index === historyTimeline.length - 1;
                return (
                  <li key={item.title.es} className="relative pb-10 last:pb-0">
                    <span
                      aria-hidden="true"
                      className={`absolute top-1 -left-[calc(1.75rem+9px)] h-4 w-4 rounded-full border-[3px] sm:-left-[calc(2.25rem+9px)] ${
                        isLast
                          ? "border-gold-400 bg-gold-100"
                          : "border-brand-600 bg-white"
                      }`}
                    />
                    <p
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] ${
                        isLast
                          ? "bg-gold-100 text-gold-700"
                          : "bg-brand-50 text-brand-700"
                      }`}
                    >
                      {item.when[locale]}
                    </p>
                    <h3 className="mt-3 font-display text-xl font-bold text-ink sm:text-2xl">
                      {item.title[locale]}
                    </h3>
                    <p className="mt-2 max-w-xl leading-7 text-muted">
                      {item.text[locale]}
                    </p>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* 3. Arte sacro --------------------------------------------- */}
        <section className="surface-panel p-5 sm:p-8 lg:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-12">
            <Photo
              photo={artPhoto}
              locale={locale}
              sizes="(max-width: 1024px) 100vw, 640px"
            />
            <div>
              <Eyebrow>{es ? "Arte sacro" : "Sacred art"}</Eyebrow>
              <h2 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-balance text-ink sm:text-4xl">
                {sacredArt.title[locale]}
              </h2>
              <div className="mt-5 space-y-4 leading-8 text-muted">
                {sacredArt.paragraphs.map((paragraph) => (
                  <p key={paragraph.es}>{paragraph[locale]}</p>
                ))}
              </div>
              <ul className="mt-6 flex flex-wrap gap-2">
                {sacredArt.advocations.map((advocation) => (
                  <li
                    key={advocation.es}
                    className="rounded-full border border-line bg-white px-3.5 py-1.5 text-sm font-medium text-ink"
                  >
                    {advocation[locale]}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 4. Galeria ------------------------------------------------ */}
        <section className="surface-panel p-5 sm:p-8 lg:p-10">
          <Eyebrow>{t.gallery}</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
            {es ? "La vida de nuestra comunidad" : "Life in our community"}
          </h2>
          {/* Columnas tipo mosaico: cada foto conserva su proporcion y las
              verticales conviven con las horizontales sin recortarse. */}
          <ul className="mt-8 columns-1 gap-5 sm:columns-2 lg:columns-3">
            {photos.map((photo, index) => (
              <li
                key={`${index}-${photo.src}`}
                className="mb-5 break-inside-avoid"
              >
                <figure>
                  <Photo
                    photo={photo}
                    locale={locale}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                  />
                  {photo.caption && (
                    <figcaption className="mt-2.5 text-sm font-medium text-muted">
                      {photo.caption[locale]}
                    </figcaption>
                  )}
                </figure>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </SectionLayout>
  );
}

/** Separa un texto en parrafos usando las lineas en blanco. */
function splitParagraphs(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

/**
 * Foto en su proporcion real, con las esquinas de las tarjetas.
 *
 * Las fotos agregadas desde el panel son enlaces externos: se muestran sin
 * pasar por el optimizador de Next (que solo acepta dominios configurados)
 * y con h-auto toman la proporcion real de la imagen al cargar.
 */
function Photo({
  photo,
  locale,
  sizes,
  priority = false,
}: {
  photo: HistoryPhoto;
  locale: Locale;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={photo.src}
      alt={photo.alt[locale]}
      width={photo.width}
      height={photo.height}
      sizes={sizes}
      priority={priority}
      unoptimized={/^https?:\/\//.test(photo.src)}
      className="h-auto w-full rounded-card bg-surface"
    />
  );
}
