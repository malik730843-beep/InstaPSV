import type { Metadata } from "next";
import { Nunito, Inter } from 'next/font/google';
import "./globals.css";
import "./typography.css";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { createClient } from '@supabase/supabase-js';
import Script from 'next/script';
import ScrollToTop from '@/components/layout/ScrollToTop';
import NextTopLoader from 'nextjs-toploader';

const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Initialize Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function generateMetadata(): Promise<Metadata> {
  // Fetch SEO settings
  let title = "InstaPSV — Anonymous Instagram Viewer | No Login";
  let description = "View Instagram stories, profiles, reels & highlights anonymously — no login, no account. 100% private, free, and works on any device.";
  let keywords = "anonymous instagram viewer, instagram story viewer, view instagram stories anonymously, ig story viewer no login, instagram profile viewer anonymous, download instagram stories free";
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://instapsv.com';

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: '%s | InstaPSV',
    },
    description,
    keywords,
    authors: [{ name: "InstaPSV" }],
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
      ...verification,
      google: "Fnn-go67eU4kNaQBJ5Y_wXWSWxu8W2zCs5cIv8e1Tck",
      other: otherMeta
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${siteUrl}/`,
      siteName: 'InstaPSV',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: '@instapsv',
      creator: '@instapsv',
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
  let gaId = 'G-FFC7WJ09DH';
  try {
    const { data } = await supabase
      .from('seo_settings')
      .select('value')
      .eq('key', 'google_analytics_id')
      .single();
    if (data) gaId = data.value;
  } catch (e) { }

  // Fetch dynamic verifications for scripts (Analytics)
  let analyticsCode = gaId;

  try {
    const { data: verifData } = await supabase
      .from('site_verification')
      .select('*')
      .eq('enabled', true);

    if (verifData) {
      const analyticsVerif = verifData.find((v: any) => v.service === 'analytics');
      if (analyticsVerif) analyticsCode = analyticsVerif.verification_code;
    }
  } catch (e) { }

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* SoftwareApplication Schema — rich results eligibility */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "InstaPSV",
              "url": process.env.NEXT_PUBLIC_SITE_URL || "https://instapsv.com",
              "operatingSystem": "Any",
              "applicationCategory": "BrowserApplication",
              "description": "InstaPSV is a free anonymous Instagram viewer. View stories, highlights, reels, and profiles privately with no login or account required.",
              "featureList": [
                "Anonymous Instagram Story Viewer",
                "Instagram Profile Viewer without Login",
                "Instagram Highlights Downloader",
                "Instagram Reels Downloader HD",
                "Instagram Hashtag Generator",
                "No login or account required",
                "100% free to use"
              ],
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "1247",
                "bestRating": "5",
                "worstRating": "1"
              }
            })
          }}
        />
        {/* BreadcrumbList Schema — full site navigation */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": process.env.NEXT_PUBLIC_SITE_URL || "https://instapsv.com"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Anonymous Instagram Viewer",
                  "item": `${process.env.NEXT_PUBLIC_SITE_URL || "https://instapsv.com"}/anonymous-instagram-viewer`
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "Instagram Story Viewer",
                  "item": `${process.env.NEXT_PUBLIC_SITE_URL || "https://instapsv.com"}/instagram-story-viewer`
                },
                {
                  "@type": "ListItem",
                  "position": 4,
                  "name": "Instagram Highlights Viewer",
                  "item": `${process.env.NEXT_PUBLIC_SITE_URL || "https://instapsv.com"}/instagram-highlights-viewer`
                },
                {
                  "@type": "ListItem",
                  "position": 5,
                  "name": "Instagram Reels Downloader",
                  "item": `${process.env.NEXT_PUBLIC_SITE_URL || "https://instapsv.com"}/instagram-reels-downloader`
                },
                {
                  "@type": "ListItem",
                  "position": 6,
                  "name": "Instagram Hashtag Generator",
                  "item": `${process.env.NEXT_PUBLIC_SITE_URL || "https://instapsv.com"}/instagram-hashtag-generator`
                }
              ]
            })
          }}
        />
        {/* WebSite Schema — enables Google Sitelinks Searchbox */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "InstaPSV",
              "url": process.env.NEXT_PUBLIC_SITE_URL || "https://instapsv.com",
              "description": "Free anonymous Instagram viewer — view stories, profiles, reels & highlights without login.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": `${process.env.NEXT_PUBLIC_SITE_URL || "https://instapsv.com"}/anonymous-instagram-viewer?q={search_term_string}`
                },
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className={`${nunito.variable} ${inter.variable}`} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
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
        </NextIntlClientProvider>


        {/* Google Analytics */}
        {analyticsCode && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${analyticsCode}`}
              strategy="lazyOnload"
            />
            <Script id="google-analytics" strategy="lazyOnload">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${analyticsCode}');
              `}
            </Script>
          </>
        )}

        {/* Microsoft Clarity */}
        <Script id="microsoft-clarity" strategy="lazyOnload">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "v3qtewuzks");
          `}
        </Script>

        {/* Google Identity Services */}
        <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
      </body>
    </html >
  );
}
