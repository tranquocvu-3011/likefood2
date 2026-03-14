/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Shipping Policy Page
 */

import { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";

export const revalidate = 3600;

type Locale = "vi" | "en";

const SHIPPING_COPY: Record<Locale, {
    title: string;
    metaDesc: string;
    backHome: string;
    heading: string;
    section1Title: string;
    section1Content: string;
    section2Title: string;
    section2Content: string;
    section3Title: string;
    section3Content: string;
    section4Title: string;
    section4Content: string;
    section5Title: string;
    commitment1: string;
    commitment2: string;
    commitment3: string;
}> = {
    vi: {
        title: "Chính Sách Vận Chuyển | LIKEFOOD",
        metaDesc: "Chính sách giao hàng của LIKEFOOD - Miễn phí vận chuyển cho đơn từ $500, phạm vi toàn nước Mỹ.",
        backHome: "← Quay lại trang chủ",
        heading: "Chính Sách Vận Chuyển",
        section1Title: "1. Phạm vi giao hàng",
        section1Content: "LIKEFOOD hiện phục vụ khách hàng trên toàn nước Mỹ. Một số khu vực xa hoặc đặc thù có thể cần thêm thời gian xử lý so với tuyến tiêu chuẩn.",
        section2Title: "2. Thời gian xử lý",
        section2Content: "Đơn hàng thường được xác nhận và chuẩn bị trong vòng 24 giờ làm việc. Thời gian giao thực tế phụ thuộc vào phương thức vận chuyển và địa chỉ nhận hàng.",
        section3Title: "3. Chi phí vận chuyển",
        section3Content: "Đơn từ <strong>$500</strong> được miễn phí vận chuyển. Với đơn dưới mức này, phí giao hàng sẽ được hiển thị rõ ngay trong bước checkout trước khi bạn xác nhận thanh toán.",
        section4Title: "4. Theo dõi đơn hàng",
        section4Content: "Khi đơn đã được bàn giao cho đơn vị vận chuyển, hệ thống sẽ cập nhật mã vận đơn trong chi tiết đơn hàng để bạn dễ theo dõi tiến trình giao nhận.",
        section5Title: "5. Cam kết",
        commitment1: "Thông tin giao hàng minh bạch",
        commitment2: "Theo dõi đơn sau khi cập nhật mã vận đơn",
        commitment3: "Hỗ trợ khách hàng 24/7",
    },
    en: {
        title: "Shipping Policy | LIKEFOOD",
        metaDesc: "LIKEFOOD shipping policy - Free shipping for orders over $500, nationwide U.S. delivery.",
        backHome: "← Back to home",
        heading: "Shipping Policy",
        section1Title: "1. Delivery area",
        section1Content: "LIKEFOOD currently serves customers across the United States. Some remote or special areas may require additional processing time compared to standard routes.",
        section2Title: "2. Processing time",
        section2Content: "Orders are usually confirmed and prepared within 24 business hours. Actual delivery time depends on shipping method and delivery address.",
        section3Title: "3. Shipping cost",
        section3Content: "Orders from <strong>$500</strong> qualify for free shipping. For orders below this threshold, shipping fees will be clearly displayed at checkout before you confirm payment.",
        section4Title: "4. Order tracking",
        section4Content: "Once the order is handed to the courier, the system will update the tracking number in your order details so you can easily track delivery progress.",
        section5Title: "5. Commitments",
        commitment1: "Transparent shipping information",
        commitment2: "Order tracking after tracking number update",
        commitment3: "24/7 customer support",
    },
};

export async function generateMetadata(): Promise<Metadata> {
    const cookieStore = await cookies();
    const locale: Locale = cookieStore.get("language")?.value === "en" ? "en" : "vi";
    const copy = SHIPPING_COPY[locale];

    return {
        title: copy.title,
        description: copy.metaDesc,
        alternates: { canonical: "/policies/shipping" },
    };
}

export default async function ShippingPolicyPage() {
    const cookieStore = await cookies();
    const locale: Locale = cookieStore.get("language")?.value === "en" ? "en" : "vi";
    const copy = SHIPPING_COPY[locale];

    return (
        <div className="min-h-screen bg-slate-50 py-12 md:py-20 lg:py-24">
            <div className="page-container-wide">
                <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-slate-500 transition hover:text-primary mb-12">
                    {copy.backHome}
                </Link>

                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 lg:p-16">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                        {copy.heading}
                    </h1>

                    <div className="prose prose-slate max-w-none prose-headings:font-black prose-headings:tracking-tight">
                        <section>
                            <h2>{copy.section1Title}</h2>
                            <p>{copy.section1Content}</p>
                        </section>

                        <section>
                            <h2>{copy.section2Title}</h2>
                            <p>{copy.section2Content}</p>
                        </section>

                        <section>
                            <h2>{copy.section3Title}</h2>
                            <p dangerouslySetInnerHTML={{ __html: copy.section3Content }} />
                        </section>

                        <section>
                            <h2>{copy.section4Title}</h2>
                            <p>{copy.section4Content}</p>
                        </section>

                        <section>
                            <h2>{copy.section5Title}</h2>
                            <ul>
                                <li>{copy.commitment1}</li>
                                <li>{copy.commitment2}</li>
                                <li>{copy.commitment3}</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
