/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { ShieldCheck, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const revalidate = 86400; // 24 hours for static content

export const metadata: Metadata = {
    title: "Chính Sách Bảo Mật | LIKEFOOD",
    description: "Chính sách bảo mật thông tin và quyền riêng tư của khách hàng tại LIKEFOOD.",
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-12 md:py-20 lg:py-24">
            <div className="page-container-wide">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="relative bg-emerald-600 px-8 py-16 text-center overflow-hidden">
                        <div className="absolute inset-0 bg-[url('/pattern-light.svg')] opacity-10"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <ShieldCheck className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">
                                Chính Sách Bảo Mật
                            </h1>
                            <p className="text-emerald-50 text-base md:text-lg max-w-2xl mx-auto font-medium">
                                Sự riêng tư và an toàn dữ liệu của bạn là ưu tiên hàng đầu tại LIKEFOOD. Dưới đây là cách chúng tôi bảo vệ thông tin cá nhân của bạn.
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 md:p-12 lg:p-16 prose prose-slate prose-emerald max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-emerald-600 hover:prose-a:text-emerald-700">
                        <p className="lead text-lg text-slate-600 font-medium mb-8">
                            Ngày cập nhật hiệu lực: <strong>01/01/2026</strong>.
                            <br />
                            Chào mừng bạn đến với <strong>LIKEFOOD</strong>. Việc bạn truy cập và sử dụng Website đồng nghĩa với việc bạn đồng ý với các điều khoản bảo mật dưới đây.
                        </p>

                        <h2>1. Mục đích và phạm vi thu thập thông tin</h2>
                        <p>
                            LIKEFOOD không bán, chia sẻ hay trao đổi thông tin cá nhân của khách hàng thu thập trên trang web cho một bên thứ ba nào khác. Thông tin cá nhân thu thập được sẽ chỉ được sử dụng trong nội bộ công ty.
                        </p>
                        <p>Khi bạn đăng ký tài khoản hoặc mua hàng tại LIKEFOOD, thông tin cá nhân mà chúng tôi thu thập bao gồm:</p>
                        <ul>
                            <li>Họ và Tên</li>
                            <li>Địa chỉ Email</li>
                            <li>Số Điện Thoại</li>
                            <li>Địa chỉ giao hàng</li>
                        </ul>
                        <p>
                            Những thông tin trên sẽ được sử dụng cho một hoặc tất cả các mục đích sau đây:
                        </p>
                        <ul>
                            <li>Giao hàng nguyên bản đặc sản quý khách đã mua tại LIKEFOOD.</li>
                            <li>Thông báo về việc giao hàng và hỗ trợ khách hàng.</li>
                            <li>Cung cấp thông tin liên quan đến sản phẩm.</li>
                            <li>Xử lý đơn đặt hàng và cung cấp dịch vụ, phần mềm qua trang web của chúng tôi theo yêu cầu của quý khách.</li>
                        </ul>

                        <h2>2. Phạm vi sử dụng thông tin</h2>
                        <p>
                            Thông tin cá nhân thu thập được sẽ chỉ được LIKEFOOD sử dụng trong nội bộ dự án và cho một hoặc tất cả các mục đích như đã nêu trên. Chúng tôi có thể chia sẻ tên, số điện thoại và địa chỉ của quý khách cho dịch vụ chuyển phát nhanh để có thể giao hàng cho quý khách.
                        </p>

                        <h2>3. Thời gian lưu trữ thông tin</h2>
                        <p>
                            Dữ liệu cá nhân của Khách hàng sẽ được lưu trữ định kỳ cho đến khi có yêu cầu hủy bỏ hoặc tự khách hàng đăng nhập và thực hiện hủy bỏ tại <Link href="/profile">Trang Thông tin cá nhân</Link>. Đối với tài khoản bị đóng, thông tin sẽ được xóa hoàn toàn khỏi cơ sở dữ liệu sau 30 ngày.
                        </p>

                        <h2>4. Địa chỉ của đơn vị thu thập và quản lý thông tin cá nhân</h2>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mt-6 not-prose space-y-4">
                            <h3 className="font-black text-lg text-slate-800 uppercase tracking-wide">HỆ THỐNG ĐẶC SẢN LIKEFOOD</h3>
                            <div className="flex items-start gap-4 text-slate-600 font-medium">
                                <MapPin className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                <p>Phân khu Mỹ Gia 01, Vinhomes Ocean Park 2, Văn Giang, Hưng Yên</p>
                            </div>
                            <div className="flex items-center gap-4 text-slate-600 font-medium">
                                <Phone className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                                <p>02-315-8105 (Hotline hỗ trợ 24/7)</p>
                            </div>
                            <div className="flex items-center gap-4 text-slate-600 font-medium">
                                <Mail className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                                <a href="mailto:tranquocvu3011@gmail.com" className="hover:text-emerald-600 transition-colors">tranquocvu3011@gmail.com</a>
                            </div>
                        </div>

                        <h2>5. Phương tiện và công cụ để người dùng tiếp cận và chỉnh sửa dữ liệu cá nhân</h2>
                        <p>
                            Khách hàng có quyền tự kiểm tra, cập nhật, điều chỉnh hoặc hủy bỏ thông tin cá nhân của mình bằng cách đăng nhập vào tài khoản trên website LIKEFOOD và chỉnh sửa thông tin cá nhân. Đối với việc thay đổi email hoặc xóa tài khoản vĩnh viễn, khách hàng sẽ cần phải cung cấp mật khẩu hoặc mã OTP xác thực 2 lớp (2FA) nhằm đảm bảo an toàn tuyệt đối.
                        </p>

                        <h2>6. Cơ chế Hệ thống Xác thực Đa tầng (2FA) & Mã Hóa Hệ Thống</h2>
                        <p>
                            Chúng tôi ứng dụng các tiêu chuẩn an ninh phần mềm cao nhất bao gồm:
                        </p>
                        <ul>
                            <li><strong>Session Caching 15 Phút:</strong> Đối với các vùng dữ liệu nhạy cảm hoặc giao diện thanh toán.</li>
                            <li><strong>Phòng chống Hacker (XSS, CSRF, DDoS):</strong> Bảo vệ bởi lớp lá chắn Firewall cấp độ Vercel Edge.</li>
                            <li><strong>Xác thực 2 Bước Tự chọn (2FA):</strong> Ngăn ngừa kẻ gian truy cập dữ liệu khi bị lộ mật khẩu. Bất cứ hành động đăng nhập từ môi trường lạ nào cũng sẽ kích hoạt Email Cảnh Báo.</li>
                        </ul>

                        <h2>7. Cập nhật Chính sách</h2>
                        <p>
                            LIKEFOOD có quyền thay đổi, chỉnh sửa Chính sách Bảo mật này bất kỳ lúc nào để phù hợp với định luật pháp hiện hành hoặc sự thay đổi của công nghệ. Mọi thay đổi sẽ được công bố chính thức công khai trên trang web của chúng tôi.
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center flex items-center justify-center gap-4">
                    <Link href="/">
                        <Button variant="ghost" className="font-bold text-slate-500 hover:bg-slate-200 rounded-2xl h-12 px-6">
                            Quay lại Trang chủ
                        </Button>
                    </Link>
                    <Link href="/terms">
                        <Button variant="outline" className="font-bold text-emerald-600 border-emerald-200 hover:bg-emerald-50 rounded-2xl h-12 px-6">
                            Đến Điều Khoản Dịch Vụ
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
