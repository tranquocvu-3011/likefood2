/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

"use client";

import { ShieldCheck, RefreshCcw, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ReturnPolicyPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-24">
            <div className="page-container-wide">
                <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-primary transition-colors mb-12">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-bold uppercase tracking-widest">Quay lại trang chủ</span>
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
                            Chính sách <span className="text-primary">Đổi trả</span>
                        </h1>
                    </div>

                    <div className="prose prose-slate max-w-none space-y-12 text-lg text-slate-600 leading-relaxed font-medium">
                        <section>
                            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-6 uppercase">1. Cam kết chất lượng</h2>
                            <p>
                                Vì đặc thù sản phẩm là thực phẩm, LIKEFOOD luôn đặt tiêu chí an toàn và chất lượng lên hàng đầu.
                                Chúng tôi cam kết sản phẩm đến tay bạn luôn đạt chuẩn FDA và đúng như mô tả.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-6">2. Trường hợp được đổi trả</h2>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-1" />
                                    <span>Sản phẩm bị lỗi do nhà sản xuất (hư hỏng bao bì, hết hạn sử dụng).</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-1" />
                                    <span>Sản phẩm bị biến chất, hư hỏng trong quá trình vận chuyển.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-1" />
                                    <span>Giao sai loại sản phẩm hoặc thiếu số lượng so với đơn hàng.</span>
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-6">3. Quy trình đổi trả</h2>
                            <p>
                                Vui lòng liên hệ với chúng tôi trong vòng **48 giờ** kể từ khi nhận hàng kèm theo hình ảnh/video mở hộp.
                                LIKEFOOD sẽ cử đội ngũ kiểm tra và xử lý hoàn tiền hoặc gửi bù sản phẩm mới trong vòng 24h.
                            </p>
                            <div className="p-8 bg-orange-50 rounded-[2rem] border border-orange-100 mt-6 flex gap-4 items-center">
                                <AlertCircle className="w-8 h-8 text-orange-600 shrink-0" />
                                <p className="text-sm font-bold text-orange-800 tracking-tight">
                                    LƯU Ý: Chúng tôi không chấp nhận đổi trả với lý do &quot;không thích vị&quot; hoặc các sản phẩm đã được khui bao bì và sử dụng quá 10%.
                                </p>
                            </div>
                        </section>

                        <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row gap-8 items-center text-sm font-bold uppercase tracking-widest text-slate-400">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-green-500" />
                                Quyền lợi khách hàng trên hết
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
