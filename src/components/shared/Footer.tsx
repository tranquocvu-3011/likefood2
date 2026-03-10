/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter, Mail, ShieldCheck, Truck } from "lucide-react";
import TrustBadges from "./TrustBadges";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n/context";

type FooterLinkGroup = {
    title: string;
    links: { label: string; href: string }[];
};

export default function Footer() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [supportPhone, setSupportPhone] = useState<string | null>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [supportEmail, setSupportEmail] = useState<string | null>(null);
    const [linkGroups, setLinkGroups] = useState<FooterLinkGroup[] | null>(null);
    const { t } = useLanguage();

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const res = await fetch("/api/public/settings");
                if (!res.ok) return;
                const data = await res.json();
                setSupportPhone(data.SITE_SUPPORT_PHONE || null);
                setAddress(data.SITE_ADDRESS || null);
                setSupportEmail(data.SITE_SUPPORT_EMAIL || null);

                if (data.FOOTER_LINK_GROUPS) {
                    try {
                        const parsed = JSON.parse(data.FOOTER_LINK_GROUPS) as FooterLinkGroup[];
                        if (Array.isArray(parsed) && parsed.length > 0) {
                            setLinkGroups(parsed);
                        }
                    } catch {
                        // ignore invalid JSON
                    }
                }
            } catch {
                // ignore
            }
        };
        loadSettings();
    }, []);

    return (
        <footer ref={ref} className="bg-gradient-to-br from-cyan-50 via-sky-50 to-cyan-100 text-slate-900 border-t border-cyan-200 pt-16 pb-8 mt-0 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }} />
            </div>

            {/* Gradient Orbs */}
            <motion.div
                className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            <motion.div
                className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                }}
            />

            <div className="relative z-10 w-full mx-auto px-4 sm:px-6 lg:px-[8%]">
                {/* Trust Badges Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <TrustBadges />
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {/* Brand Section */}
                    <motion.div
                        className="lg:col-span-5 space-y-8"
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link href="/" className="inline-block">
                                <motion.div
                                    whileHover={{ filter: "brightness(1.1)" }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Image
                                        src="/logo.png"
                                        alt="LIKEFOOD"
                                        width={180}
                                        height={48}
                                        className="h-12 w-auto object-contain"
                                        priority
                                    />
                                </motion.div>
                            </Link>
                        </motion.div>
                        <motion.p
                            className="text-sm leading-relaxed text-slate-600 font-medium max-w-md"
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            {t("footer.description")}
                        </motion.p>
                        <div className="flex gap-4">
                            {[
                                { icon: Facebook, href: "https://facebook.com/vudev05", color: "hover:bg-blue-600" },
                                { icon: Instagram, href: "#", color: "hover:bg-pink-600" },
                                { icon: Twitter, href: "#", color: "hover:bg-sky-500" },
                                { icon: Mail, href: supportEmail ? `mailto:${supportEmail}` : "mailto:tranquocvu3011@gmail.com", color: "hover:bg-red-500" }
                            ].map((social, i) => (
                                <motion.a
                                    key={i}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-11 h-11 rounded-full bg-white border border-cyan-200 flex items-center justify-center ${social.color} hover:text-white transition-all text-slate-600 relative overflow-hidden group`}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                    transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                                    whileHover={{ scale: 1.1, y: -3 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-br from-primary/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
                                    />
                                    <social.icon className="w-5 h-5 relative z-10" />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Links Grid */}
                    <motion.div
                        className="lg:col-span-7 grid grid-cols-3 gap-4 sm:gap-10"
                        initial={{ opacity: 0, x: 20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        {(linkGroups ||
                            [
                                {
                                    title: t("footer.products"),
                                    links: [
                                        { label: t("footer.allSpecialties"), href: "/products" },
                                        { label: t("footer.giftSets"), href: "/products?category=gifts" },
                                        { label: t("footer.traditionalSpices"), href: "/products?category=spice" },
                                        { label: t("footer.driedSeafood"), href: "/products?category=seafood" },
                                    ],
                                },
                                {
                                    title: t("footer.company"),
                                    links: [
                                        { label: t("footer.aboutUs"), href: "/about" },
                                        { label: t("footer.shippingPolicy"), href: "/policies/shipping" },
                                        { label: t("footer.returnPolicy"), href: "/policies/return" },
                                        { label: t("footer.privacyPolicy"), href: "/policies/privacy" },
                                        { label: t("footer.termsOfService"), href: "/policies/terms" },
                                    ],
                                },
                            ]).map((group, groupIndex) => (
                                <motion.div
                                    key={group.title}
                                    className="space-y-4 md:space-y-6"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.5, delay: 0.4 + groupIndex * 0.1 }}
                                >
                                    <motion.h3
                                        className="text-sm font-bold uppercase tracking-wider text-slate-900"
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        {group.title}
                                    </motion.h3>
                                    <ul className="space-y-3">
                                        {group.links.map((link, i) => (
                                            <motion.li
                                                key={link.label}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={isInView ? { opacity: 1, x: 0 } : {}}
                                                transition={{ duration: 0.3, delay: 0.5 + i * 0.08 }}
                                            >
                                                <Link
                                                    href={link.href}
                                                    className="text-slate-500 hover:text-primary transition-colors font-medium text-[10px] min-[360px]:text-xs md:text-sm relative group inline-block"
                                                >
                                                    <span className="relative z-10">{link.label}</span>
                                                    <motion.span
                                                        className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"
                                                        whileHover={{ width: "100%" }}
                                                    />
                                                </Link>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </motion.div>
                            ))}

                        <motion.div
                            className="space-y-4 md:space-y-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            <motion.h3
                                className="text-[10px] md:text-sm font-bold uppercase tracking-wider text-slate-900"
                                whileHover={{ scale: 1.05 }}
                            >
                                {t("footer.contactUs")}
                            </motion.h3>
                            <div className="space-y-4">
                                <motion.div
                                    className="p-2 md:p-4 rounded-lg md:rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5 md:space-y-1 relative overflow-hidden group"
                                    whileHover={{ scale: 1.02, borderColor: "rgb(14 165 233)" }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-primary/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity"
                                    />
                                    <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400 relative z-10">{t("footer.hotline")}</p>
                                    <p className="text-[9px] md:text-sm font-bold text-slate-900 relative z-10">
                                        {supportPhone || "402-315-8105"}
                                    </p>
                                </motion.div>
                                <motion.div
                                    className="p-2 md:p-4 rounded-lg md:rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5 md:space-y-1 relative overflow-hidden group"
                                    whileHover={{ scale: 1.02, borderColor: "rgb(14 165 233)" }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-primary/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity"
                                    />
                                    <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400 relative z-10">{t("footer.office")}</p>
                                    <p className="text-[9px] md:text-[11px] font-bold text-slate-900 leading-tight relative z-10">
                                        {address || "nebraska, Omaha, NE, United States"}
                                    </p>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Bottom Bar */}
                <motion.div
                    className="mt-12 pt-6 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.7 }}
                >
                    <motion.p
                        className="text-xs font-medium text-slate-400"
                        whileHover={{ scale: 1.02 }}
                    >
                        © 2026 LIKEFOOD - {t("footer.designedBy")} {" "}
                        <motion.a
                            href="https://facebook.com/vudev05"
                            className="text-slate-900 hover:text-primary font-bold inline-block relative group"
                            whileHover={{ scale: 1.05 }}
                        >
                            <span className="relative z-10">TRẦN QUỐC VŨ</span>
                            <motion.span
                                className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"
                            />
                        </motion.a>
                    </motion.p>
                    <div className="flex items-center gap-6">
                        <motion.div
                            className="flex items-center gap-2"
                            whileHover={{ scale: 1.05, y: -2 }}
                            transition={{ duration: 0.2 }}
                        >
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                            >
                                <ShieldCheck className="w-4 h-4 text-green-500" />
                            </motion.div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{t("footer.fdaStandard")}</span>
                        </motion.div>
                        <motion.div
                            className="flex items-center gap-2"
                            whileHover={{ scale: 1.05, y: -2 }}
                            transition={{ duration: 0.2 }}
                        >
                            <motion.div
                                animate={{ x: [0, 3, 0] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                            >
                                <Truck className="w-4 h-4 text-primary" />
                            </motion.div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Ship Toàn Mỹ</span>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
}
