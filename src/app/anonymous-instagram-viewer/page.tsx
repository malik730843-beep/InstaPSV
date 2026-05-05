import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ViewerContent from './ViewerContent';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://instapsv.com';

export const metadata: Metadata = {
    title: 'Anonymous Instagram Viewer — Browse Profiles & Stories Secretly | InstaPSV',
    description: 'View any public Instagram profile, stories, reels, and highlights completely anonymously. No login, no account, no digital trace. 100% free and secure.',
    keywords: 'anonymous instagram viewer, view instagram anonymously, ig profile viewer, watch stories secretly, instagram ghost mode',

    openGraph: {
        title: 'Anonymous Instagram Viewer — Browse Profiles Secretly | InstaPSV',
        description: 'Watch public Instagram content anonymously with no login required. Total privacy and security.',
        url: `${BASE_URL}/anonymous-instagram-viewer`,
        type: 'website',
    },
};

export default function AnonymousInstagramViewerPage() {
    return (
        <ViewerContent
            header={<Header alwaysDark />}
            footer={<Footer />}
        />
    );
}
