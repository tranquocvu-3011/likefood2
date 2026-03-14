/**
 * LIKEFOOD - Structured Data Component (Server Component)
 * Renders Organization, WebSite, and BreadcrumbList JSON-LD
 * server-side so Google can see them in the initial HTML response.
 */

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://likefood.vn";
const SITE_NAME = "LIKEFOOD";

export default function StructuredData() {
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: {
            "@type": "ImageObject",
            url: `${SITE_URL}/logo.png`,
        },
        description: "Vietnamese Specialty Marketplace in the United States — Nền tảng đặc sản Việt Nam tại Hoa Kỳ",
        contactPoint: {
            "@type": "ContactPoint",
            telephone: "+1-402-315-8105",
            email: "tranquocvu3011@gmail.com",
            contactType: "customer service",
            availableLanguage: ["Vietnamese", "English"],
        },
        address: {
            "@type": "PostalAddress",
            addressLocality: "Omaha",
            addressRegion: "NE",
            postalCode: "68136",
            addressCountry: "US",
        },
        sameAs: [
            "https://www.facebook.com/profile.php?id=100076170558548",
            "https://instagram.com/likefood",
        ],
    };

    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        inLanguage: "vi",
        publisher: { "@id": `${SITE_URL}/#organization` },
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${SITE_URL}/products?search={search_term_string}`,
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
                name: SITE_NAME,
                item: SITE_URL,
            },
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify([organizationSchema, websiteSchema, breadcrumbSchema]),
            }}
        />
    );
}
