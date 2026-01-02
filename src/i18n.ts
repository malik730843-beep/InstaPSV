import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import { defaultLocale, supportedLocales, isValidLocale, getLanguageFromCountry } from '@/lib/geolocation';

export default getRequestConfig(async () => {
    // 1. Check for locale cookie (user preference)
    const cookieStore = await cookies();
    const localeCookie = cookieStore.get('NEXT_LOCALE')?.value;

    if (localeCookie && isValidLocale(localeCookie)) {
        return {
            locale: localeCookie,
            messages: (await import(`./messages/${localeCookie}.json`)).default,
        };
    }

    // 2. Try to detect from Vercel geo headers (if deployed on Vercel)
    const headersList = await headers();
    const country = headersList.get('x-vercel-ip-country');

    if (country) {
        const detectedLocale = getLanguageFromCountry(country);
        return {
            locale: detectedLocale,
            messages: (await import(`./messages/${detectedLocale}.json`)).default,
        };
    }

    // 3. Check Accept-Language header
    const acceptLanguage = headersList.get('accept-language');
    if (acceptLanguage) {
        const browserLang = acceptLanguage.split(',')[0].split('-')[0].toLowerCase();
        if (isValidLocale(browserLang)) {
            return {
                locale: browserLang,
                messages: (await import(`./messages/${browserLang}.json`)).default,
            };
        }
    }

    // 4. Default to English
    return {
        locale: defaultLocale,
        messages: (await import(`./messages/${defaultLocale}.json`)).default,
    };
});
