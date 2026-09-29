import Link from "next/link";
import { getMessages, localizedPath, type Locale } from "@/lib/i18n";
import { Container } from "@/components/ui";

export function Footer({ locale }: { locale: Locale }) {
  const t = getMessages(locale);
  const year = new Date().getFullYear();

  const explore = [
    ["/historia", t.history],
    ["/videos", t.videos],
    ["/noticias", t.news],
    ["/proyectos", t.projects],
  ] as const;

  return (
    <footer className="mt-auto bg-brand-900 text-white">
      <Container className="grid gap-10 py-14 md:grid-cols-3 lg:py-16">
        <div className="md:max-w-xs">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-brand-300">
            {locale === "es" ? "Parroquia" : "Parish"}
          </p>
          <p className="mt-2 font-display text-2xl leading-snug">
            {locale === "es"
              ? "Inmaculada Concepción"
              : "Immaculate Conception"}
          </p>
          <p className="mt-4 text-sm leading-7 text-brand-100">{t.footer}</p>
        </div>

        <nav aria-label={locale === "es" ? "Secciones" : "Sections"}>
          <p className="text-sm font-semibold">
            {locale === "es" ? "Explore la comunidad" : "Explore our community"}
          </p>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm text-brand-100">
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
            {locale === "es" ? "Planee su visita" : "Plan your visit"}
          </p>
          <p className="mt-4 text-sm leading-7 text-brand-100">
            {locale === "es"
              ? "Encuentre el templo y revise cómo llegar."
              : "Find the church and check how to get here."}
          </p>
          <Link
            href={localizedPath(locale, "/mapa")}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/25 px-4 py-2 text-sm font-semibold transition-colors hover:bg-white/10"
          >
            {locale === "es" ? "Cómo llegar" : "Find us"}
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </Container>

      <div className="border-t border-white/15">
        <Container className="flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-brand-200">
          <span>
            &copy; {year} {t.siteName}
          </span>
          <Link
            href="/admin/login"
            className="transition-colors hover:text-white"
          >
            {t.admin}
          </Link>
        </Container>
      </div>
    </footer>
  );
}
