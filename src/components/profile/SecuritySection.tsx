/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, Shield, Clock, Monitor, AlertTriangle, Trash2, Eye, EyeOff, Save, Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { toast } from "sonner";

interface SecuritySectionProps {
    session: {
        user: {
            id?: string;
            email?: string | null;
            name?: string | null;
            role?: string;
        };
    };
}

export function SecuritySection({ session }: SecuritySectionProps) {
    const { language } = useLanguage();

    // --- Change Password state ---
    const [pwData, setPwData] = useState({ current: "", newPw: "", confirm: "" });
    const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
    const [pwLoading, setPwLoading] = useState(false);
    const [pwError, setPwError] = useState("");

    // --- Login History state ---
    const [loginHistory, setLoginHistory] = useState<Array<{
        id: string;
        ipAddress?: string | null;
        userAgent?: string | null;
        country?: string | null;
        isSuspicious: boolean;
        createdAt: string;
    }>>([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyLoaded, setHistoryLoaded] = useState(false);

    // --- Delete Account state ---
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletePassword, setDeletePassword] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteConfirmed, setDeleteConfirmed] = useState(false);

    // --- 2FA state ---
    const [twoFAEnabled, setTwoFAEnabled] = useState(false);
    const [twoFALoading, setTwoFALoading] = useState(false);
    const [twoFALoaded, setTwoFALoaded] = useState(false);

    // --- 2FA Modal state ---
    const [show2FAModal, setShow2FAModal] = useState(false);
    const [otp2FA, setOtp2FA] = useState("");
    const [otpLoading, setOtpLoading] = useState(false);

    const fetchTwoFAStatus = async () => {
        if (twoFALoaded) return;
        try {
            const res = await fetch("/api/auth/2fa/toggle");
            if (res.ok) {
                const d = await res.json();
                setTwoFAEnabled(d.twoFactorEnabled);
                setTwoFALoaded(true);
            }
        } catch { /* ignore */ }
    };

    const handleToggle2FA = async (enable: boolean) => {
        if (enable) {
            // Initiate 2FA Enable Process: Send Email
            setTwoFALoading(true);
            try {
                const res = await fetch("/api/auth/2fa/send", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: session.user.email }),
                });
                if (res.ok) {
                    setShow2FAModal(true);
                    setOtp2FA("");
                } else {
                    toast.error(language === "vi" ? "Không thể gửi mã xác nhận" : "Failed to send confirmation code");
                }
            } catch {
                toast.error(language === "vi" ? "Lỗi kết nối." : "Connection error.");
            } finally {
                setTwoFALoading(false);
            }
        } else {
            // Disable process
            setTwoFALoading(true);
            try {
                const res = await fetch("/api/auth/2fa/toggle", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ enabled: false }),
                });
                const data = await res.json();
                if (res.ok) {
                    setTwoFAEnabled(false);
                    toast.success(language === "vi" ? "Đã tắt xác thực 2 bước" : "2FA disabled");
                } else {
                    toast.error(data.error || (language === "vi" ? "Không thể tắt 2FA" : "Unable to disable 2FA"));
                }
            } catch {
                toast.error(language === "vi" ? "Lỗi kết nối." : "Connection error.");
            } finally {
                setTwoFALoading(false);
            }
        }
    };

    const handleConfirm2FA = async () => {
        if (otp2FA.length < 6) return;
        setOtpLoading(true);
        try {
            const res = await fetch("/api/auth/2fa/toggle", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ enabled: true, otp: otp2FA }),
            });
            const data = await res.json();
            if (res.ok) {
                setTwoFAEnabled(true);
                setShow2FAModal(false);
                toast.success(language === "vi" ? "Đã bật xác thực 2 bước!" : "2FA enabled successfully!");
            } else {
                toast.error(data.error || (language === "vi" ? "Mã xác nhận không đúng" : "Invalid confirmation code"));
            }
        } catch {
            toast.error(language === "vi" ? "Lỗi kết nối." : "Connection error.");
        } finally {
            setOtpLoading(false);
        }
    };

    const passwordStrength = (pw: string) => {
        let score = 0;
        if (pw.length >= 8) score++;
        if (/[A-Z]/.test(pw)) score++;
        if (/[0-9]/.test(pw)) score++;
        if (/[^A-Za-z0-9]/.test(pw)) score++;
        return score;
    };

    const strengthLabel = language === "vi" ? ["", "Yếu", "Trung bình", "Tốt", "Mạnh"] : ["", "Weak", "Medium", "Good", "Strong"];
    const strengthColor = ["", "bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-500"];
    const pwStrength = passwordStrength(pwData.newPw);

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (pwData.newPw !== pwData.confirm) {
            setPwError(language === "vi" ? "Mật khẩu xác nhận không khớp" : "Password confirmation does not match");
            return;
        }
        setPwLoading(true);
        setPwError("");
        try {
            const res = await fetch("/api/auth/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword: pwData.current, newPassword: pwData.newPw, confirmPassword: pwData.confirm }),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(language === "vi" ? "Đổi mật khẩu thành công!" : "Password changed successfully!");
                setPwData({ current: "", newPw: "", confirm: "" });
            } else {
                setPwError(data.error || (language === "vi" ? "Đổi mật khẩu thất bại" : "Password change failed"));
            }
        } catch {
            setPwError(language === "vi" ? "Lỗi kết nối. Vui lòng thử lại." : "Connection error. Please try again.");
        } finally {
            setPwLoading(false);
        }
    };

    const fetchLoginHistory = async () => {
        if (historyLoaded) return;
        setHistoryLoading(true);
        try {
            const res = await fetch("/api/auth/login-history");
            if (res.ok) {
                const data = await res.json();
                setLoginHistory(data.history || []);
                setHistoryLoaded(true);
            }
        } catch { /* ignore */ }
        finally { setHistoryLoading(false); }
    };

    const handleDeleteAccount = async () => {
        if (!deleteConfirmed || !deletePassword) return;
        setDeleteLoading(true);
        try {
            const res = await fetch("/api/user/account", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: deletePassword }),
            });
            if (res.ok) {
                toast.success(language === "vi" ? "Tài khoản đã được xóa" : "Account deleted");
                await signOut({ callbackUrl: "/" });
            } else {
                const d = await res.json();
                toast.error(d.error || (language === "vi" ? "Xóa tài khoản thất bại" : "Account deletion failed"));
            }
        } catch {
            toast.error("Lỗi kết nối.");
        } finally {
            setDeleteLoading(false);
        }
    };

    const formatDevice = (ua?: string | null) => {
        if (!ua) return language === "vi" ? "Thiết bị không rõ" : "Unknown device";
        if (ua.includes("Mobile")) return "Mobile";
        if (ua.includes("Tablet")) return "Tablet";
        return "Desktop";
    };

    return (
        <>
            {/* Change Password Card */}
            <Card className="border-none shadow-lg shadow-slate-200/50 rounded-[2.5rem]">
                <CardContent className="p-8 md:p-10">
                    <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3">
                        <Lock className="w-6 h-6 text-primary" />
                        {language === "vi" ? "Đổi mật khẩu" : "Change Password"}
                    </h2>
                    <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                        {pwError && (
                            <div className="p-3 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 shrink-0" /> {pwError}
                            </div>
                        )}
                        {/* Current password */}
                        <div className="relative">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">
                                {language === "vi" ? "Mật khẩu hiện tại" : "Current password"}
                            </label>
                            <div className="relative">
                                <input
                                    type={showPw.current ? "text" : "password"} required
                                    value={pwData.current}
                                    onChange={e => setPwData(p => ({ ...p, current: e.target.value }))}
                                    className="w-full bg-slate-50 border-none ring-1 ring-slate-100 rounded-2xl px-6 pr-12 py-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                    placeholder={language === "vi" ? "Nhập mật khẩu hiện tại" : "Enter current password"}
                                />
                                <button type="button" onClick={() => setShowPw(p => ({ ...p, current: !p.current }))}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600">
                                    {showPw.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        {/* New password */}
                        <div>
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">
                                {language === "vi" ? "Mật khẩu mới" : "New password"}
                            </label>
                            <div className="relative">
                                <input
                                    type={showPw.new ? "text" : "password"} required
                                    value={pwData.newPw}
                                    onChange={e => setPwData(p => ({ ...p, newPw: e.target.value }))}
                                    className="w-full bg-slate-50 border-none ring-1 ring-slate-100 rounded-2xl px-6 pr-12 py-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                    placeholder={language === "vi" ? "Ít nhất 8 ký tự, 1 chữ hoa, 1 số" : "At least 8 chars, 1 uppercase, 1 number"}
                                />
                                <button type="button" onClick={() => setShowPw(p => ({ ...p, new: !p.new }))}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600">
                                    {showPw.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {pwData.newPw && (
                                <div className="mt-2 space-y-1">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${i <= pwStrength ? strengthColor[pwStrength] : "bg-slate-100"}`} />
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-400 font-medium">{strengthLabel[pwStrength]}</p>
                                </div>
                            )}
                        </div>
                        {/* Confirm password */}
                        <div>
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">
                                {language === "vi" ? "Xác nhận mật khẩu mới" : "Confirm new password"}
                            </label>
                            <div className="relative">
                                <input
                                    type={showPw.confirm ? "text" : "password"} required
                                    value={pwData.confirm}
                                    onChange={e => setPwData(p => ({ ...p, confirm: e.target.value }))}
                                    className={`w-full bg-slate-50 border-none ring-1 rounded-2xl px-6 pr-12 py-4 outline-none focus:ring-2 transition-all font-medium ${pwData.confirm && pwData.newPw !== pwData.confirm ? "ring-red-300 focus:ring-red-200" : "ring-slate-100 focus:ring-primary/20"}`}
                                    placeholder={language === "vi" ? "Nhập lại mật khẩu mới" : "Re-enter new password"}
                                />
                                <button type="button" onClick={() => setShowPw(p => ({ ...p, confirm: !p.confirm }))}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600">
                                    {showPw.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <Button type="submit" disabled={pwLoading} className="h-12 px-8 rounded-full bg-slate-900 hover:bg-emerald-600 text-white font-bold uppercase tracking-widest transition-all">
                            {pwLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-2" />{language === "vi" ? "Đổi mật khẩu" : "Change Password"}</>}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* 2FA Toggle Card */}
            <Card className="border-none shadow-lg shadow-slate-200/50 rounded-[2.5rem]">
                <CardContent className="p-8 md:p-10">
                    <h2 className="text-2xl font-black uppercase tracking-tighter mb-2 flex items-center gap-3">
                        <Shield className="w-6 h-6 text-primary" />
                        {language === "vi" ? "Xác thực 2 bước (2FA)" : "Two-Factor Auth (2FA)"}
                    </h2>
                    <p className="text-slate-500 font-medium text-sm mb-6">
                        {language === "vi" ? "Thêm lớp bảo mật bổ sung. Mỗi lần đăng nhập sẽ yêu cầu mã OTP qua email." : "Add an extra layer of security. Each login will require an OTP code via email."}
                    </p>
                    <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border-2 border-slate-100">
                        <div>
                            <p className="font-black text-slate-900">
                                {twoFAEnabled ? (language === "vi" ? "Đang bật" : "Enabled") : (language === "vi" ? "Đang tắt" : "Disabled")}
                            </p>
                            <p className="text-sm text-slate-400 font-medium">
                                {twoFAEnabled
                                    ? (language === "vi" ? "Tài khoản của bạn được bảo vệ bởi 2FA" : "Your account is protected by 2FA")
                                    : (language === "vi" ? "Bật để tăng cường bảo mật tài khoản" : "Enable to enhance account security")}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            {!twoFALoaded && (
                                <Button onClick={fetchTwoFAStatus} variant="outline" className="rounded-full text-sm font-bold">
                                    {language === "vi" ? "Tải trạng thái" : "Load status"}
                                </Button>
                            )}
                            {twoFALoaded && (
                                <button
                                    onClick={() => handleToggle2FA(!twoFAEnabled)}
                                    disabled={twoFALoading}
                                    className={`relative w-14 h-8 rounded-full transition-colors ${twoFAEnabled ? "bg-emerald-500" : "bg-slate-300"} disabled:opacity-50`}
                                >
                                    {twoFALoading
                                        ? <Loader2 className="w-4 h-4 animate-spin text-white mx-auto" />
                                        : <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform shadow ${twoFAEnabled ? "translate-x-6" : "translate-x-0"}`} />
                                    }
                                </button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Login History Card */}
            <Card className="border-none shadow-lg shadow-slate-200/50 rounded-[2.5rem]">
                <CardContent className="p-8 md:p-10">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                            <Clock className="w-6 h-6 text-primary" />
                            {language === "vi" ? "Lịch sử đăng nhập" : "Login History"}
                        </h2>
                        {!historyLoaded && (
                            <Button onClick={fetchLoginHistory} variant="outline" className="rounded-full border-slate-200 text-slate-600 font-bold text-sm gap-2">
                                {historyLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Monitor className="w-4 h-4" />{language === "vi" ? "Xem lịch sử" : "View history"}</>}
                            </Button>
                        )}
                    </div>
                    {!historyLoaded ? (
                        <p className="text-slate-400 font-medium text-sm">{language === "vi" ? 'Nhấn "Xem lịch sử" để tải danh sách đăng nhập gần đây.' : 'Press "View history" to load recent login attempts.'}</p>
                    ) : loginHistory.length === 0 ? (
                        <p className="text-slate-400 font-medium text-sm">{language === "vi" ? "Chưa có lịch sử đăng nhập." : "No login history yet."}</p>
                    ) : (
                        <div className="space-y-3">
                            {loginHistory.map(h => (
                                <div key={h.id} className={`flex items-center gap-4 p-4 rounded-2xl border-2 ${h.isSuspicious ? "bg-red-50 border-red-100" : "bg-slate-50 border-slate-100"}`}>
                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl ${h.isSuspicious ? "bg-red-100" : "bg-slate-100"}`}>
                                        {h.isSuspicious ? "!" : "OK"}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-black text-slate-900 text-sm">{formatDevice(h.userAgent)}</p>
                                        <p className="text-xs text-slate-400 font-medium">
                                            IP: {h.ipAddress || "N/A"} {h.country ? ` - ${h.country}` : ""}
                                        </p>
                                    </div>
                                    <p className="text-xs text-slate-400 font-medium shrink-0">
                                        {new Date(h.createdAt).toLocaleString(language === "vi" ? "vi-VN" : "en-US")}
                                    </p>
                                    {h.isSuspicious && (
                                        <span className="px-2 py-1 bg-red-500 text-white text-[10px] font-black uppercase rounded-full">
                                            {language === "vi" ? "Nghi ngờ" : "Suspicious"}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Danger Zone — Delete Account */}
            <Card className="border-2 border-red-100 shadow-lg bg-red-50/30 rounded-[2.5rem]">
                <CardContent className="p-8 md:p-10">
                    <h2 className="text-2xl font-black uppercase tracking-tighter mb-2 flex items-center gap-3 text-red-700">
                        <AlertTriangle className="w-6 h-6" />
                        {language === "vi" ? "Vùng nguy hiểm" : "Danger Zone"}
                    </h2>
                    <p className="text-slate-500 font-medium text-sm mb-6">
                        {language === "vi" ? "Các hành động sau không thể hoàn tác. Hãy cẩn thận." : "The following actions cannot be undone. Be careful."}
                    </p>
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-red-200 text-red-600 font-bold text-sm hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
                    >
                        <Trash2 className="w-4 h-4" /> {language === "vi" ? "Xóa tài khoản vĩnh viễn" : "Delete account permanently"}
                    </button>
                </CardContent>
            </Card>

            {/* Delete Account Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-[2rem] p-10 max-w-sm w-full shadow-2xl">
                            <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-6">
                                <Trash2 className="w-8 h-8 text-red-500" />
                            </div>
                            <h3 className="text-xl font-black uppercase text-center text-red-700 mb-2">
                                {language === "vi" ? "Xóa tài khoản" : "Delete Account"}
                            </h3>
                            <p className="text-slate-500 text-sm text-center font-medium mb-6">
                                {language === "vi" ? "Tất cả dữ liệu (đơn hàng, điểm, địa chỉ) sẽ bị xóa vĩnh viễn." : "All data (orders, points, addresses) will be permanently deleted."}
                            </p>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">
                                        {language === "vi" ? "Nhập mật khẩu để xác nhận" : "Enter password to confirm"}
                                    </label>
                                    <input
                                        type="password" value={deletePassword}
                                        onChange={e => setDeletePassword(e.target.value)}
                                        className="w-full bg-slate-50 ring-1 ring-slate-100 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-200 font-medium text-sm"
                                        placeholder={language === "vi" ? "Mật khẩu của bạn" : "Your password"}
                                    />
                                </div>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" checked={deleteConfirmed} onChange={e => setDeleteConfirmed(e.target.checked)}
                                        className="w-4 h-4 rounded border-red-300 text-red-500 focus:ring-red-200" />
                                    <span className="text-sm text-slate-600 font-medium">
                                        {language === "vi" ? "Tôi hiểu và đồng ý xóa vĩnh viễn" : "I understand and agree to permanently delete"}
                                    </span>
                                </label>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleDeleteAccount}
                                        disabled={!deleteConfirmed || !deletePassword || deleteLoading}
                                        className="flex-1 py-3 rounded-2xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-all disabled:opacity-40"
                                    >
                                        {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (language === "vi" ? "Xóa vĩnh viễn" : "Delete permanently")}
                                    </button>
                                    <button onClick={() => { setShowDeleteModal(false); setDeletePassword(""); setDeleteConfirmed(false); }}
                                        className="flex-1 py-3 rounded-2xl border-2 border-slate-100 text-slate-500 font-bold text-sm hover:bg-slate-50 transition-all">
                                        {language === "vi" ? "Hủy" : "Cancel"}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Enable 2FA Modal */}
            <AnimatePresence>
                {show2FAModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-[2rem] p-10 max-w-sm w-full shadow-2xl">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                                <Shield className="w-8 h-8 text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-black uppercase text-center text-slate-800 mb-2">
                                {language === "vi" ? "Xác nhận OTP" : "Confirm OTP"}
                            </h3>
                            <p className="text-slate-500 text-sm text-center font-medium mb-6">
                                {language === "vi" ? "Nhập mã 6 số vừa được gửi đến email của bạn để bật 2FA." : "Enter the 6-digit code sent to your email to enable 2FA."}
                            </p>
                            <div className="space-y-4">
                                <input
                                    type="text" maxLength={6}
                                    value={otp2FA}
                                    onChange={e => setOtp2FA(e.target.value.toUpperCase())}
                                    className="w-full text-center text-2xl font-black tracking-widest bg-slate-50 ring-1 ring-slate-100 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 uppercase"
                                    placeholder="••••••"
                                />
                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={handleConfirm2FA}
                                        disabled={otp2FA.length < 6 || otpLoading}
                                        className="flex-1 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition-all disabled:opacity-40"
                                    >
                                        {otpLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (language === "vi" ? "Xác nhận" : "Confirm")}
                                    </button>
                                    <button onClick={() => { setShow2FAModal(false); setOtp2FA(""); }}
                                        disabled={otpLoading}
                                        className="flex-1 py-3 rounded-2xl border-2 border-slate-100 text-slate-500 font-bold text-sm hover:bg-slate-50 transition-all">
                                        {language === "vi" ? "Hủy" : "Cancel"}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
