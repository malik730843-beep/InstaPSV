import { Metadata } from 'next';
import ToolLandingPage from '@/components/seo/ToolLandingPage';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://instapsv.com';

export const metadata: Metadata = {
    title: 'Instagram Highlights Viewer — View Highlights Anonymously | InstaPSV',
    description: 'View and download Instagram Highlights anonymously. Browse saved story highlights from any public account without login. Free Instagram highlights viewer tool.',
    keywords: 'instagram highlights viewer, view instagram highlights, instagram highlights downloader, anonymous highlights viewer, watch highlights anonymously, ig highlights viewer',
    alternates: {
        canonical: `${BASE_URL}/instagram-highlights-viewer`,
    },
    openGraph: {
        title: 'Instagram Highlights Viewer — View Highlights Anonymously | InstaPSV',
        description: 'View and download Instagram Highlights anonymously. Browse saved story highlights from any public account.',
        url: `${BASE_URL}/instagram-highlights-viewer`,
        type: 'website',
    },
};

export default function InstagramHighlightsViewerPage() {
    return (
        <ToolLandingPage
            badge="⭐ Instagram Highlights Viewer"
            h1="Instagram Highlights Viewer —"
            h1Highlight="View Highlights Anonymously"
            subtitle="Browse and download Instagram Highlights from any public account anonymously. Unlike stories that disappear in 24 hours, highlights are permanent — view them anytime without login or account. Free and unlimited."
            schemaName="Instagram Highlights Viewer"
            schemaDescription="View and download Instagram Highlights anonymously. Browse saved story highlights without login."
            contentBlocks={[
                {
                    heading: 'What are Instagram Highlights and How to View Them Anonymously?',
                    body: 'Instagram Highlights are collections of stories that users save permanently on their profile. While regular stories expire after 24 hours, highlights remain visible indefinitely. InstaPSV\'s highlights viewer lets you browse these saved collections anonymously — the account owner will never know you viewed their highlights. This is perfect for research, inspiration, or simply catching up on content you missed.',
                },
                {
                    heading: 'Features of Our Instagram Highlights Viewer',
                    body: 'InstaPSV provides the most feature-rich way to view Instagram Highlights online. Here\'s what you get:',
                    list: [
                        'View all highlight collections from any public profile',
                        'Browse individual stories within each highlight category',
                        'Download highlight videos and photos in HD quality',
                        'Anonymous viewing — profile owner is never notified',
                        'Access highlights that were originally posted weeks or months ago',
                        'No Instagram account or app installation required',
                        'Works seamlessly on all devices and browsers',
                        'View highlights alongside stories, posts, and reels',
                    ],
                },
                {
                    heading: 'Use Cases for Instagram Highlights Viewer',
                    body: 'Instagram Highlights often contain valuable curated content that users want to showcase permanently. Businesses use highlights for product catalogs, service menus, FAQs, and testimonials. Influencers use them for content categories, collaborations, and tutorials. With InstaPSV\'s highlights viewer, you can anonymously browse all of this organized content for competitive analysis, market research, or creative inspiration — without ever logging in.',
                },
            ]}
            steps={[
                { title: 'Search Username', description: 'Enter the Instagram username of the account whose highlights you want to view.' },
                { title: 'Browse Highlights', description: 'See all their highlight collections organized by category. Click any highlight to view its stories.' },
                { title: 'Download & Save', description: 'Download individual highlight stories as photos or videos in original quality.' },
            ]}
            faqs={[
                { question: 'Can I view Instagram Highlights without an account?', answer: 'Yes! InstaPSV lets you view all public Instagram Highlights without needing any account or login. Just enter the username and start browsing.' },
                { question: 'Will the user know I viewed their highlights?', answer: 'No, InstaPSV\'s highlights viewer is completely anonymous. The account owner receives no notification about your viewing activity.' },
                { question: 'Can I download Instagram Highlights?', answer: 'Yes, you can download individual stories from any highlight collection in HD quality. Photos are saved as JPG and videos as MP4.' },
                { question: 'Are highlights always available to view?', answer: 'Yes, unlike regular stories that expire in 24 hours, highlights remain on a profile until the owner removes them. You can view them anytime.' },
                { question: 'Can I view highlights from private accounts?', answer: 'No, only public account highlights are accessible through our viewer. We respect Instagram\'s privacy settings for private profiles.' },
                { question: 'How many highlights can I view?', answer: 'There are no limits. Browse as many highlights and profiles as you want — completely free and unlimited.' },
            ]}
            relatedTools={[
                { href: '/instagram-story-viewer', label: 'Instagram Story Viewer' },
                { href: '/anonymous-instagram-viewer', label: 'Anonymous Instagram Viewer' },
                { href: '/instagram-profile-viewer', label: 'Instagram Profile Viewer' },
                { href: '/instagram-reels-downloader', label: 'Instagram Reels Downloader' },
                { href: '/instagram-photo-downloader', label: 'Instagram Photo Downloader' },
            ]}
            header={<Header alwaysDark />}
            footer={<Footer />}
        />
    );
}
