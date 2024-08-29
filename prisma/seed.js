const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Menambahkan data role
  await prisma.role.createMany({
    data: [
      { id: 1, name: "Admin" },
      { id: 2, name: "Guru" },
      { id: 3, name: "Siswa" },
    ],
    skipDuplicates: true, // Menghindari duplikasi jika seeder dijalankan lebih dari sekali
  });

  console.log("Seeding selesai!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
