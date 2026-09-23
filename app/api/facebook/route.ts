import { getFacebookPosts } from "@/lib/services/facebook";

export async function GET() {
  return Response.json(await getFacebookPosts());
}
