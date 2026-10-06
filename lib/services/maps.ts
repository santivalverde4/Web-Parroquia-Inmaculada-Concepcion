import { env } from "@/lib/env";
import type { Locale } from "@/lib/i18n";

/**
 * Ubicacion de la parroquia y enlaces para llegar.
 *
 * La ubicacion es un dato publico (cualquiera la ve en Google Maps), por eso
 * vive en el codigo y no en el .env. Es el templo nuevo segun Google Places;
 * si hubiera que moverla, basta con cambiar este objeto.
 */
export const parishLocation = {
  name: "Parroquia Inmaculada Concepción - La Unión",
  lat: 9.9253585,
  lng: -84.0002535,
  placeId: "ChIJI26OBwDhoI8RlkSjwg_456U",
} as const;

/**
 * Direccion del mapa embebido.
 *
 * - Con GOOGLE_MAPS_API_KEY usa la Maps Embed API oficial (gratis y sin
 *   limite de uso), que muestra la ficha del lugar con su nombre.
 * - Sin key usa el modo "output=embed" de Google Maps. Funciona sin
 *   configurar nada, pero Google no lo documenta: sirve para la demo y
 *   mientras se crea la key.
 *
 * La key de la Embed API queda visible en el HTML (asi funciona esa API).
 * Por eso en Google Cloud debe restringirse al dominio del sitio.
 */
export function mapEmbedUrl(locale: Locale) {
  const { lat, lng, placeId } = parishLocation;
  if (env.googleMapsApiKey) {
    const params = new URLSearchParams({
      key: env.googleMapsApiKey,
      q: `place_id:${placeId}`,
      zoom: "17",
      language: locale,
    });
    return `https://www.google.com/maps/embed/v1/place?${params}`;
  }
  const params = new URLSearchParams({
    q: `${lat},${lng}`,
    z: "17",
    hl: locale,
    output: "embed",
  });
  return `https://maps.google.com/maps?${params}`;
}

/** Ruta en Google Maps desde donde este la persona hasta el templo. */
export function googleDirectionsUrl() {
  const { lat, lng, placeId } = parishLocation;
  const params = new URLSearchParams({
    api: "1",
    destination: `${lat},${lng}`,
    destination_place_id: placeId,
  });
  return `https://www.google.com/maps/dir/?${params}`;
}

/** Abre Waze (o su pagina web) con la navegacion ya iniciada. */
export function wazeUrl() {
  const { lat, lng } = parishLocation;
  return `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
}
