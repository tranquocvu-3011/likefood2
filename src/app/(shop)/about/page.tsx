/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import {
    MapPin, Users, Package, Award, Leaf, Shield, Truck, Heart, ChevronRight, Quote, Star,
    Globe, ShoppingBag, TrendingUp, Handshake, Target, History, Box, Zap,
} from "lucide-react";
import { AboutDynamicSection } from "@/components/about/AboutDynamicSection";

export const revalidate = 86400;

type Locale = "vi" | "en";

const META_COPY: Record<Locale, { title: string; description: string; ogDescription: string }> = {
    vi: {
        title: "Về LIKEFOOD – Nền tảng đặc sản Việt Nam tại Mỹ",
        description: "Khám phá LIKEFOOD – nền tảng bán đặc sản Việt Nam uy tín tại Hoa Kỳ. Câu chuyện thương hiệu, sứ mệnh, giá trị, và cam kết mang hương vị quê nhà đến cộng đồng người Việt xa xứ.",
        ogDescription: "LIKEFOOD – Mang đặc sản Việt Nam đến cộng đồng người Việt tại Hoa Kỳ.",
    },
    en: {
        title: "About LIKEFOOD – Vietnamese Specialty Platform in the U.S.",
        description: "Discover LIKEFOOD – the trusted Vietnamese specialty marketplace in the United States. Our story, mission, values, and commitment to bringing authentic Vietnamese flavors to overseas communities.",
        ogDescription: "LIKEFOOD – Bringing authentic Vietnamese specialties to the U.S. market.",
    },
};

const STATS_COPY = {
    vi: [
        { icon: Package, value: "100+", label: "Sản phẩm đặc sản", color: "from-orange-500 to-amber-500" },
        { icon: MapPin, value: "50+", label: "Tiểu bang phục vụ", color: "from-blue-500 to-cyan-500" },
        { icon: History, value: "2+", label: "Năm hoạt động", color: "from-purple-500 to-pink-500" },
        { icon: Users, value: "10,000+", label: "Khách hàng tin tưởng", color: "from-green-500 to-emerald-500" },
    ],
    en: [
        { icon: Package, value: "100+", label: "Specialty products", color: "from-orange-500 to-amber-500" },
        { icon: MapPin, value: "50+", label: "States served", color: "from-blue-500 to-cyan-500" },
        { icon: History, value: "2+", label: "Years operating", color: "from-purple-500 to-pink-500" },
        { icon: Users, value: "10,000+", label: "Trusted customers", color: "from-green-500 to-emerald-500" },
    ],
} as const;

const PRODUCT_CATEGORIES = {
    vi: [
        { icon: "🐟", name: "Cá khô", desc: "Cá lóc, cá sặc, cá chỉ vàng và nhiều loại cá khô đặc sản miền Tây" },
        { icon: "🦐", name: "Tôm khô & Mực khô", desc: "Tôm khô tự nhiên, mực khô hảo hạng từ các vùng biển Việt Nam" },
        { icon: "🥭", name: "Trái cây sấy", desc: "Trái cây sấy tự nhiên, giữ nguyên hương vị và dinh dưỡng" },
        { icon: "🍵", name: "Trà & Bánh mứt", desc: "Trà truyền thống, bánh mứt đậm đà hương vị Tết Việt Nam" },
    ],
    en: [
        { icon: "🐟", name: "Dried fish", desc: "Snakehead, climbing perch, golden threadfin and many Western specialty dried fish" },
        { icon: "🦐", name: "Dried shrimp & squid", desc: "Natural dried shrimp, premium dried squid from Vietnam's coastal regions" },
        { icon: "🥭", name: "Dried fruits", desc: "Naturally dried fruits, preserving authentic flavor and nutrition" },
        { icon: "🍵", name: "Tea & Confectionery", desc: "Traditional tea, cakes and sweets rich in Vietnamese Tet flavors" },
    ],
} as const;

const VALUES_COPY = {
    vi: [
        {
            icon: Leaf,
            title: "Nguyên liệu tự nhiên",
            description: "Sản phẩm được tuyển chọn từ nguyên liệu tự nhiên, qua sàng lọc kỹ lưỡng từ đội ngũ tại Việt Nam.",
        },
        {
            icon: Shield,
            title: "An toàn thực phẩm",
            description: "Quy trình kiểm định chất lượng nghiêm ngặt, đóng gói theo tiêu chuẩn phù hợp thị trường Hoa Kỳ.",
        },
        {
            icon: Truck,
            title: "Giao hàng toàn Mỹ",
            description: "Giao nhanh đến 50 bang, đóng gói cẩn thận để giữ trọn chất lượng và hương vị sản phẩm.",
        },
        {
            icon: Heart,
            title: "Tận tâm phục vụ",
            description: "Đội ngũ hỗ trợ luôn sẵn sàng đồng hành và giải đáp mọi thắc mắc của bạn mọi lúc.",
        },
        {
            icon: Handshake,
            title: "Thương hiệu riêng",
            description: "LIKEFOOD – thương hiệu riêng, cam kết hương vị Việt, đóng gói chuẩn, nâng tầm giá trị.",
        },
        {
            icon: Globe,
            title: "Omnichannel",
            description: "Kết hợp bán hàng offline hiện hữu và online, trải nghiệm mua sắm liền mạch mọi lúc.",
        },
    ],
    en: [
        {
            icon: Leaf,
            title: "Natural ingredients",
            description: "Products are carefully selected from natural sources by our team in Vietnam.",
        },
        {
            icon: Shield,
            title: "Food safety",
            description: "Rigorous quality controls, packaged to meet U.S. market standards.",
        },
        {
            icon: Truck,
            title: "Nationwide U.S. shipping",
            description: "Fast delivery to all 50 states with careful packaging to preserve quality and flavor.",
        },
        {
            icon: Heart,
            title: "Dedicated support",
            description: "Our support team is always ready to help you with any questions anytime.",
        },
        {
            icon: Handshake,
            title: "Own brand",
            description: "LIKEFOOD – our own brand, committed to Vietnamese flavor, standardized packaging.",
        },
        {
            icon: Globe,
            title: "Omnichannel",
            description: "Combining existing offline and online sales for a seamless shopping experience.",
        },
    ],
} as const;

const TESTIMONIALS_COPY = {
    vi: [
        {
            name: "Chị Lê Huỳnh Nhiên",
            location: "California, USA",
            content: "Nhờ LIKEFOOD mà gia đình tôi ở Mỹ vẫn được thưởng thức hương vị quê nhà. Sản phẩm chất lượng, đóng gói rất cẩn thận.",
            rating: 5,
        },
        {
            name: "Anh Trần Quốc Vũ",
            location: "Texas, USA",
            content: "Mua hàng ở đây rất yên tâm, giao nhanh và hỗ trợ nhiệt tình. Tôi sẽ tiếp tục ủng hộ lâu dài.",
            rating: 5,
        },
    ],
    en: [
        {
            name: "Le Huynh Nhien",
            location: "California, USA",
            content: "LIKEFOOD helps my family in the U.S. stay connected to Vietnamese flavors. Product quality and packaging are excellent.",
            rating: 5,
        },
        {
            name: "Tran Quoc Vu",
            location: "Texas, USA",
            content: "Ordering is reliable, delivery is quick, and support is very helpful. I will keep coming back.",
            rating: 5,
        },
    ],
} as const;

export async function generateMetadata(): Promise<Metadata> {
    const cookieStore = await cookies();
    const locale: Locale = cookieStore.get("language")?.value === "en" ? "en" : "vi";
    const copy = META_COPY[locale];

    return {
        title: copy.title,
        description: copy.description,
        alternates: { canonical: "/about" },
        openGraph: {
            title: copy.title,
            description: copy.ogDescription,
            type: "website",
            url: "/about",
        },
    };
}

export default async function AboutPage() {
    const cookieStore = await cookies();
    const locale: Locale = cookieStore.get("language")?.value === "en" ? "en" : "vi";
    const isVi = locale === "vi";
    const stats = STATS_COPY[locale];
    const values = VALUES_COPY[locale];
    const testimonials = TESTIMONIALS_COPY[locale];
    const products = PRODUCT_CATEGORIES[locale];

    return (
        <div className="min-h-screen">
            {/* ═══════════════════════════════════════════════════ */}
            {/* HERO SECTION */}
            {/* ═══════════════════════════════════════════════════ */}
            <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-cyan-50/50">
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-300/20 rounded-full blur-[150px]" />
                    <div className="absolute bottom-20 right-20 w-80 h-80 bg-cyan-300/20 rounded-full blur-[120px]" />
                </div>

                <div className="relative page-container-wide py-20 lg:py-32">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                            <Heart className="w-4 h-4 text-primary" fill="currentColor" />
                            <span className="text-xs font-bold uppercase tracking-widest text-primary">{isVi ? "Câu chuyện của chúng tôi" : "Our story"}</span>
                        </div>

                        <h1 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter mb-6">
                            {isVi ? "Mang" : "Bringing"} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-500 to-cyan-500">{isVi ? "hương vị Việt" : "Vietnamese flavor"}</span> {isVi ? "đến người Việt xa xứ" : "to overseas Vietnamese"}
                        </h1>

                        <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-3xl mx-auto">
                            {isVi
                                ? "LIKEFOOD ra đời từ nỗi nhớ hương vị quê hương của cộng đồng người Việt tại Mỹ. Chúng tôi tin rằng mỗi món đặc sản không chỉ là thực phẩm, mà còn là sợi dây kết nối với cội nguồn và gia đình."
                                : "LIKEFOOD was born from the longing for home flavors among Vietnamese communities in the U.S. We believe each specialty is not just food, but a connection to roots and family."}
                        </p>
                    </div>
                </div>
            </section>

            <AboutDynamicSection />

            {/* ═══════════════════════════════════════════════════ */}
            {/* STATS SECTION */}
            {/* ═══════════════════════════════════════════════════ */}
            <section className="relative -mt-16 z-10">
                <div className="page-container-wide">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-3xl p-6 lg:p-8 shadow-xl shadow-slate-100 text-center hover:shadow-2xl transition-all"
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                                    <stat.icon className="w-7 h-7 text-white" />
                                </div>
                                <div className="text-3xl lg:text-4xl font-black text-slate-900 mb-1">{stat.value}</div>
                                <div className="text-sm font-medium text-slate-500">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════ */}
            {/* BỐI CẢNH & SỨ MỆNH */}
            {/* ═══════════════════════════════════════════════════ */}
            <section className="py-20 lg:py-32">
                <div className="page-container-wide">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <div className="relative">
                            <div className="aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl bg-slate-100">
                                <Image
                                    src="/images/dacsan.png"
                                    alt={isVi ? "Đặc sản khô Việt Nam" : "Vietnamese dry specialties"}
                                    fill
                                    className="object-cover"
                                    sizes="(min-width: 1024px) 50vw, 100vw"
                                    priority
                                />
                            </div>
                            <div className="absolute -bottom-8 -right-8 bg-white rounded-2xl p-6 shadow-2xl max-w-xs hidden lg:block">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                                        <Target className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <div className="text-lg font-black text-primary">{isVi ? "Thương hiệu riêng" : "Own brand"}</div>
                                        <div className="text-sm font-medium text-slate-500">{isVi ? "Đóng gói theo tiêu chuẩn" : "Standard packaging"}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <span className="inline-block px-4 py-2 bg-primary/10 rounded-full text-xs font-black uppercase tracking-widest text-primary mb-6">
                                {isVi ? "Bối cảnh & Sứ mệnh" : "Context & Mission"}
                            </span>
                            <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter mb-6">
                                {isVi ? "Vì sao LIKEFOOD ra đời?" : "Why was LIKEFOOD created?"}
                            </h2>
                            <p className="text-lg text-slate-500 leading-relaxed mb-6">
                                {isVi
                                    ? "Cộng đồng người Việt tại Mỹ có nhu cầu lớn với các đặc sản truyền thống như cá khô, tôm khô, mực khô, trái cây sấy, trà, bánh mứt. Tuy nhiên, thị trường hiện tại tồn tại nhiều hạn chế:"
                                    : "The Vietnamese community in the U.S. has a strong demand for traditional specialties like dried fish, shrimp, squid, dried fruits, tea, and cakes. However, the current market has significant limitations:"}
                            </p>
                            <ul className="space-y-4 mb-10">
                                <li className="flex items-start gap-4">
                                    <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <ChevronRight className="w-5 h-5 text-red-400" />
                                    </div>
                                    <div>
                                        <span className="font-bold text-slate-900">{isVi ? "Khó tiếp cận sản phẩm đúng hương vị" : "Hard to find authentic flavors"}</span>
                                        <p className="text-sm text-slate-500 mt-1">{isVi ? "Người tiêu dùng khó tìm được đặc sản đúng hương vị Việt Nam trên thị trường Mỹ." : "Consumers struggle to find authentic Vietnamese flavored specialties in the U.S. market."}</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <ChevronRight className="w-5 h-5 text-red-400" />
                                    </div>
                                    <div>
                                        <span className="font-bold text-slate-900">{isVi ? "Thiếu thương hiệu uy tín online" : "Lack of trusted online brands"}</span>
                                        <p className="text-sm text-slate-500 mt-1">{isVi ? "Thiếu các thương hiệu có nguồn gốc rõ ràng, quy trình sản xuất – phân phối minh bạch." : "Few brands with clear origins, transparent production and distribution processes online."}</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <ChevronRight className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <span className="font-bold text-slate-900">{isVi ? "LIKEFOOD giải quyết vấn đề này" : "LIKEFOOD solves this problem"}</span>
                                        <p className="text-sm text-slate-500 mt-1">{isVi ? "Xây dựng nền tảng bán hàng online chuyên nghiệp, đáng tin cậy riêng cho cộng đồng người Việt tại Mỹ." : "Building a professional, trustworthy online marketplace specifically for Vietnamese communities in the U.S."}</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════ */}
            {/* MỤC TIÊU DỰ ÁN */}
            {/* ═══════════════════════════════════════════════════ */}
            <section className="py-16 lg:py-24 bg-gradient-to-b from-slate-50 to-white">
                <div className="page-container-wide">
                    <div className="text-center max-w-2xl mx-auto mb-14">
                        <span className="inline-block px-4 py-2 bg-blue-100 rounded-full text-xs font-black uppercase tracking-widest text-blue-700 mb-6">
                            {isVi ? "Mục tiêu" : "Objectives"}
                        </span>
                        <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter mb-4">
                            {isVi ? "Mục tiêu dự án LIKEFOOD" : "LIKEFOOD project objectives"}
                        </h2>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: TrendingUp,
                                title: isVi ? "Số hóa kinh doanh" : "Digitize business",
                                desc: isVi ? "Số hóa hoạt động kinh doanh đặc sản Việt Nam tại thị trường Mỹ" : "Digitize Vietnamese specialty business operations in the U.S. market",
                                color: "from-blue-500 to-indigo-500",
                            },
                            {
                                icon: ShoppingBag,
                                title: isVi ? "Bán hàng đa kênh" : "Omnichannel sales",
                                desc: isVi ? "Chuẩn hóa mô hình bán hàng online đa kênh kết hợp offline" : "Standardize multi-channel online sales combined with offline",
                                color: "from-emerald-500 to-teal-500",
                            },
                            {
                                icon: Globe,
                                title: isVi ? "Mở rộng tiếp cận" : "Expand reach",
                                desc: isVi ? "Tiếp cận khách hàng qua Website, Facebook, TikTok" : "Reach customers through Website, Facebook, TikTok",
                                color: "from-orange-500 to-red-500",
                            },
                            {
                                icon: Zap,
                                title: isVi ? "Tích hợp AI" : "AI integration",
                                desc: isVi ? "Sẵn sàng tích hợp AI để nâng cao trải nghiệm mua sắm" : "Ready to integrate AI to enhance shopping experience",
                                color: "from-purple-500 to-pink-500",
                            },
                        ].map((item, i) => (
                            <div key={i} className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all border border-slate-100 group">
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                                    <item.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-lg font-black text-slate-900 mb-3">{item.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════ */}
            {/* SẢN PHẨM KINH DOANH */}
            {/* ═══════════════════════════════════════════════════ */}
            <section className="py-16 lg:py-24">
                <div className="page-container-wide">
                    <div className="text-center max-w-2xl mx-auto mb-14">
                        <span className="inline-block px-4 py-2 bg-amber-100 rounded-full text-xs font-black uppercase tracking-widest text-amber-700 mb-6">
                            {isVi ? "Nhóm sản phẩm" : "Product categories"}
                        </span>
                        <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter mb-4">
                            {isVi ? "Đặc sản Việt Nam chính hiệu" : "Authentic Vietnamese specialties"}
                        </h2>
                        <p className="text-slate-500 font-medium">
                            {isVi ? "Hương vị Việt – đóng gói theo tiêu chuẩn – thương hiệu riêng LIKEFOOD" : "Vietnamese flavor – standardized packaging – LIKEFOOD's own brand"}
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((p, i) => (
                            <div key={i} className="relative bg-gradient-to-br from-white to-amber-50/50 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all border border-amber-100/50 group overflow-hidden">
                                <div className="absolute top-4 right-4 text-5xl opacity-20 group-hover:opacity-40 transition-opacity">{p.icon}</div>
                                <div className="text-5xl mb-5">{p.icon}</div>
                                <h3 className="text-xl font-black text-slate-900 mb-3">{p.name}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{p.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-10">
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-emerald-500 text-white rounded-full font-black uppercase tracking-wider text-sm shadow-xl shadow-primary/30 hover:shadow-2xl transition-all"
                        >
                            {isVi ? "Khám phá tất cả sản phẩm" : "Explore all products"}
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════ */}
            {/* FOUNDER STORY & LỊCH SỬ */}
            {/* ═══════════════════════════════════════════════════ */}
            <section className="py-16 lg:py-24 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-[50%] h-[60%] bg-emerald-500/10 blur-[150px] rounded-full" />
                    <div className="absolute bottom-0 left-0 w-[40%] h-[50%] bg-cyan-500/10 blur-[120px] rounded-full" />
                </div>

                <div className="relative page-container-wide">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <div>
                            <span className="inline-block px-4 py-2 bg-white/10 rounded-full text-xs font-black uppercase tracking-widest text-emerald-300 mb-6 border border-white/10">
                                {isVi ? "Người sáng lập" : "Founder"}
                            </span>
                            <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter mb-6">
                                {isVi ? "Câu chuyện thương hiệu" : "Brand story"}
                            </h2>
                            <p className="text-lg text-white/70 leading-relaxed mb-6">
                                {isVi
                                    ? "Anh Lê Văn Hiển – người sáng lập LIKEFOOD – đã dành hơn 2 năm xây dựng và phát triển thương hiệu đặc sản Việt Nam tại thị trường Mỹ. Với niềm đam mê mang hương vị quê hương đến cộng đồng người Việt xa xứ, anh đã:"
                                    : "Le Van Hien – the founder of LIKEFOOD – has spent over 2 years building and developing a Vietnamese specialty brand in the U.S. market. With a passion for bringing homeland flavors to overseas Vietnamese, he has:"}
                            </p>

                            <div className="space-y-5 mb-8">
                                {[
                                    {
                                        icon: Box,
                                        title: isVi ? "Đưa hơn 100 sản phẩm sang Mỹ" : "Brought 100+ products to the U.S.",
                                        desc: isVi ? "Tuyển chọn kỹ lưỡng từ các vùng đặc sản nổi tiếng Việt Nam" : "Carefully selected from Vietnam's most famous specialty regions",
                                    },
                                    {
                                        icon: MapPin,
                                        title: isVi ? "Tổ chức bán hàng offline tại nhiều tiểu bang" : "Organized offline sales across states",
                                        desc: isVi ? "Xây dựng kênh bán hàng trực tiếp, tạo niềm tin với cộng đồng" : "Built direct sales channels, earning community trust",
                                    },
                                    {
                                        icon: Award,
                                        title: isVi ? "Quy trình sản xuất chuyên nghiệp" : "Professional production process",
                                        desc: isVi ? "Đội ngũ tại Việt Nam trực tiếp khảo sát, chọn lọc, đóng gói và phát triển dưới thương hiệu LIKEFOOD" : "Team in Vietnam directly surveys, selects, packages, and develops under the LIKEFOOD brand",
                                    },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-white/10">
                                            <item.icon className="w-5 h-5 text-emerald-300" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white mb-1">{item.title}</h4>
                                            <p className="text-sm text-white/60">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Business model card */}
                        <div className="bg-white/5 backdrop-blur-md rounded-[2rem] p-8 lg:p-10 border border-white/10">
                            <h3 className="text-2xl font-black uppercase tracking-tighter mb-6 text-emerald-300">
                                {isVi ? "Mô hình kinh doanh" : "Business model"}
                            </h3>

                            <div className="space-y-6">
                                <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                                    <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                                        <ShoppingBag className="w-4 h-4 text-emerald-400" />
                                        {isVi ? "Bán trực tiếp (B2C)" : "Direct to consumer (B2C)"}
                                    </h4>
                                    <p className="text-sm text-white/60">{isVi ? "Kết hợp bán offline (hiện có) và online để mở rộng quy mô, tiếp cận cộng đồng người Việt trên toàn nước Mỹ." : "Combining existing offline and online sales to expand reach across Vietnamese communities throughout the U.S."}</p>
                                </div>

                                <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                                    <h4 className="font-bold text-white mb-3">{isVi ? "Kênh bán hàng" : "Sales channels"}</h4>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { icon: "🌐", name: "Website" },
                                            { icon: "📘", name: "Facebook" },
                                            { icon: "🎵", name: "TikTok" },
                                        ].map((ch, i) => (
                                            <div key={i} className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                                                <div className="text-2xl mb-1">{ch.icon}</div>
                                                <div className="text-xs font-bold text-white/70">{ch.name}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                                    <h4 className="font-bold text-white mb-3">{isVi ? "Khách hàng mục tiêu" : "Target customers"}</h4>
                                    <ul className="space-y-2 text-sm text-white/60">
                                        <li className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                            {isVi ? "Người Việt Nam tại Mỹ (25 – 55 tuổi)" : "Vietnamese in the U.S. (ages 25 – 55)"}
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <ShoppingBag className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                            {isVi ? "Mua đặc sản để sử dụng hoặc làm quà tặng" : "Buy specialties for personal use or as gifts"}
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Truck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                            {isVi ? "Ưu tiên mua online, giao hàng nội địa Mỹ" : "Prefer online ordering with U.S. domestic shipping"}
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Heart className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                            {isVi ? "Tin tưởng thương hiệu có lịch sử hoạt động rõ ràng" : "Trust brands with clear operational history"}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════ */}
            {/* GIÁ TRỊ CỐT LÕI */}
            {/* ═══════════════════════════════════════════════════ */}
            <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
                <div className="page-container-wide">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="inline-block px-4 py-2 bg-primary/10 rounded-full text-xs font-black uppercase tracking-widest text-primary mb-6">
                            {isVi ? "Giá trị cốt lõi" : "Core values"}
                        </span>
                        <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter mb-4">
                            {isVi ? "Tại sao chọn LIKEFOOD?" : "Why choose LIKEFOOD?"}
                        </h2>
                        <p className="text-slate-500 font-medium">
                            {isVi ? "Chúng tôi cam kết mang đến trải nghiệm mua sắm tốt nhất cho bạn" : "We are committed to delivering an outstanding shopping experience."}
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {values.map((value, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all group"
                            >
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all">
                                    <value.icon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-lg font-black text-slate-900 mb-3">{value.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════ */}
            {/* TESTIMONIALS */}
            {/* ═══════════════════════════════════════════════════ */}
            <section className="py-20 lg:py-32">
                <div className="page-container-wide">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="inline-block px-4 py-2 bg-amber-100 rounded-full text-xs font-black uppercase tracking-widest text-amber-700 mb-6">
                            {isVi ? "Khách hàng nói gì" : "What customers say"}
                        </span>
                        <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter">
                            {isVi ? "Yêu thương từ cộng đồng" : "Love from the community"}
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 relative"
                            >
                                <Quote className="w-10 h-10 text-amber-200 absolute top-6 right-6" />
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-amber-400" fill="currentColor" />
                                    ))}
                                </div>
                                <p className="text-slate-700 leading-relaxed mb-6 italic">
                                    &quot;{testimonial.content}&quot;
                                </p>
                                <div>
                                    <div className="font-bold text-slate-900">{testimonial.name}</div>
                                    <div className="text-sm text-slate-500">{testimonial.location}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════ */}
            {/* CTA SECTION */}
            {/* ═══════════════════════════════════════════════════ */}
            <section className="py-20 bg-gradient-to-r from-primary via-emerald-500 to-cyan-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                <div className="relative page-container-wide text-center">
                    <h2 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter text-white mb-6">
                        {isVi ? "Sẵn sàng thưởng thức đặc sản Việt?" : "Ready to enjoy Vietnamese specialties?"}
                    </h2>
                    <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10">
                        {isVi ? "Đặt hàng ngay hôm nay và nhận ưu đãi đặc biệt dành cho khách hàng mới" : "Place your order today and unlock special offers for new customers."}
                    </p>
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-3 px-10 py-5 bg-white text-primary rounded-full font-black uppercase tracking-wider text-sm shadow-2xl hover:shadow-white/30 transition-all"
                    >
                        {isVi ? "Mua sắm ngay" : "Shop now"}
                        <ChevronRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
