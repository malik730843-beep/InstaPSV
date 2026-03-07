import { getTranslations } from 'next-intl/server';
import styles from './ContentSection.module.css';

export default async function ContentSection() {
    const t = await getTranslations('homepageContent');

    const benefits = t.raw('benefits.list') as string[];

    return (
        <section className={styles.contentSection}>
            <div className={styles.container}>
                <h2 className={styles.mainTitle}>{t('title')}</h2>

                <div className={styles.grid}>
                    {/* Intro */}
                    <div className={styles.block}>
                        <h3>{t('intro.title')}</h3>
                        <p>{t('intro.p1')}</p>
                        <p>{t('intro.p2')}</p>
                    </div>

                    {/* Benefits */}
                    <div className={styles.block}>
                        <h3>{t('benefits.title')}</h3>
                        <p>{t('benefits.p1')}</p>
                        <ul className={styles.benefitsList}>
                            {benefits.map((benefit, index) => (
                                <li key={index} className={styles.benefitItem}>
                                    <span className={styles.check}>✓</span>
                                    {benefit}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Guide */}
                    <div className={styles.block}>
                        <h3>{t('guide.title')}</h3>
                        <p>{t('guide.p1')}</p>
                        <p>{t('guide.p2')}</p>
                    </div>

                    {/* Safety */}
                    <div className={styles.block}>
                        <h3>{t('safety.title')}</h3>
                        <p>{t('safety.p1')}</p>
                        <p>{t('safety.p2')}</p>
                    </div>

                    {/* Comparison */}
                    <div className={styles.block}>
                        <h3>{t('comparison.title')}</h3>
                        <p>{t('comparison.p1')}</p>
                        <p>{t('comparison.p2')}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
