"use client";

/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Bell,
  CreditCard,
  Globe,
  LayoutDashboard,
  Link2,
  Loader2,
  Mail,
  Megaphone,
  MessageCircle,
  Save,
  Settings2,
  ShieldCheck,
  Sparkles,
  Store,
  Truck,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AdminCard, AdminPageContainer } from "@/components/admin/AdminPageContainer";

const ALLOWED_SETTINGS = [
  "site_name",
  "site_description",
  "site_logo",
  "site_favicon",
  "contact_email",
  "contact_phone",
  "contact_address",
  "shipping_fee",
  "free_shipping_threshold",
  "tax_rate",
  "maintenance_mode",
  "maintenance_message",
  "smtp_host",
  "smtp_port",
  "smtp_user",
  "facebook_url",
  "instagram_url",
  "tiktok_url",
  "youtube_url",
  "points_per_order",
  "points_redemption_rate",
  "checkin_points",
  "referral_points",
  "meta_title",
  "meta_description",
  "meta_keywords",
  "announcement_bar",
  "announcement_text",
  // Payment settings
  "payment_cod_enabled",
  "payment_bank_enabled",
  "payment_momo_enabled",
  "payment_paypal_enabled",
  "payment_stripe_enabled",
  "bank_name",
  "bank_account_name",
  "bank_account_number",
  "bank_qr_image_url",
  "momo_qr_image_url",
  "paypal_client_id",
  "zalo_pay_enabled",
  "zalo_pay_qr_url",
] as const;

type SettingKey = (typeof ALLOWED_SETTINGS)[number];
type TabKey = "store" | "commerce" | "channels" | "operations" | "profile" | "payment";
type SettingsState = Partial<Record<SettingKey, string>>;

type ProfileState = {
  id: string;
  email: string;
  name: string;
  phone: string;
  createdAt: string;
};

type BroadcastState = {
  title: string;
  message: string;
  link: string;
  channelInApp: boolean;
  channelEmail: boolean;
};

const DEFAULT_PROFILE: ProfileState = {
  id: "",
  email: "",
  name: "",
  phone: "",
  createdAt: "",
};

const DEFAULT_BROADCAST: BroadcastState = {
  title: "",
  message: "",
  link: "",
  channelInApp: true,
  channelEmail: false,
};

const TABS: Array<{ id: TabKey; label: string; icon: typeof Store; description: string }> = [
  { id: "store", label: "Cửa hàng", icon: Store, description: "Thương hiệu & tìm kiếm" },
  { id: "commerce", label: "Thương mại", icon: Truck, description: "Vận chuyển & tích điểm" },
  { id: "channels", label: "Kênh liên lạc", icon: Link2, description: "Liên hệ & tích hợp" },
  { id: "payment", label: "Thanh toán", icon: CreditCard, description: "Phương thức & mã QR" },
  { id: "operations", label: "Vận hành", icon: Settings2, description: "Thông báo & bảo trì" },
  { id: "profile", label: "Hồ sơ", icon: UserRound, description: "Cài đặt tài khoản admin" },
];

export default function AdminSettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<TabKey>("store");
  const [settings, setSettings] = useState<SettingsState>({});
  const [profile, setProfile] = useState<ProfileState>(DEFAULT_PROFILE);
  const [broadcast, setBroadcast] = useState<BroadcastState>(DEFAULT_BROADCAST);
  const [isFetching, setIsFetching] = useState(true);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const isSuperAdmin = session?.user?.role === "SUPER_ADMIN";

  useEffect(() => {
    const load = async () => {
      setIsFetching(true);
      try {
        const [settingsResponse, profileResponse] = await Promise.all([
          fetch("/api/settings"),
          fetch("/api/user/profile"),
        ]);

        if (settingsResponse.ok) {
          const data = await settingsResponse.json().catch(() => ({}));
          setSettings(pickAllowedSettings(data));
        }

        if (profileResponse.ok) {
          const data = await profileResponse.json().catch(() => null);
          if (data) {
            setProfile({
              id: data.id || "",
              email: data.email || "",
              name: data.name || "",
              phone: data.phone || "",
              createdAt: data.createdAt || "",
            });
          }
        }
      } catch {
        toast.error("Không thể tải cài đặt hệ thống.");
      } finally {
        setIsFetching(false);
      }
    };

    void load();
  }, []);

  const summary = useMemo(
    () => ({
      maintenance: (settings.maintenance_mode || "OFF") === "ON" ? "Bật" : "Tắt",
      shipping: settings.free_shipping_threshold || "500",
      support: settings.contact_email || "Chưa cấu hình",
      announcement: (settings.announcement_bar || "OFF") === "ON" ? "Đang hiển thị" : "Ẩn",
    }),
    [settings]
  );

  const updateSetting = (key: SettingKey, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    setIsSavingSettings(true);
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pickAllowedSettings(settings)),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || "Unable to save settings.");
      }
      toast.success("Đã lưu cài đặt hệ thống.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save settings.");
    } finally {
      setIsSavingSettings(false);
    }
  };

  const saveProfile = async () => {
    setIsSavingProfile(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          phone: profile.phone || null,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || "Không thể cập nhật hồ sơ quản trị.");
      }
      setProfile((prev) => ({
        ...prev,
        name: data.name || "",
        phone: data.phone || "",
      }));
      toast.success("Đã cập nhật hồ sơ quản trị.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể cập nhật hồ sơ.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const sendBroadcast = async () => {
    setIsBroadcasting(true);
    try {
      const response = await fetch("/api/admin/notifications/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: broadcast.title,
          message: broadcast.message,
          link: broadcast.link || undefined,
          channelInApp: broadcast.channelInApp,
          channelEmail: broadcast.channelEmail,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || "Không thể gửi thông báo.");
      }
      setBroadcast(DEFAULT_BROADCAST);
      toast.success("Đã gửi thông báo.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể gửi thông báo.");
    } finally {
      setIsBroadcasting(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AdminPageContainer
      title="Kiểm soát hệ thống"
      subtitle="Cấu hình cài đặt thương hiệu, thương mại, kênh liên lạc và vận hành từ một nơi duy nhất."
      action={
        <>
          <Link href="/admin/ai">
            <Button variant="outline" size="lg">
              <Sparkles className="h-4 w-4" />
              Mở phòng lab AI
            </Button>
          </Link>
          <Button size="lg" onClick={() => void saveSettings()} disabled={isSavingSettings}>
            {isSavingSettings ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Lưu cài đặt
          </Button>
        </>
      }
    >
      <div className="grid gap-4 lg:grid-cols-4">
        <AdminCard className="p-5">
          <Stat label="Chế độ bảo trì" value={summary.maintenance} tone="text-slate-950" />
        </AdminCard>
        <AdminCard className="p-5">
          <Stat label="Miễn phí vận chuyển từ" value={`$${summary.shipping}`} tone="text-emerald-600" />
        </AdminCard>
        <AdminCard className="p-5">
          <Stat label="Hộp thư hỗ trợ" value={summary.support} tone="text-sky-600" compact />
        </AdminCard>
        <AdminCard className="p-5">
          <Stat label="Thanh thông báo" value={summary.announcement} tone="text-violet-600" />
        </AdminCard>
      </div>

      <div className="grid gap-8 xl:grid-cols-[280px_minmax(0,1fr)]">
        <AdminCard className="p-4">
          <div className="space-y-3">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full rounded-[1.5rem] border px-4 py-4 text-left transition ${
                    active
                      ? "border-slate-900 bg-slate-950 text-white shadow-lg"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-[1rem] ${active ? "bg-white/10" : "bg-white"}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.16em]">{tab.label}</p>
                      <p className={`mt-1 text-xs leading-5 ${active ? "text-white/70" : "text-slate-500"}`}>{tab.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </AdminCard>

        <div className="space-y-8">
          {activeTab === "store" ? (
            <div className="grid gap-8">
              <AdminCard>
                <SectionHeader icon={Globe} eyebrow="Thông tin cửa hàng" title="Cài đặt thương hiệu & tìm kiếm" description="Kiểm soát thông tin thương hiệu hiển thị trên toàn bộ trang web." />
                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <Field label="Tên cửa hàng">
                    <input value={settings.site_name || ""} onChange={(event) => updateSetting("site_name", event.target.value)} className="admin-input" placeholder="LIKEFOOD" />
                  </Field>
                  <Field label="Mô tả cửa hàng">
                    <input value={settings.site_description || ""} onChange={(event) => updateSetting("site_description", event.target.value)} className="admin-input" placeholder="Vietnamese specialty marketplace in the US" />
                  </Field>
                  <Field label="Tiêu đề SEO">
                    <input value={settings.meta_title || ""} onChange={(event) => updateSetting("meta_title", event.target.value)} className="admin-input" placeholder="LIKEFOOD | Premium Vietnamese specialties" />
                  </Field>
                  <Field label="Từ khóa SEO">
                    <input value={settings.meta_keywords || ""} onChange={(event) => updateSetting("meta_keywords", event.target.value)} className="admin-input" placeholder="dried seafood, spice, tea, gifts" />
                  </Field>
                  <Field label="Email hỗ trợ">
                    <input value={settings.contact_email || ""} onChange={(event) => updateSetting("contact_email", event.target.value)} className="admin-input" placeholder="support@example.com" />
                  </Field>
                  <Field label="Số điện thoại hỗ trợ">
                    <input value={settings.contact_phone || ""} onChange={(event) => updateSetting("contact_phone", event.target.value)} className="admin-input" placeholder="+1 555 000 1234" />
                  </Field>
                  <Field label="Mô tả SEO" className="md:col-span-2">
                    <textarea value={settings.meta_description || ""} onChange={(event) => updateSetting("meta_description", event.target.value)} className="admin-textarea" rows={4} placeholder="Short description used by search engines and social previews." />
                  </Field>
                  <Field label="Địa chỉ liên hệ" className="md:col-span-2">
                    <textarea value={settings.contact_address || ""} onChange={(event) => updateSetting("contact_address", event.target.value)} className="admin-textarea" rows={4} placeholder="Support address shown on the site and support pages." />
                  </Field>
                </div>
              </AdminCard>
            </div>
          ) : null}

          {activeTab === "commerce" ? (
            <div className="grid gap-8 lg:grid-cols-2">
              <AdminCard>
                <SectionHeader icon={Truck} eyebrow="Vận chuyển mặc định" title="Ngưỡng thương mại" description="Thiết lập phí vận chuyển và các ngưỡng áp dụng cho toàn bộ đơn hàng." />
                <div className="mt-6 grid gap-5">
                  <Field label="Phí vận chuyển tiêu chuẩn (USD)">
                    <input value={settings.shipping_fee || "5.99"} onChange={(event) => updateSetting("shipping_fee", event.target.value)} className="admin-input" placeholder="5.99" />
                  </Field>
                  <Field label="Ngưỡng miễn phí vận chuyển (USD)">
                    <input value={settings.free_shipping_threshold || "500"} onChange={(event) => updateSetting("free_shipping_threshold", event.target.value)} className="admin-input" placeholder="500" />
                  </Field>
                  <Field label="Thuế suất (%)">
                    <input value={settings.tax_rate || "0"} onChange={(event) => updateSetting("tax_rate", event.target.value)} className="admin-input" placeholder="0" />
                  </Field>
                </div>
              </AdminCard>

              <AdminCard>
                <SectionHeader icon={ShieldCheck} eyebrow="Chương trình tích điểm" title="Điểm & phần thưởng" description="Điều chỉnh ưu đãi nhằm khuyến khích khách hàng mua lại." />
                <div className="mt-6 grid gap-5">
                  <Field label="Điểm mỗi đơn hàng">
                    <input value={settings.points_per_order || "0"} onChange={(event) => updateSetting("points_per_order", event.target.value)} className="admin-input" placeholder="10" />
                  </Field>
                  <Field label="Tỷ lệ đổi điểm">
                    <input value={settings.points_redemption_rate || "0"} onChange={(event) => updateSetting("points_redemption_rate", event.target.value)} className="admin-input" placeholder="0.01" />
                  </Field>
                  <Field label="Điểm check-in hàng ngày">
                    <input value={settings.checkin_points || "0"} onChange={(event) => updateSetting("checkin_points", event.target.value)} className="admin-input" placeholder="1" />
                  </Field>
                  <Field label="Điểm giới thiệu">
                    <input value={settings.referral_points || "0"} onChange={(event) => updateSetting("referral_points", event.target.value)} className="admin-input" placeholder="20" />
                  </Field>
                </div>
              </AdminCard>
            </div>
          ) : null}

          {activeTab === "channels" ? (
            <div className="grid gap-8 lg:grid-cols-2">
              <AdminCard>
                <SectionHeader icon={Link2} eyebrow="Mạng xã hội" title="Kênh khách hàng" description="Cập nhật các kênh hỗ trợ và thương hiệu mà không cần chỉnh sửa code." />
                <div className="mt-6 grid gap-5">
                  <Field label="Facebook URL">
                    <input value={settings.facebook_url || ""} onChange={(event) => updateSetting("facebook_url", event.target.value)} className="admin-input" placeholder="https://facebook.com/likefood" />
                  </Field>
                  <Field label="Instagram URL">
                    <input value={settings.instagram_url || ""} onChange={(event) => updateSetting("instagram_url", event.target.value)} className="admin-input" placeholder="https://instagram.com/likefood" />
                  </Field>
                  <Field label="TikTok URL">
                    <input value={settings.tiktok_url || ""} onChange={(event) => updateSetting("tiktok_url", event.target.value)} className="admin-input" placeholder="https://tiktok.com/@likefood" />
                  </Field>
                  <Field label="YouTube URL">
                    <input value={settings.youtube_url || ""} onChange={(event) => updateSetting("youtube_url", event.target.value)} className="admin-input" placeholder="https://youtube.com/@likefood" />
                  </Field>
                </div>
              </AdminCard>

              <AdminCard>
                <SectionHeader icon={Mail} eyebrow="Gửi email" title="Cấu hình SMTP" description="Thiết lập địa chỉ gửi email cho các quy trình thông báo." />
                <div className="mt-6 grid gap-5">
                  <Field label="Máy chủ SMTP">
                    <input value={settings.smtp_host || ""} onChange={(event) => updateSetting("smtp_host", event.target.value)} className="admin-input" placeholder="smtp.example.com" />
                  </Field>
                  <Field label="Cổng SMTP">
                    <input value={settings.smtp_port || "587"} onChange={(event) => updateSetting("smtp_port", event.target.value)} className="admin-input" placeholder="587" />
                  </Field>
                  <Field label="Tài khoản SMTP">
                    <input value={settings.smtp_user || ""} onChange={(event) => updateSetting("smtp_user", event.target.value)} className="admin-input" placeholder="noreply@example.com" />
                  </Field>
                </div>
              </AdminCard>

              <AdminCard>
                <SectionHeader icon={MessageCircle} eyebrow="Telegram Bot" title="Thông báo Telegram" description="Nhận thông báo đơn hàng và cảnh báo cửa hàng qua Telegram bot." />
                <div className="mt-6 space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                    <p className="text-sm text-amber-800 font-medium">
                      📌 Để kích hoạt Telegram Bot, thêm các biến môi trường sau vào file .env:
                    </p>
                    <ul className="mt-2 text-xs text-amber-700 space-y-1">
                      <li>• TELEGRAM_BOT_TOKEN: Token từ @BotFather</li>
                      <li>• TELEGRAM_CHAT_ID: Chat ID của bạn (dùng @userinfobot để lấy)</li>
                    </ul>
                  </div>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={async () => {
                      try {
                        const res = await fetch("/api/admin/telegram", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ action: "test" }),
                        });
                        const data = await res.json();
                        if (data.success) {
                          toast.success(data.message);
                        } else {
                          toast.error(data.message);
                        }
                      } catch {
                        toast.error("Không thể kết nối Telegram.");
                      }
                    }}
                    className="w-full"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Kiểm tra kết nối Telegram
                  </Button>
                </div>
              </AdminCard>
            </div>
          ) : null}

          {activeTab === "payment" ? (
            <div className="grid gap-8">
              <AdminCard>
                <SectionHeader icon={CreditCard} eyebrow="Phương thức thanh toán" title="Cấu hình thanh toán" description="Bật hoặc tắt các phương thức thanh toán khả dụng cho khách hàng khi thanh toán." />
                <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  <ToggleField
                    label="Thanh toán khi nhận hàng (COD)"
                    value={settings.payment_cod_enabled || "OFF"}
                    onChange={(value) => updateSetting("payment_cod_enabled", value)}
                  />
                  <ToggleField
                    label="Chuyển khoản ngân hàng"
                    value={settings.payment_bank_enabled || "OFF"}
                    onChange={(value) => updateSetting("payment_bank_enabled", value)}
                  />
                  <ToggleField
                    label="Ví MoMo"
                    value={settings.payment_momo_enabled || "OFF"}
                    onChange={(value) => updateSetting("payment_momo_enabled", value)}
                  />
                  <ToggleField
                    label="PayPal"
                    value={settings.payment_paypal_enabled || "OFF"}
                    onChange={(value) => updateSetting("payment_paypal_enabled", value)}
                  />
                  <ToggleField
                    label="Thẻ Stripe"
                    value={settings.payment_stripe_enabled || "OFF"}
                    onChange={(value) => updateSetting("payment_stripe_enabled", value)}
                  />
                  <ToggleField
                    label="ZaloPay"
                    value={settings.zalo_pay_enabled || "OFF"}
                    onChange={(value) => updateSetting("zalo_pay_enabled", value)}
                  />
                </div>
              </AdminCard>

              <AdminCard>
                <SectionHeader icon={CreditCard} eyebrow="Chuyển khoản ngân hàng" title="Thông tin tài khoản ngân hàng" description="Thông tin tài khoản ngân hàng hiển thị cho khách hàng khi chuyển khoản." />
                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <Field label="Tên ngân hàng">
                    <input value={settings.bank_name || ""} onChange={(event) => updateSetting("bank_name", event.target.value)} className="admin-input" placeholder="Chase Bank" />
                  </Field>
                  <Field label="Tên tài khoản">
                    <input value={settings.bank_account_name || ""} onChange={(event) => updateSetting("bank_account_name", event.target.value)} className="admin-input" placeholder="LIKEFOOD LLC" />
                  </Field>
                  <Field label="Số tài khoản">
                    <input value={settings.bank_account_number || ""} onChange={(event) => updateSetting("bank_account_number", event.target.value)} className="admin-input" placeholder="1234567890" />
                  </Field>
                  <Field label="URL ảnh QR ngân hàng">
                    <input value={settings.bank_qr_image_url || ""} onChange={(event) => updateSetting("bank_qr_image_url", event.target.value)} className="admin-input" placeholder="https://example.com/bank-qr.png" />
                  </Field>
                </div>
              </AdminCard>

              <AdminCard>
                <SectionHeader icon={CreditCard} eyebrow="Ví điện tử" title="Cấu hình mã QR" description="Ảnh mã QR cho thanh toán qua ví điện tử (MoMo, ZaloPay)." />
                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <Field label="URL ảnh QR MoMo">
                    <input value={settings.momo_qr_image_url || ""} onChange={(event) => updateSetting("momo_qr_image_url", event.target.value)} className="admin-input" placeholder="https://example.com/momo-qr.png" />
                  </Field>
                  <Field label="URL ảnh QR ZaloPay">
                    <input value={settings.zalo_pay_qr_url || ""} onChange={(event) => updateSetting("zalo_pay_qr_url", event.target.value)} className="admin-input" placeholder="https://example.com/zalopay-qr.png" />
                  </Field>
                </div>
              </AdminCard>

              <AdminCard>
                <SectionHeader icon={CreditCard} eyebrow="PayPal" title="Cấu hình PayPal" description="PayPal Client ID để nhận thanh toán quốc tế." />
                <div className="mt-6 grid gap-5">
                  <Field label="PayPal Client ID">
                    <input value={settings.paypal_client_id || ""} onChange={(event) => updateSetting("paypal_client_id", event.target.value)} className="admin-input" placeholder="Your PayPal Client ID" />
                  </Field>
                </div>
              </AdminCard>
            </div>
          ) : null}

          {activeTab === "operations" ? (
            <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
              <AdminCard>
                <SectionHeader icon={Megaphone} eyebrow="Thông báo cửa hàng" title="Thông báo & bảo trì" description="Cập nhật thông báo vận hành mà không cần sửa template hay route handler." />
                <div className="mt-6 grid gap-5">
                  <ToggleField
                    label="Thanh thông báo"
                    value={settings.announcement_bar || "OFF"}
                    onChange={(value) => updateSetting("announcement_bar", value)}
                  />
                  <Field label="Nội dung thông báo">
                    <textarea value={settings.announcement_text || ""} onChange={(event) => updateSetting("announcement_text", event.target.value)} className="admin-textarea" rows={4} placeholder="Example: Free standard shipping on orders over $500." />
                  </Field>
                  <ToggleField
                    label="Chế độ bảo trì"
                    value={settings.maintenance_mode || "OFF"}
                    onChange={(value) => updateSetting("maintenance_mode", value)}
                  />
                  <Field label="Nội dung bảo trì">
                    <textarea value={settings.maintenance_message || ""} onChange={(event) => updateSetting("maintenance_message", event.target.value)} className="admin-textarea" rows={4} placeholder="Message shown when the storefront is temporarily paused." />
                  </Field>
                </div>
              </AdminCard>

              <AdminCard>
                <SectionHeader icon={Bell} eyebrow="Phát sóng quản trị" title="Gửi thông báo toàn cửa hàng" description="Quản trị cấp cao có thể thông báo cho khách hàng trong app và xếp hàng gửi email." />
                {isSuperAdmin ? (
                  <div className="mt-6 grid gap-5">
                    <Field label="Tiêu đề thông báo">
                      <input value={broadcast.title} onChange={(event) => setBroadcast((prev) => ({ ...prev, title: event.target.value }))} className="admin-input" placeholder="Weekend shipping update" />
                    </Field>
                    <Field label="Nội dung">
                      <textarea value={broadcast.message} onChange={(event) => setBroadcast((prev) => ({ ...prev, message: event.target.value }))} className="admin-textarea" rows={5} placeholder="Tell customers exactly what changed and what they should expect next." />
                    </Field>
                    <Field label="Liên kết (tùy chọn)">
                      <input value={broadcast.link} onChange={(event) => setBroadcast((prev) => ({ ...prev, link: event.target.value }))} className="admin-input" placeholder="https://example.com/help/shipping" />
                    </Field>
                    <div className="grid gap-4 md:grid-cols-2">
                      <CheckCard title="Thông báo trong app" description="Tạo thông báo cho tất cả người dùng." checked={broadcast.channelInApp} onClick={() => setBroadcast((prev) => ({ ...prev, channelInApp: !prev.channelInApp }))} />
                      <CheckCard title="Hàng chờ email" description="Đánh dấu yêu cầu gửi email hàng loạt cho nhà cung cấp đã cấu hình." checked={broadcast.channelEmail} onClick={() => setBroadcast((prev) => ({ ...prev, channelEmail: !prev.channelEmail }))} />
                    </div>
                    <Button
                      size="lg"
                      onClick={() => void sendBroadcast()}
                      disabled={isBroadcasting || !broadcast.title.trim() || !broadcast.message.trim() || (!broadcast.channelInApp && !broadcast.channelEmail)}
                    >
                      {isBroadcasting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4" />}
                      Gửi thông báo
                    </Button>
                  </div>
                ) : (
                  <div className="mt-6 rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 p-6 text-sm leading-6 text-slate-500">
                    Chức năng này chỉ dành cho quản trị viên cấp cao.
                  </div>
                )}
              </AdminCard>
            </div>
          ) : null}

          {activeTab === "profile" ? (
            <div className="grid gap-8 xl:grid-cols-[0.92fr_1.08fr]">
              <AdminCard>
                <SectionHeader icon={UserRound} eyebrow="Hồ sơ quản trị" title="Thông tin cá nhân" description="Cập nhật thông tin quản trị để phục vụ kiểm duyệt nội bộ và hỗ trợ vận hành." />
                <div className="mt-6 grid gap-5">
                  <Field label="Họ và tên">
                    <input value={profile.name} onChange={(event) => setProfile((prev) => ({ ...prev, name: event.target.value }))} className="admin-input" placeholder="Admin user" />
                  </Field>
                  <Field label="Số điện thoại">
                    <input value={profile.phone} onChange={(event) => setProfile((prev) => ({ ...prev, phone: event.target.value }))} className="admin-input" placeholder="+1 555 000 1234" />
                  </Field>
                  <Field label="Email">
                    <input value={profile.email} readOnly className="admin-input bg-slate-100 text-slate-500" />
                  </Field>
                  <Field label="Ngày tham gia">
                    <input value={profile.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : ""} readOnly className="admin-input bg-slate-100 text-slate-500" />
                  </Field>
                  <Button size="lg" onClick={() => void saveProfile()} disabled={isSavingProfile}>
                    {isSavingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Lưu hồ sơ
                  </Button>
                </div>
              </AdminCard>

              <AdminCard>
                <SectionHeader icon={LayoutDashboard} eyebrow="Tổng quan cài đặt" title="Trang này quản lý những gì" description="Cấu hình quản trị được kết nối trực tiếp với API thực thay vì các trường form bị bỏ lại." />
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <MiniTile title="Thông tin cửa hàng" body="Nội dung thương hiệu, metadata, thông tin hỗ trợ và địa chỉ đều có thể chỉnh sửa tại đây." />
                  <MiniTile title="Thương mại" body="Phí vận chuyển, ngưỡng miễn phí, thuế và điểm tích lũy đều có thể điều chỉnh." />
                  <MiniTile title="Kênh liên lạc" body="Liên kết mạng xã hội và cấu hình SMTP có thể cập nhật mà không cần sửa code." />
                  <MiniTile title="Thanh toán" body="Cấu hình phương thức thanh toán, tài khoản ngân hàng và mã QR để thanh toán thuận tiện." />
                  <MiniTile title="Vận hành" body="Thanh thông báo, chế độ bảo trì và gửi thông báo hàng loạt được quản lý tập trung." />
                </div>
              </AdminCard>
            </div>
          ) : null}
        </div>
      </div>

      <style jsx global>{`
        .admin-input {
          width: 100%;
          min-height: 3.35rem;
          border-radius: 1rem;
          border: 1px solid rgb(226 232 240);
          background: rgb(248 250 252);
          padding: 0.875rem 1rem;
          font-size: 0.95rem;
          font-weight: 600;
          color: rgb(15 23 42);
          outline: none;
          transition: border-color 0.2s ease, background-color 0.2s ease;
        }
        .admin-input:focus {
          border-color: rgba(15, 23, 42, 0.32);
          background: white;
        }
        .admin-textarea {
          width: 100%;
          border-radius: 1.15rem;
          border: 1px solid rgb(226 232 240);
          background: rgb(248 250 252);
          padding: 1rem;
          font-size: 0.95rem;
          font-weight: 500;
          color: rgb(15 23 42);
          outline: none;
          transition: border-color 0.2s ease, background-color 0.2s ease;
        }
        .admin-textarea:focus {
          border-color: rgba(15, 23, 42, 0.32);
          background: white;
        }
      `}</style>
    </AdminPageContainer>
  );
}

function pickAllowedSettings(source: Record<string, unknown>): SettingsState {
  return ALLOWED_SETTINGS.reduce<SettingsState>((acc, key) => {
    const value = source[key];
    if (typeof value === "string") {
      acc[key] = value;
    }
    return acc;
  }, {});
}

function SectionHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
}: {
  icon: typeof Globe;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-[1.15rem] bg-slate-100 text-slate-700">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">{label}</label>
      {children}
    </div>
  );
}

function ToggleField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field label={label}>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="admin-input">
        <option value="OFF">Tắt</option>
        <option value="ON">Bật</option>
      </select>
    </Field>
  );
}

function CheckCard({
  title,
  description,
  checked,
  onClick,
}: {
  title: string;
  description: string;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[1.5rem] border p-4 text-left transition ${checked ? "border-slate-900 bg-slate-950 text-white" : "border-slate-200 bg-slate-50 text-slate-700"}`}
    >
      <p className="font-black">{title}</p>
      <p className={`mt-2 text-sm leading-6 ${checked ? "text-white/70" : "text-slate-500"}`}>{description}</p>
    </button>
  );
}

function MiniTile({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
      <p className="font-black text-slate-950">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-500">{body}</p>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
  compact = false,
}: {
  label: string;
  value: string;
  tone: string;
  compact?: boolean;
}) {
  return (
    <div>
      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className={`mt-2 font-black ${compact ? "truncate text-lg" : "text-3xl"} ${tone}`}>{value}</p>
    </div>
  );
}
