"use client";

/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Save, Image as ImageIcon, Info, FileText } from "lucide-react";
import { toast } from "sonner";

interface BannerForm {
    imageUrl: string;
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
}

export default function AdminCmsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [settings, setSettings] = useState<any>({});
    const [banner, setBanner] = useState<BannerForm>({
        imageUrl: "/banner.png",
        title: "",
        subtitle: "",
        ctaText: "",
        ctaLink: "/products",
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setIsLoading(true);
            const [settingsRes, bannersRes] = await Promise.all([
                fetch("/api/settings"),
                fetch("/api/banners?placement=home"),
            ]);

            const settingsJson = settingsRes.ok ? await settingsRes.json() : {};
            setSettings(settingsJson);

            if (bannersRes.ok) {
                const bannersJson = await bannersRes.json();
                const first = Array.isArray(bannersJson) && bannersJson.length > 0 ? bannersJson[0] : null;
                if (first) {
                    setBanner({
                        imageUrl: first.imageUrl || "/banner.png",
                        title: first.title || "",
                        subtitle: first.subtitle || "",
                        ctaText: first.ctaText || "",
                        ctaLink: first.ctaLink || "/products",
                    });
                } else {
                    setBanner((prev) => ({
                        ...prev,
                        title: settingsJson.HERO_TITLE || "",
                        subtitle: settingsJson.HERO_SUBTITLE || "",
                        ctaText: settingsJson.HERO_CTA_TEXT || "Mua ngay",
                        ctaLink: settingsJson.HERO_CTA_LINK || "/products",
                    }));
                }
            }
        } catch {
            toast.error("Không thể tải dữ liệu CMS");
        } finally {
            setIsLoading(false);
        }
    };

    const updateSetting = (key: string, value: string | number) => {
        setSettings((prev: any) => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);

            const settingsPayload = {
                ...settings,
                HERO_TITLE: banner.title,
                HERO_SUBTITLE: banner.subtitle,
                HERO_CTA_TEXT: banner.ctaText,
                HERO_CTA_LINK: banner.ctaLink,
            };

            const settingsPromise = fetch("/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settingsPayload),
            });

            const bannerPromise = fetch("/api/banners", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    imageUrl: banner.imageUrl,
                    title: banner.title || "Hương vị quê nhà ngay tầm tay bạn",
                    subtitle:
                        banner.subtitle ||
                        "LIKEFOOD mang đến hơn 100 loại đặc sản tinh túy nhất từ mọi miền Việt Nam đến tận nhà bạn tại Hoa Kỳ.",
                    ctaText: banner.ctaText || "Mua ngay",
                    ctaLink: banner.ctaLink || "/products",
                    placement: "home",
                    priority: 100,
                }),
            });

            const [settingsRes, bannerRes] = await Promise.all([settingsPromise, bannerPromise]);

            if (settingsRes.ok && bannerRes.ok) {
                toast.success("Đã lưu nội dung trang chủ & số liệu thành công");
            } else {
                toast.error("Lỗi khi lưu cấu hình CMS");
            }
        } catch {
            toast.error("Lỗi kết nối khi lưu CMS");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-xs font-black uppercase tracking-widest">Đang tải nội dung trang...</p>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-10 space-y-8 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 font-outfit uppercase">
                        Trang & nội dung
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Quản lý hero banner trang chủ và các con số ấn tượng từ dữ liệu thực trong hệ thống.
                    </p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20 transition-all flex gap-3"
                >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Lưu thay đổi
                </Button>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                {/* Hero banner */}
                <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden">
                    <CardHeader className="bg-slate-50/60 p-8 border-b border-slate-100 flex flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                                <ImageIcon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="font-outfit font-black text-xs uppercase tracking-widest">
                                    Hero banner trang chủ
                                </CardTitle>
                                <CardDescription className="text-xs text-slate-500 font-medium mt-1">
                                    Điều chỉnh nội dung hero giống với phần bạn đang thấy ngoài trang chủ.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                Ảnh banner (URL)
                            </label>
                            <input
                                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-medium text-slate-900 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none text-xs"
                                value={banner.imageUrl}
                                onChange={(e) => setBanner({ ...banner, imageUrl: e.target.value })}
                                placeholder="/banner.png hoặc URL đầy đủ"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                    Tiêu đề lớn
                                </label>
                                <input
                                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                    value={banner.title}
                                    onChange={(e) => setBanner({ ...banner, title: e.target.value })}
                                    placeholder="Hương vị quê nhà ngay tầm tay bạn"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                    Nút kêu gọi hành động (CTA)
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    <input
                                        className="col-span-1 bg-slate-50 border-none rounded-2xl px-4 py-3 font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm"
                                        value={banner.ctaText}
                                        onChange={(e) => setBanner({ ...banner, ctaText: e.target.value })}
                                        placeholder="Mua ngay"
                                    />
                                    <input
                                        className="col-span-2 bg-slate-50 border-none rounded-2xl px-4 py-3 font-medium text-slate-900 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none text-xs"
                                        value={banner.ctaLink}
                                        onChange={(e) => setBanner({ ...banner, ctaLink: e.target.value })}
                                        placeholder="/products"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                Mô tả ngắn dưới tiêu đề
                            </label>
                            <textarea
                                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-medium text-slate-900 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none min-h-[100px]"
                                value={banner.subtitle}
                                onChange={(e) => setBanner({ ...banner, subtitle: e.target.value })}
                                placeholder="LIKEFOOD mang đến hơn 100 loại đặc sản tinh túy nhất từ mọi miền Việt Nam..."
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Con số ấn tượng */}
                <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden">
                    <CardHeader className="bg-slate-50/60 p-8 border-b border-slate-100 flex flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                                <Info className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                        <CardTitle className="font-outfit font-black text-xs uppercase tracking-widest">
                            Con số ấn tượng
                        </CardTitle>
                                <CardDescription className="text-xs text-slate-500 font-medium mt-1">
                                    Điều chỉnh các số liệu hiển thị như 111+ sản phẩm, 5 danh mục, 24/7 hỗ trợ...
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                    Số sản phẩm hiển thị
                                </label>
                                <input
                                    type="number"
                                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                    value={settings.STAT_PRODUCTS_COUNT || 0}
                                    onChange={(e) => updateSetting("STAT_PRODUCTS_COUNT", Number(e.target.value || 0))}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                    Số danh mục
                                </label>
                                <input
                                    type="number"
                                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                    value={settings.STAT_CATEGORIES_COUNT || 0}
                                    onChange={(e) => updateSetting("STAT_CATEGORIES_COUNT", Number(e.target.value || 0))}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                    Số giờ hỗ trợ (vd: 24/7)
                                </label>
                                <input
                                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                    value={settings.STAT_SUPPORT_TEXT || ""}
                                    onChange={(e) => updateSetting("STAT_SUPPORT_TEXT", e.target.value)}
                                    placeholder="24/7"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Static pages content */}
                <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden">
                    <CardHeader className="bg-slate-50/60 p-8 border-b border-slate-100 flex flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                                <FileText className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="font-outfit font-black text-xs uppercase tracking-widest">
                                    Nội dung trang tĩnh
                                </CardTitle>
                                <CardDescription className="text-xs text-slate-500 font-medium mt-1">
                                    Chỉnh sửa nội dung các trang About, Chính sách vận chuyển, Bảo mật và Điều khoản dịch vụ.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                    Câu chuyện / giới thiệu ABOUT (ABOUT_STORY_TEXT)
                                </label>
                                <textarea
                                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-medium text-slate-900 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none min-h-[140px] text-sm"
                                    value={settings.ABOUT_STORY_TEXT || ""}
                                    onChange={(e) => updateSetting("ABOUT_STORY_TEXT", e.target.value)}
                                    placeholder="Nhập đoạn giới thiệu chính cho trang About (có thể xuống dòng, sẽ hiển thị dạng văn bản đẹp)."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                    Nội dung Chính sách vận chuyển (SHIPPING_POLICY_CONTENT)
                                </label>
                                <textarea
                                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-medium text-slate-900 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none min-h-[140px] text-sm"
                                    value={settings.SHIPPING_POLICY_CONTENT || ""}
                                    onChange={(e) => updateSetting("SHIPPING_POLICY_CONTENT", e.target.value)}
                                    placeholder="Nhập toàn bộ nội dung chính sách vận chuyển. Xuống dòng sẽ được giữ nguyên khi hiển thị."
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                    Nội dung Chính sách bảo mật (PRIVACY_POLICY_CONTENT)
                                </label>
                                <textarea
                                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-medium text-slate-900 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none min-h-[140px] text-sm"
                                    value={settings.PRIVACY_POLICY_CONTENT || ""}
                                    onChange={(e) => updateSetting("PRIVACY_POLICY_CONTENT", e.target.value)}
                                    placeholder="Nhập toàn bộ nội dung chính sách bảo mật."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                    Nội dung Điều khoản dịch vụ (TERMS_OF_SERVICE_CONTENT)
                                </label>
                                <textarea
                                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-medium text-slate-900 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none min-h-[140px] text-sm"
                                    value={settings.TERMS_OF_SERVICE_CONTENT || ""}
                                    onChange={(e) => updateSetting("TERMS_OF_SERVICE_CONTENT", e.target.value)}
                                    placeholder="Nhập toàn bộ nội dung điều khoản dịch vụ."
                                />
                            </div>
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium">
                            Gợi ý: Bạn có thể copy nội dung hiện tại của các trang này, chỉnh sửa lại rồi dán vào đây. Hệ thống sẽ tự động hiển thị nội dung mới ra
                            ngoài website với định dạng đẹp (giữ xuống dòng).
                        </p>
                    </CardContent>
                </Card>

                {/* Navigation & Footer Links */}
                <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden">
                    <CardHeader className="bg-slate-50/60 p-8 border-b border-slate-100 flex flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                                <FileText className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="font-outfit font-black text-xs uppercase tracking-widest">
                                    Menu &amp; footer links
                                </CardTitle>
                                <CardDescription className="text-xs text-slate-500 font-medium mt-1">
                                    Cấu hình menu chính (trên navbar) và các nhóm link ở footer bằng JSON.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                    Menu chính trên navbar (NAV_PRIMARY_LINKS)
                                </label>
                                <textarea
                                    className="w-full bg-slate-50 border-none rounded-2xl px-4 py-4 font-mono text-[11px] text-slate-900 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none min-h-[180px]"
                                    value={settings.NAV_PRIMARY_LINKS || ""}
                                    onChange={(e) => updateSetting("NAV_PRIMARY_LINKS", e.target.value)}
                                    placeholder={`Ví dụ:\n[\n  { "label": "Trang chủ", "href": "/", "icon": "🏠", "highlight": false },\n  { "label": "Flash Sale", "href": "/products?sale=true", "icon": "🔥", "highlight": true }\n]`}
                                />
                                <p className="text-[11px] text-slate-400 font-medium">
                                    Danh sách JSON các item: <code>label</code>, <code>href</code>, <code>icon</code> (emoji tuỳ chọn), <code>highlight</code> (true/false).
                                </p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                    Nhóm link dưới footer (FOOTER_LINK_GROUPS)
                                </label>
                                <textarea
                                    className="w-full bg-slate-50 border-none rounded-2xl px-4 py-4 font-mono text-[11px] text-slate-900 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none min-h-[180px]"
                                    value={settings.FOOTER_LINK_GROUPS || ""}
                                    onChange={(e) => updateSetting("FOOTER_LINK_GROUPS", e.target.value)}
                                    placeholder={`Ví dụ:\n[\n  {\n    "title": "Sản phẩm",\n    "links": [\n      { "label": "Tất cả đặc sản", "href": "/products" },\n      { "label": "Hải sản khô", "href": "/products?category=seafood" }\n    ]\n  },\n  {\n    "title": "Công ty",\n    "links": [\n      { "label": "Về LIKEFOOD", "href": "/about" },\n      { "label": "Chính sách vận chuyển", "href": "/policies/shipping" }\n    ]\n  }\n]`}
                                />
                                <p className="text-[11px] text-slate-400 font-medium">
                                    Nếu để trống, hệ thống sẽ dùng các nhóm link mặc định đang có trong footer.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}

