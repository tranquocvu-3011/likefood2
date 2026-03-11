/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import { logger } from "@/lib/logger";
import type Stripe from "stripe";

export async function POST(req: Request) {
    const sig = req.headers.get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        logger.error("[STRIPE] STRIPE_WEBHOOK_SECRET is not set", new Error("Webhook secret not configured"), { context: "stripe-webhook" });
        return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
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
                }
                break;
            }
            default: {
                // Ignore other events for now
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

