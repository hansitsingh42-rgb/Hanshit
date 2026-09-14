import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;

if (!email || !password) {
  throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set before seeding.");
}

if (password.length < 12) {
  throw new Error("ADMIN_PASSWORD must be at least 12 characters long.");
}

const passwordHash = await bcrypt.hash(password, 12);

await db.user.upsert({
  where: { email },
  update: { passwordHash, role: "ADMIN" },
  create: { email, passwordHash, role: "ADMIN" },
});

console.log(`Admin account provisioned: ${email}`);
await db.$disconnect();
