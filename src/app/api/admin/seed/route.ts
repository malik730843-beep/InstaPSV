import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Create a Supabase client with the SERVICE ROLE KEY to bypass RLS and access auth.admin
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

const dummyPosts = [
    {
        title: "How to View Instagram Stories Anonymously in 2025",
        slug: "how-to-view-instagram-stories-anonymously",
        excerpt: "Learn the top methods to watch Instagram Stories without anyone knowing. Protect your privacy with these simple tricks.",
        content: "<h2>Why View Stories Anonymously?</h2><p>In the age of digital transparency, sometimes you want to keep your viewing habits private. Whether it's for competitive research or just personal curiosity, anonymous viewing is a growing need.</p><h3>Method 1: Use a Third-Party Viewer</h3><p>Tools like InstaPSV allow you to enter a username and view stories without logging in. This is the safest method as it leaves no trace.</p>",
        featured_image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
        status: "published",
        categories: []
    },
    {
        title: "Instagram Analytics 101: Growth Metrics",
        slug: "instagram-analytics-growth-metrics",
        excerpt: "Understand the key metrics that drive Instagram growth. Engagement rate, reach, and impressions explained.",
        content: "<h2>Understanding Reach vs Impressions</h2><p>Reach is the number of unique accounts that saw your post. Impressions are the total number of times your post was seen.</p>",
        featured_image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&q=80",
        status: "published",
        categories: []
    },
    {
        title: "The Ultimate Guide to Instagram Reels",
        slug: "ultimate-guide-instagram-reels",
        excerpt: "Master the art of short-form video content. Tips for viral reach and engagement on Instagram Reels.",
        content: "<h2>Hook Your Audience Fast</h2><p>You have 3 seconds to grab attention. Use text overlays and dynamic movement.</p>",
        featured_image: "https://images.unsplash.com/photo-1611262588024-d12430b98920?w=800&q=80",
        status: "published",
        categories: []
    }
];

const dummyPages = [
    {
        title: "About InstaPSV",
        slug: "about",
        status: "published",
        content: `
            <h2>Our Story</h2>
            <p>InstaPSV was founded in 2023 with a simple idea: make Instagram content accessible to everyone without requiring an account or login. We noticed that many people wanted to view Instagram profiles, stories, and posts anonymously for various legitimate reasons - from market research to simply checking out content without the social pressure of being tracked.</p>
            <p>Today, InstaPSV serves millions of users worldwide who trust us to provide fast, reliable, and completely anonymous access to public Instagram content.</p>
            
            <h2>Our Mission</h2>
            <p>Our mission is to democratize access to public social media content while respecting user privacy. We believe that publicly shared content should be viewable without requiring account creation or tracking.</p>
            
            <h2>What We Offer</h2>
            <ul>
                <li><strong>Story Viewer</strong> - Watch Instagram stories anonymously without leaving a trace</li>
                <li><strong>Profile Viewer</strong> - Browse any public Instagram profile without an account</li>
                <li><strong>Followers Parser</strong> - View complete follower and following lists</li>
                <li><strong>Content Download</strong> - Save photos, videos, and stories to your device</li>
                <li><strong>Reels Viewer</strong> - Watch and download Instagram Reels in HD quality</li>
            </ul>
        `,
        meta_title: "About Us - InstaPSV",
        meta_description: "Learn about InstaPSV, the free Instagram viewer tool. Our mission, team, and commitment to privacy."
    },
    {
        title: "Privacy Policy",
        slug: "privacy-policy", // Standardized slug
        status: "published",
        content: `
            <h2>1. Introduction</h2>
            <p>Welcome to InstaPSV ("we," "our," or "us"). We are committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and services.</p>
            
            <h2>2. Information We Collect</h2>
            <p><strong>Information You Provide:</strong> We do not require you to create an account or provide personal information to use our services. If you contact us, we may collect your email address and any information you include in your message.</p>
            <p><strong>Automatically Collected Information:</strong> When you visit our website, we may automatically collect certain information, including IP address (anonymized), browser type, device type, pages visited, and referring website.</p>
            
            <h2>3. How We Use Your Information</h2>
            <p>We use the collected information to provide and maintain our services, improve user experience, analyze usage patterns, respond to inquiries, and detect/prevent fraud.</p>
            
            <h2>4. Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please contact us at: <a href="mailto:privacy@instapsv.com">privacy@instapsv.com</a>.</p>
        `,
        meta_title: "Privacy Policy - InstaPSV",
        meta_description: "Read our privacy policy to understand how InstaPSV protects your data and privacy."
    },
    {
        title: "Terms of Service",
        slug: "terms-of-use", // Standardized slug
        status: "published",
        content: `
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing and using InstaPSV ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Service.</p>
            
            <h2>2. Description of Service</h2>
            <p>InstaPSV provides tools to view publicly available Instagram content anonymously. We do not access private accounts or bypass any security measures.</p>
            
            <h2>3. User Responsibilities</h2>
            <p>By using our Service, you agree to use it only for lawful purposes, respect copyright/IP rights, and comply with Instagram's Terms of Service.</p>
            
            <h2>4. Intellectual Property</h2>
            <p>The Service is owned by InstaPSV. Content accessed through our Service belongs to the original creators.</p>
            
            <h2>5. Contact Information</h2>
            <p>For questions about these Terms, please contact us at: <a href="mailto:legal@instapsv.com">legal@instapsv.com</a>.</p>
        `,
        meta_title: "Terms of Service - InstaPSV",
        meta_description: "Read our terms of service and usage guidelines for InstaPSV."
    },
    {
        title: "Contact Us",
        slug: "contact",
        status: "published",
        content: `
            <h2>Get in Touch</h2>
            <p>Have questions, feedback, or partnership inquiries? We'd love to hear from you!</p>
            
            <h3>Support</h3>
            <p>For general support, bug reports, or feature requests, please email us at:</p>
            <p><strong><a href="mailto:support@instapsv.com">support@instapsv.com</a></strong></p>
            
            <h3>Legal</h3>
            <p>For legal inquiries, DMCA notices, or privacy concerns:</p>
            <p><strong><a href="mailto:legal@instapsv.com">legal@instapsv.com</a></strong></p>
            
            <h3>Social Media</h3>
            <p>Follow us for updates and tips:</p>
            <ul>
                <li>Twitter: <a href="https://twitter.com/instapsv">@InstaPSV</a></li>
                <li>Instagram: <a href="https://instagram.com/instapsv">@InstaPSV</a></li>
            </ul>
        `,
        meta_title: "Contact Us - InstaPSV",
        meta_description: "Contact the InstaPSV team for support, feedback, or inquiries."
    },
    {
        title: "Disclaimer",
        slug: "disclaimer",
        status: "published",
        content: `
            <h2>Disclaimer</h2>
            <p>The information provided on InstaPSV is for general informational purposes only. All information on the site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.</p>
            <p>Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the site or reliance on any information provided on the site. Your use of the site and your reliance on any information on the site is solely at your own risk.</p>
        `,
        meta_title: "Disclaimer - InstaPSV",
        meta_description: "Read our disclaimer regarding the use of InstaPSV and the information provided on our website."
    }
];

export async function GET(req: NextRequest) {
    try {
        // 1. Get a valid user ID to use as author_id
        const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();

        if (userError || !users || users.length === 0) {
            return NextResponse.json({ error: 'No users found to assign as author. Please sign up or check database.' }, { status: 500 });
        }

        const authorId = users[0].id;

        // 2. Insert Posts
        const postsToInsert = dummyPosts.map(({ categories, ...p }) => ({
            ...p,
            author_id: authorId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            published_at: p.status === 'published' ? new Date().toISOString() : null
        }));

        const { error: postError } = await supabase.from('posts').upsert(
            postsToInsert,
            { onConflict: 'slug' }
        );

        if (postError) {
            console.error('Seeding Posts Error:', postError);
            throw postError;
        }

        // 3. Insert Pages
        const pagesToInsert = dummyPages.map(p => ({
            ...p,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }));

        const { error: pageError } = await supabase.from('pages').upsert(
            pagesToInsert,
            { onConflict: 'slug' }
        );

        if (pageError) {
            console.error('Seeding Pages Error:', pageError);
            throw pageError;
        }

        return NextResponse.json({
            success: true,
            message: 'Seeded posts and pages successfully',
            authorUsed: authorId
        });

    } catch (error: any) {
        return NextResponse.json({
            error: error.message || error,
            details: error
        }, { status: 500 });
    }
}
