import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User { role: "admin" }
  interface Session { user: { id: string; name?: string | null; email?: string | null; role: "admin" } }
}

declare module "next-auth/jwt" {
  interface JWT { role?: "admin" }
}
