/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { Metadata } from "next";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import PostDetailClient from "./PostDetailClient";

export const revalidate = 3600; // 1 hour for blog posts

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const cookieStore = await cookies();
    const lang = cookieStore.get("language")?.value === "en" ? "en" : "vi";

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
                title: lang === "en" ? "Post not found" : "Bài viết không tìm thấy",
                description: lang === "en" ? "The content you requested does not exist." : "Nội dung bạn tìm kiếm không tồn tại.",
            };
        }

        return {
            title: post.title,
            description: post.summary || (lang === "en" ? `Read "${post.title}" on LIKEFOOD Blog` : `Đọc bài viết "${post.title}" trên LIKEFOOD Blog`),
            alternates: {
                canonical: `/posts/${slug}`,
            },
            openGraph: {
                title: post.title,
                description: post.summary || (lang === "en" ? `${post.title} - LIKEFOOD Blog` : `${post.title} - LIKEFOOD Blog`),
                type: "article",
                url: `/posts/${slug}`,
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
            title: lang === "en" ? "LIKEFOOD Blog" : "Blog LIKEFOOD",
            description: lang === "en" ? "News and articles from LIKEFOOD" : "Tin tức và bài viết từ LIKEFOOD",
        };
    }
}

export default async function PostDetailPage({ params }: PageProps) {
    const { slug } = await params;

    // Fetch post for structured data (server-side)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let blogJsonLd: Record<string, any> | null = null;
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
                createdAt: true,
                updatedAt: true,
            },
        });

        if (post) {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://likefood.vn";
            blogJsonLd = {
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                headline: post.title,
                description: post.summary || "",
                image: post.image ? (post.image.startsWith("http") ? post.image : `${baseUrl}${post.image}`) : undefined,
                author: {
                    "@type": "Person",
                    name: post.authorName || "LIKEFOOD",
                },
                publisher: {
                    "@type": "Organization",
                    name: "LIKEFOOD",
                    url: baseUrl,
                },
                datePublished: post.createdAt.toISOString(),
                dateModified: post.updatedAt.toISOString(),
                mainEntityOfPage: {
                    "@type": "WebPage",
                    "@id": `${baseUrl}/posts/${slug}`,
                },
            };
        }
    } catch {
        // Non-blocking: structured data is optional
    }

    return (
        <>
            {blogJsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
                />
            )}
            <PostDetailClient slug={slug} />
        </>
    );
}
