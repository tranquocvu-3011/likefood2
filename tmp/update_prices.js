const { PrismaClient } = require("d:/weblikefood/src/generated/client");
const prisma = new PrismaClient();

async function fixAll() {
  const products = await prisma.product.findMany();
  console.log("Found", products.length, "products\n");

  let fixed = 0;
  for (const p of products) {
    const updates = {};

    // Any price/originalPrice/salePrice >= 100 is clearly still in VND (real USD prices are < 100)
    if (p.price >= 100) {
      updates.price = Math.round((p.price / 10000) * 100) / 100;
    }
    if (p.originalPrice && p.originalPrice >= 100) {
      updates.originalPrice = Math.round((p.originalPrice / 10000) * 100) / 100;
    }
    if (p.salePrice && p.salePrice >= 100) {
      updates.salePrice = Math.round((p.salePrice / 10000) * 100) / 100;
    }

    if (Object.keys(updates).length > 0) {
      await prisma.product.update({ where: { id: p.id }, data: updates });
      console.log(`  Fixed ${p.name}: ${JSON.stringify(updates)}`);
      fixed++;
    }
  }

  console.log(`\nFixed ${fixed} products`);

  // Verify
  console.log("\n--- Sample verification ---");
  const sample = await prisma.product.findMany({
    select: { name: true, price: true, originalPrice: true, salePrice: true, isOnSale: true },
    where: { isOnSale: true },
    take: 10,
  });
  sample.forEach(p => console.log(`  ${p.name}: price=$${p.price} sale=$${p.salePrice} orig=$${p.originalPrice} onSale=${p.isOnSale}`));

  await prisma.$disconnect();
}

fixAll().catch(console.error);
