import "dotenv/config";
import { hash } from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

async function main() {
  const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;
  const name = process.env.SEED_ADMIN_NAME?.trim() || "Administrador";

  if (!connectionString || !email || !password || password.length < 12) {
    throw new Error("Set DATABASE_URL (or DIRECT_URL), SEED_ADMIN_EMAIL, and a SEED_ADMIN_PASSWORD of at least 12 characters before seeding.");
  }

  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  try {
    const passwordHash = await hash(password, 12);
    await prisma.admin.upsert({
      where: { email },
      update: { name, passwordHash },
      create: { email, name, passwordHash },
    });
    console.info(`Administrator ready: ${email}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
