import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import styles from '@/components/seo/ToolGuidePage.module.css';

export const metadata: Metadata = {
    title: 'How We Maintain Our Guides',
    description: 'How InstaPSV explains product limitations, labels examples, revises articles and handles correction requests.',
    alternates: { canonical: '/editorial-policy' },
};

export default function EditorialPolicy() {
    return <><Header alwaysDark /><main className={styles.main} lang="en">
        <header className={styles.header}><h1>How we maintain our guides</h1><p>Our guides help visitors decide what a tool can do and complete a specific task. A tool description should match its current behavior.</p></header>
        <section className={styles.section}><h2>Product descriptions</h2><p>We distinguish interface access from source coverage. A paid control does not guarantee that the provider can return a particular account or media type. Guides describe search inputs, returned data, caching, plan gates and known missing features.</p><p>The current guides are based on the site’s implementation. Rendering a page successfully does not prove that every provider request succeeds. We state known limitations instead of inventing success rates or anonymity scores.</p></section>
        <section className={styles.section}><h2>Examples and evidence</h2><p>Worked examples and worksheets illustrate a process. Fictional accounts, time budgets and quote calculations are labeled as examples; they are not customer case studies, market rates or research findings.</p><p>This revision was prepared with automated assistance and checked against the site’s implementation. Provider coverage still requires live confirmation; these guides do not claim independent performance testing.</p><p>We separate observed information from interpretation. A public follower count cannot establish sales, audience quality or future performance. We do not present a small returned media sample as a complete publication history.</p></section>
        <section className={styles.section}><h2>Corrections and updates</h2><p>Use <Link href="/contact">Contact</Link> to send the page URL, the statement in question and evidence of the mismatch. Include the time and error message for a tool problem. Never send passwords or private account material.</p><p>Substantive article revisions carry a revision date. We preserve existing article URLs when correcting their content. Dates are not changed merely to make an unchanged article look new.</p></section>
        <section className={styles.section}><h2>Media and commercial context</h2><p>InstaPSV offers free search credits and paid features. Those limits belong next to the relevant controls and on <Link href="/pricing">Pricing</Link>. Our guides should remain useful before a visitor purchases anything.</p><p>Third-party media belongs to its rights holders. A public URL or a download control is not a license to reuse it. InstaPSV is independent of Instagram and Meta.</p></section>
        <section className={styles.section}><h2>Start with a practical resource</h2><ul><li><Link href="/analyze-competitors-instagram-profiles-safely">Public profile research worksheet and example</Link></li><li><Link href="/instagram-story-viewer">Story availability and troubleshooting</Link></li><li><Link href="/instagram-reels-downloader">Video playback and download guide</Link></li></ul></section>
    </main><Footer /></>;
}
