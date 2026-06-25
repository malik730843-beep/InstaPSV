import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import InstagramSearch from '@/components/instagram/InstagramSearch';
import styles from './page.module.css';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://instapsv.com';

export const metadata: Metadata = {
    alternates: {
        canonical: '/instagram-story-viewer',
    },
    title: 'Instagram Story Viewer — Watch Anonymously | InstaPSV',
    description: 'Watch public Instagram stories anonymously in ghost mode — no login, no account, no trace. The fastest free anonymous IG story viewer. Works instantly on any device.',
    keywords: 'instagram story viewer, anonymous instagram story viewer, watch instagram stories anonymously, ig story viewer, view instagram stories without account, view instagram stories secretly free',
    openGraph: {
        title: 'Instagram Story Viewer — Watch Anonymously | InstaPSV',
        description: 'Watch public Instagram stories anonymously. Ghost mode — no login, no trace, 100% free.',
        url: `${BASE_URL}/instagram-story-viewer`,
        type: 'website',
        siteName: 'InstaPSV',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Instagram Story Viewer — Watch Anonymously | InstaPSV',
        description: 'Watch public Instagram stories anonymously. Ghost mode — no login, no trace, 100% free.',
    },
};

const faqItems = [
    {
        question: 'Can I watch Instagram stories without the person knowing?',
        answer: 'Yes. When you use InstaPSV\'s story viewer, the account owner cannot see you in their "Seen by" viewer list. Our system fetches stories through an anonymous proxy, keeping your identity completely hidden at every step.'
    },
    {
        question: 'Do I need an Instagram account to view stories?',
        answer: 'No. InstaPSV requires absolutely no Instagram account, login, or sign-up. Simply enter the username of the public account whose stories you want to view, and they appear instantly.'
    },
    {
        question: 'Can I watch stories from private accounts?',
        answer: 'No. InstaPSV only works with public Instagram accounts. Private accounts hide their stories from non-followers, and we fully respect those settings. We do not bypass any privacy controls or security measures.'
    },
    {
        question: 'Can I download Instagram stories using InstaPSV?',
        answer: 'Yes. InstaPSV Pro subscribers can download story images and videos directly to their device in their original quality. Free users can watch all stories anonymously in the browser without downloading.'
    },
    {
        question: 'How long does it take to view someone\'s stories?',
        answer: 'It is near-instant. After entering a username, InstaPSV typically loads the available stories within 1–3 seconds. There are no complicated steps, surveys, or verification hurdles.'
    },
    {
        question: 'Are anonymous Instagram story viewers legal?',
        answer: 'Yes. Viewing publicly available Instagram stories is legal. InstaPSV only accesses content that the account owner has deliberately made public. We do not bypass private settings, intercept private data, or violate Instagram\'s API policies affecting end users.'
    },
    {
        question: 'What if no stories appear for a username?',
        answer: 'There are two possible reasons: (1) The account has no active stories at this moment — Instagram stories expire after 24 hours. (2) The account is set to private. Try checking back later, or verify the username is spelled correctly.'
    },
    {
        question: 'Is InstaPSV safe? Does it ask for my Instagram password?',
        answer: 'InstaPSV is 100% safe and never asks for your Instagram login credentials or password. We never collect, store, or share any personal information. If any site asks for your Instagram password to view stories, it is a scam — close it immediately.'
    },
];

export default function InstagramStoryViewerPage() {
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
        name: 'How to Watch Instagram Stories Anonymously',
        description: 'Use InstaPSV to watch any public Instagram story without being seen or logged in.',
        step: [
            {
                '@type': 'HowToStep',
                position: 1,
                name: 'Go to the Story Viewer',
                text: 'Visit instapsv.com/instagram-story-viewer on any device. No app download or account creation required.',
            },
            {
                '@type': 'HowToStep',
                position: 2,
                name: 'Enter a Username',
                text: 'Type the Instagram username of the public account (e.g. "cristiano") into the search field and press Enter.',
            },
            {
                '@type': 'HowToStep',
                position: 3,
                name: 'Watch Stories Privately',
                text: 'Instantly view all active stories from that profile in full quality. You will not appear on the "Seen by" list — completely anonymous.',
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
                        <h1 className={styles.title}>Anonymous Instagram Story Viewer</h1>
                        <p className={styles.subtitle}>
                            Watch active Instagram stories anonymously — stay 100% hidden in ghost mode. No login, no account, and no digital footprint left behind.
                        </p>
                    </header>

                    <div className={styles.searchSection}>
                        <InstagramSearch placeholder="Enter username to view stories..." restrictedTo="STORIES" />
                    </div>

                    <section className={styles.content}>
                        <h2>Watch Instagram Stories Without Being Seen</h2>
                        <p>
                            Every time you view a story on Instagram directly, the account owner sees your username in their "Seen by" list.
                            InstaPSV eliminates this problem entirely. Our anonymous gateway fetches public stories on your behalf, so you never appear on anyone's viewer list.
                            Whether you're checking up on a competitor, an ex, or just curious about a creator's day — your identity stays completely private.
                        </p>

                        <h2>Key Features of InstaPSV Story Viewer</h2>
                        <ul>
                            <li><strong>True Ghost Mode:</strong> You never appear in the "Seen by" list — 100% invisible.</li>
                            <li><strong>No Login Required:</strong> No Instagram account, no email, no sign-up of any kind.</li>
                            <li><strong>HD Quality:</strong> Stories load in their original full-resolution quality.</li>
                            <li><strong>Works on All Devices:</strong> Phone, tablet, or desktop — no app needed.</li>
                            <li><strong>Instant Results:</strong> Stories appear in 1–3 seconds after entering a username.</li>
                            <li><strong>Download Option (Pro):</strong> Save story images and videos directly to your device.</li>
                        </ul>

                        <h2>How to View Instagram Stories Anonymously</h2>
                        <p>
                            Simply enter the Instagram username of the public account you want to watch (just the handle, no "@" needed).
                            InstaPSV will instantly retrieve their currently active stories.
                            You can view photos, watch videos, and read text overlays — all in complete anonymity, with zero risk of being discovered.
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
