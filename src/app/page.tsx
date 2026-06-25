import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import Features from '@/components/sections/Features';
import SecurityComparison from '@/components/sections/SecurityComparison';
import HowItWorks from '@/components/sections/HowItWorks';

import FAQ from '@/components/sections/FAQ';
import UseCases from '@/components/sections/UseCases';
import ComparisonTable from '@/components/sections/ComparisonTable';
import CTASection from '@/components/sections/CTASection';
import FeatureSuggestion from '@/components/sections/FeatureSuggestion';
import FAQSchema from '@/components/seo/FAQSchema';
import dynamic from 'next/dynamic';

export const metadata: Metadata = {
  title: 'InstaPSV — Anonymous Instagram Viewer | No Login Required',
  description: 'View Instagram stories, profiles, reels & highlights anonymously — no login, no account needed. 100% free, private, and works on any device. Try it now.',
  keywords: 'anonymous instagram viewer, instagram story viewer, view instagram stories anonymously, ig story viewer no login, instagram profile viewer, browse instagram without account',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'InstaPSV — Anonymous Instagram Viewer | No Login Required',
    description: 'View Instagram stories, profiles, reels & highlights anonymously. No login, no account. 100% free & private.',
    type: 'website',
    url: 'https://instapsv.com/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InstaPSV — Anonymous Instagram Viewer | No Login Required',
    description: 'View Instagram stories, profiles, reels & highlights anonymously. No login needed.',
  },
};

const Testimonials = dynamic(() => import('@/components/sections/Testimonials'), {
  ssr: true,
});

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
        
        <FAQ />
        
        <Testimonials />
        
        <FeatureSuggestion />
      </main>
      <Footer />
    </>
  );
}
