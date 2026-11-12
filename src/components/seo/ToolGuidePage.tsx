import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import InstagramSearch from '@/components/instagram/InstagramSearch';
import { toolGuides, type ToolGuide } from '@/lib/toolGuides';
import styles from './ToolGuidePage.module.css';

export function guideMetadata(guide: ToolGuide): Metadata {
    return {
        title: guide.title,
        description: guide.description,
        alternates: { canonical: `/${guide.slug}` },
        // Restore indexing when full collection retrieval is implemented and verified.
        ...(guide.tab === 'HIGHLIGHTS' ? { robots: { index: false, follow: true } } : {}),
        openGraph: { title: guide.title, description: guide.description, url: `/${guide.slug}`, type: 'website' },
        twitter: { card: 'summary_large_image', title: guide.title, description: guide.description },
    };
}

export default function ToolGuidePage({ guide }: { guide: ToolGuide }) {
    return <>
        <Header alwaysDark />
        <main className={styles.main} lang="en">
            <article>
                <nav aria-label="Breadcrumb"><Link href="/">Home</Link> / {guide.title}</nav>
                <header className={styles.header}>
                    <p className={styles.eyebrow}>InstaPSV · Tool and usage guide</p>
                    <h1>{guide.title}</h1>
                    <p>{guide.description}</p>
                </header>
                <aside className={styles.notice} aria-label="Feature availability">
                    <strong>Before you search</strong><p>{guide.availability}</p>
                    <Link href="/pricing">Plan details</Link> · <Link href="/contact">Ask about availability</Link>
                </aside>
                {guide.tab !== 'HIGHLIGHTS' && <section aria-label="Profile search" className={styles.search}>
                    <InstagramSearch restrictedTo={guide.tab} />
                </section>}
                <nav className={styles.contents} aria-label="On this page">
                    <strong>On this page</strong>
                    <ul>{guide.sections.map((s, i) => <li key={s.heading}><a href={`#guide-${i}`}>{s.heading}</a></li>)}</ul>
                </nav>
                {guide.sections.map((s, i) => <section className={styles.section} key={s.heading} id={`guide-${i}`}>
                    <h2>{s.heading}</h2>
                    {s.paragraphs.map(p => <p key={p}>{p}</p>)}
                    {s.items && <ul>{s.items.map(item => <li key={item}>{item}</li>)}</ul>}
                </section>)}
                <section className={styles.section}>
                    <h2>Common questions</h2>
                    {guide.faqs.map(f => <div key={f.question}><h3>{f.question}</h3><p>{f.answer}</p></div>)}
                </section>
                <aside className={styles.notice}>
                    <strong>About this guide</strong>
                    <p>Updated November 12, 2026 to describe the current InstaPSV interface and integration. Provider coverage can change. Found a mismatch? <Link href="/contact">Report it</Link> with the page URL and the behavior you observed. <Link href="/editorial-policy">How we maintain our guides</Link>.</p>
                    <p>InstaPSV is an independent service, unaffiliated with Instagram or Meta. <Link href="/privacy-policy">Privacy policy</Link> · <Link href="/terms-of-use">Terms of use</Link></p>
                </aside>
                <section className={styles.section}>
                    <h2>Related tools</h2>
                    <ul>{toolGuides.filter(g => g.slug !== guide.slug).map(g => <li key={g.slug}><Link href={`/${g.slug}`}>{g.title}</Link></li>)}</ul>
                </section>
            </article>
        </main>
        <Footer />
    </>;
}
