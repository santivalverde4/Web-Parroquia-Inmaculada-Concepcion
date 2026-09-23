import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "@/lib/env";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// DATABASE_URL is loaded only from the local deployment environment.
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  adapter: new PrismaPg({ connectionString: env.databaseUrl ?? "" }),
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
