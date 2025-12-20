import type { Metadata } from "next";
import "./globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

export const metadata: Metadata = {
  title: "InstaPSV - Instagram Story and Followers Viewer",
  description: "View Instagram stories, profiles, and followers anonymously. The best free Instagram viewer tool with no login required.",
  keywords: "Instagram viewer, story viewer, followers viewer, Instagram profile viewer, anonymous Instagram",
  authors: [{ name: "InstaPSV" }],
  openGraph: {
    title: "InstaPSV - Instagram Story and Followers Viewer",
    description: "View Instagram stories, profiles, and followers anonymously. Free and easy to use.",
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
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
