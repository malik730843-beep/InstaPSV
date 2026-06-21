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
    title: 'Anonymous Instagram Viewer — Browse Profiles & Posts Secretly | InstaPSV',
    description: 'View any public Instagram profile anonymously. Browse posts, followers, following lists, bio, and profile picture in HD. Free Instagram viewer — no login required.',
    keywords: 'anonymous instagram viewer, browse instagram secretly, view instagram profile, ig profile viewer, view posts anonymously',
    openGraph: {
        title: 'Anonymous Instagram Viewer — Browse Profiles & Posts Secretly | InstaPSV',
        description: 'View any public Instagram profile anonymously. Browse posts, followers, and profile picture in HD. No login needed.',
        url: `${BASE_URL}/anonymous-instagram-viewer`,
        type: 'website',
    },
};

export default function AnonymousInstagramViewerPage() {
    return (
        <div className={styles.container}>
            <Header alwaysDark />
            <main className={styles.main}>
                <article className={styles.article}>
                    <header className={styles.header}>
                        <h1 className={styles.title}>Anonymous IG Profile & Post Viewer</h1>
                        <p className={styles.subtitle}>
                            Access the full Instagram feed layout privately. 
                            View high-resolution photos and carousels without notifying the user.
                        </p>
                    </header>

                    <div className={styles.searchSection}>
                        <InstagramSearch placeholder="Enter username to browse profile..." restrictedTo="POSTS" />
                    </div>

                    <section className={styles.content}>
                        <h2>Browse Instagram Profiles Secretly</h2>
                        <p>
                            InstaPSV allows you to explore any public Instagram account without an active session. 
                            This means you don't need to log in, and you will never accidentally like a post or trigger sugestions on the platform. 
                            You can privately browse profiles, view bios, check follower metrics, and view full post layouts.
                        </p>

                        <h2>Key Viewing Benefits</h2>
                        <ul>
                            <li><strong>Full Profile Layout:</strong> Access bios, followers, following counts, and post grids.</li>
                            <li><strong>HD Photos & Carousels:</strong> View images and carousel albums in full resolution.</li>
                            <li><strong>No SUGGESTIONS Triggered:</strong> Prevent Instagram from linking your search activity to suggested accounts.</li>
                            <li><strong>Completely Private:</strong> Our secure gateway ensures your IP and account are never exposed.</li>
                        </ul>

                        <h2>Easy Professional Research</h2>
                        <p>
                            Ideal for market research, influencer sourcing, and private competitor analysis. 
                            Simply type the target account's username in the search input above, and view their active feed in seconds.
                        </p>
                    </section>
                </article>
            </main>
            <Footer />
        </div>
    );
}
