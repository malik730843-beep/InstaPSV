import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HighlightsViewerContent from './HighlightsViewerContent';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://instapsv.com';

export const metadata: Metadata = {
    title: 'Anonymous Instagram Highlights Viewer: View & Download Securely | InstaPSV',
    description: 'Explore Instagram highlights discreetly without logging in. Our free, anonymous viewer acts as a proxy for ultimate privacy. Uncover public stories and highlights.',
    keywords: 'instagram highlights viewer, view instagram highlights anonymously, download instagram highlights, ig highlights viewer, safe instagram viewer, anonymous viewer no login',
    alternates: {
        canonical: `${BASE_URL}/instagram-highlights-viewer`,
    },
    openGraph: {
        title: 'Anonymous Instagram Highlights Viewer: View & Download Securely',
        description: 'Explore Instagram highlights discreetly without logging in. Our free, anonymous viewer provides ultimate privacy.',
        url: `${BASE_URL}/instagram-highlights-viewer`,
        type: 'website',
    },
};

export default function InstagramHighlightsViewerPage() {
    return (
        <HighlightsViewerContent
            header={<Header alwaysDark />}
            footer={<Footer />}
        />
    );
}
