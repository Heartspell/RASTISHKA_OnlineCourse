import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminExists = await prisma.user.findUnique({
    where: { email: "admin@rastishka.ru" },
  });

  if (!adminExists) {
    const passwordHash = await bcrypt.hash("admin123", 12);
    await prisma.user.create({
      data: {
        email: "admin@rastishka.ru",
        name: "Администратор",
        passwordHash,
        role: "ADMIN",
      },
    });
    console.log("Admin user created: admin@rastishka.ru / admin123");
  } else {
    console.log("Admin user already exists");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
