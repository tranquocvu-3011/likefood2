"use client";

/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 *
 * useCheckout – Custom hook chứa toàn bộ state management & business logic
 * cho luồng Checkout. Tách hoàn toàn khỏi UI để dễ maintain và test.
 */

import { useEffect, useMemo, useState, useCallback } from "react";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
// Stripe Checkout Sessions: no client-side SDK needed (redirect flow)
import { tracking } from "@/lib/tracking";
import { logger } from "@/lib/logger";
import { toast } from "sonner";
import { getShippingFeeUsd } from "@/lib/commerce";

// ─── Types ───────────────────────────────────────────────────────────────

export interface CheckoutAddress {
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

export type PaymentMethod = "STRIPE";

export interface CheckoutVoucher {
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

export interface CheckoutFormData {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    shippingMethod: string;
}



// ─── Hook ────────────────────────────────────────────────────────────────

export function useCheckout(language: string) {
    const router = useRouter();
    const { data: session } = useSession();
    const { items, totalPrice, clearCart } = useCart();


    // ── Core State ──
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    // ── Form Data ──
    const [formData, setFormData] = useState<CheckoutFormData>({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        shippingMethod: "standard",
    });
    const [saveInfo, setSaveInfo] = useState(false);
    const [orderNotes, setOrderNotes] = useState("");

    // ── Address Book ──
    const [addresses, setAddresses] = useState<CheckoutAddress[]>([]);
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

    // ── Voucher & Points ──
    const [selectedVoucher, setSelectedVoucher] = useState<CheckoutVoucher | null>(null);
    const [showVoucherModal, setShowVoucherModal] = useState(false);
    const [userPoints, setUserPoints] = useState(0);
    const [usePoints, setUsePoints] = useState(false);
    const [pointsToUse, setPointsToUse] = useState(0);

    // ── Payment — Stripe only ──
    const [paymentMethod] = useState<PaymentMethod>("STRIPE");
    const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null);

    // ── Computed Values ──
    const shippingFee = useMemo(
        () => getShippingFeeUsd(totalPrice, formData.shippingMethod),
        [formData.shippingMethod, totalPrice]
    );

    const pointsDiscount = useMemo(
        () => (usePoints ? pointsToUse / 100 : 0),
        [usePoints, pointsToUse]
    );

    const finalTotal = useMemo(() => {
        const discount = selectedVoucher?.discountAmount || 0;
        return Math.max(0, totalPrice + shippingFee - discount - pointsDiscount);
    }, [totalPrice, shippingFee, selectedVoucher, pointsDiscount]);

    const isCartEmpty = items.length === 0 && step < 3;

    // ── Load saved checkout info from localStorage ──
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

    // ── Load user points ──
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



    // ── Load saved addresses ──
    useEffect(() => {
        if (!session?.user) return;
        const loadAddresses = async () => {
            try {
                setIsLoadingAddresses(true);
                const res = await fetch("/api/user/addresses");
                if (!res.ok) return;
                const data: CheckoutAddress[] = await res.json();
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

    // ── Auto-apply best voucher ──
    useEffect(() => {
        if (!session?.user || selectedVoucher || totalPrice === 0) return;
        const autoApplyVoucher = async () => {
            try {
                const res = await fetch(`/api/vouchers/checkout?orderTotal=${totalPrice}`);
                if (res.ok) {
                    const data = await res.json();
                    const vouchers = data.vouchers || [];
                    const bestVoucher = vouchers.find((v: CheckoutVoucher) => v.canUse);
                    if (bestVoucher) setSelectedVoucher(bestVoucher);
                }
            } catch (error) {
                logger.warn("Failed to auto-apply voucher", { context: "checkout-page", error: error as Error });
            }
        };
        autoApplyVoucher();
    }, [session, totalPrice, selectedVoucher]);

    // ── Validation ──
    const validateForm = useCallback((): boolean => {
        const errors: Record<string, string> = {};

        if (!formData.fullName.trim()) {
            errors.fullName = language === "vi" ? "Vui lòng nhập họ tên" : "Full name is required";
        }
        if (!formData.email.trim()) {
            errors.email = language === "vi" ? "Vui lòng nhập email" : "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = language === "vi" ? "Email không hợp lệ" : "Invalid email format";
        }
        if (!formData.phone.trim()) {
            errors.phone = language === "vi" ? "Vui lòng nhập số điện thoại" : "Phone number is required";
        }
        if (!formData.address.trim()) {
            errors.address = language === "vi" ? "Vui lòng nhập địa chỉ" : "Address is required";
        }
        if (!formData.city.trim()) {
            errors.city = language === "vi" ? "Vui lòng nhập thành phố" : "City is required";
        }

        setFormErrors(errors);
        if (Object.keys(errors).length > 0) {
            toast.error(language === "vi" ? "Vui lòng điền đầy đủ thông tin giao hàng" : "Please fill in all shipping information");
            return false;
        }
        return true;
    }, [formData, language]);

    // ── Navigation ──
    const nextStep = useCallback(() => {
        if (step === 1 && !validateForm()) return;
        setStep(s => s + 1);
    }, [step, validateForm]);
    const prevStep = useCallback(() => setStep(s => s - 1), []);

    // ── Select Address ──
    const selectAddress = useCallback((addr: CheckoutAddress) => {
        setSelectedAddressId(addr.id);
        setFormData(prev => ({
            ...prev,
            fullName: addr.fullName,
            phone: addr.phone,
            address: addr.address,
            city: addr.city,
            zipCode: addr.zipCode,
        }));
    }, []);

    // ── Toggle Points ──
    const togglePoints = useCallback(() => {
        const newVal = !usePoints;
        setUsePoints(newVal);
        if (newVal) {
            setPointsToUse(
                Math.min(userPoints, Math.floor((totalPrice - (selectedVoucher?.discountAmount || 0)) * 100))
            );
        }
    }, [usePoints, userPoints, totalPrice, selectedVoucher]);

    // ── Update form field ──
    const updateField = useCallback((field: keyof CheckoutFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error khi user bắt đầu sửa field
        if (formErrors[field]) {
            setFormErrors(prev => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
    }, [formErrors]);

    // ── Handle Order Submission ──
    const handleOrder = useCallback(async () => {
        // Validate shipping form before creating order
        if (!validateForm()) {
            return;
        }
        setIsSubmitting(true);
        try {
            // ── Out-of-stock mid-checkout check ──
            try {
                const stockRes = await fetch("/api/products/check-stock", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        items: items.map(item => ({
                            productId: item.productId,
                            variantId: item.variantId || null,
                            quantity: item.quantity,
                        })),
                    }),
                });
                if (stockRes.ok) {
                    const stockData = await stockRes.json();
                    if (stockData.outOfStock && stockData.outOfStock.length > 0) {
                        const names = stockData.outOfStock.map((i: { name: string }) => i.name).join(", ");
                        toast.error(
                            language === "vi"
                                ? `Sản phẩm đã hết hàng: ${names}. Vui lòng cập nhật giỏ hàng.`
                                : `Out of stock: ${names}. Please update your cart.`
                        );
                        setIsSubmitting(false);
                        return;
                    }
                }
            } catch {
                // Non-blocking: nếu API check-stock chưa tồn tại, bỏ qua và tiếp tục
                logger.warn("Stock check API unavailable, proceeding without check", { context: "checkout-page" });
            }

            // Track begin checkout
            tracking.beginCheckout(totalPrice, items.map(item => ({
                item_id: item.id, item_name: item.name, price: item.price, quantity: item.quantity,
            })));
            let discount = 0;
            let couponCode: string | null = null;
            if (selectedVoucher?.canUse) {
                discount = selectedVoucher.discountAmount;
                couponCode = selectedVoucher.code;
            }

            // Prepare order data
            const orderData: Record<string, unknown> = {
                items: items.map(item => ({
                    productId: item.productId || item.id,
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
                pointsToUse: usePoints ? pointsToUse : 0,
                notes: orderNotes.trim() || `Order for ${formData.fullName}`,
            };
            // Only include discount when > 0 (Zod positiveNumber rejects 0)
            if (discount > 0) {
                orderData.discount = discount;
            }

            // Save info for next time
            if (saveInfo) {
                localStorage.setItem("checkout_info", JSON.stringify({
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    zipCode: formData.zipCode,
                }));
            }

            // Create order
            const isGuestCheckout = !session?.user;
            const orderEndpoint = isGuestCheckout ? "/api/orders/guest" : "/api/orders";
            const orderPayload = isGuestCheckout
                ? { ...orderData, guestEmail: formData.email, guestName: formData.fullName }
                : orderData;

            const res = await fetch(orderEndpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderPayload),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                // Server returns Zod errors as { error: 'Dữ liệu không hợp lệ', errors: [{field, message}] }
                if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
                    const fieldErrors = errorData.errors.map((e: { field: string; message: string }) => `${e.field}: ${e.message}`).join(", ");
                    logger.error("Order validation errors", new Error(fieldErrors), { context: "checkout-page" });
                    throw new Error(fieldErrors);
                }
                throw new Error(errorData.error || "Failed to create order");
            }

            const order = await res.json();

            // Stripe Checkout — redirect to Stripe hosted page
            if (paymentMethod === "STRIPE") {
                try {
                    const sessionRes = await fetch("/api/checkout/create-session", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ orderId: order.id }),
                    });

                    if (!sessionRes.ok) {
                        const sessionErr = await sessionRes.json().catch(() => ({}));
                        throw new Error(sessionErr.error || (language === "vi"
                            ? "Không thể tạo phiên thanh toán Stripe"
                            : "Failed to create Stripe checkout session"));
                    }

                    const sessionData = await sessionRes.json();

                    if (sessionData.url) {
                        // Save checkout info before redirect
                        if (saveInfo) {
                            localStorage.setItem("checkout_info", JSON.stringify({
                                fullName: formData.fullName,
                                email: formData.email,
                                phone: formData.phone,
                                address: formData.address,
                                city: formData.city,
                                zipCode: formData.zipCode,
                            }));
                        }

                        clearCart();
                        // Redirect to Stripe hosted checkout page
                        window.location.href = sessionData.url;
                        return; // User is leaving the page
                    } else {
                        throw new Error(language === "vi"
                            ? "Không nhận được URL thanh toán"
                            : "No checkout URL received");
                    }
                } catch (stripeError) {
                    const e = stripeError instanceof Error ? stripeError : new Error("Stripe checkout error");
                    logger.error("Stripe checkout session error", e, { context: "checkout-page" });
                    throw e;
                }
            }

            // Track purchase
            tracking.purchase(order.id, order.total, items.map(item => ({
                item_id: item.id, item_name: item.name, price: item.price, quantity: item.quantity,
            })));
            if (selectedVoucher) {
                tracking.selectPromotion(selectedVoucher.id, selectedVoucher.code);
            }

            // Store order ID and clear cart (non-Stripe methods show success inline)
            setOrderId(order.id);
            clearCart();
            setStep(3);
        } catch (error: unknown) {
            const err = error instanceof Error ? error : new Error(typeof error === "string" ? error : "Unknown error");
            logger.error("Order creation error", err, { context: "checkout-page" });
            toast.error(err.message || (language === "vi" ? "Đã có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại." : "An error occurred creating the order. Please try again."));
        } finally {
            setIsSubmitting(false);
        }
    }, [
        validateForm, paymentMethod, totalPrice, items, formData, shippingFee,
        selectedVoucher, usePoints, pointsToUse, saveInfo, session, clearCart, router, language, orderNotes,
    ]);

    return {
        // State
        step, isSubmitting, orderId, formData, formErrors, saveInfo, addresses,
        isLoadingAddresses, selectedAddressId, selectedVoucher, showVoucherModal,
        userPoints, usePoints, pointsToUse, paymentMethod,
        items, totalPrice, isCartEmpty, session, stripeClientSecret,

        // Computed
        shippingFee, pointsDiscount, finalTotal,

        // Actions
        nextStep, prevStep, selectAddress, togglePoints, updateField, validateForm,
        setFormData, setSaveInfo, setSelectedVoucher, setShowVoucherModal,
        handleOrder, orderNotes, setOrderNotes,
    };
}
