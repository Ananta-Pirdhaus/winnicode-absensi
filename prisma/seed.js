const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Menambahkan data ke tabel Kelas
  await prisma.kelas.createMany({
    data: [{ nama: "IPA" }, { nama: "IPS" }, { nama: "BAHASA" }],
  });

  // Menambahkan data ke tabel Jurusan
  await prisma.jurusan.createMany({
    data: [
      { nama: "IPA1" },
      { nama: "IPA2" },
      { nama: "IPA3" },
      { nama: "IPA4" },
      { nama: "IPA5" },
      { nama: "IPA6" },
      { nama: "IPS1" },
      { nama: "IPS2" },
      { nama: "IPS3" },
      { nama: "BAHASA1" },
      { nama: "BAHASA2" },
      { nama: "BAHASA3" },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
