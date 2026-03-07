'use client';

import Link from 'next/link';
import InstagramSearch from '@/components/instagram/InstagramSearch';
import styles from './ToolLandingPage.module.css';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';

const ParticleBackground = dynamic(() => import('../ui/ParticleBackground'), {
    ssr: false,
});

interface FAQ {
    question: string;
    answer: string;
}

interface Step {
    title: string;
    description: string;
}

interface RelatedTool {
    href: string;
    label: string;
}

interface ComparisonGrid {
    title: string;
    left: {
        title: string;
        items: Array<{ title: string; text: string }>;
    };
    right: {
        title: string;
        items: Array<{ title: string; text: string }>;
    };
}

interface ComparisonTable {
    title: string;
    headers: string[];
    rows: Array<{
        feature: string;
        values: string[]; // Standard app, Other sites, InstaPSV
    }>;
}

interface ToolLandingPageProps {
    badge: string;
    h1: string;
    h1Highlight: string;
    subtitle: string;
    ctaText?: string;
    contentBlocks: Array<{
        heading: string;
        body: string;
        list?: string[];
    }>;
    steps: Step[];
    faqs: FAQ[];
    relatedTools: RelatedTool[];
    schemaName: string;
    schemaDescription: string;
    comparisonGrid?: ComparisonGrid;
    comparisonTable?: ComparisonTable;
    header?: React.ReactNode;
    footer?: React.ReactNode;
}

export default function ToolLandingPage({
    badge,
    h1,
    h1Highlight,
    subtitle,
    ctaText = "Start My Anonymous Search Now",
    contentBlocks,
    steps,
    faqs,
    relatedTools,
    schemaName,
    schemaDescription,
    comparisonGrid,
    comparisonTable,
    header,
    footer,
}: ToolLandingPageProps) {
    const t = useTranslations('hero');
    const scrollToSearch = () => {
        const searchSection = document.getElementById('search-tool');
        if (searchSection) {
            searchSection.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                const input = searchSection.querySelector('input');
                if (input) input.focus();
            }, 600);
        }
    };

    return (
        <div className={styles.landing}>
            {/* FAQPage Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": faqs.map((faq) => ({
                            "@type": "Question",
                            "name": faq.question,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": faq.answer,
                            },
                        })),
                    }),
                }}
            />
            {/* WebApplication Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebApplication",
                        "name": schemaName,
                        "description": schemaDescription,
                        "applicationCategory": "BrowserApplication",
                        "operatingSystem": "Any",
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "USD",
                        },
                    }),
                }}
            />
            {/* BreadcrumbList Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            {
                                "@type": "ListItem",
                                "position": 1,
                                "name": "Home",
                                "item": process.env.NEXT_PUBLIC_SITE_URL || "https://instapsv.com",
                            },
                            {
                                "@type": "ListItem",
                                "position": 2,
                                "name": schemaName,
                                "item": typeof window !== 'undefined' ? window.location.href : `${process.env.NEXT_PUBLIC_SITE_URL || 'https://instapsv.com'}${schemaName.toLowerCase().replace(/ /g, '-')}`
                            },
                        ],
                    }),
                }}
            />
            {/* HowTo Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "HowTo",
                        "name": `How to use ${schemaName}`,
                        "description": schemaDescription,
                        "step": steps.map((step, i) => ({
                            "@type": "HowToStep",
                            "position": i + 1,
                            "name": step.title,
                            "itemListElement": [{
                                "@type": "HowToDirection",
                                "text": step.description
                            }]
                        }))
                    }),
                }}
            />

            {header}

            <main>
                {/* Hero */}
                <section className={styles.hero}>
                    {/* Particle Background */}
                    <ParticleBackground className={styles.particles} />

                    {/* Floating Elements */}
                    <div className={styles.floatingElements}>
                        <div className={`${styles.floatingOrb} ${styles.orb1}`} />
                        <div className={`${styles.floatingOrb} ${styles.orb2}`} />
                        <div className={`${styles.floatingOrb} ${styles.orb3}`} />
                    </div>

                    <div className={styles.container}>
                        <span className={styles.badge}>
                            <svg className={styles.badgeIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                                <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
                            </svg>
                            {badge}
                        </span>
                        <h1 className={styles.title}>
                            {h1} <span className={styles.highlight}>{h1Highlight}</span>
                        </h1>
                        <p className={styles.subtitle}>{subtitle}</p>
                    </div>
                </section>

                {/* Search Tool */}
                {/* Search Tool */}
                <section className={styles.searchSection} id="search-tool">
                    <div className={styles.searchWrapper}>
                        <InstagramSearch />
                    </div>

                    {/* Anonymity Level Check Section */}
                    <div className={styles.anonymityCheck}>
                        <h2 className={styles.anonymityTitle}>{t('anonymityCheck.title')}</h2>

                        <div className={styles.statusCard}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardTitle}>
                                    <svg className={styles.cardIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                        <line x1="12" y1="9" x2="12" y2="13"></line>
                                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                    </svg>
                                    {t('anonymityCheck.standardLogin.title')}
                                </div>
                                <div className={`${styles.cardBadge} ${styles.standardBadge}`}>
                                    {t('anonymityCheck.standardLogin.percentage')}
                                </div>
                            </div>
                            <div className={styles.progressBar}>
                                <div className={`${styles.progressFill} ${styles.standardFill}`} />
                            </div>
                            <p className={styles.cardDescription}>
                                {t('anonymityCheck.standardLogin.description')}
                            </p>
                        </div>

                        <div className={`${styles.statusCard} ${styles.safeCard}`}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardTitle}>
                                    <svg className={styles.cardIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                        <polyline points="9 11 11 13 15 9"></polyline>
                                    </svg>
                                    {t('anonymityCheck.safeMode.title')}
                                </div>
                                <div className={`${styles.cardBadge} ${styles.safeBadge}`}>
                                    {t('anonymityCheck.safeMode.percentage')}
                                </div>
                            </div>
                            <div className={styles.progressBar}>
                                <div className={`${styles.progressFill} ${styles.safeFill}`} />
                            </div>
                            <div className={styles.pointsList}>
                                <div className={styles.pointItem}>
                                    <svg className={styles.checkIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                    {t('anonymityCheck.safeMode.point1')}
                                </div>
                                <div className={styles.pointItem}>
                                    <svg className={styles.checkIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                    {t('anonymityCheck.safeMode.point2')}
                                </div>
                                <div className={styles.pointItem}>
                                    <svg className={styles.checkIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                    {t('anonymityCheck.safeMode.point3')}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How To Steps */}
                <section className={styles.stepsSection}>
                    <div className={styles.container}>
                        <h2 className={styles.stepsTitle}>
                            3 Simple Steps to <span className={styles.highlight}>Browse Instagram</span> Without Being Seen
                        </h2>
                        <div className={styles.stepsGrid}>
                            {steps.map((step, i) => (
                                <div key={i} className={styles.stepCard}>
                                    <div className={styles.stepNumber}>{i + 1}</div>
                                    <h3>{step.title}</h3>
                                    <p>{step.description}</p>
                                </div>
                            ))}
                        </div>
                        <div className={styles.ctaWrapper}>
                            <button onClick={scrollToSearch} className={styles.ctaButton}>
                                {ctaText}
                            </button>
                        </div>
                    </div>
                </section>

                {/* Comparison Grid (Security) */}
                {comparisonGrid && (
                    <section className={styles.comparisonGridSection}>
                        <div className={styles.container}>
                            <h2 className={styles.sectionTitle}>{comparisonGrid.title}</h2>
                            <div className={styles.compGrid}>
                                <div className={styles.compColumn}>
                                    <h3 className={styles.compHeadingRed}>{comparisonGrid.left.title}</h3>
                                    <div className={styles.compList}>
                                        {comparisonGrid.left.items.map((item, i) => (
                                            <div key={i} className={styles.compItem}>
                                                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                                        <line x1="12" y1="9" x2="12" y2="13"></line>
                                                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                                    </svg>
                                                    {item.title}
                                                </h4>
                                                <p>{item.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className={styles.compColumn}>
                                    <h3 className={styles.compHeadingGreen}>{comparisonGrid.right.title}</h3>
                                    <div className={styles.compList}>
                                        {comparisonGrid.right.items.map((item, i) => (
                                            <div key={i} className={styles.compItem}>
                                                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00ffca" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                                        <polyline points="9 11 11 13 15 9"></polyline>
                                                    </svg>
                                                    {item.title}
                                                </h4>
                                                <p>{item.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.ctaWrapper}>
                                <button onClick={scrollToSearch} className={styles.ctaButton}>
                                    Protect My Privacy & Start Searching
                                </button>
                            </div>
                        </div>
                    </section>
                )}

                {/* Content Blocks */}
                <section className={styles.contentSection}>
                    <div className={styles.container}>
                        <div className={styles.contentGrid}>
                            {contentBlocks.map((block, i) => (
                                <div key={i} className={styles.contentBlock}>
                                    <h2>{block.heading}</h2>
                                    <p>{block.body}</p>
                                    {block.list && (
                                        <ul>
                                            {block.list.map((item, j) => (
                                                <li key={j}>{item}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Comparison Table */}
                {comparisonTable && (
                    <section className={styles.comparisonTableSection}>
                        <div className={styles.container}>
                            <h2 className={styles.sectionTitle}>{comparisonTable.title}</h2>
                            <div className={styles.tableWrapper}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            {comparisonTable.headers.map((h, i) => (
                                                <th key={i}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {comparisonTable.rows.map((row, i) => (
                                            <tr key={i}>
                                                <td className={styles.featureName}>{row.feature}</td>
                                                {row.values.map((v, j) => (
                                                    <td key={j} className={j === row.values.length - 1 ? styles.highlightCell : ''}>
                                                        {v === 'Yes' ? (
                                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981' }}>
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                                </svg>
                                                                Yes
                                                            </span>
                                                        ) : v === 'No' ? (
                                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444' }}>
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                                                </svg>
                                                                No
                                                            </span>
                                                        ) : v}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>
                )}

                {/* FAQ */}
                <section className={styles.faqSection}>
                    <div className={styles.container}>
                        <h2 className={styles.faqTitle}>
                            Frequently Asked <span className={styles.highlight}>Questions</span>
                        </h2>
                        <div className={styles.faqList}>
                            {faqs.map((faq, i) => (
                                <div key={i} className={styles.faqItem}>
                                    <h3>{faq.question}</h3>
                                    <p>{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Related Tools */}
                <section className={styles.relatedTools}>
                    <div className={styles.container}>
                        <h2 className={styles.relatedTitle}>
                            Explore More <span className={styles.highlight}>Tools</span>
                        </h2>
                        <div className={styles.toolsGrid}>
                            {relatedTools.map((tool, i) => (
                                <Link key={i} href={tool.href} className={styles.toolLink}>
                                    → {tool.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {footer}
        </div>
    );
}
