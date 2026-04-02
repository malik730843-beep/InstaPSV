'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import InstagramSearch from '@/components/instagram/InstagramSearch';
import MediaTabs from '@/components/ui/MediaTabs';
import styles from './AnonymousDownloader.module.css';
import { Shield, Lock, EyeOff, Zap, Download, Info, CheckCircle, Smartphone } from 'lucide-react';

const ParticleBackground = dynamic(() => import('@/components/ui/ParticleBackground'), { ssr: false });

interface AnonymousDownloaderContentProps {
    header: React.ReactNode;
    footer: React.ReactNode;
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    ctaText?: string;
    restrictedTo?: 'POSTS' | 'REELS' | 'STORIES' | 'HIGHLIGHTS';
}

export default function AnonymousDownloaderContent({ 
    header, 
    footer,
    title,
    subtitle,
    ctaText = "Start Downloading Anonymously Today!",
    restrictedTo
}: AnonymousDownloaderContentProps) {
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const faqData = [
        {
            question: "Is this Instagram downloader truly free?",
            answer: "Yes, our service is completely free to use, with no hidden costs or subscription fees."
        },
        {
            question: "Do I need an Instagram account to use it?",
            answer: "No, you do not need an Instagram account or to log in to use our downloader. Simply provide the public post link."
        },
        {
            question: "Is it safe to use?",
            answer: "Absolutely. Our tool is free from malware, viruses, and does not request your personal Instagram credentials. We prioritize your security and anonymity."
        },
        {
            question: "What quality can I expect for downloads?",
            answer: "We strive to provide the highest available quality, mirroring the original resolution of the content whenever possible."
        },
        {
            question: "Can I download private Instagram content?",
            answer: "No. Our downloader only works for public Instagram posts, respecting user privacy settings."
        },
        {
            question: "What should I do if the download fails?",
            answer: "Check your internet connection, ensure the URL is correct and from a public post.\n\nExpert Tip: Regularly Clear Browser Cache: If you encounter any issues with the downloader tool, clearing your browser's cache and cookies can often resolve temporary glitches."
        },
        {
            question: "How can I back up my downloaded content?",
            answer: "Expert Tip: Backup Important Downloads: For crucial content, always back up your downloaded files to a cloud service or an external hard drive to prevent data loss."
        },
        {
            question: "What file formats are supported?",
            answer: "We support common formats like JPG for images and MP4 for videos and Reels."
        }
    ];

    return (
        <div className={styles.page}>
            {header}

            <main>
                {/* 1. Introduction & Hero */}
                <section className={styles.hero}>
                    <ParticleBackground className={styles.particles} />
                    
                    <div className={styles.heroContent}>
                        <h1 className={styles.heroTitle}>
                            {title || (
                                <>
                                    Anonymous Instagram Downloader:{' '}
                                    <span className={styles.highlight}>Secure, Fast & Free</span> for Photos, Videos & Reels
                                </>
                            )}
                        </h1>
                        
                        <p className={styles.heroSub}>
                            {subtitle || "Are you tired of Instagram's limitations, wishing you could save your favorite photos, videos, or Reels directly to your device? The frustration of wanting to archive a cherished memory, analyze a competitor's content, or simply enjoy a video offline, only to find no native download option, is a common pain point for millions of users."}
                        </p>
                        
                        <p className={styles.heroSub}>
                            Beyond just the inconvenience, many online downloaders raise concerns about privacy, security, and complicated interfaces. What if there was a solution that not only made downloading simple and fast but also guaranteed your anonymity and the safety of your data?
                        </p>
                        
                        <p className={styles.heroSub}>
                            This comprehensive guide introduces you to the ultimate anonymous Instagram downloader – a free, secure, and incredibly easy-to-use tool designed to empower you with full control over your Instagram content. Discover how to effortlessly download high-quality photos, videos, and Reels, all while safeguarding your privacy and ensuring a seamless experience.
                        </p>

                        <button 
                            className={styles.ctaButton}
                            onClick={() => document.getElementById('search-tool')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            {ctaText}
                        </button>
                    </div>
                </section>

                {/* 2. Introducing Our Anonymous Instagram Downloader: Your Private Gateway */}
                <section className={styles.searchSection} id="search-tool">
                    <div className={styles.searchWrapper}>
                        <MediaTabs />
                        <InstagramSearch restrictedTo={restrictedTo} />
                        
                        <div className={styles.interactivePath}>
                            <h3>Interactive Download Path</h3>
                            <p>Select your content type to streamline your download experience seamlessly. Our clean, uncluttered interface focuses on immediate action with a clear "Download" Call to Action.</p>
                        </div>
                    </div>
                </section>

                {/* 3. Why You Need an Anonymous Instagram Downloader vs Overcoming It */}
                <section className={styles.sectionAlt}>
                    <div className={styles.container}>
                        <div className={styles.gridTwoCol}>
                            {/* Frustrations */}
                            <div className={styles.card}>
                                <h2>The Frustration of Instagram's Limitations</h2>
                                <ul className={styles.bulletList}>
                                    <li>Instagram's platform lacks a native feature to directly download photos, videos, or reels.</li>
                                    <li>Difficulty in finding reliable, safe, and genuinely free third-party Instagram downloader tools.</li>
                                    <li>Significant concerns about privacy and maintaining anonymity when using online downloaders.</li>
                                    <li>Fear of downloading malware, viruses, or encountering phishing scams from untrustworthy sites.</li>
                                    <li>Experiencing poor quality, pixelated, or compressed downloads from suboptimal tools.</li>
                                    <li>Frustration with complicated interfaces, excessive ads, or confusing steps on competitor sites.</li>
                                </ul>
                            </div>

                            {/* Core Benefits */}
                            <div className={styles.card}>
                                <h2>Unlocking Your Content Freedom: Core Benefits</h2>
                                <ul className={styles.bulletList}>
                                    <li><strong>Anonymity and Privacy Protection:</strong> Download content without leaving a trace or compromising your personal information.</li>
                                    <li><strong>High-Quality Downloads:</strong> Preserve the original resolution and clarity of photos, videos, and Reels.</li>
                                    <li><strong>Speed and Efficiency:</strong> Get your desired content quickly with rapid processing times.</li>
                                    <li><strong>User-Friendly Experience:</strong> An intuitive design ensures anyone can use the tool effortlessly.</li>
                                    <li><strong>No Registration, No Watermarks:</strong> Enjoy a clean, ad-free experience without signing up or dealing with intrusive watermarks.</li>
                                    <li><strong>Cross-Device Compatibility:</strong> Access your downloads on any device, anytime.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. Comprehensive Step-by-Step How-To Guide */}
                <section className={styles.section}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionTitle}>Comprehensive Step-by-Step How-To Guide</h2>
                        <p className={styles.sectionIntro}>Follow these impeccably accurate and user-friendly instructions to ensure you easily unlock your desired content.</p>

                        <div className={styles.stepsBlocks}>
                            <div className={styles.stepBlock}>
                                <h3>Step 1: Find Your Instagram Content</h3>
                                <p>Navigate to the Instagram post (photo, video, Reel, Story) you wish to download.</p>
                                <div className={styles.expertTip}>
                                    <Info size={18} />
                                    <span><strong>Expert Tip: Always Verify Source URL.</strong> Double-check the Instagram post's URL before pasting it into the downloader to ensure you're saving content from the intended source.</span>
                                </div>
                            </div>
                            
                            <div className={styles.stepBlock}>
                                <h3>Step 2: Copy the Instagram Link</h3>
                                <p>On desktop: Click the three dots (...) above the post and select "Copy link."<br/>
                                On mobile: Tap the three dots (...) and then "Link" or "Copy Link."</p>
                            </div>
                            
                            <div className={styles.stepBlock}>
                                <h3>Step 3: Paste into the Downloader</h3>
                                <p>Return to our Anonymous Instagram Downloader. Paste the copied URL into the designated input field.</p>
                            </div>
                            
                            <div className={styles.stepBlock}>
                                <h3>Step 4: Select Quality & Download</h3>
                                <p>Click the "Download" button. The tool will process the link and present available download options (e.g., different resolutions).</p>
                                <div className={styles.expertTip}>
                                    <Info size={18} />
                                    <span><strong>Expert Tip: Prioritize Highest Quality.</strong> If given the option, always select the highest available resolution for downloads to ensure optimal clarity and future-proofing of the content.</span>
                                </div>
                            </div>
                            
                            <div className={styles.stepBlock}>
                                <h3>Step 5: Access Your Downloaded Content</h3>
                                <p>The content will typically download directly to your device's default downloads folder.</p>
                                <div className={styles.expertTip}>
                                    <Info size={18} />
                                    <span><strong>Expert Tip: Review Downloaded Content:</strong> Always preview the downloaded media to ensure it's complete, of the expected quality, and free from any unwanted additions before use.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. Downloading Specific Instagram Content Types */}
                <section className={styles.sectionAlt}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionTitle}>Downloading Specific Instagram Content Types</h2>
                        <div className={styles.gridThreeCol}>
                            <div className={styles.card}>
                                <h3 className={styles.cardTitle}><Download size={20} /> Photos & Carousels</h3>
                                <p className={styles.cardText}>Easily save single images or entire multi-photo carousel posts.</p>
                            </div>
                            <div className={styles.card}>
                                <h3 className={styles.cardTitle}><Download size={20} /> Videos & IGTV</h3>
                                <p className={styles.cardText}>Download standard videos and longer IGTV content in high definition.</p>
                            </div>
                            <div className={styles.card}>
                                <h3 className={styles.cardTitle}><Download size={20} /> Reels</h3>
                                <p className={styles.cardText}>Preserve your favorite short-form videos from Instagram Reels.</p>
                            </div>
                            <div className={styles.card}>
                                <h3 className={styles.cardTitle}><Download size={20} /> Stories</h3>
                                <p className={styles.cardText}>Capture ephemeral Instagram Stories before they disappear (ensure ethical considerations).</p>
                            </div>
                            <div className={styles.card}>
                                <h3 className={styles.cardTitle}><Download size={20} /> Profile Pictures</h3>
                                <p className={styles.cardText}>Download user profile pictures in their highest available resolution.</p>
                            </div>
                        </div>
                        
                        <div className={styles.expertTip} style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
                            <Info size={18} />
                            <span><strong>Expert Tip: Understand File Formats:</strong> Familiarize yourself with common downloaded file formats (e.g., .mp4 for video, .jpg for images) to manage your content effectively post-download.</span>
                        </div>
                    </div>
                </section>

                {/* 6. Key Features & Unbeatable Benefits */}
                <section className={styles.section}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionTitle}>Key Features & Unbeatable Benefits</h2>
                        
                        <div className={styles.gridThreeCol}>
                            {/* Unmatched Anonymity & Privacy */}
                            <div className={styles.card}>
                                <h3 className={styles.cardTitle}><EyeOff size={24} /> The Privacy-First Instagram Downloader</h3>
                                <ul className={styles.bulletList}>
                                    <li><strong>No IP Tracking, No Personal Data Collection:</strong> Your browsing and download activities are never logged or stored.</li>
                                    <li><strong>Secure Connection (HTTPS):</strong> All communication with our service is encrypted, protecting your data in transit.</li>
                                    <li><strong>No Account Login Required:</strong> Use the downloader without ever needing to log into your Instagram account.</li>
                                </ul>
                            </div>
                            
                            {/* Superior Quality & Speed */}
                            <div className={styles.card}>
                                <h3 className={styles.cardTitle}><Zap size={24} /> Superior Quality & Speed</h3>
                                <ul className={styles.bulletList}>
                                    <li><strong>High-Resolution Downloads:</strong> Automatically detects and offers the highest available quality for photos and videos.</li>
                                    <li><strong>Fast Processing & Download Speeds:</strong> Optimized servers ensure quick content retrieval.</li>
                                    <li><strong>No Watermarks:</strong> Enjoy clean, original content without any intrusive branding.</li>
                                </ul>
                            </div>

                            {/* Universal Compatibility & Ease of Use */}
                            <div className={styles.card}>
                                <h3 className={styles.cardTitle}><Smartphone size={24} /> Universal Compatibility</h3>
                                <ul className={styles.bulletList}>
                                    <li><strong>No Registration or Software Installation:</strong> Access the tool directly from your web browser.</li>
                                    <li><strong>Cross-Device Support:</strong> Seamless functionality across desktop, mobile, and tablet devices.</li>
                                    <li><strong>Supported Browsers:</strong> Compatible with all major web browsers (Chrome, Firefox, Safari, Edge).</li>
                                    <li><strong>Mobile Functionality:</strong> Fully functional on mobile operating systems (iOS, Android).</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 7. Your Trust, Our Commitment: Privacy & Security Deep Dive */}
                <section className={styles.sectionAlt}>
                    <div className={styles.container}>
                        <div className={styles.gridTwoCol}>
                            <div className={styles.card}>
                                <h2>Privacy & Anonymity Assurance: Our No-Logging Policy</h2>
                                <p className={styles.cardText}><strong>What Data is (and Isn't) Processed:</strong> We explicitly state that no personal identifying information, IP addresses, or downloaded content logs are kept. Our strict 'no logging' policy is our primary transparent security measure.</p>
                                <p className={styles.cardText}><strong>How Your IP Address is Protected:</strong> We use direct downloads from Instagram's CDN and ensure there is no server-side processing of the user IP for content retrieval.</p>
                                <p className={styles.cardText}><strong>Encryption Protocols (HTTPS):</strong> We use secure HTTPS connections for all user interactions.</p>
                                <div className={styles.expertTip}>
                                    <Info size={18} />
                                    <span><strong>Expert Tip: Consider a VPN for Enhanced Anonymity:</strong> For an additional layer of privacy, particularly if you're concerned about your IP address, use a reputable VPN service while downloading.</span>
                                </div>
                            </div>

                            <div className={styles.card}>
                                <h2>Security & Safety Disclaimer: Protecting You from Threats</h2>
                                <p className={styles.cardText}><strong>No Malware, Viruses, or Phishing Attempts:</strong> We reassure users that our tool is rigorously tested and entirely free from harmful software.</p>
                                <p className={styles.cardText}><strong>No Request for Instagram Login Credentials:</strong> Legitimate downloaders do not ask for private account details. We are committed to regular audits and continuously updating the downloader for compatibility with Instagram's evolving platform.</p>
                                <div className={styles.expertTip}>
                                    <Info size={18} />
                                    <span><strong>Expert Tip: Beware of Login Requests:</strong> Legitimate Instagram downloaders rarely ask for your Instagram login credentials. Be highly suspicious of any tool that requests this information.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 8. Responsible Downloading: Legal & Ethical Usage Guidelines */}
                <section className={styles.section}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionTitle}>Responsible Downloading: Legal & Ethical Usage Guidelines</h2>
                        
                        <div className={styles.gridTwoCol}>
                            <div className={styles.card}>
                                <h2>Understanding Copyright & Fair Use</h2>
                                <ul className={styles.bulletList}>
                                    <li><strong>Personal Use vs. Commercial Use:</strong> It is crucial to distinguish between downloading for private enjoyment/backup and utilizing content for public or commercial purposes.</li>
                                    <li><strong>Attribution & Permissions:</strong> It is vital to credit original creators and obtain explicit permission when re-sharing or modifying content.</li>
                                </ul>
                                <div className={styles.expertTip}>
                                    <Info size={18} />
                                    <span><strong>Expert Tip: Respect Creator Rights:</strong> Before re-sharing or using downloaded content, always seek permission from the original creator and provide proper attribution to avoid copyright infringement.</span>
                                </div>
                            </div>

                            <div className={styles.card}>
                                <h2>Ethical Considerations for Content Creators</h2>
                                <h3 style={{ fontSize: '1.1rem', marginTop: '1rem', color: 'var(--color-white)' }}>From Inspiration to Archive: The Creator's Guide to Ethically Downloading Content</h3>
                                <ul className={styles.bulletList}>
                                    <li><strong>Archiving & Inspiration:</strong> Creators can use the tool to save inspirational content for mood boards or future reference, always respecting the original source.</li>
                                    <li><strong>Content Analysis:</strong> Safely use downloaded public content for studying trends, aesthetics, or engagement strategies.</li>
                                    <li><strong>Avoiding Misinformation:</strong> Ensure downloaded content is used in its original context and not manipulated to spread false information.</li>
                                </ul>
                                <div className={styles.expertTip}>
                                    <Info size={18} />
                                    <span><strong>Expert Tip: Stay Informed on Instagram's TOS:</strong> Be aware that Instagram's Terms of Service can change, which might impact the functionality or legality of third-party downloader tools.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 9. Frequently Asked Questions (FAQ) */}
                <section className={styles.sectionAlt}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionTitle}>Frequently Asked Questions (FAQ)</h2>
                        <div className={styles.faqWrapper}>
                            {faqData.map((faq, index) => (
                                <div key={index} className={`${styles.faqItem} ${openFaq === index ? styles.faqOpen : ''}`}>
                                    <button className={styles.faqButton} onClick={() => toggleFaq(index)} aria-expanded={openFaq === index}>
                                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>{faq.question}</h3>
                                        <div style={{ color: '#00d4ff', transition: 'transform 0.3s', transform: openFaq === index ? 'rotate(180deg)' : 'none' }}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="6 9 12 15 18 9"></polyline>
                                            </svg>
                                        </div>
                                    </button>
                                    <div className={styles.faqAnswer}>
                                        <div className={styles.faqAnswerInner}>
                                            <p style={{ whiteSpace: 'pre-line' }}>{faq.answer}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 10. Start Downloading Anonymously Today! (CTA) */}
                <section className={styles.bottomCta}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionTitle}>Start Downloading Anonymously Today!</h2>
                        <p className={styles.sectionIntro} style={{ color: 'var(--color-white)', fontSize: '1.2rem' }}>
                            <strong>Your Path to Seamless Instagram Content Saving:</strong> Stop letting Instagram's limitations hold you back. Our anonymous downloader offers a reliable, secure, and user-friendly solution to save the content you love.
                        </p>
                        <p className={styles.sectionIntro} style={{ marginBottom: '1rem' }}>
                            <strong>Experience True Content Freedom:</strong> Whether for personal archiving, creative inspiration, or offline viewing, gain control over your Instagram experience.
                        </p>
                        <p className={styles.sectionIntro} style={{ color: '#00d4ff' }}>
                            Ready to get started? Simply copy the link to any public Instagram photo, video, or Reel and paste it into our downloader interface above. It's fast, free, and completely anonymous!
                        </p>
                        
                        <button 
                            className={styles.ctaButton}
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        >
                            Start Downloading Anonymously Today!
                        </button>
                    </div>
                </section>
            </main>

            {footer}
        </div>
    );
}
