import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import Features from '@/components/sections/Features';
import HowItWorks from '@/components/sections/HowItWorks';

import FAQ from '@/components/sections/FAQ';
import CTASection from '@/components/sections/CTASection';
import FeatureSuggestion from '@/components/sections/FeatureSuggestion';
import StealthBanner from '@/components/sections/StealthBanner';
import FAQSchema from '@/components/seo/FAQSchema';
import AdUnit from '@/components/ads/AdUnit';
import dynamic from 'next/dynamic';

const Testimonials = dynamic(() => import('@/components/sections/Testimonials'), {
  ssr: true, // Keep SSR for SEO as requested
});

// Ad wrapper for consistent styling
const AdSlot = ({ slot = 'header' }: { slot?: string }) => (
  <div style={{
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    borderRadius: '12px',
    marginTop: '20px',
    marginBottom: '20px'
  }}>
    <AdUnit slot={slot} />
  </div>
);

export default function Home() {
  return (
    <>
      <FAQSchema />
      <Header />
      <main>
        <Hero />

        {/* Ad after Hero */}
        <AdSlot slot="header" />

        <Features />

        {/* Ad after Features */}
        <AdSlot slot="sidebar" />

        <HowItWorks />

        {/* Ad after HowItWorks */}
        <AdSlot slot="header" />



        <FAQ />

        {/* Ad after FAQ */}
        <AdSlot slot="header" />

        <CTASection />

        {/* Ad after CTA */}
        <AdSlot slot="sidebar" />

        <Testimonials />

        {/* Ad after Testimonials */}
        <AdSlot slot="header" />

        <StealthBanner />

        <FeatureSuggestion />
      </main>
      <Footer />
    </>
  );
}
