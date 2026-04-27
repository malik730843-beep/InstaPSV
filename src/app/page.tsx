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
import AdsterraBanner from '@/components/ads/AdsterraBanner';
import dynamic from 'next/dynamic';

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
        <AdsterraBanner />
        
        <Features />
        <AdsterraBanner />
        
        <HowItWorks />
        <AdsterraBanner />
        
        <ComparisonTable />
        <AdsterraBanner />
        
        <UseCases />
        <AdsterraBanner />
        
        <FAQ />
        <AdsterraBanner />
        
        <Testimonials />
        <AdsterraBanner />
        
        <FeatureSuggestion />
      </main>
      <Footer />
    </>
  );
}
