import Link from 'next/link';
import styles from './Footer.module.css';
import AdUnit from '../ads/AdUnit';
import { getTranslations } from 'next-intl/server';

export default async function Footer() {
    const t = await getTranslations('footer');
    const navT = await getTranslations('nav');

    const footerLinks = {
        product: [
            { href: '/features', label: navT('features') },
            { href: '/highlights-viewer', label: navT('highlights') },
            { href: '/#how-it-works', label: navT('howItWorks') },
            { href: '/faq', label: navT('faq') },
        ],
        company: [
            { href: '/about', label: navT('about') },
            { href: '/blog', label: navT('blog') },
            { href: '/contact', label: navT('contact') },
        ],
        legal: [
            { href: '/privacy-policy', label: navT('privacy') },
            { href: '/terms-of-use', label: navT('terms') },
            { href: '/disclaimer', label: navT('disclaimer') },
        ],
    };

    return (
        <footer className={styles.footer}>
            <AdUnit slot="footer" style={{ marginBottom: '40px' }} />
            <div className={styles.container}>
                {/* Top Section */}
                <div className={styles.top}>
                    {/* Brand */}
                    <div className={styles.brand}>
                        <Link href="/" className={styles.logo}>
                            <img
                                src="/logo.png"
                                alt="InstaPSV Logo"
                                className={styles.logoImage}
                                style={{ height: '40px', width: 'auto' }}
                            />
                        </Link>
                        <p className={styles.brandDescription}>
                            {t('description')}
                        </p>
                    </div>

                    {/* Links */}
                    <div className={styles.linksContainer}>
                        <div className={styles.linkGroup}>
                            <h3 className={styles.linkGroupTitle}>{t('company')}</h3>
                            <ul className={styles.linkList}>
                                {footerLinks.company.map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href} className={styles.link} scroll={false}>
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className={styles.linkGroup}>
                            <h3 className={styles.linkGroupTitle}>{t('legal')}</h3>
                            <ul className={styles.linkList}>
                                {footerLinks.legal.map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href} className={styles.link} scroll={false}>
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className={styles.bottom}>
                    <p className={styles.copyright}>
                        {t('copyright', { year: new Date().getFullYear() })}
                    </p>
                    <p className={styles.disclaimer}>
                        {t('disclaimer')}
                    </p>
                </div>
            </div>
        </footer>
    );
}

