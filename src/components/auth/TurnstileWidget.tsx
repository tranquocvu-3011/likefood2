"use client";

/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { useEffect, useRef, useState } from "react";

interface TurnstileWidgetProps {
    onVerify: (token: string) => void;
    onError?: () => void;
    onExpire?: () => void;
    theme?: "light" | "dark" | "auto";
}

declare global {
    interface Window {
        turnstile?: {
            render: (container: HTMLElement, options: Record<string, unknown>) => string;
            reset: (widgetId: string) => void;
            remove: (widgetId: string) => void;
        };
    }
}

export default function TurnstileWidget({
    onVerify, onError, onExpire, theme = "light"
}: TurnstileWidgetProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

    useEffect(() => {
        if (!siteKey) return; // No key configured — skip silently

        // Load Turnstile script if not already loaded
        if (!document.getElementById("turnstile-script")) {
            const script = document.createElement("script");
            script.id = "turnstile-script";
            script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
            script.async = true;
            script.defer = true;
            script.onload = () => setIsLoaded(true);
            document.head.appendChild(script);
        } else if (window.turnstile) {
            setIsLoaded(true);
        }
    }, [siteKey]);

    useEffect(() => {
        if (!isLoaded || !containerRef.current || !window.turnstile || !siteKey) return;

        widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            theme,
            callback: onVerify,
            "error-callback": onError,
            "expired-callback": onExpire,
        });

        return () => {
            if (widgetIdRef.current && window.turnstile) {
                window.turnstile.remove(widgetIdRef.current);
            }
        };
    }, [isLoaded, siteKey, theme, onVerify, onError, onExpire]);

    if (!siteKey) return null; // Silently skip if no key

    return (
        <div className="flex justify-center">
            <div ref={containerRef} />
        </div>
    );
}
