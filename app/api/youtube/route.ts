import { getYouTubeVideos } from "@/lib/services/youtube";

export async function GET() {
  return Response.json(await getYouTubeVideos());
}
