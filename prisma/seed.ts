// Seed script untuk NERV StockBot
// Menambahkan data awal (contoh user dan data)
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Buat user contoh
  const password = await hash("admin123", 12);
  const user = await prisma.user.upsert({
    where: { email: "admin@nerv.com" },
    update: {},
    create: {
      email: "admin@nerv.com",
      password,
      name: "Admin NERV",
    },
  });
  console.log(`✅ User created: ${user.email}`);

  // Buat settings
  await prisma.userSetting.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      theme: "default",
      fontSize: "medium",
      tickerEnabled: true,
      sidebarOpen: true,
    },
  });

  // Buat watchlist
  const watchlist = await prisma.watchlist.upsert({
    where: { id: "seed-wl-1" },
    update: {},
    create: {
      id: "seed-wl-1",
      userId: user.id,
      name: "Watchlist Utama",
    },
  });

  // Tambah saham ke watchlist
  const stocks = ["BBCA", "BBRI", "BMRI", "TLKM", "ASII", "ADRO", "GOTO", "BYAN"];
  for (const symbol of stocks) {
    await prisma.watchlistStock.upsert({
      where: { watchlistId_symbol: { watchlistId: watchlist.id, symbol } },
      update: {},
      create: { watchlistId: watchlist.id, symbol },
    });
  }
  console.log(`✅ Watchlist with ${stocks.length} stocks created`);

  // Buat portfolio
  await prisma.portfolio.upsert({
    where: { id: "seed-pt-1" },
    update: {},
    create: {
      id: "seed-pt-1",
      userId: user.id,
      name: "Portfolio Utama",
      cash: 100_000_000,
    },
  });
  console.log("✅ Portfolio created");

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
