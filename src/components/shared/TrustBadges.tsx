/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { ShieldCheck, Truck, RefreshCw, CreditCard } from "lucide-react";

const BADGES = [
    {
        icon: ShieldCheck,
        title: "100% Chính Hãng",
        desc: "Nguồn gốc rõ ràng",
        color: "text-emerald-600",
        bg: "bg-emerald-50 hover:bg-emerald-100",
        border: "border-emerald-100",
    },
    {
        icon: Truck,
        title: "Miễn Phí Vận Chuyển",
        desc: "Đơn từ 399K trở lên",
        color: "text-sky-600",
        bg: "bg-sky-50 hover:bg-sky-100",
        border: "border-sky-100",
    },
    {
        icon: RefreshCw,
        title: "Đổi Trả Dễ Dàng",
        desc: "Hỗ trợ trong 30 ngày",
        color: "text-amber-600",
        bg: "bg-amber-50 hover:bg-amber-100",
        border: "border-amber-100",
    },
    {
        icon: CreditCard,
        title: "Thanh Toán An Toàn",
        desc: "Bảo mật SSL & đối tác uy tín",
        color: "text-violet-600",
        bg: "bg-violet-50 hover:bg-violet-100",
        border: "border-violet-100",
    },
];

export default function TrustBadges() {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 py-6">
            {BADGES.map((badge) => (
                <div
                    key={badge.title}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 cursor-default group ${badge.bg} ${badge.border}`}
                >
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <badge.icon className={`w-4 h-4 ${badge.color}`} />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[12px] font-semibold text-slate-800 leading-tight">{badge.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">{badge.desc}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
