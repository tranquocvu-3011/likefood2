/**
 * LIKEFOOD - Stripe Session Status API
 * Returns the status of a Checkout Session for the return page
 */

import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { logger } from "@/lib/logger";

export async function GET(req: NextRequest) {
    try {
        const sessionId = req.nextUrl.searchParams.get("session_id");

        if (!sessionId) {
            return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
        }

        const stripe = getStripe();
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        return NextResponse.json({
            status: session.status,
            customer_email: session.customer_details?.email || null,
            payment_status: session.payment_status,
            orderId: session.metadata?.orderId || session.client_reference_id || null,
        });
    } catch (error) {
        logger.error("Session status error", error as Error, { context: "session-status" });
        return NextResponse.json({ error: "Failed to retrieve session" }, { status: 500 });
    }
}
