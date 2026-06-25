import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import InstagramSearch from '@/components/instagram/InstagramSearch';
import styles from './page.module.css';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://instapsv.com';

export const metadata: Metadata = {
    alternates: {
        canonical: '/anonymous-instagram-viewer',
    },
    title: 'Anonymous Instagram Viewer — No Login | InstaPSV',
    description: 'View any public Instagram profile, posts, bio & followers anonymously — no login, no account needed. 100% free, private & instant. Browse Instagram without being seen.',
    keywords: 'anonymous instagram viewer, view instagram profile anonymously, browse instagram without account, ig profile viewer no login, instagram viewer free, view instagram posts anonymously',
    openGraph: {
        title: 'Anonymous Instagram Viewer — No Login | InstaPSV',
        description: 'View any public Instagram profile anonymously. Browse posts, bio & followers in HD. No login needed — 100% free & private.',
        url: `${BASE_URL}/anonymous-instagram-viewer`,
        type: 'website',
        siteName: 'InstaPSV',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Anonymous Instagram Viewer — No Login | InstaPSV',
        description: 'View any public Instagram profile anonymously. No login needed — 100% free & private.',
    },
};

const faqItems = [
    {
        question: 'Can I view any Instagram profile anonymously with InstaPSV?',
        answer: 'Yes. InstaPSV lets you view any public Instagram profile completely anonymously. You can browse their posts, bio, follower count, following list, and profile picture in HD — all without logging in or creating an account.'
    },
    {
        question: 'Does the profile owner know I viewed their account?',
        answer: 'No. When you use InstaPSV, the profile owner has absolutely no way of knowing you visited their page. Our system acts as an intermediary gateway, so your IP address and identity never reach Instagram\'s servers.'
    },
    {
        question: 'Is it legal to view Instagram profiles anonymously?',
        answer: 'Yes, viewing publicly available information on Instagram is legal. InstaPSV only accesses content that the account owner has made publicly visible. We do not access private accounts, bypass security measures, or violate Instagram\'s terms in any way that affects the account owner.'
    },
    {
        question: 'Can I view private Instagram profiles?',
        answer: 'No. InstaPSV only works with public Instagram accounts. Private accounts restrict their content from non-followers, and we respect those privacy settings completely. Any website claiming to show you private Instagram profiles is almost certainly a scam.'
    },
    {
        question: 'Do I need to install an app or create an account to use InstaPSV?',
        answer: 'No. InstaPSV is entirely browser-based. There is no app to download, no account to create, and no login required. Simply visit the page, enter a username, and view the profile instantly.'
    },
    {
        question: 'Is InstaPSV safe to use?',
        answer: 'Yes. InstaPSV never asks for your Instagram login credentials, never collects your personal information, and never installs software on your device. We are a legitimate, browser-based viewer for public content only.'
    },
    {
        question: 'Can I download photos and videos from Instagram profiles?',
        answer: 'Yes. InstaPSV Pro users can download photos, videos, and carousel posts in their original HD quality directly to their device. Free users can view all public content in-browser without downloading.'
    },
    {
        question: 'Why am I not able to find a private account?',
        answer: 'InstaPSV only shows results for public accounts. If an account is set to private, our system will not return any results for it, as we respect and enforce Instagram\'s privacy settings.'
    },
];

export default function AnonymousInstagramViewerPage() {
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
        name: 'How to View Instagram Profiles Anonymously',
        description: 'Use InstaPSV to browse any public Instagram profile without logging in or revealing your identity.',
        step: [
            {
                '@type': 'HowToStep',
                position: 1,
                name: 'Enter the Instagram Username',
                text: 'Type the Instagram username (e.g. "cristiano" or "@cristiano") of the public profile you want to view into the search bar above.',
            },
            {
                '@type': 'HowToStep',
                position: 2,
                name: 'Click "View Profile"',
                text: 'Press the search button or hit Enter. InstaPSV will instantly fetch the public profile data through our anonymous gateway.',
            },
            {
                '@type': 'HowToStep',
                position: 3,
                name: 'Browse Anonymously',
                text: 'View posts, bio, follower metrics, and profile photos in HD — completely anonymously. The account owner is never notified.',
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
                        <h1 className={styles.title}>Anonymous Instagram Profile Viewer</h1>
                        <p className={styles.subtitle}>
                            Browse any public Instagram account privately — view posts, bio, followers & following without logging in or leaving a trace.
                        </p>
                    </header>

                    <div className={styles.searchSection}>
                        <InstagramSearch placeholder="Enter Instagram username to view profile..." restrictedTo="POSTS" />
                    </div>

                    <section className={styles.content}>
                        <h2>View Instagram Profiles Anonymously — No Account Needed</h2>
                        <p>
                            InstaPSV is a free, browser-based tool that lets you explore any public Instagram account without creating an Instagram profile or logging in.
                            Unlike visiting Instagram directly — where your account appears in the profile's visitor analytics — InstaPSV acts as a secure, anonymous gateway.
                            We fetch the public profile data on your behalf, so your identity and IP address are never exposed to Instagram's tracking systems.
                        </p>

                        <h2>What You Can View Anonymously</h2>
                        <ul>
                            <li><strong>Profile Bio & Info:</strong> Read the full bio, website links, and contact details without the owner knowing.</li>
                            <li><strong>Post Grid in HD:</strong> Browse the full photo and video feed in original high-definition quality.</li>
                            <li><strong>Follower & Following Counts:</strong> Check audience metrics and follower numbers without an account.</li>
                            <li><strong>Carousel Albums:</strong> View multi-image and multi-video posts completely anonymously.</li>
                            <li><strong>Profile Picture in HD:</strong> See the full-resolution profile photo — not the tiny thumbnail Instagram shows by default.</li>
                        </ul>

                        <h2>Why Choose InstaPSV?</h2>
                        <ul>
                            <li><strong>Zero Trace:</strong> The account owner can never see you visited. Your name is 100% hidden.</li>
                            <li><strong>No Account Required:</strong> No sign-up, no email, no Instagram login — ever.</li>
                            <li><strong>Completely Free:</strong> Basic anonymous viewing is free for all users, on any device.</li>
                            <li><strong>Secure Gateway:</strong> Your real IP is never exposed to Instagram's servers.</li>
                            <li><strong>Works on All Devices:</strong> Mobile, tablet, laptop, or desktop — no app needed.</li>
                        </ul>

                        <h2>Frequently Asked Questions</h2>
                        <div className={styles.faqList || ''}>
                            {faqItems.map((item, index) => (
                                <div key={index} className={styles.faqItem || ''} style={{ marginBottom: '20px' }}>
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
