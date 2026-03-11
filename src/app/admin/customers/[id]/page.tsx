"use client";

/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Heart,
  Loader2,
  Mail,
  MapPin,
  Package,
  Phone,
  ShoppingBag,
  Star,
  UserRound,
} from "lucide-react";
import { AdminCard, AdminPageContainer } from "@/components/admin/AdminPageContainer";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/currency";

interface CustomerDetail {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  image: string | null;
  createdAt: string;
  totalSpent: number;
  completedOrders: number;
  avgOrderValue: number;
  addresses: Array<{
    id: string;
    address: string;
    city: string;
    state: string | null;
    zipCode: string;
    country: string;
    fullName: string;
    phone: string;
  }>;
  orders: Array<{
    id: string;
    status: string;
    total: number;
    createdAt: string;
    items: Array<{
      quantity: number;
      product: { name: string; image: string | null };
    }>;
  }>;
  reviews: Array<{
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    product: { name: string; slug: string | null };
  }>;
  wishlists: Array<{
    id: string;
    product: { name: string; image: string | null; price: number };
  }>;
  _count: {
    orders: number;
    reviews: number;
    wishlists: number;
  };
}

type DetailTab = "orders" | "reviews" | "wishlist";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Chờ xử lý",
  CONFIRMED: "Đã xác nhận",
  PROCESSING: "Đang chuẩn bị",
  SHIPPING: "Đang giao",
  DELIVERED: "Đã giao",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
  REFUNDED: "Đã hoàn tiền",
  SHIPPED: "Đang giao",
};

const STATUS_TONES: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-sky-100 text-sky-700",
  PROCESSING: "bg-indigo-100 text-indigo-700",
  SHIPPING: "bg-violet-100 text-violet-700",
  DELIVERED: "bg-emerald-100 text-emerald-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-rose-100 text-rose-700",
  REFUNDED: "bg-slate-200 text-slate-700",
  SHIPPED: "bg-violet-100 text-violet-700",
};

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params?.id as string;
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState<DetailTab>("orders");

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/admin/customers/${customerId}`);
        if (!response.ok) {
          router.push("/admin/customers");
          return;
        }
        const data = await response.json();
        setCustomer(data);
      } catch {
        router.push("/admin/customers");
      } finally {
        setIsLoading(false);
      }
    };

    if (customerId) {
      void load();
    }
  }, [customerId, router]);

  const metrics = useMemo(() => {
    if (!customer) {
      return [
        { label: "Tổng doanh thu", value: "$0.00" },
        { label: "Đơn hoàn thành", value: "0" },
        { label: "Giá trị TB", value: "$0.00" },
        { label: "Sản phẩm yêu thích", value: "0" },
      ];
    }

    return [
      { label: "Tổng doanh thu", value: formatPrice(customer.totalSpent) },
      { label: "Đơn hoàn thành", value: `${customer.completedOrders}` },
      { label: "Giá trị TB", value: formatPrice(customer.avgOrderValue) },
      { label: "Sản phẩm yêu thích", value: `${customer._count.wishlists}` },
    ];
  }, [customer]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <AdminPageContainer
      title={customer.name || customer.email}
      subtitle="Xem giá trị khách hàng, hành vi đơn hàng, đánh giá và danh sách yêu thích."
      action={
        <Link href="/admin/customers">
          <Button variant="outline" size="lg">
            <ArrowLeft className="h-4 w-4" />
            Quay lại khách hàng
          </Button>
        </Link>
      }
    >
      <div className="grid gap-4 lg:grid-cols-4">
        {metrics.map((metric) => (
          <AdminCard key={metric.label} className="p-5">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">{metric.label}</p>
            <p className="mt-2 text-3xl font-black text-slate-950">{metric.value}</p>
          </AdminCard>
        ))}
      </div>

      <div className="grid gap-8 xl:grid-cols-[0.92fr_1.08fr]">
        <AdminCard>
          <div className="flex flex-col items-center text-center">
            <div
              className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 text-slate-700"
              style={customer.image ? { backgroundImage: `url(${customer.image})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
            >
              {!customer.image ? <UserRound className="h-9 w-9" /> : null}
            </div>
            <h2 className="mt-5 text-2xl font-black tracking-tight text-slate-950">{customer.name || "Không có tên"}</h2>
            <p className="mt-2 text-sm text-slate-500">Hồ sơ khách hàng chính thức dùng cho chăm sóc và hỗ trợ.</p>
          </div>

          <div className="mt-8 space-y-3 text-sm text-slate-600">
            <InfoRow icon={Mail} label="Email" value={customer.email} />
            <InfoRow icon={Phone} label="Điện thoại" value={customer.phone || "Không có số điện thoại"} />
            <InfoRow
              icon={Calendar}
              label="Tham gia"
              value={new Date(customer.createdAt).toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            />
          </div>

          <div className="mt-8 border-t border-slate-100 pt-8">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Địa chỉ đã lưu</p>
            <div className="mt-4 space-y-3">
              {customer.addresses.length === 0 ? (
                <EmptyBlock message="Khách hàng này chưa có địa chỉ nào." />
              ) : (
                customer.addresses.map((address) => (
                  <div key={address.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-1 h-4 w-4 text-slate-400" />
                      <div>
                        <p className="font-black text-slate-950">{address.fullName}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          {address.address}, {address.city}
                          {address.state ? `, ${address.state}` : ""} {address.zipCode}, {address.country}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">{address.phone}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </AdminCard>

        <div className="space-y-8">
          <AdminCard>
            <div className="flex flex-wrap gap-2 rounded-full border border-slate-200 bg-slate-50 p-1">
              {[
                { key: "orders", label: `Đơn hàng (${customer._count.orders})` },
                { key: "reviews", label: `Đánh giá (${customer._count.reviews})` },
                { key: "wishlist", label: `Yêu thích (${customer._count.wishlists})` },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setTab(item.key as DetailTab)}
                  className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.16em] transition ${
                    tab === item.key ? "bg-slate-950 text-white" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="mt-6 space-y-4">
              {tab === "orders" ? (
                customer.orders.length === 0 ? (
                  <EmptyBlock message="Khách hàng này chưa có đơn hàng nào." />
                ) : (
                  customer.orders.map((order) => {
                    const totalUnits = order.items.reduce((sum, item) => sum + item.quantity, 0);
                    const productNames = order.items.map((item) => item.product.name).filter(Boolean);
                    const status = order.status.toUpperCase();
                    return (
                      <Link key={order.id} href={`/admin/orders/${order.id}`} className="block">
                        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 transition hover:border-slate-300 hover:bg-white">
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                              <p className="font-black text-slate-950">Order #{order.id.slice(-8).toUpperCase()}</p>
                              <p className="mt-2 text-sm leading-6 text-slate-500">{productNames.slice(0, 3).join(", ") || "No items recorded"}</p>
                              <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                                {totalUnits} sản phẩm · {new Date(order.createdAt).toLocaleDateString("vi-VN", { month: "short", day: "2-digit", year: "numeric" })}
                              </p>
                            </div>
                            <div className="flex flex-col items-start gap-3 lg:items-end">
                              <span className={`rounded-full px-3 py-2 text-[11px] font-black uppercase tracking-[0.16em] ${STATUS_TONES[status] || "bg-slate-200 text-slate-700"}`}>
                                {STATUS_LABELS[status] || status}
                              </span>
                              <span className="text-lg font-black text-slate-950">{formatPrice(order.total)}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })
                )
              ) : null}

              {tab === "reviews" ? (
                customer.reviews.length === 0 ? (
                  <EmptyBlock message="Khách hàng này chưa có đánh giá nào." />
                ) : (
                  customer.reviews.map((review) => (
                    <div key={review.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <p className="font-black text-slate-950">{review.product.name}</p>
                          <p className="mt-2 text-sm leading-6 text-slate-500">{review.comment || "No written comment."}</p>
                        </div>
                        <div className="flex flex-col items-start gap-2 lg:items-end">
                          <div className="flex items-center gap-1 text-amber-500">
                            {Array.from({ length: 5 }).map((_, index) => (
                              <Star key={index} className={`h-4 w-4 ${index < review.rating ? "fill-current" : "text-slate-200"}`} />
                            ))}
                          </div>
                          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                            {new Date(review.createdAt).toLocaleDateString("vi-VN", { month: "short", day: "2-digit", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )
              ) : null}

              {tab === "wishlist" ? (
                customer.wishlists.length === 0 ? (
                  <EmptyBlock message="Danh sách yêu thích đang trống." />
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {customer.wishlists.map((entry) => (
                      <div key={entry.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                        <div className="flex items-start gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-white text-slate-400">
                            <Heart className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-black text-slate-950">{entry.product.name}</p>
                            <p className="mt-2 text-sm font-bold text-slate-500">{formatPrice(entry.product.price)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : null}
            </div>
          </AdminCard>

          <AdminCard>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Tóm tắt vận hành</p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <MiniStat icon={ShoppingBag} label="Đơn hàng" value={`${customer._count.orders}`} />
              <MiniStat icon={Star} label="Đánh giá" value={`${customer._count.reviews}`} />
              <MiniStat icon={Heart} label="Yêu thích" value={`${customer._count.wishlists}`} />
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-500">
              Trang này dùng để hỗ trợ khách hàng, kiểm tra chất lượng tài khoản và giữ chần. Lịch sử đơn hàng, đánh giá và sản phẩm yêu thích được hiển thị cùng một chỗ.
            </p>
          </AdminCard>
        </div>
      </div>
    </AdminPageContainer>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-[1.35rem] border border-slate-200 bg-slate-50 px-4 py-4">
      <Icon className="mt-0.5 h-4 w-4 text-slate-400" />
      <div>
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">{label}</p>
        <p className="mt-1 text-sm font-medium text-slate-700">{value}</p>
      </div>
    </div>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Package;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.35rem] border border-slate-200 bg-slate-50 p-4 text-center">
      <Icon className="mx-auto h-5 w-5 text-slate-400" />
      <p className="mt-2 text-xl font-black text-slate-950">{value}</p>
      <p className="mt-1 text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">{label}</p>
    </div>
  );
}

function EmptyBlock({ message }: { message: string }) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 p-6 text-sm leading-6 text-slate-500">
      {message}
    </div>
  );
}
