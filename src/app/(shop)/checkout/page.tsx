"use client";

/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ChevronRight, CreditCard, Truck, CheckCircle2, ArrowLeft, Ticket, X, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSession } from "next-auth/react";
import VoucherPickerModal from "@/components/checkout/VoucherPickerModal";
import CheckoutAddressSkeleton from "@/components/checkout/CheckoutAddressSkeleton";
import { tracking } from "@/lib/tracking";
import { logger } from "@/lib/logger";
import { toast } from "sonner";
import { useLanguage } from "@/lib/i18n/context";
import { EXPRESS_SHIPPING_FEE_USD, FREE_SHIPPING_THRESHOLD_USD, OVERNIGHT_SHIPPING_FEE_USD, getShippingFeeUsd } from "@/lib/commerce";

// STEPS moved inside component for i18n

const stripePromise =
    typeof window === "undefined" || !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
        ? null
        : loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

interface Address {
    id: string;
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state?: string | null;
    zipCode: string;
    country: string;
    isDefault: boolean;
}

type PaymentMethod = "COD" | "BANK" | "MOMO" | "PAYPAL" | "STRIPE" | "ZALOPAY";

interface PublicSettings {
    PAYMENT_COD_ENABLED?: string;
    PAYMENT_BANK_ENABLED?: string;
    PAYMENT_MOMO_ENABLED?: string;
    PAYMENT_PAYPAL_ENABLED?: string;
    PAYMENT_STRIPE_ENABLED?: string;
    ZALO_PAY_ENABLED?: string;
}

function CheckoutContent() {
    const { t, language } = useLanguage();
    const STEPS = language === "vi" ? ["Giao hàng", "Thanh toán", "Hoàn tất"] : ["Shipping", "Payment", "Complete"];
    const router = useRouter();
    const { data: session } = useSession();
    const { items, totalPrice, clearCart } = useCart();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        zipCode: "",
        shippingMethod: "standard",
    });
    const [saveInfo, setSaveInfo] = useState(false);
    
    // Load saved checkout info from localStorage
    useEffect(() => {
        const savedInfo = localStorage.getItem("checkout_info");
        if (savedInfo && !session?.user) {
            try {
                const parsed = JSON.parse(savedInfo);
                setFormData(prev => ({
                    ...prev,
                    fullName: parsed.fullName || "",
                    email: parsed.email || "",
                    phone: parsed.phone || "",
                    address: parsed.address || "",
                    city: parsed.city || "",
                    zipCode: parsed.zipCode || "",
                }));
                setSaveInfo(true);
            } catch (e) {
                console.error("Failed to load saved checkout info", e);
            }
        }
    }, [session]);
    
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    interface CheckoutVoucher {
        id: string;
        code: string;
        discountType: "PERCENTAGE" | "FIXED";
        discountValue: number;
        discountAmount: number;
        minOrderValue: number | null;
        maxDiscount: number | null;
        category: string;
        canUse: boolean;
        reason: string;
    }
    const [selectedVoucher, setSelectedVoucher] = useState<CheckoutVoucher | null>(null);
    const [showVoucherModal, setShowVoucherModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("STRIPE");
    const [availablePayments, setAvailablePayments] = useState<Record<PaymentMethod, boolean>>({
        COD: false,
        BANK: false,
        MOMO: false,
        PAYPAL: false,
        STRIPE: true,
        ZALOPAY: false,
    });
    const [userPoints, setUserPoints] = useState(0);
    const [usePoints, setUsePoints] = useState(false);
    const [pointsToUse, setPointsToUse] = useState(0);

    // Calculate shipping fee based on method
    const shippingFee = useMemo(() => {
        return getShippingFeeUsd(totalPrice, formData.shippingMethod);
    }, [formData.shippingMethod, totalPrice]);

    // Calculate points discount
    const pointsDiscount = useMemo(() => {
        if (!usePoints) return 0;
        return pointsToUse / 100;
    }, [usePoints, pointsToUse]);

    // Calculate final total
    const finalTotal = useMemo(() => {
        const discount = selectedVoucher?.discountAmount || 0;
        return Math.max(0, totalPrice + shippingFee - discount - pointsDiscount);
    }, [totalPrice, shippingFee, selectedVoucher, pointsDiscount]);

    // Load user points
    useEffect(() => {
        if (!session?.user) return;
        const loadPoints = async () => {
            try {
                const res = await fetch("/api/user/points");
                if (res.ok) {
                    const data = await res.json();
                    setUserPoints(data.points || 0);
                }
            } catch (err) {
                console.error("Failed to load user points", err);
            }
        };
        loadPoints();
    }, [session]);

    const stripe = useStripe();
    const elements = useElements();

    // Load public payment settings từ backend
    useEffect(() => {
        const loadPaymentSettings = async () => {
            try {
                const { getPublicSettings } = await import("@/lib/public-settings");
                const data: PublicSettings = await getPublicSettings();

                const cod = data.PAYMENT_COD_ENABLED === "true";
                const bank = data.PAYMENT_BANK_ENABLED === "true";
                const momo = data.PAYMENT_MOMO_ENABLED === "true";
                const paypal = data.PAYMENT_PAYPAL_ENABLED === "true";
                const stripeEnabled = data.PAYMENT_STRIPE_ENABLED === "true";
                const zaloPay = data.ZALO_PAY_ENABLED === "true";

                const updated: Record<PaymentMethod, boolean> = {
                    COD: cod,
                    BANK: bank,
                    MOMO: momo,
                    PAYPAL: paypal,
                    STRIPE: stripeEnabled,
                    ZALOPAY: zaloPay,
                };

                // Nếu tất cả đều false, giữ Stripe mặc định (nếu có key env) để không chặn thanh toán
                const anyEnabled = Object.values(updated).some(Boolean);

                setAvailablePayments(anyEnabled ? updated : {
                    COD: false,
                    BANK: false,
                    MOMO: false,
                    PAYPAL: false,
                    STRIPE: true,
                    ZALOPAY: false,
                });

                // Chọn phương thức mặc định là cái đầu tiên được bật
                const priorityOrder: PaymentMethod[] = ["COD", "BANK", "MOMO", "PAYPAL", "ZALOPAY", "STRIPE"];
                const firstEnabled = priorityOrder.find(m => updated[m]);
                if (firstEnabled) {
                    setPaymentMethod(firstEnabled);
                } else {
                    setPaymentMethod("STRIPE");
                }
            } catch {
                // Nếu lỗi, giữ cấu hình mặc định Stripe
            }
        };

        loadPaymentSettings();
    }, []);

    useEffect(() => {
        if (!session?.user) return;

        const loadAddresses = async () => {
            try {
                setIsLoadingAddresses(true);
                const res = await fetch("/api/user/addresses");
                if (!res.ok) return;
                const data: Address[] = await res.json();
                setAddresses(data);
                if (data.length > 0) {
                    const defaultAddr = data.find(a => a.isDefault) || data[0];
                    setSelectedAddressId(defaultAddr.id);
                    setFormData(prev => ({
                        ...prev,
                        fullName: defaultAddr.fullName,
                        phone: defaultAddr.phone,
                        address: defaultAddr.address,
                        city: defaultAddr.city,
                        zipCode: defaultAddr.zipCode,
                    }));
                }
            } catch (err) {
                logger.error("Failed to load addresses for checkout", err as Error, { context: "checkout-page" });
            } finally {
                setIsLoadingAddresses(false);
            }
        };

        loadAddresses();
    }, [session]);

    // Auto-apply best voucher on mount
    useEffect(() => {
        if (!session?.user || selectedVoucher || totalPrice === 0) return;

        const autoApplyVoucher = async () => {
            try {
                const res = await fetch(`/api/vouchers/checkout?orderTotal=${totalPrice}`);
                if (res.ok) {
                    const data = await res.json();
                    const vouchers = data.vouchers || [];
                    const bestVoucher = vouchers.find((v: CheckoutVoucher) => v.canUse);
                    if (bestVoucher) {
                        setSelectedVoucher(bestVoucher);
                    }
                }
            } catch (error) {
                logger.warn("Failed to auto-apply voucher", { context: "checkout-page", error: error as Error });
            }
        };

        autoApplyVoucher();
    }, [session, totalPrice, selectedVoucher]);

    if (items.length === 0 && step < 3) {
        return (
            <div className="page-container-wide py-32 text-center">
                <div className="bg-slate-100 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner shadow-black/5">
                    <ShoppingBag className="w-12 h-12 text-slate-400" />
                </div>
                <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">{t("cart.emptyCart")}</h1>
                <p className="text-xl text-slate-400 mb-12 max-w-lg mx-auto leading-relaxed">
                    {language === "vi" ? "Giỏ hàng của bạn đang trống. Hãy quay lại cửa hàng để chọn sản phẩm nhé." : "Your cart is empty. Let's go back and add some products."}
                </p>
                <Link href="/products" prefetch={true}>
                    <button className="bg-primary text-white px-10 py-5 rounded-full font-black uppercase tracking-widest shadow-2xl shadow-primary/30 hover:bg-primary/90 transition-all transform hover:scale-105 active:scale-95">
                        {t("shop.continueShopping")}
                    </button>
                </Link>
            </div>
        );
    }

    const nextStep = () => setStep((s) => s + 1);
    const prevStep = () => setStep((s) => s - 1);

    const handleOrder = async () => {
        // Với Stripe Card, cần stripe + elements sẵn sàng
        if (paymentMethod === "STRIPE" && (!stripe || !elements)) {
            toast.error(language === "vi" ? "Hệ thống thanh toán đang được khởi tạo, vui lòng thử lại sau giây lát." : "Payment system is initializing, please try again shortly.");
            return;
        }

        // Track begin checkout
        tracking.beginCheckout(totalPrice, items.map(item => ({
            item_id: item.id,
            item_name: item.name,
            price: item.price,
            quantity: item.quantity
        })));

        setIsSubmitting(true);
        try {
            // Calculate discount from voucher
            let discount = 0;
            let couponCode: string | null = null;
            if (selectedVoucher && selectedVoucher.canUse) {
                discount = selectedVoucher.discountAmount;
                couponCode = selectedVoucher.code;
            }

            // Prepare order data
            const orderData = {
                items: items.map(item => ({
                    productId: item.productId,
                    variantId: item.variantId || null,
                    quantity: item.quantity,
                })),
                shippingAddress: formData.address,
                shippingCity: formData.city,
                shippingZipCode: formData.zipCode,
                shippingPhone: formData.phone,
                shippingMethod: formData.shippingMethod,
                shippingFee,
                paymentMethod,
                couponCode,
                discount,
                pointsToUse: usePoints ? pointsToUse : 0,
                notes: `Order for ${formData.fullName}`,
            };

            // Save info for next time if checked
            if (saveInfo) {
                const checkoutInfo = {
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    zipCode: formData.zipCode,
                };
                localStorage.setItem("checkout_info", JSON.stringify(checkoutInfo));
            }

            // Create order - guest checkout for non-logged-in users
            const isGuestCheckout = !session?.user;
            const orderEndpoint = isGuestCheckout ? "/api/orders/guest" : "/api/orders";
            const orderPayload = isGuestCheckout
                ? {
                    ...orderData,
                    guestEmail: formData.email,
                    guestName: formData.fullName,
                  }
                : orderData;

            const res = await fetch(orderEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderPayload),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Failed to create order");
            }

            const order = await res.json();

            // Nếu chọn Stripe, tiến hành tạo PaymentIntent và xác nhận thanh toán
            if (paymentMethod === "STRIPE") {
                if (!stripe || !elements) {
                    toast.error(language === "vi" ? "Hệ thống thanh toán Stripe chưa sẵn sàng." : "Stripe payment system is not ready.");
                    setIsSubmitting(false);
                    return;
                }

                let clientSecret: string | null = null;
                try {
                    const piRes = await fetch("/api/payments/create-intent", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ orderId: order.id }),
                    });

                    if (piRes.ok) {
                        const piData = await piRes.json();
                        clientSecret = piData.clientSecret;
                    } else {
                        logger.error("Failed to create payment intent", new Error("Internal Payment Service Error"), { context: "checkout-page" });
                    }
                } catch (piError) {
                    logger.error("Failed to create payment intent", piError as Error, { context: "checkout-page" });
                }

                // Nếu có clientSecret thì thực hiện confirm thanh toán với Stripe
                if (clientSecret) {
                    const cardElement = elements.getElement(CardElement);
                    if (!cardElement) {
                        toast.error(language === "vi" ? "Không tìm thấy thẻ thanh toán. Vui lòng thử lại." : "Card not found. Please try again.");
                        setIsSubmitting(false);
                        return;
                    }

                    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                        payment_method: {
                            card: cardElement,
                        },
                    });

                    if (error) {
                        const e = new Error(error.message || "Stripe payment error");
                        e.name = error.type || "StripeError";
                        logger.error("Stripe payment error", e, { context: "checkout-page", stripeType: error.type });
                        throw new Error(error.message || (language === "vi" ? "Thanh toán không thành công. Vui lòng thử lại." : "Payment failed. Please try again."));
                    }

                    if (paymentIntent && paymentIntent.status !== "succeeded") {
                        throw new Error(language === "vi" ? "Thanh toán chưa hoàn tất. Vui lòng kiểm tra lại." : "Payment not completed. Please check again.");
                    }
                }
            }

            // Track purchase
            tracking.purchase(order.id, order.total, items.map(item => ({
                item_id: item.id,
                item_name: item.name,
                price: item.price,
                quantity: item.quantity
            })));

            // Track coupon if applied
            if (selectedVoucher) {
                tracking.selectPromotion(selectedVoucher.id, selectedVoucher.code);
            }

            // Store order ID and clear cart
            setOrderId(order.id);
            clearCart();

            // For non-Stripe payments (COD, BANK, MOMO, ZALOPAY), show payment instructions in step 3
            // For Stripe, redirect to order success page
            if (paymentMethod === "STRIPE") {
                router.push(`/order-success?orderId=${order.id}`);
            } else {
                // Show payment instructions for other methods
                setStep(3);
            }
        } catch (error: unknown) {
            const err = error instanceof Error ? error : new Error(typeof error === "string" ? error : "Unknown error");
            logger.error("Order creation error", err, { context: "checkout-page" });
            toast.error(err.message || (language === "vi" ? "Đã có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại." : "An error occurred creating the order. Please try again."));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen py-20">
            <div className="page-container-wide">
                {/* Progress Stepper */}
                <div className="flex items-center justify-between mb-16 relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 -z-10" />
                    <div
                        className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 -z-10 transition-all duration-500"
                        style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
                    />
                    {STEPS.map((s, i) => (
                        <div key={i} className="flex flex-col items-center gap-3">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg transition-all duration-300 ${step > i + 1 ? "bg-primary text-white" :
                                step === i + 1 ? "bg-primary text-white scale-110 shadow-xl shadow-primary/30" :
                                    "bg-white text-slate-300 border-2 border-slate-200"
                                }`}>
                                {step > i + 1 ? <CheckCircle2 className="w-6 h-6" /> : i + 1}
                            </div>
                            <span className={`text-xs font-black uppercase tracking-widest ${step >= i + 1 ? "text-primary" : "text-slate-400"}`}>
                                {s}
                            </span>
                        </div>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white rounded-[3rem] p-10 lg:p-16 shadow-xl shadow-slate-200/50 border border-slate-100"
                        >
                            <h2 className="text-3xl font-black uppercase tracking-tighter mb-10 flex items-center gap-4">
                                <Truck className="w-8 h-8 text-primary" /> {language === "vi" ? "Thông tin giao hàng" : "Shipping Information"}
                            </h2>

                            {/* Guest checkout notice */}
                            {!session?.user && (
                                <div className="mb-8 rounded-2xl bg-amber-50 border border-amber-200 px-6 py-4 flex items-start gap-4">
                                    <Sparkles className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-sm font-bold text-amber-800">
                                            {language === "vi" ? "Đang đặt hàng với tư cách khách" : "Checking out as guest"}
                                        </p>
                                        <p className="text-xs text-amber-600 mt-1">
                                            {language === "vi"
                                                ? "Bạn có thể tiếp tục mà không cần đăng nhập. Nhập email để nhận xác nhận đơn hàng."
                                                : "You can continue without an account. Enter your email to receive order confirmation."}
                                            {" "}
                                            <Link href="/login" className="underline font-bold">
                                                {language === "vi" ? "Đăng nhập" : "Sign in"}
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Address selector from address book (nếu đã đăng nhập) */}
                            {session?.user && (
                                <div className="mb-8">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                                            {language === "vi" ? "Chọn địa chỉ đã lưu" : "Select saved address"}
                                        </span>
                                        <Link
                                            href="/profile"
                                            className="text-xs font-black uppercase tracking-widest text-primary hover:underline"
                                        >
                                            {language === "vi" ? "Quản lý trong Profile" : "Manage in Profile"}
                                        </Link>
                                    </div>
                                    {isLoadingAddresses ? (
                                        <CheckoutAddressSkeleton />
                                    ) : addresses.length === 0 ? (
                                        <p className="text-xs text-slate-400">
                                            {language === "vi" ? "Bạn chưa có địa chỉ nào. Thêm địa chỉ trong trang Profile để dùng nhanh ở đây." : "You have no addresses yet. Add an address in Profile for quick use here."}
                                        </p>
                                    ) : (
                                        <div className="space-y-2">
                                            {addresses.map((addr) => (
                                                <button
                                                    key={addr.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedAddressId(addr.id);
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            fullName: addr.fullName,
                                                            phone: addr.phone,
                                                            address: addr.address,
                                                            city: addr.city,
                                                            zipCode: addr.zipCode,
                                                        }));
                                                    }}
                                                    className={`w-full text-left px-4 py-3 rounded-2xl border text-xs font-medium transition-all ${selectedAddressId === addr.id
                                                        ? "border-primary bg-primary/5 text-slate-900"
                                                        : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between gap-2">
                                                        <div>
                                                            <p className="font-semibold text-slate-900 text-sm">
                                                                {addr.fullName} {addr.isDefault && (
                                                                    <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-primary text-white">
                                                                        {language === "vi" ? "Mặc định" : "Default"}
                                                                    </span>
                                                                )}
                                                            </p>
                                                            <p className="text-xs text-slate-500">
                                                                {addr.address}, {addr.city} {addr.state || ""} {addr.zipCode}
                                                            </p>
                                                            <p className="text-xs text-slate-500">
                                                                {addr.phone}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">{language === "vi" ? "Họ và tên" : "Full name"}</label>
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full bg-slate-50 border-none ring-1 ring-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        placeholder="Nguyễn Văn A"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-slate-50 border-none ring-1 ring-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        placeholder="email@example.com"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">{language === "vi" ? "Địa chỉ tại Mỹ" : "US Address"}</label>
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full bg-slate-50 border-none ring-1 ring-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        placeholder="123 Flavor St, Garden Grove, CA"
                                    />
                                </div>

                                {/* Save Info Checkbox */}
                                <div className="md:col-span-2">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={saveInfo}
                                            onChange={(e) => setSaveInfo(e.target.checked)}
                                            className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/20"
                                        />
                                        <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                                            {language === "vi" 
                                                ? "Lưu thông tin cho lần mua sau" 
                                                : "Save info for next purchase"}
                                        </span>
                                    </label>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">{language === "vi" ? "Số điện thoại" : "Phone number"}</label>
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-slate-50 border-none ring-1 ring-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        placeholder="+1 (..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Zip Code</label>
                                    <input
                                        type="text"
                                        value={formData.zipCode}
                                        onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                                        className="w-full bg-slate-50 border-none ring-1 ring-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        placeholder="92840"
                                    />
                                </div>
                            </div>

                            {/* Voucher Selection */}
                            <div className="mt-8 pt-8 border-t border-slate-100 uppercase tracking-widest text-[#64748b] font-black text-[10px] mb-4">
                                {language === "vi" ? "Ưu đãi & Giảm giá" : "Offers & Discounts"}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {selectedVoucher ? (
                                    <div className="p-4 bg-green-50 border-2 border-green-200 rounded-2xl flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Ticket className="w-5 h-5 text-green-600" />
                                            <div>
                                                <p className="font-black text-green-900 text-xs">{selectedVoucher.code}</p>
                                                <p className="text-[10px] text-green-700 font-bold">
                                                    {language === "vi" ? "Giảm" : "Save"} {selectedVoucher.discountType === "PERCENTAGE" ? `${selectedVoucher.discountValue}%` : `$${selectedVoucher.discountValue.toFixed(2)}`}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedVoucher(null)}
                                            className="p-2 hover:bg-green-100 rounded-full transition-colors"
                                        >
                                            <X className="w-4 h-4 text-green-600" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setShowVoucherModal(true)}
                                        className="p-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Ticket className="w-5 h-5" />
                                        <span className="text-xs font-bold">{language === "vi" ? "Chọn voucher" : "Select voucher"}</span>
                                    </button>
                                )}

                                {/* Loyalty Points Section */}
                                {userPoints > 0 && (
                                    <div className={`p-4 rounded-2xl border-2 transition-all ${usePoints ? "border-amber-200 bg-amber-50" : "border-slate-100 bg-white"}`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-2xl flex items-center justify-center ${usePoints ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-400"}`}>
                                                    <Sparkles className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className={`font-black text-xs ${usePoints ? "text-amber-900" : "text-slate-500"}`}>{language === "vi" ? "Dùng LIKEFOOD Xu" : "Use LIKEFOOD Points"}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold">{language === "vi" ? `Bạn có ${userPoints} Xu` : `You have ${userPoints} Points`}</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newVal = !usePoints;
                                                    setUsePoints(newVal);
                                                    if (newVal) setPointsToUse(Math.min(userPoints, Math.floor((totalPrice - (selectedVoucher?.discountAmount || 0)) * 100)));
                                                }}
                                                className={`w-10 h-6 rounded-full relative transition-colors ${usePoints ? "bg-amber-500" : "bg-slate-200"}`}
                                            >
                                                <motion.div
                                                    animate={{ x: usePoints ? 18 : 2 }}
                                                    className="w-4 h-4 bg-white rounded-full absolute top-1"
                                                />
                                            </button>
                                        </div>
                                        {usePoints && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                className="mt-3 pt-3 border-t border-amber-200/50"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-bold text-amber-700">{language === "vi" ? "Giá trị quy đổi" : "Converted value"}</span>
                                                    <span className="text-[10px] font-black text-amber-900">-${(pointsToUse / 100).toFixed(2)}</span>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Shipping Method Selection */}
                            <div className="mt-8 pt-8 border-t border-slate-100">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 block">
                                    {language === "vi" ? "Phương thức vận chuyển" : "Shipping method"}
                                </label>
                                <div className="space-y-3">
                                    {[
                                        {
                                            id: "standard",
                                            name: language === "vi" ? "Giao hàng tiêu chuẩn" : "Standard shipping",
                                            time: language === "vi" ? "3-5 ngày làm việc" : "3-5 business days",
                                            price: totalPrice >= FREE_SHIPPING_THRESHOLD_USD ? 0 : getShippingFeeUsd(totalPrice, "standard"),
                                            free: totalPrice >= FREE_SHIPPING_THRESHOLD_USD,
                                            estimatedDays: 4
                                        },
                                        {
                                            id: "express",
                                            name: language === "vi" ? "Giao hàng nhanh" : "Express shipping",
                                            time: language === "vi" ? "1-2 ngày làm việc" : "1-2 business days",
                                            price: EXPRESS_SHIPPING_FEE_USD,
                                            estimatedDays: 2
                                        },
                                        {
                                            id: "overnight",
                                            name: language === "vi" ? "Giao hàng trong ngày" : "Same-day delivery",
                                            time: language === "vi" ? "Trong ngày (nếu đặt trước 12h)" : "Same day (if ordered before 12pm)",
                                            price: OVERNIGHT_SHIPPING_FEE_USD,
                                            estimatedDays: 1
                                        },
                                    ].map((method) => {
                                        const estimatedDate = (() => {
                                            const now = new Date();
                                            now.setDate(now.getDate() + method.estimatedDays);
                                            return now.toLocaleDateString(language === "vi" ? "vi-VN" : "en-US", { day: "numeric", month: "long", year: "numeric" });
                                        })();
                                        return (
                                            <button
                                                key={method.id}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, shippingMethod: method.id })}
                                                className={`w-full p-6 rounded-[2rem] border-2 transition-all text-left ${formData.shippingMethod === method.id
                                                    ? "border-primary bg-primary/5"
                                                    : "border-slate-100 hover:border-slate-200 bg-white"
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.shippingMethod === method.id
                                                            ? "border-primary bg-primary"
                                                            : "border-slate-300"
                                                            }`}>
                                                            {formData.shippingMethod === method.id && (
                                                                <div className="w-2 h-2 rounded-full bg-white" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-lg">{method.name}</p>
                                                            <p className="text-sm text-slate-500 font-medium">{method.time}</p>
                                                            <p className="text-xs text-primary font-bold mt-1">
                                                                {language === "vi" ? "Dự kiến giao" : "Est. delivery"}: {estimatedDate}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        {method.free ? (
                                                            <p className="font-black text-primary">{language === "vi" ? "Miễn phí" : "Free"}</p>
                                                        ) : (
                                                            <p className="font-black text-slate-900">${method.price.toFixed(2)}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <Button
                                onClick={nextStep}
                                className="w-full h-16 rounded-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest shadow-2xl shadow-primary/30 mt-12"
                            >
                                {language === "vi" ? "Tiếp tục thanh toán" : "Continue to payment"} <ChevronRight className="w-5 h-5 ml-2" />
                            </Button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white rounded-[3rem] p-10 lg:p-16 shadow-xl shadow-slate-200/50 border border-slate-100"
                        >
                            <button onClick={prevStep} className="inline-flex items-center text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary mb-8 transition-colors">
                                <ArrowLeft className="w-4 h-4 mr-2" /> {language === "vi" ? "Quay lại thông tin giao hàng" : "Back to shipping info"}
                            </button>
                            <h2 className="text-3xl font-black uppercase tracking-tighter mb-10 flex items-center gap-4">
                                <CreditCard className="w-8 h-8 text-primary" /> {language === "vi" ? "Phương thức thanh toán" : "Payment Method"}
                            </h2>

                            <div className="space-y-6">
                                {/* Danh sách phương thức thanh toán theo flag từ admin */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {availablePayments.COD && (
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod("COD")}
                                            className={`p-6 rounded-3xl border-2 transition-all text-left flex items-center justify-between ${paymentMethod === "COD"
                                                ? "border-primary bg-primary/5 shadow-sm"
                                                : "border-slate-100 hover:border-slate-200 bg-white"
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                                                    <Truck className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-sm">{language === "vi" ? "Thanh toán khi nhận hàng (COD)" : "Cash on Delivery (COD)"}</p>
                                                    <p className="text-[11px] text-slate-500 font-bold uppercase">
                                                        {language === "vi" ? "Phù hợp khách muốn kiểm hàng trước khi trả" : "Inspect items before paying"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border-2 ${paymentMethod === "COD" ? "border-primary bg-primary" : "border-slate-300"}`} />
                                        </button>
                                    )}

                                    {availablePayments.BANK && (
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod("BANK")}
                                            className={`p-6 rounded-3xl border-2 transition-all text-left flex items-center justify-between ${paymentMethod === "BANK"
                                                ? "border-primary bg-primary/5 shadow-sm"
                                                : "border-slate-100 hover:border-slate-200 bg-white"
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                                                    <CreditCard className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-sm">{language === "vi" ? "Chuyển khoản ngân hàng" : "Bank Transfer"}</p>
                                                    <p className="text-[11px] text-slate-500 font-bold uppercase">
                                                        {language === "vi" ? "Thông tin tài khoản sẽ hiển thị sau khi đặt hàng" : "Account info will be shown after placing order"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border-2 ${paymentMethod === "BANK" ? "border-primary bg-primary" : "border-slate-300"}`} />
                                        </button>
                                    )}

                                    {availablePayments.MOMO && (
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod("MOMO")}
                                            className={`p-6 rounded-3xl border-2 transition-all text-left flex items-center justify-between ${paymentMethod === "MOMO"
                                                ? "border-primary bg-primary/5 shadow-sm"
                                                : "border-slate-100 hover:border-slate-200 bg-white"
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                                                    <ShoppingBag className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-sm">Ví MoMo</p>
                                                    <p className="text-[11px] text-slate-500 font-bold uppercase">
                                                        {language === "vi" ? "Quét QR hoặc thanh toán qua app MoMo" : "Scan QR or pay via MoMo app"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border-2 ${paymentMethod === "MOMO" ? "border-primary bg-primary" : "border-slate-300"}`} />
                                        </button>
                                    )}

                                    {availablePayments.PAYPAL && (
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod("PAYPAL")}
                                            className={`p-6 rounded-3xl border-2 transition-all text-left flex items-center justify-between ${paymentMethod === "PAYPAL"
                                                ? "border-primary bg-primary/5 shadow-sm"
                                                : "border-slate-100 hover:border-slate-200 bg-white"
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                                                    <ShoppingBag className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-sm">PayPal</p>
                                                    <p className="text-[11px] text-slate-500 font-bold uppercase">
                                                        {language === "vi" ? "Thanh toán quốc tế qua tài khoản PayPal" : "International payment via PayPal"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border-2 ${paymentMethod === "PAYPAL" ? "border-primary bg-primary" : "border-slate-300"}`} />
                                        </button>
                                    )}

                                    {availablePayments.ZALOPAY && (
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod("ZALOPAY")}
                                            className={`p-6 rounded-3xl border-2 transition-all text-left flex items-center justify-between ${paymentMethod === "ZALOPAY"
                                                ? "border-primary bg-primary/5 shadow-sm"
                                                : "border-slate-100 hover:border-slate-200 bg-white"
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                                                    <ShoppingBag className="w-5 h-5 text-blue-500" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-sm">ZaloPay</p>
                                                    <p className="text-[11px] text-slate-500 font-bold uppercase">
                                                        {language === "vi" ? "Quét QR hoặc thanh toán qua ZaloPay" : "Scan QR or pay via ZaloPay"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border-2 ${paymentMethod === "ZALOPAY" ? "border-primary bg-primary" : "border-slate-300"}`} />
                                        </button>
                                    )}

                                    {availablePayments.STRIPE && (
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod("STRIPE")}
                                            className={`p-6 rounded-3xl border-2 transition-all text-left flex items-center justify-between ${paymentMethod === "STRIPE"
                                                ? "border-primary bg-primary/5 shadow-sm"
                                                : "border-slate-100 hover:border-slate-200 bg-white"
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                                                    <CreditCard className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-sm">{language === "vi" ? "Thẻ tín dụng / ghi nợ" : "Credit / Debit Card"}</p>
                                                    <p className="text-[11px] text-slate-500 font-bold uppercase">
                                                        {language === "vi" ? "Xử lý bởi Stripe, bảo mật 100%" : "Powered by Stripe, 100% secure"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border-2 ${paymentMethod === "STRIPE" ? "border-primary bg-primary" : "border-slate-300"}`} />
                                        </button>
                                    )}
                                </div>

                                {/* Stripe Card Element chỉ hiển thị khi chọn thanh toán thẻ */}
                                {paymentMethod === "STRIPE" && (
                                    <div className="p-6 rounded-3xl border border-slate-100 bg-slate-50">
                                        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                                            {language === "vi" ? "Thông tin thẻ" : "Card Information"}
                                        </p>
                                        {stripePromise ? (
                                            <div className="bg-white rounded-2xl px-4 py-3 border border-slate-200">
                                                <CardElement
                                                    options={{
                                                        hidePostalCode: true,
                                                        style: {
                                                            base: {
                                                                fontSize: "16px",
                                                                color: "#0f172a",
                                                                "::placeholder": { color: "#9ca3af" },
                                                            },
                                                            invalid: {
                                                                color: "#ef4444",
                                                            },
                                                        },
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <p className="text-sm text-red-500 font-medium">
                                                {language === "vi" ? "Vui lòng cấu hình" : "Please configure"} <code>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> {language === "vi" ? "để bật thanh toán thẻ." : "to enable card payment."}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* QR Code display for BANK, MOMO, ZALOPAY */}
                                {(paymentMethod === "BANK" || paymentMethod === "MOMO" || paymentMethod === "ZALOPAY") && (
                                    <QRCodePaymentDisplay
                                        paymentMethod={paymentMethod}
                                        amount={finalTotal}
                                        orderId={orderId}
                                        language={language}
                                    />
                                )}
                            </div>

                            <div className="mt-12 pt-10 border-t border-slate-100">
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-slate-600">
                                        <span className="font-bold">{t("common.subtotal")}</span>
                                        <span className="font-black">${totalPrice.toFixed(2)}</span>
                                    </div>
                                    {selectedVoucher && selectedVoucher.canUse && (
                                        <div className="flex justify-between text-green-600">
                                            <span className="font-bold">Voucher ({selectedVoucher.code})</span>
                                            <span className="font-black">-${selectedVoucher.discountAmount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    {usePoints && pointsToUse > 0 && (
                                        <div className="flex justify-between text-amber-600">
                                            <span className="font-bold flex items-center gap-2">
                                                <Sparkles className="w-4 h-4" /> LIKEFOOD Xu
                                            </span>
                                            <span className="font-black">-${(pointsToUse / 100).toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-slate-600">
                                        <span className="font-bold">{t("cart.shippingFee")}</span>
                                        <span className="font-black text-primary">
                                            {shippingFee > 0 ? `$${shippingFee.toFixed(2)}` : (language === "vi" ? "Miễn phí" : "Free")}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mb-10 pt-4 border-t-2 border-dashed border-slate-200">
                                    <span className="text-xl font-black uppercase text-slate-400">{t("common.total")}</span>
                                    <span className="text-4xl font-black text-primary tracking-tighter">
                                        ${finalTotal.toFixed(2)}
                                    </span>
                                </div>
                                <Button
                                    onClick={handleOrder}
                                    disabled={isSubmitting || (paymentMethod === "STRIPE" && (!stripe || !elements))}
                                    className="w-full h-20 rounded-full bg-black hover:bg-slate-900 text-white font-black uppercase tracking-widest shadow-2xl flex items-center justify-center gap-4 py-8 disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <>{language === "vi" ? "Đang xử lý..." : "Processing..."}</>
                                    ) : (
                                        <>{language === "vi" ? "Đặt hàng ngay" : "Place Order"} <CheckCircle2 className="w-6 h-6" /></>
                                    )}
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-[3rem] p-10 lg:p-16 shadow-xl shadow-slate-200/50 border border-slate-100"
                        >
                            <div className="text-center mb-8">
                                <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/30">
                                    <CheckCircle2 className="w-12 h-12" />
                                </div>
                                <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">{language === "vi" ? "Đặt hàng thành công!" : "Order Placed Successfully!"}</h2>
                                {orderId && (
                                    <p className="text-lg text-slate-600 mb-4">
                                        {language === "vi" ? "Mã đơn hàng" : "Order ID"}: <span className="font-black text-primary">#{orderId.slice(-8).toUpperCase()}</span>
                                    </p>
                                )}
                                <p className="text-xl text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
                                    {language === "vi"
                                        ? <>Cảm ơn bạn đã tin tưởng chọn <span className="text-black font-black uppercase">LIKEFOOD</span>. Chúng tôi sẽ sớm liên hệ để xác nhận đơn hàng của bạn.</>
                                        : <>Thank you for choosing <span className="text-black font-black uppercase">LIKEFOOD</span>. We will contact you shortly to confirm your order.</>}
                                </p>
                            </div>

                            {/* Show payment instructions for non-Stripe payment methods */}
                            {(paymentMethod === "BANK" || paymentMethod === "MOMO" || paymentMethod === "ZALOPAY" || paymentMethod === "COD") && (
                                <div className="bg-slate-50 rounded-3xl p-6 lg:p-8 mb-8">
                                    <h3 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                                        {paymentMethod === "COD" ? (
                                            <>
                                                <Truck className="w-6 h-6 text-primary" />
                                                {language === "vi" ? "Hướng dẫn thanh toán" : "Payment Instructions"}
                                            </>
                                        ) : (
                                            <>
                                                <CreditCard className="w-6 h-6 text-primary" />
                                                {language === "vi" ? "Thanh toán ngay" : "Complete Payment"}
                                            </>
                                        )}
                                    </h3>

                                    {paymentMethod === "COD" && (
                                        <div className="text-left space-y-4">
                                            <p className="text-slate-600">
                                                {language === "vi"
                                                    ? "Đơn hàng của bạn sẽ được giao hàng và bạn thanh toán khi nhận hàng."
                                                    : "Your order will be delivered and you will pay upon delivery."}
                                            </p>
                                            <div className="bg-white rounded-2xl p-4 border border-slate-200">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-slate-500">{language === "vi" ? "Tổng tiền cần thanh toán" : "Total amount to pay"}:</span>
                                                    <span className="font-black text-primary text-lg">${finalTotal.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {(paymentMethod === "BANK" || paymentMethod === "MOMO" || paymentMethod === "ZALOPAY") && (
                                        <QRCodePaymentDisplay
                                            paymentMethod={paymentMethod}
                                            amount={finalTotal}
                                            orderId={orderId}
                                            language={language}
                                        />
                                    )}
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                <Link href="/products" prefetch={true}>
                                    <button className="px-10 py-5 bg-black text-white rounded-full font-black uppercase tracking-widest hover:bg-slate-900 transition-all">
                                        {t("shop.continueShopping")}
                                    </button>
                                </Link>
                                {orderId && (
                                    <Link href={`/orders/${orderId}`}>
                                        <button className="px-10 py-5 bg-white border-2 border-slate-100 text-black rounded-full font-black uppercase tracking-widest hover:border-slate-200 transition-all">
                                            {language === "vi" ? "Xem lại đơn hàng" : "View Order"}
                                        </button>
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Voucher Picker Modal */}
                <VoucherPickerModal
                    isOpen={showVoucherModal}
                    onClose={() => setShowVoucherModal(false)}
                    orderTotal={totalPrice}
                    selectedVoucher={selectedVoucher}
                    onSelectVoucher={(voucher) => setSelectedVoucher(voucher as CheckoutVoucher | null)}
                />
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutContent />
        </Elements>
    );
}

// QR Code Payment Display Component
function QRCodePaymentDisplay({
    paymentMethod,
    amount,
    orderId,
    language
}: {
    paymentMethod: string;
    amount: number;
    orderId: string | null;
    language: string;
}) {
    const [qrCode, setQrCode] = useState<string>("");
    const [bankInfo, setBankInfo] = useState<{ bankName: string; accountName: string; accountNumber: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchQRCode = async () => {
            setIsLoading(true);
            try {
                // First get the payment settings
                const { getPublicSettings } = await import("@/lib/public-settings");
                const settings = await getPublicSettings();

                // Get bank info from settings
                const bankName = settings.BANK_NAME || "MB";
                const accountName = settings.BANK_ACCOUNT_NAME || "LIKEFOOD";
                const accountNumber = settings.BANK_ACCOUNT_NUMBER || "";

                setBankInfo({ bankName, accountName, accountNumber });

                // Generate QR code
                const res = await fetch(`/api/payments/qr?type=${paymentMethod}&amount=${amount}&orderId=${orderId || ""}`);
                if (res.ok) {
                    const data = await res.json();
                    setQrCode(data.qrCode || "");
                }
            } catch (error) {
                console.error("Failed to fetch QR code:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (amount > 0) {
            fetchQRCode();
        }
    }, [paymentMethod, amount, orderId]);

    if (isLoading) {
        return (
            <div className="p-6 rounded-3xl border border-slate-100 bg-slate-50 text-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-48 h-48 bg-slate-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 rounded-3xl border border-slate-100 bg-slate-50">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 text-center">
                {language === "vi" ? "Quét mã để thanh toán" : "Scan to pay"}
            </p>

            {qrCode && (
                <div className="flex justify-center mb-4">
                    <img src={qrCode} alt="Payment QR Code" className="w-48 h-48 rounded-lg" />
                </div>
            )}

            {bankInfo && paymentMethod === "BANK" && (
                <div className="bg-white rounded-2xl p-4 border border-slate-200">
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-500">{language === "vi" ? "Ngân hàng" : "Bank"}:</span>
                            <span className="font-bold">{bankInfo.bankName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">{language === "vi" ? "Số tài khoản" : "Account Number"}:</span>
                            <span className="font-bold">{bankInfo.accountNumber}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">{language === "vi" ? "Tên tài khoản" : "Account Name"}:</span>
                            <span className="font-bold">{bankInfo.accountName}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-slate-100">
                            <span className="text-slate-500">{language === "vi" ? "Số tiền" : "Amount"}:</span>
                            <span className="font-black text-primary text-lg">${amount.toFixed(2)}</span>
                        </div>
                        {orderId && (
                            <div className="flex justify-between">
                                <span className="text-slate-500">{language === "vi" ? "Mã đơn" : "Order ID"}:</span>
                                <span className="font-bold text-xs">{orderId.slice(-8).toUpperCase()}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {(paymentMethod === "MOMO" || paymentMethod === "ZALOPAY") && (
                <div className="bg-white rounded-2xl p-4 border border-slate-200 text-center">
                    <p className="text-sm text-slate-600 mb-2">
                        {language === "vi"
                            ? `Quét mã QR bằng app ${paymentMethod === "MOMO" ? "MoMo" : "ZaloPay"} để thanh toán`
                            : `Scan QR code with ${paymentMethod === "MOMO" ? "MoMo" : "ZaloPay"} app to pay`}
                    </p>
                    <p className="font-black text-primary text-lg">${amount.toFixed(2)}</p>
                    {orderId && (
                        <p className="text-xs text-slate-500 mt-2">
                            {language === "vi" ? "Mã đơn hàng" : "Order ID"}: {orderId.slice(-8).toUpperCase()}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
