'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { 
    Hash, 
    Copy, 
    CheckCircle2, 
    Zap, 
    Search, 
    TrendingUp,
    Dumbbell,
    Plane,
    Utensils,
    Cpu,
    Shirt,
    Briefcase,
    Palette,
    PawPrint,
    Mountain,
    ShieldCheck, 
    Smartphone, 
    Globe, 
    AlertCircle,
    TrendingDown,
    Camera,
    Gamepad2,
    Coins,
    Music2,
    Heart,
    Home,
    Book,
    Film,
    GraduationCap,
    HeartPulse,
    Compass,
    Castle,
    Car,
    Sparkles,
    Baby,
    DollarSign,
    Leaf,
    Wind,
    Trophy,
    PenTool,
    Trash2,
    Lightbulb,
    Target,
    BarChart3
} from 'lucide-react';
import MediaTabs from '@/components/ui/MediaTabs';
import { HASHTAG_CATEGORIES, getRandomHashtags } from '@/lib/hashtag-data';
import styles from './HashtagGenerator.module.css';

const ParticleBackground = dynamic(() => import('@/components/ui/ParticleBackground'), { ssr: false });

interface HashtagGeneratorContentProps {
    header: React.ReactNode;
    footer: React.ReactNode;
}

const getCategoryIcon = (id: string) => {
    switch (id) {
        case 'popular': return <TrendingUp size={18} />;
        case 'fitness': return <Dumbbell size={18} />;
        case 'travel': return <Plane size={18} />;
        case 'food': return <Utensils size={18} />;
        case 'tech': return <Cpu size={18} />;
        case 'fashion': return <Shirt size={18} />;
        case 'business': return <Briefcase size={18} />;
        case 'art': return <Palette size={18} />;
        case 'pets': return <PawPrint size={18} />;
        case 'nature': return <Mountain size={18} />;
        case 'photography': return <Camera size={18} />;
        case 'gaming': return <Gamepad2 size={18} />;
        case 'crypto': return <Coins size={18} />;
        case 'music': return <Music2 size={18} />;
        case 'wedding': return <Heart size={18} />;
        case 'realestate': return <Home size={18} />;
        case 'books': return <Book size={18} />;
        case 'movies': return <Film size={18} />;
        case 'education': return <GraduationCap size={18} />;
        case 'health': return <HeartPulse size={18} />;
        case 'motivation': return <Compass size={18} />;
        case 'architecture': return <Castle size={18} />;
        case 'automotive': return <Car size={18} />;
        case 'beauty': return <Sparkles size={18} />;
        case 'parenting': return <Baby size={18} />;
        case 'finance': return <DollarSign size={18} />;
        case 'gardening': return <Leaf size={18} />;
        case 'yoga': return <Wind size={18} />;
        case 'sports': return <Trophy size={18} />;
        case 'writing': return <PenTool size={18} />;
        default: return <Hash size={18} />;
    }
};

const FEATURED_CATEGORY_IDS = [
    'popular', 'fitness', 'travel', 'food', 'tech', 'fashion', 'business', 'nature'
];

export default function HashtagGeneratorContent({ header, footer }: HashtagGeneratorContentProps) {
    const [activeCategoryId, setActiveCategoryId] = useState('popular');
    const [hashtags, setHashtags] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
    const [showToast, setShowToast] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) {
            const category = HASHTAG_CATEGORIES.find(c => c.id === activeCategoryId);
            if (category) setHashtags(category.hashtags);
            return;
        }

        // 1. Check for Category Match (Fast Paste Detection)
        const categoryMatch = HASHTAG_CATEGORIES.find(c => 
            c.name.toLowerCase() === query || c.id === query
        );
        if (categoryMatch) {
            setActiveCategoryId(categoryMatch.id);
            setHashtags(categoryMatch.hashtags);
            return;
        }

        // 2. Global Hashtag Search across all categories
        const allTags = new Set<string>();
        HASHTAG_CATEGORIES.forEach(cat => {
            cat.hashtags.forEach(tag => {
                if (tag.toLowerCase().includes(query)) {
                    allTags.add(tag);
                }
            });
        });

        // If we found global matches, show them. 
        // If not, stick to the current category filtering (which will show empty results)
        if (allTags.size > 0) {
            setHashtags(Array.from(allTags));
        } else {
            const category = HASHTAG_CATEGORIES.find(c => c.id === activeCategoryId);
            if (category) setHashtags(category.hashtags.filter(t => t.toLowerCase().includes(query)));
        }
    }, [activeCategoryId, searchQuery]);

    const toggleTag = (tag: string) => {
        const next = new Set(selectedTags);
        if (next.has(tag)) {
            next.delete(tag);
        } else {
            next.add(tag);
        }
        setSelectedTags(next);
    };

    const copyToClipboard = () => {
        const text = Array.from(selectedTags).map(t => `#${t}`).join(' ');
        if (!text) return;
        
        navigator.clipboard.writeText(text).then(() => {
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
        });
    };

    const copyAll = () => {
        const text = hashtags.map(t => `#${t}`).join(' ');
        navigator.clipboard.writeText(text).then(() => {
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
        });
    };

    const clearAll = () => {
        setSelectedTags(new Set());
    };

    return (
        <div className={styles.page}>
            {header}

            <main>
                {/* HERO SECTION */}
                <section className={styles.hero}>
                    <ParticleBackground className={styles.particles} />
                    <div className={styles.heroContent}>
                        <h1 className={styles.heroTitle}>
                            Instagram <span className={styles.highlight}>Hashtag Generator</span><br />
                            Boost Your Reach Instantly
                        </h1>
                        <p className={styles.heroSub}>
                            Discover the most effective, trending hashtags for your Instagram posts. 
                            Select by category or search by keyword to skyrocket your engagement 100% free.
                        </p>
                        
                        <div className={styles.liveStatus} style={{ display: 'flex', gap: '2rem', justifyContent: 'center', opacity: 0.8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Zap size={16} /> <span>AI-Powered Categorization</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <ShieldCheck size={16} /> <span>100% Shadowban Safe</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* GENERATOR TOOL SECTION */}
                <section className={styles.generatorSection}>
                    <div className={styles.generatorCard}>
                        {/* Search Bar */}
                        <div style={{ position: 'relative', marginBottom: '2rem' }}>
                            <span style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>
                                <Search size={20} />
                            </span>
                            <input 
                                type="text"
                                placeholder="Paste a category (e.g. Gaming) or search any keyword..."
                                className={styles.searchInput}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Category Pills */}
                        <div className={styles.categoryList}>
                            {HASHTAG_CATEGORIES
                                .filter(cat => 
                                    FEATURED_CATEGORY_IDS.includes(cat.id) || 
                                    activeCategoryId === cat.id
                                )
                                .map(category => (
                                    <button 
                                        key={category.id}
                                        className={`${styles.categoryBtn} ${activeCategoryId === category.id ? styles.activeCategory : ''}`}
                                        onClick={() => {
                                            setActiveCategoryId(category.id);
                                            setSearchQuery('');
                                        }}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                    >
                                        {getCategoryIcon(category.id)}
                                        {category.name}
                                    </button>
                                ))
                            }
                        </div>

                        {/* Hashtag Cloud */}
                        <div className={styles.hashtagCloud}>
                            {hashtags.map(tag => (
                                <div 
                                    key={tag}
                                    className={`${styles.hashtagBadge} ${selectedTags.has(tag) ? styles.selected : ''}`}
                                    onClick={() => toggleTag(tag)}
                                    title={selectedTags.has(tag) ? "Click to deselect" : "Click to select"}
                                >
                                    #{tag}
                                </div>
                            ))}
                            {hashtags.length === 0 && (
                                <div style={{ width: '100%', textAlign: 'center', padding: '3rem', opacity: 0.5 }}>
                                    No hashtags found for "{searchQuery}"
                                </div>
                            )}
                        </div>

                        {/* SELECTION SUMMARY BAR */}
                        {selectedTags.size > 0 && (
                            <div className={styles.selectionBar}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div className={styles.countBadge}>{selectedTags.size} Tags</div>
                                    <span style={{ fontSize: '0.9rem', opacity: 0.7 }} className={styles.hideMobile}>Ready to boost your post</span>
                                </div>
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <button 
                                        onClick={clearAll}
                                        style={{ background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#fff', padding: '0.6rem 1.2rem', borderRadius: '2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                    >
                                        <Trash2 size={16} /> Clear
                                    </button>
                                    <button 
                                        onClick={copyToClipboard}
                                        style={{ background: 'var(--gradient-primary)', border: 'none', color: '#fff', padding: '0.6rem 1.5rem', borderRadius: '2rem', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                    >
                                        <Copy size={16} /> Copy Selected
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className={styles.actions}>
                            <button 
                                className={styles.copyBtn} 
                                onClick={copyToClipboard}
                                disabled={selectedTags.size === 0}
                            >
                                <Copy size={20} /> 
                                Copy Selected <span className={styles.countBadge}>{selectedTags.size}</span>
                            </button>
                            <button 
                                className={styles.copyBtn} 
                                style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)' }}
                                onClick={copyAll}
                            >
                                <Copy size={20} /> Copy All Category
                            </button>
                        </div>
                    </div>
                </section>

                {/* STRATEGY SECTION */}
                <section style={{ padding: '100px 0', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <div className={styles.container} style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>
                        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>The Perfect Hashtag Strategy</h2>
                            <p style={{ opacity: 0.7 }}>Don't just use tags—use a scientifically proven growth strategy.</p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
                            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '2.5rem', borderRadius: '2rem', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                <div style={{ background: 'rgba(0, 212, 255, 0.1)', color: '#00d4ff', width: '56px', height: '56px', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                    <Globe size={28} />
                                </div>
                                <h3 style={{ marginBottom: '1rem' }}>Broad Tags (3-5)</h3>
                                <p style={{ opacity: 0.7 }}>High-volume hashtags (1M+ posts) that establish your general theme (e.g., #photography, #travel).</p>
                            </div>
                            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '2.5rem', borderRadius: '2rem', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                <div style={{ background: 'rgba(121, 40, 202, 0.1)', color: '#7928ca', width: '56px', height: '56px', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                    <Target size={28} />
                                </div>
                                <h3 style={{ marginBottom: '1rem' }}>Niche Tags (5-10)</h3>
                                <p style={{ opacity: 0.7 }}>Medium-volume tags (100k-500k) where your specific audience hangs out (e.g., #streetphotography).</p>
                            </div>
                            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '2.5rem', borderRadius: '2rem', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                <div style={{ background: 'rgba(255, 0, 128, 0.1)', color: '#ff0080', width: '56px', height: '56px', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                    <BarChart3 size={28} />
                                </div>
                                <h3 style={{ marginBottom: '1rem' }}>Branded Tags (1-2)</h3>
                                <p style={{ opacity: 0.7 }}>Your unique tags that build community and track user-generated content (e.g., #YourBrand).</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PRO TIPS SECTION */}
                <section style={{ padding: '80px 0', background: 'rgba(255, 255, 255, 0.01)' }}>
                    <div className={styles.container} style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
                            <div className={styles.hideMobile}>
                                <div style={{ position: 'relative' }}>
                                    <div style={{ position: 'absolute', inset: '-20px', background: 'var(--gradient-primary)', opacity: 0.2, filter: 'blur(40px)', borderRadius: '2rem' }}></div>
                                    <div style={{ position: 'relative', background: 'var(--glass-bg)', padding: '3rem', borderRadius: '2rem', border: '1px solid var(--glass-border)' }}>
                                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }}></div>
                                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }}></div>
                                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }}></div>
                                        </div>
                                        <div style={{ fontFamily: 'monospace', color: '#00d4ff', fontSize: '1.1rem' }}>
                                            {"// Perfect Post Formula"}<br/>
                                            {"const reach = (content) => {"}<br/>
                                            {"  return content"}<br/>
                                            {"    + ' ' + highVolumeTags(5)"}<br/>
                                            {"    + ' ' + nicheTags(10)"}<br/>
                                            {"    + ' ' + brandedTag(1);"}<br/>
                                            {"};"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Engagement Pro-Tips</h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <div style={{ color: '#00d4ff', flexShrink: 0 }}><Lightbulb size={24} /></div>
                                        <p style={{ opacity: 0.8 }}><strong>Mix Tag Sizes:</strong> Don't just use 1M+ hashtags. You'll get buried. Use 50% niche tags to stay at the top longer.</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <div style={{ color: '#00d4ff', flexShrink: 0 }}><Lightbulb size={24} /></div>
                                        <p style={{ opacity: 0.8 }}><strong>Stay Relevant:</strong> Only use tags that actually match your photo. Instagram's AI scans your image and detects irrelevant tags.</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <div style={{ color: '#00d4ff', flexShrink: 0 }}><Lightbulb size={24} /></div>
                                        <p style={{ opacity: 0.8 }}><strong>Hide Your Tags:</strong> Use dots or spaces to push hashtags down in your caption so it looks cleaner for followers.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* HOW TO USE */}
                <section style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '80px 0' }}>
                    <div className={styles.container} style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem' }}>
                        <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>How to Use the Hashtag Generator</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                                <div style={{ background: 'var(--gradient-primary)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 'bold', fontSize: '1.25rem', boxShadow: '0 0 20px rgba(255, 0, 128, 0.3)' }}>1</div>
                                <div>
                                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Select Your Industry</h3>
                                    <p style={{ opacity: 0.7, fontSize: '1.1rem' }}>Choose the high-intent category that best aligns with your content to load curated trending hashtags.</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                                <div style={{ background: 'var(--gradient-primary)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 'bold', fontSize: '1.25rem', boxShadow: '0 0 20px rgba(255, 0, 128, 0.3)' }}>2</div>
                                <div>
                                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Curate Your Strategy</h3>
                                    <p style={{ opacity: 0.7, fontSize: '1.1rem' }}>Manually select the most relevant tags. We recommend a balanced strategy of 10-15 highly targeted hashtags.</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                                <div style={{ background: 'var(--gradient-primary)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 'bold', fontSize: '1.25rem', boxShadow: '0 0 20px rgba(255, 0, 128, 0.3)' }}>3</div>
                                <div>
                                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Export & Go Live</h3>
                                    <p style={{ opacity: 0.7, fontSize: '1.1rem' }}>Copy your curated list instantly and integrate them into your post caption for immediate discovery.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ SECTION */}
                <section style={{ padding: '80px 0' }}>
                    <div className={styles.container} style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem' }}>
                        <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Frequently Asked Questions</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                <h4 style={{ color: '#00d4ff', marginBottom: '0.5rem' }}>How many hashtags should I use?</h4>
                                <p style={{ opacity: 0.7 }}>While Instagram allows up to 30 hashtags, recent data suggests that using 10-15 highly targeted tags is more effective than using the maximum amount of generic ones.</p>
                            </div>
                            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                <h4 style={{ color: '#00d4ff', marginBottom: '0.5rem' }}>What is a shadowban?</h4>
                                <p style={{ opacity: 0.7 }}>A shadowban is when Instagram limits your content's reach. This usually happens when you use banned or repetitive hashtags. Our list is regularly updated to include only safe, engagement-boosting tags.</p>
                            </div>
                            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                <h4 style={{ color: '#00d4ff', marginBottom: '0.5rem' }}>Should I put hashtags in the caption or comments?</h4>
                                <p style={{ opacity: 0.7 }}>Both work! Placing them in the caption is better for searchability, while placing them in the first comment keeps your caption look cleaner. The performance difference is minimal.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* TOAST NOTIFICATION */}
            {showToast && (
                <div className={styles.toast}>
                    <CheckCircle2 size={20} /> Copied to clipboard!
                </div>
            )}

            {footer}
        </div>
    );
}
