import { getStaticMap } from "@/lib/services/maps";

export async function GET() {
  try {
    const image = await getStaticMap();
    if (!image) return new Response(null, { status: 404 });
    return new Response(image, { headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=3600, s-maxage=86400" } });
  } catch (error) {
    console.error("Could not load map", error);
    return new Response(null, { status: 502 });
  }
}
