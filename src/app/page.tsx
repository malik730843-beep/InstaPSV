import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import Features from '@/components/sections/Features';
import HowItWorks from '@/components/sections/HowItWorks';
import BlogPreview from '@/components/sections/BlogPreview';
import FAQ from '@/components/sections/FAQ';
import Testimonials from '@/components/sections/Testimonials';
import CTASection from '@/components/sections/CTASection';
import FeatureSuggestion from '@/components/sections/FeatureSuggestion';
import FAQSchema from '@/components/seo/FAQSchema';

export default function Home() {
  return (
    <>
      <FAQSchema />
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <BlogPreview />
        <FAQ />
        <CTASection />
        <Testimonials />
        <FeatureSuggestion />
      </main>
      <Footer />
    </>
  );
}
