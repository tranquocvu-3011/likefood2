/**
 * LIKEFOOD - Stripe Checkout Session API
 * Creates a Stripe Checkout Session (Embedded mode)
 * Flow: Order created → This API creates embedded session → Frontend mounts Stripe form
 */

import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { orderId } = body;

        if (!orderId) {
            return NextResponse.json({ error: "Thiếu mã đơn hàng" }, { status: 400 });
        }

        // Fetch order with items from DB
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                orderItems: {
                    include: {
                        product: {
                            select: { name: true, image: true, slug: true, price: true, inventory: true },
                        },
                    },
                },
                user: { select: { email: true, name: true } },
            },
        });

        if (!order) {
            return NextResponse.json({ error: "Đơn hàng không tồn tại" }, { status: 404 });
        }

        if (order.paymentStatus === "PAID") {
            return NextResponse.json({ error: "Đơn hàng đã được thanh toán" }, { status: 400 });
        }

        // Validate stock one more time
        for (const item of order.orderItems) {
            if (!item.product) continue;
            if (item.product.inventory < item.quantity) {
                return NextResponse.json({
                    error: `Sản phẩm "${item.product.name}" chỉ còn ${item.product.inventory} trong kho`,
                }, { status: 400 });
            }
        }

        const stripe = getStripe();
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

        // Build line_items from order items (price from DB, NOT from frontend)
        const line_items = order.orderItems.map((item) => {
            const productName = item.product?.name || item.nameSnapshot || "Sản phẩm";
            const productImage = item.product?.image
                ? (item.product.image.startsWith("http")
                    ? item.product.image
                    : `${appUrl}${item.product.image}`)
                : undefined;
            const unitPrice = Math.round(item.price * 100); // USD cents: $15 → 1500

            return {
                quantity: item.quantity,
                price_data: {
                    currency: "usd",
                    unit_amount: unitPrice,
                    product_data: {
                        name: productName,
                        ...(productImage && { images: [productImage] }),
                        metadata: {
                            productId: item.productId,
                        },
                    },
                },
            };
        });

        // Add shipping fee as a separate line item if present
        if (order.shippingFee && order.shippingFee > 0) {
            line_items.push({
                quantity: 1,
                price_data: {
                    currency: "usd",
                    unit_amount: Math.round(order.shippingFee * 100), // USD cents
                    product_data: {
                        name: "Phí vận chuyển",
                        metadata: { productId: "shipping_fee" },
                    },
                },
            });
        }

        // Create Stripe Checkout Session — REDIRECT mode (hosted page)
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            line_items,
            success_url: `${appUrl}/checkout/return?session_id={CHECKOUT_SESSION_ID}&orderId=${orderId}`,
            cancel_url: `${appUrl}/checkout?cancelled=true`,
            client_reference_id: orderId,
            ...(order.user?.email && { customer_email: order.user.email }),
            metadata: {
                orderId: orderId,
                userId: order.userId || "guest",
            },
            payment_intent_data: {
                metadata: {
                    orderId: orderId,
                },
            },
            phone_number_collection: {
                enabled: true,
            },
        });

        // Save Stripe session ID to order for tracking
        await prisma.order.update({
            where: { id: orderId },
            data: {
                paymentIntentId: session.id,
                paymentStatus: "PENDING",
            },
        });

        // Redirect mode returns URL
        return NextResponse.json({ url: session.url });
    } catch (error) {
        logger.error("Stripe Checkout Session error", error as Error, { context: "create-checkout-session" });
        const message = error instanceof Error ? error.message : "Không tạo được phiên thanh toán";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
