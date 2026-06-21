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
    title: 'Instagram Highlights Viewer & Downloader — View Highlights | InstaPSV',
    description: 'Browse and download saved Instagram highlights from public profiles in high definition. Access archived content securely and anonymously. No login required.',
    keywords: 'instagram highlights viewer, view instagram highlights, download instagram highlights, ig highlights viewer, anonymous highlights downloader',
    openGraph: {
        title: 'Instagram Highlights Viewer & Downloader — View Highlights | InstaPSV',
        description: 'Browse and download saved Instagram highlights from public profiles in high definition. Access archived content securely and anonymously.',
        url: `${BASE_URL}/instagram-highlights-viewer`,
        type: 'website',
    },
};

export default function InstagramHighlightsViewerPage() {
    return (
        <div className={styles.container}>
            <Header alwaysDark />
            <main className={styles.main}>
                <article className={styles.article}>
                    <header className={styles.header}>
                        <h1 className={styles.title}>Instagram Highlights Viewer & Downloader</h1>
                        <p className={styles.subtitle}>
                            Browse and download saved Instagram highlights from public profiles in high definition. 
                            Access archived content securely and anonymously.
                        </p>
                    </header>

                    <div className={styles.searchSection}>
                        <InstagramSearch placeholder="Enter username to view highlights..." restrictedTo="HIGHLIGHTS" />
                    </div>

                    <section className={styles.content}>
                        <h2>Browse Instagram Highlights Privately</h2>
                        <p>
                            Instagram Highlights allow users to group and pin their past stories permanently onto their profile. 
                            With InstaPSV's Highlights Viewer, you can browse these pinned stories without notifying the profile owner. 
                            Our service operates as an anonymous gateway, loading highlights directly without registering any view metrics on Instagram's backend.
                        </p>

                        <h2>Premium Highlights Functionality</h2>
                        <ul>
                            <li><strong>View Archived Stories:</strong> Access older stories that have been pinned on the profile.</li>
                            <li><strong>HD Quality:</strong> Enjoy full-resolution images and high-fidelity video playbacks.</li>
                            <li><strong>Private Access:</strong> Read titles and browse highlights folders secretly in ghost mode.</li>
                            <li><strong>No Accounts Required:</strong> Works entirely in the browser without any login prompts.</li>
                        </ul>

                        <h2>How it Works</h2>
                        <p>
                            Input the target Instagram handle into the search box above. Once search completes, you will see a list of highlights categories. 
                            Clicking any category will display the stories grouped inside it. Pro users can also download individual items directly to their device.
                        </p>
                    </section>
                </article>
            </main>
            <Footer />
        </div>
    );
}
