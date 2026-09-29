import Image from "next/image";
import Link from "next/link";
import { getMessages, localizedPath, type Locale } from "@/lib/i18n";
import { getSection } from "@/lib/services/content";
import { PublicShell } from "@/components/PublicShell";
import { ButtonLink, Container, Eyebrow, ImageSlot } from "@/components/ui";

/** Secciones que se destacan desde la portada. */
const destinations = [
  { path: "/historia", key: "history", number: "01" },
  { path: "/noticias", key: "news", number: "02" },
  { path: "/proyectos", key: "projects", number: "03" },
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
            <div className="relative isolate overflow-hidden rounded-panel bg-brand-900">
              <Image
                src="/images/hero-interior.jpg"
                alt=""
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 1216px"
                className="object-cover object-center"
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

              <div className="relative flex min-h-[520px] flex-col items-center justify-center px-6 py-16 text-center sm:min-h-[580px] lg:min-h-[640px]">
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
                  <ButtonLink href={localizedPath(locale, "/historia")}>
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
          <Container className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <Eyebrow>{t.siteName}</Eyebrow>
              <h2 className="mt-4 max-w-xl font-display text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
                {info.title}
              </h2>
              <p className="mt-6 max-w-xl whitespace-pre-wrap text-base leading-8 text-muted">
                {info.content}
              </p>
              {/* Fotografia de la parroquia. Queda vacia hasta elegir la
                  imagen: pasar `src="/images/..."` para llenarla. */}
              <ImageSlot
                ratio="aspect-[16/10]"
                className="mt-8 max-w-xl rounded-card"
                sizes="(max-width: 1024px) 100vw, 576px"
              />
            </div>

            <div className="flex flex-col gap-4">
              <article className="rounded-card border border-line bg-brand-50 p-7">
                <h3 className="font-display text-xl font-bold text-brand-900">
                  {t.mass}
                </h3>
                <p className="mt-2.5 leading-7 text-muted">{t.massText}</p>
              </article>
              <article className="rounded-card border border-line bg-surface p-7">
                <h3 className="font-display text-xl font-bold text-ink">
                  {t.services}
                </h3>
                <p className="mt-2.5 leading-7 text-muted">{t.servicesText}</p>
              </article>
              <article className="rounded-card border border-line bg-surface p-7">
                <h3 className="font-display text-xl font-bold text-ink">
                  {t.map}
                </h3>
                <p className="mt-2.5 leading-7 text-muted">{t.mapIntro}</p>
                <Link
                  href={localizedPath(locale, "/mapa")}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
                >
                  {es ? "Ver ubicación" : "See location"}
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </article>
            </div>
          </Container>
        </section>

        {/* ---------------------------------------------------------------
            Accesos a las secciones. Los espacios de fotografia quedan
            vacios a proposito hasta que se elijan las imagenes.
        ---------------------------------------------------------------- */}
        <section className="pb-16 lg:pb-24">
          <Container>
            <div className="rounded-panel bg-surface px-5 py-12 sm:px-10 lg:px-12 lg:py-16">
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                  <Eyebrow>{es ? "Vida parroquial" : "Parish life"}</Eyebrow>
                  <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                    {es ? "Explore la comunidad" : "Explore our community"}
                  </h2>
                </div>
                <p className="max-w-md leading-7 text-muted">
                  {es
                    ? "Hay muchas maneras de acercarse, participar y mantenerse al tanto."
                    : "There are many ways to connect, take part, and stay informed."}
                </p>
              </div>

              <ul className="mt-10 grid gap-5 md:grid-cols-3">
                {destinations.map(({ path, key, number }) => (
                  <li key={path}>
                    <Link
                      href={localizedPath(locale, path)}
                      className="group flex h-full flex-col overflow-hidden rounded-card bg-white shadow-card transition-shadow hover:shadow-lift"
                    >
                      <ImageSlot
                        ratio="aspect-[4/3]"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="flex flex-1 items-center justify-between gap-4 p-6">
                        <div>
                          <span className="text-xs font-bold tracking-[0.18em] text-brand-400">
                            {number}
                          </span>
                          <h3 className="mt-1.5 font-display text-2xl font-bold text-ink">
                            {t[key]}
                          </h3>
                        </div>
                        <span
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white"
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
