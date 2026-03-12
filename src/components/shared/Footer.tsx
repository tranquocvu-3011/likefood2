"use client";

/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import Link from "next/link";
import Image from "next/image";
import {
    Facebook,
    Mail,
    Phone,
    MapPin,
    ShieldCheck,
    Truck,
    RefreshCw,
    CreditCard,
    ChevronDown,
    Send,
    CheckCircle2,
    AlertCircle,
    Star,
    Instagram,
} from "lucide-react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// ─── Static data ──────────────────────────────────────────────────────────────

const TRUST_ITEMS = [
    { icon: ShieldCheck, title: "100% Chính Hãng",        desc: "Nguồn gốc rõ ràng",          color: "text-emerald-600", bg: "bg-emerald-50",  border: "border-emerald-100" },
    { icon: Truck,       title: "Miễn Phí Vận Chuyển",   desc: "Đơn từ 399K trở lên",         color: "text-sky-600",     bg: "bg-sky-50",      border: "border-sky-100"     },
    { icon: RefreshCw,   title: "Đổi Trả Dễ Dàng",       desc: "Hỗ trợ trong 30 ngày",        color: "text-amber-600",   bg: "bg-amber-50",    border: "border-amber-100"   },
    { icon: CreditCard,  title: "Thanh Toán An Toàn",     desc: "Bảo mật SSL & đối tác uy tín", color: "text-violet-600",  bg: "bg-violet-50",   border: "border-violet-100"  },
];

const LINK_GROUPS = [
    {
        title: "Sản phẩm",
        links: [
            { label: "Tất cả sản phẩm",      href: "/products" },
            { label: "Đặc sản nổi bật",       href: "/products?featured=true" },
            { label: "Quà tặng",              href: "/products?category=gifts" },
            { label: "Gia vị truyền thống",   href: "/products?category=gia-vi" },
            { label: "Hải sản khô",           href: "/products?category=ca-kho" },
            { label: "Flash Sale",            href: "/products?sale=true" },
        ],
    },
    {
        title: "Công ty",
        links: [
            { label: "Về LIKEFOOD",           href: "/about" },
            { label: "Câu chuyện thương hiệu", href: "/about#story" },
            { label: "Bài viết",              href: "/posts" },
            { label: "FAQ",                   href: "/faq" },
            { label: "Liên hệ",              href: "/contact" },
        ],
    },
    {
        title: "Hỗ trợ",
        links: [
            { label: "Theo dõi đơn hàng",    href: "/track-order" },
            { label: "Hướng dẫn mua hàng",   href: "/policies/guide" },
            { label: "Chính sách vận chuyển", href: "/policies/shipping" },
            { label: "Chính sách đổi trả",   href: "/policies/return" },
            { label: "Câu hỏi thường gặp",   href: "/faq" },
        ],
    },
    {
        title: "Chính sách",
        links: [
            { label: "Chính sách bảo mật",   href: "/privacy" },
            { label: "Điều khoản dịch vụ",   href: "/terms" },
            { label: "Chính sách đổi trả",   href: "/policies/return" },
            { label: "Chính sách thanh toán", href: "/policies/payment" },
            { label: "Chính sách vận chuyển", href: "/policies/shipping" },
        ],
    },
];

const PAYMENT_METHODS = [
    { label: "Stripe",     color: "text-[#635BFF] bg-indigo-50 border-indigo-100"  },
    { label: "Visa",       color: "text-blue-700 bg-blue-50 border-blue-100"  },
    { label: "Mastercard", color: "text-red-600 bg-red-50 border-red-100"  },
    { label: "Amex",       color: "text-blue-600 bg-blue-50 border-blue-100" },
];

const SHIPPING_PARTNERS = [
    { label: "USPS",       color: "text-blue-700 bg-blue-50 border-blue-100" },
    { label: "FedEx",      color: "text-purple-600 bg-purple-50 border-purple-100" },
    { label: "UPS",        color: "text-amber-700 bg-amber-50 border-amber-100" },
    { label: "US Shipping", color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
];

// ─── Link group (accordion on mobile) ─────────────────────────────────────────

function LinkGroup({ group }: { group: (typeof LINK_GROUPS)[0] }) {
    const [open, setOpen] = useState(false);

    return (
        <div>
            {/* Desktop title */}
            <p className="hidden md:block text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-500 mb-4">
                {group.title}
            </p>

            {/* Mobile toggle */}
            <button
                className="md:hidden w-full flex items-center justify-between py-3 border-b border-slate-100 text-left"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
            >
                <span className="text-[13px] font-semibold text-slate-800">{group.title}</span>
                <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.22 }}>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                </motion.span>
            </button>

            {/* Links */}
            <AnimatePresence initial={false}>
                <motion.ul
                    key={open ? "o" : "c"}
                    className="overflow-hidden space-y-2.5"
                    initial={{ height: 0, opacity: 0 }}
                    animate={
                        typeof window !== "undefined" && window.innerWidth >= 768
                            ? { height: "auto", opacity: 1 }
                            : open ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }
                    }
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="md:hidden h-2.5" />
                    {group.links.map((link) => (
                        <li key={link.label}>
                            <Link
                                href={link.href}
                                className="text-[13px] font-semibold text-slate-700 hover:text-primary transition-colors duration-200"
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                    <div className="md:hidden h-2" />
                </motion.ul>
            </AnimatePresence>
        </div>
    );
}

// ─── Newsletter ───────────────────────────────────────────────────────────────

function Newsletter() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = email.trim();
        if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return;
        setStatus("loading");
        try {
            const res = await fetch("/api/newsletter/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: trimmed }),
            });
            setStatus(res.ok ? "success" : "error");
        } catch {
            setStatus("error");
        }
    };

    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/8 via-emerald-50 to-teal-50 border border-primary/15 px-7 py-6 md:py-7">
            <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-primary/8 blur-2xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                {/* Text */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1.5">
                        <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">Ưu đãi độc quyền</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-800 leading-snug">
                        Nhận ưu đãi độc quyền từ LIKEFOOD
                    </h3>
                    <p className="text-[12px] text-slate-500 mt-1 max-w-sm leading-relaxed">
                        Đăng ký để nhận khuyến mãi mới nhất và ưu đãi dành riêng cho thành viên.
                    </p>
                </div>

                {/* Form */}
                <div className="w-full md:w-auto md:min-w-[360px]">
                    {status === "success" ? (
                        <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            <p className="text-[13px] font-medium text-emerald-700">Đăng ký thành công! Cảm ơn bạn.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <div className="flex-1 relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Nhập email của bạn"
                                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border text-[13px] text-slate-800 placeholder:text-slate-400 outline-none transition-all ${
                                        status === "error"
                                            ? "border-red-300 focus:ring-1 focus:ring-red-200"
                                            : "border-slate-200 focus:border-primary/50 focus:ring-1 focus:ring-primary/15"
                                    }`}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={status === "loading"}
                                className="flex items-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white text-[13px] font-semibold rounded-xl transition-all shadow-sm shadow-primary/15 flex-shrink-0 disabled:opacity-60 active:scale-95"
                            >
                                {status === "loading"
                                    ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    : <Send className="w-3.5 h-3.5" />
                                }
                                <span>Đăng ký</span>
                            </button>
                        </form>
                    )}
                    {status === "error" && (
                        <div className="flex items-center gap-1 mt-1.5">
                            <AlertCircle className="w-3 h-3 text-red-400" />
                            <p className="text-[11px] text-red-500">Có lỗi xảy ra. Vui lòng thử lại.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Main Footer ──────────────────────────────────────────────────────────────

export default function Footer() {
    const ref = useRef<HTMLElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-60px" });
    const [supportPhone, setSupportPhone] = useState("+1 402-315-8105");
    const [supportEmail, setSupportEmail] = useState("support@likefood.com");

    useEffect(() => {
        const load = async () => {
            try {
                const { getPublicSettings } = await import("@/lib/public-settings");
                const data = await getPublicSettings();
                if (data.SITE_SUPPORT_PHONE) setSupportPhone(data.SITE_SUPPORT_PHONE);
                if (data.SITE_SUPPORT_EMAIL) setSupportEmail(data.SITE_SUPPORT_EMAIL);
            } catch { /* keep defaults */ }
        };
        void load();
    }, []);

    return (
        <footer ref={ref} className="bg-white text-slate-800 border-t border-slate-100">

            {/* ── Newsletter ── */}
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-[6%] pt-10 pb-8">
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                >
                    <Newsletter />
                </motion.div>
            </div>

            {/* ── Trust Strip ── */}
            <div className="border-y border-slate-100 bg-slate-50/60">
                <div className="w-full mx-auto px-4 sm:px-6 lg:px-[6%] py-5">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {TRUST_ITEMS.map((item, i) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 12 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.35, delay: 0.08 + i * 0.06 }}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${item.bg} ${item.border} hover:shadow-sm transition-all cursor-default group`}
                            >
                                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <item.icon className={`w-4 h-4 ${item.color}`} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[12px] font-semibold text-slate-800 leading-tight">{item.title}</p>
                                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Main Links ── */}
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-[6%] py-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">

                    {/* Brand column */}
                    <motion.div
                        className="md:col-span-4 lg:col-span-3 space-y-5"
                        initial={{ opacity: 0, x: -16 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.45, delay: 0.12 }}
                    >
                        {/* Logo — no filter, displays naturally on white bg */}
                        <Link href="/" aria-label="LIKEFOOD trang chủ">
                            <Image
                                src="/logo.png"
                                alt="LIKEFOOD"
                                width={150}
                                height={40}
                                className="max-h-10 w-auto object-contain"
                                style={{ width: "auto", height: "auto" }}
                                priority
                            />
                        </Link>

                        <p className="text-[13px] text-slate-600 leading-relaxed max-w-xs font-medium">
                            Chuyên cung cấp đặc sản Việt Nam, thực phẩm chọn lọc và sản phẩm chất lượng dành cho khách hàng yêu hương vị quê nhà.
                        </p>

                        {/* Contact info */}
                        <div className="space-y-2.5">
                            <a href={`tel:${supportPhone.replace(/[^0-9+]/g, "")}`}
                                className="flex items-center gap-2 text-[13px] text-slate-500 hover:text-primary transition-colors group">
                                <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                    <Phone className="w-3 h-3 text-slate-400 group-hover:text-primary transition-colors" />
                                </div>
                                {supportPhone}
                            </a>
                            <a href={`mailto:${supportEmail}`}
                                className="flex items-center gap-2 text-[13px] text-slate-500 hover:text-primary transition-colors group">
                                <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                    <Mail className="w-3 h-3 text-slate-400 group-hover:text-primary transition-colors" />
                                </div>
                                {supportEmail}
                            </a>
                            <div className="flex items-center gap-2 text-[13px] text-slate-500">
                                <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center">
                                    <MapPin className="w-3 h-3 text-slate-400" />
                                </div>
                                Omaha, NE 68136, United States
                            </div>
                        </div>

                        {/* Social */}
                        <div className="flex gap-2 pt-1">
                            {[
                                { href: "https://www.facebook.com/profile.php?id=100076170558548", icon: Facebook, label: "Facebook", hover: "hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600" },
                                { href: `mailto:${supportEmail}`,       icon: Mail,      label: "Email",    hover: "hover:bg-primary/5 hover:border-primary/30 hover:text-primary" },
                                { href: "https://instagram.com",        icon: Instagram, label: "Instagram", hover: "hover:bg-pink-50 hover:border-pink-200 hover:text-pink-600" },
                            ].map((s) => (
                                <a key={s.label} href={s.href} aria-label={s.label}
                                    target={s.href.startsWith("http") ? "_blank" : undefined}
                                    rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                                    className={`w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 transition-all duration-200 ${s.hover}`}>
                                    <s.icon className="w-3.5 h-3.5" />
                                </a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Link columns */}
                    <motion.div
                        className="md:col-span-8 lg:col-span-9 grid grid-cols-1 md:grid-cols-4 gap-5 md:gap-8"
                        initial={{ opacity: 0, x: 16 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.45, delay: 0.18 }}
                    >
                        {LINK_GROUPS.map((group, i) => (
                            <LinkGroup key={group.title} group={group} />
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* ── Payment & Shipping ── */}
            <div className="border-t border-slate-100 bg-slate-50/50">
                <div className="w-full mx-auto px-4 sm:px-6 lg:px-[6%] py-5">
                    <div className="flex flex-col sm:flex-row gap-5 sm:gap-8 items-start sm:items-center">
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Thanh toán</span>
                            <div className="hidden sm:block w-px h-4 bg-slate-200" />
                            {PAYMENT_METHODS.map((p) => (
                                <span key={p.label} className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold ${p.color}`}>{p.label}</span>
                            ))}
                        </div>
                        <div className="hidden sm:block w-px h-5 bg-slate-200 self-center" />
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Vận chuyển</span>
                            <div className="hidden sm:block w-px h-4 bg-slate-200" />
                            {SHIPPING_PARTNERS.map((s) => (
                                <span key={s.label} className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold ${s.color}`}>{s.label}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Footer Bottom ── */}
            <div className="border-t border-slate-100">
                <div className="w-full mx-auto px-4 sm:px-6 lg:px-[6%] py-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        <p className="text-[12px] font-bold text-slate-500">
                            © 2026 <span className="font-extrabold text-slate-700">LIKEFOOD</span>. All rights reserved.
                        </p>
                        <div className="flex items-center gap-3 flex-wrap justify-center text-[11px] text-slate-400">
                            <div className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-500" /><span>Chuẩn chất lượng</span></div>
                            <div className="w-px h-3 bg-slate-200" />
                            <div className="flex items-center gap-1"><Truck className="w-3 h-3 text-sky-500" /><span>Giao hàng toàn nước Mỹ</span></div>
                            <div className="w-px h-3 bg-slate-200" />
                            <div className="flex items-center gap-1"><Phone className="w-3 h-3 text-primary" /><span>Hỗ trợ nhanh chóng</span></div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link href="/privacy" className="text-[12px] text-slate-400 hover:text-slate-600 transition-colors">Bảo mật</Link>
                            <Link href="/terms" className="text-[12px] text-slate-400 hover:text-slate-600 transition-colors">Điều khoản</Link>
                            <Link href="/policies/cookies" className="text-[12px] text-slate-400 hover:text-slate-600 transition-colors">Cookies</Link>
                        </div>
                    </div>
                </div>
            </div>

        </footer>
    );
}

