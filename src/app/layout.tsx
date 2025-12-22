import type { Metadata } from "next";
import "./globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

export const metadata: Metadata = {
  title: "InstaPSV - Anonymous Instagram Story Viewer & Followers Parser (No Login)",
  description: "View and download Instagram stories, profiles, and followers anonymously without an account. The best free IG story viewer tool with no login required.",
  keywords: "Anonymous Instagram Story Viewer, IG Story Viewer, Instagram Followers Parser, View Instagram Stories Anonymously, Download Instagram Stories, Instagram Highlights Viewer, No Login Instagram Viewer, Without Account",
  authors: [{ name: "InstaPSV" }],
  openGraph: {
    title: "InstaPSV - Anonymous Instagram Story Viewer & Downloader",
    description: "View and download Instagram stories, reels, and highlights anonymously. Free, secure, no account required.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
