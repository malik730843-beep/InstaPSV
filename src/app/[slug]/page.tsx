
import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import styles from './page.module.css';

// Initialize Supabase Client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getPage(slug: string) {
    const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

    if (error) return null;
    return data;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const page = await getPage(slug);
    if (!page) return {};
    return {
        title: page.meta_title || `${page.title} - InstaPSV`,
        description: page.meta_description || page.excerpt || '',
    };
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const page = await getPage(slug);

    if (!page) {
        notFound();
    }

    return (
        <>
            <Header alwaysDark />
            <main className={styles.main}>
                {/* Hero Section */}
                <section className={styles.hero}>
                    <div className={styles.container}>
                        <span className={styles.badge}>📄 {page.title}</span>
                        <h1 className={styles.title}>
                            {(() => {
                                const titleText = page.title || '';
                                const parts = titleText.split(' ');
                                if (parts.length > 1) {
                                    const last = parts.pop();
                                    return <>{parts.join(' ')} <span className={styles.highlight}>{last}</span></>;
                                }
                                return <span className={styles.highlight}>{titleText}</span>;
                            })()}
                        </h1>
                        <p className={styles.subtitle}>
                            {page.excerpt || `Information about ${page.title}`}
                        </p>
                    </div>
                </section>

                <section className={styles.content}>
                    <div className={styles.container}>
                        <div
                            className={styles.card}
                            dangerouslySetInnerHTML={{ __html: page.content }}
                        />
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
