import { env } from "@/lib/env";

export function getMapQuery() {
  return env.parishMapQuery;
}

export function getGoogleMapsLink() {
  if (!env.parishMapQuery) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(env.parishMapQuery)}`;
}

export async function getStaticMap(): Promise<ArrayBuffer | null> {
  const key = env.googleMapsApiKey;
  const query = env.parishMapQuery;
  if (!key || !query) return null;
  const url = new URL("https://maps.googleapis.com/maps/api/staticmap");
  url.search = new URLSearchParams({ center: query, zoom: "15", size: "900x500", scale: "2", markers: query, key }).toString();
  const response = await fetch(url, { next: { revalidate: 86400 } });
  if (!response.ok) throw new Error(`Google Maps API returned ${response.status}`);
  return response.arrayBuffer();
}
