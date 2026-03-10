/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

interface PublicSettings {
    SEO_SITE_URL?: string;
    SEO_DEFAULT_TITLE?: string;
    SEO_DEFAULT_DESCRIPTION?: string;
    SEO_OG_IMAGE_URL?: string;
}

export default function StructuredData() {
    const [settings, setSettings] = useState<PublicSettings | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch("/api/public/settings");
                if (!res.ok) return;
                const data = await res.json();
                setSettings(data);
            } catch {
                // ignore
            }
        };
        load();
    }, []);

    const siteUrl = settings?.SEO_SITE_URL || "https://likefood.com";
    const siteName = settings?.SEO_DEFAULT_TITLE || "LIKEFOOD";
    const siteDesc = settings?.SEO_DEFAULT_DESCRIPTION || "Premium Vietnamese specialty food and dried seafood";
    const ogImage = settings?.SEO_OG_IMAGE_URL || `${siteUrl}/og-image.png`;

    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: siteName,
        url: siteUrl,
        logo: ogImage,
        description: siteDesc,
        address: {
            "@type": "PostalAddress",
            addressCountry: "US",
        },
        contactPoint: {
            "@type": "ContactPoint",
            contactType: "Customer Service",
            availableLanguage: ["English", "Vietnamese"],
        },
    };

    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: siteName,
        url: siteUrl,
        description: siteDesc,
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${siteUrl}/products?search={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
        },
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: siteUrl,
            },
        ],
    };

    return (
        <>
            <Script
                id="organization-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
            <Script
                id="website-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />
            <Script
                id="breadcrumb-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
        </>
    );
}
