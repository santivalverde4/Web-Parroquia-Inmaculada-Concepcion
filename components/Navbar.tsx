"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getMessages, localizedPath, type Locale } from "@/lib/i18n";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { Container } from "@/components/ui";

/** Enlaces del menu. "Ubicación" va aparte, como boton destacado. */
const items = [
  ["", "home"],
  ["/historia", "history"],
  ["/videos", "videos"],
  ["/noticias", "news"],
  ["/proyectos", "projects"],
] as const;

export function Navbar({ locale }: { locale: Locale }) {
  const t = getMessages(locale);
  const pathname = usePathname();

  // El menu movil se guarda como "la ruta en la que se abrio", no como un
  // booleano. Asi, al cambiar de pagina, `open` vuelve a ser false solo por
  // comparacion, sin necesidad de un efecto que sincronice el estado.
  // Esto tambien cubre los botones de atras y adelante del navegador.
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const open = openedAt === pathname;

  const closeMenu = () => setOpenedAt(null);
  const toggleMenu = () => setOpenedAt(open ? null : pathname);

  // Cerrar con Escape: lo espera cualquiera que navegue con teclado.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenedAt(null);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const isActive = (path: string) => pathname === localizedPath(locale, path);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/85 backdrop-blur-md">
      <Container className="flex items-center justify-between gap-4 py-3.5">
        <Link
          href={localizedPath(locale)}
          className="flex shrink-0 flex-col leading-none"
          aria-label={t.siteName}
        >
          <span className="text-[0.6rem] font-bold uppercase tracking-[0.22em] text-brand-600">
            {locale === "es" ? "Parroquia" : "Parish"}
          </span>
          <span className="mt-1 font-display text-lg font-bold tracking-tight text-ink sm:text-xl">
            {locale === "es"
              ? "Inmaculada Concepción"
              : "Immaculate Conception"}
          </span>
        </Link>

        {/* Navegación de escritorio */}
        <nav
          aria-label={
            locale === "es" ? "Navegación principal" : "Main navigation"
          }
          className="hidden items-center gap-1 xl:flex"
        >
          {items.map(([path, label]) => (
            <Link
              key={path}
              href={localizedPath(locale, path)}
              aria-current={isActive(path) ? "page" : undefined}
              className={`whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                isActive(path)
                  ? "bg-brand-50 text-brand-700"
                  : "text-muted hover:bg-surface hover:text-ink"
              }`}
            >
              {t[label]}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <LanguageSwitch locale={locale} />
          <Link
            href={localizedPath(locale, "/mapa")}
            className="whitespace-nowrap rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            {locale === "es" ? "Cómo llegar" : "Find us"}
          </Link>
        </div>

        {/* Navegación móvil */}
        <div className="flex items-center gap-2 xl:hidden">
          <LanguageSwitch locale={locale} />
          <button
            type="button"
            onClick={toggleMenu}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink transition-colors hover:bg-surface"
          >
            <span className="sr-only">
              {open
                ? locale === "es"
                  ? "Cerrar menú"
                  : "Close menu"
                : locale === "es"
                  ? "Abrir menú"
                  : "Open menu"}
            </span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              {open ? (
                <>
                  <path d="m6 6 12 12" />
                  <path d="m18 6-12 12" />
                </>
              ) : (
                <>
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </Container>

      {open && (
        <nav
          id="mobile-nav"
          aria-label={
            locale === "es" ? "Navegación móvil" : "Mobile navigation"
          }
          className="border-t border-line bg-white xl:hidden"
        >
          <Container className="flex flex-col gap-1 py-4">
            {items.map(([path, label]) => (
              <Link
                key={path}
                href={localizedPath(locale, path)}
                onClick={closeMenu}
                aria-current={isActive(path) ? "page" : undefined}
                className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive(path)
                    ? "bg-brand-50 text-brand-700"
                    : "text-ink hover:bg-surface"
                }`}
              >
                {t[label]}
              </Link>
            ))}
            <Link
              href={localizedPath(locale, "/mapa")}
              onClick={closeMenu}
              className="mt-2 rounded-xl bg-brand-600 px-4 py-3 text-center text-sm font-semibold text-white"
            >
              {locale === "es" ? "Cómo llegar" : "Find us"}
            </Link>
          </Container>
        </nav>
      )}
    </header>
  );
}
