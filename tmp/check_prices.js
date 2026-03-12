const { PrismaClient } = require("d:/weblikefood/src/generated/client");
const prisma = new PrismaClient();

async function checkTomKho() {
  const p = await prisma.product.findFirst({ where: { slug: "tom-kho" } });
  if (p) {
    console.log("name:", p.name);
    console.log("price:", p.price);
    console.log("originalPrice:", p.originalPrice);
    console.log("salePrice:", p.salePrice);
    console.log("isOnSale:", p.isOnSale);
    console.log("typeof originalPrice:", typeof p.originalPrice);
  }

  const p2 = await prisma.product.findFirst({ where: { name: { contains: "TRÀ VỊ ỔI" } } });
  if (p2) {
    console.log("\nname:", p2.name);
    console.log("price:", p2.price);
    console.log("originalPrice:", p2.originalPrice);
    console.log("salePrice:", p2.salePrice);
    console.log("isOnSale:", p2.isOnSale);
  }

  // Count products with originalPrice not null
  const withOrig = await prisma.product.count({ where: { originalPrice: { not: null } } });
  console.log("\nProducts with non-null originalPrice:", withOrig);

  // Show all products where originalPrice > 50
  const bigOrig = await prisma.product.findMany({
    where: { originalPrice: { gt: 50 } },
    select: { name: true, price: true, originalPrice: true },
  });
  console.log("Products with originalPrice > 50:", bigOrig.length);
  bigOrig.forEach(p => console.log(`  ${p.name}: price=${p.price}, orig=${p.originalPrice}`));

  await prisma.$disconnect();
}

checkTomKho().catch(console.error);
