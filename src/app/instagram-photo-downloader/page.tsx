import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnonymousDownloaderContent from '../anonymous-instagram-downloader/AnonymousDownloaderContent';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://instapsv.com';

export const metadata: Metadata = {
    title: 'Instagram Photo Downloader: High-Quality Downloads Anonymously',
    description: 'Download Instagram photos and carousels in original resolution securely and anonymously. No login required, 100% free.',
    keywords: 'instagram photo downloader, save photos, download ig photos anonymously, free photo downloader',
    alternates: {
        canonical: `${BASE_URL}/instagram-photo-downloader`,
    },
    openGraph: {
        title: 'Instagram Photo Downloader: Secure & Fast',
        description: 'Save Instagram photos with ease and 100% anonymity. Our tool is fast, free, and secure.',
        url: `${BASE_URL}/instagram-photo-downloader`,
        type: 'website',
    },
};

export default function PhotoDownloaderPage() {
    return (
        <AnonymousDownloaderContent 
            header={<Header alwaysDark />}
            footer={<Footer />}
            restrictedTo="POSTS"
            title={
                <>
                    Instagram Photo Downloader: <span style={{ background: 'linear-gradient(90deg, #00d4ff, #7928ca, #ff0080)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>High-Quality & Secure</span>
                </>
            }
            subtitle="Save Instagram photos and carousels in their original high resolution. Our tool ensures 100% anonymity, requires no login, and is completely free to use on any device."
            ctaText="Start Downloading Photos Now!"
        />
    );
}
