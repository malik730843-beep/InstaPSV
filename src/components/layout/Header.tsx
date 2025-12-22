'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import styles from './Header.module.css';
import LanguageSwitcher from '../ui/LanguageSwitcher';

export default function Header() {
    const t = useTranslations('nav');
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { href: '/', label: t('home') },
        { href: '/features', label: t('features') },
        { href: '/highlights-viewer', label: t('highlights') },
        { href: '/blog', label: t('blog') },
        { href: '/about', label: t('about') },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
            <div className={styles.container}>
                {/* Logo */}
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoIcon}>
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="32" height="32" rx="8" fill="url(#logoGradient)" />
                            <path d="M16 8C11.58 8 8 11.58 8 16C8 20.42 11.58 24 16 24C20.42 24 24 20.42 24 16C24 11.58 20.42 8 16 8ZM16 22C12.69 22 10 19.31 10 16C10 12.69 12.69 10 16 10C19.31 10 22 12.69 22 16C22 19.31 19.31 22 16 22Z" fill="white" />
                            <circle cx="21" cy="11" r="1.5" fill="white" />
                            <defs>
                                <linearGradient id="logoGradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
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

                {/* Desktop Navigation */}
                <nav className={styles.nav}>
                    {navLinks.map((link) => (
                        <Link key={link.href} href={link.href} className={styles.navLink}>
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Language Switcher */}
                <div className={styles.actions}>
                    <LanguageSwitcher />
                </div>

                {/* Mobile Menu Button */}
                <button
                    className={`${styles.mobileMenuBtn} ${isMobileMenuOpen ? styles.active : ''}`}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
                {/* Close Button */}
                <button
                    className={styles.closeBtn}
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="Close menu"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>

                <nav className={styles.mobileNav}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={styles.mobileNavLink}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}
