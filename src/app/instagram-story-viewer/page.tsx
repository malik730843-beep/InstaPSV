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
    title: 'Anonymous Instagram Story Viewer — Watch Stories Secretly | InstaPSV',
    description: 'Watch public Instagram stories anonymously. Stay 100% hidden in ghost mode without leaving a digital footprint. Free story viewer — no login or account required.',
    keywords: 'instagram story viewer, anonymous instagram story viewer, watch instagram stories anonymously, ig story viewer, view instagram stories secretly',
    openGraph: {
        title: 'Anonymous Instagram Story Viewer — Watch Stories Secretly | InstaPSV',
        description: 'Watch public Instagram stories anonymously. Stay 100% hidden without leaving a trace. No login needed.',
        url: `${BASE_URL}/instagram-story-viewer`,
        type: 'website',
    },
};

export default function InstagramStoryViewerPage() {
    return (
        <div className={styles.container}>
            <Header alwaysDark />
            <main className={styles.main}>
                <article className={styles.article}>
                    <header className={styles.header}>
                        <h1 className={styles.title}>Anonymous Instagram Story Viewer</h1>
                        <p className={styles.subtitle}>
                            Watch active Instagram stories anonymously and stay 100% hidden. 
                            Experience total privacy without leaving a digital footprint.
                        </p>
                    </header>

                    <div className={styles.searchSection}>
                        <InstagramSearch placeholder="Enter username to view stories..." restrictedTo="STORIES" />
                    </div>

                    <section className={styles.content}>
                        <h2>Watch Instagram Stories Anonymously</h2>
                        <p>
                            InstaPSV is a free web-based tool that lets you watch public Instagram stories without exposing your identity. 
                            Whenever you view a story on Instagram directly, the account owner can see that you watched it in their viewer list. 
                            With InstaPSV, we act as a secure gateway, fetching the stories on your behalf so that your personal profile and IP address never interact with Instagram's servers.
                        </p>

                        <h2>Key Benefits of Anonymous Story Viewing</h2>
                        <ul>
                            <li><strong>Complete Anonymity:</strong> You will never appear on the owner's story viewer list. Your name is 100% hidden.</li>
                            <li><strong>No Account Required:</strong> Browse public stories freely without creating or logging into any Instagram profile.</li>
                            <li><strong>Device Compatibility:</strong> Works seamlessly on all mobile phones, tablets, laptops, and desktop computers.</li>
                            <li><strong>Zero Digital Trace:</strong> We never log your search history or personal information. Your privacy is fully protected.</li>
                        </ul>

                        <h2>How to Use the Anonymous Story Viewer</h2>
                        <p>
                            To start viewing stories, simply enter the target profile's username (e.g., @cristiano or just cristiano) in the search field above and click "View Profile". 
                            Our system will instantly load the active stories from the profile, letting you view images and watch videos privately in full HD quality.
                        </p>
                    </section>
                </article>
            </main>
            <Footer />
        </div>
    );
}
