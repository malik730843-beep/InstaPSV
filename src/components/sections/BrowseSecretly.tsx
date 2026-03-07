import { getTranslations } from 'next-intl/server';
import styles from './BrowseSecretly.module.css';
import Link from 'next/link';

export default async function BrowseSecretly() {
    const t = await getTranslations('browseSecretly');
    const items = t.raw('items') as Array<{ title: string; description: string }>;

    const icons = [
        // Story Viewer Icon
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>,
        // Highlights Viewer Icon
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.72-8.72 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>,
        // Profile & Post Grid Icon
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
        // Reels Video Player Icon
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
    ];

    const iconClasses = [styles.icon1, styles.icon2, styles.icon3, styles.icon4];

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.textContent}>
                    <h2 className={styles.title}>{t('title')}</h2>
                    <p className={styles.description}>{t('description')}</p>
                    <Link href="/#search" className={styles.cta}>
                        {t('cta')} <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </Link>
                </div>

                <div className={styles.grid}>
                    {items.map((item, index) => (
                        <div key={index} className={styles.card}>
                            <div className={`${styles.iconWrapper} ${iconClasses[index]}`}>
                                {icons[index]}
                            </div>
                            <h3 className={styles.itemTitle}>{item.title}</h3>
                            <p className={styles.itemDesc}>{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
