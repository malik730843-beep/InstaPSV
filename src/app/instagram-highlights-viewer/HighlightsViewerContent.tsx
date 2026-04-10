'use client';
import React, { useState } from 'react';
import InstagramSearch from '@/components/instagram/InstagramSearch';
import MediaTabs from '@/components/ui/MediaTabs';
import dynamic from 'next/dynamic';
import styles from './HighlightsViewer.module.css';

const ParticleBackground = dynamic(() => import('@/components/ui/ParticleBackground'), { ssr: false });

interface HighlightsViewerContentProps {
    header: React.ReactNode;
    footer: React.ReactNode;
}

export default function HighlightsViewerContent({ header, footer }: HighlightsViewerContentProps) {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const scrollToSearch = () => {
        const el = document.getElementById('search-tool');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => { const input = el.querySelector('input'); if (input) input.focus(); }, 600);
        }
    };

    return (
        <div className={styles.page}>
            {/* Structured Data Mapping */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                "@context": "https://schema.org", "@type": "FAQPage",
                "mainEntity": faqData.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } }))
            }) }} />
            
            {header}

            <main>
                {/* 1. Introduction & Hook (PAS Style) */}
                <section className={styles.hero}>
                    <ParticleBackground className={styles.particles} />
                    <div className={styles.floatingElements}>
                        <div className={`${styles.floatingOrb} ${styles.orb1}`} />
                        <div className={`${styles.floatingOrb} ${styles.orb2}`} />
                        <div className={`${styles.floatingOrb} ${styles.orb3}`} />
                    </div>
                    
                    <div className={styles.heroContent}>
                        <div className={styles.badge}><ShieldCheck size={16} /> 100% Private & Secure</div>
                        <h1 className={styles.heroTitle}>
                            Anonymous Instagram Highlights Viewer:<br />
                            <span className={styles.highlight}>View & Download IG Stories Discreetly</span>
                        </h1>
                        <p className={styles.heroSub}>
                            Are you tired of Instagram's limitations, wishing you could save your favorite Highlights or watch them anonymously? The frustration of wanting to archive a cherished memory or monitor competitor content without appearing in their viewer list is over. Welcome to the ultimate solution for privacy-conscious users.
                        </p>
                        
                        <button onClick={scrollToSearch} className={styles.ctaButton}>
                            Start Viewing Highlights Anonymously
                        </button>

                        <div className={styles.liveStatus}>
                            <div className={styles.statusItem}>
                                <div className={styles.statusDot}></div>
                                <span>Service Status: <span className={styles.statusValue}>Online & Secure</span></span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. Interactive Search Tool */}
                <section className={styles.searchSection} id="search-tool">
                    <div className={styles.searchWrapper}>
                         <MediaTabs />
                         <InstagramSearch restrictedTo="HIGHLIGHTS" />
                    </div>
                </section>

                <div className={styles.authorityBar}>
                    <div className={styles.container}>
                        <div className={styles.trustBadges}>
                            <div className={styles.trustBadge}><EyeOff size={20} /> Zero Tracking</div>
                            <div className={styles.trustBadge}><Lock size={20} /> No Login Required</div>
                            <div className={styles.trustBadge}><ShieldCheck size={20} /> HIPAA-Level Privacy</div>
                        </div>
                    </div>
                </div>

                {/* 3. The Problem: Hidden Risks of Normal Viewing */}
                <section className={styles.sectionAlt}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionTitle}>The Problem: Risks of standard Highlights Viewing</h2>
                        <p className={styles.sectionIntro}>Traditional browsing exposes your identity and limits your freedom.</p>
                        
                        <div className={styles.problemSolution}>
                            <div className={`${styles.psCard} ${styles.problemCard}`}>
                                <div className={styles.psHeader}>
                                    <div className={styles.iconWrap}><AlertCircle size={24} /></div>
                                    <h3>Frustrations & Risks</h3>
                                </div>
                                <ul>
                                    <li>Exposure: Your name appearing in "Seen by" lists of story highlights.</li>
                                    <li>Data Tracking: Instagram logs every profile you visit to build an ad profile.</li>
                                    <li>Accidental Interactions: The risk of an accidental \"like\" while browsing privately.</li>
                                </ul>
                            </div>
                            
                            <div className={`${styles.psCard} ${styles.solutionCard}`}>
                                <div className={styles.psHeader}>
                                    <div className={styles.iconWrap}><CheckCircle2 size={24} /></div>
                                    <h3>The InstaPSV Advantage</h3>
                                </div>
                                <ul>
                                    <li>Ultimate Anonymity: Our secure proxy ensures your name never reaches their list.</li>
                                    <li>No Digital Trace: We never log your searches or store your personal identity.</li>
                                    <li>Safety: Browse without the risk of accidental account interactions.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. Core Benefits */}
                <section className={styles.section}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionTitle}>Why Choose Our Highlights Viewer?</h2>
                        <div className={styles.threeColGrid}>
                            <div className={styles.featureCard}>
                                <div className={styles.featureIcon}><ShieldCheck size={32} /></div>
                                <h3>Total Privacy</h3>
                                <p>Stay 100% invisible. View any public highlight without notifying the content creator or leaving a digital footprint.</p>
                            </div>
                            <div className={styles.featureCard}>
                                <div className={styles.featureIcon}><Download size={32} /></div>
                                <h3>HD Downloads</h3>
                                <p>Save highlights in their original high-resolution quality directly to your device for offline viewing anytime.</p>
                            </div>
                            <div className={styles.featureCard}>
                                <div className={styles.featureIcon}><Zap size={32} /></div>
                                <h3>Instant Speed</h3>
                                <p>No wait times, no lag. Our ultra-fast servers retrieve and present content in milliseconds.</p>
                            </div>
                             <div className={styles.featureCard}>
                                <div className={styles.featureIcon}><Smartphone size={32} /></div>
                                <h3>No App Required</h3>
                                <p>A fully web-based tool. Access all features directly from your browser without installing risky third-party apps.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. How-To Guide */}
                <section className={styles.sectionAlt}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionTitle}>How to Watch Instagram Highlights Privately</h2>
                        <div className={styles.stepsBlocks}>
                            <div className={styles.stepBlock}>
                                <div className={styles.stepNumber}>1</div>
                                <h3>Copy the Username</h3>
                                <p>Copy the Instagram username of the public account you wish to view from your browser or the IG app.</p>
                            </div>
                            <div className={styles.stepBlock}>
                                <div className={styles.stepNumber}>2</div>
                                <h3>Paste & Search</h3>
                                <p>Paste the username into the search bar above and click the "Watch Highlights" button.</p>
                            </div>
                            <div className={styles.stepBlock}>
                                <div className={styles.stepNumber}>3</div>
                                <h3>Browse & Download</h3>
                                <p>Click on any highlight cover to view its contents anonymously or save them to your device.</p>
                            </div>
                        </div>
                        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                            <div className={styles.expertTip} style={{ maxWidth: '600px', margin: '0 auto' }}>
                                <Zap size={20} />
                                <div><strong>Expert Tip:</strong> Use our tool for market research to analyze competitor Highlights without alerting their marketing team.</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 6. Privacy & Security Deep Dive */}
                <section className={styles.section}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionTitle}>Privacy & Security Deep Dive</h2>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoCard}>
                                <h3><Lock className={styles.iconLock} size={28} /> Our Safety Protocol</h3>
                                <p>We take your digital safety seriously. Our architecture is built with a zero-trust model to ensure your data stays yours.</p>
                                <ul>
                                    <li>Zero logs: Your activity is never stored on our servers.</li>
                                    <li>IP Masking: Your real IP is hidden through our anonymous proxy gateway.</li>
                                    <li>SSL Encryption: All data transfers are protected with banking-grade encryption.</li>
                                </ul>
                            </div>
                            <div className={styles.infoCard}>
                                <h3><AlertCircle className={styles.iconAlert} size={28} /> Responsible Usage</h3>
                                <p>Please respect creators and use our tool ethically. Private accounts are protected for a reason, and we only operate with public content.</p>
                                <ul>
                                    <li>Respect intellectual property: Downloaded content is for personal use only.</li>
                                    <li>No private account bypass: We prioritize Instagram's security boundaries.</li>
                                    <li>Independent service: We are not affiliated with Meta or Instagram.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 7. FAQs */}
                <section className={styles.sectionAlt}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionTitle}>FAQs: Highlights Viewer & Downloader</h2>
                        <div className={styles.faqWrapper}>
                            {faqData.map((faq, index) => (
                                <div key={index} className={`${styles.faqItem} ${openFaq === index ? styles.faqOpen : ''}`}>
                                    <button
                                        className={styles.faqButton}
                                        onClick={() => toggleFaq(index)}
                                        aria-expanded={openFaq === index}
                                    >
                                        <h3>{faq.q}</h3>
                                        <div className={styles.faqIcon}></div>
                                    </button>
                                    <div className={styles.faqAnswer}>
                                        <div className={styles.faqAnswerInner}>
                                            <p>{faq.a}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 10. Final CTA */}
                <section className={styles.bottomCta}>
                    <div className={styles.container}>
                        <h2>Ready to View Discreetly?</h2>
                        <p>Join thousands of privacy-conscious users who enjoy Instagram content on their own terms. Secure, fast, and 100% anonymous.</p>
                        <button onClick={scrollToSearch} className={styles.ctaButton} style={{ marginTop: '1rem' }}>
                            Access The Highlights Viewer Now
                        </button>
                    </div>
                </section>
            </main>
            {footer}
        </div>
    );
}

const faqData = [
    { q: 'Is it truly anonymous?', a: 'Yes. Our server fetches the content for you, so your personal account and IP address never interact with Instagram\'s servers directly. The owner sees 0 trace of you.' },
    { q: 'Do I need to sign in with my IG account?', a: 'Never. We will never ask for your password or account details. Our tool is 100% web-based and requires no login.' },
    { q: 'Can I view highlights from private accounts?', a: 'No. Our tool respects Instagram’s privacy settings and only works with publicly available account content.' },
    { q: 'Is there a limit on how many highlights I can watch?', a: 'No, you can enjoy unlimited anonymous viewing and downloading with no daily or monthly caps.' },
    { q: 'What is the quality of the downloaded content?', a: 'All Highlights are downloaded in their original High-Definition (HD) quality as uploaded to the platform.' }
];

const faqSchemaItem = faqData.map(f => ({
    "@type": "Question",
    "name": f.q,
    "acceptedAnswer": { "@type": "Answer", "text": f.a }
}));

import { 
    ShieldCheck, 
    EyeOff, 
    Lock, 
    Search,
    Zap,
    Download,
    Cpu,
    Smartphone,
    Globe,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
