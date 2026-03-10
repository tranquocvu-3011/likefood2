/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight, Clock, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { logger } from "@/lib/logger";

interface Post {
    id: string;
    title: string;
    slug: string;
    summary?: string;
    image?: string;
    category?: string;
    publishedAt: string;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
    "Ẩm thực": { bg: "bg-orange-50 border-orange-200", text: "text-orange-700", dot: "bg-orange-400" },
    "Tin tức": { bg: "bg-blue-50 border-blue-200", text: "text-blue-700", dot: "bg-blue-400" },
    "Sức khoẻ": { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", dot: "bg-emerald-400" },
    "Mẹo hay": { bg: "bg-violet-50 border-violet-200", text: "text-violet-700", dot: "bg-violet-400" },
};

function getCategoryStyle(cat?: string) {
    return cat && CATEGORY_COLORS[cat]
        ? CATEGORY_COLORS[cat]
        : { bg: "bg-slate-50 border-slate-200", text: "text-slate-600", dot: "bg-slate-400" };
}

function readingTime(summary?: string) {
    const words = (summary || "").split(" ").length;
    return Math.max(1, Math.round(words / 200));
}

export default function RecentPosts() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch("/api/posts?limit=4");
                if (res.ok) {
                    const data = await res.json();
                    setPosts(data.posts || []);
                }
            } catch (error) {
                logger.warn("Fetch recent posts error", { error: error as Error, context: "recent-posts" });
            } finally {
                setIsLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (isLoading) return null;
    if (posts.length === 0) return null;

    return (
        <section className="relative py-12 md:py-16 bg-gradient-to-b from-slate-50/60 via-white to-slate-50/60 overflow-hidden">
            {/* Ambient glows */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-10 left-1/4 w-[400px] h-[300px] bg-orange-50/40 rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-1/4 w-[350px] h-[250px] bg-emerald-50/30 rounded-full blur-3xl" />
            </div>

            <div className="relative page-container-wide">
                {/* Section Header — compact */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                    <div className="space-y-2">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary rounded-full px-3 py-1 text-xs font-semibold"
                        >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Góc chia sẻ nội trợ</span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-2xl md:text-3xl font-black text-slate-900 leading-tight"
                        >
                            Bài viết{" "}
                            <span className="bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
                                mới nhất
                            </span>
                        </motion.h2>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Link
                            href="/posts"
                            className="group inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-primary text-white rounded-full font-bold text-xs transition-all duration-300 shadow-lg shadow-slate-900/20 hover:shadow-primary/30 hover:scale-105"
                        >
                            Xem tất cả
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>

                {/* Posts Grid — 2 cột đều nhau */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {posts.slice(0, 4).map((post, idx) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 * idx, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                            <CompactPostCard post={post} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ── Compact Post Card (horizontal, nhỏ gọn) ── */
function CompactPostCard({ post }: { post: Post }) {
    const cat = getCategoryStyle(post.category);
    const mins = readingTime(post.summary);

    return (
        <Link
            href={`/posts/${post.slug}`}
            className="group flex gap-4 bg-white border border-slate-100 hover:border-primary/20 rounded-2xl p-3.5 shadow-sm hover:shadow-lg hover:shadow-primary/8 transition-all duration-400 overflow-hidden"
        >
            {/* Thumbnail */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden flex-shrink-0">
                {post.image ? (
                    <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="128px"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-slate-300" />
                    </div>
                )}
                {/* Category pill on image */}
                <div className="absolute top-2 left-2">
                    <span className={`inline-flex items-center gap-1 text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border backdrop-blur-sm ${cat.bg} ${cat.text}`}>
                        <span className={`w-1 h-1 rounded-full ${cat.dot}`} />
                        {post.category || "Tin tức"}
                    </span>
                </div>
            </div>

            {/* Text content */}
            <div className="flex flex-col justify-between min-w-0 flex-1 py-0.5">
                <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-1.5">
                        {post.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{post.summary}</p>
                </div>
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(post.publishedAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {mins} phút
                        </span>
                    </div>
                    <span className="flex items-center gap-1 text-primary font-bold text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                        Đọc <ArrowRight className="w-3 h-3" />
                    </span>
                </div>
            </div>
        </Link>
    );
}
