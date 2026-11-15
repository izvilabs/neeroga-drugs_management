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
    email: "admin@gmail.com",
    firstName: "nerooga",
    lastName: "admin",
    password: "Admin123!",
    role: Role.ADMIN,
  },

];

export async function main() {
  for (const u of userData) {
    await prisma.user.create({ data: u });
  }
}

main();