/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { ShieldCheck, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import { getContactInfo } from "@/lib/contact-info";

export const revalidate = 86400; // 24 hours for static content

const PRIVACY_COPY = {
    vi: {
        title: "Chính Sách Bảo Mật | LIKEFOOD",
        description: "Chính sách bảo mật thông tin và quyền riêng tư của khách hàng tại LIKEFOOD.",
        heroTitle: "Chính Sách Bảo Mật",
        heroDesc: "Quyền riêng tư và an toàn dữ liệu của bạn là ưu tiên hàng đầu tại LIKEFOOD. Dưới đây là cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn.",
        updated: "Ngày cập nhật hiệu lực:",
        intro: "Chào mừng bạn đến với LIKEFOOD. Việc bạn truy cập và sử dụng website đồng nghĩa với việc bạn đồng ý với các điều khoản bảo mật dưới đây.",
        sections: [
            {
                heading: "1. Mục đích và phạm vi thu thập thông tin",
                paragraphs: [
                    "LIKEFOOD không bán, chia sẻ hay trao đổi thông tin cá nhân của khách hàng cho bên thứ ba không liên quan.",
                    "Thông tin thu thập được sử dụng nội bộ để xử lý đơn hàng, chăm sóc khách hàng và cải thiện trải nghiệm mua sắm.",
                ],
                bullets: [
                    "Họ và tên",
                    "Địa chỉ email",
                    "Số điện thoại",
                    "Địa chỉ giao hàng",
                ],
            },
            {
                heading: "2. Phạm vi sử dụng thông tin",
                paragraphs: [
                    "Dữ liệu chỉ được dùng cho các mục đích vận hành đơn hàng, hỗ trợ sau bán và thông báo liên quan đến giao dịch.",
                    "Trong trường hợp cần giao hàng, thông tin liên hệ và địa chỉ có thể được chia sẻ với đơn vị vận chuyển.",
                ],
            },
            {
                heading: "3. Thời gian lưu trữ thông tin",
                paragraphs: [
                    "Dữ liệu cá nhân được lưu trữ cho đến khi khách hàng yêu cầu xóa hoặc tự thực hiện xóa tài khoản.",
                    "Tài khoản đóng sẽ được xử lý xóa dữ liệu vĩnh viễn theo quy trình nội bộ và quy định pháp lý hiện hành.",
                ],
            },
            {
                heading: "4. Quyền của người dùng",
                paragraphs: [
                    "Khách hàng có quyền truy cập, cập nhật, điều chỉnh hoặc yêu cầu xóa thông tin cá nhân.",
                    "Các thao tác nhạy cảm như đổi email hoặc xóa tài khoản có thể yêu cầu xác thực bổ sung để đảm bảo an toàn.",
                ],
            },
            {
                heading: "5. Bảo mật hệ thống",
                paragraphs: [
                    "Chúng tôi áp dụng các lớp bảo vệ cho phiên đăng nhập, request và xử lý thanh toán để giảm rủi ro.",
                    "Hệ thống được giám sát để phát hiện và ngăn chặn hành vi bất thường, truy cập trái phép hoặc tấn công.",
                ],
            },
            {
                heading: "6. Cập nhật chính sách",
                paragraphs: [
                    "LIKEFOOD có thể cập nhật chính sách theo thay đổi pháp lý hoặc công nghệ.",
                    "Mọi cập nhật sẽ được công bố trên website và có hiệu lực từ thời điểm được nêu rõ.",
                ],
            },
        ],
        contactTitle: "Hệ thống đặc sản LIKEFOOD",
        hotline: "Hotline hỗ trợ 24/7",
        backHome: "Quay lại trang chủ",
        gotoTerms: "Đến Điều Khoản Dịch Vụ",
    },
    en: {
        title: "Privacy Policy | LIKEFOOD",
        description: "How LIKEFOOD collects, uses, and protects customer personal data.",
        heroTitle: "Privacy Policy",
        heroDesc: "Your privacy and data safety are top priorities at LIKEFOOD. This page explains how we protect and use your personal information.",
        updated: "Effective update date:",
        intro: "Welcome to LIKEFOOD. By accessing and using our website, you agree to the privacy terms below.",
        sections: [
            {
                heading: "1. Data collection purpose and scope",
                paragraphs: [
                    "LIKEFOOD does not sell, trade, or share customer personal data with unrelated third parties.",
                    "Collected data is used internally to process orders, support customers, and improve shopping experience.",
                ],
                bullets: [
                    "Full name",
                    "Email address",
                    "Phone number",
                    "Shipping address",
                ],
            },
            {
                heading: "2. Data usage scope",
                paragraphs: [
                    "Data is used only for order operations, after-sales support, and transaction-related notifications.",
                    "When required for delivery, contact details and shipping address may be shared with delivery partners.",
                ],
            },
            {
                heading: "3. Data retention",
                paragraphs: [
                    "Personal data is retained until the customer requests deletion or deletes their account.",
                    "Closed accounts are processed for permanent deletion according to internal procedures and applicable regulations.",
                ],
            },
            {
                heading: "4. User rights",
                paragraphs: [
                    "Customers may access, update, correct, or request deletion of their personal data.",
                    "Sensitive actions such as changing email or deleting account may require additional verification for security.",
                ],
            },
            {
                heading: "5. Platform security",
                paragraphs: [
                    "We apply layered protection for sessions, requests, and payment flows to reduce risk.",
                    "The platform is monitored to detect and block abnormal behavior, unauthorized access, and attacks.",
                ],
            },
            {
                heading: "6. Policy updates",
                paragraphs: [
                    "LIKEFOOD may update this policy to reflect legal or technology changes.",
                    "All updates will be published on our website and become effective as stated.",
                ],
            },
        ],
        contactTitle: "LIKEFOOD Specialty Marketplace",
        hotline: "24/7 support hotline",
        backHome: "Back to home",
        gotoTerms: "Go to Terms of Service",
    },
} as const;

export async function generateMetadata(): Promise<Metadata> {
    const cookieStore = await cookies();
    const locale = cookieStore.get("language")?.value === "en" ? "en" : "vi";
    const copy = PRIVACY_COPY[locale];

    return {
        title: copy.title,
        description: copy.description,
        alternates: { canonical: "/policies/privacy" },
    };
}

export default async function PrivacyPage() {
    const cookieStore = await cookies();
    const locale = cookieStore.get("language")?.value === "en" ? "en" : "vi";
    const copy = PRIVACY_COPY[locale];
    const contact = await getContactInfo();

    return (
        <div className="min-h-screen bg-slate-50 py-12 md:py-20 lg:py-24">
            <div className="page-container-wide">
                <div className="overflow-hidden rounded-3xl bg-white shadow-xl">
                    <div className="relative overflow-hidden bg-emerald-600 px-8 py-16 text-center">
                        <div className="absolute inset-0 bg-[url('/pattern-light.svg')] opacity-10" />
                        <div className="relative z-10">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                                <ShieldCheck className="h-8 w-8 text-white" />
                            </div>
                            <h1 className="mb-4 text-3xl font-black tracking-tight text-white md:text-4xl lg:text-5xl">{copy.heroTitle}</h1>
                            <p className="mx-auto max-w-2xl text-base font-medium text-emerald-50 md:text-lg">{copy.heroDesc}</p>
                        </div>
                    </div>

                    <div className="prose prose-emerald prose-slate max-w-none p-8 md:p-12 lg:p-16 prose-headings:tracking-tight prose-headings:font-black">
                        <p className="mb-8 text-lg font-medium text-slate-600">
                            {copy.updated} <strong>01/01/2026</strong>.
                            <br />
                            {copy.intro}
                        </p>

                        {copy.sections.map((section) => (
                            <section key={section.heading}>
                                <h2>{section.heading}</h2>
                                {section.paragraphs.map((paragraph) => (
                                    <p key={paragraph}>{paragraph}</p>
                                ))}
                                {section.bullets && (
                                    <ul>
                                        {section.bullets.map((bullet) => (
                                            <li key={bullet}>{bullet}</li>
                                        ))}
                                    </ul>
                                )}
                            </section>
                        ))}

                        <div className="not-prose mt-10 space-y-4 rounded-2xl border border-slate-100 bg-slate-50 p-6">
                            <h3 className="text-lg font-black uppercase tracking-wide text-slate-800">{copy.contactTitle}</h3>
                            <div className="flex items-start gap-4 font-medium text-slate-600">
                                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                                <p>{contact.address}</p>
                            </div>
                            <div className="flex items-center gap-4 font-medium text-slate-600">
                                <Phone className="h-5 w-5 shrink-0 text-emerald-600" />
                                <p>{contact.phone} ({copy.hotline})</p>
                            </div>
                            <div className="flex items-center gap-4 font-medium text-slate-600">
                                <Mail className="h-5 w-5 shrink-0 text-emerald-600" />
                                <a href={`mailto:${contact.email}`} className="transition-colors hover:text-emerald-600">{contact.email}</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-center gap-4 text-center">
                    <Link href="/">
                        <Button variant="ghost" className="h-12 rounded-2xl px-6 font-bold text-slate-500 hover:bg-slate-200">
                            {copy.backHome}
                        </Button>
                    </Link>
                    <Link href="/policies/terms">
                        <Button variant="outline" className="h-12 rounded-2xl border-emerald-200 px-6 font-bold text-emerald-600 hover:bg-emerald-50">
                            {copy.gotoTerms}
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
