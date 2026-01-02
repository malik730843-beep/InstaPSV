'use client';

import { useState, useEffect } from 'react';
import styles from './LanguageSwitcher.module.css';

const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
    { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
    { code: 'no', name: 'Norsk', flag: '🇳🇴' },
    { code: 'da', name: 'Dansk', flag: '🇩🇰' },
];

export default function LanguageSwitcher() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState(languages[0]);

    useEffect(() => {
        // Get saved language from cookie
        const savedLang = document.cookie
            .split('; ')
            .find((row) => row.startsWith('NEXT_LOCALE='))
            ?.split('=')[1];

        if (savedLang) {
            const lang = languages.find((l) => l.code === savedLang);
            if (lang) setCurrentLang(lang);
        }
    }, []);

    const handleLanguageChange = (lang: typeof languages[0]) => {
        setCurrentLang(lang);
        setIsOpen(false);

        // Save to cookie (expires in 1 year)
        const date = new Date();
        date.setTime(date.getTime() + (60 * 60 * 24 * 365 * 1000));
        document.cookie = `NEXT_LOCALE=${lang.code}; path=/; expires=${date.toUTCString()}`;

        // Reload page to apply new language
        window.location.reload();
    };

    return (
        <div className={styles.wrapper}>
            <button
                className={styles.trigger}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Select language"
            >
                <svg
                    className={styles.globeIcon}
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
            </button>

            {isOpen && (
                <div className={styles.dropdown}>
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            className={`${styles.option} ${lang.code === currentLang.code ? styles.active : ''}`}
                            onClick={() => handleLanguageChange(lang)}
                        >
                            <span className={styles.flag}>{lang.flag}</span>
                            <span className={styles.name}>{lang.name}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
