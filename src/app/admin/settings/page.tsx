/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

﻿"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Bell,
  Globe,
  LayoutDashboard,
  Link2,
  Loader2,
  Mail,
  Megaphone,
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
] as const;

type SettingKey = (typeof ALLOWED_SETTINGS)[number];
type TabKey = "store" | "commerce" | "channels" | "operations" | "profile";
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
  { id: "store", label: "Store", icon: Store, description: "Brand and discovery" },
  { id: "commerce", label: "Commerce", icon: Truck, description: "Shipping and loyalty" },
  { id: "channels", label: "Channels", icon: Link2, description: "Contact and integrations" },
  { id: "operations", label: "Operations", icon: Settings2, description: "Announcements and maintenance" },
  { id: "profile", label: "Profile", icon: UserRound, description: "Admin account controls" },
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
        toast.error("Unable to load admin settings.");
      } finally {
        setIsFetching(false);
      }
    };

    void load();
  }, []);

  const summary = useMemo(
    () => ({
      maintenance: (settings.maintenance_mode || "OFF") === "ON" ? "On" : "Off",
      shipping: settings.free_shipping_threshold || "500",
      support: settings.contact_email || "Not configured",
      announcement: (settings.announcement_bar || "OFF") === "ON" ? "Live" : "Hidden",
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
      toast.success("System settings saved.");
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
        throw new Error(data?.error || "Unable to update admin profile.");
      }
      setProfile((prev) => ({
        ...prev,
        name: data.name || "",
        phone: data.phone || "",
      }));
      toast.success("Admin profile updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update admin profile.");
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
        throw new Error(data?.error || "Unable to send broadcast.");
      }
      setBroadcast(DEFAULT_BROADCAST);
      toast.success("Broadcast sent.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to send broadcast.");
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
      title="System controls"
      subtitle="Configure brand settings, commerce defaults, communication channels, and admin operations from one clean control room."
      action={
        <>
          <Link href="/admin/ai">
            <Button variant="outline" size="lg">
              <Sparkles className="h-4 w-4" />
              Open AI lab
            </Button>
          </Link>
          <Button size="lg" onClick={() => void saveSettings()} disabled={isSavingSettings}>
            {isSavingSettings ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save settings
          </Button>
        </>
      }
    >
      <div className="grid gap-4 lg:grid-cols-4">
        <AdminCard className="p-5">
          <Stat label="Maintenance mode" value={summary.maintenance} tone="text-slate-950" />
        </AdminCard>
        <AdminCard className="p-5">
          <Stat label="Free shipping from" value={`$${summary.shipping}`} tone="text-emerald-600" />
        </AdminCard>
        <AdminCard className="p-5">
          <Stat label="Support inbox" value={summary.support} tone="text-sky-600" compact />
        </AdminCard>
        <AdminCard className="p-5">
          <Stat label="Announcement bar" value={summary.announcement} tone="text-violet-600" />
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
                <SectionHeader icon={Globe} eyebrow="Store identity" title="Brand and discovery setup" description="Control what the storefront communicates across metadata, search, and support entry points." />
                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <Field label="Store name">
                    <input value={settings.site_name || ""} onChange={(event) => updateSetting("site_name", event.target.value)} className="admin-input" placeholder="LIKEFOOD" />
                  </Field>
                  <Field label="Store description">
                    <input value={settings.site_description || ""} onChange={(event) => updateSetting("site_description", event.target.value)} className="admin-input" placeholder="Vietnamese specialty marketplace in the US" />
                  </Field>
                  <Field label="Meta title">
                    <input value={settings.meta_title || ""} onChange={(event) => updateSetting("meta_title", event.target.value)} className="admin-input" placeholder="LIKEFOOD | Premium Vietnamese specialties" />
                  </Field>
                  <Field label="Meta keywords">
                    <input value={settings.meta_keywords || ""} onChange={(event) => updateSetting("meta_keywords", event.target.value)} className="admin-input" placeholder="dried seafood, spice, tea, gifts" />
                  </Field>
                  <Field label="Support email">
                    <input value={settings.contact_email || ""} onChange={(event) => updateSetting("contact_email", event.target.value)} className="admin-input" placeholder="support@example.com" />
                  </Field>
                  <Field label="Support phone">
                    <input value={settings.contact_phone || ""} onChange={(event) => updateSetting("contact_phone", event.target.value)} className="admin-input" placeholder="+1 555 000 1234" />
                  </Field>
                  <Field label="Meta description" className="md:col-span-2">
                    <textarea value={settings.meta_description || ""} onChange={(event) => updateSetting("meta_description", event.target.value)} className="admin-textarea" rows={4} placeholder="Short description used by search engines and social previews." />
                  </Field>
                  <Field label="Contact address" className="md:col-span-2">
                    <textarea value={settings.contact_address || ""} onChange={(event) => updateSetting("contact_address", event.target.value)} className="admin-textarea" rows={4} placeholder="Support address shown on the site and support pages." />
                  </Field>
                </div>
              </AdminCard>
            </div>
          ) : null}

          {activeTab === "commerce" ? (
            <div className="grid gap-8 lg:grid-cols-2">
              <AdminCard>
                <SectionHeader icon={Truck} eyebrow="Shipping defaults" title="Commerce thresholds" description="Set shipping math and cart-wide thresholds in one place." />
                <div className="mt-6 grid gap-5">
                  <Field label="Standard shipping fee (USD)">
                    <input value={settings.shipping_fee || "5.99"} onChange={(event) => updateSetting("shipping_fee", event.target.value)} className="admin-input" placeholder="5.99" />
                  </Field>
                  <Field label="Free shipping threshold (USD)">
                    <input value={settings.free_shipping_threshold || "500"} onChange={(event) => updateSetting("free_shipping_threshold", event.target.value)} className="admin-input" placeholder="500" />
                  </Field>
                  <Field label="Tax rate (%)">
                    <input value={settings.tax_rate || "0"} onChange={(event) => updateSetting("tax_rate", event.target.value)} className="admin-input" placeholder="0" />
                  </Field>
                </div>
              </AdminCard>

              <AdminCard>
                <SectionHeader icon={ShieldCheck} eyebrow="Loyalty controls" title="Points and rewards" description="Tune incentives that shape repeat purchase behavior." />
                <div className="mt-6 grid gap-5">
                  <Field label="Points per order">
                    <input value={settings.points_per_order || "0"} onChange={(event) => updateSetting("points_per_order", event.target.value)} className="admin-input" placeholder="10" />
                  </Field>
                  <Field label="Points redemption rate">
                    <input value={settings.points_redemption_rate || "0"} onChange={(event) => updateSetting("points_redemption_rate", event.target.value)} className="admin-input" placeholder="0.01" />
                  </Field>
                  <Field label="Daily check-in points">
                    <input value={settings.checkin_points || "0"} onChange={(event) => updateSetting("checkin_points", event.target.value)} className="admin-input" placeholder="1" />
                  </Field>
                  <Field label="Referral bonus points">
                    <input value={settings.referral_points || "0"} onChange={(event) => updateSetting("referral_points", event.target.value)} className="admin-input" placeholder="20" />
                  </Field>
                </div>
              </AdminCard>
            </div>
          ) : null}

          {activeTab === "channels" ? (
            <div className="grid gap-8 lg:grid-cols-2">
              <AdminCard>
                <SectionHeader icon={Link2} eyebrow="Social links" title="Customer-facing channels" description="Keep support and brand channels current without editing code." />
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
                <SectionHeader icon={Mail} eyebrow="Email delivery" title="SMTP handoff" description="Set the outbound sender used by email workflows and notifications." />
                <div className="mt-6 grid gap-5">
                  <Field label="SMTP host">
                    <input value={settings.smtp_host || ""} onChange={(event) => updateSetting("smtp_host", event.target.value)} className="admin-input" placeholder="smtp.example.com" />
                  </Field>
                  <Field label="SMTP port">
                    <input value={settings.smtp_port || "587"} onChange={(event) => updateSetting("smtp_port", event.target.value)} className="admin-input" placeholder="587" />
                  </Field>
                  <Field label="SMTP user">
                    <input value={settings.smtp_user || ""} onChange={(event) => updateSetting("smtp_user", event.target.value)} className="admin-input" placeholder="noreply@example.com" />
                  </Field>
                </div>
              </AdminCard>
            </div>
          ) : null}

          {activeTab === "operations" ? (
            <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
              <AdminCard>
                <SectionHeader icon={Megaphone} eyebrow="Store messaging" title="Announcement and maintenance" description="Update operational messaging without touching templates or route handlers." />
                <div className="mt-6 grid gap-5">
                  <ToggleField
                    label="Announcement bar"
                    value={settings.announcement_bar || "OFF"}
                    onChange={(value) => updateSetting("announcement_bar", value)}
                  />
                  <Field label="Announcement message">
                    <textarea value={settings.announcement_text || ""} onChange={(event) => updateSetting("announcement_text", event.target.value)} className="admin-textarea" rows={4} placeholder="Example: Free standard shipping on orders over $500." />
                  </Field>
                  <ToggleField
                    label="Maintenance mode"
                    value={settings.maintenance_mode || "OFF"}
                    onChange={(value) => updateSetting("maintenance_mode", value)}
                  />
                  <Field label="Maintenance message">
                    <textarea value={settings.maintenance_message || ""} onChange={(event) => updateSetting("maintenance_message", event.target.value)} className="admin-textarea" rows={4} placeholder="Message shown when the storefront is temporarily paused." />
                  </Field>
                </div>
              </AdminCard>

              <AdminCard>
                <SectionHeader icon={Bell} eyebrow="Admin broadcast" title="Push a store-wide update" description="Super admins can notify customers in-app and queue email delivery for external processing." />
                {isSuperAdmin ? (
                  <div className="mt-6 grid gap-5">
                    <Field label="Broadcast title">
                      <input value={broadcast.title} onChange={(event) => setBroadcast((prev) => ({ ...prev, title: event.target.value }))} className="admin-input" placeholder="Weekend shipping update" />
                    </Field>
                    <Field label="Message">
                      <textarea value={broadcast.message} onChange={(event) => setBroadcast((prev) => ({ ...prev, message: event.target.value }))} className="admin-textarea" rows={5} placeholder="Tell customers exactly what changed and what they should expect next." />
                    </Field>
                    <Field label="Optional link">
                      <input value={broadcast.link} onChange={(event) => setBroadcast((prev) => ({ ...prev, link: event.target.value }))} className="admin-input" placeholder="https://example.com/help/shipping" />
                    </Field>
                    <div className="grid gap-4 md:grid-cols-2">
                      <CheckCard title="In-app delivery" description="Creates notifications for all users." checked={broadcast.channelInApp} onClick={() => setBroadcast((prev) => ({ ...prev, channelInApp: !prev.channelInApp }))} />
                      <CheckCard title="Email queue" description="Flags an email broadcast request for the configured provider." checked={broadcast.channelEmail} onClick={() => setBroadcast((prev) => ({ ...prev, channelEmail: !prev.channelEmail }))} />
                    </div>
                    <Button
                      size="lg"
                      onClick={() => void sendBroadcast()}
                      disabled={isBroadcasting || !broadcast.title.trim() || !broadcast.message.trim() || (!broadcast.channelInApp && !broadcast.channelEmail)}
                    >
                      {isBroadcasting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4" />}
                      Send broadcast
                    </Button>
                  </div>
                ) : (
                  <div className="mt-6 rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 p-6 text-sm leading-6 text-slate-500">
                    Broadcast controls are limited to super admin sessions.
                  </div>
                )}
              </AdminCard>
            </div>
          ) : null}

          {activeTab === "profile" ? (
            <div className="grid gap-8 xl:grid-cols-[0.92fr_1.08fr]">
              <AdminCard>
                <SectionHeader icon={UserRound} eyebrow="Admin profile" title="Personal operator details" description="Keep your admin identity current for internal audits and support workflows." />
                <div className="mt-6 grid gap-5">
                  <Field label="Full name">
                    <input value={profile.name} onChange={(event) => setProfile((prev) => ({ ...prev, name: event.target.value }))} className="admin-input" placeholder="Admin user" />
                  </Field>
                  <Field label="Phone">
                    <input value={profile.phone} onChange={(event) => setProfile((prev) => ({ ...prev, phone: event.target.value }))} className="admin-input" placeholder="+1 555 000 1234" />
                  </Field>
                  <Field label="Email">
                    <input value={profile.email} readOnly className="admin-input bg-slate-100 text-slate-500" />
                  </Field>
                  <Field label="Joined">
                    <input value={profile.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : ""} readOnly className="admin-input bg-slate-100 text-slate-500" />
                  </Field>
                  <Button size="lg" onClick={() => void saveProfile()} disabled={isSavingProfile}>
                    {isSavingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save profile
                  </Button>
                </div>
              </AdminCard>

              <AdminCard>
                <SectionHeader icon={LayoutDashboard} eyebrow="Control-room summary" title="What this page now manages" description="Admin configuration now maps cleanly to real APIs instead of orphaned form fields." />
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <MiniTile title="Store identity" body="Brand copy, metadata, support details, and address are editable here." />
                  <MiniTile title="Commerce math" body="Shipping fee, free shipping threshold, tax, and loyalty points are adjustable." />
                  <MiniTile title="Channels" body="Social links and SMTP sender details can be updated without code changes." />
                  <MiniTile title="Operations" body="Announcement bar, maintenance mode, and broadcast messaging are centralized." />
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
        <option value="OFF">Off</option>
        <option value="ON">On</option>
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
