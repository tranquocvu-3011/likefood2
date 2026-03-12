/**
 * One-off migration helper:
 * - Create Category records from legacy product.category string
 * - Create Tag records from legacy product.tags CSV string
 * - Connect Product.categoryId and ProductTag join rows
 *
 * Safe to run multiple times (idempotent-ish).
 */

import { PrismaClient } from "../src/generated/client";

const prisma = new PrismaClient();

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    // normalize Vietnamese accents -> keep simple ascii-ish slugs
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function splitTags(csv: string | null | undefined) {
  if (!csv) return [];
  return csv
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

async function main() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      category: true,
      categoryId: true,
      tags: true,
    },
  });

  const categoryNameSet = new Set<string>();
  const tagNameSet = new Set<string>();

  for (const p of products) {
    if (p.category?.trim()) categoryNameSet.add(p.category.trim());
    for (const t of splitTags(p.tags)) tagNameSet.add(t);
  }

  const categoryNames = [...categoryNameSet].sort((a, b) => a.localeCompare(b));
  const tagNames = [...tagNameSet].sort((a, b) => a.localeCompare(b));

  // Categories
  const categoryByName = new Map<string, { id: string; slug: string }>();
  for (const name of categoryNames) {
    const slug = slugify(name) || `cat-${Date.now()}`;
    const existing = await prisma.category.findFirst({
      where: { OR: [{ slug }, { name }] },
      select: { id: true, name: true, slug: true },
    });
    const row =
      existing ??
      (await prisma.category.create({
        data: { name, slug, isActive: true, isVisible: true },
        select: { id: true, name: true, slug: true },
      }));
    categoryByName.set(row.name, { id: row.id, slug: row.slug });
  }

  // Tags
  const tagByName = new Map<string, { id: string; slug: string }>();
  for (const nameRaw of tagNames) {
    const name = nameRaw.trim();
    if (!name) continue;
    const slug = slugify(name) || `tag-${Date.now()}`;
    const existing = await prisma.tag.findFirst({
      where: { OR: [{ slug }, { name }] },
      select: { id: true, name: true, slug: true },
    });
    const row =
      existing ??
      (await prisma.tag.create({
        data: { name, slug, isActive: true },
        select: { id: true, name: true, slug: true },
      }));
    tagByName.set(row.name, { id: row.id, slug: row.slug });
  }

  // Connect products
  for (const p of products) {
    const catName = p.category?.trim();
    const cat = catName ? categoryByName.get(catName) : null;
    if (cat && !p.categoryId) {
      await prisma.product.update({
        where: { id: p.id },
        data: { categoryId: cat.id },
      });
    }

    const tags = splitTags(p.tags);
    if (tags.length > 0) {
      // Create join rows, ignore duplicates
      for (const t of tags) {
        const tag = tagByName.get(t);
        if (!tag) continue;
        await prisma.producttag.upsert({
          where: { productId_tagId: { productId: p.id, tagId: tag.id } },
          update: {},
          create: { productId: p.id, tagId: tag.id },
        });
      }
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    // eslint-disable-next-line no-console
    console.log("✅ migrate-categories-tags done");
  })
  .catch(async (err) => {
    // eslint-disable-next-line no-console
    console.error("❌ migrate-categories-tags failed", err);
    await prisma.$disconnect();
    process.exit(1);
  });

