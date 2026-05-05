
import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HashtagGeneratorContent from './HashtagGeneratorContent';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://instapsv.com';

export const metadata: Metadata = {
    title: 'Instagram Hashtag Generator: Top Trending Hashtags 100% Free',
    description: 'Boost your reach with our free Instagram Hashtag Generator. Discover trending, relevant hashtags for travel, fitness, tech, and more. 100% shadowban safe.',
    keywords: 'instagram hashtag generator, trending hashtags, hashtag finder, free hashtag tool, ig reach boost',

    openGraph: {
        title: 'Instagram Hashtag Generator: Trending & Relevant',
        description: 'Skyrocket your engagement with curated hashtag lists. Effortless discovery, one-click copy, and categorized for your niche.',
        url: `${BASE_URL}/instagram-hashtag-generator`,
        type: 'website',
    },
};

export default function HashtagGeneratorPage() {
    return (
        <HashtagGeneratorContent 
            header={<Header alwaysDark />}
            footer={<Footer />}
        />
    );
}
