import { PrismaClient, Prisma, Role } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const userData: Prisma.UserCreateInput[] = [
 
   {
    email: "admin@example.com",
    firstName: "Sample",
    lastName: "Administrator",
    password: "Admin123!",
    role: Role.ADMIN,
  },
  {
    email: "user@example.com",
    firstName: "Sample",
    lastName: "User",
    password: "User12345!",
    role: Role.USER,
  },
];

export async function main() {
  for (const u of userData) {
    await prisma.user.create({ data: u });
  }
}

main();