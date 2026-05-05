import { Metadata } from 'next';
import ToolLandingPage from '@/components/seo/ToolLandingPage';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://instapsv.com';

export const metadata: Metadata = {
    title: 'Instagram Profile Viewer — View Any Public Profile | InstaPSV',
    description: 'View any public Instagram profile anonymously. Browse posts, followers, following lists, bio, and profile picture in HD. Free Instagram profile viewer — no login required.',
    keywords: 'instagram profile viewer, view instagram profile, instagram profile viewer online, anonymous instagram profile viewer, ig profile viewer, view instagram profile picture',

    openGraph: {
        title: 'Instagram Profile Viewer — View Any Public Profile | InstaPSV',
        description: 'View any public Instagram profile anonymously. Browse posts, followers, and profile picture in HD.',
        url: `${BASE_URL}/instagram-profile-viewer`,
        type: 'website',
    },
};

export default function InstagramProfileViewerPage() {
    return (
        <ToolLandingPage
            badge="👤 Instagram Profile Viewer"
            h1="Instagram Profile Viewer —"
            h1Highlight="View Any Public Profile"
            subtitle="Browse any public Instagram profile anonymously. View their bio, posts, followers, following lists, and profile picture in full HD quality. Free Instagram profile viewer — no account or login needed."
            schemaName="Instagram Profile Viewer"
            schemaDescription="View any public Instagram profile anonymously. Browse posts, followers, following lists, and profile pictures."
            contentBlocks={[
                {
                    heading: 'What is an Instagram Profile Viewer?',
                    body: 'Browse public accounts securely without a login. View bios, follower lists, HD profile pictures, and posts in complete anonymity—leaving no digital footprint or trace.',
                },
                {
                    heading: 'Premium Features Included',
                    body: 'Our comprehensive tool unlocks robust profile functionality:',
                    list: [
                        'Full bios & verification data',
                        'HD profile pictures & downloads',
                        'Post galleries with full metrics',
                        'Anonymous Story & Reels viewer',
                        'Export follower data (Pro)',
                    ],
                },
                {
                    heading: 'Built for Research & Analysis',
                    body: 'Ideal for professional use. Marketers analyze competitors, brands scope out influencers, and journalists verify posts safely without needing an active Instagram session.',
                },
            ]}
            steps={[
                { title: 'Enter Username', description: 'Type the Instagram username of the profile you want to view in the search bar above.' },
                { title: 'View Full Profile', description: 'Browse their complete profile including bio, posts, followers, following, and profile picture.' },
                { title: 'Download & Export', description: 'Save profile pictures in HD, download posts, or export follower data with a Pro account.' },
            ]}
            faqs={[
                { question: 'Can I view someone\'s Instagram profile without them knowing?', answer: 'Yes! InstaPSV\'s Instagram profile viewer is completely anonymous. The account owner will never know you viewed their profile, posts, or any other content.' },
                { question: 'Can I see the full-size Instagram profile picture?', answer: 'Yes, our profile viewer lets you view and download (Pro feature) Instagram profile pictures (avatars) in full HD resolution — much larger than what you see in the app.' },
                { question: 'Can I view follower and following lists?', answer: 'Yes, InstaPSV includes a unique followers parser that lets you browse and export the follower and following lists of any public Instagram profile.' },
                { question: 'Does this work for private profiles?', answer: 'No, our Instagram profile viewer only works with public profiles. Private accounts are protected by Instagram\'s privacy settings and cannot be accessed.' },
                { question: 'Is this Instagram profile viewer free?', answer: 'Yes, you can view posts and reels for free. Advanced features like Stories, Highlights, and Downloads require a Pro plan.' },
                { question: 'What information can I see about a profile?', answer: 'You can see their bio, website, category, verification status, post count, follower count, following count, all public posts, and reels for free. Stories and highlights are available on the Pro plan.' },
            ]}
            relatedTools={[
                { href: '/instagram-story-viewer', label: 'Instagram Story Viewer' },
                { href: '/anonymous-instagram-viewer', label: 'Anonymous Instagram Viewer' },
                { href: '/instagram-reels-downloader', label: 'Instagram Reels Downloader' },
                { href: '/instagram-highlights-viewer', label: 'Instagram Highlights Viewer' },
                { href: '/instagram-photo-downloader', label: 'Instagram Photo Downloader' },
            ]}
            header={<Header alwaysDark />}
            footer={<Footer />}
        />
    );
}
