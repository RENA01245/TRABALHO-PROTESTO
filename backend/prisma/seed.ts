import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Admin@123456", 10);

  await prisma.user.upsert({
    where: { email: "admin@protesto.local" },
    update: { passwordHash, role: Role.ADMIN, active: true },
    create: {
      name: "Administrador",
      email: "admin@protesto.local",
      passwordHash,
      role: Role.ADMIN,
      active: true
    }
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
