import type { ReactNode } from "react";
import { SectionLayout } from "@/components/SectionLayout";
import { BrandStripe, ButtonLink, Eyebrow } from "@/components/ui";
import { getMessages, type Locale } from "@/lib/i18n";
import { formatTime, phoneHref, whatsappHref } from "@/lib/parishInfo";
import { googleDirectionsUrl, mapEmbedUrl, wazeUrl } from "@/lib/services/maps";
import { getParishSettings } from "@/lib/services/settings";

/**
 * Pagina de Ubicacion, en dos bloques:
 * 1. Mapa interactivo junto a la direccion y los botones para llegar con
 *    Google Maps o Waze (en Costa Rica, Waze es tan comun como Maps).
 * 2. Lo que conviene saber antes de venir: misas, oficina y contacto.
 *
 * Horarios, direccion y contacto salen del panel de administracion (los
 * mismos datos de la portada y el pie de pagina), asi no hay dos versiones
 * que mantener.
 */
export async function MapaSection({ locale }: { locale: Locale }) {
  const t = getMessages(locale);
  const es = locale === "es";
  const { contact, massSchedule, officeHours } = await getParishSettings();
  const address =
    contact.address[locale] || "Concepción, La Unión, Cartago, Costa Rica";

  const phone = phoneHref(contact.phone);
  const whatsapp = whatsappHref(contact.whatsapp);

  return (
    <SectionLayout locale={locale} title={t.map} intro={t.mapIntro}>
      <div className="space-y-6 lg:space-y-8">
        {/* 1. Mapa y como llegar ------------------------------------- */}
        <section
          aria-labelledby="visit-title"
          className="surface-panel grid overflow-hidden lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]"
        >
          <div className="relative aspect-[4/3] bg-surface sm:aspect-[16/10] lg:aspect-auto lg:min-h-[520px]">
            <iframe
              src={mapEmbedUrl(locale)}
              title={es ? `Mapa: ${t.siteName}` : `Map: ${t.siteName}`}
              loading="lazy"
              allowFullScreen
              // Google pide este valor para que una key restringida por
              // dominio reconozca el sitio.
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-10">
            <Eyebrow>{es ? "Planee su visita" : "Plan your visit"}</Eyebrow>
            <h2
              id="visit-title"
              className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-balance text-ink sm:text-4xl"
            >
              {t.siteName}
            </h2>

            <p className="mt-5 flex items-start gap-3 leading-7 text-ink">
              <Icon name="pin" />
              <span>{address}</span>
            </p>

            {/* Botones del mismo ancho: uno al lado del otro en tablet y
                apilados en la columna angosta de escritorio. */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <ButtonLink href={googleDirectionsUrl()} external>
                <Icon name="route" small />
                {es
                  ? "Cómo llegar con Google Maps"
                  : "Directions in Google Maps"}
              </ButtonLink>
              <ButtonLink href={wazeUrl()} external variant="secondary">
                <Icon name="car" small />
                {es ? "Abrir en Waze" : "Open in Waze"}
              </ButtonLink>
            </div>
            <p className="mt-4 text-sm leading-6 text-muted">
              {es
                ? "En el celular se abre la aplicación con la ruta desde donde usted esté."
                : "On your phone, the app opens with directions from where you are."}
            </p>
          </div>
        </section>

        {/* 2. Antes de venir ----------------------------------------- */}
        <section
          aria-labelledby="before-title"
          className="surface-panel p-5 sm:p-8 lg:p-10"
        >
          <BrandStripe className="mb-5" />
          <Eyebrow>{es ? "Antes de venir" : "Before you come"}</Eyebrow>
          <h2
            id="before-title"
            className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl"
          >
            {es ? "Información para su visita" : "Visitor information"}
          </h2>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            <InfoBlock icon="clock" title={t.mass}>
              {massSchedule.length > 0 ? (
                <ul className="space-y-3">
                  {massSchedule.map(({ day, times }, index) => (
                    <li key={`${index}-${day.es}`}>
                      <p className="text-sm font-semibold text-ink">
                        {day[locale]}
                      </p>
                      <p className="text-sm leading-6 text-muted">
                        {times
                          .map((time) => {
                            const { clock, period } = formatTime(time, locale);
                            return `${clock} ${period}`;
                          })
                          .join(" · ")}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm leading-6 text-muted">
                  {es
                    ? "Los horarios se publicarán pronto."
                    : "The schedule will be published soon."}
                </p>
              )}
            </InfoBlock>

            <InfoBlock
              icon="office"
              title={es ? "Oficina parroquial" : "Parish office"}
            >
              <p className="text-sm leading-6 text-muted">
                {officeHours[locale] ||
                  (es
                    ? "Consulte el horario por teléfono o WhatsApp."
                    : "Please call or message us for office hours.")}
              </p>
              <p className="mt-3 text-sm leading-6 text-muted">
                {es
                  ? "Ahí se coordinan bautizos, matrimonios, constancias e intenciones de misa."
                  : "Baptisms, weddings, certificates, and Mass intentions are arranged there."}
              </p>
            </InfoBlock>

            <InfoBlock icon="phone" title={t.contact}>
              <ul className="space-y-3 text-sm">
                {phone && (
                  <ContactLink
                    label={es ? "Teléfono" : "Phone"}
                    href={phone}
                    value={contact.phone}
                  />
                )}
                {whatsapp && (
                  <ContactLink
                    label="WhatsApp"
                    href={whatsapp}
                    value={contact.whatsapp}
                    external
                  />
                )}
                {contact.email && (
                  <ContactLink
                    label={es ? "Correo" : "Email"}
                    href={`mailto:${contact.email}`}
                    value={contact.email}
                  />
                )}
                {!phone && !whatsapp && !contact.email && (
                  <li className="leading-6 text-muted">
                    {es
                      ? "Pronto publicaremos los medios de contacto."
                      : "Contact details will be posted soon."}
                  </li>
                )}
              </ul>
            </InfoBlock>
          </div>
        </section>
      </div>
    </SectionLayout>
  );
}

/* ------------------------------------------------------------------ */
/* Piezas                                                              */
/* ------------------------------------------------------------------ */

function InfoBlock({
  icon,
  title,
  children,
}: {
  icon: IconName;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="surface-inset flex flex-col p-6">
      <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-brand-600 shadow-card">
        <Icon name={icon} />
      </span>
      <h3 className="mt-4 font-display text-xl font-bold text-ink">{title}</h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function ContactLink({
  label,
  href,
  value,
  external = false,
}: {
  label: string;
  href: string;
  value: string;
  external?: boolean;
}) {
  return (
    <li>
      <span className="block text-xs font-bold uppercase tracking-[0.12em] text-brand-700">
        {label}
      </span>
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="break-all font-semibold text-ink underline decoration-line underline-offset-4 transition-colors hover:text-brand-700 hover:decoration-brand-300"
      >
        {value}
      </a>
    </li>
  );
}

const icons = {
  pin: (
    <>
      <path d="M12 20s6-5.2 6-10a6 6 0 0 0-12 0c0 4.8 6 10 6 10Z" />
      <circle cx="12" cy="10" r="2.2" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  office: (
    <>
      <rect x="4" y="9" width="16" height="11" rx="1.5" />
      <path d="M9 9V6.5A1.5 1.5 0 0 1 10.5 5h3A1.5 1.5 0 0 1 15 6.5V9M4 14h16" />
    </>
  ),
  phone: (
    <path d="M6.5 4h3l1.5 4-2 1.5a10 10 0 0 0 5.5 5.5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16 16 0 0 1 4.5 6.2 2 2 0 0 1 6.5 4Z" />
  ),
  route: (
    <>
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="6" r="2" />
      <path d="M8 18h7.5a3.5 3.5 0 0 0 0-7h-7a3.5 3.5 0 0 1 0-7H16" />
    </>
  ),
  car: (
    <>
      <path d="M5 16V11.5L7 7h10l2 4.5V16" />
      <path d="M4 16h16v2.5H4z" />
      <circle cx="8" cy="13" r="0.8" />
      <circle cx="16" cy="13" r="0.8" />
    </>
  ),
} as const;

type IconName = keyof typeof icons;

function Icon({ name, small = false }: { name: IconName; small?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${small ? "h-4 w-4" : "h-5 w-5"} ${
        name === "pin" && !small ? "mt-1 text-brand-600" : ""
      }`}
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  );
}
