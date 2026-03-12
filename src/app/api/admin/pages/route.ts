/**
 * LIKEFOOD - Admin Dynamic Pages API
 * Full CRUD for dynamic pages (About, FAQ, Policies, etc.)
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Get all pages or single page (admin)
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const page = await prisma.dynamicPage.findUnique({
        where: { id },
      });

      if (!page) {
        return NextResponse.json({ error: "Không tìm thấy trang" }, { status: 404 });
      }

      return NextResponse.json(page);
    }

    const pages = await prisma.dynamicPage.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(pages);
  } catch (error) {
    console.error("Admin dynamic pages fetch error:", error);
    return NextResponse.json({ error: "Lỗi khi lấy trang" }, { status: 500 });
  }
}

// POST - Create new page
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, slug, content, excerpt, metaTitle, metaDescription, image, template, type, isPublished, isDefault, order } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: "Tiêu đề và slug là bắt buộc" }, { status: 400 });
    }

    // Check for duplicate slug
    const existing = await prisma.dynamicPage.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json({ error: "Slug đã tồn tại" }, { status: 409 });
    }

    const page = await prisma.dynamicPage.create({
      data: {
        id: crypto.randomUUID(),
        title,
        slug,
        content: content || "",
        excerpt: excerpt || null,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        image: image || null,
        template: template || "default",
        type: type || "custom",
        isPublished: isPublished !== false,
        isDefault: isDefault || false,
        order: order || 0,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    console.error("Admin dynamic page create error:", error);
    return NextResponse.json({ error: "Lỗi khi tạo trang" }, { status: 500 });
  }
}

// PUT - Update page
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, slug, content, excerpt, metaTitle, metaDescription, image, template, type, isPublished, isDefault, order } = body;

    if (!id) {
      return NextResponse.json({ error: "ID là bắt buộc" }, { status: 400 });
    }

    // Check for duplicate slug (excluding current page)
    if (slug) {
      const existing = await prisma.dynamicPage.findFirst({
        where: { slug, NOT: { id } },
      });

      if (existing) {
        return NextResponse.json({ error: "Slug đã tồn tại" }, { status: 409 });
      }
    }

    const updateData: Record<string, unknown> = {};

    if (title !== undefined) updateData.title = title;
    if (slug !== undefined) updateData.slug = slug;
    if (content !== undefined) updateData.content = content;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (metaTitle !== undefined) updateData.metaTitle = metaTitle;
    if (metaDescription !== undefined) updateData.metaDescription = metaDescription;
    if (image !== undefined) updateData.image = image;
    if (template !== undefined) updateData.template = template;
    if (type !== undefined) updateData.type = type;
    if (isPublished !== undefined) updateData.isPublished = isPublished;
    if (isDefault !== undefined) updateData.isDefault = isDefault;
    if (order !== undefined) updateData.order = order;

    const page = await prisma.dynamicPage.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(page);
  } catch (error) {
    console.error("Admin dynamic page update error:", error);
    return NextResponse.json({ error: "Lỗi khi cập nhật trang" }, { status: 500 });
  }
}

// DELETE - Delete page
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID là bắt buộc" }, { status: 400 });
    }

    await prisma.dynamicPage.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Xóa trang thành công" });
  } catch (error) {
    console.error("Admin dynamic page delete error:", error);
    return NextResponse.json({ error: "Lỗi khi xóa trang" }, { status: 500 });
  }
}
