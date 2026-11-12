import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ViewerGuide from '@/components/sections/ViewerGuide';
import styles from '@/components/seo/ToolGuidePage.module.css';
export const metadata: Metadata = {
  title: 'Features and Availability',
  description: 'Compare InstaPSV tools, supported accounts, search credits and feature limitations before using the service.',
  alternates: { canonical: '/features' },
};
export default function FeaturesPage() {
  return <><Header alwaysDark /><main>
    <header className={styles.main} style={{ paddingBottom: 0 }}><h1>Features and availability</h1><p>Check what each tool supports before searching or choosing a plan.</p></header>
    <ViewerGuide />
  </main><Footer /></>;
}
