import Link from 'next/link';
import styles from './Footer.module.css';

const footerLinks = {
    product: [
        { href: '/features', label: 'Features' },
        { href: '/highlights-viewer', label: 'Highlights Viewer' },
        { href: '/#how-it-works', label: 'How It Works' },
        { href: '/faq', label: 'FAQ' },
    ],
    company: [
        { href: '/about', label: 'About Us' },
        { href: '/blog', label: 'Blog' },
        { href: '/contact', label: 'Contact' },
    ],
    legal: [
        { href: '/privacy', label: 'Privacy Policy' },
        { href: '/terms', label: 'Terms of Service' },
        { href: '/disclaimer', label: 'Disclaimer' },
        { href: '/cookies', label: 'Cookie Policy' },
    ],
};

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                {/* Top Section */}
                <div className={styles.top}>
                    {/* Brand */}
                    <div className={styles.brand}>
                        <Link href="/" className={styles.logo}>
                            <span className={styles.logoIcon}>
                                <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="32" height="32" rx="8" fill="url(#footerLogoGradient)" />
                                    <path d="M16 8C11.58 8 8 11.58 8 16C8 20.42 11.58 24 16 24C20.42 24 24 20.42 24 16C24 11.58 20.42 8 16 8ZM16 22C12.69 22 10 19.31 10 16C10 12.69 12.69 10 16 10C19.31 10 22 12.69 22 16C22 19.31 19.31 22 16 22Z" fill="white" />
                                    <circle cx="21" cy="11" r="1.5" fill="white" />
                                    <defs>
                                        <linearGradient id="footerLogoGradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#FF0080" />
                                            <stop offset="1" stopColor="#7928CA" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </span>
                            <span className={styles.logoText}>
                                Insta<span className={styles.logoHighlight}>PSV</span>
                            </span>
                        </Link>
                        <p className={styles.brandDescription}>
                            The best free Instagram viewer tool. View stories, profiles, and followers anonymously without login.
                        </p>
                    </div>

                    {/* Links */}
                    <div className={styles.linksContainer}>
                        <div className={styles.linkGroup}>
                            <h3 className={styles.linkGroupTitle}>Product</h3>
                            <ul className={styles.linkList}>
                                {footerLinks.product.map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href} className={styles.link}>
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className={styles.linkGroup}>
                            <h3 className={styles.linkGroupTitle}>Company</h3>
                            <ul className={styles.linkList}>
                                {footerLinks.company.map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href} className={styles.link}>
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className={styles.linkGroup}>
                            <h3 className={styles.linkGroupTitle}>Legal</h3>
                            <ul className={styles.linkList}>
                                {footerLinks.legal.map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href} className={styles.link}>
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
                        © {new Date().getFullYear()} InstaPSV. All rights reserved.
                    </p>
                    <p className={styles.disclaimer}>
                        Not affiliated with Instagram or Meta.
                    </p>
                </div>
            </div>
        </footer>
    );
}

