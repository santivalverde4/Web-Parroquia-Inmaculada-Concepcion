import { cache } from "react";
import type { Prisma } from "@/app/generated/prisma/client";
import { hasDatabase } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import {
  defaultParishSettings,
  parseContact,
  parseMassSchedule,
  parseOfficeHours,
  parseServices,
  type ParishSettings,
} from "@/lib/parishInfo";

/** Clave de cada dato en la tabla SiteSetting. */
export const settingKeys = {
  massSchedule: "mass-schedule",
  services: "services",
  officeHours: "office-hours",
  contact: "contact",
} as const;

/**
 * Horarios, servicios y contacto, con el respaldo de lib/parishInfo.ts para
 * lo que no se haya guardado.
 *
 * cache() hace que la portada y el pie de pagina, que lo piden en la misma
 * visita, compartan una sola consulta.
 */
export const getParishSettings = cache(async (): Promise<ParishSettings> => {
  if (!hasDatabase) return defaultParishSettings;
  // During development, Turbopack can retain a Prisma client generated before
  // this model existed. Keep the public site available until the dev server is
  // restarted and the regenerated client is loaded.
  const siteSetting = prisma.siteSetting;
  if (!siteSetting) return defaultParishSettings;

  try {
    const rows = await siteSetting.findMany({
      where: { key: { in: Object.values(settingKeys) } },
    });
    const saved = new Map(rows.map((row) => [row.key, row.value]));
    const defaults = defaultParishSettings;
    return {
      massSchedule:
        parseMassSchedule(saved.get(settingKeys.massSchedule)) ??
        defaults.massSchedule,
      services:
        parseServices(saved.get(settingKeys.services)) ?? defaults.services,
      officeHours:
        parseOfficeHours(saved.get(settingKeys.officeHours)) ??
        defaults.officeHours,
      contact: parseContact(saved.get(settingKeys.contact)) ?? defaults.contact,
    };
  } catch (error) {
    console.error("Could not load site settings", error);
    return defaultParishSettings;
  }
});

export async function saveSetting(
  key: (typeof settingKeys)[keyof typeof settingKeys],
  value: Prisma.InputJsonValue,
) {
  const siteSetting = prisma.siteSetting;
  if (!siteSetting) {
    throw new Error(
      "El cliente Prisma está desactualizado. Reinicia el servidor de desarrollo.",
    );
  }

  await siteSetting.upsert({
    where: { key },
    create: { key, value },
    update: { value },
  });
}
