import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnonymousDownloaderContent from './AnonymousDownloaderContent';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://instapsv.com';

export const metadata: Metadata = {
    alternates: {
        canonical: '/anonymous-instagram-downloader',
    },
    title: 'Anonymous Instagram Downloader: Secure, Fast & Free for Photos, Videos & Reels',
    description: 'Download Instagram photos, videos, and reels securely and anonymously. Enjoy high-quality fast downloads without leaving a trace or logging in. 100% free.',
    keywords: 'anonymous instagram downloader, download instagram anonymously, save ig videos discreetly, free instagram downloader private',

    openGraph: {
        title: 'Anonymous Instagram Downloader: Secure, Fast & Free',
        description: 'Download Instagram photos, videos, and reels securely and anonymously without logging in. Protect your privacy with our fast, free tool.',
        url: `${BASE_URL}/anonymous-instagram-downloader`,
        type: 'website',
    },
};

export default function AnonymousInstagramDownloaderPage() {
    return (
        <AnonymousDownloaderContent 
            header={<Header alwaysDark />}
            footer={<Footer />}
        />
    );
}
