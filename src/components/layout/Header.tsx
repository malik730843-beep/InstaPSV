import Link from 'next/link';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import styles from './Header.module.css';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import HeaderShell from './HeaderShell';
import MobileMenu from './MobileMenu';

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface HeaderProps {
    alwaysDark?: boolean;
}

export default async function Header({ alwaysDark }: HeaderProps) {
    const t = await getTranslations('nav');

    // Fetch Logo
    let logoUrl = null;
    try {
        const { data } = await supabase
            .from('site_settings')
            .select('value')
            .eq('key', 'logo')
            .single();
        if (data) logoUrl = data.value;
    } catch (e) {
        // Ignore error, use default logo
    }

    const navLinks = [
        { href: '/', label: t('home') },
        { href: '/#features', label: t('features') },
        { href: '/blog', label: t('blog') },
        { href: '/about', label: t('about') },
    ];

    return (
        <HeaderShell alwaysDark={alwaysDark}>
            {/* Logo */}
            <Link href="/" className={styles.logo}>
                <Image
                    src="/logo.png"
                    alt="InstaPSV Logo"
                    width={150}
                    height={32}
                    className={styles.logoImage}
                    style={{ height: '32px', width: 'auto' }}
                    priority
                />
            </Link>

            {/* Desktop Navigation */}
            <nav className={styles.nav}>
                {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} className={styles.navLink}>
                        {link.label}
                    </Link>
                ))}
            </nav>

            {/* Actions */}
            <div className={styles.actions}>
                <LanguageSwitcher />
            </div>

            {/* Mobile Menu Island */}
            <MobileMenu links={navLinks} />
        </HeaderShell>
    );
}
