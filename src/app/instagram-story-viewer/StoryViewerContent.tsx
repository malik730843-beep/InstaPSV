'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, Sparkles, Download, Search, Lightbulb } from 'lucide-react';
import InstagramSearch from '@/components/instagram/InstagramSearch';
import dynamic from 'next/dynamic';
import styles from './StoryViewer.module.css';

const ParticleBackground = dynamic(() => import('@/components/ui/ParticleBackground'), { ssr: false });

interface StoryViewerContentProps {
    header: React.ReactNode;
    footer: React.ReactNode;
}

export default function StoryViewerContent({ header, footer }: StoryViewerContentProps) {
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
            {/* Structured Data */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                "@context": "https://schema.org", "@type": "FAQPage",
                "mainEntity": faqData.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } }))
            }) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                "@context": "https://schema.org", "@type": "WebApplication",
                "name": "Anonymous Instagram Story Viewer", "applicationCategory": "BrowserApplication", "operatingSystem": "Any",
                "description": "Watch and download public Instagram stories anonymously without login.",
                "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
            }) }} />
            {header}

            <main>
                {/* ========== HERO ========== */}
                <section className={styles.hero}>
                    <ParticleBackground className={styles.particles} />
                    <div className={styles.floatingElements}>
                        <div className={`${styles.floatingOrb} ${styles.orb1}`} />
                        <div className={`${styles.floatingOrb} ${styles.orb2}`} />
                        <div className={`${styles.floatingOrb} ${styles.orb3}`} />
                    </div>
                    <div className={styles.heroContent}>
                        <span className={styles.badge}><Shield size={16} color="var(--color-gradient-blue)" /> Anonymous Story Viewer</span>
                        <h1 className={styles.heroTitle}>
                            Anonymous Instagram Story Viewer:{' '}
                            <span className={styles.highlight}>View &amp; Download Discreetly</span>
                            <span className={styles.heroSub}>(No Login Required)</span>
                        </h1>
                        <button onClick={scrollToSearch} className={styles.ctaButton}>
                            Try Our Anonymous Instagram Story Viewer Today
                        </button>
                    </div>
                </section>

                {/* ========== SEARCH TOOL ========== */}
                <section className={styles.searchSection} id="search-tool">
                    <div className={styles.searchWrapper}>
                        <InstagramSearch />
                    </div>
                </section>

                {/* ========== WHAT IS + PRIVACY FIRST ========== */}
                <section className={styles.section}>
                    <div className={styles.container}>
                        <div className={styles.twoCol}>
                            <div className={styles.textBlock}>
                                <h2>What is an Anonymous Instagram Story Viewer?</h2>
                                <p>An anonymous Instagram story viewer is a simple tool that lets you watch public Instagram stories without showing up in the viewer list. Instagram normally records your username when you view a story. With this tool, your identity stays private.</p>
                            </div>
                            <div className={styles.textBlock}>
                                <h2>The Privacy-First Viewer: Redefining Digital Discretion</h2>
                                <p>We built this tool with privacy in mind. It gives you a straightforward way to view public Instagram stories without sharing your information. The technical setup keeps your activity separate from your personal accounts.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========== WHY CHOOSE US ========== */}
                <section className={styles.sectionAlt}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionTitle}>Why Choose Our Anonymous Instagram Story Viewer?</h2>
                        <p className={styles.sectionIntro}>If you want to view stories without being seen, you need a tool that actually keeps you anonymous. We focus on the basics: privacy, security, and ease of use.</p>

                        <div className={styles.featureBlocks}>
                            {/* 🛡️ Anonymity */}
                            <div className={styles.featureBlock}>
                                <h3><span className={styles.featureEmoji}><Shield size={24} /></span> Unmatched Anonymity &amp; Discretion</h3>
                                <p>When you use our viewer, your activity doesn&apos;t show up on Instagram&apos;s end. The story creator won&apos;t see your username or any sign you viewed their story.</p>
                                <p>We process public Instagram stories through our own servers. Instagram only sees our server, not your device or account. You don&apos;t need to log in or share any personal details.</p>
                            </div>

                            {/* ✨ UX */}
                            <div className={styles.featureBlock}>
                                <h3><span className={styles.featureEmoji}><Sparkles size={24} /></span> Seamless User Experience</h3>
                                <p>The tool is simple. You paste a public profile link and view stories right away.</p>
                                <p>The interface is clean and loads quickly. There are few ads and no unnecessary steps.</p>
                                <p>You don&apos;t need to log in or connect your Instagram account. Just paste the link and start viewing.</p>
                            </div>

                            {/* ⬇️ Advanced */}
                            <div className={styles.featureBlock}>
                                <h3><span className={styles.featureEmoji}><Download size={24} /></span> Advanced Features for Comprehensive Viewing</h3>
                                <p>You can also download public stories for offline viewing if you want to keep a copy.</p>
                                <p><strong>High-Quality Viewing &amp; Cross-Platform Compatibility:</strong> Enjoy stories in their original resolution on any device. Our service is optimized for seamless performance across desktops, tablets, and mobile phones.</p>
                                <p><strong>The Story Archiver (Secure Downloading):</strong> For those who wish to revisit content, our viewer also provides the option to securely download public stories for personal, offline viewing, making it a versatile tool for content collection. Efficiently view and save stories from multiple profiles without the need to switch accounts.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========== HOW IT WORKS ========== */}
                <section className={styles.section}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionTitle}>How Our Anonymous Instagram Story Viewer Works</h2>
                        <p className={styles.sectionIntro}>Here&apos;s how to use the tool in four steps.</p>

                        <div className={styles.stepsGrid}>
                            <div className={styles.stepCard}>
                                <div className={styles.stepNum}>1</div>
                                <h3>Find the Instagram Profile</h3>
                                <p>Open Instagram and go to the public profile you want to view. The tool only works with public accounts.</p>
                            </div>
                            <div className={styles.stepCard}>
                                <div className={styles.stepNum}>2</div>
                                <h3>Copy Profile URL</h3>
                                <p>Copy the profile URL. On desktop, use the address bar. On mobile, tap the three dots and select &apos;Copy Link.&apos;</p>
                            </div>
                            <div className={styles.stepCard}>
                                <div className={styles.stepNum}>3</div>
                                <h3>Paste into Our Viewer</h3>
                                <p>Paste the link into the input field on our site.</p>
                            </div>
                            <div className={styles.stepCard}>
                                <div className={styles.stepNum}>4</div>
                                <h3>View Stories Anonymously</h3>
                                <p>Click &apos;View.&apos; The stories will load and you can watch them without being seen.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========== BEHIND THE SCENES ========== */}
                <section className={styles.sectionAlt}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionTitle} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                            <Search size={32} color="#7928ca" /> Behind the Scenes: Our Anonymity Process
                        </h2>
                        <div className={styles.centeredBlock}>
                            <p>Here&apos;s how the anonymous viewing process works.</p>
                            <p>When you paste a profile link, our server requests the stories from Instagram. Instagram only sees our server, not your device. You stay anonymous throughout the process.</p>
                        </div>
                    </div>
                </section>

                {/* ========== PRIVACY & SECURITY ========== */}
                <section className={styles.section}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionTitle}>Ensuring Your Privacy &amp; Security</h2>
                        <p className={styles.sectionIntro}>We know privacy and security matter. The tool is built to be transparent about how your data is handled and uses standard security practices.</p>

                        <div className={styles.twoCol}>
                            <div className={styles.textBlock}>
                                <h3>Our Commitment to Your Data Privacy</h3>
                                <p>You can read our privacy policy for details on how we handle data. We don&apos;t collect or store your personal information.</p>
                                <p>We don&apos;t track your IP address, browsing history, or any personal details. Your activity stays private.</p>
                            </div>
                            <div className={styles.textBlock}>
                                <h3>Security Measures in Place</h3>
                                <p>All connections use SSL encryption. Look for the HTTPS padlock in your browser.</p>
                                <p>We review our security setup regularly to keep things safe.</p>
                            </div>
                        </div>

                        <div className={styles.tipsBlock}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Lightbulb size={24} color="#ff0080" /> Expert Tips for Protecting Yourself Online:
                            </h3>
                            <p>Even with this tool, it&apos;s smart to follow basic online safety steps.</p>
                            <ul>
                                <li><strong>Beware of &quot;Login Required&quot; Tools:</strong> Be extremely cautious of any anonymous viewer that asks for your Instagram login credentials. This is a major security risk that will compromise your account. (We will never ask for your login).</li>
                                <li><strong>Check for SSL Certificates:</strong> Check for HTTPS in the browser bar before using any tool.</li>
                                <li><strong>Clear Browser Cookies:</strong> Clear your cookies and cache regularly to reduce tracking.</li>
                                <li><strong>Consider a VPN:</strong> If you want extra privacy, use a VPN when browsing.</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* ========== COMPARISON ========== */}
                <section className={styles.sectionAlt}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionTitle}>Comparing Anonymous Viewing to Native Instagram</h2>
                        <p className={styles.sectionIntro}>Here&apos;s how this tool is different from viewing stories on Instagram directly.</p>

                        <div className={styles.comparisonGrid}>
                            <div className={`${styles.compCard} ${styles.compCardRed}`}>
                                <h3>Native Instagram Limitations</h3>
                                <p>When you view a story directly on Instagram, your username is actively recorded and permanently displayed in the story creator&apos;s viewer list. There is no built-in way to hide this.</p>
                            </div>
                            <div className={`${styles.compCard} ${styles.compCardGreen}`}>
                                <h3>Our Anonymity Advantage</h3>
                                <p>Our service entirely bypasses this native limitation. You can view any public story without your presence ever being recorded, completely removing the anxiety and fear of being tracked by the creator.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========== FAQ ========== */}
                <section className={styles.section}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionTitle}>Frequently Asked Questions (FAQ)</h2>
                        <p className={styles.sectionIntro}>Here are answers to common questions.</p>

                        <div className={styles.faqList}>
                            {faqData.map((f, i) => (
                                <div key={i} className={`${styles.faqItem} ${openFaq === i ? styles.faqOpen : ''}`}>
                                    <button
                                        className={styles.faqButton}
                                        onClick={() => toggleFaq(i)}
                                        aria-expanded={openFaq === i}
                                    >
                                        <h3>{f.q}</h3>
                                        <span className={styles.faqIcon}></span>
                                    </button>
                                    <div className={styles.faqAnswer}>
                                        <div className={styles.faqAnswerInner}>
                                            <p>{f.a}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ========== DISCLAIMER ========== */}
                <section className={styles.sectionAlt}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionTitle}>Disclaimer &amp; Ethical Use Guidelines</h2>
                        <p className={styles.sectionIntro}>Please read our guidelines for responsible use.</p>

                        <div className={styles.disclaimerGrid}>
                            <div className={styles.textBlock}>
                                <h3>Important Disclaimers:</h3>
                                <ul className={styles.bulletList}>
                                    <li><strong>Public Profiles Only:</strong> Our service can only access publicly available content on Instagram. We cannot and do not bypass privacy settings on private accounts.</li>
                                    <li><strong>No Affiliation with Instagram:</strong> This anonymous story viewer is an independent, third-party web tool. It is not affiliated with, endorsed by, sponsored by, or connected to Instagram or Meta Platforms, Inc. in any way.</li>
                                </ul>
                            </div>
                            <div className={styles.textBlock}>
                                <h3>Ethical Usage:</h3>
                                <ul className={styles.bulletList}>
                                    <li><strong>Respect Privacy:</strong> Respect others&apos; privacy. Don&apos;t use this tool to harass or misuse downloaded content.</li>
                                    <li><strong>Compliance with Local Laws:</strong> You are entirely responsible for ensuring your use of our service complies with all applicable local, national, and international data laws and regulations.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========== CONCLUSION + CTA ========== */}
                <section className={styles.ctaSection}>
                    <div className={styles.container}>
                        <h2 className={styles.ctaTitle}>Conclusion: Your Ultimate Tool for Private Instagram Story Viewing</h2>
                        <p className={styles.ctaText}>Online privacy is harder to come by these days. This tool gives you a simple, secure way to view public Instagram stories without being seen. You can also download stories if you want to keep them for later.</p>
                        <p className={styles.ctaText}>You don&apos;t have to deal with privacy worries, ads, or complicated steps. View public stories on your own terms.</p>
                        <p className={styles.ctaHighlight}>Ready to experience true anonymity?</p>
                        <button onClick={scrollToSearch} className={styles.ctaButton}>
                            Try Our Anonymous Instagram Story Viewer Today
                        </button>
                        <p className={styles.ctaTagline}>Take control of your privacy online.</p>
                    </div>
                </section>
            </main>
            {footer}
        </div>
    );
}

/* ===== DATA ===== */

const faqData = [
    { q: 'Is your service truly 100% anonymous?', a: 'Yes. The tool uses a proxy so Instagram doesn\'t see your identity. Your username isn\'t logged.' },
    { q: 'Do I need an Instagram account to use it?', a: 'No, you do not need an Instagram account, nor do you have to log in to anything to use our tool.' },
    { q: 'Is it free to use?', a: 'Yes, the main story viewing feature is free. There are no hidden fees.' },
    { q: 'Does it work for private Instagram accounts?', a: 'No tool can access stories from private profiles. This only works for public accounts.' },
    { q: 'Can I download stories?', a: 'Yes. For public profiles, our service allows downloading stories in high quality for personal, offline viewing. (Expert Tip: Always be mindful of copyright laws and use downloaded content responsibly for non-commercial purposes only).' },
    { q: 'What devices and browsers are supported?', a: 'The tool works on any device and all major browsers.' },
    { q: 'What if the viewer isn\'t working?', a: 'If the viewer isn\'t working, check that the profile is public and the URL is correct. Try clearing your browser cache or switching browsers. If you still have trouble, contact support.' },
    { q: 'How often is the tool updated?', a: 'We update the tool often to keep it working with Instagram and to improve speed and security.' },
    { q: 'Where can I get more help?', a: 'For help, visit our support page or email us.' },
];

const relatedTools = [
    { href: '/anonymous-instagram-viewer', label: 'Anonymous Instagram Viewer' },
    { href: '/instagram-profile-viewer', label: 'Instagram Profile Viewer' },
    { href: '/instagram-reels-downloader', label: 'Instagram Reels Downloader' },
    { href: '/instagram-highlights-viewer', label: 'Instagram Highlights Viewer' },
    { href: '/instagram-photo-downloader', label: 'Instagram Photo Downloader' },
];
