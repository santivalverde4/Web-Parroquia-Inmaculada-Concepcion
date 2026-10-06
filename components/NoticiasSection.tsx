import type { ReactNode } from "react";
import { SectionLayout } from "@/components/SectionLayout";
import { BrandStripe, ButtonLink, Eyebrow, ImageSlot } from "@/components/ui";
import { getMessages, localizedPath, type Locale } from "@/lib/i18n";
import { formatTime, whatsappHref } from "@/lib/parishInfo";
import { getParishSettings } from "@/lib/services/settings";
import { getFacebookPosts, type ParishPost } from "@/lib/services/facebook";
import {
  dateValue,
  daysUntil,
  googleCalendarUrl,
  newsCategories,
  recentNews,
  todayInCostaRica,
  upcomingEvents,
  weeklyActivities,
  type NewsArticle,
  type NewsCategory,
  type ParishEvent,
} from "@/lib/news";

/**
 * Pagina de Noticias y actividades, en cinco bloques:
 * 1. La proxima celebracion destacada, con foto y cuenta regresiva.
 * 2. Agenda con el resto de actividades que vienen.
 * 3. Noticias recientes (o las publicaciones de Facebook, si estan
 *    configuradas).
 * 4. Lo que pasa cada semana: grupos y horarios fijos.
 * 5. Invitacion a anunciar una actividad por WhatsApp.
 *
 * Todo se arma en el servidor: la pagina no necesita JavaScript.
 */
export async function NoticiasSection({ locale }: { locale: Locale }) {
  const t = getMessages(locale);
  const es = locale === "es";
  const [{ contact }, facebookPosts] = await Promise.all([
    getParishSettings(),
    getFacebookPosts(),
  ]);

  const today = todayInCostaRica();
  const upcoming = upcomingEvents(today);
  // La destacada es la marcada como tal; si ya paso, la mas cercana.
  const featured = upcoming.find((event) => event.featured) ?? upcoming[0];
  const agenda = upcoming.filter((event) => event !== featured);
  // Las publicaciones reales de Facebook reemplazan a las de ejemplo.
  const posts = facebookPosts.filter((post) => post.id !== "sample");
  const address = contact.address[locale];
  const whatsapp = whatsappHref(contact.whatsapp);

  const dates = dateFormatter(locale);
  const calendarUrl = (event: ParishEvent) =>
    googleCalendarUrl(event, locale, address);

  return (
    <SectionLayout locale={locale} title={t.news} intro={t.newsIntro}>
      <div className="space-y-6 lg:space-y-8">
        {/* 1. Destacada ---------------------------------------------- */}
        {featured && (
          <FeaturedEvent
            event={featured}
            locale={locale}
            today={today}
            calendarUrl={calendarUrl(featured)}
          />
        )}

        {/* 2. Agenda ------------------------------------------------- */}
        <section
          aria-labelledby="agenda-title"
          className="surface-panel p-5 sm:p-8 lg:p-10"
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.6fr)] lg:gap-14">
            {/* En escritorio el titulo acompana al lector mientras baja,
                igual que la linea de tiempo de Historia. */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <BrandStripe className="mb-5" />
              <Eyebrow>{es ? "Agenda" : "Calendar"}</Eyebrow>
              <h2
                id="agenda-title"
                className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl"
              >
                {es ? "Próximas actividades" : "Upcoming events"}
              </h2>
              <p className="mt-4 leading-8 text-muted">
                {es
                  ? "Todos son bienvenidos. Agregue a su calendario lo que no se quiere perder."
                  : "Everyone is welcome. Add what you don't want to miss to your calendar."}
              </p>
              <p className="mt-4 text-sm leading-6 text-muted">
                {es
                  ? "Los horarios pueden cambiar; confírmelos con la oficina parroquial."
                  : "Times may change; please confirm with the parish office."}
              </p>
            </div>

            {agenda.length > 0 ? (
              <ol className="space-y-3">
                {agenda.map((event) => (
                  <li key={event.id}>
                    <AgendaItem
                      event={event}
                      locale={locale}
                      today={today}
                      calendarUrl={calendarUrl(event)}
                    />
                  </li>
                ))}
              </ol>
            ) : (
              <p className="surface-inset self-start p-6 leading-7 text-muted">
                {es
                  ? "Pronto publicaremos las próximas actividades de la parroquia."
                  : "We will post upcoming parish events here soon."}
              </p>
            )}
          </div>
        </section>

        {/* 3. Noticias ----------------------------------------------- */}
        <section
          aria-labelledby="news-title"
          className="surface-panel p-5 sm:p-8 lg:p-10"
        >
          <Eyebrow>{es ? "Noticias recientes" : "Recent news"}</Eyebrow>
          <h2
            id="news-title"
            className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl"
          >
            {posts.length > 0
              ? es
                ? "Desde nuestro Facebook"
                : "From our Facebook page"
              : es
                ? "Lo que ha pasado en la parroquia"
                : "What's been happening"}
          </h2>
          <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {posts.length > 0
              ? posts.map((post) => (
                  <li key={post.id}>
                    <FacebookCard post={post} locale={locale} dates={dates} />
                  </li>
                ))
              : recentNews().map((article) => (
                  <li key={article.id}>
                    <NewsCard article={article} locale={locale} dates={dates} />
                  </li>
                ))}
          </ul>
        </section>

        {/* 4. Cada semana -------------------------------------------- */}
        <section
          aria-labelledby="weekly-title"
          className="surface-panel p-5 sm:p-8 lg:p-10"
        >
          <Eyebrow>{es ? "Cada semana" : "Every week"}</Eyebrow>
          <h2
            id="weekly-title"
            className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl"
          >
            {es ? "Encuentre su grupo" : "Find your group"}
          </h2>
          <p className="mt-4 max-w-2xl leading-8 text-muted">
            {es
              ? "Además de las misas, cada semana hay espacios para orar, aprender y servir. Puede llegar sin inscribirse."
              : "Besides Mass, every week there are ways to pray, learn, and serve. No sign-up needed: just come."}
          </p>
          <ul className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {weeklyActivities.map((activity) => {
              const { clock, period } = formatTime(activity.time, locale);
              return (
                <li
                  key={activity.id}
                  className="surface-inset flex flex-col p-4 sm:p-6"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-700">
                    {activity.day[locale]}
                  </p>
                  <p className="mt-2 whitespace-nowrap font-display text-2xl font-bold tabular-nums text-ink">
                    {clock}
                    <span className="ml-1 text-sm font-semibold text-muted">
                      {period}
                    </span>
                  </p>
                  <h3 className="mt-4 font-display text-lg font-bold text-ink">
                    {activity.name[locale]}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-muted">
                    {activity.detail[locale]}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>

        {/* 5. Anunciar una actividad --------------------------------- */}
        <section className="surface-panel flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:p-10">
          <div>
            <BrandStripe className="mb-4" />
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              {es
                ? "¿Su grupo organiza una actividad?"
                : "Is your group planning an event?"}
            </h2>
            <p className="mt-2 max-w-xl leading-7 text-muted">
              {es
                ? "Escríbanos con la fecha, la hora y una breve descripción, y la publicamos aquí."
                : "Send us the date, time, and a short description, and we'll post it here."}
            </p>
          </div>
          {whatsapp ? (
            <ButtonLink
              href={whatsapp}
              external
              className="shrink-0 self-start lg:self-auto"
            >
              {es ? "Escribir por WhatsApp" : "Message us on WhatsApp"}
              <span aria-hidden="true">&rarr;</span>
            </ButtonLink>
          ) : (
            <ButtonLink
              href={localizedPath(locale, "/mapa")}
              className="shrink-0 self-start lg:self-auto"
            >
              {es ? "Visitar la oficina" : "Visit the office"}
              <span aria-hidden="true">&rarr;</span>
            </ButtonLink>
          )}
        </section>
      </div>
    </SectionLayout>
  );
}

/* ------------------------------------------------------------------ */
/* Bloques                                                             */
/* ------------------------------------------------------------------ */

function FeaturedEvent({
  event,
  locale,
  today,
  calendarUrl,
}: {
  event: ParishEvent;
  locale: Locale;
  today: string;
  calendarUrl: string;
}) {
  const es = locale === "es";
  const dates = dateFormatter(locale);
  const date = dateValue(event.date);

  return (
    <section
      aria-labelledby="featured-title"
      className="surface-panel grid overflow-hidden lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]"
    >
      <div className="relative lg:min-h-[480px]">
        <ImageSlot
          src={event.image}
          focus={event.focus}
          ratio="aspect-[16/10] lg:absolute lg:inset-0 lg:aspect-auto"
          sizes="(max-width: 1024px) 100vw, 640px"
          priority
        />
        {/* Hoja de calendario sobre la foto: la fecha se lee primero. */}
        <time
          dateTime={event.date}
          className="absolute left-4 top-4 z-[2] flex w-20 flex-col items-center rounded-card bg-white/95 py-2.5 text-center shadow-card sm:left-6 sm:top-6 sm:w-24"
        >
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-brand-700">
            {dates.month(date)}
          </span>
          <span className="font-display text-4xl font-extrabold leading-none tabular-nums text-ink sm:text-5xl">
            {dates.day(date)}
          </span>
          <span className="mt-1 text-[0.7rem] font-semibold text-muted">
            {dates.weekday(date)}
          </span>
        </time>
      </div>

      <div className="flex flex-col justify-center p-6 sm:p-10">
        <div className="flex flex-wrap items-center gap-2">
          <Eyebrow>{es ? "Próxima celebración" : "Coming up"}</Eyebrow>
          <Countdown days={daysUntil(event.date, today)} locale={locale} />
        </div>
        <h2
          id="featured-title"
          className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-balance text-ink sm:text-4xl"
        >
          {event.title[locale]}
        </h2>
        <p className="mt-4 leading-8 text-muted">{event.summary[locale]}</p>

        <dl className="mt-6 space-y-3 border-t border-line pt-6">
          <Detail icon="calendar" label={es ? "Fecha" : "Date"}>
            {dates.long(date)}
          </Detail>
          <Detail icon="clock" label={es ? "Hora" : "Time"}>
            {timeRange(event, locale)}
          </Detail>
          <Detail icon="pin" label={es ? "Lugar" : "Place"}>
            {event.place[locale]}
          </Detail>
        </dl>

        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={calendarUrl} external>
            <CalendarIcon />
            {es ? "Agregar a mi calendario" : "Add to my calendar"}
          </ButtonLink>
          <ButtonLink href={localizedPath(locale, "/mapa")} variant="secondary">
            {es ? "Cómo llegar" : "Find us"}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

function AgendaItem({
  event,
  locale,
  today,
  calendarUrl,
}: {
  event: ParishEvent;
  locale: Locale;
  today: string;
  calendarUrl: string;
}) {
  const es = locale === "es";
  const dates = dateFormatter(locale);
  const date = dateValue(event.date);

  return (
    // En celular la descripcion pasa debajo y usa todo el ancho; desde sm
    // queda en la columna de texto, al lado de la hoja de calendario.
    <article className="surface-inset grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-3 p-4 sm:gap-x-6 sm:p-6">
      {/* Hoja de calendario: mes arriba y dia grande, como en la pared. */}
      <time
        dateTime={event.date}
        className="flex h-fit w-16 flex-col items-center rounded-xl border border-line bg-white py-2 text-center sm:row-span-2 sm:w-20 sm:py-3"
      >
        <span className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-brand-700 sm:text-xs">
          {dates.month(date)}
        </span>
        <span className="font-display text-3xl font-extrabold leading-none tabular-nums text-ink sm:text-4xl">
          {dates.day(date)}
        </span>
      </time>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <CategoryChip category={event.category} locale={locale} />
          <Countdown
            days={daysUntil(event.date, today)}
            locale={locale}
            quiet
          />
        </div>
        <h3 className="mt-2.5 font-display text-xl font-bold leading-snug text-ink">
          {event.title[locale]}
        </h3>
        {/* Cada dato en un trozo que no se parte: asi "6:00 p. m." nunca
            queda con el "p. m." en la linea de abajo. */}
        <p className="mt-1.5 flex flex-wrap gap-x-1.5 text-sm font-medium leading-6 text-ink/80">
          <span className="whitespace-nowrap">
            {dates.weekday(date)}
            <span aria-hidden="true"> ·</span>
          </span>
          <span className="whitespace-nowrap">
            {timeRange(event, locale)}
            <span aria-hidden="true"> ·</span>
          </span>
          <span>{event.place[locale]}</span>
        </p>
      </div>

      <div className="col-span-2 sm:col-span-1 sm:col-start-2">
        <p className="leading-7 text-muted">{event.summary[locale]}</p>
        <a
          href={calendarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
        >
          <CalendarIcon />
          {es ? "Agregar al calendario" : "Add to calendar"}
          <span className="sr-only">: {event.title[locale]}</span>
        </a>
      </div>
    </article>
  );
}

function NewsCard({
  article,
  locale,
  dates,
}: {
  article: NewsArticle;
  locale: Locale;
  dates: ReturnType<typeof dateFormatter>;
}) {
  return (
    <article className="surface-card flex h-full flex-col overflow-hidden">
      <ImageSlot
        src={article.image}
        focus={article.focus}
        ratio="aspect-[3/2]"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 380px"
      />
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <CategoryChip category={article.category} locale={locale} />
          <time
            dateTime={article.date}
            className="text-sm font-semibold text-muted"
          >
            {dates.withYear(dateValue(article.date))}
          </time>
        </div>
        <h3 className="mt-3 font-display text-xl font-bold leading-snug text-ink">
          {article.title[locale]}
        </h3>
        <p className="mt-2 leading-7 text-muted">{article.excerpt[locale]}</p>
      </div>
    </article>
  );
}

function FacebookCard({
  post,
  locale,
  dates,
}: {
  post: ParishPost;
  locale: Locale;
  dates: ReturnType<typeof dateFormatter>;
}) {
  // Una fecha invalida no debe tumbar la pagina: simplemente no se muestra.
  const date = new Date(post.createdAt);
  const validDate = !Number.isNaN(date.getTime());
  return (
    <article className="surface-card flex h-full flex-col p-6">
      {validDate && (
        <time
          dateTime={date.toISOString()}
          className="text-sm font-semibold text-brand-600"
        >
          {dates.longFromInstant(date)}
        </time>
      )}
      <p className="mt-3 line-clamp-6 whitespace-pre-wrap leading-7 text-ink">
        {post.message}
      </p>
      {post.url && (
        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          {locale === "es" ? "Ver publicación" : "View post"}
          <span aria-hidden="true">&rarr;</span>
        </a>
      )}
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Piezas pequenas                                                     */
/* ------------------------------------------------------------------ */

function CategoryChip({
  category,
  locale,
}: {
  category: NewsCategory;
  locale: Locale;
}) {
  const { tone } = newsCategories[category];
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${
        tone === "gold"
          ? "bg-gold-100 text-gold-700"
          : "bg-brand-50 text-brand-700"
      }`}
    >
      {newsCategories[category][locale]}
    </span>
  );
}

/** "Hoy", "Mañana" o "Faltan 12 días". */
function Countdown({
  days,
  locale,
  quiet = false,
}: {
  days: number;
  locale: Locale;
  quiet?: boolean;
}) {
  const es = locale === "es";
  const soon = days <= 1;
  const text =
    days === 0
      ? es
        ? "Hoy"
        : "Today"
      : days === 1
        ? es
          ? "Mañana"
          : "Tomorrow"
        : es
          ? `Faltan ${days} días`
          : `In ${days} days`;

  if (quiet && !soon) {
    return <span className="text-xs font-semibold text-muted">{text}</span>;
  }
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
        soon ? "bg-gold-400 text-ink" : "bg-brand-50 text-brand-700"
      }`}
    >
      {text}
    </span>
  );
}

const detailIcons = {
  calendar: (
    <>
      <rect x="4" y="5.5" width="16" height="14" rx="2.5" />
      <path d="M8 3.5v4M16 3.5v4M4 10h16" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  pin: (
    <>
      <path d="M12 20s6-5.2 6-10a6 6 0 0 0-12 0c0 4.8 6 10 6 10Z" />
      <circle cx="12" cy="10" r="2.2" />
    </>
  ),
} as const;

function Detail({
  icon,
  label,
  children,
}: {
  icon: keyof typeof detailIcons;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-[18px] w-[18px]"
        >
          {detailIcons[icon]}
        </svg>
      </span>
      <dt className="sr-only">{label}</dt>
      <dd className="font-medium text-ink">{children}</dd>
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <rect x="4" y="5.5" width="16" height="14" rx="2.5" />
      <path d="M8 3.5v4M16 3.5v4M4 10h16M12 13v4M10 15h4" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Formato                                                             */
/* ------------------------------------------------------------------ */

/** "9:00 a. m. – 12:00 p. m." (o solo la hora de inicio). */
function timeRange(event: ParishEvent, locale: Locale) {
  const format = (time: string) => {
    const { clock, period } = formatTime(time, locale);
    return `${clock} ${period}`;
  };
  return event.end
    ? `${format(event.start)} – ${format(event.end)}`
    : format(event.start);
}

/**
 * Formatos de fecha. Las fechas de los datos son de mediodia UTC (ver
 * dateValue), por eso se formatean en UTC; las de Facebook son instantes
 * reales y se formatean en la hora de Costa Rica.
 */
function dateFormatter(locale: Locale) {
  const tag = locale === "es" ? "es-CR" : "en-US";
  const make = (options: Intl.DateTimeFormatOptions, timeZone = "UTC") =>
    new Intl.DateTimeFormat(tag, { timeZone, ...options });
  const month = make({ month: "short" });
  const day = make({ day: "numeric" });
  const weekday = make({ weekday: "long" });
  const long = make({ weekday: "long", day: "numeric", month: "long" });
  const withYear = make({ dateStyle: "long" });
  const instant = make({ dateStyle: "long" }, "America/Costa_Rica");
  // En espanol los dias van en minuscula ("martes"); al inicio de una
  // linea se ven mejor con mayuscula. CSS capitalize no sirve: pondria
  // mayuscula a cada palabra ("Martes, 8 De Diciembre").
  const upperFirst = (text: string) =>
    text.charAt(0).toUpperCase() + text.slice(1);
  return {
    // "dic." -> "dic": el punto sobra en la hoja de calendario.
    month: (date: Date) => month.format(date).replace(".", ""),
    day: (date: Date) => day.format(date),
    weekday: (date: Date) => upperFirst(weekday.format(date)),
    long: (date: Date) => upperFirst(long.format(date)),
    withYear: (date: Date) => withYear.format(date),
    longFromInstant: (date: Date) => instant.format(date),
  };
}
