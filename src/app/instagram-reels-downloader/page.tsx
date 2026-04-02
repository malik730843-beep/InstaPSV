import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnonymousDownloaderContent from '../anonymous-instagram-downloader/AnonymousDownloaderContent';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://instapsv.com';

export const metadata: Metadata = {
    title: 'Instagram Reels Downloader: Save High-Quality Reels Anonymously',
    description: 'Download Instagram Reels in high definition securely and anonymously. No login required, 100% free, and fast processing.',
    keywords: 'instagram reels downloader, save reels, download ig reels anonymously, free reels downloader',
    alternates: {
        canonical: `${BASE_URL}/instagram-reels-downloader`,
    },
    openGraph: {
        title: 'Instagram Reels Downloader: Secure & Fast',
        description: 'Download high-quality Instagram Reels without leaving a trace. No account needed, completely free.',
        url: `${BASE_URL}/instagram-reels-downloader`,
        type: 'website',
    },
};

export default function ReelsDownloaderPage() {
    return (
        <AnonymousDownloaderContent 
            header={<Header alwaysDark />}
            footer={<Footer />}
            restrictedTo="REELS"
            title={
                <>
                    Instagram Reels Downloader: <span style={{ background: 'linear-gradient(90deg, #00d4ff, #7928ca, #ff0080)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Secure & High-Quality</span>
                </>
            }
            subtitle="Download your favorite Instagram Reels directly to your device with 100% anonymity. No login, no account, and no watermarks—just fast, high-definition video downloads."
            ctaText="Start Downloading Reels Now!"
        />
    );
}
