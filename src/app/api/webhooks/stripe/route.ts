/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { logger } from "@/lib/logger";
import type Stripe from "stripe";
import StripeSdk from "stripe";
import { getSystemSettingTrimmed } from "@/lib/system-settings";
import { isValidPaymentTransition } from "@/lib/order-state-machine";
import { notifyPaymentSuccess } from "@/lib/telegram";

export async function POST(req: Request) {
    const sig = req.headers.get("stripe-signature");
    const webhookSecret =
        (await getSystemSettingTrimmed("stripe_webhook_secret")) ||
        process.env.STRIPE_WEBHOOK_SECRET ||
        "";

    const stripeSecret =
        (await getSystemSettingTrimmed("stripe_secret_key")) ||
        process.env.STRIPE_SECRET_KEY ||
        "";

    const stripe = stripeSecret
        ? new StripeSdk(stripeSecret, {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              apiVersion: "2024-11-20" as any,
          })
        : null;

    if (!webhookSecret) {
        logger.error("[STRIPE] STRIPE_WEBHOOK_SECRET is not set", new Error("Webhook secret not configured"), { context: "stripe-webhook" });
        return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }
    if (!stripe) {
        logger.error("[STRIPE] STRIPE_SECRET_KEY is not set", new Error("Stripe secret not configured"), { context: "stripe-webhook" });
        return NextResponse.json({ error: "Stripe secret not configured" }, { status: 500 });
    }

    if (!sig) {
        return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
        const body = await req.text();
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        logger.error("[STRIPE] Webhook signature verification failed", err as Error, { context: "stripe-webhook" });
        return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
    }

    try {
        // Idempotency: skip events already processed
        const idempotencyKey = `stripe_event:${event.id}`;
        const alreadyProcessed = await prisma.systemsetting.findUnique({ where: { key: idempotencyKey } });
        if (alreadyProcessed) {
            return NextResponse.json({ received: true, skipped: true }, { status: 200 });
        }

        switch (event.type) {
            // ── Stripe Checkout Session (hosted page) ──
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;
                const orderId = session.metadata?.orderId || session.client_reference_id;

                if (orderId) {
                    // Update order to PAID
                    const order = await prisma.order.findUnique({
                        where: { id: orderId },
                        include: { orderItems: true },
                    });

                    if (order && order.paymentStatus !== "PAID") {
                        // Validate payment transition
                        const payTransition = isValidPaymentTransition(order.paymentStatus, "PAID");
                        if (!payTransition.valid) {
                            logger.error(`[STRIPE] Invalid payment transition: ${order.paymentStatus} → PAID`, new Error(payTransition.reason || ""), { context: "stripe-webhook", orderId });
                            break;
                        }

                        // Use transaction for atomic stock update + order status change
                        await prisma.$transaction(async (tx) => {
                            // 1. Mark as paid
                            await tx.order.update({
                                where: { id: orderId },
                                data: {
                                    paymentStatus: "PAID",
                                    paymentIntentId: session.payment_intent as string || session.id,
                                },
                            });

                            // 2. PAY-003: Decrement inventory with guard against negative stock
                            for (const item of order.orderItems) {
                                // First verify stock is sufficient
                                const product = await tx.product.findUnique({
                                    where: { id: item.productId },
                                    select: { inventory: true, name: true },
                                });

                                if (!product || product.inventory < item.quantity) {
                                    logger.error(`[STRIPE] Insufficient inventory for product ${item.productId}: have ${product?.inventory ?? 0}, need ${item.quantity}`, new Error("Inventory guard triggered"), { context: "stripe-webhook", orderId });
                                    // Still mark as paid but log the issue — admin must handle manually
                                }

                                await tx.product.update({
                                    where: { id: item.productId },
                                    data: {
                                        // Guard: never go below 0
                                        inventory: { decrement: Math.min(item.quantity, product?.inventory ?? 0) },
                                        soldCount: { increment: item.quantity },
                                    },
                                });
                            }
                        });

                        logger.info(`[STRIPE] Order ${orderId} paid via Checkout Session`, { sessionId: session.id });

                        // Gửi thông báo Telegram thanh toán thành công
                        notifyPaymentSuccess({
                            orderId,
                            amount: (session.amount_total || 0) / 100,
                            currency: session.currency?.toUpperCase() || "USD",
                            method: "STRIPE",
                            customerEmail: session.customer_email || undefined,
                        }).catch(() => {});
                    }
                }
                break;
            }

            case "checkout.session.expired": {
                const session = event.data.object as Stripe.Checkout.Session;
                const orderId = session.metadata?.orderId || session.client_reference_id;

                if (orderId) {
                    await prisma.order.updateMany({
                        where: { id: orderId, paymentStatus: { not: "PAID" } },
                        data: { paymentStatus: "FAILED" },
                    });
                }
                break;
            }

            // ── Stripe Elements (PaymentIntent) – backward compat ──
            case "payment_intent.succeeded": {
                const intent = event.data.object as Stripe.PaymentIntent;
                const paymentIntentId = intent.id as string;

                await prisma.order.updateMany({
                    where: { paymentIntentId },
                    data: {
                        paymentStatus: "PAID",
                    },
                });
                break;
            }
            case "payment_intent.payment_failed":
            case "payment_intent.canceled": {
                const intent = event.data.object as Stripe.PaymentIntent;
                const paymentIntentId = intent.id as string;

                await prisma.order.updateMany({
                    where: { paymentIntentId },
                    data: {
                        paymentStatus: "FAILED",
                    },
                });
                break;
            }
            case "charge.refunded": {
                const charge = event.data.object as Stripe.Charge;
                const paymentIntentId = charge.payment_intent as string;

                if (paymentIntentId) {
                    await prisma.order.updateMany({
                        where: { paymentIntentId },
                        data: {
                            paymentStatus: "REFUNDED",
                        },
                    });

                    // REF-003: Void referral commissions when order is refunded
                    try {
                        const refundedOrders = await prisma.order.findMany({
                            where: { paymentIntentId },
                            select: { id: true },
                        });
                        const { onOrderRefunded } = await import("@/lib/referral/events.service");
                        for (const refOrder of refundedOrders) {
                            await onOrderRefunded(refOrder.id, `Stripe refund: ${charge.id}`);
                        }
                    } catch (refErr) {
                        logger.error("[STRIPE] Failed to void referral commissions on refund", refErr as Error, { context: "stripe-webhook", paymentIntentId });
                    }
                }
                break;
            }
            default: {
                // Ignore other events
                break;
            }
        }

        // Mark event as processed for idempotency
        await prisma.systemsetting.create({
            data: { key: `stripe_event:${event.id}`, value: new Date().toISOString() },
        });

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (error) {
        logger.error("[STRIPE] Webhook handling error", error as Error, { context: "stripe-webhook", eventType: event?.type });
        return NextResponse.json({ error: "Webhook handling failed" }, { status: 500 });
    }
}

