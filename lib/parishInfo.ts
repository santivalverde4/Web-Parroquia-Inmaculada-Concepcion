import type { Locale } from "@/lib/i18n";

/**
 * Datos practicos de la parroquia: horarios de misa, servicios, horario de
 * oficina y contacto.
 *
 * Se editan desde el panel de administracion y se guardan en la tabla
 * SiteSetting (un JSON por clave). Los valores de este archivo son el
 * respaldo: se usan mientras no se haya guardado nada o si la base de datos
 * no responde, asi el sitio nunca queda vacio.
 *
 * Este archivo no toca la base de datos (eso vive en
 * lib/services/settings.ts), por eso lo pueden importar tanto las paginas
 * como el panel.
 */

export type Localized = Record<Locale, string>;
export type MassDay = { day: Localized; times: string[] };
export type ParishContact = {
  phone: string;
  whatsapp: string;
  email: string;
  address: Localized;
};
export type ParishSettings = {
  massSchedule: MassDay[];
  services: Localized[];
  officeHours: Localized;
  contact: ParishContact;
};

/* ------------------------------------------------------------------ */
/* Valores de respaldo                                                 */
/* ------------------------------------------------------------------ */

export const defaultParishSettings: ParishSettings = {
  // PLACEHOLDER: horarios de ejemplo para la demo.
  massSchedule: [
    {
      day: { es: "Lunes a viernes", en: "Monday to Friday" },
      times: ["06:00", "18:00"],
    },
    { day: { es: "Sábado", en: "Saturday" }, times: ["07:00", "17:00"] },
    {
      day: { es: "Domingo", en: "Sunday" },
      times: ["07:00", "09:00", "11:00", "18:00"],
    },
  ],
  services: [
    { es: "Bautizos", en: "Baptisms" },
    { es: "Primera comunión", en: "First Communion" },
    { es: "Confirmación", en: "Confirmation" },
    { es: "Matrimonios", en: "Weddings" },
    { es: "Confesiones", en: "Confession" },
    { es: "Unción de los enfermos", en: "Anointing of the sick" },
  ],
  officeHours: {
    es: "Oficina parroquial: lunes a viernes, 8:00 a. m. a 4:00 p. m.",
    en: "Parish office: Monday to Friday, 8:00 a.m. to 4:00 p.m.",
  },
  // Telefono y WhatsApp publicados en iglesia.cr.
  contact: {
    phone: "2279-5760",
    whatsapp: "8972-9668",
    email: "",
    address: {
      es: "Concepción, La Unión, Cartago, Costa Rica",
      en: "Concepción, La Unión, Cartago, Costa Rica",
    },
  },
};

/* ------------------------------------------------------------------ */
/* Lectura segura del JSON guardado                                    */
/* ------------------------------------------------------------------ */
/*
 * Lo que viene de la base de datos se revisa campo por campo. Si un valor
 * no tiene la forma esperada se devuelve null y se usa el respaldo; asi un
 * dato mal guardado nunca rompe la pagina.
 */

export const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const text = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

/** Texto bilingue. Si falta el ingles, se usa el espanol. */
function parseLocalized(value: unknown): Localized | null {
  if (!isRecord(value)) return null;
  const es = text(value.es);
  return { es, en: text(value.en) || es };
}

export function parseMassSchedule(value: unknown): MassDay[] | null {
  if (!Array.isArray(value)) return null;
  return value.flatMap((item) => {
    if (!isRecord(item)) return [];
    const day = parseLocalized(item.day);
    const times = Array.isArray(item.times)
      ? item.times.filter(
          (time): time is string =>
            typeof time === "string" && TIME_PATTERN.test(time),
        )
      : [];
    return day?.es && times.length > 0 ? [{ day, times }] : [];
  });
}

export function parseServices(value: unknown): Localized[] | null {
  if (!Array.isArray(value)) return null;
  return value.flatMap((item) => {
    const service = parseLocalized(item);
    return service?.es ? [service] : [];
  });
}

export function parseOfficeHours(value: unknown): Localized | null {
  return parseLocalized(value);
}

export function parseContact(value: unknown): ParishContact | null {
  if (!isRecord(value)) return null;
  return {
    phone: text(value.phone),
    whatsapp: text(value.whatsapp),
    email: text(value.email),
    address: parseLocalized(value.address) ?? { es: "", en: "" },
  };
}

/* ------------------------------------------------------------------ */
/* Formato                                                             */
/* ------------------------------------------------------------------ */

/**
 * Convierte "18:00" en { clock: "6:00", period: "p. m." } (es) o
 * { clock: "6:00", period: "PM" } (en). Van separados para poder darle
 * menos peso visual al "a. m./p. m." que a la hora.
 */
export function formatTime(time: string, locale: Locale) {
  const [hours, minutes] = time.split(":").map(Number);
  const parts = new Intl.DateTimeFormat(locale === "es" ? "es-CR" : "en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  }).formatToParts(new Date(Date.UTC(2000, 0, 1, hours, minutes)));
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  return {
    clock: `${value("hour")}:${value("minute")}`,
    period: value("dayPeriod"),
  };
}

/** Numeros de 8 digitos se asumen de Costa Rica (+506). */
function withCountryCode(digits: string) {
  return digits.length === 8 ? `506${digits}` : digits;
}

export function phoneHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits ? `tel:+${withCountryCode(digits)}` : null;
}

export function whatsappHref(number: string) {
  const digits = number.replace(/\D/g, "");
  return digits ? `https://wa.me/${withCountryCode(digits)}` : null;
}
