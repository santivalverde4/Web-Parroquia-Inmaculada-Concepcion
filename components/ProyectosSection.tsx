import type { ReactNode } from "react";
import { SectionLayout } from "@/components/SectionLayout";
import { BrandStripe, ButtonLink, Eyebrow, ImageSlot } from "@/components/ui";
import { getMessages, localizedPath, type Locale } from "@/lib/i18n";
import { whatsappHref } from "@/lib/parishInfo";
import { getExampleProjects } from "@/lib/projects";
import { getProjects, type PublicProject } from "@/lib/services/content";
import { getParishSettings } from "@/lib/services/settings";

/**
 * Pagina de Proyectos, en cuatro bloques:
 * 1. Proyecto destacado: el mas reciente de los que estan en marcha.
 * 2. Los demas proyectos en marcha.
 * 3. Los proyectos para el futuro.
 * 4. Como ayudar (orar, aportar, servir), con salida a WhatsApp.
 *
 * Usa solo los campos que se editan en el panel (titulo, descripcion,
 * estado e imagen opcional), asi se ve igual de bien con los proyectos de
 * ejemplo que con los reales. Un bloque sin proyectos no se muestra.
 */
export async function ProyectosSection({ locale }: { locale: Locale }) {
  const t = getMessages(locale);
  const es = locale === "es";
  const [saved, { contact }] = await Promise.all([
    getProjects(locale),
    getParishSettings(),
  ]);
  // Mientras no haya proyectos guardados se muestran los de ejemplo.
  const projects = saved.length > 0 ? saved : getExampleProjects(locale);

  const current = projects.filter((project) => project.status === "ACTUAL");
  const future = projects.filter((project) => project.status === "FUTURO");
  // Los proyectos llegan del mas nuevo al mas viejo: el destacado es el
  // primero en marcha (o el primero de todos, si no hay ninguno en marcha).
  const featured = current[0] ?? projects[0];
  const otherCurrent = current.filter((project) => project !== featured);
  const otherFuture = future.filter((project) => project !== featured);
  const whatsapp = whatsappHref(contact.whatsapp);

  return (
    <SectionLayout locale={locale} title={t.projects} intro={t.projectsIntro}>
      <div className="space-y-6 lg:space-y-8">
        {/* 1. Destacado ---------------------------------------------- */}
        {featured && <FeaturedProject project={featured} locale={locale} />}

        {/* 2. En marcha ---------------------------------------------- */}
        {otherCurrent.length > 0 && (
          <ProjectGroup
            id="en-marcha"
            eyebrow={es ? "En marcha" : "In progress"}
            title={
              es ? "Lo que estamos construyendo" : "What we are building now"
            }
            text={
              es
                ? "Iniciativas que ya avanzan gracias al trabajo y la generosidad de la comunidad."
                : "Initiatives already moving forward thanks to the work and generosity of our community."
            }
          >
            {otherCurrent.map((project) => (
              <ProjectCard key={project.id} project={project} locale={locale} />
            ))}
          </ProjectGroup>
        )}

        {/* 3. Futuro ------------------------------------------------- */}
        {otherFuture.length > 0 && (
          <ProjectGroup
            id="proximamente"
            eyebrow={es ? "Próximamente" : "Coming soon"}
            title={es ? "Lo que soñamos juntos" : "What we dream of together"}
            text={
              es
                ? "Proyectos que la comunidad quiere emprender. Sus ideas y su apoyo ayudan a que empiecen pronto."
                : "Projects our community hopes to start. Your ideas and support help them get going sooner."
            }
          >
            {otherFuture.map((project) => (
              <ProjectCard key={project.id} project={project} locale={locale} />
            ))}
          </ProjectGroup>
        )}

        {/* 4. Como ayudar -------------------------------------------- */}
        <section
          id="como-ayudar"
          aria-labelledby="help-title"
          // scroll-mt: al llegar desde el boton del destacado, el titulo no
          // queda escondido debajo de la barra de navegacion fija.
          className="surface-panel scroll-mt-28 p-5 sm:p-8 lg:p-10"
        >
          <div className="max-w-2xl">
            <BrandStripe className="mb-5" />
            <Eyebrow>{es ? "Cómo ayudar" : "How to help"}</Eyebrow>
            <h2
              id="help-title"
              className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl"
            >
              {es
                ? "Cada aporte cuenta, grande o pequeño"
                : "Every contribution counts, big or small"}
            </h2>
            <p className="mt-4 leading-8 text-muted">
              {es
                ? "Hay muchas formas de sumarse. Elija la que mejor se acomode a su tiempo y a sus posibilidades."
                : "There are many ways to take part. Choose the one that best fits your time and means."}
            </p>
          </div>

          <ul className="mt-8 grid gap-3 md:grid-cols-3">
            <HelpOption
              icon="pray"
              title={es ? "Orar" : "Pray"}
              text={
                es
                  ? "Encomiende los proyectos de la parroquia en su oración personal y en las misas."
                  : "Keep our parish projects in your personal prayer and at Mass."
              }
            />
            <HelpOption
              icon="give"
              title={es ? "Aportar" : "Give"}
              text={
                es
                  ? "Puede colaborar en la ofrenda de las misas o directamente en la oficina parroquial."
                  : "You can give during the Mass offering or directly at the parish office."
              }
            />
            <HelpOption
              icon="serve"
              title={es ? "Servir" : "Serve"}
              text={
                es
                  ? "Su oficio o profesión puede hacer mucho: construcción, cocina, diseño, enseñanza…"
                  : "Your trade or profession can do a lot: building, cooking, design, teaching…"
              }
            />
          </ul>

          <div className="mt-8 flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl leading-7 text-ink">
              {es
                ? "¿Quiere colaborar con un proyecto en particular? Escríbanos y le contamos cómo."
                : "Want to support a specific project? Message us and we'll tell you how."}
            </p>
            {whatsapp ? (
              <ButtonLink
                href={whatsapp}
                external
                className="shrink-0 self-start sm:self-auto"
              >
                {es ? "Escribir por WhatsApp" : "Message us on WhatsApp"}
                <span aria-hidden="true">&rarr;</span>
              </ButtonLink>
            ) : (
              <ButtonLink
                href={localizedPath(locale, "/mapa")}
                className="shrink-0 self-start sm:self-auto"
              >
                {es ? "Visitar la oficina" : "Visit the office"}
                <span aria-hidden="true">&rarr;</span>
              </ButtonLink>
            )}
          </div>
        </section>
      </div>
    </SectionLayout>
  );
}

/* ------------------------------------------------------------------ */
/* Bloques                                                             */
/* ------------------------------------------------------------------ */

function FeaturedProject({
  project,
  locale,
}: {
  project: PublicProject;
  locale: Locale;
}) {
  const es = locale === "es";
  // Sin foto, el panel no muestra un recuadro vacio enorme: el texto
  // ocupa todo el ancho.
  const hasImage = Boolean(project.imageUrl);

  return (
    <section
      aria-labelledby="featured-project-title"
      className={`surface-panel grid overflow-hidden ${
        hasImage ? "lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]" : ""
      }`}
    >
      {hasImage && (
        <div className="relative lg:min-h-[460px]">
          <ImageSlot
            src={project.imageUrl}
            ratio="aspect-[16/10] lg:absolute lg:inset-0 lg:aspect-auto"
            sizes="(max-width: 1024px) 100vw, 640px"
            priority
          />
        </div>
      )}

      <div
        className={`flex flex-col justify-center p-6 sm:p-10 ${
          hasImage ? "" : "lg:p-12"
        }`}
      >
        <div className="flex flex-wrap items-center gap-2">
          <Eyebrow>{es ? "Proyecto principal" : "Main project"}</Eyebrow>
          <StatusChip status={project.status} locale={locale} />
        </div>
        <h2
          id="featured-project-title"
          className="mt-4 max-w-3xl font-display text-3xl font-bold leading-tight tracking-tight text-balance text-ink sm:text-4xl"
        >
          {project.title}
        </h2>
        <p className="mt-4 max-w-3xl whitespace-pre-wrap leading-8 text-muted">
          {project.description}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="#como-ayudar">
            {es ? "Quiero ayudar" : "I want to help"}
            <span aria-hidden="true">&darr;</span>
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

function ProjectGroup({
  id,
  eyebrow,
  title,
  text,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  text: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-labelledby={`${id}-title`}
      className="surface-panel p-5 sm:p-8 lg:p-10"
    >
      <div className="max-w-2xl">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2
          id={`${id}-title`}
          className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl"
        >
          {title}
        </h2>
        <p className="mt-4 leading-8 text-muted">{text}</p>
      </div>
      <ul className="mt-8 grid gap-5 md:grid-cols-2">{children}</ul>
    </section>
  );
}

function ProjectCard({
  project,
  locale,
}: {
  project: PublicProject;
  locale: Locale;
}) {
  return (
    <li>
      <article className="surface-card flex h-full flex-col overflow-hidden sm:flex-row">
        {/* Sin foto la tarjeta es solo texto, en vez de un hueco gris. */}
        {project.imageUrl && (
          <ImageSlot
            src={project.imageUrl}
            ratio="aspect-[16/10] sm:aspect-auto sm:w-2/5 sm:min-h-[220px]"
            className="shrink-0"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 40vw, 240px"
          />
        )}
        <div className="flex flex-1 flex-col p-6">
          <StatusChip status={project.status} locale={locale} />
          <h3 className="mt-3 font-display text-xl font-bold leading-snug text-ink">
            {project.title}
          </h3>
          <p className="mt-2 whitespace-pre-wrap leading-7 text-muted">
            {project.description}
          </p>
        </div>
      </article>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Piezas pequenas                                                     */
/* ------------------------------------------------------------------ */

/** Mismos colores que en el panel: azul en marcha, dorado a futuro. */
function StatusChip({
  status,
  locale,
}: {
  status: PublicProject["status"];
  locale: Locale;
}) {
  const es = locale === "es";
  const current = status === "ACTUAL";
  return (
    <span
      className={`inline-flex items-center gap-1.5 self-start rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${
        current ? "bg-brand-50 text-brand-700" : "bg-gold-100 text-gold-700"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          current ? "bg-brand-600" : "bg-gold-500"
        }`}
        aria-hidden="true"
      />
      {current
        ? es
          ? "En marcha"
          : "In progress"
        : es
          ? "Próximamente"
          : "Coming soon"}
    </span>
  );
}

const helpIcons = {
  // Vela encendida.
  pray: (
    <>
      <path d="M12 2.5c1.6 1.9 2.2 3.1 2.2 4.1a2.2 2.2 0 0 1-4.4 0c0-1 .6-2.2 2.2-4.1Z" />
      <rect x="8.5" y="11" width="7" height="10.5" rx="1.5" />
    </>
  ),
  give: (
    <path d="M12 20.5s-8-4.9-8-11A4.5 4.5 0 0 1 12 6.6a4.5 4.5 0 0 1 8 2.9c0 6.1-8 11-8 11Z" />
  ),
  // Dos personas: servir en comunidad.
  serve: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20.5a6 6 0 0 1 12 0" />
      <circle cx="17" cy="9" r="2.6" />
      <path d="M15.6 14.4A4.8 4.8 0 0 1 21 19" />
    </>
  ),
} as const;

function HelpOption({
  icon,
  title,
  text,
}: {
  icon: keyof typeof helpIcons;
  title: string;
  text: string;
}) {
  return (
    <li className="surface-inset flex flex-col p-6">
      <span
        className="grid h-12 w-12 place-items-center rounded-full bg-white text-brand-600 shadow-card"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
        >
          {helpIcons[icon]}
        </svg>
      </span>
      <h3 className="mt-4 font-display text-xl font-bold text-ink">{title}</h3>
      <p className="mt-1.5 leading-7 text-muted">{text}</p>
    </li>
  );
}
