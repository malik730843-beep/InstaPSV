import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import InstagramSearch from '@/components/instagram/InstagramSearch';
import styles from './page.module.css';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://instapsv.com';

export const metadata: Metadata = {
    alternates: {
        canonical: '/instagram-highlights-viewer',
    },
    title: 'Instagram Highlights Viewer — Free & Anonymous | InstaPSV',
    description: 'Browse and download saved Instagram highlights from public profiles anonymously — no login required. View archived stories in HD quality instantly. 100% free.',
    keywords: 'instagram highlights viewer, view instagram highlights anonymously, download instagram highlights, ig highlights viewer no login, anonymous highlights downloader free',
    openGraph: {
        title: 'Instagram Highlights Viewer — Free & Anonymous | InstaPSV',
        description: 'Browse saved Instagram highlights from any public profile anonymously. No login required — HD quality, 100% free.',
        url: `${BASE_URL}/instagram-highlights-viewer`,
        type: 'website',
        siteName: 'InstaPSV',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Instagram Highlights Viewer — Free & Anonymous | InstaPSV',
        description: 'Browse saved Instagram highlights anonymously. No login required — 100% free.',
    },
};

const faqItems = [
    {
        question: 'What are Instagram Highlights?',
        answer: 'Instagram Highlights are curated collections of past Stories that a user has permanently pinned to the top of their profile. Unlike regular Stories which disappear after 24 hours, Highlights remain visible on the profile indefinitely until the owner removes them.'
    },
    {
        question: 'Can I view Instagram Highlights without an account?',
        answer: 'Yes. InstaPSV allows you to browse Instagram Highlights from any public profile without needing an Instagram account, login, or even an email address. Simply enter the username and view their highlight reels instantly.'
    },
    {
        question: 'Does the profile owner know I viewed their highlights?',
        answer: 'No. Unlike viewing highlights on Instagram directly (where you appear in the viewer list), using InstaPSV keeps you completely anonymous. The profile owner has no way of seeing that you accessed their highlights through our platform.'
    },
    {
        question: 'Can I download Instagram Highlights?',
        answer: 'Yes. InstaPSV Pro users can download individual photos and videos from Highlights directly to their device in their original high-definition quality. Free users can browse all highlight content in the browser.'
    },
    {
        question: 'Can I view Highlights from private accounts?',
        answer: 'No. InstaPSV only accesses publicly available content. Private accounts hide their Highlights from non-followers, and we fully respect those privacy settings. Only public profile Highlights are accessible.'
    },
    {
        question: 'How many Highlights can I view at once?',
        answer: 'You can view all publicly available Highlight categories from a profile in one session. After entering a username, all their Highlight covers appear. You can click any Highlight to view the full story collection inside it.'
    },
    {
        question: 'Why might some Highlights appear empty or not load?',
        answer: 'This can happen if: (1) The account recently switched to private. (2) The account deleted the Highlight after you searched. (3) There is a temporary connection issue. Try refreshing the page or searching again after a few seconds.'
    },
];

export default function InstagramHighlightsViewerPage() {
    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map(item => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
            },
        })),
    };

    const howToSchema = {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: 'How to View Instagram Highlights Anonymously',
        description: 'Use InstaPSV to browse saved Instagram Highlights from any public profile without logging in.',
        step: [
            {
                '@type': 'HowToStep',
                position: 1,
                name: 'Enter the Username',
                text: 'Type the Instagram username of the public account whose Highlights you want to view into the search field.',
            },
            {
                '@type': 'HowToStep',
                position: 2,
                name: 'Select a Highlight Category',
                text: 'InstaPSV will display all the Highlight covers from that profile. Click on any Highlight title to open the stories inside it.',
            },
            {
                '@type': 'HowToStep',
                position: 3,
                name: 'Browse Archived Stories Privately',
                text: 'View all media inside the Highlight completely anonymously. The account owner cannot see that you accessed their content.',
            },
        ],
    };

    return (
        <div className={styles.container}>
            <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
            <Header alwaysDark />
            <main className={styles.main}>
                <article className={styles.article}>
                    <header className={styles.header}>
                        <h1 className={styles.title}>Instagram Highlights Viewer & Downloader</h1>
                        <p className={styles.subtitle}>
                            Browse and download saved Instagram Highlights from any public profile in high definition — completely anonymous, no login required.
                        </p>
                    </header>

                    <div className={styles.searchSection}>
                        <InstagramSearch placeholder="Enter username to view highlights..." restrictedTo="HIGHLIGHTS" />
                    </div>

                    <section className={styles.content}>
                        <h2>Browse Instagram Highlights Anonymously — No Login Needed</h2>
                        <p>
                            Instagram Highlights are pinned story collections that live permanently on a user's profile page.
                            When you view them on Instagram directly, the account owner can see your username in the viewer list.
                            InstaPSV solves this: our anonymous proxy fetches Highlight content on your behalf, so you can browse all Highlight categories and their archived stories without the owner ever knowing you were there.
                        </p>

                        <h2>What You Can Do with InstaPSV Highlights Viewer</h2>
                        <ul>
                            <li><strong>Browse All Highlight Covers:</strong> See every Highlight category pinned on a public profile in one view.</li>
                            <li><strong>View Archived Stories in HD:</strong> Access older stories that have been saved to Highlights in full resolution.</li>
                            <li><strong>Read Highlight Titles:</strong> Check the category names the profile owner has assigned to each Highlight group.</li>
                            <li><strong>Download Media (Pro):</strong> Save individual photos and videos from Highlights directly to your device.</li>
                            <li><strong>Complete Anonymity:</strong> Zero footprint — the account owner never knows you visited.</li>
                        </ul>

                        <h2>How Instagram Highlights Differ from Stories</h2>
                        <p>
                            Regular Instagram Stories expire after 24 hours. Highlights are permanent collections — the profile owner selects past stories and pins them to their profile.
                            This means Highlights can contain content from months or years ago, giving you a window into a creator's or brand's history without the 24-hour time pressure of regular stories.
                        </p>

                        <h2>Frequently Asked Questions</h2>
                        <div>
                            {faqItems.map((item, index) => (
                                <div key={index} style={{ marginBottom: '20px' }}>
                                    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>{item.question}</h3>
                                    <p style={{ lineHeight: '1.7', opacity: 0.85 }}>{item.answer}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </article>
            </main>
            <Footer />
        </div>
    );
}
