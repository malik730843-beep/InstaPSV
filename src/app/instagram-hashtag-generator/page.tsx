import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HashtagGeneratorContent from './HashtagGeneratorContent';
export const metadata: Metadata = {
    title: 'Instagram Hashtag Ideas by Category',
    description: 'Pick and copy relevant hashtag ideas from a local category list. Suggestions are not live trends, popularity measurements or a guarantee of reach.',
    alternates: { canonical: '/instagram-hashtag-generator' },
    openGraph: { title: 'Instagram Hashtag Ideas by Category', description: 'Browse category-based hashtag suggestions and select the ones that fit your post.', url: '/instagram-hashtag-generator' },
    twitter: { card: 'summary_large_image', title: 'Instagram Hashtag Ideas by Category', description: 'Pick relevant ideas from a local category list. No live trend measurements.' },
};
export default function HashtagGeneratorPage() {
    return <HashtagGeneratorContent header={<Header alwaysDark />} footer={<Footer />} />;
}
