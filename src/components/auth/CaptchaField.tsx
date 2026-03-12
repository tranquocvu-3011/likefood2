"use client";

/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { useEffect, useMemo, useState } from "react";
import TurnstileWidget from "@/components/auth/TurnstileWidget";
import { getPublicSettings } from "@/lib/public-settings";

/** Cloudflare Turnstile demo key — widget always passes. Use when no key configured so CAPTCHA box still shows. */
const TURNSTILE_DEMO_SITE_KEY = "1x00000000000000000000AA";

// Check if we're in production (has real site key)
function isProductionMode(siteKey: string): boolean {
  return siteKey !== TURNSTILE_DEMO_SITE_KEY;
}

type CaptchaFieldProps = {
  onToken: (token: string) => void;
  onValidChange: (isValid: boolean) => void;
  className?: string;
};

function parseOnOff(value: unknown): boolean | null {
  if (typeof value !== "string") return null;
  const v = value.trim().toUpperCase();
  if (v === "ON" || v === "TRUE" || v === "1" || v === "YES") return true;
  if (v === "OFF" || v === "FALSE" || v === "0" || v === "NO") return false;
  return null;
}

export function CaptchaField({ onToken, onValidChange, className }: CaptchaFieldProps) {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [siteKey, setSiteKey] = useState("");

  const isWidgetAvailable = useMemo(() => Boolean(siteKey), [siteKey]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      // Bypass cache so CAPTCHA shows immediately after admin saves Turnstile keys
      const settings = await getPublicSettings({ bypassCache: true });
      const fromDb = parseOnOff(settings.security_captcha_enabled);
      const defaultEnabled = process.env.NODE_ENV === "production";
      // When API returns empty (e.g. fetch failed), show widget with demo key so user still sees CAPTCHA
      const hasSettings = Object.keys(settings).length > 0;
      const nextEnabled = hasSettings ? (fromDb ?? defaultEnabled) : true;
      // Site key: Admin (DB) first, then env, then demo so widget always shows when enabled
      const keyFromDb = (settings.turnstile_site_key ?? "").trim();
      const keyFromEnv = (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "").trim();
      const nextSiteKey = keyFromDb || keyFromEnv || TURNSTILE_DEMO_SITE_KEY;
      if (cancelled) return;
      setEnabled(nextEnabled);
      setSiteKey(nextSiteKey);
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Fail-safe: when captcha is disabled (or cannot be rendered), allow submit.
  useEffect(() => {
    if (enabled === false) {
      onToken("");
      onValidChange(true);
      return;
    }
    // When enabled but missing site key, don't block user.
    if (enabled === true && !isWidgetAvailable) {
      onToken("");
      onValidChange(true);
      return;
    }
    // When enabled and widget available, wait for token.
    if (enabled === true) {
      onValidChange(false);
    }
  }, [enabled, isWidgetAvailable, onToken, onValidChange]);

  if (enabled === null) {
    // Loading settings: avoid flicker; do not block user yet.
    return null;
  }

  if (!enabled || !isWidgetAvailable) {
    return null;
  }

  return (
    <div className={className}>
      <TurnstileWidget
        siteKey={siteKey}
        onVerify={(token) => {
          onToken(token);
          onValidChange(Boolean(token));
        }}
        onError={() => {
          onToken("");
          // Fail-safe: do not block user if widget errors on client.
          onValidChange(true);
        }}
        onExpire={() => {
          onToken("");
          onValidChange(false);
        }}
        theme="light"
      />
    </div>
  );
}

