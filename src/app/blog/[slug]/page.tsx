import Link from 'next/link';
import { notFound } from 'next/navigation';
import styles from './page.module.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Mock blog posts with full content
const mockPosts = [
    {
        id: 1,
        slug: 'how-to-view-instagram-stories-anonymously',
        title: 'How to View Instagram Stories Anonymously in 2024',
        content: `
            <p>Instagram stories have become one of the most popular features on the platform, with over 500 million daily active users. However, many users want to view stories without letting the poster know they've watched it. In this comprehensive guide, we'll show you exactly how to do that.</p>
            
            <h2>Why View Stories Anonymously?</h2>
            <p>There are many legitimate reasons why someone might want to view Instagram stories anonymously:</p>
            <ul>
                <li><strong>Market Research:</strong> Businesses often need to monitor competitors without alerting them</li>
                <li><strong>Personal Privacy:</strong> Sometimes you want to check on someone without the social pressure of them knowing</li>
                <li><strong>Professional Investigations:</strong> Journalists and researchers may need to gather information discretely</li>
                <li><strong>Avoiding Awkward Situations:</strong> You might want to see an ex's story without them knowing</li>
            </ul>
            
            <h2>Method 1: Using InstaPSV (Recommended)</h2>
            <p>The easiest and most reliable way to view Instagram stories anonymously is using InstaPSV. Here's how:</p>
            <ol>
                <li>Go to InstaPSV.com</li>
                <li>Enter the Instagram username in the search box</li>
                <li>Click "View Profile"</li>
                <li>Browse their stories without being detected</li>
            </ol>
            <p>InstaPSV works by accessing publicly available content without requiring you to log in with your Instagram account. This means your identity is never revealed to the story poster.</p>
            
            <h2>Method 2: Airplane Mode Trick</h2>
            <p>This method works by loading the story while connected, then viewing it offline:</p>
            <ol>
                <li>Open Instagram and wait for stories to load</li>
                <li>Turn on Airplane Mode</li>
                <li>View the stories</li>
                <li>Close Instagram completely</li>
                <li>Turn off Airplane Mode</li>
            </ol>
            <p><strong>Warning:</strong> This method is unreliable and doesn't always work with newer Instagram versions.</p>
            
            <h2>Method 3: Create a Burner Account</h2>
            <p>Some users create secondary Instagram accounts specifically for anonymous viewing. However, this method has several drawbacks:</p>
            <ul>
                <li>Time-consuming to set up and maintain</li>
                <li>May violate Instagram's terms of service</li>
                <li>The account might get flagged or banned</li>
            </ul>
            
            <h2>Conclusion</h2>
            <p>While there are various methods to view Instagram stories anonymously, using a dedicated tool like InstaPSV is the most reliable and convenient option. It requires no account creation, works instantly, and keeps your viewing completely anonymous.</p>
        `,
        category: 'Tutorials',
        date: '2024-01-15',
        readTime: 5,
        author: 'InstaPSV Team',
    },
    {
        id: 2,
        slug: 'instagram-followers-growth-tips',
        title: '10 Proven Tips to Grow Your Instagram Followers',
        content: `
            <p>Growing your Instagram following organically takes time and strategy. In this guide, we'll share 10 proven tips that actual influencers and brands use to grow their audience.</p>
            
            <h2>1. Optimize Your Profile</h2>
            <p>Your profile is your first impression. Make sure you have:</p>
            <ul>
                <li>A clear, high-quality profile picture</li>
                <li>A compelling bio that tells people who you are</li>
                <li>A link to your website or landing page</li>
                <li>A consistent username across platforms</li>
            </ul>
            
            <h2>2. Post Consistently</h2>
            <p>The Instagram algorithm favors accounts that post regularly. Aim for at least 1 post per day and 3-5 stories. Use a content calendar to plan ahead.</p>
            
            <h2>3. Use Relevant Hashtags</h2>
            <p>Hashtags help people discover your content. Use a mix of:</p>
            <ul>
                <li>Popular hashtags (1M+ posts)</li>
                <li>Medium hashtags (100K-1M posts)</li>
                <li>Niche hashtags (under 100K posts)</li>
            </ul>
            
            <h2>4. Engage With Your Audience</h2>
            <p>Reply to every comment and DM. The more you engage, the more the algorithm will show your content to others.</p>
            
            <h2>5. Collaborate With Others</h2>
            <p>Partner with other creators in your niche for shoutouts, takeovers, or collaborative content.</p>
            
            <h2>6. Post at Optimal Times</h2>
            <p>Use Instagram Insights to find when your audience is most active. Generally, posting between 11am-1pm and 7pm-9pm works well.</p>
            
            <h2>7. Create Shareable Content</h2>
            <p>Make content that people want to share with their friends - infographics, quotes, memes, and valuable tips.</p>
            
            <h2>8. Use Instagram Reels</h2>
            <p>Reels get significantly more reach than regular posts. Create entertaining, educational, or trending Reels content.</p>
            
            <h2>9. Go Live Regularly</h2>
            <p>Instagram Live videos appear at the front of the Stories bar and send notifications to your followers.</p>
            
            <h2>10. Analyze and Adapt</h2>
            <p>Regularly check your analytics to see what's working and adjust your strategy accordingly.</p>
        `,
        category: 'Growth',
        date: '2024-01-12',
        readTime: 8,
        author: 'InstaPSV Team',
    },
    {
        id: 3,
        slug: 'download-instagram-reels-guide',
        title: 'Complete Guide to Downloading Instagram Reels',
        content: `
            <p>Instagram Reels are short, entertaining videos that have taken the platform by storm. While Instagram doesn't provide a native download option, there are several ways to save Reels to your device.</p>
            
            <h2>Why Download Instagram Reels?</h2>
            <ul>
                <li>Save content for offline viewing</li>
                <li>Create compilations or reaction videos</li>
                <li>Archive your favorite content</li>
                <li>Share on other platforms</li>
            </ul>
            
            <h2>Method 1: Using InstaPSV</h2>
            <p>The easiest way to download Reels is using InstaPSV:</p>
            <ol>
                <li>Copy the Reel's URL from Instagram</li>
                <li>Paste it into InstaPSV's search bar</li>
                <li>Click the download button</li>
                <li>Save to your device</li>
            </ol>
            
            <h2>Method 2: Screen Recording</h2>
            <p>You can use your phone's built-in screen recording feature, though this may result in lower quality.</p>
            
            <h2>Important Notes</h2>
            <p>Always respect copyright and ask permission before reposting someone else's content. Give credit to the original creator when sharing.</p>
        `,
        category: 'Tutorials',
        date: '2024-01-10',
        readTime: 4,
        author: 'InstaPSV Team',
    },
    {
        id: 4,
        slug: 'instagram-algorithm-explained',
        title: 'Instagram Algorithm 2024: Everything You Need to Know',
        content: `
            <p>Understanding the Instagram algorithm is crucial for anyone looking to grow their presence on the platform. In 2024, Instagram uses a sophisticated AI-powered system to determine what content appears in your feed.</p>
            
            <h2>How the Algorithm Works</h2>
            <p>The algorithm considers several key factors:</p>
            <ul>
                <li><strong>Interest:</strong> How likely you are to care about the post</li>
                <li><strong>Timeliness:</strong> How recent the post is</li>
                <li><strong>Relationship:</strong> How close you are to the poster</li>
                <li><strong>Frequency:</strong> How often you open Instagram</li>
                <li><strong>Following:</strong> How many accounts you follow</li>
                <li><strong>Usage:</strong> How much time you spend on Instagram</li>
            </ul>
            
            <h2>Feed Algorithm vs Stories Algorithm</h2>
            <p>Instagram uses different algorithms for different sections. The feed prioritizes content from accounts you interact with most, while Stories prioritizes recency.</p>
            
            <h2>Reels Algorithm</h2>
            <p>The Reels algorithm is designed to surface entertaining content from accounts you don't follow. It considers watch time, shares, and engagement.</p>
            
            <h2>Tips to Work With the Algorithm</h2>
            <ol>
                <li>Post when your audience is active</li>
                <li>Encourage saves and shares</li>
                <li>Use all Instagram features (Stories, Reels, Live)</li>
                <li>Respond to comments quickly</li>
                <li>Create content that sparks conversations</li>
            </ol>
        `,
        category: 'Insights',
        date: '2024-01-08',
        readTime: 10,
        author: 'InstaPSV Team',
    },
    {
        id: 5,
        slug: 'best-instagram-viewer-tools',
        title: 'Top 5 Instagram Viewer Tools Compared',
        content: `
            <p>There are many Instagram viewer tools available online. In this comprehensive comparison, we'll look at the top 5 options and help you choose the best one for your needs.</p>
            
            <h2>1. InstaPSV (Best Overall)</h2>
            <p><strong>Rating: ⭐⭐⭐⭐⭐</strong></p>
            <p>InstaPSV offers the most comprehensive feature set with a clean interface. It supports viewing stories, profiles, posts, and downloading content - all without requiring a login.</p>
            <ul>
                <li>✅ No login required</li>
                <li>✅ Story viewing</li>
                <li>✅ Profile browsing</li>
                <li>✅ Download support</li>
                <li>✅ Completely free</li>
            </ul>
            
            <h2>2. Tool B</h2>
            <p><strong>Rating: ⭐⭐⭐⭐</strong></p>
            <p>A solid alternative with good features but limited download options.</p>
            
            <h2>3. Tool C</h2>
            <p><strong>Rating: ⭐⭐⭐</strong></p>
            <p>Basic functionality but contains ads and limited features.</p>
            
            <h2>4. Tool D</h2>
            <p><strong>Rating: ⭐⭐</strong></p>
            <p>Requires account creation and has privacy concerns.</p>
            
            <h2>5. Tool E</h2>
            <p><strong>Rating: ⭐⭐</strong></p>
            <p>Unreliable and often doesn't work with recent Instagram updates.</p>
            
            <h2>Conclusion</h2>
            <p>InstaPSV stands out as the best option for anonymous Instagram viewing with its combination of features, ease of use, and reliability.</p>
        `,
        category: 'Reviews',
        date: '2024-01-05',
        readTime: 6,
        author: 'InstaPSV Team',
    },
    {
        id: 6,
        slug: 'instagram-privacy-tips',
        title: 'Protect Your Privacy on Instagram: Essential Tips',
        content: `
            <p>In an age where digital privacy is increasingly important, here's how to protect yourself on Instagram.</p>
            
            <h2>1. Make Your Account Private</h2>
            <p>Go to Settings > Privacy > Account Privacy and turn on "Private Account". This means only approved followers can see your content.</p>
            
            <h2>2. Review Your Followers Regularly</h2>
            <p>Periodically check your follower list and remove any accounts you don't recognize or trust.</p>
            
            <h2>3. Limit Story Sharing</h2>
            <p>Use Close Friends for sensitive content. Go to Settings > Privacy > Story to control who can see your stories.</p>
            
            <h2>4. Disable Activity Status</h2>
            <p>Turn off "Show Activity Status" so others can't see when you're online.</p>
            
            <h2>5. Be Careful With Location Tags</h2>
            <p>Avoid tagging your current location in real-time. Post location-tagged content after you've left the location.</p>
            
            <h2>6. Review Connected Apps</h2>
            <p>Go to Settings > Security > Apps and Websites to see what third-party apps have access to your account.</p>
            
            <h2>7. Enable Two-Factor Authentication</h2>
            <p>Add an extra layer of security to prevent unauthorized access to your account.</p>
            
            <h2>8. Be Mindful of What You Share</h2>
            <p>Think twice before posting personal information like your address, phone number, or daily routine.</p>
        `,
        category: 'Privacy',
        date: '2024-01-02',
        readTime: 7,
        author: 'InstaPSV Team',
    },
];

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const post = mockPosts.find((p) => p.slug === slug);

    if (!post) {
        return { title: 'Post Not Found' };
    }

    return {
        title: `${post.title} - InstaPSV Blog`,
        description: post.content.replace(/<[^>]*>/g, '').slice(0, 160),
    };
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;
    const post = mockPosts.find((p) => p.slug === slug);

    if (!post) {
        notFound();
    }

    // Get recent posts excluding current
    const recentPosts = mockPosts.filter((p) => p.slug !== slug).slice(0, 3);

    return (
        <>
            <Header />
            <main className={styles.main}>
                <article className={styles.article}>
                    <div className={styles.container}>
                        {/* Header */}
                        <header className={styles.header}>
                            <Link href="/blog" className={styles.backLink}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M19 12H5M12 19l-7-7 7-7" />
                                </svg>
                                Back to Blog
                            </Link>
                            <span className={styles.category}>{post.category}</span>
                            <h1 className={styles.title}>{post.title}</h1>
                            <div className={styles.meta}>
                                <span className={styles.author}>By {post.author}</span>
                                <span className={styles.divider}>•</span>
                                <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                <span className={styles.divider}>•</span>
                                <span>{post.readTime} min read</span>
                            </div>
                        </header>

                        {/* Featured Image */}
                        <div className={styles.featuredImage}>
                            <div className={styles.imagePlaceholder}>
                                <span>📸</span>
                            </div>
                        </div>

                        {/* Content */}
                        <div
                            className={styles.content}
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {/* Share */}
                        <div className={styles.share}>
                            <span>Share this article:</span>
                            <div className={styles.shareButtons}>
                                <button className={styles.shareBtn} aria-label="Share on Twitter">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                </button>
                                <button className={styles.shareBtn} aria-label="Share on Facebook">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </button>
                                <button className={styles.shareBtn} aria-label="Copy link">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                                        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </article>

                {/* Recent Posts Section */}
                <section className={styles.recentSection}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionTitle}>
                            Recent <span className={styles.highlight}>Posts</span>
                        </h2>
                        <div className={styles.recentPosts}>
                            {recentPosts.map((recentPost) => (
                                <Link key={recentPost.id} href={`/blog/${recentPost.slug}`} className={styles.recentCard}>
                                    <div className={styles.recentImage}>
                                        <span>📸</span>
                                    </div>
                                    <div className={styles.recentContent}>
                                        <span className={styles.recentCategory}>{recentPost.category}</span>
                                        <h3 className={styles.recentTitle}>{recentPost.title}</h3>
                                        <span className={styles.recentMeta}>{recentPost.readTime} min read</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className={styles.cta}>
                    <div className={styles.container}>
                        <h2>Ready to Try InstaPSV?</h2>
                        <p>View Instagram profiles, stories, and followers anonymously. 100% free, no login required.</p>
                        <Link href="/" className={styles.ctaBtn}>
                            Start Viewing Now
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
