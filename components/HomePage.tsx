import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { getMessages, localizedPath, type Locale } from "@/lib/i18n";
import { getSection } from "@/lib/services/content";
import { PublicShell } from "@/components/PublicShell";
import {
  BrandStripe,
  ButtonLink,
  Container,
  Eyebrow,
  ImageSlot,
} from "@/components/ui";

/** Secciones que se destacan desde la portada. */
const destinations = [
  {
    path: "/historia",
    key: "history",
    number: "01",
    image: "/images/exterior-2.jpg",
    focus: "75% 30%", // la cruz de la torre
  },
  {
    path: "/noticias",
    key: "news",
    number: "02",
    image: "/images/evento-1.jpg",
    focus: "50% 45%", // el director y sus manos
  },
  {
    path: "/proyectos",
    key: "projects",
    number: "03",
    image: "/images/random-1.jpg",
    focus: "50% 50%",
  },
] as const;

export async function HomePage({ locale }: { locale: Locale }) {
  const t = getMessages(locale);
  const info = await getSection("info-general", locale);
  const es = locale === "es";

  return (
    <PublicShell locale={locale}>
      <main id="main-content" className="flex-1">
        {/* ---------------------------------------------------------------
            Portada: una fotografia dentro de un marco redondeado, con el
            titular grande y centrado encima. El marco usa el mismo ancho
            maximo que el resto del contenido, asi en pantallas anchas no
            se estira de borde a borde.
        ---------------------------------------------------------------- */}
        <section className="pt-3 sm:pt-5">
          <Container>
            <div className="hero-frame relative isolate overflow-hidden rounded-panel bg-brand-900">
              <Image
                src="/images/hero-interior.jpg"
                alt=""
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 1216px"
                className="hero-photo object-cover object-center"
              />
              {/* Capa oscura pareja: el titulo va al centro, asi que la foto
                  se oscurece por igual en vez de solo abajo. */}
              <div
                className="absolute inset-0 bg-brand-900/55"
                aria-hidden="true"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-brand-900/50 via-transparent to-brand-900/30"
                aria-hidden="true"
              />

              <div className="hero-copy hero-enter relative flex min-h-[520px] flex-col items-center justify-center px-6 py-16 text-center sm:min-h-[580px] lg:min-h-[640px]">
                <BrandStripe className="mb-6 justify-center" />
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-100">
                  {es
                    ? "Bienvenidos a nuestra comunidad"
                    : "Welcome to our community"}
                </p>
                <h1 className="mt-5 max-w-4xl font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-balance text-white sm:text-6xl lg:text-8xl">
                  {es
                    ? "Un lugar para encontrarnos en la fe."
                    : "A place to gather in faith."}
                </h1>
                <p className="mt-6 max-w-xl text-base leading-8 text-brand-50 sm:text-lg">
                  {t.intro}
                </p>
                <div className="mt-9 flex flex-wrap justify-center gap-3">
                  <ButtonLink
                    href={localizedPath(locale, "/historia")}
                    variant="accent"
                  >
                    {es ? "Conozca la parroquia" : "Discover the parish"}
                  </ButtonLink>
                  <ButtonLink
                    href={localizedPath(locale, "/mapa")}
                    variant="light"
                  >
                    {es ? "Cómo llegar" : "Find us"}
                  </ButtonLink>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ---------------------------------------------------------------
            Presentacion: el texto editable desde administracion, con los
            datos practicos en tarjetas al costado.
        ---------------------------------------------------------------- */}
        <section className="py-16 lg:py-24">
          <Container>
            {/* Un solo panel con dos columnas. La grilla estira ambas
                columnas a la misma altura; a la izquierda la foto ocupa el
                espacio sobrante (flex-1) y a la derecha las tres tarjetas se
                reparten el alto en partes iguales (grid-rows-3). Por eso
                las dos columnas empiezan y terminan alineadas. */}
            <div className="reveal surface-panel grid gap-8 p-5 sm:p-8 lg:grid-cols-2 lg:gap-10 lg:p-10">
              <div className="flex flex-col">
                <Eyebrow>{t.siteName}</Eyebrow>
                <h2 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
                  {info.title}
                </h2>
                <p className="mt-5 whitespace-pre-wrap text-base leading-8 text-muted">
                  {info.content}
                </p>
                <ImageSlot
                  src="/images/interior-1.jpg"
                  alt={
                    es
                      ? "Interior del templo durante una celebración con coro y banda"
                      : "Inside the church during a celebration with choir and band"
                  }
                  ratio="aspect-[16/10] lg:aspect-auto"
                  className="mt-8 rounded-card lg:min-h-56 lg:flex-1"
                  sizes="(max-width: 1024px) 100vw, 560px"
                />
              </div>

              <div className="grid gap-4 lg:grid-rows-3">
                <InfoCard
                  icon="clock"
                  title={t.mass}
                  text={t.massText}
                  highlighted
                />
                <InfoCard
                  icon="heart"
                  title={t.services}
                  text={t.servicesText}
                />
                <InfoCard icon="pin" title={t.map} text={t.mapIntro}>
                  <Link
                    href={localizedPath(locale, "/mapa")}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
                  >
                    {es ? "Ver ubicación" : "See location"}
                    <span aria-hidden="true">&rarr;</span>
                  </Link>
                </InfoCard>
              </div>
            </div>
          </Container>
        </section>

        {/* ---------------------------------------------------------------
            Accesos a las secciones. Los espacios de fotografia quedan
            vacios a proposito hasta que se elijan las imagenes.
        ---------------------------------------------------------------- */}
        <section className="pb-16 lg:pb-24">
          <Container>
            <div className="reveal surface-panel px-5 py-12 sm:px-10 lg:px-12 lg:py-16">
              {/* Encabezado centrado: repite la simetria de las tres
                  tarjetas de abajo y la composicion de la portada. La
                  descripcion es corta, asi que centrada se sigue leyendo
                  bien; text-balance reparte las lineas de forma pareja. */}
              <div className="text-center">
                <BrandStripe className="mb-5 justify-center" />
                <Eyebrow>{es ? "Vida parroquial" : "Parish life"}</Eyebrow>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                  {es ? "Explore la comunidad" : "Explore our community"}
                </h2>
                <p className="mx-auto mt-4 max-w-md text-balance leading-7 text-muted">
                  {es
                    ? "Hay muchas maneras de acercarse, participar y mantenerse al tanto."
                    : "There are many ways to connect, take part, and stay informed."}
                </p>
              </div>

              <ul className="mt-10 grid gap-5 md:grid-cols-3">
                {destinations.map(({ path, key, number, image, focus }) => (
                  <li key={path}>
                    <Link
                      href={localizedPath(locale, path)}
                      className="group surface-card surface-card--interactive flex h-full flex-col overflow-hidden"
                    >
                      <ImageSlot
                        src={image}
                        focus={focus}
                        zoomOnHover
                        ratio="aspect-[4/3]"
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
                      <div className="flex flex-1 items-center justify-between gap-4 p-6">
                        <div>
                          <span className="text-xs font-bold tracking-[0.18em] text-brand-600">
                            {number}
                          </span>
                          <h3 className="mt-1.5 font-display text-2xl font-bold text-ink">
                            {t[key]}
                          </h3>
                        </div>
                        <span
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface text-brand-600 transition-all duration-300 group-hover:translate-x-1 group-hover:bg-gold-400 group-hover:text-ink"
                          aria-hidden="true"
                        >
                          &rarr;
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>
      </main>
    </PublicShell>
  );
}

/** Iconos de linea de las tarjetas de informacion (trazo de 24px). */
const infoIcons = {
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  heart: (
    <path d="M12 19s-7-4.35-7-9.5A3.9 3.9 0 0 1 12 7a3.9 3.9 0 0 1 7 2.5C19 14.65 12 19 12 19Z" />
  ),
  pin: (
    <>
      <path d="M12 20s6-5.2 6-10a6 6 0 0 0-12 0c0 4.8 6 10 6 10Z" />
      <circle cx="12" cy="10" r="2.2" />
    </>
  ),
} as const;

/** Tarjeta de dato practico dentro del panel de informacion general. */
function InfoCard({
  icon,
  title,
  text,
  highlighted = false,
  children,
}: {
  icon: keyof typeof infoIcons;
  title: string;
  text: string;
  highlighted?: boolean;
  children?: ReactNode;
}) {
  return (
    <article
      className={`surface-inset flex gap-5 p-6 sm:p-7 ${
        highlighted ? "surface-inset--strong" : ""
      }`}
    >
      <span
        className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${
          highlighted ? "bg-gold-400 text-ink" : "bg-white text-brand-600"
        }`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          {infoIcons[icon]}
        </svg>
      </span>
      <div className="flex flex-col justify-center">
        <h3 className="font-display text-xl font-bold text-ink">{title}</h3>
        <p className="mt-1.5 leading-7 text-muted">{text}</p>
        {children}
      </div>
    </article>
  );
}
