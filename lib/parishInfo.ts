import type { Locale } from "@/lib/i18n";

/**
 * Datos practicos de la parroquia que se muestran en la portada.
 *
 * PLACEHOLDER: todos estos valores son inventados para la demo del curso.
 * Cuando la parroquia confirme la informacion real, basta con cambiar este
 * archivo; los componentes no necesitan tocarse.
 */

type Localized = Record<Locale, string>;

/** Horas en formato 24h ("18:00"); se muestran segun el idioma. */
export const massSchedule: { day: Localized; times: string[] }[] = [
  {
    day: { es: "Lunes a viernes", en: "Monday to Friday" },
    times: ["06:00", "18:00"],
  },
  {
    day: { es: "Sábado", en: "Saturday" },
    times: ["07:00", "17:00"],
  },
  {
    day: { es: "Domingo", en: "Sunday" },
    times: ["07:00", "09:00", "11:00", "18:00"],
  },
];

export const parishServices: Localized[] = [
  { es: "Bautizos", en: "Baptisms" },
  { es: "Primera comunión", en: "First Communion" },
  { es: "Confirmación", en: "Confirmation" },
  { es: "Matrimonios", en: "Weddings" },
  { es: "Confesiones", en: "Confession" },
  { es: "Unción de los enfermos", en: "Anointing of the sick" },
];

export const officeHours: Localized = {
  es: "Oficina parroquial: lunes a viernes, 8:00\u00a0a.\u00a0m. a 4:00\u00a0p.\u00a0m.",
  en: "Parish office: Monday to Friday, 8:00\u00a0a.m. to 4:00\u00a0p.m.",
};

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
