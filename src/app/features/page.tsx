import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Features from '@/components/sections/Features';
import CTASection from '@/components/sections/CTASection';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#050510] text-white">
      <Header alwaysDark />
      <main className="pt-24">
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl md:text-6xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Advanced Features
            </h1>
            <p className="text-gray-400 text-center max-w-2xl mx-auto mb-16 text-lg">
                Explore the powerful tools we've built to help you navigate and enjoy Instagram content anonymously and securely.
            </p>
        </div>
        
        <Features />
        
        <div className="py-20">
            <CTASection />
        </div>
      </main>
      <Footer />
    </div>
  );
}
