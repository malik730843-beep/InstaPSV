import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import ViewerGuide from '@/components/sections/ViewerGuide';
import SecurityComparison from '@/components/sections/SecurityComparison';
import Features from '@/components/sections/Features';
import HowItWorks from '@/components/sections/HowItWorks';
import ComparisonTable from '@/components/sections/ComparisonTable';
import UseCases from '@/components/sections/UseCases';
import FeatureSuggestion from '@/components/sections/FeatureSuggestion';

import FAQ from '@/components/sections/FAQ';
import FAQSchema from '@/components/seo/FAQSchema';

export const metadata: Metadata = {
  title: 'InstaPSV — Instagram Profile Viewer | No Login Required',
  description: 'Look up supported public Instagram Business and Creator profiles without an Instagram account. Browse returned posts, check story availability, and use the hashtag idea picker.',
  keywords: 'instagram profile viewer, instagram story viewer, public instagram viewer, instagram highlights viewer, instagram reels downloader, view instagram without login',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'InstaPSV — Instagram Profile Viewer | No Login Required',
    description: 'Look up supported public Instagram profiles and learn what each tool can return, including plan limits and provider coverage.',
    type: 'website',
    url: 'https://instapsv.com/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InstaPSV — Instagram Profile Viewer | No Login Required',
    description: 'Look up supported public profiles and read guides to credits, downloads and tool limitations.',
  },
};

export default function Home() {
  return (
    <>
      <FAQSchema />
      <Header />
      <main>
        <Hero />
        <SecurityComparison />
        <Features />
        <HowItWorks />
        <ComparisonTable />
        <UseCases />
        <ViewerGuide includeSectionAnchors={false} />
        <FAQ />
        <FeatureSuggestion />
      </main>
      <Footer />
    </>
  );
}
