import Image from "next/image";
import Link from "next/link";
import { getMessages, localizedPath, type Locale } from "@/lib/i18n";
import { BrandStripe, Container } from "@/components/ui";

/**
 * Pie de pagina.
 *
 * Es un panel redondeado dentro del mismo ancho que el resto del contenido,
 * igual que la portada: asi la pagina abre y cierra con la misma forma.
 */
export function Footer({ locale }: { locale: Locale }) {
  const t = getMessages(locale);
  const es = locale === "es";
  const year = new Date().getFullYear();

  const explore = [
    ["/historia", t.history],
    ["/videos", t.videos],
    ["/noticias", t.news],
    ["/proyectos", t.projects],
  ] as const;

  return (
    <footer className="mt-auto pb-3 pt-4 sm:pb-5">
      <Container>
        <div className="reveal overflow-hidden rounded-panel bg-brand-900 text-white">
          <div className="grid gap-10 px-6 py-12 sm:px-10 md:grid-cols-[1.4fr_1fr_1fr] lg:px-12 lg:py-14">
            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <Image
                src="/images/logo-parroquia.png"
                alt={es ? "Logo de la parroquia" : "Parish logo"}
                width={88}
                height={88}
                className="h-20 w-20 shrink-0"
              />
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-brand-300">
                  {es ? "Parroquia" : "Parish"}
                </p>
                <p className="mt-1.5 font-display text-2xl font-bold leading-tight">
                  {es ? "Inmaculada Concepción" : "Immaculate Conception"}
                </p>
                <p className="mt-2 text-sm leading-6 text-brand-200">
                  {t.footer}
                </p>
                <BrandStripe className="mt-4" />
              </div>
            </div>

            <nav aria-label={es ? "Secciones" : "Sections"}>
              <p className="text-sm font-semibold">
                {es ? "Explore la comunidad" : "Explore our community"}
              </p>
              <ul className="mt-4 flex flex-col gap-2.5 text-sm text-brand-200">
                {explore.map(([path, label]) => (
                  <li key={path}>
                    <Link
                      href={localizedPath(locale, path)}
                      className="transition-colors hover:text-white"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <p className="text-sm font-semibold">
                {es ? "Planee su visita" : "Plan your visit"}
              </p>
              <p className="mt-4 text-sm leading-6 text-brand-200">
                {es
                  ? "Encuentre el templo y revise cómo llegar."
                  : "Find the church and check how to get here."}
              </p>
              <Link
                href={localizedPath(locale, "/mapa")}
                className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-brand-900 transition-colors hover:bg-brand-100"
              >
                {es ? "Cómo llegar" : "Find us"}
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-6 py-5 text-xs text-brand-300 sm:px-10 lg:px-12">
            <span>
              &copy; {year} {t.siteName}
            </span>
            <Link
              href="/admin/login"
              className="transition-colors hover:text-white"
            >
              {t.admin}
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
