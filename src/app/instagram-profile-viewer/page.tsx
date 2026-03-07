import { Metadata } from 'next';
import ToolLandingPage from '@/components/seo/ToolLandingPage';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://instapsv.com';

export const metadata: Metadata = {
    title: 'Instagram Profile Viewer — View Any Public Profile | InstaPSV',
    description: 'View any public Instagram profile anonymously. Browse posts, followers, following lists, bio, and profile picture in HD. Free Instagram profile viewer — no login required.',
    keywords: 'instagram profile viewer, view instagram profile, instagram profile viewer online, anonymous instagram profile viewer, ig profile viewer, view instagram profile picture',
    alternates: {
        canonical: `${BASE_URL}/instagram-profile-viewer`,
    },
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
                    body: 'An Instagram profile viewer lets you browse any public Instagram account without logging in or revealing your identity. With InstaPSV\'s profile viewer, you can see their bio, post count, follower and following lists, profile picture in full HD, and all their public posts — completely anonymously. Unlike using the Instagram app, your visit is never recorded or shown to the account owner.',
                },
                {
                    heading: 'Features of Our Instagram Profile Viewer',
                    body: 'InstaPSV provides the most comprehensive Instagram profile viewing experience available online. Here\'s everything you can access from a single username search:',
                    list: [
                        'Full profile information — bio, website, category, and verification status',
                        'Profile picture in full HD resolution (download available)',
                        'Complete post gallery with likes and comment counts',
                        'Follower and following list browser with parsing capability',
                        'Stories, highlights, and reels from the same profile',
                        'Anonymous viewing — account owner is never notified',
                        'Works without any Instagram account or app installation',
                        'Export follower/following data for research and analysis',
                    ],
                },
                {
                    heading: 'Instagram Profile Viewer for Research & Analysis',
                    body: 'Many professionals use Instagram profile viewers for legitimate research. Digital marketers analyze competitor profiles, brands scope out potential influencer partnerships, researchers study social media trends, and journalists verify public figures\' posts. InstaPSV provides all this data anonymously and for free, making it the ideal tool for professional Instagram research without the need for a logged-in account.',
                },
            ]}
            steps={[
                { title: 'Enter Username', description: 'Type the Instagram username of the profile you want to view in the search bar above.' },
                { title: 'View Full Profile', description: 'Browse their complete profile including bio, posts, followers, following, and profile picture.' },
                { title: 'Download & Export', description: 'Save profile pictures in HD, download posts, or export follower data with a single click.' },
            ]}
            faqs={[
                { question: 'Can I view someone\'s Instagram profile without them knowing?', answer: 'Yes! InstaPSV\'s Instagram profile viewer is completely anonymous. The account owner will never know you viewed their profile, posts, or any other content.' },
                { question: 'Can I see the full-size Instagram profile picture?', answer: 'Yes, our profile viewer lets you view and download Instagram profile pictures (avatars) in full HD resolution — much larger than what you see in the app.' },
                { question: 'Can I view follower and following lists?', answer: 'Yes, InstaPSV includes a unique followers parser that lets you browse and export the follower and following lists of any public Instagram profile.' },
                { question: 'Does this work for private profiles?', answer: 'No, our Instagram profile viewer only works with public profiles. Private accounts are protected by Instagram\'s privacy settings and cannot be accessed.' },
                { question: 'Is this Instagram profile viewer free?', answer: 'Yes, completely free with no limits. View as many profiles as you want without any charges or registration required.' },
                { question: 'What information can I see about a profile?', answer: 'You can see their bio, website, category, verification status, post count, follower count, following count, all public posts, stories, highlights, and reels.' },
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
