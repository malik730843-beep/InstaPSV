// IP-based Geolocation for Language Detection

interface GeoData {
    country: string;
    countryCode: string;
}

// Country to language mapping for high CPC countries
const countryToLanguage: Record<string, string> = {
    // English
    US: 'en', GB: 'en', AU: 'en', CA: 'en', IE: 'en', NZ: 'en',
    // German
    DE: 'de', AT: 'de', CH: 'de',
    // French
    FR: 'fr', BE: 'fr',
    // Spanish
    ES: 'es',
    // Italian
    IT: 'it',
    // Dutch
    NL: 'nl',
    // Swedish
    SE: 'sv',
    // Norwegian
    NO: 'no',
    // Danish
    DK: 'da',
};

export const supportedLocales = ['en', 'de', 'fr', 'es', 'it', 'nl', 'sv', 'no', 'da'] as const;
export type Locale = typeof supportedLocales[number];
export const defaultLocale: Locale = 'en';

// Get language from country code
export function getLanguageFromCountry(countryCode: string): Locale {
    const lang = countryToLanguage[countryCode.toUpperCase()];
    return (lang as Locale) || defaultLocale;
}

// Detect country from IP using free API
export async function detectCountryFromIP(): Promise<GeoData | null> {
    try {
        // Using ip-api.com (free, no API key required)
        const res = await fetch('http://ip-api.com/json/?fields=country,countryCode', {
            cache: 'no-store',
        });

        if (!res.ok) return null;

        const data = await res.json();
        return {
            country: data.country,
            countryCode: data.countryCode,
        };
    } catch (error) {
        console.error('Error detecting country:', error);
        return null;
    }
}

// Get preferred locale from country
export async function getLocaleFromIP(): Promise<Locale> {
    const geoData = await detectCountryFromIP();
    if (!geoData) return defaultLocale;
    return getLanguageFromCountry(geoData.countryCode);
}

// Validate locale
export function isValidLocale(locale: string): locale is Locale {
    return supportedLocales.includes(locale as Locale);
}
