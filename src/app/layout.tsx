/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { ChatOpenProvider } from "@/contexts/ChatOpenContext";
import { AuthProvider } from "@/components/shared/AuthProvider";
import { LanguageProvider } from "@/lib/i18n/context";
import { ThemeProvider } from "@/lib/theme/ThemeContext";
import { CompareProvider } from "@/contexts/CompareContext";
import LiveSalesPopup from "@/components/shared/LiveSalesPopup";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const outfit = Outfit({ subsets: ["latin"], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: {
    default: "LIKEFOOD | Đặc sản Việt Nam tại Mỹ",
    template: "%s | LIKEFOOD"
  },
  description: "Nền tảng thương mại điện tử chuyên cung cấp đặc sản Việt Nam chất lượng cao tại Hoa Kỳ. Giao hàng nhanh, đảm bảo vệ sinh ATTP, tích hợp trợ lý AI thông minh.",
  keywords: ["đặc sản Việt Nam", "vận chuyển Mỹ", "LIKEFOOD", "cá khô miền tây", "tôm khô cà mau", "thực phẩm Việt tại Mỹ"],
  authors: [{ name: "Trần Quốc Vũ", url: "https://facebook.com/vudev05" }],
  creator: "Trần Quốc Vũ",
  publisher: "LIKEFOOD",
  metadataBase: new URL("https://weblikefood.com"),
  alternates: {
    canonical: "/",
    languages: {
      'vi': 'https://weblikefood.com',
      'en': 'https://weblikefood.com?lang=en',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    }),
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://weblikefood.com",
    siteName: "LIKEFOOD",
    title: "LIKEFOOD | Đặc sản Việt Nam tại Mỹ",
    description: "Nền tảng thương mại điện tử chuyên cung cấp đặc sản Việt Nam chất lượng cao tại Hoa Kỳ. Giao hàng nhanh, đảm bảo vệ sinh ATTP.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LIKEFOOD - Đặc sản Việt Nam",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LIKEFOOD | Đặc sản Việt Nam tại Mỹ",
    description: "Nền tảng thương mại điện tử chuyên cung cấp đặc sản Việt Nam chất lượng cao tại Hoa Kỳ.",
    images: ["/og-image.png"],
    creator: "@likefood",
  },
  other: {
    "fb:app_id": process.env.NEXT_PUBLIC_FB_APP_ID || "",
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "LIKEFOOD",
  },
};

export const viewport: Viewport = {
  themeColor: "#ed712e",
};

import { Toaster } from "sonner";

// Xóa ChatWidgetClient vì đã có ChatbotAI trong ShopLayout

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_TRACKING_ID;
  const fbPixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const shouldRegisterSw = process.env.NODE_ENV === "production";

  return (
    <html lang="vi" data-scroll-behavior="smooth">
      {gaId && (
        <head>
          {/* GA4 base script */}
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script
            id="ga4-init"
            strategy="afterInteractive"
          >
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', { send_page_view: true });
            `}
          </Script>
        </head>
      )}

      {/* Google Tag Manager */}
      {gtmId && (
        <head>
          <Script id="gtm-head" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');`}
          </Script>
        </head>
      )}

      {/* Facebook Pixel */}
      {fbPixelId && (
        <head>
          <Script id="fb-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${fbPixelId}');
            fbq('track', 'PageView');`}
          </Script>
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${fbPixelId}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </head>
      )}

      {shouldRegisterSw && (
        <head>
          <Script id="register-sw" strategy="afterInteractive">
            {`
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    registration.update?.();
                  }).catch(function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                  });
                });
              }
            `}
          </Script>
        </head>
      )}
      {/* Google Tag Manager (noscript) */}
      {gtmId && (
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
      )}

      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased text-slate-900 bg-[#fdfdff]`}>
        <AuthProvider>
          <LanguageProvider>
            <ThemeProvider>
              <CompareProvider>
                <CartProvider>
                  <ChatOpenProvider>
                    {children}
                    <LiveSalesPopup />
                  </ChatOpenProvider>
                  {/* Đã xóa BottomNav và ChatWidgetClient ở đây vì gây trùng lặp với ShopLayout */}
                  <Toaster position="top-center" richColors />
                </CartProvider>
              </CompareProvider>
            </ThemeProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
