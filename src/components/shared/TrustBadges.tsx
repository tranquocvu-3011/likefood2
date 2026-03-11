/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { ShieldCheck, Truck, RefreshCw, CreditCard } from "lucide-react";

const badges = [
    {
        icon: ShieldCheck,
        title: "100% Chính Hãng",
        description: "Cam kết nguồn gốc",
        gradient: "from-blue-400 to-blue-600",
        bg: "bg-blue-50",
    },
    {
        icon: Truck,
        title: "Miễn Phí Vận Chuyển",
        description: "Đơn từ 500$",
        gradient: "from-emerald-400 to-emerald-600",
        bg: "bg-emerald-50",
    },
    {
        icon: RefreshCw,
        title: "Đổi Trả 30 Ngày",
        description: "Không cần lý do",
        gradient: "from-amber-400 to-amber-600",
        bg: "bg-amber-50",
    },
    {
        icon: CreditCard,
        title: "Thanh Toán An Toàn",
        description: "SSL Encryption",
        gradient: "from-purple-400 to-purple-600",
        bg: "bg-purple-50",
    },
];

export default function TrustBadges() {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 py-12">
            {badges.map((badge, idx) => (
                <div
                    key={idx}
                    className={`flex flex-col items-center text-center p-6 rounded-2xl ${badge.bg} hover:bg-white hover:shadow-md transition-all group cursor-pointer`}
                >
                    <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${badge.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                        <badge.icon className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 mb-1">
                        {badge.title}
                    </h4>
                    <p className="text-xs text-slate-500">{badge.description}</p>
                </div>
            ))}
        </div>
    );
}
