/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { Metadata } from "next";
import prisma from "@/lib/prisma";
import PostDetailClient from "./PostDetailClient";

export const revalidate = 3600; // 1 hour for blog posts

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;

    try {
        const post = await prisma.post.findFirst({
            where: {
                OR: [{ slug }, { id: slug }],
                isPublished: true,
            },
            select: {
                title: true,
                summary: true,
                image: true,
                authorName: true,
                category: true,
            },
        });

        if (!post) {
            return {
                title: "Bài viết không tìm thấy",
                description: "Nội dung bạn tìm kiếm không tồn tại.",
            };
        }

        return {
            title: post.title,
            description: post.summary || `Đọc bài viết "${post.title}" trên LIKEFOOD Blog`,
            openGraph: {
                title: post.title,
                description: post.summary || `${post.title} - LIKEFOOD Blog`,
                type: "article",
                images: post.image ? [{ url: post.image, width: 1200, height: 630 }] : [],
                authors: post.authorName ? [post.authorName] : ["LIKEFOOD"],
            },
            twitter: {
                card: "summary_large_image",
                title: post.title,
                description: post.summary || `${post.title} - LIKEFOOD Blog`,
                images: post.image ? [post.image] : [],
            },
        };
    } catch {
        return {
            title: "Blog LIKEFOOD",
            description: "Tin tức và bài viết từ LIKEFOOD",
        };
    }
}

export default async function PostDetailPage({ params }: PageProps) {
    const { slug } = await params;
    return <PostDetailClient slug={slug} />;
}
