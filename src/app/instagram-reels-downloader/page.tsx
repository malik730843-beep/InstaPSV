import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import InstagramSearch from '@/components/instagram/InstagramSearch';
import styles from './page.module.css';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://instapsv.com';

export const metadata: Metadata = {
    alternates: {
        canonical: '/instagram-reels-downloader',
    },
    title: 'Instagram Reels Downloader — Free HD Download | InstaPSV',
    description: 'Download Instagram Reels from any public account in HD quality — no login, no watermark, completely free. Watch and save reels anonymously on any device.',
    keywords: 'instagram reels downloader, download instagram reels free, instagram reels downloader no watermark, ig reels downloader hd, save instagram reels, watch instagram reels anonymously',
    openGraph: {
        title: 'Instagram Reels Downloader — Free HD Download | InstaPSV',
        description: 'Download Instagram Reels in HD from any public account — no login, no watermark, 100% free.',
        url: `${BASE_URL}/instagram-reels-downloader`,
        type: 'website',
        siteName: 'InstaPSV',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Instagram Reels Downloader — Free HD Download | InstaPSV',
        description: 'Download Instagram Reels in HD from any public account — no login, no watermark, 100% free.',
    },
};

const faqItems = [
    {
        question: 'How do I download Instagram Reels for free?',
        answer: 'Using InstaPSV: (1) Go to instapsv.com/instagram-reels-downloader. (2) Enter the Instagram username of the creator. (3) Browse their Reels. (4) Pro users can click the download button on any Reel to save it in HD to their device — no watermark, no sign-up needed.'
    },
    {
        question: 'Can I download Instagram Reels without watermark?',
        answer: 'Yes. InstaPSV downloads Reels in their original, unmodified quality — exactly as uploaded by the creator. We do not add any watermark or modify the video file in any way. The file you download is the clean original.'
    },
    {
        question: 'Do I need an Instagram account to download Reels?',
        answer: 'No. InstaPSV requires no Instagram account, no login, and no personal information of any kind. Simply enter the creator\'s username to access and download their public Reels.'
    },
    {
        question: 'Can I download Reels from private accounts?',
        answer: 'No. InstaPSV only works with public Instagram accounts. Private accounts restrict their content from non-followers, and we fully respect those privacy settings. Only Reels from public profiles can be viewed and downloaded.'
    },
    {
        question: 'What video quality do downloaded Reels have?',
        answer: 'InstaPSV downloads Reels in their original HD quality as uploaded by the creator. The file quality is exactly what was uploaded to Instagram — typically 1080p for most modern Reels.'
    },
    {
        question: 'Can I watch Instagram Reels anonymously without downloading?',
        answer: 'Yes. All users (including free users) can watch Instagram Reels anonymously through InstaPSV without downloading. Your viewing activity is never tracked or logged, and the creator does not know you watched their Reel.'
    },
    {
        question: 'Is it legal to download Instagram Reels?',
        answer: 'Downloading publicly available content for personal, non-commercial use is generally acceptable. However, you should always respect the creator\'s copyright. Do not redistribute, re-upload, or commercialize downloaded Reels without the creator\'s explicit permission.'
    },
    {
        question: 'Why can\'t I find certain Reels?',
        answer: 'There are a few possible reasons: (1) The account is private. (2) The Reel was deleted by the creator. (3) The username may be misspelled. Double-check the username and try again. InstaPSV only surfaces publicly available content.'
    },
];

export default function InstagramReelsDownloaderPage() {
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
        name: 'How to Download Instagram Reels for Free',
        description: 'Download Instagram Reels from any public account in HD quality using InstaPSV — no login or watermark.',
        step: [
            {
                '@type': 'HowToStep',
                position: 1,
                name: 'Enter the Creator\'s Username',
                text: 'Type the Instagram handle of the public account whose Reels you want to watch or download into the search field above.',
            },
            {
                '@type': 'HowToStep',
                position: 2,
                name: 'Browse Their Reels',
                text: 'InstaPSV will load the full Reels catalog from that profile. Browse the video thumbnails and click to play any Reel in our private player.',
            },
            {
                '@type': 'HowToStep',
                position: 3,
                name: 'Download in HD (Pro)',
                text: 'Click the download icon on any Reel. The original HD video file will be saved directly to your device — no watermark added, no Instagram account needed.',
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
                        <h1 className={styles.title}>Instagram Reels Viewer & Downloader</h1>
                        <p className={styles.subtitle}>
                            Watch and download Instagram Reels from any public account in HD quality — no login, no watermark, completely free and anonymous.
                        </p>
                    </header>

                    <div className={styles.searchSection}>
                        <InstagramSearch placeholder="Enter username to view reels..." restrictedTo="REELS" />
                    </div>

                    <section className={styles.content}>
                        <h2>Download Instagram Reels Free — No Login, No Watermark</h2>
                        <p>
                            Instagram doesn't offer a native way to download Reels directly to your device. InstaPSV fills this gap.
                            Enter any public creator's username to instantly browse their full Reels catalog.
                            Watch any Reel privately through our anonymous player, or download it in original HD quality with one click — no watermark, no Instagram account required, and completely free.
                        </p>

                        <h2>What Makes InstaPSV Reels Downloader Stand Out</h2>
                        <ul>
                            <li><strong>No Watermark:</strong> Downloaded Reels are the original, unmodified file — exactly as the creator uploaded them.</li>
                            <li><strong>HD Quality:</strong> Videos download at their original resolution, typically 1080p.</li>
                            <li><strong>No Login Required:</strong> No Instagram account, no email, no sign-up. Just enter a username.</li>
                            <li><strong>Anonymous Viewing:</strong> Watch Reels without notifying the creator or leaving any digital trace.</li>
                            <li><strong>No Auto-Play Tracking:</strong> Control when you play or pause without platform algorithms watching your behavior.</li>
                            <li><strong>Works on All Devices:</strong> Download on iPhone, Android, Windows, or Mac — no app needed.</li>
                        </ul>

                        <h2>How to Watch Instagram Reels Anonymously</h2>
                        <p>
                            Enter a creator's Instagram username in the search field above. Our system retrieves their complete Reels catalog from their public profile.
                            You can scroll through thumbnails, click to play any video in full quality, and read the captions — all without Instagram ever knowing you were there.
                            Your watch history is never recorded or shared.
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
