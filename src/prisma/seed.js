const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const departments = ["HR", "IT", "Finance", "Marketing"];

const main = async () => {
  console.log("Seeding departments...");

  for (const name of departments) {
    const existing = await prisma.department.findUnique({ where: { name } });

    if (!existing) {
      await prisma.department.create({ data: { name } });
      console.log(`Created department: ${name}`);
    } else {
      console.log(`Department already exists: ${name}`);
    }
  }

  console.log("Seeding finished.");
};

main()
  .catch((error) => {
    console.error("Seeding error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });