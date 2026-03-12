"use client";

/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Calendar, User, Facebook, Twitter, Loader2, Sparkles, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Post {
    id: string;
    title: string;
    slug: string;
    summary?: string;
    content: string;
    image?: string;
    authorName?: string;
    category?: string;
    publishedAt: string;
}

export default function PostDetailClient({ slug }: { slug: string }) {
    const router = useRouter();
    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    // Share functions
    const shareToFacebook = () => {
        const url = encodeURIComponent(window.location.href);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank", "width=600,height=400");
    };

    const shareToTwitter = () => {
        const text = encodeURIComponent(post?.title || "");
        const url = encodeURIComponent(window.location.href);
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank", "width=600,height=400");
    };

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`/api/posts/${slug}`);
                const data = await res.json();
                setPost(data);
            } catch (error) {
                console.error("Fetch post detail error:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPost();
    }, [slug]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-200">
                    <Sparkles className="w-8 h-8 text-slate-400" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">Không tìm thấy bài viết</h1>
                <p className="text-slate-500 font-medium mb-8">Rất tiếc, nội dung bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
                <Link href="/posts">
                    <button className="px-8 py-3.5 bg-emerald-600 text-white rounded-2xl font-bold text-sm shadow-md hover:bg-emerald-700 transition-colors">
                        Quay lại danh sách bài viết
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f4f1ea] pb-24 font-sans selection:bg-emerald-200 selection:text-emerald-900 w-full overflow-x-hidden">
            {/* Full-width Hero Banner */}
            <div className="relative h-[65vh] lg:h-[80vh] w-full mt-16 lg:mt-20 overflow-hidden bg-slate-900 flex items-center justify-center">
                {post.image ? (
                    <Image src={post.image} alt={post.title} fill className="object-cover opacity-60 mix-blend-overlay scale-105" priority sizes="100vw" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-800 to-slate-900" />
                )}

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#f4f1ea] via-slate-900/40 to-slate-900/80" />

                <div className="absolute inset-0 flex flex-col items-center justify-center px-4 md:px-10 text-center z-10 pb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-5 py-2 sm:px-8 sm:py-3 bg-white/20 backdrop-blur-md rounded-full text-white text-xs sm:text-sm font-black uppercase tracking-[0.2em] border border-white/30 shadow-2xl mb-6 md:mb-10"
                    >
                        <Sparkles className="w-4 h-4 text-emerald-300" />
                        <span>{post.category || "CÂU CHUYỆN ĐẶC SẢN"}</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.6 }}
                        className="text-4xl md:text-6xl lg:text-7xl xl:text-[5rem] font-black text-white leading-[1.1] tracking-tight max-w-[1400px] drop-shadow-2xl px-4"
                        style={{ textShadow: "0 10px 30px rgba(0,0,0,0.5)" }}
                    >
                        {post.title}
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-sm md:text-base font-bold text-slate-200 mt-10"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-600/80 flex items-center justify-center border-2 border-emerald-400/50 shadow-lg shadow-emerald-900/50">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <span className="uppercase tracking-widest">{post.authorName || "LIKEFOOD TEAM"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-emerald-300 border-l border-white/20 pl-6 sm:pl-10">
                            <Calendar className="w-5 h-5" />
                            <span>{new Date(post.publishedAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Elevated Main Content Container (Full Width Optimized) */}
            <div className="relative z-20 w-full mx-auto px-4 sm:px-6 lg:px-10 max-w-[1600px] -mt-24 md:-mt-32 lg:-mt-40">
                <main className="bg-white rounded-[2rem] lg:rounded-[3rem] shadow-2xl shadow-slate-900/10 border border-slate-100 flex flex-col lg:flex-row p-6 md:p-10 lg:p-16 xl:p-20 overflow-hidden">

                    {/* Left/Main Column: Article */}
                    <article className="w-full lg:w-8/12 xl:w-9/12 lg:pr-16 xl:pr-24">
                        <div className="mb-8 block lg:hidden">
                            <Link href="/posts" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 uppercase tracking-widest hover:text-emerald-700 transition-colors">
                                <ChevronLeft className="w-5 h-5" /> DANH SÁCH BÀI VIẾT
                            </Link>
                        </div>

                        {post.summary && (
                            <div className="text-xl md:text-2xl font-medium text-slate-700 leading-relaxed border-l-[6px] border-emerald-500 pl-8 py-4 bg-emerald-50/50 rounded-r-2xl mb-12 italic">
                                &ldquo;{post.summary}&rdquo;
                            </div>
                        )}

                        {/* Prose Content */}
                        <div className="prose prose-slate prose-lg md:prose-xl xl:prose-2xl max-w-none text-slate-800 leading-relaxed font-serif prose-headings:font-sans prose-headings:font-black prose-a:text-emerald-600 prose-img:rounded-3xl prose-img:shadow-xl prose-strong:font-black">
                            <div className="break-words space-y-6">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {post.content}
                                </ReactMarkdown>
                            </div>
                        </div>

                        {/* Social Interaction Section Inline */}
                        <div className="mt-20 p-8 md:p-12 bg-gradient-to-br from-slate-50 to-emerald-50/30 rounded-3xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-8 shadow-inner">
                            <div className="space-y-3 text-center md:text-left">
                                <h4 className="text-2xl font-black text-slate-900 tracking-tight">LAN TỎA GIÁ TRỊ</h4>
                                <p className="text-slate-600 font-medium">Chia sẻ bài viết này để mọi người cùng biết đến đặc sản Việt Nam.</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={shareToFacebook}
                                    className="w-14 h-14 rounded-2xl bg-white shadow-md text-[#1877F2] hover:-translate-y-1 transition-transform flex items-center justify-center border border-slate-100"
                                    aria-label="Chia sẻ lên Facebook"
                                >
                                    <Facebook className="w-6 h-6" />
                                </button>
                                <button 
                                    onClick={shareToTwitter}
                                    className="w-14 h-14 rounded-2xl bg-white shadow-md text-[#1DA1F2] hover:-translate-y-1 transition-transform flex items-center justify-center border border-slate-100"
                                    aria-label="Chia sẻ lên Twitter"
                                >
                                    <Twitter className="w-6 h-6" />
                                </button>
                                <button 
                                    onClick={copyLink}
                                    className={`w-14 h-14 rounded-2xl shadow-md hover:-translate-y-1 transition-transform flex items-center justify-center border border-slate-100 ${copied ? "bg-emerald-50 text-emerald-600" : "bg-white text-emerald-600"}`}
                                    aria-label="Sao chép liên kết"
                                >
                                    {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                                </button>
                            </div>
                        </div>
                    </article>

                    {/* Right Column: Sticky Sidebar */}
                    <aside className="w-full lg:w-4/12 xl:w-3/12 mt-16 lg:mt-0 relative">
                        <div className="sticky top-32 space-y-8">

                            {/* Return Button Desktop */}
                            <div className="hidden lg:block">
                                <Link href="/posts">
                                    <button className="w-full py-4 px-6 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-emerald-600 transition-colors shadow-xl shadow-slate-900/20 flex items-center justify-center gap-3">
                                        <ChevronLeft className="w-5 h-5" /> TẤT CẢ BÀI VIẾT
                                    </button>
                                </Link>
                            </div>

                            {/* Discover More Box */}
                            <div className="bg-gradient-to-b from-emerald-600 to-teal-800 rounded-3xl p-8 text-center text-white shadow-2xl shadow-emerald-900/30 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-[url('/patterns/food.svg')] opacity-10 mix-blend-overlay"></div>
                                <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>

                                <div className="relative z-10 space-y-6">
                                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto border border-white/30 shadow-inner">
                                        <Sparkles className="w-8 h-8 text-emerald-100" />
                                    </div>
                                    <h3 className="text-2xl font-black tracking-tighter">ĐẶC SẢN<br />TUYỂN CHỌN</h3>
                                    <p className="text-emerald-100 text-sm font-medium leading-relaxed">
                                        Khám phá ngay các mặt hàng đặc sản, hải sản và cá khô cao cấp nhất từ LikeFood.
                                    </p>
                                    <Link href="/products" className="block mt-4">
                                        <button className="w-full py-4 bg-white text-emerald-800 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-amber-400 hover:text-slate-900 hover:shadow-xl hover:shadow-amber-400/20 transition-all">
                                            MUA SẮM NGAY
                                        </button>
                                    </Link>
                                </div>
                            </div>

                        </div>
                    </aside>
                </main>
            </div>
        </div>
    );
}
