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
    title: 'Instagram Reels Viewer & Downloader — View Reels | InstaPSV',
    description: 'Play and download Instagram Reels in HD from any public account. View reels privately without auto-playing or tracking. Free reels downloader — no login needed.',
    keywords: 'instagram reels downloader, view instagram reels, download instagram reels, ig reels downloader, watch reels anonymously',
    openGraph: {
        title: 'Instagram Reels Viewer & Downloader — View Reels | InstaPSV',
        description: 'Play and download Instagram Reels in HD from any public account. View reels privately without tracking. No login needed.',
        url: `${BASE_URL}/instagram-reels-downloader`,
        type: 'website',
    },
};

export default function InstagramReelsDownloaderPage() {
    return (
        <div className={styles.container}>
            <Header alwaysDark />
            <main className={styles.main}>
                <article className={styles.article}>
                    <header className={styles.header}>
                        <h1 className={styles.title}>Instagram Reels Viewer & Downloader</h1>
                        <p className={styles.subtitle}>
                            Play and download Instagram Reels in HD from any public account, 
                            without auto-playing or tracking your activity.
                        </p>
                    </header>

                    <div className={styles.searchSection}>
                        <InstagramSearch placeholder="Enter username to view reels..." restrictedTo="REELS" />
                    </div>

                    <section className={styles.content}>
                        <h2>Watch Instagram Reels Privately</h2>
                        <p>
                            Instagram Reels are short-form video clips that have become highly popular. 
                            InstaPSV allows you to stream public Reels anonymously. 
                            You do not need to register an account or be signed in, ensuring your viewing choices remain entirely private and off Instagram's databases.
                        </p>

                        <h2>Key Reels Features</h2>
                        <ul>
                            <li><strong>Private Playback:</strong> Stream video clips privately in our video player interface.</li>
                            <li><strong>High Definition Quality:</strong> Watch video playbacks in crisp high resolution.</li>
                            <li><strong>No Auto-Play Pressure:</strong> Control when the video plays or pauses without platform tracking algorithms.</li>
                            <li><strong>Secure Experience:</strong> Your searches and activities are never tracked, logged, or shared.</li>
                        </ul>

                        <h2>How to Search and Watch</h2>
                        <p>
                            Simply enter the Instagram username of the creator whose reels you want to view, and submit. 
                            Our parser will retrieve their reels catalog, enabling you to watch clips and read video captions safely.
                        </p>
                    </section>
                </article>
            </main>
            <Footer />
        </div>
    );
}
