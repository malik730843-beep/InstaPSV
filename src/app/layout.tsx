import type { Metadata } from "next";
import "./globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { createClient } from '@supabase/supabase-js';
import Script from 'next/script';
import AdProvider from '@/components/ads/AdProvider';
import ScrollToTop from '@/components/layout/ScrollToTop';
import NextTopLoader from 'nextjs-toploader';

// Initialize Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function generateMetadata(): Promise<Metadata> {
  // Fetch SEO settings
  let title = "InstaPSV - Anonymous Instagram Story Viewer & Followers Parser (No Login)";
  let description = "View and download Instagram stories, profiles, and followers anonymously without an account. The best free IG story viewer tool with no login required.";
  let keywords = "Anonymous Instagram Story Viewer, IG Story Viewer, Instagram Followers Parser, View Instagram Stories Anonymously, Download Instagram Stories";
  let verification: any = {};
  let otherMeta: any = {};

  try {
    // 1. Fetch Basic SEO Settings
    const { data: seoData } = await supabase.from('seo_settings').select('key, value');
    if (seoData) {
      const settings = seoData.reduce((acc: any, curr: any) => ({ ...acc, [curr.key]: curr.value }), {});

      if (settings.default_title) title = settings.default_title;
      if (settings.default_description) description = settings.default_description;
      if (settings.default_keywords) keywords = settings.default_keywords;

      // Fallback GSC from SEO settings
      if (settings.google_search_console && !verification.google) {
        let content = settings.google_search_console;
        if (content.includes('content="')) {
          const match = content.match(/content="([^"]+)"/);
          if (match) content = match[1];
        }
        verification.google = content;
      }

      // Favicon from settings
      if (settings.favicon) {
        otherMeta.icons = settings.favicon;
      }
    }

    // 2. Fetch Dedicated Site Verifications
    const { data: verifications } = await supabase
      .from('site_verification')
      .select('*')
      .eq('enabled', true)
      .eq('verification_type', 'meta_tag');

    if (verifications) {
      verifications.forEach((v: any) => {
        let content = v.verification_code;
        // HTML tag cleanup
        if (content.includes('content="')) {
          const match = content.match(/content="([^"]+)"/);
          if (match) content = match[1];
        } else if (content.includes('=')) {
          // Handle key=value format (sometimes pasted)
          const parts = content.split('=');
          if (parts.length > 1) content = parts[1];
        }

        if (v.service === 'google') verification.google = content;
        else if (v.service === 'bing') verification['msvalidate.01'] = content;
        else if (v.service === 'yandex') verification.yandex = content;
        else if (v.service === 'pinterest') verification.pinterest = content;
        else if (v.service === 'adsense') {
          // AdSense verification also goes to meta usually or otherMeta
          otherMeta['google-adsense-account'] = content;
        }
        else otherMeta[v.service] = content;
      });
    }

  } catch (e) {
    console.error('Failed to fetch SEO settings', e);
  }

  return {
    title,
    description,
    keywords,
    authors: [{ name: "InstaPSV" }],
    verification: {
      ...verification,
      other: otherMeta
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://instapsv.com'}/`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://instapsv.com'}/`,
    },
    icons: {
      icon: [
        { url: otherMeta.icons || '/favicon.ico', type: 'image/x-icon' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      ],
      shortcut: [
        { url: otherMeta.icons || '/favicon.ico', type: 'image/x-icon' },
      ],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
      other: [
        { rel: 'android-chrome-192x192', url: '/android-chrome-192x192.png' },
        { rel: 'android-chrome-512x512', url: '/android-chrome-512x512.png' },
      ],
    },
    manifest: '/site.webmanifest',
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  // Fetch GA ID separately for Script component
  let gaId = '';
  try {
    const { data } = await supabase
      .from('seo_settings')
      .select('value')
      .eq('key', 'google_analytics_id')
      .single();
    if (data) gaId = data.value;
  } catch (e) { }

  // Fetch dynamic verifications for scripts (Analytics, AdSense Auto Ads)
  let analyticsCode = gaId;
  let adsensePublisherId = '';

  try {
    const { data: verifData } = await supabase
      .from('site_verification')
      .select('*')
      .eq('enabled', true);

    if (verifData) {
      const analyticsVerif = verifData.find((v: any) => v.service === 'analytics');
      if (analyticsVerif) analyticsCode = analyticsVerif.verification_code;

      const adsenseVerif = verifData.find((v: any) => v.service === 'adsense');
      if (adsenseVerif) {
        adsensePublisherId = adsenseVerif.verification_code;
        // Clean 'ca-pub-...' if it was pasted as a full script
        if (adsensePublisherId.includes('ca-pub-')) {
          const match = adsensePublisherId.match(/ca-pub-\d+/);
          if (match) adsensePublisherId = match[0];
        }
      }
    }
  } catch (e) { }

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* SoftwareApplication Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "InstaPSV",
              "operatingSystem": "Any",
              "applicationCategory": "BrowserApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "description": "Anonymous Instagram Story Viewer and Profile Parser. No login required.",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "1250"
              }
            })
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <AdProvider>
            <NextTopLoader
              color="#A855F7"
              initialPosition={0.08}
              crawlSpeed={200}
              height={3}
              crawl={true}
              showSpinner={false}
              easing="ease"
              speed={200}
              shadow="0 0 10px #A855F7,0 0 5px #A855F7"
            />
            <ScrollToTop />
            {children}
          </AdProvider>
        </NextIntlClientProvider>

        {/* Google Adsense Auto Ads */}
        {adsensePublisherId && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsensePublisherId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}

        {/* Google Analytics */}
        {analyticsCode && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${analyticsCode}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${analyticsCode}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
