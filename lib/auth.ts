import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: env.authSecret,
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [Credentials({
    credentials: { email: { label: "Correo electrónico", type: "email" }, password: { label: "Contraseña", type: "password" } },
    async authorize(credentials) {
      const email = typeof credentials?.email === "string" ? credentials.email.trim().toLowerCase() : "";
      const password = typeof credentials?.password === "string" ? credentials.password : "";
      if (!email || !password) return null;
      const admin = await prisma.admin.findUnique({ where: { email } });
      if (!admin || !await compare(password, admin.passwordHash)) return null;
      return { id: admin.id, email: admin.email, name: admin.name, role: "admin" as const };
    },
  })],
  callbacks: {
    jwt({ token, user }) {
      if (user) { token.role = user.role; token.sub = user.id; }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.sub ?? "";
      if (token.role === "admin") session.user.role = "admin";
      return session;
    },
  },
});
