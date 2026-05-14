import type { Metadata } from 'next';

// Prevent all admin pages from being indexed by search engines.
// The robots.ts already disallows /admin/ via robots.txt, but this
// ensures the meta robots tag is also set as a belt-and-suspenders measure.
export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
        googleBot: {
            index: false,
            follow: false,
        },
    },
    title: 'Admin — InstaPSV',
};
