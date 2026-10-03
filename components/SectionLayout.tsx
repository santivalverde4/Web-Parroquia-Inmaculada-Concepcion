import type { ReactNode } from "react";
import { localizedPath, type Locale } from "@/lib/i18n";
import { BackLink, BrandStripe, Container, Eyebrow } from "@/components/ui";

/** Encabezado y contenedor comunes a todas las paginas internas. */
export function SectionLayout({
  locale,
  title,
  intro,
  children,
}: {
  locale: Locale;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <main id="main-content" className="w-full flex-1">
      {/* Animacion de apertura: ver "Apertura de las paginas internas" en
          globals.css. El panel se abre (section-open), sus hijos entran uno
          tras otro (hero-enter) y la franja se dibuja (stripe-draw). */}
      <Container className="pt-3 sm:pt-5">
        <div className="section-open hero-enter surface-panel px-6 py-14 sm:px-10 lg:px-12 lg:py-20">
          <BrandStripe className="stripe-draw mb-5" />
          <Eyebrow>
            {locale === "es"
              ? "Inmaculada Concepción"
              : "Immaculate Conception"}
          </Eyebrow>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {intro && (
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted sm:text-lg">
              {intro}
            </p>
          )}
        </div>
      </Container>

      {/* El contenido aparece cuando el encabezado ya casi termino. */}
      <Container className="content-enter py-12 lg:py-16">
        <div className="reveal">{children}</div>
        <div className="mt-10">
          <BackLink
            href={localizedPath(locale)}
            label={locale === "es" ? "Volver al inicio" : "Back to home"}
          />
        </div>
      </Container>
    </main>
  );
}
