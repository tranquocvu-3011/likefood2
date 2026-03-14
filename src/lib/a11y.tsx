/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * A11Y-002: Accessibility Hooks & Utilities
 *
 * Provides keyboard navigation, focus management, and ARIA helpers.
 */

"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Hook: Trap focus within a container (for modals/dialogs)
 */
export function useFocusTrap(isActive: boolean) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isActive || !containerRef.current) return;

        const container = containerRef.current;
        const focusableElements = container.querySelectorAll(
            'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        function handleKeyDown(e: KeyboardEvent) {
            if (e.key !== "Tab") return;

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement?.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement?.focus();
                    e.preventDefault();
                }
            }
        }

        container.addEventListener("keydown", handleKeyDown);
        firstElement?.focus();

        return () => container.removeEventListener("keydown", handleKeyDown);
    }, [isActive]);

    return containerRef;
}

/**
 * Hook: Handle Escape key to close modals/dropdowns
 */
export function useEscapeKey(onEscape: () => void, isActive = true) {
    useEffect(() => {
        if (!isActive) return;

        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") {
                onEscape();
            }
        }

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [onEscape, isActive]);
}

/**
 * Hook: Skip to main content link
 */
export function useSkipToContent() {
    const skipToMain = useCallback(() => {
        const main = document.querySelector("main") || document.getElementById("main-content");
        if (main) {
            main.setAttribute("tabindex", "-1");
            main.focus();
            main.removeAttribute("tabindex");
        }
    }, []);

    return skipToMain;
}

/**
 * Hook: Announce text to screen readers
 */
export function useAnnounce() {
    const announce = useCallback((message: string, priority: "polite" | "assertive" = "polite") => {
        const el = document.createElement("div");
        el.setAttribute("aria-live", priority);
        el.setAttribute("aria-atomic", "true");
        el.setAttribute("role", "status");
        el.style.cssText =
            "position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0,0,0,0);border:0;";
        document.body.appendChild(el);

        // Delay to ensure screen reader picks it up
        setTimeout(() => {
            el.textContent = message;
        }, 100);

        setTimeout(() => {
            document.body.removeChild(el);
        }, 3000);
    }, []);

    return announce;
}

/**
 * Component: Screen-reader-only text
 */
export function VisuallyHidden({ children }: { children: React.ReactNode }) {
    return (
        <span
            style={{
                position: "absolute",
                width: "1px",
                height: "1px",
                margin: "-1px",
                padding: 0,
                overflow: "hidden",
                clip: "rect(0, 0, 0, 0)",
                whiteSpace: "nowrap",
                border: 0,
            }}
        >
            {children}
        </span>
    );
}
