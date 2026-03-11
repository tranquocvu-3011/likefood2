"use client";

/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Clock3, MapPin, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";

interface PublicSettings {
    SHIPPING_POLICY_CONTENT?: string;
}

const DEFAULT_POLICY = [
    {
        title: "Phạm vi giao hàng",
        body:
            "LIKEFOOD hiện phục vụ khách hàng trên toàn nước Mỹ. Một số khu vực xa hoặc đặc thù có thể cần thêm thời gian xử lý so với tuyến tiêu chuẩn.",
        icon: MapPin,
    },
    {
        title: "Thời gian xử lý",
        body:
            "Đơn hàng thường được xác nhận và chuẩn bị trong vòng 24 giờ làm việc. Thời gian giao thực tế phụ thuộc vào phương thức vận chuyển và địa chỉ nhận hàng.",
        icon: Clock3,
    },
    {
        title: "Chi phí vận chuyển",
        body:
            "Đơn từ $500 được miễn phí vận chuyển. Với đơn dưới mức này, phí giao hàng sẽ được hiển thị rõ ngay trong bước checkout trước khi bạn xác nhận thanh toán.",
        icon: Truck,
    },
    {
        title: "Theo dõi đơn hàng",
        body:
            "Khi đơn đã được bàn giao cho đơn vị vận chuyển, hệ thống sẽ cập nhật mã vận đơn trong chi tiết đơn hàng để bạn dễ theo dõi tiến trình giao nhận.",
        icon: CheckCircle2,
    },
] as const;

function normalizeCmsContent(content: string) {
    return content.replaceAll("$99", "$500").replaceAll("$50", "$500").trim();
}

export default function ShippingPolicyPage() {
    const [content, setContent] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const response = await fetch("/api/public/settings");
                if (!response.ok) {
                    return;
                }

                const data: PublicSettings = await response.json();
                if (data.SHIPPING_POLICY_CONTENT) {
                    setContent(normalizeCmsContent(data.SHIPPING_POLICY_CONTENT));
                }
            } catch {
                // Keep fallback content.
            }
        };

        load();
    }, []);

    const highlights = useMemo(
        () => [
            { label: "Freeship", value: "Từ $500" },
            { label: "Xử lý", value: "Trong 24h làm việc" },
            { label: "Phạm vi", value: "Toàn nước Mỹ" },
        ],
        []
    );

    return (
        <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef6f4_100%)] py-24">
            <div className="page-container-wide space-y-10">
                <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-slate-500 transition hover:text-primary">
                    <ArrowLeft className="h-4 w-4" />
                    Quay lại trang chủ
                </Link>

                <section className="overflow-hidden rounded-[2.75rem] border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
                    <div className="grid gap-8 px-6 py-8 lg:grid-cols-[1.2fr_0.9fr] lg:px-10 lg:py-10">
                        <div className="space-y-5">
                            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-primary">
                                <Truck className="h-4 w-4" />
                                Chính sách vận chuyển
                            </div>
                            <div className="space-y-3">
                                <h1 className="max-w-3xl text-4xl font-black uppercase tracking-tight text-slate-950 lg:text-5xl">
                                    Giao hàng rõ ràng hơn, thông tin quan trọng nằm ngay ở phần đầu
                                </h1>
                                <p className="max-w-2xl text-base leading-7 text-slate-600 lg:text-lg">
                                    Đây là bản trình bày lại chính sách vận chuyển theo cách dễ đọc hơn: mốc freeship, thời gian xử lý, phạm vi giao hàng và cách theo dõi đơn đều được tách rõ theo từng khối.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                            {highlights.map((item) => (
                                <div key={item.label} className="rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-4">
                                    <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">{item.label}</p>
                                    <p className="mt-2 text-lg font-black text-slate-950">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {content ? (
                    <section className="rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
                        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">Nội dung chi tiết</p>
                                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Bản chính sách hiện hành</h2>
                            </div>
                            <div className="whitespace-pre-line rounded-[2rem] border border-slate-200 bg-slate-50 px-5 py-5 text-sm leading-7 text-slate-600 lg:px-6">
                                {content}
                            </div>
                        </div>
                    </section>
                ) : (
                    <section className="grid gap-4 lg:grid-cols-2">
                        {DEFAULT_POLICY.map((section, index) => {
                            const Icon = section.icon;
                            return (
                                <motion.article
                                    key={section.title}
                                    initial={{ opacity: 0, y: 14 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.06 }}
                                    className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black tracking-tight text-slate-950">{section.title}</h2>
                                            <p className="mt-3 text-sm leading-7 text-slate-600">{section.body}</p>
                                        </div>
                                    </div>
                                </motion.article>
                            );
                        })}
                    </section>
                )}

                <section className="grid gap-4 rounded-[2.5rem] border border-slate-200 bg-[linear-gradient(135deg,#0f172a_0%,#14532d_100%)] p-6 text-white shadow-[0_18px_60px_rgba(15,23,42,0.12)] lg:grid-cols-[1fr_auto] lg:items-center">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.24em] text-white/60">Cam kết vận hành</p>
                        <h2 className="mt-2 text-2xl font-black tracking-tight">Thông tin giao hàng được làm rõ để giảm bất ngờ ở bước checkout</h2>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75">
                            LIKEFOOD hiển thị phí vận chuyển trước khi bạn xác nhận đơn, đồng thời cập nhật tiến trình giao nhận trong trang chi tiết đơn hàng sau khi hệ thống xử lý xong.
                        </p>
                    </div>
                    <div className="space-y-3 rounded-[1.75rem] border border-white/10 bg-white/8 p-5 backdrop-blur">
                        <div className="flex items-center gap-3 text-sm font-bold text-white/85">
                            <ShieldCheck className="h-4 w-4 text-emerald-300" />
                            Thông tin giao hàng minh bạch
                        </div>
                        <div className="flex items-center gap-3 text-sm font-bold text-white/85">
                            <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                            Theo dõi đơn sau khi cập nhật mã vận đơn
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
