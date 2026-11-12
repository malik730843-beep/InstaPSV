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
                            Pick ideas for your next post
                        </h1>
                        <p className={styles.heroSub}>
                            Choose relevant hashtag ideas from a local category list for your Instagram posts.
                            Select by category or keyword, then review each idea before copying. No live popularity data is used.
                        </p>
                        
                        <div className={styles.liveStatus} style={{ display: 'flex', gap: '2rem', justifyContent: 'center', opacity: 0.8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Zap size={16} /> <span>Category-based suggestions</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <ShieldCheck size={16} /> <span>Review tags before publishing</span>
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
                                    <span style={{ fontSize: '0.9rem', opacity: 0.7 }} className={styles.hideMobile}>Review your selected tags</span>
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
                <section className={styles.strategySection}>
                    <div className={`${styles.container} ${styles.textContainer}`}>
                        <div className={styles.sectionHeader}>
                            <h2>The Perfect Hashtag Strategy</h2>
                            <p>Don't just use tags—use a scientifically proven growth strategy.</p>
                        </div>

                        <div className={styles.strategyList}>
                            <div className={styles.strategyBlock}>
                                <div className={styles.strategyIcon} style={{ background: 'rgba(0, 212, 255, 0.1)', color: '#00d4ff' }}>
                                    <Globe size={28} />
                                </div>
                                <div className={styles.strategyContent}>
                                    <h3>Broad topic tags</h3>
                                    <p>Broad topic ideas such as #photography or #travel. This tool does not measure their current post counts.</p>
                                </div>
                            </div>
                            <div className={styles.strategyBlock}>
                                <div className={styles.strategyIcon} style={{ background: 'rgba(121, 40, 202, 0.1)', color: '#7928ca' }}>
                                    <Target size={28} />
                                </div>
                                <div className={styles.strategyContent}>
                                    <h3>Specific topic tags</h3>
                                    <p>More specific topic ideas, such as #streetphotography. Select only those that accurately describe your content.</p>
                                </div>
                            </div>
                            <div className={styles.strategyBlock}>
                                <div className={styles.strategyIcon} style={{ background: 'rgba(255, 0, 128, 0.1)', color: '#ff0080' }}>
                                    <BarChart3 size={28} />
                                </div>
                                <div className={styles.strategyContent}>
                                    <h3>Brand or community tags</h3>
                                    <p>Your unique tags that build community and track user-generated content (e.g., #YourBrand).</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PRO TIPS SECTION */}
                <section className={styles.tipsSection}>
                    <div className={styles.container}>
                        <div className={styles.tipsGrid}>
                            <div className={styles.hideMobile}>
                                <div className={styles.codeBlockWrapper}>
                                    <div className={styles.codeBlockGlow}></div>
                                    <div className={styles.codeBlock}>
                                        <div className={styles.codeHeader}>
                                            <div className={`${styles.codeDot} ${styles.codeDotRed}`}></div>
                                            <div className={`${styles.codeDot} ${styles.codeDotYellow}`}></div>
                                            <div className={`${styles.codeDot} ${styles.codeDotGreen}`}></div>
                                        </div>
                                        <div className={styles.codeContent}>
                                            {"// Example selection workflow"}<br/>
                                            {"const caption = (content) => {"}<br/>
                                            {"  return content"}<br/>
                                            {"    + ' ' + selectedTopicTags"}<br/>
                                            {"    + ' ' + relevantNicheTags"}<br/>
                                            {"    + ' ' + yourBrandTag;"}<br/>
                                            {"};"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.tipsContent}>
                                <h2>Review your hashtag choices</h2>
                                <div className={styles.tipsList}>
                                    <div className={styles.tipItem}>
                                        <div className={styles.tipIcon}><Lightbulb size={24} /></div>
                                        <div className={styles.tipText}>
                                            <p><strong>Describe the subject:</strong> For a night street photo, consider subject and setting tags rather than copying every photography suggestion.</p>
                                        </div>
                                    </div>
                                    <div className={styles.tipItem}>
                                        <div className={styles.tipIcon}><Lightbulb size={24} /></div>
                                        <div className={styles.tipText}>
                                            <p><strong>Stay Relevant:</strong> Remove ideas that do not match the post, its audience or its context. A category match alone is not enough.</p>
                                        </div>
                                    </div>
                                    <div className={styles.tipItem}>
                                        <div className={styles.tipIcon}><Lightbulb size={24} /></div>
                                        <div className={styles.tipText}>
                                            <p><strong>Check the result:</strong> Preview your caption and check that each tag is appropriate in Instagram before publishing.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* HOW TO USE */}
                <section className={styles.howToSection}>
                    <div className={`${styles.container} ${styles.textContainer}`}>
                        <div className={styles.sectionHeader}>
                            <h2>How to Use the Hashtag Generator</h2>
                        </div>
                        <div className={styles.howToList}>
                            <div className={styles.howToItem}>
                                <div className={styles.howToNum}>1</div>
                                <div className={styles.howToContent}>
                                    <h3>Select Your Industry</h3>
                                    <p>Choose a category to load suggestions from the bundled list. These are not live trend measurements.</p>
                                </div>
                            </div>
                            <div className={styles.howToItem}>
                                <div className={styles.howToNum}>2</div>
                                <div className={styles.howToContent}>
                                    <h3>Curate Your Strategy</h3>
                                    <p>Select only relevant tags. Check the current limit shown in Instagram when composing your post.</p>
                                </div>
                            </div>
                            <div className={styles.howToItem}>
                                <div className={styles.howToNum}>3</div>
                                <div className={styles.howToContent}>
                                    <h3>Export & Go Live</h3>
                                    <p>Copy your selection, review it in Instagram and remove any tag that does not describe the post.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ SECTION */}
                <section className={styles.faqSection}>
                    <div className={`${styles.container} ${styles.textContainer}`}>
                        <div className={styles.sectionHeader}>
                            <h2>Frequently Asked Questions</h2>
                        </div>
                        <div className={styles.faqList}>
                            <div className={styles.faqItem}>
                                <h4>How many hashtags should I use?</h4>
                                <p>Use only the tags that accurately describe your post and fit the current limit shown by Instagram. This tool does not establish an optimal count or predict performance.</p>
                            </div>
                            <div className={styles.faqItem}>
                                <h4>Are these tags checked against live restrictions?</h4>
                                <p>No. Suggestions come from a local list, and restrictions can change. Check each tag in Instagram before publishing. No hashtag list can guarantee reach or account safety.</p>
                            </div>
                            <div className={styles.faqItem}>
                                <h4>Should I put hashtags in the caption or comments?</h4>
                                <p>Choose a placement that keeps your post readable and follows the options currently supported by Instagram. This tool does not measure a performance difference between placements.</p>
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
