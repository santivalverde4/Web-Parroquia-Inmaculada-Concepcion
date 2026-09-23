import { NextResponse, type NextFetchEvent, type NextMiddleware, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { hasAdminConfiguration } from "@/lib/env";

// Next.js 16 calls this request boundary `proxy.ts` (formerly `middleware.ts`).
const protectedProxy = auth((request) => {
  const path = request.nextUrl.pathname;
  if (path === "/admin/login") {
    if (request.auth?.user?.role === "admin") return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    return NextResponse.next();
  }
  if (request.auth?.user?.role !== "admin") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
});

export function proxy(request: NextRequest, event: NextFetchEvent) {
  if (!hasAdminConfiguration) {
    if (request.nextUrl.pathname === "/admin/login") return NextResponse.next();
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return (protectedProxy as unknown as NextMiddleware)(request, event);
}

export const config = { matcher: ["/admin/:path*"] };
