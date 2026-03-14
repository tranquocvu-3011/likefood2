"use client";

/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { ShieldCheck, RefreshCcw, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/context";

export default function ReturnPolicyPage() {
    const { language } = useLanguage();
    const isVi = language === "vi";

    return (
        <div className="min-h-screen bg-slate-50 py-24">
            <div className="page-container-wide">
                <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-primary transition-colors mb-12">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-bold uppercase tracking-widest">{isVi ? "Quay lại trang chủ" : "Back to home"}</span>
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[3rem] p-12 lg:p-20 shadow-xl shadow-slate-200/50 border border-slate-100"
                >
                    <div className="flex items-center gap-6 mb-12">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <RefreshCcw className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter text-slate-900">
                            {isVi ? "Chính sách" : "Return"} <span className="text-primary">{isVi ? "Đổi trả" : "Policy"}</span>
                        </h1>
                    </div>

                    <div className="prose prose-slate max-w-none space-y-12 text-lg text-slate-600 leading-relaxed font-medium">
                        <section>
                            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-6 uppercase">{isVi ? "1. Cam kết chất lượng" : "1. Quality commitment"}</h2>
                            <p>
                                {isVi
                                    ? "Vì đặc thù sản phẩm là thực phẩm, LIKEFOOD luôn đặt tiêu chí an toàn và chất lượng lên hàng đầu. Chúng tôi cam kết sản phẩm đến tay bạn đạt chuẩn và đúng mô tả."
                                    : "Because our products are food items, LIKEFOOD prioritizes safety and quality. We commit that delivered products meet standards and match product descriptions."}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-6">{isVi ? "2. Trường hợp được đổi trả" : "2. Eligible return cases"}</h2>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-1" />
                                    <span>{isVi ? "Sản phẩm bị lỗi do nhà sản xuất (hư hỏng bao bì, hết hạn sử dụng)." : "Product defects from manufacturing (damaged packaging, expired items)."}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-1" />
                                    <span>{isVi ? "Sản phẩm bị biến chất, hư hỏng trong quá trình vận chuyển." : "Product quality damaged during shipping."}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-1" />
                                    <span>{isVi ? "Giao sai loại sản phẩm hoặc thiếu số lượng so với đơn hàng." : "Incorrect item delivered or missing quantity versus order."}</span>
                                </li>
                            </ul>
                        </section>

                        <section>
                                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-6">{isVi ? "3. Quy trình đổi trả" : "3. Return process"}</h2>
                            <p>
                                {isVi
                                    ? "Vui lòng liên hệ trong vòng 48 giờ kể từ khi nhận hàng kèm hình ảnh hoặc video mở hộp. LIKEFOOD sẽ kiểm tra và xử lý hoàn tiền hoặc gửi bù sản phẩm thay thế trong thời gian phù hợp."
                                    : "Please contact us within 48 hours of delivery with unboxing photos or videos. LIKEFOOD will review and process a refund or replacement according to policy."}
                            </p>
                            <div className="p-8 bg-orange-50 rounded-[2rem] border border-orange-100 mt-6 flex gap-4 items-center">
                                <AlertCircle className="w-8 h-8 text-orange-600 shrink-0" />
                                <p className="text-sm font-bold text-orange-800 tracking-tight">
                                    {isVi
                                        ? "Lưu ý: Chúng tôi không chấp nhận đổi trả với lý do không hợp khẩu vị hoặc sản phẩm đã mở bao bì và sử dụng quá 10%."
                                        : "Note: We do not accept returns for taste preference only, or for products already opened and used beyond 10%."}
                                </p>
                            </div>
                        </section>

                        <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row gap-8 items-center text-sm font-bold uppercase tracking-widest text-slate-400">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-green-500" />
                                {isVi ? "Quyền lợi khách hàng trên hết" : "Customer rights come first"}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
