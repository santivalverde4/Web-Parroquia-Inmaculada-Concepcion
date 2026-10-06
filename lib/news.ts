import type { Locale } from "@/lib/i18n";

/**
 * Contenido de la pagina de Noticias y actividades.
 *
 * PLACEHOLDER: todo este archivo es contenido de ejemplo para la demo.
 * Las fechas, horas y lugares se deben confirmar con la parroquia. Lo unico
 * real es la fiesta patronal del 8 de diciembre.
 *
 * Las actividades que ya pasaron se ocultan solas (ver upcomingEvents), asi
 * la agenda nunca muestra algo vencido aunque nadie la actualice.
 */

type Localized = Record<Locale, string>;

/* ------------------------------------------------------------------ */
/* Categorias                                                          */
/* ------------------------------------------------------------------ */

/**
 * Las celebraciones van en dorado y todo lo demas en azul: con dos tonos
 * basta para distinguir de un vistazo, y la pagina no se llena de colores.
 */
export const newsCategories = {
  celebracion: { es: "Celebración", en: "Celebration", tone: "gold" },
  formacion: { es: "Formación", en: "Formation", tone: "brand" },
  comunidad: { es: "Comunidad", en: "Community", tone: "brand" },
  oracion: { es: "Oración", en: "Prayer", tone: "brand" },
} as const;

export type NewsCategory = keyof typeof newsCategories;

/* ------------------------------------------------------------------ */
/* Actividades (agenda)                                                */
/* ------------------------------------------------------------------ */

export type ParishEvent = {
  id: string;
  /** Fecha local de Costa Rica, "AAAA-MM-DD". */
  date: string;
  /** Hora de inicio y fin, "HH:MM" en 24 horas. */
  start: string;
  end?: string;
  category: NewsCategory;
  title: Localized;
  summary: Localized;
  place: Localized;
  /** Solo la actividad destacada lleva foto. */
  image?: string;
  focus?: string;
  featured?: boolean;
};

const parishChurch: Localized = {
  es: "Templo parroquial",
  en: "Parish church",
};

export const parishEvents: ParishEvent[] = [
  {
    id: "rosario-misionero",
    date: "2026-10-17",
    start: "18:00",
    end: "19:00",
    category: "oracion",
    title: {
      es: "Rosario misionero en familia",
      en: "Family missionary rosary",
    },
    summary: {
      es: "En el mes de las misiones rezamos juntos por la Iglesia en los cinco continentes. Cada familia puede traer su rosario.",
      en: "During mission month we pray together for the Church on all five continents. Families are welcome to bring their own rosary.",
    },
    place: parishChurch,
  },
  {
    id: "retiro-confirmacion",
    date: "2026-10-31",
    start: "08:00",
    end: "15:00",
    category: "formacion",
    title: {
      es: "Retiro para jóvenes de confirmación",
      en: "Confirmation youth retreat",
    },
    summary: {
      es: "Una jornada de reflexión, música y convivencia para quienes se preparan para la confirmación. Incluye almuerzo.",
      en: "A day of reflection, music, and fellowship for young people preparing for Confirmation. Lunch is included.",
    },
    place: parishChurch,
  },
  {
    id: "fieles-difuntos",
    date: "2026-11-02",
    start: "18:00",
    end: "19:00",
    category: "celebracion",
    title: {
      es: "Misa por los fieles difuntos",
      en: "Mass for All Souls",
    },
    summary: {
      es: "Recordamos a nuestros seres queridos. Puede traer una fotografía o escribir su nombre en el libro de intenciones.",
      en: "We remember our loved ones. You may bring a photo or write their name in the book of intentions.",
    },
    place: parishChurch,
  },
  {
    id: "feria-pro-templo",
    date: "2026-11-14",
    start: "09:00",
    end: "16:00",
    category: "comunidad",
    title: {
      es: "Feria pro templo",
      en: "Church building fair",
    },
    summary: {
      es: "Comidas típicas, rifas y actividades para niños. Lo recaudado se destina a los acabados del nuevo templo.",
      en: "Traditional food, raffles, and activities for children. Proceeds go to finishing the new church.",
    },
    place: {
      es: "Explanada frente al templo",
      en: "Plaza in front of the church",
    },
  },
  {
    id: "inicio-adviento",
    date: "2026-11-29",
    start: "18:00",
    end: "19:30",
    category: "celebracion",
    title: {
      es: "Inicio del Adviento y de la novena a la Inmaculada",
      en: "First Sunday of Advent and novena to the Immaculate Conception",
    },
    summary: {
      es: "Bendición de las coronas de Adviento. Desde este día y hasta el 7 de diciembre rezamos la novena después de la misa.",
      en: "Blessing of Advent wreaths. From this day until December 7 we pray the novena after Mass.",
    },
    place: parishChurch,
  },
  {
    id: "fiesta-patronal",
    date: "2026-12-08",
    start: "09:00",
    end: "12:00",
    category: "celebracion",
    featured: true,
    image: "/images/historia/iconos-marianos.jpg",
    focus: "50% 40%",
    title: {
      es: "Fiesta patronal de la Inmaculada Concepción",
      en: "Feast of the Immaculate Conception, our patroness",
    },
    summary: {
      es: "El día más importante del año para nuestra comunidad. Misa solemne, procesión con la imagen de la Virgen por las calles del barrio y un compartir para todas las familias.",
      en: "The most important day of the year for our community. Solemn Mass, a procession with the image of Our Lady through the neighborhood, and a shared meal for every family.",
    },
    place: parishChurch,
  },
  {
    id: "nochebuena",
    date: "2026-12-24",
    start: "20:00",
    end: "21:30",
    category: "celebracion",
    title: { es: "Misa de Nochebuena", en: "Christmas Eve Mass" },
    summary: {
      es: "Celebramos juntos el nacimiento de Jesús. El coro parroquial acompaña la misa con villancicos.",
      en: "Together we celebrate the birth of Jesus. The parish choir leads the Mass with carols.",
    },
    place: parishChurch,
  },
];

/* ------------------------------------------------------------------ */
/* Noticias recientes                                                  */
/* ------------------------------------------------------------------ */

export type NewsArticle = {
  id: string;
  date: string;
  category: NewsCategory;
  title: Localized;
  excerpt: Localized;
  image: string;
  focus?: string;
};

export const newsArticles: NewsArticle[] = [
  {
    id: "primeras-comuniones",
    date: "2026-09-27",
    category: "celebracion",
    image: "/images/historia/misa-familias.jpg",
    focus: "50% 40%",
    title: {
      es: "Celebramos las primeras comuniones",
      en: "We celebrated First Communions",
    },
    excerpt: {
      es: "Cuarenta niños recibieron por primera vez a Jesús en la Eucaristía, acompañados por sus familias y catequistas. Gracias a todos los que hicieron posible esta fiesta.",
      en: "Forty children received Jesus in the Eucharist for the first time, joined by their families and catechists. Thank you to everyone who made this celebration possible.",
    },
  },
  {
    id: "ministerio-musica",
    date: "2026-09-13",
    category: "comunidad",
    image: "/images/historia/ministerio-musica.jpg",
    focus: "45% 35%",
    title: {
      es: "El ministerio de música busca nuevas voces",
      en: "The music ministry is looking for new voices",
    },
    excerpt: {
      es: "Si canta o toca algún instrumento, le esperamos en los ensayos de los miércoles. No hace falta experiencia, solo ganas de servir.",
      en: "If you sing or play an instrument, join us at Wednesday rehearsals. No experience needed, just a willingness to serve.",
    },
  },
  {
    id: "avance-templo",
    date: "2026-08-30",
    category: "comunidad",
    image: "/images/historia/templo-exterior.jpg",
    focus: "50% 55%",
    title: {
      es: "Así avanzan los trabajos del nuevo templo",
      en: "Progress on the new church",
    },
    excerpt: {
      es: "Ya se instaló la iluminación exterior de la torre y el pórtico. El siguiente paso es el piso de la nave central, que se financiará con la feria de noviembre.",
      en: "Exterior lighting for the tower and porch is now in place. Next up is the floor of the main nave, funded by the November fair.",
    },
  },
];

/* ------------------------------------------------------------------ */
/* Actividades de cada semana                                          */
/* ------------------------------------------------------------------ */

export type WeeklyActivity = {
  id: string;
  day: Localized;
  time: string;
  name: Localized;
  detail: Localized;
};

export const weeklyActivities: WeeklyActivity[] = [
  {
    id: "musica",
    day: { es: "Miércoles", en: "Wednesday" },
    time: "19:00",
    name: { es: "Ensayo del coro", en: "Choir rehearsal" },
    detail: {
      es: "Abierto a nuevas voces e instrumentos.",
      en: "New voices and instruments welcome.",
    },
  },
  {
    id: "oracion",
    day: { es: "Jueves", en: "Thursday" },
    time: "19:00",
    name: { es: "Grupo de oración", en: "Prayer group" },
    detail: {
      es: "Alabanza, lectura de la Palabra y adoración.",
      en: "Praise, Scripture reading, and adoration.",
    },
  },
  {
    id: "juvenil",
    day: { es: "Viernes", en: "Friday" },
    time: "19:00",
    name: { es: "Pastoral juvenil", en: "Youth ministry" },
    detail: {
      es: "Para jóvenes de 15 a 25 años.",
      en: "For young people ages 15 to 25.",
    },
  },
  {
    id: "catequesis",
    day: { es: "Sábado", en: "Saturday" },
    time: "09:00",
    name: { es: "Catequesis familiar", en: "Family catechesis" },
    detail: {
      es: "Niños y familias en camino a los sacramentos.",
      en: "Children and families preparing for the sacraments.",
    },
  },
];

/* ------------------------------------------------------------------ */
/* Fechas                                                              */
/* ------------------------------------------------------------------ */
/*
 * Las fechas se guardan como texto "AAAA-MM-DD" (fecha local de Costa
 * Rica) y no como Date: asi no cambian de dia segun la zona horaria del
 * servidor, que en produccion suele estar en UTC.
 */

const TIME_ZONE = "America/Costa_Rica";
/** Costa Rica no usa horario de verano: siempre UTC-6. */
const UTC_OFFSET_HOURS = 6;

/** Fecha de hoy en Costa Rica, en el mismo formato que los datos. */
export function todayInCostaRica(now = new Date()) {
  // en-CA formatea como AAAA-MM-DD.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

function parts(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return { year, month, day };
}

/** Mediodia UTC del dia: formatearlo en UTC nunca cambia la fecha. */
export function dateValue(date: string) {
  const { year, month, day } = parts(date);
  return new Date(Date.UTC(year, month - 1, day, 12));
}

/** Dias completos entre hoy y la fecha (0 = hoy). */
export function daysUntil(date: string, today: string) {
  const ms = dateValue(date).getTime() - dateValue(today).getTime();
  return Math.round(ms / 86_400_000);
}

/** Actividades de hoy en adelante, de la mas cercana a la mas lejana. */
export function upcomingEvents(today: string) {
  return parishEvents
    .filter((event) => event.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** Noticias de la mas nueva a la mas vieja. */
export function recentNews() {
  return [...newsArticles].sort((a, b) => b.date.localeCompare(a.date));
}

/** "20261208T150000Z": formato que pide Google Calendar. */
function calendarStamp(date: string, time: string) {
  const { year, month, day } = parts(date);
  const [hours, minutes] = time.split(":").map(Number);
  return new Date(
    Date.UTC(year, month - 1, day, hours + UTC_OFFSET_HOURS, minutes),
  )
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

/**
 * Enlace que abre Google Calendar con la actividad ya llenada. No necesita
 * API key ni JavaScript: es un enlace normal.
 */
export function googleCalendarUrl(
  event: ParishEvent,
  locale: Locale,
  address: string,
) {
  // Sin hora de fin se asume hora y media.
  const end =
    event.end ??
    (() => {
      const [h, m] = event.start.split(":").map(Number);
      const total = h * 60 + m + 90;
      return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
    })();
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title[locale],
    dates: `${calendarStamp(event.date, event.start)}/${calendarStamp(event.date, end)}`,
    details: event.summary[locale],
    location: [event.place[locale], address].filter(Boolean).join(", "),
    ctz: TIME_ZONE,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}
