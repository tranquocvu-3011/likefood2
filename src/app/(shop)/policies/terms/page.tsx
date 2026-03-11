/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { Scale, Mail, MapPin, Phone, Info } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const revalidate = 86400; // 24 hours for static content

export const metadata: Metadata = {
    title: "Điều Khoản Dịch Vụ | LIKEFOOD",
    description: "Các điều khoản và quy định khi mua sắm tại Nền Tảng Đặc Sản Việt Nam - LIKEFOOD.",
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-12 md:py-20 lg:py-24">
            <div className="page-container-wide">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="relative bg-emerald-600 px-8 py-16 text-center overflow-hidden">
                        <div className="absolute inset-0 bg-[url('/pattern-light.svg')] opacity-10"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Scale className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">
                                Điều Khoản Dịch Vụ
                            </h1>
                            <p className="text-emerald-50 text-base md:text-lg max-w-2xl mx-auto font-medium">
                                Quy định và thỏa thuận sử dụng dịch vụ tại hệ thống phân phối đặc sản LIKEFOOD. Vui lòng đọc kỹ trước khi trải nghiệm mua sắm.
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 md:p-12 lg:p-16 prose prose-slate prose-emerald max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-emerald-600 hover:prose-a:text-emerald-700">
                        <p className="lead text-lg text-slate-600 font-medium mb-8">
                            Ngày cập nhật hiệu lực: <strong>01/01/2026</strong>.
                            <br />
                            Khi truy cập, mua sắm và tạo tài khoản tại <strong>LIKEFOOD</strong>, quý khách cam kết tuân thủ những khoản quy định được liệt kê chi tiết dưới đây.
                        </p>

                        <h2>1. Quyền Mua Sắm Học Viện Đặc Sản</h2>
                        <p>
                            Khi đăng nhập thành viên, quý khách hàng nhận được các quyền lợi ưu việt đi kèm:
                        </p>
                        <ul>
                            <li><strong>Xác Thực 2 Lớp (2FA):</strong> Tính năng tùy chọn giúp quý khách bảo mật ví điểm và địa chỉ giao hàng tuyệt đối.</li>
                            <li><strong>Khách Hàng Thân Thiết (Loyalty Tiers):</strong> Đặc quyền nhận Voucher từ Hệ thống Độc Quyền tùy vào số lượng thanh toán.</li>
                            <li><strong>Magic Link (Không cần Mật Khẩu):</strong> LIKEFOOD gửi liên kết trực tiếp vào Email Khách hàng chỉ bằng 1 Cú Click, giảm thiểu tối đa rủi ro quên tài khoản!</li>
                        </ul>

                        <h2>2. Chính Sách Thanh Toán & Giao Hàng</h2>
                        <p>
                            Mọi thông tin thanh toán hoàn toàn được xử lý dưới lớp mã hóa của các đối tác Cổng Thanh Toán uy tín (Stripe, PayPal, MoMo).
                            LIKEFOOD hỗ trợ giao hàng trên toàn nước Mỹ. Thời gian nhận hàng phụ thuộc khu vực và phương thức vận chuyển được chọn khi thanh toán.
                        </p>

                        <h2>3. Quyền Sở Hữu Trí Tuệ</h2>
                        <p>
                            Mọi tài nguyên điện tử, giao diện, hình ảnh thực phẩm, video quảng cáo và toàn bộ mã nguồn website đều thuộc bản quyền của <strong>LIKEFOOD by Tran Quoc Vu</strong>. Được bảo hộ bởi luật Việt Nam. Nghiêm cấm mọi hành vi sao chép, làm giả với hình thức gian lận thương mại.
                        </p>

                        <h2>4. Xóa Tài Khoản Vĩnh Viễn & Dữ Liệu</h2>
                        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 mt-6 not-prose mb-6">
                            <h3 className="font-black text-lg text-red-800 uppercase tracking-wide flex items-center gap-2">
                                <Info className="w-5 h-5" /> Điều Khoản Khắt Khe
                            </h3>
                            <p className="text-red-700 font-medium mt-2">
                                Nếu Quý Khách thực hiện lệnh &ldquo;Xóa Tài Khoản Vĩnh Viễn&rdquo; ở trang hồ sơ, toàn bộ Lịch Sử Mua Hàng, Số Điểm Loyalty Tích Lũy, và Thông Tin Cư Trú sẽ tự động bốc hơi khỏi hệ thống và <strong>không thể phục hồi</strong> do Cơ chế Chặn Hoàn Tác. Vui lòng suy nghĩ kỹ!
                            </p>
                        </div>

                        <h2>5. Trách Nhiệm Với Môi Trường Công Sở Số</h2>
                        <p>
                            Bằng cách chấp nhận Điều khoản này, bạn từ bỏ quyền lợi chạy Bot Spam, quét Auto Mua Giảm Giá, hoặc thực hiện bất kỳ hành vi <strong>DDoS, SQL Injection</strong> nào lên máy chủ LIKEFOOD.
                            Mọi đơn vị vi phạm bao gồm cả việc Spam API đều bị ghi lại IP và Block tự động vĩnh viễn ở cấp độ Vercel Edge Cache.
                        </p>

                        <h2>6. Chấp nhận Giải Quyết Tranh Chấp</h2>
                        <p>
                            Bất kỳ tranh chấp phát sinh từ việc sử dụng các dịch vụ của nền tảng sẽ được Tòa Án Hà Nội đại diện giải quyết trong khuôn khổ luật pháp Việt Nam hiện hành.
                        </p>

                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mt-10 not-prose space-y-4">
                            <h3 className="font-black text-lg text-slate-800 uppercase tracking-wide">LIÊN HỆ PHÁP LÝ LIKEFOOD</h3>
                            <div className="flex items-start gap-4 text-slate-600 font-medium">
                                <MapPin className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                <p>Phân khu Mỹ Gia 01, Vinhomes Ocean Park 2, Văn Giang, Hưng Yên</p>
                            </div>
                            <div className="flex items-center gap-4 text-slate-600 font-medium">
                                <Phone className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                                <p>02-315-8105</p>
                            </div>
                            <div className="flex items-center gap-4 text-slate-600 font-medium">
                                <Mail className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                                <a href="mailto:tranquocvu3011@gmail.com" className="hover:text-emerald-600 transition-colors">tranquocvu3011@gmail.com</a>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="mt-8 text-center flex items-center justify-center gap-4">
                    <Link href="/">
                        <Button variant="ghost" className="font-bold text-slate-500 hover:bg-slate-200 rounded-2xl h-12 px-6">
                            Quay lại Trang chủ
                        </Button>
                    </Link>
                    <Link href="/privacy">
                        <Button variant="outline" className="font-bold text-emerald-600 border-emerald-200 hover:bg-emerald-50 rounded-2xl h-12 px-6">
                            Đến Chính Sách Bảo Mật
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
