import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StoryViewerContent from './StoryViewerContent';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://instapsv.com';

export const metadata: Metadata = {
    title: 'Anonymous Instagram Story Viewer: View & Download Discreetly (No Login Required) | InstaPSV',
    description: 'View and download public Instagram stories anonymously without showing up in the viewer list. No login required. 100% free, private, and secure.',
    keywords: 'anonymous instagram story viewer, view instagram stories anonymously, download instagram stories, ig story viewer, watch instagram stories secretly, anonymous story viewer no login',
    alternates: {
        canonical: `${BASE_URL}/instagram-story-viewer`,
    },
    openGraph: {
        title: 'Anonymous Instagram Story Viewer: View & Download Discreetly (No Login)',
        description: 'Watch and download public Instagram stories secretly. 100% anonymous with no login required.',
        url: `${BASE_URL}/instagram-story-viewer`,
        type: 'website',
    },
};

export default function InstagramStoryViewerPage() {
    return (
        <StoryViewerContent
            header={<Header alwaysDark />}
            footer={<Footer />}
        />
    );
}
