import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import Features from '@/components/sections/Features';
import HowItWorks from '@/components/sections/HowItWorks';

import FAQ from '@/components/sections/FAQ';
import CTASection from '@/components/sections/CTASection';
import FeatureSuggestion from '@/components/sections/FeatureSuggestion';
import FAQSchema from '@/components/seo/FAQSchema';
import AdUnit from '@/components/ads/AdUnit';
import HorizontalBannerAd from '@/components/ads/HorizontalBannerAd';
import dynamic from 'next/dynamic';

const Testimonials = dynamic(() => import('@/components/sections/Testimonials'), {
  ssr: true, // Keep SSR for SEO as requested
});

export default function Home() {
  return (
    <>
      <FAQSchema />
      <Header />
      <main>
        {/* Hero Section - Ads integrated inside */}
        <Hero />

        {/* Ad after Hero - New 728x90 Script */}
        <HorizontalBannerAd />

        <Features />

        {/* Ad after Features - New 728x90 Script */}
        <HorizontalBannerAd />

        <HowItWorks />

        {/* Ad after HowItWorks - New 728x90 Script */}
        <HorizontalBannerAd />

        <FAQ />

        {/* Ad after FAQ - New 728x90 Script */}
        <HorizontalBannerAd />

        <CTASection />

        {/* Ad after CTA - New 728x90 Script */}
        <HorizontalBannerAd />

        <Testimonials />

        {/* Ad after Testimonials - New 728x90 Script */}
        <HorizontalBannerAd />

        <FeatureSuggestion />
      </main>
      <Footer />
    </>
  );
}
