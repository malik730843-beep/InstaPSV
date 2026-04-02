'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                "@context": "https://schema.org", "@type": "WebApplication",
                "name": "Anonymous Instagram Highlights Viewer", "applicationCategory": "BrowserApplication", "operatingSystem": "Any",
                "description": "View and download public Instagram highlights anonymously securely without logging in.",
                "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
            }) }} />
            
            {header}

            <main>
                {/* 1. HERO SECTION (Entity-based, semantic outcome-driven) */}
                <section className={styles.hero}>
                    <ParticleBackground className={styles.particles} />
                    <div className={styles.floatingElements}>
                        <div className={`${styles.floatingOrb} ${styles.orb1}`} />
                        <div className={`${styles.floatingOrb} ${styles.orb2}`} />
                        <div className={`${styles.floatingOrb} ${styles.orb3}`} />
                    </div>
                    
                    <div className={styles.heroContent}>
                        <span className={styles.badge}><ShieldCheck size={16} /> Privacy-First Viewer</span>
                        <h1 className={styles.heroTitle}>
                            Anonymous Instagram Highlights Viewer<br />
                            <span className={styles.highlight}>View & Download Discreetly</span>
                        </h1>
                        <p className={styles.heroSub}>
                            Imagine exploring Instagram highlights without leaving a trace, without logging in, and without your activity being tracked. Our free, web-based viewer provides a truly anonymous gateway to public content.
                        </p>
                        
                        <button onClick={scrollToSearch} className={styles.ctaButton}>
                            Try Our Highlights Viewer Now
                        </button>

                        {/* Hero Resource: Live Status Indicator */}
                        <div className={styles.liveStatus}>
                            <div className={styles.statusItem}>
                                <div className={styles.statusDot}></div>
                                <span>Service Status: <span className={styles.statusValue}>Online & Fast</span></span>
                            </div>
                            <div className={styles.statusItem}>
                                <Zap size={16} color="#10b981" />
                                <span>Avg Retrieval Time: <span className={styles.statusValue}>0.8s</span></span>
                            </div>
                            <div className={styles.statusItem}>
                                <CheckCircle2 size={16} color="#00d4ff" />
                                <span>Secure Connections: <span className={styles.statusValue}>Active</span></span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. SEARCH TOOL (Instant Access) */}
                <section className={styles.searchSection} id="search-tool">
                    <div className={styles.searchWrapper}>
                         <MediaTabs />
                         <InstagramSearch restrictedTo="HIGHLIGHTS" />
                    </div>
                </section>

                {/* 3. AUTHORITY SIGNALS */}
                <div className={styles.authorityBar}>
                    <div className={styles.container}>
                        <div className={styles.trustBadges}>
                            <div className={styles.trustBadge}><Lock size={20} /> 256-bit SSL Secure</div>
                            <div className={styles.trustBadge}><EyeOff size={20} /> Zero Data Retention</div>
                            <div className={styles.trustBadge}><ShieldCheck size={20} /> Verified Anonymous</div>
                            <div className={styles.trustBadge}><Cpu size={20} /> No App Install Needed</div>
                        </div>
                    </div>
                </div>

                {/* 4. PROBLEM vs SOLUTION (Side-by-side framework) */}
                <section className={styles.sectionAlt}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionTitle}>Overcome Privacy Concerns</h2>
                        <p className={styles.sectionIntro}>Experience public Instagram content on your terms, freely and privately.</p>
                        
                        <div className={styles.problemSolution}>
                            <div className={`${styles.psCard} ${styles.problemCard}`}>
                                <div className={styles.psHeader}>
                                    <div className={styles.iconWrap}><AlertCircle size={24} /></div>
                                    <h3>The Problem</h3>
                                </div>
                                <p>Many users want to stay informed or revisit content discreetly, but the worry of being seen or compromising personal data holds them back.</p>
                                <ul>
                                    <li>Fear of identity exposure in viewer lists.</li>
                                    <li>Forced to log in to view specific highlights.</li>
                                    <li>Leaving a digital footprint tied to your account.</li>
                                </ul>
                            </div>
                            
                            <div className={`${styles.psCard} ${styles.solutionCard}`}>
                                <div className={styles.psHeader}>
                                    <div className={styles.iconWrap}><CheckCircle2 size={24} /></div>
                                    <h3>Our Solution</h3>
                                </div>
                                <p>Our Anonymous Viewer acts as a secure proxy layout, offering you a seamlessly private gateway to public highlights and stories.</p>
                                <ul>
                                    <li>View content discreetly without exposure.</li>
                                    <li>Access highlights with no Instagram account required.</li>
                                    <li>Avoid profile visits entirely.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. CAPABILITIES & OUTCOMES (Why Choose Us Array) */}
                <section className={styles.section}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionTitle}>Why Choose Our Viewer?</h2>
                        <p className={styles.sectionIntro}>We provide a superior viewing experience built on unwavering anonymity.</p>
                        
                        <div className={styles.threeColGrid}>
                            <div className={styles.featureCard}>
                                <div className={styles.featureIcon}><ShieldCheck size={32} /></div>
                                <h3>Privacy-First Approach</h3>
                                <p>View content discreetly. We minimize digital footprints often associated with social media browsing and never ask for account credentials.</p>
                            </div>
                            <div className={styles.featureCard}>
                                <div className={styles.featureIcon}><Zap size={32} /></div>
                                <h3>Cleaner, Ad-Free UI</h3>
                                <p>Enjoy a distraction-free, intuitive interface designed for quick and hassle-free highlight access. Fast, lightweight, and responsive.</p>
                            </div>
                            <div className={styles.featureCard}>
                                <div className={styles.featureIcon}><Download size={32} /></div>
                                <h3>Prominent Download Feature</h3>
                                <p>A seamless and reliable option to download highlights directly to your device for offline viewing. completely cost-free.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 6. HOW IT WORKS (3 Steps Layout mapping) */}
                <section className={styles.sectionAlt}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionTitle}>A Simple Guide to Seamless Use</h2>
                        <p className={styles.sectionIntro}>Accessing highlights is as simple as 1-2-3.</p>
                        
                        <div className={styles.stepsBlocks}>
                            <div className={styles.stepBlock}>
                                <div className={styles.stepNumber}>1</div>
                                <h3>Locate the Content</h3>
                                <p>Find the public Instagram username or the specific highlight/story link you wish to view. Ensure the account is public.</p>
                            </div>
                            <div className={styles.stepBlock}>
                                <div className={styles.stepNumber}>2</div>
                                <h3>Enter into Our Viewer</h3>
                                <p>Paste the copied username or link into the designated input field at the top of our website.</p>
                            </div>
                            <div className={styles.stepBlock}>
                                <div className={styles.stepNumber}>3</div>
                                <h3>View or Download</h3>
                                <p>Click to process. Choose to view the highlights directly on the page anonymously or initiate a download for offline access.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 7. TECHNICAL & LIMITATIONS (Info Grid) */}
                <section className={styles.section}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionTitle}>Understanding the Platform</h2>
                        <p className={styles.sectionIntro}>Transparency on our tech methodology and Instagram's boundaries.</p>

                        <div className={styles.infoGrid}>
                            <div className={styles.infoCard}>
                                <h3><Lock className={styles.iconLock} size={28} /> Data Security & Tech</h3>
                                <p>Our platform operates on a strict zero-data retention policy. No logins required.</p>
                                <ul>
                                    <li><strong>Proxy System:</strong> We access public data on Instagram's servers on your behalf.</li>
                                    <li><strong>Server-side Processing:</strong> Operations are handled securely off your device.</li>
                                    <li><strong>Malware Free:</strong> Regularly scanned to be free of intrusive ads or malware.</li>
                                </ul>
                            </div>
                            
                            <div className={styles.infoCard}>
                                <h3><AlertCircle className={styles.iconAlert} size={28} /> Important Limitations</h3>
                                <p>We respect Instagram's core security frameworks.</p>
                                <ul>
                                    <li><strong>Private Accounts:</strong> Cannot access highlights/stories from private accounts. This is a fundamental Instagram security feature.</li>
                                    <li><strong>No Interaction:</strong> You cannot like, comment, or share via our viewer.</li>
                                    <li><strong>Real-time Availability:</strong> Only active content published by public accounts is accessible.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 8. DEVICE COMPATIBILITY */}
                <section className={styles.sectionAlt}>
                    <div className={styles.container}>
                        <div className={styles.problemSolution} style={{ alignItems: 'center' }}>
                            <div>
                                <h2 className={styles.sectionTitle} style={{ textAlign: 'left' }}>Universal Compatibility Across All Devices</h2>
                                <p className={styles.sectionIntro} style={{ textAlign: 'left', marginLeft: '0', marginBottom: '2rem' }}>
                                    Our web-based tool is optimized for responsive design ensuring a consistent experience wherever you are.
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div className={styles.trustBadge} style={{ color: 'var(--color-white)', fontSize: '1rem' }}>
                                        <Globe size={24} color="#00d4ff" /> Works on Desktop & Laptops (Windows, macOS)
                                    </div>
                                    <div className={styles.trustBadge} style={{ color: 'var(--color-white)', fontSize: '1rem' }}>
                                        <Smartphone size={24} color="#7928ca" /> Optimized for Mobile (iOS, Android)
                                    </div>
                                    <div className={styles.trustBadge} style={{ color: 'var(--color-white)', fontSize: '1rem' }}>
                                        <Search size={24} color="#ff0080" /> Supports Chrome, Safari, Firefox, Edge
                                    </div>
                                </div>
                            </div>
                            <div style={{ background: 'var(--glass-bg)', padding: '3rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--glass-border)', textAlign: 'center' }}>
                                <h3>Ethical Usage & Legal Standing</h3>
                                <p style={{ color: 'var(--color-text-light-muted)', lineHeight: '1.6', marginTop: '1rem' }}>
                                    This tool is an independent third-party service not affiliated with Instagram or Meta. While viewing public content is generally permissible, ensure you respect creators' intellectual property rights. Downloaded content should be used responsibly.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 9. FAQs */}
                <section className={styles.section}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
                        <p className={styles.sectionIntro}>Clear answers regarding functionality, privacy, and technical queries.</p>

                        <div className={styles.faqWrapper}>
                            {faqData.map((faq, index) => (
                                <div key={index} className={`${styles.faqItem} ${openFaq === index ? styles.faqOpen : ''}`}>
                                    <button
                                        className={styles.faqButton}
                                        onClick={() => toggleFaq(index)}
                                        aria-expanded={openFaq === index}
                                    >
                                        <h3>{faq.q}</h3>
                                        <span className={styles.faqIcon}></span>
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

                {/* 10. FINAL CTA SECTION (Exit Intent) */}
                <section className={styles.bottomCta}>
                    <div className={styles.container}>
                        <h2>View Highlights with Confidence</h2>
                        <p>Empower yourself with the freedom to explore public Instagram highlights without compromise. Try our Anonymous Viewer today and discover a truly secure way to stay connected.</p>
                        <button onClick={scrollToSearch} className={styles.ctaButton} style={{ marginTop: '1rem' }}>
                            Access The Viewer Now
                        </button>
                    </div>
                </section>
            </main>
            {footer}
        </div>
    );
}

/* ===== FAQ DATA (From Prompt Outline) ===== */
const faqData = [
    { q: 'Is this service truly anonymous?', a: 'Yes, our service is designed for complete anonymity. You do not need an Instagram account or login, and your activity is not traceable to your personal identity.' },
    { q: 'Do I need an Instagram account to use this?', a: 'No, you do not need an Instagram account to view or download highlights using our tool. Simply input the public username or highlight link.' },
    { q: 'Is my data safe?', a: 'Absolutely. We do not collect, store, or request any personal data, login credentials, or browsing history. All connections are secured with SSL/HTTPS encryption.' },
    { q: 'Can I view highlights from private accounts?', a: 'No, our tool can only access highlights and stories from public Instagram accounts due to Instagram\'s privacy settings. Private account content is not accessible.' },
    { q: 'Is it legal to download Instagram highlights?', a: 'Viewing publicly available content is generally permissible. However, downloading and repurposing content may have copyright implications. Always respect intellectual property rights and use downloaded content responsibly.' },
    { q: 'What if the tool isn\'t working?', a: 'Ensure the Instagram account is public, the username/link is correct, and your internet is stable. Check our Live Service Status. You can also try clearing your browser cache.' },
    { q: 'Are there any hidden costs or subscriptions?', a: 'No, our Anonymous Instagram Highlights Viewer is completely free to use, with no hidden costs, subscriptions, or premium features requiring payment.' },
    { q: 'Can I download stories as well as highlights?', a: 'Yes, if stories are currently active and from a public account, you can view and download them using our tool.' },
    { q: 'What devices and browsers are compatible?', a: 'Our web-based tool is compatible with all major devices (desktop, mobile, tablet) and browsers (Chrome, Firefox, Safari, Edge, etc.) that support modern web standards.' },
    { q: 'How often is the tool updated to Instagram changes?', a: 'We strive to keep our tool updated regularly to ensure compatibility with Instagram\'s platform changes, maintaining consistent functionality and reliability.' }
];
